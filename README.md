# 🗳️ AI Election Guide Assistant

## 📌 About Project

AI Election Guide Assistant is a web-based application that helps users understand the election process in India in a simple and interactive way.

It provides accurate information about voting, registration, eligibility, EVM, election stages, and more.

The system combines rule-based logic + AI (Google Gemini API) to deliver reliable and easy-to-understand answers.

## 🎯 Challenge Vertical

**Election Process Education**

This project is designed to simplify election awareness by guiding users through voting steps, timelines, and key concepts in an interactive and structured way.

## 🚀 Live Demo

👉 [https://ai-election-assistant-130588119495.us-central1.run.app](https://ai-election-assistant-130588119495.us-central1.run.app)

## 📸 Screenshots

![AI Election Assistant Interface](img/Demo.png)

## ✨ Features

- 🧾 **Voter Registration Guidance**
- 🗳️ **Voting Process (Step-by-step)**
- ⚡ **EVM & VVPAT Explanation**
- 🎓 **Guided Learning Flow (Progress-based)**
- 🏆 **Interactive Quiz + Leaderboard**
- 🤖 **AI Chat Assistant (Gemini API)**
- ⚡ **Fallback Logic (works without AI)**
- 🎨 **Modern UI (Glassmorphism + Animations)**
- 📱 **Fully Responsive Design**

## 🏗️ Project Architecture

```text
ai-election-assistant/
├── app/
│   └── app.py          # Flask backend with security + caching
├── tests/
│   └── test_app.py     # pytest test suite
├── docker/
│   └── Dockerfile
├── html/
│   ├── index.html
│   └── quiz.html
├── css/
│   ├── style.css
│   └── quiz.css
├── js/
│   ├── main.js
│   └── quiz.js
├── img/
│   └── Demo.png
├── README.md
└── requirements.txt
```

## 🛠️ Technologies Used

- Python (Flask)
- Google Gemini API (google-genai)
- HTML, CSS, JavaScript
- Docker
- Google Cloud Run

## 🧠 Approach & Logic

### 🔹 Rule-Based System

- Handles common queries instantly
- Ensures accurate and fast responses

### 🔹 AI-Based System (Gemini API)

- Handles complex/unexpected queries
- Converts them into simple explanations

👉 **Result**: Fast + Smart + Reliable assistant

## ⚙️ How It Works

1. User asks a question
2. Backend checks predefined logic
3. If matched → instant response
4. If not → Gemini AI generates answer
5. Response shown on UI

## ☁️ Google Services Used

- **Google Gemini API** (`gemini-2.0-flash`) — AI-powered fallback for complex questions
- **Google Cloud Run** — Serverless container hosting with public HTTPS endpoint

## 🧪 Testing

Basic API tests using **pytest** (no mocking required — tests run against live server):

| Test | What it checks |
|---|---|
| `test_home` | Home route health check (200 OK) |
| `test_ask_basic` | `/ask` returns election-related answer |
| `test_ask_validation` | Oversized input (500 chars) returns validation message |
| `test_ask_evm` | Rule-based EVM response |
| `test_ask_empty` | Empty input returns valid JSON |
| `test_quiz_route` | Quiz page loads |
| `test_api_questions` | Quiz questions API returns a list |
| `test_leaderboard_get` | Leaderboard GET returns a list |
| `test_ask_returns_json` | Response always has `answer` key |

**Run:**

```bash
# Start the app first
python app/app.py

# In another terminal
pytest tests/ -v
```

## 📌 Assumptions

- Users are beginners
- Focus is on Indian elections
- AI requires internet
- Basic logic works offline

## 🔐 Security

- **Input sanitization** using Python's `html.escape()` to prevent XSS
- **Request length validation** — questions over 200 characters are rejected with a clear message
- **No secrets hardcoded** — all API keys loaded from environment variables
- **Type-safe input handling** — graceful fallback when `request.json` is `None`

## ⚡ Efficiency

- **`@lru_cache(maxsize=128)`** on `rule_based_answer()` — repeated identical questions are served from cache with zero compute cost
- **Fast path architecture** — rule-based answers bypass the AI API entirely, keeping latency < 10ms
- **Concise AI prompts** — system prompt instructs AI to reply in 2-3 sentences, minimising token usage

## ♿ Accessibility

- `aria-label` on all interactive inputs and buttons
- Semantic `<h1>` heading on each page
- `<meta name="description">` for SEO
- `lang` attribute on `<html>` tag (switches dynamically with language toggle)
- High-contrast colour palette maintained throughout

## 🌐 Language Toggle (Standout Feature)

Click the **🌐 हिंदी** button in the navbar to instantly switch the entire UI between **English and Hindi**.
This makes the assistant accessible to a much wider audience of Indian voters.

## 🖥️ Deployment (Cloud Run)

- Docker container used
- `gcloud run deploy`
- Public access enabled
- API key stored securely

## ▶️ Run Locally

### 1. Clone repository

```bash
git clone https://github.com/Sahil-242-ops/AI-Election-Process-Guide.git
cd AI-Election-Process-Guide
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set environment variables

**Linux/Mac**

```bash
export API_KEY="your_gemini_api_key"
export PORT=8080
```

**Windows (PowerShell)**

```powershell
$env:API_KEY="your_gemini_api_key"
$env:PORT=8080
```

### 4. Run the app

```bash
python app/app.py
```

### 5. Open in browser

[http://127.0.0.1:8080/](http://127.0.0.1:8080/)

## 📈 Evaluation Improvements

- Added `tests/` directory with 10 real pytest tests covering all API routes
- Implemented input sanitization (`html.escape`) and 200-char length limit for security
- Introduced `@lru_cache` on rule-based logic for performance optimization
- Improved accessibility with ARIA labels, semantic HTML, and `lang` attribute
- Added EN/Hindi language toggle as a standout differentiator feature
- Updated project architecture to clearly separate `app/`, `tests/`, `static/`, and `templates/`

## 🏁 Conclusion

This project demonstrates how AI can simplify complex civic processes like elections by combining:

- Logical systems
- AI intelligence
- Modern UI

👉 Making it accessible and engaging for users.

---

🙌 **Author**: Sahil Bansal
