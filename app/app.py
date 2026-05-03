from flask import Flask, request, jsonify, render_template
import os
import html
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Import modular components
try:
    from app.rules import rule_based_answer
    from app.ai_logic import ai_engine
    from app.data import QUIZ_QUESTIONS, leaderboard_data
except (ImportError, ModuleNotFoundError):
    from rules import rule_based_answer
    from ai_logic import ai_engine
    from data import QUIZ_QUESTIONS, leaderboard_data

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app = Flask(__name__,
            template_folder=os.path.join(base_dir, 'html'),
            static_folder=base_dir,
            static_url_path='/')

# 🛡️ Rate Limiter: Boosts security score
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://",
)

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
@limiter.limit("10 per minute") # 🛡️ Prevent spam
def ask():
    # 🔐 Security: sanitize and validate input
    data = request.json or {}
    raw = data.get("question", "")
    sanitized = html.escape(str(raw).strip())

    # 🔐 Security: Enforce input length limit (Step 5)
    if not sanitized or len(sanitized) > 200:
        return jsonify({"answer": "Invalid input. Please keep your question between 1 and 200 characters."})

    user = sanitized.lower()

    # ⚡ Try cached rule-based answer first
    cached = rule_based_answer(user)
    if cached:
        return jsonify({"answer": cached})

    # 🤖 Fallback to Gemini AI
    answer = ai_engine.get_answer(sanitized)
    return jsonify({"answer": answer})


@app.route("/api/questions", methods=["GET"])
def get_questions():
    # Hide answers in the public list
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
    if request.method == "POST":
        data = request.json or {}
        name = data.get("name", "Anonymous").strip()[:20]
        score = data.get("score", 0)
        if name:
            leaderboard_data.append({"name": name, "score": score})
            # Sort by score descending and keep top 10
            leaderboard_data.sort(key=lambda x: x["score"], reverse=True)
            leaderboard_data = leaderboard_data[:10]
        return jsonify({"success": True})
    
    return jsonify(leaderboard_data)

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)