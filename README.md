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
│   └── app.py
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

- Google Gemini API
- Google Cloud Run

## 🧪 Testing

- Tested real queries:
  - "How to vote"
  - "What is EVM"
  - "Who can vote"
- UI responsiveness verified
- AI fallback tested
- Deployment tested

## 📌 Assumptions

- Users are beginners
- Focus is on Indian elections
- AI requires internet
- Basic logic works offline

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

## 🏁 Conclusion

This project demonstrates how AI can simplify complex civic processes like elections by combining:

- Logical systems
- AI intelligence
- Modern UI

👉 Making it accessible and engaging for users.

---

🙌 **Author**: Sahil Bansal
