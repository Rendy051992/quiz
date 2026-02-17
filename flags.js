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

function safeVibrate(pattern) {
  // ak je globálne vypnutá vibrácia, nič neurob
  if (typeof isVibrationOn !== "undefined" && !isVibrationOn) return;

  // ak vibrácie existujú, vykonaj ich
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}



const flagData = [
    { name: "China", file: "cn.webp", options: ["cn.webp", "vn.webp", "tr.webp", "im.webp"] },
    { name: "United Kingdom", file: "gb.webp", options: ["fk.webp", "gb.webp", "au.webp", "gs.webp"] },
    { name: "France", file: "fr.webp", options: ["cu.webp", "ru.webp", "fr.webp", "rs.webp"] },
    { name: "Brazil", file: "br.webp", options: ["bd.webp", "pt.webp", "br.webp", "cx.webp"] },
    { name: "United States", file: "us.webp", options: ["us.webp", "lr.webp"] },
    { name: "Japan", file: "jp.webp", options: ["jp.webp", "pw.webp"] },
    { name: "Spain", file: "es.webp", options: ["ug.webp", "es.webp", "de.webp", "me.webp"] },
    { name: "Canada", file: "ca.webp", options: ["ca.webp", "pe.webp", "lb.webp", "ge.webp"] },
    { name: "Philippines", file: "ph.webp", options: ["sx.webp", "ph.webp", "cl.webp", "cz.webp"] },
    { name: "Greece", file: "gr.webp", options: ["uy.webp", "gr.webp", "ni.webp", "fi.webp"] },
    { name: "Australia", file: "au.webp", options: ["au.webp", "nz.webp"] },
    { name: "Indonesia", file: "id.webp", options: ["id.webp", "sg.webp"] },
    { name: "Ireland", file: "ie.webp", options: ["ie.webp", "ci.webp"] },
    { name: "South Korea", file: "kr.webp", options: ["kp.webp", "mt.webp", "kr.webp", "jp.webp"] },
    { name: "Switzerland", file: "ch.webp", options: ["at.webp", "ch.webp", "dk.webp", "to.webp"] },
    { name: "Kenya", file: "ke.webp", options: ["sz.webp", "ly.webp", "ke.webp", "mw.webp"] },
    { name: "Hungary", file: "hu.webp", options: ["tj.webp", "mx.webp", "hu.webp", "it.webp"] },
    { name: "Egypt", file: "eg.webp", options: ["iq.webp", "sy.webp", "ye.webp", "eg.webp"] },
    { name: "Saudi Arabia", file: "sa.webp", options: ["pk.webp", "tm.webp", "sa.webp", "dz.webp"] },
    { name: "United Arab Emirates", file: "ae.webp", options: ["ae.webp", "kw.webp"] },
    { name: "Turkey", file: "tr.webp", options: ["tr.webp", "tn.webp"] },
    { name: "Morocco", file: "ma.webp", options: ["vn.webp", "ma.webp", "so.webp", "al.webp"] },
    { name: "Ghana", file: "gh.webp", options: ["sn.webp", "cm.webp", "et.webp", "gh.webp"] },
    { name: "South Africa", file: "za.webp", options: ["za.webp", "jm.webp", "tz.webp", "kn.webp"] },
    { name: "Palestine", file: "ps.webp", options: ["ps.webp", "jo.webp"] },
    { name: "India", file: "in.webp", options: ["in.webp", "ne.webp"] },
    { name: "Venezuela", file: "ve.webp", options: ["co.webp", "ve.webp", "ad.webp", "ec.webp"] },
    { name: "Argentina", file: "ar.webp", options: ["uy.webp", "ar.webp", "sv.webp", "ni.webp"] },
    { name: "Netherlands", file: "nl.webp", options: ["nl.webp", "lu.webp"] },
    { name: "Thailand", file: "th.webp", options: ["th.webp", "cr.webp"] },
    { name: "Sweden", file: "se.webp", options: ["dk.webp", "no.webp", "se.webp", "is.webp"] },
    { name: "Poland", file: "pl.webp", options: ["pl.webp", "mc.webp"] },
    { name: "Nigeria", file: "ng.webp", options: ["nf.webp", "ng.webp", "bd.webp", "dz.webp"] },
    { name: "Ukraine", file: "ua.webp", options: ["se.webp", "ua.webp", "kz.webp", "rw.webp"] },
    { name: "Belgium", file: "be.webp", options: ["be.webp", "de.webp"] },
    { name: "Slovakia", file: "sk.webp", options: ["sk.webp", "si.webp"] },
    { name: "Norway", file: "no.webp", options: ["no.webp", "is.webp"] },
    { name: "Romania", file: "ro.webp", options: ["ro.webp", "td.webp"] },
    { name: "Nepal", file: "np.webp", options: ["ws.webp", "np.webp", "ao.webp", "tt.webp"] },
    { name: "Mexico", file: "mx.webp", options: ["mx.webp", "it.webp"] }
];

let currentFlagIndex = 0;
let flagScore = 0;
let canClickFlag = true;

function showFlagGetReady() {

  // history: keď už sme flags-ready (napr. po BACK), nepridávaj ďalší state
  if (history.state?.screen !== "flags-ready") {
    history.pushState({ screen: "flags-ready" }, "", "");
  }

  const home = document.getElementById("home-screen");
  if (home) home.style.display = "none";

  let flagScreen = document.getElementById("flag-screen");
  if (!flagScreen) {
    flagScreen = document.createElement("div");
    flagScreen.id = "flag-screen";
    document.body.appendChild(flagScreen);
  }

  // reset, aby sa nemiešali staré triedy z hry
  flagScreen.className = "get-ready-screen active";

  // vycentrovanie
  flagScreen.style.display = "flex";
  flagScreen.style.alignItems = "center";
  flagScreen.style.justifyContent = "center";

  // tvoj pôvodný dizajn
  flagScreen.innerHTML = `
    <div class="quiz-container ready-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
      <span class="ready-subtitle">GET READY</span>
      <h1 class="ready-title" style="margin-bottom: 20px;">Flag Finder</h1>

      <div class="ready-icon-container" style="margin: 20px 0 40px 0;">
        <img src="icons/gb.png" class="ready-flag-img animated-flag" alt="Flag"
             style="width: 110px; border-radius: 4px;">
      </div>

      <button id="flag-start-btn" class="magenta-btn">LET'S GO</button>
    </div>
  `;

  // LET'S GO: NEpushujeme tu flags-game, lebo to robí startFlagQuiz()
  const btn = document.getElementById("flag-start-btn");
  if (btn) {
    btn.onclick = function () {
      if (typeof hapticClick === "function") hapticClick();
      startFlagQuiz();
    };
  }
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
                        <div id="answer-status"></div>

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

  const grid = document.getElementById('flag-grid');
  const label = document.getElementById('target-country-name');
  const progress = document.getElementById('flag-progress');
  const counter = document.getElementById('flag-counter');
  const scoreDisplay = document.getElementById('flag-score-text');
  const nextBtn = document.getElementById('flag-next-btn');

  if (!grid || !label || !progress || !counter || !scoreDisplay || !nextBtn) return;

  // Fade OUT grid
  grid.classList.add('is-swapping');

  // počas prechodu zakáž kliky
  canClickFlag = false;

  setTimeout(() => {

    // otázku si zober až tu, aby bola vždy aktuálna
    const question = flagData[currentFlagIndex];

    // Nastavenie novej otázky
    label.innerText = question.name;
    
    counter.innerText = `Question ${currentFlagIndex + 1} of ${flagData.length}`;
    scoreDisplay.innerText = `Score: ${flagScore}`;

    const status = document.getElementById('answer-status');
if (status) {
  status.className = "";
  status.textContent = "";
}

    // Vyčistíme grid AŽ TERAZ (keď je schovaný)
    grid.innerHTML = '';

    // NEXT je znovu zakázané
    nextBtn.disabled = true;

    // Progress bar
    progress.style.width = `${(currentFlagIndex / flagData.length) * 100}%`;

    // Zamiešame vlajky
    const shuffledOptions = shuffleArray([...question.options]);

    // počítame, koľko obrázkov je už ready
    let loaded = 0;
    const total = shuffledOptions.length;

    // bezpečnostný fallback, keby niektorý obrázok zlyhal alebo sa zasekol
    const fallback = setTimeout(() => {
      grid.classList.remove('is-swapping');
      canClickFlag = true;
    }, 900);

    function markLoaded() {
      loaded++;
      if (loaded >= total) {
        clearTimeout(fallback);

        // Fade IN grid až keď sú všetky 4 obrázky načítané
        grid.classList.remove('is-swapping');

        // až TERAZ povolíme klik
        canClickFlag = true;
      }
    }

    // Vykreslíme nové vlajky
    shuffledOptions.forEach(flagFile => {
      const card = document.createElement('div');
      card.className = 'flag-card';

      const img = document.createElement('img');
      img.src = `flags/${flagFile}`;
      img.alt = 'flag';

      // keď sa img načíta alebo zlyhá, berieme to ako "hotovo"
      img.onload = markLoaded;
      img.onerror = markLoaded;

      card.appendChild(img);
      card.onclick = () => checkFlagAnswer(flagFile, card);

      grid.appendChild(card);
    });

  }, 160);
}


function checkFlagAnswer(selectedFile, card) {
    if (!canClickFlag) return;
    canClickFlag = false;

    const question = flagData[currentFlagIndex];
    const nextBtn = document.getElementById('flag-next-btn'); // Hľadáme ho priamo tu

    // ✅ PRIDANÉ: text CORRECT/WRONG pod country
    const status = document.getElementById('answer-status');
    const setStatus = (ok) => {
        if (!status) return;
        status.textContent = ok ? "CORRECT" : "WRONG";
        status.className = "show " + (ok ? "correct" : "wrong");
    };

    // Zafarbenie karty
if (selectedFile === question.file) {
    setStatus(true); // CORRECT
    card.classList.add('correct');
    flagScore++;
    const scoreElem = document.getElementById('flag-score-text');
    if (scoreElem) scoreElem.innerText = `Score: ${flagScore}`;
    safeVibrate(140);

} else {
    setStatus(false); // WRONG
    card.classList.add('wrong');
    const allCards = document.querySelectorAll('.flag-card');
    allCards.forEach(c => {
        const img = c.querySelector('img');
        if (img && img.src.includes(question.file)) {
            c.classList.add('correct');
        }
    });
safeVibrate([180, 90, 180]);
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






