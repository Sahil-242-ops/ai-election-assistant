from flask import Flask, request, jsonify, render_template
import os
import html
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Import modular components
try:
    from app.service import process_query
    from app.data import QUIZ_QUESTIONS, leaderboard_data
except (ImportError, ModuleNotFoundError):
    from service import process_query
    from data import QUIZ_QUESTIONS, leaderboard_data

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app = Flask(__name__,
            template_folder=os.path.join(base_dir, 'html'),
            static_folder=base_dir,
            static_url_path='/')

# 🛡️ Rate Limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

# =========================
# 🛡️ SECURITY HEADERS (Step 4)
# =========================
@app.after_request
def add_headers(response):
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response

# =========================
# 🔹 ERROR HANDLING (Step 2)
# =========================
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Not Found"}), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal Server Error"}), 500

# =========================
# 🔹 FRONTEND (UI)
# =========================
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

# =========================
# 🔹 BACKEND API
# =========================

@app.route("/ask", methods=["POST"])
@limiter.limit("10 per minute")
def ask():
    # 🔐 Security: sanitize and validate input
    data = request.json or {}
    raw = data.get("question", "")
    sanitized = html.escape(str(raw).strip())

    # 🔐 Security: Enforce input length limit
    if not sanitized or len(sanitized) > 200:
        return jsonify({"answer": "Invalid input. Please keep your question between 1 and 200 characters."})

    # 🚀 Use service layer
    answer = process_query(sanitized)
    return jsonify({"answer": answer})


@app.route("/api/translate", methods=["POST"])
@limiter.limit("20 per minute")
def translate():
    """🌐 Google Gemini-powered translation endpoint."""
    data = request.json or {}
    text = html.escape(str(data.get("text", "")).strip())
    target_lang = data.get("lang", "hi")

    if not text or len(text) > 500:
        return jsonify({"translated": text})

    lang_names = {"hi": "Hindi", "ta": "Tamil", "bn": "Bengali", "te": "Telugu"}
    lang_name = lang_names.get(target_lang, "Hindi")

    try:
        from app.ai_logic import ai_engine
    except ImportError:
        from ai_logic import ai_engine

    if not ai_engine.client:
        return jsonify({"translated": text})

    try:
        prompt = f"Translate the following election-related text to {lang_name}. Return ONLY the translated text, nothing else:\n\n{text}"
        response = ai_engine.client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return jsonify({"translated": response.text.strip()})
    except Exception:
        return jsonify({"translated": text})


@app.route("/api/questions", methods=["GET"])
def get_questions():
    safe_q = [{"id": q["id"], "question": q["question"], "options": q["options"]} for q in QUIZ_QUESTIONS]
    return jsonify(safe_q)

@app.route("/api/answer", methods=["POST"])
def check_answer():
    data = request.json or {}
    q_id = data.get("id")
    user_answer = data.get("answer")
    correct = False
    for q in QUIZ_QUESTIONS:
        if q["id"] == q_id:
            correct = (q["answer"] == user_answer)
            break
    return jsonify({"correct": correct})

@app.route("/api/leaderboard", methods=["GET", "POST"])
def manage_leaderboard():
    global leaderboard_data
    try:
        from app.firebase_db import add_score, get_leaderboard
    except ImportError:
        from firebase_db import add_score, get_leaderboard

    if request.method == "POST":
        data = request.json or {}
        name = data.get("name", "Anonymous").strip()[:20]
        score = data.get("score", 0)
        
        if name:
            # Try Firebase first
            add_score(name, score)
            
            # Local fallback (for in-memory tracking if Firebase fails)
            leaderboard_data.append({"name": name, "score": score})
            leaderboard_data.sort(key=lambda x: x["score"], reverse=True)
            leaderboard_data = leaderboard_data[:10]
            
        return jsonify({"success": True})
    
    # Try getting from Firebase
    fb_leaderboard = get_leaderboard()
    if fb_leaderboard is not None:
        return jsonify(fb_leaderboard)
        
    return jsonify(leaderboard_data)

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)