let questions = [];
let currentQIndex = 0;
let score = 0;

async function startQuiz() {
    document.getElementById('start-section').classList.add('hidden');
    document.getElementById('quiz-section').classList.remove('hidden');
    
    try {
        let res = await fetch('/api/questions');
        questions = await res.json();
        score = 0;
        currentQIndex = 0;
        loadQuestion();
    } catch (e) {
        document.getElementById('question-text').innerText = "Error loading questions. Please try again later.";
    }
}

function loadQuestion() {
    let q = questions[currentQIndex];
    document.getElementById('question-text').innerText = `Q${currentQIndex + 1}: ${q.question}`;
    
    let optionsHtml = '';
    q.options.forEach((opt, idx) => {
        optionsHtml += `<button class="option-btn" onclick="selectOption('${opt.replace(/'/g, "\\'")}', this)">${opt}</button>`;
    });
    document.getElementById('options-container').innerHTML = optionsHtml;
    document.getElementById('feedback').innerText = '';
    document.getElementById('next-btn').classList.add('hidden');
}

async function selectOption(selectedAnswer, btnElement) {
    let buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => b.disabled = true);
    
    let qId = questions[currentQIndex].id;
    
    try {
        let res = await fetch('/api/answer', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: qId, answer: selectedAnswer})
        });
        let result = await res.json();
        
        if (result.correct) {
            btnElement.classList.add('correct');
            document.getElementById('feedback').innerText = '✅ Correct!';
            document.getElementById('feedback').style.color = '#10b981';
            score += 10;
        } else {
            btnElement.classList.add('wrong');
            document.getElementById('feedback').innerText = '❌ Incorrect!';
            document.getElementById('feedback').style.color = '#ef4444';
        }
        
        document.getElementById('next-btn').classList.remove('hidden');
    } catch (e) {
        console.error("Error verifying answer");
        document.getElementById('next-btn').classList.remove('hidden');
    }
}

function nextQuestion() {
    currentQIndex++;
    if (currentQIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    document.getElementById('final-score').innerText = score;
}

async function submitScore() {
    let name = document.getElementById('player-name').value.trim();
    if (!name) name = "Anonymous";
    
    try {
        await fetch('/api/leaderboard', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: name, score: score})
        });
        showLeaderboard();
    } catch (e) {
        alert("Error submitting score");
    }
}

async function showLeaderboard() {
    document.getElementById('start-section').classList.add('hidden');
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('leaderboard-section').classList.remove('hidden');
    
    try {
        let res = await fetch('/api/leaderboard');
        let data = await res.json();
        
        let tbody = document.getElementById('leaderboard-body');
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">No scores yet. Be the first!</td></tr>';
            return;
        }
        
        let html = '';
        data.forEach((entry, idx) => {
            let rankIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`;
            html += `
                <tr>
                    <td>${rankIcon}</td>
                    <td>${entry.name}</td>
                    <td style="text-align: right;">${entry.score}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (e) {
        console.error("Error loading leaderboard");
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark ? '1' : '0');
    const btn = document.getElementById('dark-mode-btn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === '1') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('dark-mode-btn');
        if (btn) btn.textContent = '☀️';
    }
});