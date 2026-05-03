// Auth Logic
        function checkAuth() {
            let userRaw = localStorage.getItem('electionUser');
            if (userRaw) {
                let user = JSON.parse(userRaw);
                document.getElementById('login-btn').style.display = 'none';
                document.getElementById('user-profile').style.display = 'flex';
                document.getElementById('user-name-display').innerText = user.name;
                
                // Update tooltip info
                const tooltip = document.getElementById('user-detail-info');
                if (tooltip) {
                    tooltip.innerHTML = `
                        <div style="font-weight:700;color:white;margin-bottom:4px">${user.name}</div>
                        ${user.email ? `<div style="margin-bottom:8px">${user.email}</div>` : ''}
                        <div style="display:flex;justify-content:space-between">
                            <span>Age: ${user.age || 'Not set'}</span>
                            <span>State: ${user.state || 'Not set'}</span>
                        </div>
                    `;
                }
            } else {
                document.getElementById('login-btn').style.display = 'flex';
                document.getElementById('user-profile').style.display = 'none';
            }
        }

        function showUserDetail(show) {
            const tooltip = document.getElementById('user-detail-tooltip');
            if (tooltip) tooltip.style.display = show ? 'block' : 'none';
        }

        function openModal() { 
            document.getElementById('auth-step-login').style.display = 'block';
            document.getElementById('auth-step-profile').style.display = 'none';
            document.getElementById('auth-modal').classList.add('active'); 
        }
        function closeModal() { document.getElementById('auth-modal').classList.remove('active'); }

        function login() {
            let name = document.getElementById('auth-name').value.trim();
            if (!name) return alert("Please enter your name.");
            
            let user = { name: name, method: 'local' };
            localStorage.setItem('electionUser', JSON.stringify(user));
            
            // Show profile step
            document.getElementById('auth-step-login').style.display = 'none';
            document.getElementById('auth-step-profile').style.display = 'block';
        }

        function googleLogin() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then((result) => {
                const user = result.user;
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    photo: user.photoURL,
                    method: 'google'
                };
                localStorage.setItem('electionUser', JSON.stringify(userData));
                
                // Show profile step
                document.getElementById('auth-step-login').style.display = 'none';
                document.getElementById('auth-step-profile').style.display = 'block';
            }).catch(err => {
                console.error("Google Login Error:", err);
                alert("Login failed. Please try again.");
            });
        }

        function saveProfile() {
            let userRaw = localStorage.getItem('electionUser');
            if (!userRaw) return closeModal();
            
            let user = JSON.parse(userRaw);
            user.age = document.getElementById('auth-age').value;
            user.state = document.getElementById('auth-state').value;
            
            localStorage.setItem('electionUser', JSON.stringify(user));
            alert("Profile setup complete!");
            closeModal();
            checkAuth();
        }

        function logout() {
            auth.signOut();
            localStorage.removeItem('electionUser');
            checkAuth();
        }

        // Section Logic
        function switchSection(sectionId, event) {
            document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            const target = document.getElementById('section-' + sectionId);
            if (target) target.classList.add('active');
            if (event) { event.currentTarget.classList.add('active'); }
            
            // Feature specific inits
            if (sectionId === 'map' && !window._eciMapInited) {
                window._eciMapInited = true;
                setTimeout(initECIMap, 150);
            }
            if (sectionId === 'charts') {
                setTimeout(loadElectionCharts, 200);
            }
        }

        // Module Logic
        const modules = [
            { title: "1. Eligibility & Voter Registration", content: "Before you can vote, you must be registered. This ensures that only eligible citizens participate in the election. In most democracies, you need to provide proof of identity, age (usually 18+), and residency. Electoral rolls are frequently updated, and you can usually register online or at designated local offices.", icon: "📄" },
            { title: "2. Finding Your Polling Station", content: "Your polling station is assigned based on your registered address. You will be assigned to a specific booth within your constituency. You can easily find this information on the official election commission website using your EPIC number.", icon: "📍" },
            { title: "3. What to Bring to Vote", content: "On election day, you must bring a valid photo identification card. Your Voter ID (EPIC) is best, but other approved IDs like an Aadhaar card, Passport, or Driving License are typically accepted.", icon: "🪪" },
            { title: "4. The Voting Process", content: "Inside the polling station, officials will verify your identity against the electoral roll. They will then ink your finger to prevent double voting. You will proceed to a private voting compartment to cast your vote securely.", icon: "🗳️" },
            { title: "5. EVMs and VVPAT", content: "You cast your vote by pressing the blue button next to your chosen candidate on the Electronic Voting Machine (EVM). The VVPAT machine will then print a slip visible through a window for 7 seconds, allowing you to verify your vote was recorded correctly.", icon: "⚙️" }
        ];
        let currentModule = 0;

        function updateModule() {
            document.getElementById('module-title').innerText = modules[currentModule].title;
            document.getElementById('module-content').innerText = modules[currentModule].content;
            document.getElementById('module-icon').innerText = modules[currentModule].icon;
            
            document.getElementById('module-counter').innerText = `Module ${currentModule + 1} of ${modules.length}`;
            let pct = Math.round(((currentModule + 1) / modules.length) * 100);
            document.getElementById('progress-fill').style.width = pct + "%";
            document.getElementById('progress-percentage').innerText = pct + "% Completed";
            
            document.getElementById('prev-module-btn').disabled = currentModule === 0;
            if (currentModule === modules.length - 1) {
                document.getElementById('next-module-btn').innerHTML = `Finish <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            } else {
                document.getElementById('next-module-btn').innerHTML = `Next Module <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
            }
        }

        function nextModule() {
            if (currentModule < modules.length - 1) {
                currentModule++;
                updateModule();
            } else {
                // If finished, switch to quiz
                window.location.href = '/quiz';
            }
        }

        function prevModule() {
            if (currentModule > 0) {
                currentModule--;
                updateModule();
            }
        }
        
        // Initialize
        updateModule();

        // Verify Logic
        function verifyVoter() {
            let epic = document.getElementById('epic-input').value.trim();
            if (epic.length < 5) return alert("Please enter a valid EPIC number.");
            
            let card = document.getElementById('verify-card');
            let btn = document.getElementById('verify-btn');
            let result = document.getElementById('verify-result');
            
            card.classList.add('scanning');
            btn.innerText = "Scanning...";
            btn.style.pointerEvents = "none";
            result.style.display = "none";
            
            // Simulate API delay
            setTimeout(() => {
                card.classList.remove('scanning');
                btn.innerText = "Verify Now";
                btn.style.pointerEvents = "auto";
                
                // Show result
                result.style.display = "block";
                result.innerHTML = `
                <div class="verification-record">
                    <div class="verification-header">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                        Record Found & Verified
                    </div>
                    <div class="verification-subtext">Your name exists in the current electoral roll.</div>
                    
                    <div class="verification-grid">
                        <div class="verification-item">
                            <span class="verification-label">Name</span>
                            <span class="verification-value">Aarav Sharma</span>
                        </div>
                        <div class="verification-item">
                            <span class="verification-label">EPIC No.</span>
                            <span class="verification-value">${epic.toUpperCase()}</span>
                        </div>
                        <div class="verification-item">
                            <span class="verification-label">Status</span>
                            <span class="verification-value"><span class="status-badge">Active</span></span>
                        </div>
                        <div class="verification-item">
                            <span class="verification-label">Assembly Constituency</span>
                            <span class="verification-value">42 - Central District</span>
                        </div>
                        <div class="verification-item" style="grid-column: 1 / -1;">
                            <span class="verification-label">Polling Station</span>
                            <span class="verification-value">Govt. High School, Sector 4, Room 1</span>
                        </div>
                    </div>
                </div>`;
            }, 2500);
        }


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
                const userRaw = localStorage.getItem('electionUser');
                const user = userRaw ? JSON.parse(userRaw) : null;

                let res = await fetch("/ask", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        question: q,
                        user: user
                    })
                });

                let data = await res.json();
                let answer = data.answer;

                // Translate if non-English selected
                if (window._responseLang && window._responseLang !== 'en') {
                    try {
                        let tr = await fetch("/api/translate", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({text: answer, lang: window._responseLang})
                        });
                        let tdata = await tr.json();
                        answer = tdata.translated || answer;
                    } catch(e) { /* fallback to English */ }
                }

                // Format markdown response
                if (window.marked) {
                    resBox.innerHTML = marked.parse(answer);
                } else {
                    resBox.innerText = answer;
                }
                
                // UI State: Done
                loader.style.display = "none";
                resContainer.style.display = "block";

                // GA4 event tracking
                if (window.fbAnalytics) fbAnalytics.logEvent('question_asked', {lang: window._responseLang || 'en'});
                
            } catch (error) {
                loader.style.display = "none";
                resContainer.style.display = "block";
                resBox.innerHTML = "<p style='color: #ef4444;'>An error occurred while connecting to the assistant.</p>";
            } finally {
                askBtn.style.opacity = "1";
                askBtn.style.pointerEvents = "auto";
            }
        }
        
        function copyResponse() {
            const text = document.getElementById('response').innerText;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('copy-btn');
                const oldText = btn.innerHTML;
                btn.innerHTML = '✅ Copied';
                setTimeout(() => btn.innerHTML = oldText, 2000);
            });
        }

        async function speakResponse() {
            const text = document.getElementById('response').innerText;
            if (!text) return;

            const btn = document.getElementById('listen-btn');
            const oldText = btn.innerHTML;
            btn.innerHTML = '⌛ Generating...';
            btn.disabled = true;

            try {
                const res = await fetch("/api/speak", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        text: text,
                        lang: window._responseLang === 'hi' ? 'hi-IN' : 'en-IN'
                    })
                });

                if (!res.ok) throw new Error("TTS failed");

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const audio = new Audio(url);
                
                audio.onplay = () => { btn.innerHTML = '🔊 Playing...'; };
                audio.onended = () => { 
                    btn.innerHTML = oldText; 
                    btn.disabled = false;
                    URL.revokeObjectURL(url);
                };
                
                audio.play();
            } catch (error) {
                console.error("TTS Error:", error);
                btn.innerHTML = '❌ Error';
                setTimeout(() => {
                    btn.innerHTML = oldText;
                    btn.disabled = false;
                }, 2000);
            }
        }

        // ============================================================
        // 🌐 LANGUAGE TOGGLE — EN / Hindi (Standout Feature)
        // ============================================================
        const translations = {
            en: {
                langLabel: "हिंदी",
                placeholder: "Ask about voting, EVMs, eligibility...",
                navHome: "HOME", navVoter: "VOTER SERVICES", navEdu: "EDUCATION",
                navTimeline: "TIMELINE", navAI: "AI ASSISTANT", navQuiz: "QUIZ",
                h1: "AI Election Assistant",
                heroSub: "Your intelligent, unbiased guide to navigating the election process.",
                askBtn: "Ask AI",
            },
            hi: {
                langLabel: "English",
                placeholder: "मतदान, EVM, पात्रता के बारे में पूछें...",
                navHome: "होम", navVoter: "मतदाता सेवाएं", navEdu: "शिक्षा",
                navTimeline: "समयरेखा", navAI: "AI सहायक", navQuiz: "क्विज़",
                h1: "AI चुनाव सहायक",
                heroSub: "चुनाव प्रक्रिया को सरल बनाने वाला आपका बुद्धिमान, निष्पक्ष मार्गदर्शक।",
                askBtn: "पूछें",
            }
        };

        let currentLang = 'en';

        function toggleLanguage() {
            currentLang = currentLang === 'en' ? 'hi' : 'en';
            const t = translations[currentLang];
            const htmlRoot = document.getElementById('html-root');
            htmlRoot.setAttribute('lang', currentLang === 'hi' ? 'hi' : 'en');

            // Sync AI Assistant language with global language
            window._responseLang = currentLang;
            // Update active state of language buttons in chat bar
            document.querySelectorAll('.chat-lang-btn').forEach(b => {
                const bLang = b.getAttribute('onclick').match(/'([^']+)'/)[1];
                if (bLang === currentLang) b.classList.add('active');
                else b.classList.remove('active');
            });

            // Update lang toggle label
            document.getElementById('lang-label').innerText = t.langLabel;
            // Update placeholder
            const qInput = document.getElementById('question');
            if (qInput) qInput.placeholder = t.placeholder;
            // Update nav items
            const navItems = document.querySelectorAll('.nav-item');
            const navKeys = ['navHome','navVoter','navEdu','navTimeline','navAI','navQuiz'];
            navItems.forEach((el, i) => { if (navKeys[i]) el.innerText = t[navKeys[i]]; });
            // Update hero heading & subtitle
            const h1 = document.querySelector('#section-home h1');
            const sub = document.querySelector('#section-home .header > p');
            if (h1) h1.innerText = t.h1;
            if (sub) sub.innerText = t.heroSub;
            // Update ask button
            const askSpan = document.querySelector('#ask-btn span');
            if (askSpan) askSpan.innerText = t.askBtn;
        }

        // ============================================================
        // 🎯 VOTER READINESS SCORE
        // ============================================================
        const readinessItems = [
            { id: 'r1', icon: '🪪', text: 'I have my Voter ID (EPIC) or an approved alternate ID ready' },
            { id: 'r2', icon: '📍', text: 'I know my designated polling booth location' },
            { id: 'r3', icon: '✅', text: 'I have checked my name in the Electoral Roll (voter list)' },
            { id: 'r4', icon: '🖥️', text: 'I understand how to use an Electronic Voting Machine (EVM)' },
            { id: 'r5', icon: '⏰', text: 'I know polling timings: 7:00 AM – 6:00 PM on Election Day' },
        ];
        const readinessState = {};
        readinessItems.forEach(i => readinessState[i.id] = false);

        function renderReadiness() {
            const list = document.getElementById('readiness-list');
            if (!list) return;
            list.innerHTML = readinessItems.map(item => `
                <div class="readiness-item ${readinessState[item.id] ? 'checked' : ''}"
                     onclick="toggleReadiness('${item.id}')" role="checkbox"
                     aria-checked="${readinessState[item.id]}" tabindex="0">
                    <div class="readiness-checkbox">${readinessState[item.id] ? '✓' : ''}</div>
                    <span class="readiness-item-text">${item.icon} ${item.text}</span>
                </div>`).join('');
            updateReadinessScore();
        }

        function toggleReadiness(id) {
            readinessState[id] = !readinessState[id];
            renderReadiness();
        }

        function updateReadinessScore() {
            const done = Object.values(readinessState).filter(Boolean).length;
            const total = readinessItems.length;
            const pct = Math.round((done / total) * 100);
            const arc = document.getElementById('readiness-arc');
            const pctEl = document.getElementById('readiness-pct');
            const circumference = 238.76;
            if (arc)   arc.style.strokeDashoffset = circumference - (circumference * pct / 100);
            if (pctEl) pctEl.textContent = pct + '%';
        }

        // ============================================================
        // 🖥️ EVM SIMULATOR
        // ============================================================
        let evmStep = 1;
        const EVM_STEPS = 6;
        let evmChosen = null;
        let vvpatTimer = null;

        const evmCandidates = [
            { no:1, symbol:'🟠', party:'National Progress Party',    name:'Ravi Kumar Sharma', color:'#f97316' },
            { no:2, symbol:'🔵', party:"People's Democratic Front",  name:'Priya Nair',         color:'#3b82f6' },
            { no:3, symbol:'🟢', party:'United Farmers Alliance',    name:'Suresh Patel',       color:'#10b981' },
            { no:4, symbol:'🔴', party:'Regional Progressive Party', name:'Anita Desai',        color:'#ef4444' },
            { no:5, symbol:'⚫', party:'NOTA',                       name:'None Of The Above',  color:'#6b7280' },
        ];

        function renderEVM() {
            const stage = document.getElementById('evm-stage');
            const label = document.getElementById('evm-step-label');
            const prev  = document.getElementById('evm-prev-btn');
            const next  = document.getElementById('evm-next-btn');
            if (!stage) return;

            label.textContent = `Step ${evmStep} of ${EVM_STEPS}`;
            prev.style.visibility = evmStep === 1 ? 'hidden' : 'visible';
            next.style.display    = evmStep === EVM_STEPS ? 'none' : 'flex';

            for (let i = 1; i <= EVM_STEPS; i++) {
                const dot  = document.getElementById(`edot-${i}`);
                const line = document.getElementById(`eline-${i}`);
                if (dot)  dot.className  = 'evm-dot'  + (i < evmStep ? ' done' : i === evmStep ? ' active' : '');
                if (line) line.className = 'evm-line' + (i < evmStep ? ' done' : '');
            }

            const renders = [null, s1, s2, s3, s4, s5, s6];
            renders[evmStep](stage);
        }

        function s1(el) { el.innerHTML = `
            <div class="evm-step-info">
                <div class="evm-step-icon">🏛️</div>
                <h3>Welcome to the Polling Booth</h3>
                <p>This simulator guides you through the complete voting process just like on real Election Day. Polling officials manage the booth under strict Election Commission guidelines.</p>
                <div class="evm-tip">📍 <strong>Tip:</strong> Arrive at your booth between 7:00 AM – 6:00 PM. Bring your Voter ID or any approved alternate photo ID.</div>
            </div>`; }

        function s2(el) { el.innerHTML = `
            <div class="evm-step-info">
                <div class="evm-step-icon">🪪</div>
                <h3>Step 2 – Identity Verification</h3>
                <p>Show one of the 12 ECI-approved photo IDs to the Polling Officer. Your name is verified against the Electoral Roll.</p>
                <div class="id-cards-grid">
                    <div class="id-card-chip">🪪 Voter ID (EPIC)</div>
                    <div class="id-card-chip">📱 Aadhaar Card</div>
                    <div class="id-card-chip">🛂 Passport</div>
                    <div class="id-card-chip">🚗 Driving Licence</div>
                    <div class="id-card-chip">📋 PAN Card</div>
                    <div class="id-card-chip">🏦 Bank Passbook</div>
                    <div class="id-card-chip">📸 Pension Document</div>
                    <div class="id-card-chip">🎓 Student ID</div>
                </div>
                <div class="evm-tip">✅ <strong>Verified!</strong> The officer marks your name in the register and calls you forward.</div>
            </div>`; }

        function s3(el) { el.innerHTML = `
            <div class="evm-step-info">
                <div class="evm-step-icon">☝️</div>
                <h3>Step 3 – Indelible Ink Applied</h3>
                <p>Indelible ink is applied to your left index finger. It cannot be washed off for 2–3 weeks, preventing double voting.</p>
                <div class="ink-finger-demo">
                    <div class="ink-finger">
                        <div class="finger-body">☝️</div>
                        <div class="ink-mark">INK ✓</div>
                    </div>
                    <p class="ink-caption">Over 26 million ink bottles are used per Indian election, manufactured by Mysore Paints & Varnish Ltd.</p>
                </div>
                <div class="evm-tip">💡 <strong>Fun Fact:</strong> The ink was first used in the 1962 Indian General Election and is now exported to 25+ countries.</div>
            </div>`; }

        function s4(el) {
            const rows = evmCandidates.map(c => `
                <div class="evm-ballot-row ${evmChosen===c.no?'selected':''}" id="evmrow-${c.no}">
                    <div class="evm-serial">${c.no}</div>
                    <div class="evm-symbol" style="background:${c.color}20;border:2px solid ${c.color}">${c.symbol}</div>
                    <div class="evm-candidate-info">
                        <div class="evm-candidate-name">${c.name}</div>
                        <div class="evm-party-name">${c.party}</div>
                    </div>
                    <button class="evm-vote-btn ${evmChosen===c.no?'pressed':''}"
                            onclick="evmVote(${c.no})"
                            aria-label="Vote for ${c.name}">
                        ${evmChosen===c.no ? '✓' : '●'}
                    </button>
                </div>`).join('');

            const notice = evmChosen
                ? `<div class="evm-selected-notice">✅ Selected: <strong>${evmCandidates.find(c=>c.no===evmChosen).name}</strong> — Click <em>Next</em> to see VVPAT verification</div>`
                : `<p style="text-align:center;color:var(--text-muted);margin-top:0.8rem;font-size:0.85rem;">Press the blue ● button next to your chosen candidate</p>`;

            el.innerHTML = `
                <div class="evm-machine-wrapper">
                    <div class="evm-machine">
                        <div class="evm-machine-header">
                            <div class="evm-machine-title">ELECTION COMMISSION OF INDIA</div>
                            <div class="evm-machine-subtitle">BALLOTING UNIT — DEMO MODE</div>
                        </div>
                        <div class="evm-ballot-list">${rows}</div>
                    </div>
                    ${notice}
                </div>`; }

        function evmVote(no) {
            evmChosen = no;
            renderEVM();
        }

        function s5(el) {
            if (!evmChosen) {
                el.innerHTML = `<div class="evm-step-info"><p style="color:#ef4444;text-align:center">⚠️ Please go back and select a candidate first.</p></div>`;
                return;
            }
            const sel = evmCandidates.find(c => c.no === evmChosen);
            let secs = 7;
            el.innerHTML = `
                <div class="evm-step-info">
                    <div class="evm-step-icon">🖨️</div>
                    <h3>Step 5 – VVPAT Verification</h3>
                    <p>A paper slip is printed and visible for <strong>7 seconds</strong> through the VVPAT window. Verify it matches your choice.</p>
                    <div class="vvpat-window">
                        <div class="vvpat-label">VVPAT SLIP</div>
                        <div class="vvpat-slip">
                            <div style="font-size:1.4rem">${sel.symbol}</div>
                            <div style="font-weight:800;margin:0.3rem 0">${sel.name}</div>
                            <div style="color:#444;font-size:0.7rem">${sel.party}</div>
                        </div>
                    </div>
                    <div class="vvpat-countdown" id="vvpat-cd">⏱ Slip visible for ${secs}s</div>
                    <div class="evm-tip">✅ The slip confirms your vote. After 7 seconds it drops into a sealed box and is NOT accessible to anyone.</div>
                </div>`;

            if (vvpatTimer) clearInterval(vvpatTimer);
            vvpatTimer = setInterval(() => {
                secs--;
                const cd = document.getElementById('vvpat-cd');
                if (cd) cd.textContent = secs > 0 ? `⏱ Slip visible for ${secs}s` : '✅ Slip dropped into sealed compartment';
                if (secs <= 0) clearInterval(vvpatTimer);
            }, 1000);
        }

        function s6(el) { el.innerHTML = `
            <div class="evm-success">
                <div class="evm-success-icon">🎉</div>
                <h3>Vote Cast Successfully!</h3>
                <p style="color:var(--text-muted);max-width:420px;margin:0 auto 1rem">Your vote has been recorded in the EVM and verified via VVPAT. You are now part of India's democracy!</p>
                <div style="display:flex;gap:0.8rem;justify-content:center;flex-wrap:wrap">
                    <button class="evm-restart-btn" onclick="evmRestart()">🔄 Try Again</button>
                    <button class="evm-restart-btn" style="background:linear-gradient(135deg,#10b981,#059669)" onclick="switchSection('ai-assistant',event)">💬 Ask AI Assistant</button>
                </div>
                <div style="margin-top:1.5rem;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.25);border-radius:12px;padding:1rem;font-size:0.85rem;color:#86efac">
                    🗳️ <strong>Remember:</strong> Every vote matters. India's largest election involved over 970 million eligible voters!
                </div>
            </div>`; }

        function evmNext() {
            if (evmStep === 4 && !evmChosen) {
                alert('Please select a candidate first by pressing the blue ● button!');
                return;
            }
            if (evmStep < EVM_STEPS) { evmStep++; renderEVM(); }
        }
        function evmPrev() { if (evmStep > 1) { evmStep--; renderEVM(); } }
        function evmRestart() { evmStep = 1; evmChosen = null; if (vvpatTimer) clearInterval(vvpatTimer); renderEVM(); }

        // ============================================================
        // 🎭 SCENARIO SIMULATOR
        // ============================================================
        const scenarios = [
            {
                emoji: '😟', title: 'I lost my Voter ID',
                subtitle: 'How to vote without your EPIC card',
                steps: [
                    'Don\'t panic — 12 alternate photo IDs are accepted by ECI.',
                    'Use any of: Aadhaar, Passport, Driving Licence, PAN Card, Bank/Post Office Passbook, MNREGA Job Card, Smart Card (CGHS/ECHS), Pension Document, or Official ID issued by Govt.',
                    'Visit your polling booth on Election Day with any of these IDs.',
                    'Apply for a new EPIC card online at voters.eci.gov.in after the election.',
                ],
                helpline: null,
            },
            {
                emoji: '😰', title: 'My name is missing from the list',
                subtitle: 'Name not found in Electoral Roll',
                steps: [
                    'Visit electoralsearch.in or the ECI Voter Portal to search your name.',
                    'Contact your Booth Level Officer (BLO) — they can verify on-site.',
                    'If missing, file Form 6 to enroll before the deadline (usually 10 days before polling).',
                    'You can also visit your nearest Electoral Registration Officer (ERO) office.',
                ],
                helpline: '📞 Helpline: 1950 (Voter Helpline)',
            },
            {
                emoji: '🆕', title: 'I am a first-time voter',
                subtitle: 'Complete registration guide',
                steps: [
                    'Check if you are 18+ years old on the qualifying date (Jan 1 of the current year).',
                    'Register online at voters.eci.gov.in — fill Form 6 with your details.',
                    'Upload: passport photo, proof of age (Aadhaar/birth cert), proof of address.',
                    'After approval, your name appears in the voter list and you receive your EPIC.',
                    'Find your polling booth and go vote on Election Day!',
                ],
                helpline: null,
            },
            {
                emoji: '🏠', title: 'I am away from my home constituency',
                subtitle: 'Voting options when you are traveling',
                steps: [
                    'You can apply for a Postal Ballot if you are a service voter, senior citizen (80+), or disabled.',
                    'Alternatively, apply to transfer your voter enrollment to your current address (Form 6).',
                    'If you are an NRI voter, register at eci.gov.in/nri and vote via proxy or postal ballot.',
                    'Note: Ordinary voters cannot vote from a different constituency — you must travel back OR transfer enrollment.',
                ],
                helpline: '📞 Helpline: 1950',
            },
            {
                emoji: '⚠️', title: 'Someone is pressuring my vote',
                subtitle: 'What to do under threat or coercion',
                steps: [
                    'Your vote is completely secret — no one can know which button you pressed in the booth.',
                    'Report any threats, inducements, or coercion immediately.',
                    'Call the cVIGIL app or the National Voter Service Portal to report violations.',
                    'Contact local police or approach the Presiding Officer of your booth.',
                    'The Model Code of Conduct (MCC) strictly prohibits voter intimidation.',
                ],
                helpline: '🚨 Emergency: 112 | Voter Helpline: 1950',
            },
            {
                emoji: '🔧', title: 'EVM shows an error at the booth',
                subtitle: 'Technical issue during voting',
                steps: [
                    'Do not panic — immediately inform the Presiding Officer or Polling Officer in charge.',
                    'Faulty EVMs are replaced quickly; the booth may pause voting temporarily.',
                    'Your right to vote is protected — booths stay open until all queued voters have voted.',
                    'Mock polls are conducted before voting begins to ensure EVM works correctly.',
                    'VVPAT helps cross-verify any discrepancy if an EVM malfunction is suspected.',
                ],
                helpline: '📞 Report to: Presiding Officer on duty or call 1950',
            },
        ];

        function renderScenarios() {
            const grid = document.getElementById('scenarios-grid');
            if (!grid) return;
            grid.innerHTML = scenarios.map((s, i) => `
                <div class="scenario-card" id="sc-${i}" onclick="toggleScenario(${i})">
                    <div class="scenario-header">
                        <div class="scenario-emoji">${s.emoji}</div>
                        <div>
                            <div class="scenario-title">${s.title}</div>
                            <div class="scenario-subtitle">${s.subtitle}</div>
                        </div>
                        <div class="scenario-chevron">▼</div>
                    </div>
                    <div class="scenario-body">
                        <div class="scenario-steps">
                            ${s.steps.map((st,j) => `
                                <div class="scenario-step">
                                    <div class="scenario-step-num">${j+1}</div>
                                    <div class="scenario-step-text">${st}</div>
                                </div>`).join('')}
                        </div>
                        ${s.helpline ? `<div class="scenario-helpline">${s.helpline}</div>` : ''}
                    </div>
                </div>`).join('');
        }

        function toggleScenario(i) {
            const card = document.getElementById(`sc-${i}`);
            card.classList.toggle('open');
        }

        // ============================================================
        // INIT — run all feature inits on page load
        // ============================================================
        function initializeAllFeatures() {
            renderScenarios();
            checkAuth();
            
            // Google Charts Init
            if (window.google) {
                google.charts.load('current', {'packages':['corechart', 'bar']});
                google.charts.setOnLoadCallback(() => {
                    window._chartsReady = true;
                    console.log("📈 Google Charts API Loaded.");
                });
            }
            
            // Theme Init
            if (localStorage.getItem('darkMode') === '1') {
                document.body.classList.add('dark-mode');
                const btn = document.getElementById('dark-mode-btn');
                if (btn) btn.textContent = '☀️';
            }
        }

        document.addEventListener('DOMContentLoaded', initializeAllFeatures);
        window.addEventListener('load', function() {
            checkAuth();
            renderReadiness();
            renderEVM();
            renderScenarios();
        });
        // ============================================================
        // ECI MAP DATA
        // ============================================================
        const eciStates = [
            { name:'Uttar Pradesh',     lat:26.85, lng:80.91, seats:80, voters:'15.12 Cr', capital:'Lucknow',           zone:'North',    type:'State' },
            { name:'Maharashtra',       lat:19.75, lng:75.71, seats:48, voters:'9.18 Cr',  capital:'Mumbai',            zone:'West',     type:'State' },
            { name:'West Bengal',       lat:22.98, lng:87.85, seats:42, voters:'7.52 Cr',  capital:'Kolkata',           zone:'East',     type:'State' },
            { name:'Tamil Nadu',        lat:11.12, lng:78.65, seats:39, voters:'6.24 Cr',  capital:'Chennai',           zone:'South',    type:'State' },
            { name:'Madhya Pradesh',    lat:22.97, lng:78.65, seats:29, voters:'5.61 Cr',  capital:'Bhopal',            zone:'North',    type:'State' },
            { name:'Gujarat',           lat:22.25, lng:71.19, seats:26, voters:'4.59 Cr',  capital:'Gandhinagar',       zone:'West',     type:'State' },
            { name:'Andhra Pradesh',    lat:15.91, lng:79.74, seats:25, voters:'4.02 Cr',  capital:'Amaravati',         zone:'South',    type:'State' },
            { name:'Rajasthan',         lat:27.02, lng:74.21, seats:25, voters:'5.26 Cr',  capital:'Jaipur',            zone:'North',    type:'State' },
            { name:'Karnataka',         lat:15.31, lng:75.71, seats:28, voters:'5.23 Cr',  capital:'Bengaluru',         zone:'South',    type:'State' },
            { name:'Bihar',             lat:25.09, lng:85.31, seats:40, voters:'7.57 Cr',  capital:'Patna',             zone:'East',     type:'State' },
            { name:'Kerala',            lat:10.85, lng:76.27, seats:20, voters:'2.74 Cr',  capital:'Thiruvananthapuram',zone:'South',    type:'State' },
            { name:'Odisha',            lat:20.94, lng:85.09, seats:21, voters:'3.49 Cr',  capital:'Bhubaneswar',       zone:'East',     type:'State' },
            { name:'Telangana',         lat:17.12, lng:79.01, seats:17, voters:'3.17 Cr',  capital:'Hyderabad',         zone:'South',    type:'State' },
            { name:'Assam',             lat:26.14, lng:91.76, seats:14, voters:'2.35 Cr',  capital:'Dispur',            zone:'Northeast',type:'State' },
            { name:'Jharkhand',         lat:23.61, lng:85.27, seats:14, voters:'2.25 Cr',  capital:'Ranchi',            zone:'East',     type:'State' },
            { name:'Punjab',            lat:31.14, lng:75.34, seats:13, voters:'2.15 Cr',  capital:'Chandigarh',        zone:'North',    type:'State' },
            { name:'Chhattisgarh',      lat:21.27, lng:81.86, seats:11, voters:'2.06 Cr',  capital:'Raipur',            zone:'East',     type:'State' },
            { name:'Haryana',           lat:29.05, lng:76.08, seats:10, voters:'1.97 Cr',  capital:'Chandigarh',        zone:'North',    type:'State' },
            { name:'Uttarakhand',       lat:30.06, lng:79.54, seats:5,  voters:'83.4 L',   capital:'Dehradun',          zone:'North',    type:'State' },
            { name:'Himachal Pradesh',  lat:31.10, lng:77.17, seats:4,  voters:'55.9 L',   capital:'Shimla',            zone:'North',    type:'State' },
            { name:'Manipur',           lat:24.66, lng:93.90, seats:2,  voters:'20.5 L',   capital:'Imphal',            zone:'Northeast',type:'State' },
            { name:'Meghalaya',         lat:25.46, lng:91.36, seats:2,  voters:'21.4 L',   capital:'Shillong',          zone:'Northeast',type:'State' },
            { name:'Tripura',           lat:23.94, lng:91.98, seats:2,  voters:'28.2 L',   capital:'Agartala',          zone:'Northeast',type:'State' },
            { name:'Goa',               lat:15.29, lng:74.12, seats:2,  voters:'11.5 L',   capital:'Panaji',            zone:'West',     type:'State' },
            { name:'Arunachal Pradesh', lat:28.21, lng:94.72, seats:2,  voters:'8.5 L',    capital:'Itanagar',          zone:'Northeast',type:'State' },
            { name:'Mizoram',           lat:23.16, lng:92.93, seats:1,  voters:'8.5 L',    capital:'Aizawl',            zone:'Northeast',type:'State' },
            { name:'Nagaland',          lat:26.15, lng:94.56, seats:1,  voters:'13.3 L',   capital:'Kohima',            zone:'Northeast',type:'State' },
            { name:'Sikkim',            lat:27.53, lng:88.51, seats:1,  voters:'4.5 L',    capital:'Gangtok',           zone:'Northeast',type:'State' },
            // UTs
            { name:'Delhi',             lat:28.70, lng:77.10, seats:7,  voters:'1.47 Cr',  capital:'New Delhi',         zone:'UT',       type:'Union Territory' },
            { name:'Jammu & Kashmir',   lat:33.72, lng:75.14, seats:6,  voters:'87.1 L',   capital:'Srinagar',          zone:'North',    type:'Union Territory' },
            { name:'Puducherry',        lat:11.93, lng:79.82, seats:1,  voters:'10.4 L',   capital:'Puducherry',        zone:'UT',       type:'Union Territory' },
            { name:'Chandigarh',        lat:30.73, lng:76.77, seats:1,  voters:'6.4 L',    capital:'Chandigarh',        zone:'UT',       type:'Union Territory' },
            { name:'Dadra & NH',        lat:20.18, lng:72.96, seats:1,  voters:'3.4 L',    capital:'Daman',             zone:'UT',       type:'Union Territory' },
            { name:'Lakshadweep',       lat:10.57, lng:72.64, seats:1,  voters:'0.55 L',   capital:'Kavaratti',         zone:'UT',       type:'Union Territory' },
            { name:'Andaman & Nicobar', lat:11.74, lng:92.65, seats:1,  voters:'2.2 L',    capital:'Port Blair',        zone:'UT',       type:'Union Territory' },
        ];

        function seatColor(seats) {
            return seats > 40 ? '#1d4ed8' : seats > 25 ? '#2563eb' : seats > 14 ? '#3b82f6' : seats > 5 ? '#60a5fa' : '#93c5fd';
        }

        let _mapMarkers = [];
        let _activeZone = 'All';

        function initECIMap() {
            // Populate the state dropdown (no Leaflet needed - using Google Maps iframe)
            const picker = document.getElementById('state-picker');
            if (!picker) return;
            const sorted = [...eciStates].sort((a,b) => a.name.localeCompare(b.name));
            sorted.forEach(st => {
                const opt = document.createElement('option');
                opt.value = st.name;
                opt.textContent = st.name + ' (' + st.seats + ' seats)';
                picker.appendChild(opt);
            });
        }

        function showStateFromPicker(name) {
            if (!name) return;
            const st = eciStates.find(s => s.name === name);
            if (st) showStateInfo(st);
        }

                function showStateInfo(st) {
            document.getElementById('map-placeholder').style.display = 'none';
            const card = document.getElementById('map-state-card');
            card.style.display = 'block';
            const badge = st.type === 'Union Territory' ? 'UT' : 'ST';
            card.innerHTML = `
                <div class="map-state-header">
                    <div class="map-state-flag"
                         style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:900;color:white;flex-shrink:0">${badge}</div>
                    <div>
                        <div class="map-state-name">${st.name}</div>
                        <div class="map-state-type">${st.type} | ${st.zone} Zone</div>
                    </div>
                </div>
                <div class="map-state-rows">
                    <div class="map-state-row"><span class="map-state-row-label">Capital</span><span class="map-state-row-val">${st.capital}</span></div>
                    <div class="map-state-row"><span class="map-state-row-label">Lok Sabha Seats</span><span class="map-state-row-val">${st.seats}</span></div>
                    <div class="map-state-row"><span class="map-state-row-label">Registered Voters</span><span class="map-state-row-val">${st.voters}</span></div>
                    <div class="map-state-row"><span class="map-state-row-label">Zone</span><span class="map-state-row-val">${st.zone}</span></div>
                </div>
                <a class="map-view-eci" href="https://www.eci.gov.in" target="_blank" rel="noopener">View on ECI Website</a>`;
        }

        function mapSearch(q) {
            // Filter the state dropdown by search term
            const term = q.toLowerCase().trim();
            const picker = document.getElementById('state-picker');
            if (!picker) return;
            Array.from(picker.options).forEach(opt => {
                if (!opt.value) return;
                opt.hidden = term && !opt.value.toLowerCase().includes(term);
            });
        }

        function filterZone(zone, btn) {
            // Filter the state dropdown by zone
            document.querySelectorAll('.zone-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const picker = document.getElementById('state-picker');
            if (!picker) return;
            Array.from(picker.options).forEach(opt => {
                if (!opt.value) return;
                const st = eciStates.find(s => s.name === opt.value);
                opt.hidden = st && zone !== 'All' && st.zone !== zone;
            });
        }

        // ============================================================
        // 🌙 DARK MODE — Premium Feature
        // ============================================================
        function toggleDarkMode() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            document.getElementById('dark-mode-btn').textContent = isDark ? '☀️' : '🌙';
            localStorage.setItem('darkMode', isDark ? '1' : '0');
            if (window.fbAnalytics) fbAnalytics.logEvent('dark_mode_toggle', {state: isDark ? 'on' : 'off'});
        }

        // Load saved dark mode preference
        if (localStorage.getItem('darkMode') === '1') {
            document.body.classList.add('dark-mode');
            const btn = document.getElementById('dark-mode-btn');
            if (btn) btn.textContent = '☀️';
        }

        // ============================================================
        // 🎙️ VOICE INPUT — Google Web Speech API
        // ============================================================
        function startVoiceInput() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                alert('Voice input is not supported in this browser. Please use Chrome.');
                return;
            }
            const recognition = new SpeechRecognition();
            const voiceBtn = document.getElementById('voice-btn');
            const qInput = document.getElementById('question');
            
            const langMap = {'en': 'en-IN', 'hi': 'hi-IN', 'ta': 'ta-IN', 'bn': 'bn-IN'};
            recognition.lang = langMap[window._responseLang || 'en'] || 'en-IN';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            voiceBtn.textContent = '🔴';
            voiceBtn.style.animation = 'pulse 1s infinite';

            recognition.start();

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice result received:', transcript);
                if (qInput) {
                    qInput.value = transcript;
                    // Force the value to update and trigger any listeners
                    qInput.setAttribute('value', transcript);
                    qInput.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    console.error('Question input element not found!');
                }
                voiceBtn.textContent = '🎙️';
                voiceBtn.style.animation = '';
                if (window.fbAnalytics) fbAnalytics.logEvent('voice_input_used');
                
                // Final verification of text before asking
                if (qInput.value.length > 0) {
                    setTimeout(ask, 400);
                } else {
                    console.warn('Transcript was empty or not assigned correctly.');
                }
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                voiceBtn.textContent = '🎙️';
                voiceBtn.style.animation = '';
                if (event.error === 'not-allowed') alert('Microphone permission denied.');
            };

            recognition.onend = () => {
                voiceBtn.textContent = '🎙️';
                voiceBtn.style.animation = '';
            };
        }

        // ============================================================
        // 🔊 TEXT-TO-SPEECH — Web Speech Synthesis API (Google Chrome)
        // ============================================================
        function speakResponse() {
            const text = document.getElementById('response')?.innerText?.trim();
            if (!text) return;

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const langMap = {'en': 'en-IN', 'hi': 'hi-IN', 'ta': 'ta-IN', 'bn': 'bn-IN'};
            utterance.lang = langMap[window._responseLang || 'en'] || 'en-IN';
            utterance.rate = 0.9;
            utterance.pitch = 1;

            const btn = document.getElementById('listen-btn');
            btn.textContent = '⏹ Stop';
            utterance.onend = () => { btn.textContent = '🔊 Listen'; };
            utterance.onerror = () => { btn.textContent = '🔊 Listen'; };

            // If already speaking, stop
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                btn.textContent = '🔊 Listen';
                return;
            }

            window.speechSynthesis.speak(utterance);
            if (window.fbAnalytics) fbAnalytics.logEvent('tts_used');
        }

        // ============================================================
        // 📋 COPY RESPONSE
        // ============================================================
        function copyResponse() {
            const text = document.getElementById('response')?.innerText?.trim();
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                const btn = document.getElementById('copy-btn');
                btn.textContent = '✅ Copied!';
                setTimeout(() => { btn.textContent = '📋 Copy'; }, 2000);
            });
        }

        // ============================================================
        // 🌐 RESPONSE LANGUAGE SELECTOR (EN/HI/TA/BN via Gemini)
        // ============================================================
        window._responseLang = 'en';

        function setResponseLang(lang, btn) {
            window._responseLang = lang;
            document.querySelectorAll('.chat-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Also update the global recognition language if it's currently active
            console.log(`AI Assistant language set to: ${lang}`);
        }

        // ============================================================
        // 🔥 FIREBASE FIRESTORE LEADERBOARD
        // ============================================================
        async function saveScoreToFirestore(name, score) {
            try {
                if (!window.firestoreDB) return false;
                await window.firestoreDB.collection('leaderboard').add({
                    name: name,
                    score: score,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                if (window.fbAnalytics) fbAnalytics.logEvent('quiz_completed', {score: score});
                return true;
            } catch(e) {
                console.warn('Firestore save failed', e);
                return false;
            }
        }

        async function getFirestoreLeaderboard() {
            try {
                if (!window.firestoreDB) return null;
                const snap = await window.firestoreDB.collection('leaderboard')
                    .orderBy('score', 'desc').limit(10).get();
                return snap.docs.map(d => d.data());
            } catch(e) {
                console.warn('Firestore read failed', e);
                return null;
            }
        }

        window.saveScoreToFirestore = saveScoreToFirestore;
        window.getFirestoreLeaderboard = getFirestoreLeaderboard;

        // ============================================================
        // 📊 GOOGLE CHARTS — Election Data Visualization
        // ============================================================
        function loadElectionCharts() {
            if (!window._chartsReady || !google.visualization) {
                console.warn("Charts not ready yet, retrying...");
                setTimeout(loadElectionCharts, 500);
                return;
            }

            try {
                // 1. Voter Turnout Bar Chart
                const turnoutData = google.visualization.arrayToDataTable([
                    ['State', 'Turnout (%)', { role: 'style' }],
                    ['Tripura', 89.1, '#FF6B35'],
                    ['Sikkim', 82.3, '#FF6B35'],
                    ['Manipur', 80.1, '#FF6B35'],
                    ['W. Bengal', 79.2, '#FF9500'],
                    ['Lakshadweep', 77.8, '#FF9500'],
                    ['Nagaland', 77.1, '#FF9500'],
                    ['Assam', 75.4, '#138808'],
                    ['National Avg', 66.1, '#000080'],
                ]);
                new google.visualization.BarChart(document.getElementById('chart-turnout')).draw(
                    turnoutData,
                    {backgroundColor: 'transparent', legend: {position: 'none'},
                     hAxis: {title: 'Voter Turnout (%)', minValue: 0, maxValue: 100, textStyle:{color:'#94a3b8'}},
                     vAxis: {textStyle:{color:'#94a3b8'}}, chartArea:{width:'70%', height:'80%'}}
                );

                // 2. Lok Sabha Seats Pie Chart
                const seatsData = google.visualization.arrayToDataTable([
                    ['Region', 'Seats'],
                    ['North India', 225],
                    ['South India', 130],
                    ['East India', 120],
                    ['West India', 68],
                ]);
                new google.visualization.PieChart(document.getElementById('chart-seats')).draw(
                    seatsData,
                    {backgroundColor: 'transparent', pieHole: 0.4,
                     colors: ['#FF6B35','#138808','#000080','#FF9500'],
                     legend: {position: 'bottom', textStyle:{color:'#94a3b8'}},
                     chartArea:{width:'90%', height:'80%'}}
                );

                // 3. Voter Registration Growth Line Chart
                const growthData = google.visualization.arrayToDataTable([
                    ['Year', 'Voters (Millions)'],
                    ['2004', 671],
                    ['2009', 714],
                    ['2014', 814],
                    ['2019', 896],
                    ['2024', 969],
                ]);
                new google.visualization.LineChart(document.getElementById('chart-growth')).draw(
                    growthData,
                    {backgroundColor: 'transparent', colors: ['#138808'],
                     legend: {position: 'none'},
                     vAxis: {title: 'Voters (Millions)', textStyle:{color:'#94a3b8'}},
                     hAxis: {textStyle:{color:'#94a3b8'}},
                     chartArea:{width:'80%', height:'75%'}}
                );

                // 4. Demographics Donut Chart
                const demoData = google.visualization.arrayToDataTable([
                    ['Category', 'Count (Millions)'],
                    ['Male Voters', 497],
                    ['Female Voters', 471],
                    ['Third Gender', 1],
                ]);
                new google.visualization.PieChart(document.getElementById('chart-demo')).draw(
                    demoData,
                    {backgroundColor: 'transparent', pieHole: 0.5,
                     colors: ['#3b82f6','#ec4899','#8b5cf6'],
                     legend: {position: 'bottom', textStyle:{color:'#94a3b8'}},
                     chartArea:{width:'90%', height:'75%'}}
                );
            } catch (err) {
                console.error("Chart rendering error:", err);
            }
        }

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            updateModule();
            checkAuth();
            if (localStorage.getItem('darkMode') === '1') {
                document.body.classList.add('dark-mode');
                const btn = document.getElementById('dark-mode-btn');
                if (btn) btn.textContent = '☀️';
            }
        });

