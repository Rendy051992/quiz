function preloadFlagImages() {
  const urls = new Set();

  flagData.forEach(q => {
    q.options.forEach(file => {
      urls.add(`flags/${file}`);
    });
  });

  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}




const flagData = [
    { name: "China", file: "cn.webp", options: ["cn.webp", "vn.webp", "tr.webp", "me.webp"] },
    { name: "United Kingdom", file: "gb.webp", options: ["is.webp", "gb.webp", "au.webp", "no.webp"] },
    { name: "France", file: "fr.webp", options: ["it.webp", "ru.webp", "fr.webp", "be.webp"] },
    { name: "Brazil", file: "br.webp", options: ["ar.webp", "jm.webp", "br.webp", "co.webp"] },
    { name: "United States", file: "us.webp", options: ["us.webp", "lr.webp"] },
    { name: "Japan", file: "jp.webp", options: ["jp.webp", "pw.webp"] },
    { name: "Spain", file: "es.webp", options: ["pt.webp", "es.webp", "mx.webp", "ph.webp"] },
    { name: "Canada", file: "ca.webp", options: ["ca.webp", "pe.webp", "lb.webp", "ge.webp"] },
    { name: "Germany", file: "de.webp", options: ["be.webp", "de.webp", "at.webp", "hu.webp"] },
    { name: "Greece", file: "gr.webp", options: ["uy.webp", "gr.webp", "il.webp", "fi.webp"] },
    { name: "Australia", file: "au.webp", options: ["au.webp", "nz.webp"] },
    { name: "Indonesia", file: "id.webp", options: ["id.webp", "mc.webp"] },
    { name: "Ireland", file: "ie.webp", options: ["ie.webp", "ci.webp"] },
    { name: "South Korea", file: "kr.webp", options: ["kp.webp", "th.webp", "kr.webp", "tw.webp"] },
    { name: "Switzerland", file: "ch.webp", options: ["at.webp", "ch.webp", "dk.webp", "to.webp"] },
    { name: "Kenya", file: "ke.webp", options: ["za.webp", "ng.webp", "ke.webp", "et.webp"] },
    { name: "Italy", file: "it.webp", options: ["ie.webp", "mx.webp", "hu.webp", "it.webp"] },
    { name: "Egypt", file: "eg.webp", options: ["iq.webp", "sy.webp", "ye.webp", "eg.webp"] },
    { name: "Saudi Arabia", file: "sa.webp", options: ["pk.webp", "ly.webp", "sa.webp", "dz.webp"] },
    { name: "United Arab Emirates", file: "ae.webp", options: ["ae.webp", "jo.webp"] },
    { name: "Turkey", file: "tr.webp", options: ["tr.webp", "tn.webp"] },
    { name: "Morocco", file: "ma.webp", options: ["vn.webp", "ma.webp", "so.webp", "al.webp"] },
    { name: "Israel", file: "il.webp", options: ["gr.webp", "fi.webp", "ar.webp", "il.webp"] },
    { name: "South Africa", file: "za.webp", options: ["za.webp", "jm.webp", "zw.webp", "bz.webp"] },
    { name: "Palestine", file: "ps.webp", options: ["ps.webp", "jo.webp"] },
    { name: "India", file: "in.webp", options: ["in.webp", "ne.webp"] },
    { name: "Vietnam", file: "vn.webp", options: ["cn.webp", "vn.webp", "me.webp", "hk.webp"] },
    { name: "Argentina", file: "ar.webp", options: ["uy.webp", "ar.webp", "sv.webp", "ni.webp"] },
    { name: "Netherlands", file: "nl.webp", options: ["nl.webp", "lu.webp"] },
    { name: "Thailand", file: "th.webp", options: ["th.webp", "cr.webp"] },
    { name: "Sweden", file: "se.webp", options: ["dk.webp", "no.webp", "se.webp", "is.webp"] },
    { name: "Poland", file: "pl.webp", options: ["pl.webp", "id.webp"] },
    { name: "Portugal", file: "pt.webp", options: ["es.webp", "pt.webp", "bb.webp", "gs.webp"] },
    { name: "Ukraine", file: "ua.webp", options: ["se.webp", "ua.webp", "kz.webp", "rw.webp"] },
    { name: "Belgium", file: "be.webp", options: ["be.webp", "de.webp"] },
    { name: "Slovakia", file: "sk.webp", options: ["sk.webp", "si.webp"] },
    { name: "Norway", file: "no.webp", options: ["no.webp", "is.webp"] },
    { name: "Romania", file: "ro.webp", options: ["ro.webp", "td.webp"] },
    { name: "Nepal", file: "np.webp", options: ["in.webp", "np.webp", "bt.webp", "tt.webp"] },
    { name: "Mexico", file: "mx.webp", options: ["mx.webp", "it.webp"] }
];

let currentFlagIndex = 0;
let flagScore = 0;
let canClickFlag = true;

function showFlagGetReady() {
    const home = document.getElementById('home-screen');
    if (home) home.style.display = 'none';

    let flagScreen = document.getElementById('flag-screen');
    if (!flagScreen) {
        flagScreen = document.createElement('div');
        flagScreen.id = 'flag-screen';
        document.body.appendChild(flagScreen);
    }

    flagScreen.classList.add('get-ready-screen'); 
    flagScreen.classList.add('active');

    // Vycentrujeme obrazovku
    flagScreen.style.display = 'flex';
    flagScreen.style.alignItems = 'center'; 
    flagScreen.style.justifyContent = 'center'; 

    flagScreen.innerHTML = `
        <div class="quiz-container ready-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <span class="ready-subtitle">GET READY</span>
            <h1 class="ready-title" style="margin-bottom: 20px;">Flag Finder</h1>
            
            <div class="ready-icon-container" style="margin: 20px 0 40px 0;">
                <img src="icons/gb.png" class="ready-flag-img animated-flag" alt="Flag" 
                     style="width: 120px; border-radius: 15px;">
            </div>

            <button id="flag-start-btn" class="magenta-btn">LET'S GO</button>
        </div>
    `;

    // Musíme znova priradiť event listener na nové tlačidlo
    document.getElementById('flag-start-btn').onclick = function() {
        if (typeof hapticClick === 'function') hapticClick(); 
        history.pushState({ screen: 'flags-game' }, ""); 
        startFlagQuiz(); 
    };
}

function startFlagQuiz() {
    // PRIDANÉ: Povieme histórii, že už sme v samotnej hre
    history.pushState({ screen: 'flags-game' }, "");

    const home = document.getElementById('home-screen');    
    const quiz = document.getElementById('quiz-screen');
    if (home) home.style.display = 'none';
    if (quiz) quiz.style.display = 'none';

    let flagScreen = document.getElementById('flag-screen');
    if (flagScreen) {
        flagScreen.style.display = 'flex';
        // Tu sa vkladá štruktúra hry
        flagScreen.innerHTML = `
            <div class="quiz-container">
                <div class="target-country-container">
                    <h2 id="target-country-name">Loading...</h2>
                </div>
                <div class="quiz-stats">
                    <span id="flag-counter">Question 1 of ${flagData.length}</span>
                    <span id="flag-score-text">Score: 0</span>
                </div>
                <div id="flag-grid" class="flag-grid"></div>
                <div class="progress-bar">
                    <div id="flag-progress" class="progress" style="width: 0%;"></div>
                </div>
                <button id="flag-next-btn" disabled>NEXT</button>
            </div>
        `;
    }

    flagScore = 0;
    currentFlagIndex = 0;

    // 2. Logika pre tlačidlo NEXT - TU JE TA ZMENA
    const nextBtn = document.getElementById('flag-next-btn');
    if (nextBtn) {
        nextBtn.onclick = function() {
            if (this.disabled) return;
            if (typeof hapticClick === 'function') hapticClick();

            currentFlagIndex++;
            if (currentFlagIndex < flagData.length) {
                renderFlagQuestion();
            } else {
                // TU SME VYHODILI ALERT A DALI TOTO:
                showFlagResults(); 
            }
        };
    }
    preloadFlagImages();
    renderFlagQuestion();
}


function renderFlagQuestion() {

    const question = flagData[currentFlagIndex];
    const grid = document.getElementById('flag-grid');
    const label = document.getElementById('target-country-name');
    const progress = document.getElementById('flag-progress');
    const counter = document.getElementById('flag-counter');
    const scoreDisplay = document.getElementById('flag-score-text');
    const nextBtn = document.getElementById('flag-next-btn');

    // Fade OUT grid
    grid.classList.add('is-swapping');

    setTimeout(() => {

        // Reset stavu pred novou otázkou
        canClickFlag = true;
        label.innerText = question.name;
        counter.innerText = `Question ${currentFlagIndex + 1} of ${flagData.length}`;
        scoreDisplay.innerText = `Score: ${flagScore}`;
        grid.innerHTML = '';

        // Zablokujeme tlačidlo NEXT, kým používateľ nevyberie vlajku
        nextBtn.disabled = true;

        // Aktualizácia progres baru
        progress.style.width = `${(currentFlagIndex / flagData.length) * 100}%`;

        // --- MIEŠANIE VLAJOK ---
        const shuffledOptions = shuffleArray([...question.options]);

        // Vykreslenie zamiešaných vlajok do mriežky (grid)
        shuffledOptions.forEach(flagFile => {
            const card = document.createElement('div');
            card.className = 'flag-card';
            card.innerHTML = `<img src="flags/${flagFile}" alt="flag">`;
            card.onclick = () => checkFlagAnswer(flagFile, card);
            grid.appendChild(card);
        });

        // Fade IN grid
        grid.classList.remove('is-swapping');

    }, 160);
}


function checkFlagAnswer(selectedFile, card) {
    if (!canClickFlag) return;
    canClickFlag = false;

    const question = flagData[currentFlagIndex];
    const nextBtn = document.getElementById('flag-next-btn'); // Hľadáme ho priamo tu

    // Zafarbenie karty
    if (selectedFile === question.file) {
        card.classList.add('correct');
        flagScore++;
        const scoreElem = document.getElementById('flag-score-text');
        if (scoreElem) scoreElem.innerText = `Score: ${flagScore}`;
        if (navigator.vibrate) navigator.vibrate(200);
    } else {
        card.classList.add('wrong');
        const allCards = document.querySelectorAll('.flag-card');
        allCards.forEach(c => {
            const img = c.querySelector('img');
            if (img && img.src.includes(question.file)) {
                c.classList.add('correct');
            }
        });
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    }

    // --- KRITICKÝ BOD: Odomknutie tlačidla ---
    if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
        nextBtn.style.pointerEvents = "auto"; // Pre istotu, ak by to CSS blokovalo
    }
}



function showFlagResults() {
    // 1. Skryjeme hru a ukážeme výsledky
    const flagScreen = document.getElementById('flag-screen');
    const resultScreen = document.getElementById('result-screen');
    if (flagScreen) flagScreen.style.display = 'none';
    if (resultScreen) {
        resultScreen.classList.add('active');
        resultScreen.style.display = 'flex';
    }

    // 2. Nastavíme skóre
    document.getElementById('final-score').textContent = flagScore;
    document.getElementById('max-score').textContent = flagData.length;

    // 3. TU JE TÁ ZMENA - PLAY AGAIN BUTTON
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        // Použijeme štýl priamo, aby sme obišli CSS chyby
        restartBtn.style.setProperty('background', '#ff00ff', 'important');
        restartBtn.style.setProperty('background-color', '#ff00ff', 'important');
        restartBtn.style.setProperty('box-shadow', '0 0 15px rgba(255, 0, 255, 0.5)', 'important');
        restartBtn.style.setProperty('border', 'none', 'important');
        
        restartBtn.textContent = 'PLAY AGAIN';

        restartBtn.onclick = function() {
            if (typeof hapticClick === 'function') hapticClick(); //
            resultScreen.style.display = 'none';
            resultScreen.classList.remove('active');
            startFlagQuiz(); //
        };
    }
}


