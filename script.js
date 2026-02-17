function initAppStart() {
  // funkcia ktorá bude obsahovať kód po načítaní app
  // Hneď po načítaní aplikácie povieme, že sme v menu
}

// 1. NASTAVENIE PREMENNÝCH
// Táto premenná si pamätá, či hráč chce vibrácie alebo nie
let isVibrationOn = true;

function initSplash() {
  // splash logika zabalená do funkcie
  const splash = document.getElementById("splash"); // splash wrapper v HTML
  const homeScreen = document.getElementById("home-screen"); // tvoje menu
  const startScreen = document.getElementById("start-screen"); // start screen (ak existuje)

  if (homeScreen) homeScreen.style.display = "none"; // hneď skry menu, nech vidno len splash
  if (startScreen) startScreen.classList.remove("active"); // zruš active start screen, aby neprekrýval

  setTimeout(() => {
    // počkaj chvíľu, potom splash schovaj
    if (homeScreen) {
      homeScreen.style.display = "flex"; // ukáž menu
      homeScreen.classList.remove("hidden"); // poistka, ak používaš hidden class
    }

    if (splash) splash.classList.add("is-hiding"); // animácia schovania splashu
    document.body.classList.remove("preboot"); // odomkni body po splashi

    setTimeout(() => {
      // po animácii splash úplne skry
      if (splash) splash.classList.add("is-hidden"); // úplne ho odstráň z view
    }, 400);
  }, 1500);
}

// script.js - CENTRÁLNY MOZOG PRE TLAČIDLO SPÄŤ
function initAndroidBackButton() {
  // zabalím back button logiku do funkcie
  const App = window.Capacitor?.Plugins?.App; // vezmem Capacitor App plugin
  if (!App) return; // ak nie je (web), nič nerobím

  App.addListener("backButton", () => {
    // listener pre Android hardware BACK
    const s = window.history.state?.screen || "menu"; // zistím, kde som (fallback menu)
    if (s === "menu") {
      // ak som na menu
      App.exitApp(); // zavriem appku
      return; // stop
    }
    window.history.back(); // inak normálny krok späť
  });
}

// --- PRIORITA 2: QUIZ / FLAGS (Get Ready alebo Result) ---
function initAndroidBackButton() {
  // back button logika v 1 funkcii
  const App = window.Capacitor?.Plugins?.App; // Capacitor App plugin
  if (!App) return; // na webe nič nerobíme

  App.addListener("backButton", () => {
    // Android hardware BACK

    const s = window.history.state?.screen || "menu"; // kde som (fallback menu)

    // ===== PRIORITA: ak som v Get Ready alebo Result, vždy sa vrátim do menu =====
    const flagsReady = document.getElementById("flags-ready");
    const quizReady = document.getElementById("quiz-ready");
    const quizGame = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const home = document.getElementById("home-screen");

    const isGetReady =
      (flagsReady && flagsReady.style.display !== "none") ||
      (quizReady && quizReady.style.display !== "none");

    const isResult = resultScreen && resultScreen.style.display !== "none";

    if (isGetReady || isResult) {
      [flagsReady, quizReady, quizGame, resultScreen].forEach((el) => {
        if (el) el.style.setProperty("display", "none", "important");
      });

      if (home) {
        home.style.setProperty("display", "flex", "important");
        home.classList.remove("hidden");
      }

      history.pushState({ screen: "menu" }, "", ""); // nastav menu do histórie
      return; // tu je return OK, lebo sme vo funkcii callback
    }

    // ===== ak som na menu, zavri appku =====
    if (s === "menu") {
      App.exitApp();
      return;
    }

    // ===== inak normálny krok späť =====
    window.history.back();
  });
}

// RECEPT 1: Jemné ťuknutie (Haptic) - na tlačidlá, kategórie, Next
function hapticClick() {
  if (isVibrationOn && navigator.vibrate) {
    navigator.vibrate(60); // Len také bzz-tuk
  }
}

// =========================
// INIT UI ICONS (JEDINÝ DOMContentLoaded v tomto súbore)
// =========================
function initInfoModal() {
  // init pre Info modal
  const infoBtn = document.getElementById("info-btn"); // tlačidlo Info
  const modal = document.getElementById("info-modal"); // modal okno
  const close = document.getElementById("info-close"); // X button

  if (!infoBtn || !modal || !close) return; // ak niečo chýba, nič nerobím

  infoBtn.addEventListener("click", () => {
    // otvorím modal
    modal.classList.add("open"); // pridám triedu open
  });

  close.addEventListener("click", () => {
    // zavriem modal
    modal.classList.remove("open"); // odstránim triedu open
  });

  modal.addEventListener("click", (e) => {
    // klik mimo obsahu zatvorí modal
    if (e.target === modal) modal.classList.remove("open"); // klik na pozadie
  });
}

// =========================
// 3. POUŽITIE VIBRÁCIE V HRE
// Túto funkciu volaj pri zlej odpovedi
// =========================
function triggerVibration() {
  // ✅ vibruj iba keď je ON a mobil to podporuje
  if (isVibrationOn && navigator.vibrate) {
    navigator.vibrate(200); // krátka vibrácia 200ms
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash");
  const homeScreen = document.getElementById("home-screen");
  const startScreen = document.getElementById("start-screen");

  // A. OKAMŽITE po načítaní schováme všetko okrem splashu
  if (homeScreen) homeScreen.style.display = "none";
  if (startScreen) startScreen.classList.remove("active");

  // B. SPLASH LOGIKA
  setTimeout(() => {
    if (homeScreen) {
      homeScreen.style.display = "flex";
      homeScreen.classList.remove("hidden");
    }

    if (splash) splash.classList.add("is-hiding");
    document.body.classList.remove("preboot");

    setTimeout(() => {
      if (splash) splash.classList.add("is-hidden");
    }, 400);
  }, 1500);

  // D. KLIKANIE NA KATEGÓRIE - UPRAVENÁ VERZIA
  document.querySelectorAll(".category-card, .category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category") || "";
      // MAPS – COMING SOON
      if (category === "maps") {
        // klik na Map Master

        window.showMaps(); // ukážem globe-screen (a schovám menu)

    
      }

      // 1. OŠETRENIE PRÍSTUPU
      // 1. LOGIKA PRE FLAGS
      if (category === "flags") {
        if (typeof hapticClick === "function") hapticClick();
        btn.blur();

        // 1. ZÁPIS DO HISTÓRIE (bez tohto Späť nefunguje)

        // 2. SKRYJEME MENU
        const home = document.getElementById("home-screen");
        if (home) {
          home.classList.add("hidden");
          home.style.setProperty("display", "none", "important");
        }
        document
          .querySelectorAll(
            ".menu-title, .menu-grid, .category-card, .category-btn, .menu-wrap",
          )
          .forEach((el) =>
            el.style.setProperty("display", "none", "important"),
          );

        // 3. UKÁŽEME KARTU
        showFlagGetReady();
        return;
      }

      // 2. LOGIKA PRE QUIZ
      if (typeof hapticClick === "function") hapticClick();

      // --- PRIDANÝ RESET MAPY (Dôležité!) ---
      document.body.classList.remove("maps-mode"); // Vypne mapový režim v CSS
      const mapScreen = document.getElementById("maps-screen");
      if (mapScreen) {
        mapScreen.style.setProperty("display", "none", "important"); // Natvrdo schová mapu
      }
      // --------------------------------------

      history.pushState({ screen: "quiz-ready" }, "", "");
      localStorage.setItem("selectedCategory", "quiz");

      // schov menu
      document.getElementById("home-screen")?.classList.add("hidden");
      document
        .getElementById("home-screen")
        ?.style.setProperty("display", "none", "important");
      document
        .querySelectorAll(
          ".menu-title, .menu-grid, .category-card, .category-btn, .menu-wrap",
        )
        .forEach((el) => el.style.setProperty("display", "none", "important"));

      // ukaz Get Ready
      if (startScreen) {
        startScreen.style.display = "flex";
        startScreen.classList.add("active");
      }

      // hide menu: try multiple safe targets
      btn.closest("#home-screen")?.classList.add("hidden");
      document.getElementById("home-screen")?.classList.add("hidden");
      document.querySelector(".home")?.classList.add("hidden");

      document
        .getElementById("home-screen")
        ?.style.setProperty("display", "none", "important");
      document
        .querySelector(".home")
        ?.style.setProperty("display", "none", "important");
      document
        .querySelectorAll(
          ".menu-title, .menu-grid, .category-card, .category-btn",
        )
        .forEach((el) => el.style.setProperty("display", "none", "important"));

      if (startScreen) startScreen.classList.add("active");
      document
        .querySelector(".menu-wrap")
        ?.style.setProperty("display", "none", "important");
    });
  });
});

// DOM Elements, references to HTML elements
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

// ===== MAPS RESULT (uses the same result screen as Classic/Flags) =====

function pushScreen(screen) {
  history.pushState({ screen }, "", "");
}

function initVibrationToggle() { // ja nastavím vibro ikonku ON, OFF + klik
  const btn = document.getElementById("vibration-btn"); // ja nájdem ikonku v HTML
  if (!btn) return; // ja skončím ak ikonka neexistuje

  const saved = localStorage.getItem("gv_vibration"); // ja načítam uložený stav
  if (saved !== null) isVibrationOn = saved === "1"; // ja nastavím globálny prepínač

  const applyIcon = () => { // ja vždy prekreslím ikonku podľa stavu
    btn.src = isVibrationOn ? "icons/vibration_on.png" : "icons/vibration_off.png"; // ja prepnem obrázok
    btn.alt = isVibrationOn ? "Vibration on" : "Vibration off"; // ja prepnem alt text
    btn.setAttribute("aria-pressed", isVibrationOn ? "true" : "false"); // ja dám správny a11y stav
  };

  applyIcon(); // ja nastavím ikonku hneď po štarte

  btn.addEventListener("click", () => { // ja reagujem na klik
    isVibrationOn = !isVibrationOn; // ja prepnem ON, OFF
    localStorage.setItem("gv_vibration", isVibrationOn ? "1" : "0"); // ja si to uložím
    applyIcon(); // ja hneď zmením ikonku
    if (isVibrationOn && navigator.vibrate) navigator.vibrate(20); // ja krátko zavibrujem ako potvrdenie
  });
}


document.addEventListener("DOMContentLoaded", () => {
  if (!window.history.state) {
    history.replaceState({ screen: "menu" }, "", "");
  }

  initSplash(); // 👈 pridaj splash
  initAndroidBackButton(); // Android back
  initInfoModal(); // info modal
  // initUIIcons(); // dočasne vypnuté – test výkonu  initVibrationToggle(); // ja zapnem vibro ikonku ON, OFF

  initVibrationToggle(); // ja zapnem vibro ikonku ON, OFF


  // initWhateverElse(); // ✅ dočasne vypnuté, lebo nie je definovaná a padá celý script
});

const startButton = document.getElementById("start-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");

const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");

const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");

const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");

const progressBar = document.getElementById("progress");
const answerImage = document.getElementById("answer-image");

const nextBtn = document.getElementById("next-btn");

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
}

const quizQuestions = [
  {
    question: "What is the capital city of Australia?",
    correctImage: "images/img1.webp",
    answers: [
      { text: "Sydney", correct: false },
      { text: "Melbourne", correct: false },
      { text: "Canberra", correct: true },
      { text: "Perth", correct: false },
    ],
  },
  {
    question: "Which river is the longest in the world?",
    correctImage: "images/img2.webp",
    answers: [
      { text: "Amazon", correct: false },
      { text: "Yangtze", correct: false },
      { text: "Nile", correct: true },
      { text: "Mississippi", correct: false },
    ],
  },
  {
    question: "On which continent is Egypt located?",
    correctImage: "images/img3.webp",
    answers: [
      { text: "Asia", correct: false },
      { text: "Europe", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    correctImage: "images/img4.webp",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question: "Which country has the largest population in the world?",
    correctImage: "images/img5.webp",
    answers: [
      { text: "China", correct: false },
      { text: "USA", correct: false },
      { text: "India", correct: true },
      { text: "Russia", correct: false },
    ],
  },
  {
    question: "What mountain range separates Europe and Asia?",
    correctImage: "images/img6.webp",
    answers: [
      { text: "Alps", correct: false },
      { text: "Carpathians", correct: false },
      { text: "Ural Mountains", correct: true },
      { text: "Himalayas", correct: false },
    ],
  },
  {
    question: "What is the capital of Canada?",
    correctImage: "images/img7.webp",
    answers: [
      { text: "Toronto", correct: false },
      { text: "Vancouver", correct: false },
      { text: "Ottawa", correct: true },
      { text: "Montreal", correct: false },
    ],
  },
  {
    question: "Which desert is the largest hot desert in the world?",
    correctImage: "images/img8.webp",
    answers: [
      { text: "Antarctica", correct: false },
      { text: "Kalahari", correct: false },
      { text: "Sahara Desert", correct: true },
      { text: "Atacama", correct: false },
    ],
  },
  {
    question: "Through which city does the River Thames flow?",
    correctImage: "images/img9.webp",
    answers: [
      { text: "Oxford", correct: false },
      { text: "Manchester", correct: false },
      { text: "London", correct: true },
      { text: "Bristol", correct: false },
    ],
  },
  {
    question: "What is the smallest country in the world by area?",
    correctImage: "images/img10.webp",
    answers: [
      { text: "Monaco", correct: false },
      { text: "San Marino", correct: false },
      { text: "Vatican City", correct: true },
      { text: "Liechtenstein", correct: false },
    ],
  },
  {
    question: "Which continent has the most countries?",
    correctImage: "images/img11.webp",
    answers: [
      { text: "Asia", correct: false },
      { text: "Europe", correct: false },
      { text: "Africa", correct: true },
      { text: "South America", correct: false },
    ],
  },
  {
    question: "What is the capital of Japan?",
    correctImage: "images/img12.webp",
    answers: [
      { text: "Kyoto", correct: false },
      { text: "Osaka", correct: false },
      { text: "Tokyo", correct: true },
      { text: "Hiroshima", correct: false },
    ],
  },
  {
    question: "Which sea lies between Europe and Africa?",
    correctImage: "images/img13.webp",
    answers: [
      { text: "Black Sea", correct: false },
      { text: "Red Sea", correct: false },
      { text: "Mediterranean Sea", correct: true },
      { text: "Baltic Sea", correct: false },
    ],
  },
  {
    question: "What country has the longest coastline in the world?",
    correctImage: "images/img14.webp",
    answers: [
      { text: "Russia", correct: false },
      { text: "Australia", correct: false },
      { text: "Canada", correct: true },
      { text: "USA", correct: false },
    ],
  },
  {
    question: "What is the highest mountain in the world?",
    correctImage: "images/img15.webp",
    answers: [
      { text: "K2", correct: false },
      { text: "Kangchenjunga", correct: false },
      { text: "Mount Everest", correct: true },
      { text: "Lhotse", correct: false },
    ],
  },
  {
    question: "Which country is known as the Land of a Thousand Lakes?",
    correctImage: "images/img16.webp",
    answers: [
      { text: "Norway", correct: false },
      { text: "Sweden", correct: false },
      { text: "Finland", correct: true },
      { text: "Canada", correct: false },
    ],
  },
  {
    question: "What is the capital city of Brazil?",
    correctImage: "images/img17.webp",
    answers: [
      { text: "Rio de Janeiro", correct: false },
      { text: "São Paulo", correct: false },
      { text: "Brasília", correct: true },
      { text: "Salvador", correct: false },
    ],
  },
  {
    question: "Which US state is the largest by area?",
    correctImage: "images/img18.webp",
    answers: [
      { text: "Texas", correct: false },
      { text: "California", correct: false },
      { text: "Alaska", correct: true },
      { text: "Montana", correct: false },
    ],
  },
  {
    question: "In which country would you find Machu Picchu?",
    correctImage: "images/img19.webp",
    answers: [
      { text: "Bolivia", correct: false },
      { text: "Chile", correct: false },
      { text: "Peru", correct: true },
      { text: "Ecuador", correct: false },
    ],
  },
  {
    question:
      "What is the name of the imaginary line that divides Earth into Northern and Southern Hemispheres?",
    correctImage: "images/img20.webp",
    answers: [
      { text: "Prime Meridian", correct: false },
      { text: "Tropic of Cancer", correct: false },
      { text: "Equator", correct: true },
      { text: "Arctic Circle", correct: false },
    ],
  },
  {
    question: "Which continent is the coldest on Earth?",
    correctImage: "images/img21.webp",
    answers: [
      { text: "Europe", correct: false },
      { text: "Asia", correct: false },
      { text: "Antarctica", correct: true },
      { text: "North America", correct: false },
    ],
  },
  {
    question: "What river flows through Paris?",
    correctImage: "images/img22.webp",
    answers: [
      { text: "Rhine", correct: false },
      { text: "Danube", correct: false },
      { text: "Seine", correct: true },
      { text: "Loire", correct: false },
    ],
  },
  {
    question:
      "Which country has coastline on both the Atlantic and Indian Oceans?",
    correctImage: "images/img23.webp",
    answers: [
      { text: "Mozambique", correct: false },
      { text: "Kenya", correct: false },
      { text: "South Africa", correct: true },
      { text: "Durban", correct: false },
    ],
  },
  {
    question: "Which country does Mount Fuji belong to?",
    correctImage: "images/img24.webp",
    answers: [
      { text: "China", correct: false },
      { text: "South Korea", correct: false },
      { text: "Japan", correct: true },
      { text: "Thailand", correct: false },
    ],
  },
  {
    question: "What is the largest island in the world?",
    correctImage: "images/img25.webp",
    answers: [
      { text: "Australia", correct: false },
      { text: "Borneo", correct: false },
      { text: "Greenland", correct: true },
      { text: "Madagascar", correct: false },
    ],
  },
  {
    question: "Which European country has the most volcanoes?",
    correctImage: "images/img26.webp",
    answers: [
      { text: "Italy", correct: false },
      { text: "Greece", correct: false },
      { text: "Iceland", correct: true },
      { text: "Spain", correct: false },
    ],
  },
  {
    question: "What is the capital of Norway?",
    correctImage: "images/img27.webp",
    answers: [
      { text: "Bergen", correct: false },
      { text: "Trondheim", correct: false },
      { text: "Oslo", correct: true },
      { text: "Stavanger", correct: false },
    ],
  },
  {
    question: "Which ocean lies on the east coast of the United States?",
    correctImage: "images/img28.webp",
    answers: [
      { text: "Pacific Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Atlantic Ocean", correct: true },
      { text: "Arctic Ocean", correct: false },
    ],
  },
  {
    question:
      "Which country is the largest island nation in the world (consisting of over 17,000 islands)?",
    correctImage: "images/img29.webp",
    answers: [
      { text: "Japan", correct: false },
      { text: "Madagascar", correct: false },
      { text: "Indonesia", correct: true },
      { text: "Kazakhstan", correct: false },
    ],
  },
  {
    question: "What is the capital city of Argentina?",
    correctImage: "images/img30.webp",
    answers: [
      { text: "Córdoba", correct: false },
      { text: "Rosario", correct: false },
      { text: "Buenos Aires", correct: true },
      { text: "Mendoza", correct: false },
    ],
  },
];

const flagsQuestions = [
  {
    question: "Which country has this flag?",
    correctImage: "images/flags/flag1.webp",
    answers: [
      { text: "France", correct: true },
      { text: "Netherlands", correct: false },
      { text: "Russia", correct: false },
      { text: "Italy", correct: false },
    ],
  },
  {
    question: "Which country has this flag?",
    correctImage: "images/flags/flag2.webp",
    answers: [
      { text: "Japan", correct: true },
      { text: "Bangladesh", correct: false },
      { text: "South Korea", correct: false },
      { text: "China", correct: false },
    ],
  },
];

const mapQuestions = [
  {
    question: "Where is this place?",
    correctImage: "images/maps/map1.webp",
    answers: [
      { text: "India", correct: true },
      { text: "Brazil", correct: false },
      { text: "Australia", correct: false },
      { text: "Egypt", correct: false },
    ],
  },
  {
    question: "Where is this place?",
    correctImage: "images/maps/map2.webp",
    answers: [
      { text: "Italy", correct: true },
      { text: "Spain", correct: false },
      { text: "Greece", correct: false },
      { text: "Turkey", correct: false },
    ],
  },
];

// --- 1. QUIZ STATE VARS ---
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let lastPointerDownAt = 0;

// Nastavenie textov na začiatku
if (totalQuestionsSpan) totalQuestionsSpan.textContent = quizQuestions.length;
if (maxScoreSpan) maxScoreSpan.textContent = quizQuestions.length;

// --- 2. EVENT LISTENERS (Tlačidlá) ---

// Start Button
if (startButton) {
  startButton.addEventListener("click", () => {
    hapticClick();
    startQuiz();
  });
}

// Restart Button
if (restartButton) {
  restartButton.addEventListener("click", () => {
    hapticClick();
    restartQuiz();
  });
}

// Next Button (Ošetrený cez ID pre istotu)
const nextBtnElement = document.getElementById("next-btn");
if (nextBtnElement) {
  nextBtnElement.addEventListener("click", () => {
    hapticClick();
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  });
}

// --- 3. FUNKCIE ---

function startQuiz() {
  pushScreen("quiz-ready");
  currentQuestionIndex = 0;
  score = 0;
  if (scoreSpan) scoreSpan.textContent = "0";

  if (startScreen) startScreen.classList.remove("active");
  if (quizScreen) quizScreen.classList.add("active");

  showQuestion();
}

function resetAnswerUI() {
  if (quizScreen) {
    quizScreen.classList.add("picking");
    quizScreen.classList.remove("answered");
  }

  answersDisabled = false;
  if (answersContainer) answersContainer.classList.remove("answers-disabled");

  if (answerImage) {
    answerImage.style.display = "none";
    answerImage.src = "";
  }

  // Deaktivujeme Next button pri novej otázke
  const nxt = document.getElementById("next-btn");
  if (nxt) nxt.disabled = true;

  // RESET STATUS (WRONG/CORRECT) pri novej otázke
  const status = document.getElementById("quiz-answer-status");
  if (status) {
    status.textContent = "";
    status.classList.remove("show", "correct", "wrong");
  }
}

function showQuestion() {
  document.querySelector(".container")?.classList.remove("answered-mode");
  const c = document.querySelector(".container");
  if (c) c.classList.remove("answered-mode");

  if (quizScreen) {
    quizScreen.classList.add("picking");
    quizScreen.classList.remove("answered");
  }

  resetAnswerUI();

  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (currentQuestionSpan)
    currentQuestionSpan.textContent = String(currentQuestionIndex + 1);

  const progressPercent = (currentQuestionIndex / quizQuestions.length) * 100;
  if (progressBar) progressBar.style.width = progressPercent + "%";

  if (questionText) questionText.textContent = currentQuestion.question;

  if (answersContainer) {
    answersContainer.innerHTML = "";
    const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

    shuffledAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = answer.text;
      button.classList.add("answer-btn");
      button.dataset.correct = answer.correct ? "true" : "false";

      // Eventy pre mobil a PC
      button.addEventListener("pointerdown", onAnswerTap, { passive: true });
      button.addEventListener("click", onAnswerTap);

      answersContainer.appendChild(button);
    });
  }
}

function onAnswerTap(event) {
  hapticClick();

  // Mobile logic
  const now = Date.now();
  if (event.type === "pointerdown") {
    lastPointerDownAt = now;
  } else if (event.type === "click") {
    if (now - lastPointerDownAt < 700) return;
  }

  if (answersDisabled) return;

  const selectedButton = event.currentTarget;
  if (!selectedButton) return;

  answersDisabled = true;

  // answered-mode ON (iba raz, bezpečne)
  document.querySelector(".container")?.classList.add("answered-mode");

  if (answersContainer) answersContainer.classList.add("answers-disabled");

  // posun len pred odpoveďou, po odpovedi vrátiť naspäť
  if (quizScreen) {
    quizScreen.classList.remove("picking");
    quizScreen.classList.add("answered");
  }

  // ODOMKNUTIE NEXT BUTTONU
  const nxt = document.getElementById("next-btn");
  if (nxt) nxt.disabled = false;

  const isCorrect = selectedButton.dataset.correct === "true";
  selectedButton.classList.add(isCorrect ? "correct" : "incorrect");

  const correctBtn = answersContainer?.querySelector('[data-correct="true"]');
  if (correctBtn) correctBtn.classList.add("correct");

  const status = document.getElementById("quiz-answer-status");

  // QUIZ ANSWER RESULT
  if (isCorrect) {
    if (status) {
      status.textContent = "CORRECT";
      status.className = "show correct";
    }

    score++;
    if (scoreSpan) scoreSpan.textContent = String(score);

    if (isVibrationOn && navigator.vibrate) navigator.vibrate(140);
  } else {
    if (status) {
      status.textContent = "WRONG";
      status.className = "show wrong";
    }

    if (isVibrationOn && navigator.vibrate) navigator.vibrate([180, 90, 180]);
  }

  // Ukáž správny obrázok (ak ho máš)
  const currentQuestion = quizQuestions[currentQuestionIndex];
  if (currentQuestion && currentQuestion.correctImage && answerImage) {
    answerImage.classList.add("show");
    answerImage.src = currentQuestion.correctImage;
    answerImage.style.display = "block";
    answerImage.style.visibility = "visible";
  }
}

function showResults() {
  const container = document.querySelector(".container");
  if (container) container.style.display = "none";
  if (quizScreen) quizScreen.classList.remove("active");

  if (resultScreen) {
    resultScreen.classList.add("active");
    resultScreen.style.display = "flex";
  }

  const percentage = (score / quizQuestions.length) * 100;
  let message = "";
  if (percentage === 100) message = "Perfect! You're a genius! 🏆";
  else if (percentage >= 80) message = "Great job! You know your stuff! ✨";
  else if (percentage >= 50) message = "Good effort! Keep learning! 📚";
  else if (percentage >= 20) message = "Not bad! Try again to improve! 💪";
  else message = "Keep studying! You'll get better! 🌍";

  const resultMsgElement = document.getElementById("result-message");
  const finalScoreElement = document.getElementById("final-score");
  const maxScoreElement = document.getElementById("max-score");

  if (resultMsgElement) resultMsgElement.textContent = message;
  if (finalScoreElement) finalScoreElement.textContent = score;
  if (maxScoreElement) maxScoreElement.textContent = quizQuestions.length;
}

function restartQuiz() {
  if (resultScreen) {
    resultScreen.classList.remove("active");
    resultScreen.style.display = "none";
  }

  const container = document.querySelector(".container");
  if (container) {
    container.style.display = "flex";
    container.style.width = "";
  }

  currentQuestionIndex = 0;
  score = 0;
  if (scoreSpan) scoreSpan.textContent = "0";

  startQuiz();
}

// ORIENTATION (len 1x)
function checkOrientation() {
  const overlay = document.getElementById("rotate-overlay");
  if (!overlay) return;

  const isLandscape = window.innerWidth > window.innerHeight;
  const inMaps = document.body.classList.contains("maps-mode");

  // MAPS: povolený landscape, zakázaný portrait
  // MAPS, nič nezakazujeme, overlay v Maps nikdy nezobrazuj
  if (inMaps) {
    overlay.style.setProperty("display", "none", "important");
    overlay.style.pointerEvents = "none";
    return;
  }
  if (inMaps) {
    overlay.style.setProperty(
      "display",
      isLandscape ? "none" : "flex",
      "important",
    );
    overlay.style.pointerEvents = isLandscape ? "none" : "auto";
    return;
  }

  // OSTATNÉ: zakázaný landscape, povolený portrait
  overlay.style.setProperty(
    "display",
    isLandscape ? "flex" : "none",
    "important",
  );
  overlay.style.pointerEvents = isLandscape ? "auto" : "none";
}

window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
checkOrientation();

//-----------------------------------------------------------------------------------------------------------------------------------------

// BACK BUTTON
window.onpopstate = function (event) {
  const s = event.state?.screen || "menu";

  // MAPS
  if (s === "maps") {
    document.body.classList.add("maps-mode");
    if (typeof checkOrientation === "function") checkOrientation();

    if (typeof hideAllScreens === "function") hideAllScreens();
    const ms = document.getElementById("maps-screen");
    if (ms) ms.style.display = "block";

    if (typeof startNewMapRound === "function") startNewMapRound();
    return;
  }

  //---------------------------------------------------------------------------------------------------------------------------------

  // MENU
  if (s === "menu") {
    document.body.classList.remove("maps-mode");
    if (typeof checkOrientation === "function") checkOrientation();

    const home = document.getElementById("home-screen");
    const start = document.getElementById("start-screen");
    const quiz = document.getElementById("quiz-screen");
    const flag = document.getElementById("flag-screen");
    const result = document.getElementById("result-screen");

    if (start) {
      start.style.display = "none";
      start.classList.remove("active");
    }
    if (quiz) quiz.classList.remove("active");
    if (flag) {
      flag.style.display = "none";
      flag.classList.remove("active");
    }
    if (result) {
      result.style.display = "none";
      result.classList.remove("active");
    }

    if (home) {
      home.classList.remove("hidden");
      home.style.setProperty("display", "flex", "important");
    }

    document
      .querySelectorAll(
        ".menu-title, .menu-grid, .category-card, .category-btn, .menu-wrap",
      )
      .forEach((el) => el.style.setProperty("display", "", "important"));

    return;
  }

  // QUIZ READY
  if (s === "quiz-ready") {
    const home = document.getElementById("home-screen");
    const start = document.getElementById("start-screen");
    const quiz = document.getElementById("quiz-screen");

    if (home) home.style.setProperty("display", "none", "important");
    if (quiz) quiz.classList.remove("active");
    if (start) {
      start.style.display = "flex";
      start.classList.add("active");
    }
    return;
  }

  // QUIZ GAME
  if (s === "quiz") {
    const start = document.getElementById("start-screen");
    const quiz = document.getElementById("quiz-screen");

    if (start) {
      start.style.display = "none";
      start.classList.remove("active");
    }
    if (quiz) quiz.classList.add("active");
    return;
  }

  // FLAGS READY
  if (s === "flags-ready") {
    if (typeof showFlagGetReady === "function") showFlagGetReady();
    return;
  }

  // FLAGS GAME
  if (s === "flags-game") {
    if (typeof startFlagQuiz === "function") startFlagQuiz();
    return;
  }
};

// =========================
// INFO MODAL – OPEN / CLOSE
// =========================

function initInfoModal() {
  // funkcia pre info modal

  const infoBtn = document.getElementById("info-btn"); // ikonka info
  const infoModal = document.getElementById("info-modal"); // celé okno
  const infoClose = document.getElementById("info-close"); // Close tlačidlo
  const infoBackdrop = infoModal?.querySelector(".info-backdrop"); // tmavé pozadie

  // OTVORENIE
  if (infoBtn && infoModal) {
    infoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      infoModal.classList.remove("hidden");
    });
  }

  // ZATVORENIE – Close button
  if (infoClose && infoModal) {
    infoClose.addEventListener("click", () => {
      infoModal.classList.add("hidden");
    });
  }

  // ZATVORENIE – klik na tmavé pozadie
  if (infoBackdrop && infoModal) {
    infoBackdrop.addEventListener("click", () => {
      infoModal.classList.add("hidden");
    });
  }
} // koniec initInfoModal

// ===== MAPS BUTTON (temporary) =====
window.showMaps = function () {
  // klik na Maps musí mať čo spustiť
  const globeScreen = document.getElementById("globe-screen"); // môj nový 3D glóbus screen
  if (!globeScreen) return; // ak ho nenájdem, neurobím nič

  // schovám všetky ostatné screeny, aby mi tam nezostal Classic/Flags
  const screens = [
    "home-screen",
    "quiz-screen",
    "start-screen",
    "flag-screen",
    "result-screen",
    "maps-screen",
  ]; // maps-screen tam nechávam len keby ešte existoval
  screens.forEach((id) => {
    const el = document.getElementById(id); // nájdem screen podľa id
    if (el) el.style.display = "none"; // skryjem ho
  });

  // schovám všetky overlays, ktoré môžu ostať visieť nad tým
  const overlays = [
    "maps-start-overlay",
    "maps-overlay",
    "start-overlay",
    "quiz-overlay",
  ];
  overlays.forEach((id) => {
    const el = document.getElementById(id); // nájdem overlay podľa id
    if (el) el.style.display = "none"; // schovám ho
  });

  globeScreen.style.display = "block"; // ukážem glóbus
};

//-------------------------------------------------------------------------------------------------------------------------------------------

// ===== GLOBE PRELOAD pri štarte (na pozadí) =====
(function () {
  if (window.__globePreloadStarted) return;
  window.__globePreloadStarted = true;

  const start = () => {
    requestAnimationFrame(() => {
      document.body.classList.add("globe-preload"); // nech má globe reálnu veľkosť, ale je neviditeľný

      Promise.resolve(window.initGlobeOnce?.()) // počkaj na reálny koniec initu
        .catch(() => {}) // nech to nezabije appku, ak sa niečo pokazí
        .finally(() => {
          document.body.classList.remove("globe-preload"); // zlož až keď je hotovo
        });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
