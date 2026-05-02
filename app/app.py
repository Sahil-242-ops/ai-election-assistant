from flask import Flask, request, jsonify, render_template
import os
from google import genai
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
app = Flask(__name__,
            template_folder=os.path.join(base_dir, 'html'),
            static_folder=base_dir,
            static_url_path='/')

# API key (optional)
api_key = os.getenv("API_KEY")

if api_key:
    client = genai.Client(api_key=api_key)
else:
    client = None


# =========================
# 🔹 FRONTEND (UI)
# =========================
@app.route("/")
def home():
    return render_template("index.html")


# =========================
# 🔹 BACKEND LOGIC
# =========================
@app.route("/ask", methods=["POST"])
def ask():
    user = request.json.get("question", "").lower()
    words = user.split()

    # Basic definitions & concepts
    if "democracy" in user:
        return jsonify({"answer": "Democracy is a system of government where power is held by the citizens, who exercise it directly or through elected representatives."})
    elif "what is an election" in user or ("election" in user and "what" in user):
        return jsonify({"answer": "An election is a formal and organized process where citizens choose their representatives or leaders by casting votes."})
    elif "why vote" in user or "importance of voting" in user:
        return jsonify({"answer": "Voting is a fundamental right and civic duty. It gives you a voice in choosing leaders, shaping policies, and deciding the future direction of your community and country."})

    # Election bodies and management
    elif "election commission" in user or "commission" in user or "eci" in words:
        return jsonify({"answer": "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering election processes in India at the national, state, and district levels."})
    elif "chief election commissioner" in user or "cec" in words:
        return jsonify({"answer": "The Chief Election Commissioner heads the Election Commission. They ensure elections are conducted freely and fairly."})
    elif "returning officer" in user or "ro" in words:
        return jsonify({"answer": "A Returning Officer is responsible for overseeing the election in a specific constituency and declaring the results."})

    # Eligibility & Registration
    elif "who can vote" in user or "eligibility" in user:
        return jsonify({"answer": "Generally, any citizen who is 18 years of age or older on the qualifying date (usually Jan 1st of the year) and is registered in the electoral roll can vote."})
    elif "18" in words or "age" in words:
        return jsonify({"answer": "You must be 18 years or older to register and vote."})
    elif "register" in user or "enroll" in user or "new voter" in user:
        return jsonify({"answer": "To register: Visit the Voter Portal (like NVSP), fill out Form 6, upload proof of age and address, and submit. You can also do this via the Voter Helpline App."})
    elif "voter id" in user or "epic" in words:
        return jsonify({"answer": "The Voter ID, also known as EPIC (Electors Photo Identity Card), is issued to registered voters. It serves as proof of identity and address during voting."})
    elif "documents needed" in user or "proof" in user:
        return jsonify({"answer": "To register, you typically need a passport-sized photo, proof of age (birth certificate, 10th mark sheet, PAN, Aadhaar), and proof of address (passport, utility bill, Aadhaar)."})
    elif "check name" in user or "electoral roll" in user or "voter list" in user:
        return jsonify({"answer": "You can check your name on the electoral roll by visiting the Election Commission portal, entering your EPIC number, or searching by your personal details."})

    # The Voting Process
    elif "vote" in user and "how" in user:
        return jsonify({"answer": "Voting Process: 1. Ensure you're registered. 2. Go to your designated polling booth. 3. Show your ID. 4. Ink is applied to your finger. 5. Press the button against your chosen candidate on the EVM. 6. Verify with the VVPAT slip."})
    elif "where to vote" in user or "polling booth" in user:
        return jsonify({"answer": "You can find your polling booth on your voter slip, via the Voter Helpline app, or by searching your EPIC number on the Election Commission's website."})
    elif "timing" in user or "time" in user:
        return jsonify({"answer": "Polling usually takes place from 7:00 AM to 6:00 PM, though specific timings can vary slightly by region."})

    # Technology & Security (EVM/VVPAT)
    elif "evm" in words or "evms" in words:
        return jsonify({"answer": "EVM stands for Electronic Voting Machine. It consists of a Control Unit and a Balloting Unit. It makes voting quicker, prevents invalid votes, and speeds up counting."})
    elif "vvpat" in words or "vvpats" in words:
        return jsonify({"answer": "VVPAT stands for Voter Verifiable Paper Audit Trail. It's an independent verification system attached to EVMs that allows voters to verify that their vote was cast correctly."})
    elif "nota" in words:
        return jsonify({"answer": "NOTA stands for 'None of the Above'. It's an option on the EVM that allows a voter to officially reject all candidates running in the election."})
    elif "secure" in user or "hack" in user:
        return jsonify({"answer": "EVMs are standalone machines not connected to the internet, making them highly secure. They undergo rigorous checks (mock polls) in the presence of political representatives before actual use."})

    # Timeline and Stages
    elif "timeline" in user or "process" in user or "stages" in user:
        return jsonify({"answer": "Election Stages: Notification → Filing Nominations → Scrutiny → Campaigning → Polling Day → Counting of Votes → Declaration of Results."})
    elif "nomination" in user:
        return jsonify({"answer": "Nomination is the process where candidates officially declare their intention to run for office by filing papers with the Returning Officer."})
    elif "campaign" in user:
        return jsonify({"answer": "During the campaign, candidates present their policies to voters. Campaigning must stop 48 hours before the end of polling (the 'silence period')."})
    elif "code of conduct" in user or "mcc" in words:
        return jsonify({"answer": "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission for political parties and candidates to ensure fair elections. It kicks in as soon as elections are announced."})

    # Types of Elections
    elif "types of elections" in user:
        return jsonify({"answer": "In India, there are General Elections (Lok Sabha), State Assembly Elections (Vidhan Sabha), and Local Body Elections (Panchayats and Municipalities)."})
    elif "general election" in user or "lok sabha" in user:
        return jsonify({"answer": "General Elections are held every 5 years to elect Members of Parliament (MPs) to the Lok Sabha. The majority party forms the national government."})

    # Fallback to AI
    else:
        if client:
            try:
                # Add context to ensure the AI focuses on election education
                system_prompt = "You are an AI Election Education Assistant. Explain the following concept related to elections, voting, or democracy simply, objectively, and accurately in 2-3 short sentences: "
                response = client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=system_prompt + user
                )
                return jsonify({"answer": response.text})
            except Exception as e:
                return jsonify({"answer": "Error connecting to AI assistant. Please try again later."})
        else:
            return jsonify({"answer": "I don't have a specific answer for that yet, and my AI connection isn't set up. Please ask another election-related question like 'how to register', 'what is an EVM', or 'who can vote'."})


# =========================
# 🔹 QUIZ & LEADERBOARD LOGIC
# =========================
leaderboard_data = []

QUIZ_QUESTIONS = [
    {
        "id": 1,
        "question": "What is the minimum voting age in India?",
        "options": ["16", "18", "21", "25"],
        "answer": "18"
    },
    {
        "id": 2,
        "question": "What does EVM stand for?",
        "options": ["Election Verification Machine", "Electronic Voting Machine", "Electoral Vote Monitor", "Electronic Verification Method"],
        "answer": "Electronic Voting Machine"
    },
    {
        "id": 3,
        "question": "Who conducts the national elections in India?",
        "options": ["Supreme Court", "Parliament", "Election Commission of India", "President"],
        "answer": "Election Commission of India"
    },
    {
        "id": 4,
        "question": "What does NOTA mean on an EVM?",
        "options": ["Number Of Total Abstentions", "None Of The Above", "Not On This Apparatus", "No Official Total Allowed"],
        "answer": "None Of The Above"
    },
    {
        "id": 5,
        "question": "What is VVPAT used for?",
        "options": ["Voter Registration", "Paper Audit Trail for Verification", "Counting Votes Automatically", "Campaign Advertising"],
        "answer": "Paper Audit Trail for Verification"
    }
]

@app.route("/api/questions", methods=["GET"])
def get_questions():
    # Return questions without answers for safety, though frontend handles it
    questions_no_answers = [{"id": q["id"], "question": q["question"], "options": q["options"]} for q in QUIZ_QUESTIONS]
    return jsonify(questions_no_answers)

@app.route("/api/answer", methods=["POST"])
def check_answer():
    data = request.json
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
        data = request.json
        name = data.get("name", "Anonymous").strip()[:20]
        score = data.get("score", 0)
        if name:
            leaderboard_data.append({"name": name, "score": score})
            # Sort by score descending and keep top 10
            leaderboard_data = sorted(leaderboard_data, key=lambda x: x["score"], reverse=True)[:10]
        return jsonify({"success": True})
    
    return jsonify(leaderboard_data)

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


# =========================
@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

# RUN SERVER
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)