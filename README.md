# 🗳️ AI Election Process Guide

## 📌 About Project

AI Election Process Guide is a **full-stack AI-powered web application** designed to simplify and explain the election process in India in an interactive, visual, and user-friendly way.

The platform combines **rule-based logic + Google Gemini AI** to provide accurate, fast, and easy-to-understand guidance for voters.

---

## 🎯 Challenge Vertical

**Election Process Education**

This project helps users understand the complete election journey — from registration to voting — using interactive tools, AI, and real-world scenarios.

---

## 🚀 Live Demo

👉 https://ai-election-assistant-130588119495.us-central1.run.app

---

## 📸 Demo

![AI Election Assistant](img/Demo.png)

---

## ✨ Key Features

### 🤖 AI Assistant
- Gemini-powered chatbot for election-related queries  
- Handles real-world and informal questions  
- Hybrid system → rule-based + AI fallback  

---

### 📊 Voter Readiness Score
- Checklist-based system to track election preparedness  
- Helps users ensure they are ready before voting day  

---

### 🎓 Guided Learning Modules
- Step-by-step election education  
- Progress tracking system  
- Beginner-friendly explanations  

---

### 🗳️ Interactive Timeline
- Visual representation of election stages  
- Covers full journey from registration to results  

---

### ⚙️ EVM Demo
- Explains how Electronic Voting Machines work  
- Improves transparency and understanding  

---

### 🎭 Scenario Simulator
- Real-world voter situations like:
  - Lost Voter ID  
  - Name missing from voter list  
  - Voting from another location  
- Provides practical solutions  

---

### 🗺️ Interactive Map
- Explore India election data by state  
- View voter stats and regions  
- Helps users understand election geography  

---

### 🏆 Quiz + Leaderboard
- Test election knowledge  
- Score tracking system  
- Global leaderboard  

---

### 🌐 Responsive UI
- Mobile-friendly design  
- Smooth animations  
- Modern UI (glassmorphism + tricolor theme 🇮🇳)

---

## 🧠 Approach & Logic

### 🔹 Rule-Based System
- Handles common queries instantly  
- Ensures accuracy for critical information  

### 🔹 AI System (Gemini API)
- Handles complex/unexpected queries  
- Generates simplified explanations  

👉 Result:
- Fast responses ⚡  
- Reliable information ✅  
- Smart assistance 🤖  

---

## ⚙️ How It Works

1. User asks a question  
2. System checks predefined rules  
3. If matched → instant response  
4. Else → sent to Gemini AI  
5. AI generates response  
6. UI displays formatted answer  

---

## ☁️ Google Services Used

- **Google Gemini API** → AI responses  
- **Google Cloud Run** → Deployment  

---

## 🧪 Testing

- 45+ test cases  
- API testing + unit testing  
- Edge case validation  
- High coverage (~95%+)  

---

## 🔐 Security

- Rate limiting (anti-spam protection)  
- Input validation  
- Secure headers (XSS, clickjacking protection)  
- Controlled API usage  

---

## 📌 Assumptions

- Users are first-time or beginner voters  
- Focus on Indian election system 🇮🇳  
- Internet required for AI features  
- Core features work without AI fallback  

---

## 🏗️ Project Structure
```text
ai-election-assistant/
├── app/
│ ├── app.py # Main Flask App
│ ├── rules.py # Rule Engine
│ ├── ai_logic.py # Gemini Integration
│ ├── data.py # Quiz Data
│ └── service.py # Business Logic Layer
│
├── html/ # Frontend Pages
│ ├── index.html
│ ├── quiz.html
│ └── leaderboard.html
│
├── css/
│ ├── style.css
│ └── quiz.css
│
├── js/
│ ├── main.js
│ └── quiz.js
│
├── img/
│ └── Demo.png
│
├── tests/
│ ├── test_app.py
│ ├── test_unit.py
│ └── conftest.py
│
├── docker/
│ └── Dockerfile
│
├── requirements.txt
└── README.md
```

---

## 🛠️ Technologies Used

- Python (Flask)  
- Google Gemini API (`google-genai`)  
- HTML, CSS, JavaScript  
- Docker  
- Google Cloud Run  

---

## 🖥️ Deployment

- Containerized using Docker  
- Deployed using `gcloud run deploy`  
- Public access enabled  
- API key secured via environment variables  

---

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

🏁 Conclusion

This project demonstrates how AI can transform civic education by making election processes:

Simple
Interactive
Accessible

It combines AI + system design + real-world usability to deliver a practical solution for voter awareness.

🙌 Author

Sahil
