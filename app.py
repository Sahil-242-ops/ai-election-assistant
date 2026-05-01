from flask import Flask, request, jsonify
import os
from google import genai

app = Flask(__name__)

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
    return """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Election Guide Assistant</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        :root {
            --primary: #4F46E5;
            --primary-hover: #4338CA;
            --bg-gradient-start: #0f172a;
            --bg-gradient-end: #1e1b4b;
            --card-bg: rgba(255, 255, 255, 0.05);
            --card-border: rgba(255, 255, 255, 0.1);
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-end));
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow-x: hidden;
            padding: 2rem;
        }

        .background-blobs {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
        }

        .blob {
            position: absolute;
            border-radius: 50%;
            filter: blur(80px);
            opacity: 0.5;
            animation: float 10s infinite ease-in-out alternate;
        }

        .blob-1 { top: -10%; left: -10%; width: 500px; height: 500px; background: #4f46e5; animation-delay: 0s; }
        .blob-2 { bottom: -10%; right: -10%; width: 400px; height: 400px; background: #9333ea; animation-delay: -5s; }

        @keyframes float {
            0% { transform: translateY(0) scale(1); }
            100% { transform: translateY(20px) scale(1.1); }
        }

        .container {
            max-width: 800px;
            width: 100%;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3.5rem;
            font-weight: 600;
            background: linear-gradient(to right, #a5b4fc, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            letter-spacing: -0.02em;
        }

        .header p {
            font-size: 1.1rem;
            color: var(--text-muted);
            font-weight: 300;
        }

        .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            width: 100%;
        }

        .feature-tag {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            padding: 0.6rem 1.2rem;
            border-radius: 999px;
            font-size: 0.9rem;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            cursor: default;
        }

        .feature-tag:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .chat-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 2rem;
            width: 100%;
            backdrop-filter: blur(16px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-group {
            position: relative;
            display: flex;
            gap: 1rem;
        }

        input {
            flex: 1;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 1.2rem 1.5rem;
            color: var(--text-main);
            font-size: 1.05rem;
            font-family: inherit;
            outline: none;
            transition: all 0.3s ease;
        }

        input:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        input::placeholder {
            color: #64748b;
        }

        button {
            background: linear-gradient(135deg, var(--primary), #7c3aed);
            color: white;
            border: none;
            border-radius: 16px;
            padding: 0 2rem;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px -10px var(--primary);
        }

        button:active {
            transform: translateY(0);
        }

        .response-container {
            display: none;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 16px;
            padding: 1.5rem;
            min-height: 100px;
            border: 1px solid var(--card-border);
            animation: fadeIn 0.5s ease;
            line-height: 1.6;
            color: #e2e8f0;
            overflow-x: auto;
            text-align: left;
        }

        .response-container h1, .response-container h2, .response-container h3 {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
            color: #fff;
        }
        
        .response-container p {
            margin-bottom: 1rem;
        }

        .response-container ul, .response-container ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
        }

        .response-container code {
            background: rgba(0, 0, 0, 0.3);
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .loader-container {
            display: none;
            justify-content: center;
            align-items: center;
            padding: 2rem 0;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .footer {
            margin-top: 4rem;
            color: var(--text-muted);
            font-size: 0.9rem;
            text-align: center;
        }

        .timeline-container {
            margin-top: 4rem;
            width: 100%;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 2.5rem;
            backdrop-filter: blur(16px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        }

        .timeline-container h2 {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #a5b4fc, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .timeline-step {
            display: flex;
            gap: 1.5rem;
            margin-bottom: 2rem;
            position: relative;
        }

        .timeline-step:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 40px;
            left: 20px;
            width: 2px;
            height: calc(100% - 20px);
            background: rgba(255, 255, 255, 0.1);
        }

        .step-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary), #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.2rem;
            color: white;
            flex-shrink: 0;
            z-index: 2;
            box-shadow: 0 0 15px rgba(79, 70, 229, 0.5);
        }

        .step-content {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid var(--card-border);
            flex: 1;
            transition: transform 0.3s ease, background 0.3s ease;
        }

        .step-content:hover {
            transform: translateX(10px);
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .step-content h3 {
            margin-bottom: 0.5rem;
            color: #e2e8f0;
            font-size: 1.2rem;
        }

        .step-content p {
            color: var(--text-muted);
            line-height: 1.5;
            font-size: 0.95rem;
        }

        @media (max-width: 600px) {
            .input-group {
                flex-direction: column;
            }
            button {
                padding: 1.2rem;
            }
            .header h1 {
                font-size: 2.2rem;
            }
            .timeline-container {
                padding: 1.5rem;
            }
            .timeline-step {
                flex-direction: column;
                gap: 1rem;
            }
            .timeline-step:not(:last-child)::after {
                display: none;
            }
        }
    </style>
</head>
<body>

    <div class="background-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
    </div>

    <div class="container">
        <div class="header">
            <h1>AI Election Assistant</h1>
            <p>Your intelligent, unbiased guide to navigating the election process.</p>
        </div>

        <div class="features">
            <div class="feature-tag">🧾 Registration</div>
            <div class="feature-tag">🗳️ Voting Steps</div>
            <div class="feature-tag">⚡ EVM Info</div>
            <div class="feature-tag">✅ Eligibility</div>
            <div class="feature-tag">📊 Process Timeline</div>
        </div>

        <div class="chat-card">
            <div class="input-group">
                <input type="text" id="question" placeholder="Ask about voting, EVMs, eligibility..." onkeypress="handleKeyPress(event)" />
                <button onclick="ask()" id="ask-btn">
                    <span>Ask AI</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>

            <div class="loader-container" id="loader">
                <div class="spinner"></div>
            </div>

            <div class="response-container" id="response-container">
                <div id="response"></div>
            </div>
        </div>

        <div class="timeline-container">
            <h2>The Election Journey</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; text-align: center;">Follow the steps from announcement to results.</p>
            
            <div class="timeline-step">
                <div class="step-icon">1</div>
                <div class="step-content">
                    <h3>Notification & Registration</h3>
                    <p>The Election Commission announces the dates. Citizens ensure their names are on the voter list (Electoral Roll).</p>
                </div>
            </div>

            <div class="timeline-step">
                <div class="step-icon">2</div>
                <div class="step-content">
                    <h3>Filing Nominations</h3>
                    <p>Candidates representing political parties or independents file their papers to run for office.</p>
                </div>
            </div>

            <div class="timeline-step">
                <div class="step-icon">3</div>
                <div class="step-content">
                    <h3>Campaigning</h3>
                    <p>Candidates present their manifestos and rally for support. The Model Code of Conduct is in effect.</p>
                </div>
            </div>

            <div class="timeline-step">
                <div class="step-icon">4</div>
                <div class="step-content">
                    <h3>Polling Day</h3>
                    <p>Citizens go to their designated booths, show their Voter ID, and cast their vote securely using EVMs.</p>
                </div>
            </div>

            <div class="timeline-step">
                <div class="step-icon">5</div>
                <div class="step-content">
                    <h3>Counting & Results</h3>
                    <p>EVMs are unsealed under strict security. Votes are counted, and the candidate with the most votes wins!</p>
                </div>
            </div>
        </div>

        <div class="footer">
            Built by Sahil • Powered by Gemini AI
        </div>
    </div>

    <script>
        function handleKeyPress(e) {
            if (e.key === 'Enter') {
                ask();
            }
        }

        async function ask() {
            let qInput = document.getElementById("question");
            let q = qInput.value.trim();
            if (!q) return;

            let loader = document.getElementById("loader");
            let resContainer = document.getElementById("response-container");
            let resBox = document.getElementById("response");
            let askBtn = document.getElementById("ask-btn");

            // UI State: Loading
            resContainer.style.display = "none";
            loader.style.display = "flex";
            askBtn.style.opacity = "0.7";
            askBtn.style.pointerEvents = "none";

            try {
                let res = await fetch("/ask", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({question: q})
                });

                let data = await res.json();

                // Format markdown response
                if (window.marked) {
                    resBox.innerHTML = marked.parse(data.answer);
                } else {
                    resBox.innerText = data.answer;
                }
                
                // UI State: Done
                loader.style.display = "none";
                resContainer.style.display = "block";
                
            } catch (error) {
                loader.style.display = "none";
                resContainer.style.display = "block";
                resBox.innerHTML = "<p style='color: #ef4444;'>An error occurred while connecting to the assistant.</p>";
            } finally {
                askBtn.style.opacity = "1";
                askBtn.style.pointerEvents = "auto";
            }
        }
    </script>
</body>
</html>"""


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
# RUN SERVER
# =========================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)