// Auth Logic
        function checkAuth() {
            let user = localStorage.getItem('electionUser');
            if (user) {
                document.getElementById('login-btn').style.display = 'none';
                document.getElementById('user-profile').style.display = 'flex';
                document.getElementById('user-name-display').innerText = user;
            } else {
                document.getElementById('login-btn').style.display = 'flex';
                document.getElementById('user-profile').style.display = 'none';
            }
        }

        function openModal() { document.getElementById('auth-modal').classList.add('active'); }
        function closeModal() { document.getElementById('auth-modal').classList.remove('active'); }

        function login() {
            let name = document.getElementById('auth-name').value.trim();
            if (!name) return alert("Please enter your name.");
            localStorage.setItem('electionUser', name);
            closeModal();
            checkAuth();
        }

        function logout() {
            localStorage.removeItem('electionUser');
            checkAuth();
        }

        // Section Logic
        function switchSection(sectionId, event) {
            document.querySelectorAll('.content-section').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            
            document.getElementById('section-' + sectionId).classList.add('active');
            if (event) {
                event.currentTarget.classList.add('active');
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

        window.onload = function() {
            checkAuth();
        };

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