# 🗳️ AI Election Process Guide

🚀 An AI-powered assistant that simplifies the entire election journey for Indian citizens — from registration to results.

## 📌 Overview

AI Election Process Guide is a full-stack web application designed to make election awareness simple, interactive, and accessible.

It combines rule-based logic + Google Gemini AI to provide:
- Instant answers for common queries
- Intelligent explanations for complex questions
- A guided learning experience for first-time voters

## 🎯 Challenge Vertical

**Election Process Education**

This project focuses on improving civic awareness by helping users:
- Understand how elections work
- Learn voting procedures step-by-step
- Interact with an AI assistant for real-time guidance

## 🚀 Live Demo

👉 [https://ai-election-assistant-130588119495.us-central1.run.app](https://ai-election-assistant-130588119495.us-central1.run.app)

## ✨ Key Features

### 🧠 AI-Powered Assistant
- Answers real-world election questions
- Handles informal queries
- Uses Google Gemini API

### 📚 Guided Learning Flow
- Step-by-step modules
- Progress tracking
- Beginner-friendly explanations

### 🗳️ Election Knowledge System
- Voting process breakdown
- EVM & VVPAT explanation
- Election timeline & stages

### 🏆 Gamified Quiz + Leaderboard
- Interactive quiz system
- Score tracking
- Competitive leaderboard

### ⚡ Hybrid Intelligence System
- **Rule-based** → instant accurate responses
- **AI fallback** → handles complex queries

## 🏗️ Architecture

```text
ai-election-assistant/
├── app/
│   ├── app.py        # Entry point (Flask server)
│   ├── service.py    # Request processing layer
│   ├── rules.py      # Rule-based engine
│   ├── ai_logic.py   # Gemini AI integration
│   └── data.py       # Quiz data & constants
├── tests/            # Unit & API tests
├── html/             # UI templates
├── css/              # Styling
├── js/               # Client-side logic
├── docker/           # Deployment config
├── img/              # Assets
├── requirements.txt
└── README.md
```

## 🧠 Approach & Logic

### 🔹 Rule-Based Engine
Handles common queries like "How to vote", "Who can vote", "What is EVM". Ensures fast and reliable responses.

### 🔹 AI Engine (Gemini API)
Handles unknown or complex queries. Generates simple and contextual explanations.

### 🔹 Service Layer (Core Logic)
Acts as a decision engine, choosing between rule-based responses and AI-generated ones.

## ⚙️ How It Works
1. User submits a query.
2. Backend checks rule-based conditions.
3. If matched → instant response.
4. Else → Gemini AI generates answer.
5. Response is displayed in UI.

## 🛡️ Security
- **Input validation**: Prevents invalid queries and enforces 200-character limits.
- **Rate limiting**: 10 requests per minute to prevent abuse.
- **Secure HTTP headers**:
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `X-XSS-Protection`
- **No sensitive data exposed**.

## ⚡ Efficiency
- Rule-based logic reduces API calls.
- Lightweight Flask backend.
- AI used only when necessary.
- Fast response times.

## 🧪 Testing
Unit tests + API tests covering valid inputs, edge cases, invalid inputs, and unknown queries.

**Run tests:**
```bash
pytest
```

## ☁️ Google Services Used
- **Google Gemini API** → AI-powered responses
- **Google Cloud Run** → Deployment

## ♿ Accessibility
- Simple and beginner-friendly language.
- Responsive design (mobile + desktop).
- Clean UI with clear navigation.
- Designed for first-time voters.

## 📈 Scalability
- Modular backend architecture.
- Service-based logic separation.
- Easily extendable with databases (Firebase/MongoDB), authentication, or multi-language support.

## ▶️ Run Locally

1. **Clone repository**
   ```bash
   git clone https://github.com/Sahil-242-ops/AI-Election-Process-Guide.git
   cd AI-Election-Process-Guide
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**
   ```bash
   export API_KEY="your_gemini_api_key"
   export PORT=8080
   ```

4. **Run the app**
   ```bash
   python app/app.py
   ```

## 🖥️ Deployment
- Dockerized application.
- Deployed on Google Cloud Run.
- Public access enabled.
- Environment variables securely managed.

## 🏁 Conclusion

This project demonstrates how AI can improve civic awareness, simplify complex systems, and deliver real-world impact. By combining AI + logic + clean architecture, the system provides a scalable solution for election education.

## 🙌 Author

**Sahil**
