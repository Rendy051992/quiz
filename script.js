// ===== GLOBAL SOUND SETTINGS (shared for whole app) =====
window.SOUND = {
  enabled: localStorage.getItem("soundEnabled") !== "0",
  setEnabled(value) {
    this.enabled = !!value;
    localStorage.setItem("soundEnabled", this.enabled ? "1" : "0");
  }
};

// ===== SFX (correct, wrong) pre Classic Quiz =====
window.SFX = window.SFX || {}; // aby to nepadalo, ak už existuje

const sfxCorrect = new Audio("audio/correct.mp3"); sfxCorrect.preload = "auto"; sfxCorrect.volume = 0.80;
const sfxWrong   = new Audio("audio/wrong.mp3");   sfxWrong.preload = "auto";   sfxWrong.volume = 0.85;

window.SFX.correct = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try { sfxCorrect.currentTime = 0; sfxCorrect.play().catch(() => {}); } catch (e) {}
};

window.SFX.wrong = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try { sfxWrong.currentTime = 0; sfxWrong.play().catch(() => {}); } catch (e) {}
};

// ===== UI CLICK SOUND (100% stable, no mp3, no delay, categories ON, Classic answers OFF) =====
(function () {
  if (window.__gvUiClickInit) return;
  window.__gvUiClickInit = true;

  let ctx = null;

  // anti double, aby sa jeden tap nezmenil na 2-3 zvuky
  let lastAt = 0;
  const MIN_GAP_MS = 90;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function unlockAudio() {
    const c = getCtx();
    if (!c) return;
    if (c.state === "suspended") c.resume().catch(() => {});

  }
  

  // ultra krátky "tick" click, bez súboru, bez načítania
  function playUiClick() {
    // ===== CORRECT / WRONG SFX (mp3) =====
const sfxCorrect = new Audio("audio/correct.mp3"); sfxCorrect.preload = "auto"; sfxCorrect.volume = 0.75;
const sfxWrong   = new Audio("audio/wrong.mp3");   sfxWrong.preload = "auto";   sfxWrong.volume = 0.80;

window.SFX = window.SFX || {}; // bezpečne vytvorím objekt
window.SFX.correct = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try { sfxCorrect.currentTime = 0; sfxCorrect.play().catch(() => {}); } catch (e) {}
  
};
window.SFX.wrong = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try { sfxWrong.currentTime = 0; sfxWrong.play().catch(() => {}); } catch (e) {}
};
    if (!window.SOUND || !window.SOUND.enabled) return;

    const now = performance.now();
    if (now - lastAt < MIN_GAP_MS) return;
    lastAt = now;

    unlockAudio();

    const c = getCtx();
    if (!c) return;

    try {
      const osc = c.createOscillator();
      const gain = c.createGain();

      osc.type = "triangle";
      osc.frequency.value = 1200;

      gain.gain.value = 0.00001;
      gain.gain.setValueAtTime(0.00001, c.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.10, c.currentTime + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.00001, c.currentTime + 0.028);

      osc.connect(gain);
      gain.connect(c.destination);

      osc.start();
      osc.stop(c.currentTime + 0.03);
    } catch (e) {}
    window.playUiClick = playUiClick;
    
  }

  // ===== CORRECT / WRONG SFX (mp3) =====
const sfxCorrect = new Audio("audio/correct.mp3"); sfxCorrect.preload = "auto"; sfxCorrect.volume = 0.75;
const sfxWrong   = new Audio("audio/wrong.mp3");   sfxWrong.preload = "auto";   sfxWrong.volume = 0.80;

window.SFX = window.SFX || {};

window.SFX.correct = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try {
    sfxCorrect.currentTime = 0;
    sfxCorrect.play().catch(() => {});
  } catch (e) {}
};

window.SFX.wrong = function () {
  if (!window.SOUND || !window.SOUND.enabled) return;
  try {
    sfxWrong.currentTime = 0;
    sfxWrong.play().catch(() => {});
  } catch (e) {}
};

  function isClassicAnswerTap(e) {
    return !!e.target.closest("#answers-container");
  }

  function isCategoryTap(e) {
    return !!e.target.closest(".category-card");
  }

  // odomkni audio na prvý dotyk po reloade (mobile je v tomto chaos)
  document.addEventListener("touchstart", unlockAudio, { passive: true });
  document.addEventListener("pointerdown", unlockAudio, { passive: true });
  document.addEventListener("mousedown", unlockAudio);

  // 1) Categories vždy pípajú (Classic, Flags, Maps)
  // Použijem aj touchstart aj pointerdown aj click, aby to fungovalo na 100% mobilov
  function handleCategory(e) {
    if (isClassicAnswerTap(e)) return;
    if (!isCategoryTap(e)) return;
    playUiClick();
  }

  document.addEventListener("touchstart", handleCategory, true);
  document.addEventListener("pointerdown", handleCategory, true);
  document.addEventListener("click", handleCategory, true);

  // 2) Ostatné UI buttony pípajú, ale Classic answers nikdy
  function handleUiButtons(e) {
    if (isClassicAnswerTap(e)) return;
    if (isCategoryTap(e)) return;

    const el = e.target.closest("button, a, .btn, [role='button']");
    if (!el) return;

    if (el.disabled || el.getAttribute("aria-disabled") === "true") return;

    playUiClick();
  }

  document.addEventListener("touchstart", handleUiButtons, true);
  document.addEventListener("pointerdown", handleUiButtons, true);
  
})();


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

function showHomeMenuClean() {
  /* ja vrátim celé menu do pôvodného stavu */
  const home = document.getElementById("home-screen"); /* ja nájdem menu */
  if (home) {
    /* ja skontrolujem že existuje */
    home.classList.remove("hidden"); /* ja zruším hidden */
    home.style.removeProperty("display"); /* ja zruším natvrdo display */
    home.style.setProperty("display", "flex", "important"); /* ja menu ukážem */
  }

  const start =
    document.getElementById("start-screen"); /* ja nájdem classic get ready */
  if (start) {
    /* ja skontrolujem že existuje */
    start.classList.remove("active"); /* ja vypnem active */
    start.style.removeProperty("display"); /* ja zruším natvrdo display */
    start.style.setProperty("display", "none", "important"); /* ja ho schovám */
  }

  const flag =
    document.getElementById("flag-screen"); /* ja nájdem flags screen */
  if (flag) {
    /* ja skontrolujem že existuje */
    flag.style.removeProperty("display"); /* ja zruším natvrdo display */
    flag.style.setProperty("display", "none", "important"); /* ja ho schovám */
  }

  const quiz =
    document.getElementById("quiz-screen"); /* ja nájdem classic quiz screen */
  if (quiz) {
    /* ja skontrolujem že existuje */
    quiz.style.removeProperty("display"); /* ja zruším natvrdo display */
    quiz.style.setProperty("display", "none", "important"); /* ja ho schovám */
  }

  const res = document.getElementById("result-screen"); /* ja nájdem result */
  if (res) {
    /* ja skontrolujem že existuje */
    res.style.removeProperty("display"); /* ja zruším natvrdo display */
    res.style.setProperty("display", "none", "important"); /* ja ho schovám */
  }

  const maps =
    document.getElementById("globe-screen"); /* ja nájdem globe screen */
  if (maps) {
    /* ja skontrolujem že existuje */
    maps.style.removeProperty("display"); /* ja zruším natvrdo display */
    maps.style.setProperty("display", "none", "important"); /* ja ho schovám */
  }

  document
    .querySelectorAll(
      ".menu-title, .menu-grid, .category-card, .category-btn, .menu-wrap",
    )
    .forEach((el) => {
      /* ja nájdem všetky menu veci */
      el.style.removeProperty("display"); /* ja zruším natvrdo display none */
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

    const globeScreen =
      document.getElementById("globe-screen"); /* ja nájdem Map Master screen */

    if (globeScreen && globeScreen.style.display !== "none") {
      /* ja som v Map Master hre */
      if (typeof window.restartGlobeQuiz === "function")
        window.restartGlobeQuiz(); /* ja resetnem Map Master */
      showHomeMenuClean(); /* ja ukážem menu */
      history.pushState({ screen: "menu" }, "", ""); /* ja nastavím menu stav */
      return; /* ja skončím, nech nerobím ďalšie back kroky */
    }

    // ===== PRIORITA: ak som v Get Ready alebo Result, vždy sa vrátim do menu =====
    const flagsReady = document.getElementById("flag-screen"); // Flags Get Ready aj Flags Game je v tomto
    const quizReady = document.getElementById("start-screen"); // Classic Quiz Get Ready

    const quizGame = document.getElementById("quiz-screen");
    const resultScreen = document.getElementById("result-screen");
    const home = document.getElementById("home-screen");

    const isGetReady =
      (flagsReady && flagsReady.style.display !== "none") ||
      (quizReady &&
        (quizReady.classList.contains("active") ||
          quizReady.style.display !== "none"));

    const isResult = resultScreen && resultScreen.style.display !== "none";

    if (isGetReady || isResult) {
      if (typeof window.restartGlobeQuiz === "function")
        window.restartGlobeQuiz(); /* ja resetnem globe pri odchode do menu */
      showHomeMenuClean();
      history.pushState({ screen: "menu" }, "", "");
      return;
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
    if (e.target.classList.contains("info-backdrop")) {
      modal.classList.remove("open"); /* zatvorí pri kliknutí mimo boxu */
    }
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

        history.pushState({ screen: "maps" }, "", ""); // ja si zapíšem Map Master do histórie, aby Back mal kam ísť

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

function initVibrationToggle() {
  // ja nastavím vibro ikonku ON, OFF + klik
  const btn = document.getElementById("vibration-btn"); // ja nájdem ikonku v HTML
  if (!btn) return; // ja skončím ak ikonka neexistuje

  const saved = localStorage.getItem("gv_vibration"); // ja načítam uložený stav
  if (saved !== null) isVibrationOn = saved === "1"; // ja nastavím globálny prepínač

  const applyIcon = () => {
    // ja vždy prekreslím ikonku podľa stavu
    btn.src = isVibrationOn
      ? "icons/vibration_on.png"
      : "icons/vibration_off.png"; // ja prepnem obrázok
    btn.alt = isVibrationOn ? "Vibration on" : "Vibration off"; // ja prepnem alt text
    btn.setAttribute("aria-pressed", isVibrationOn ? "true" : "false"); // ja dám správny a11y stav
  };

  applyIcon(); // ja nastavím ikonku hneď po štarte

  btn.addEventListener("click", () => {
    // ja reagujem na klik
    isVibrationOn = !isVibrationOn; // ja prepnem ON, OFF
    localStorage.setItem("gv_vibration", isVibrationOn ? "1" : "0"); // ja si to uložím
    applyIcon(); // ja hneď zmením ikonku
    if (isVibrationOn && navigator.vibrate) navigator.vibrate(20); // ja krátko zavibrujem ako potvrdenie
  });
}

function initSoundToggle() {
  // prepína SOUND ikonku ON, OFF + klik
  const btn = document.getElementById("sound-btn"); // nájde ikonku v HTML
  if (!btn) return; // stop, ak ikonka neexistuje

  const applyIcon = () => {
    const on = !!window.SOUND?.enabled; // berie stav z globálneho SOUND
    btn.src = on ? "icons/soundon.png" : "icons/soundoff.png"; // prepne obrázok
    btn.alt = on ? "Sound on" : "Sound off"; // prepne alt text
    btn.setAttribute("aria-pressed", on ? "true" : "false"); // a11y stav
  };

  applyIcon(); // nastaví ikonku hneď po štarte

  btn.addEventListener("click", () => {
    // pri kliknutí prepne stav a uloží ho cez SOUND.setEnabled
    const newState = !window.SOUND?.enabled; // nový stav

    if (window.SOUND && typeof window.SOUND.setEnabled === "function") {
      window.SOUND.setEnabled(newState); // uloží do localStorage soundEnabled
    } else {
      // fallback, ak by SOUND neexistoval
      window.SOUND = window.SOUND || {};
      window.SOUND.enabled = newState;
      localStorage.setItem("soundEnabled", newState ? "1" : "0");
    }

    applyIcon(); // hneď prekreslí ikonku

    if (newState && typeof window.playUiClick === "function") {
      window.playUiClick(); // krátky click hneď po zapnutí zvuku
    }
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
  initSoundToggle();

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
  /* ja spustím classic quiz */
  pushScreen("quiz"); /* ja zapíšem do histórie že som v quiz */

  currentQuestionIndex = 0; /* ja začnem od 1. otázky */
  score = 0; /* ja vynulujem skóre */
  if (scoreSpan) scoreSpan.textContent = String(score);
  if (startScreen) {
    /* ja schovám Get Ready */
    startScreen.classList.remove("active"); /* ja zruším active */
    startScreen.style.setProperty(
      "display",
      "none",
      "important",
    ); /* ja schovám aj keby tam ostalo display */
  }

  if (quizScreen) {
    /* ja ukážem quiz obrazovku */
    quizScreen.classList.add("active"); /* ja zapnem active */
    quizScreen.style.setProperty(
      "display",
      "block",
      "important",
    ); /* ja ukážem aj keby bola natvrdo schovaná */
  }

  showQuestion(); /* ja zobrazím 1. otázku */
}

function restartGlobeQuiz_script() {
  currentQuestionIndex = 0; /* ja vrátim otázku na 1 */
  quizScore = 0; /* ja vrátim skóre na 0 */
  answerLocked = false; /* ja dovolím klikanie */
  highlightCorrectFeature = null; /* ja zruším zelené zvýraznenie */
  highlightWrongFeature = null; /* ja zruším červené zvýraznenie */
  bubbleData = []; /* ja zruším bubliny */

  const scoreEl =
    document.getElementById("globe-score"); /* ja nájdem score text */
  if (scoreEl) scoreEl.textContent = "Score: 0"; /* ja nastavím 0 */

  if (typeof updateGlobeProgress === "function")
    updateGlobeProgress(); /* ja obnovím progress */
  if (typeof showGlobeQuestion === "function")
    showGlobeQuestion(); /* ja ukážem prvú otázku */
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
  if (nextBtn) nextBtn.textContent = t("next");
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

  if (questionText) {
    const qNum = currentQuestionIndex + 1;
    const qKey = "q" + qNum;
    questionText.textContent =
      LANG[currentLang] && LANG[currentLang][qKey]
        ? t(qKey)
        : currentQuestion.question;
  }
  if (answersContainer) {
    answersContainer.innerHTML = "";
    const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

    shuffledAnswers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      const pos = currentQuestion.answers.indexOf(answer);
      const qNum = currentQuestionIndex + 1;
      const aKey = "q" + qNum + "a" + (pos + 1);
      button.textContent =
        LANG[currentLang] && LANG[currentLang][aKey] ? t(aKey) : answer.text;
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
if (isCorrect) {
  if (window.SFX && typeof window.SFX.correct === "function") window.SFX.correct();
  if (navigator && typeof navigator.vibrate === "function") navigator.vibrate([18]); // krátka jemná vibrácia
} else {
  if (window.SFX && typeof window.SFX.wrong === "function") window.SFX.wrong();
  if (navigator && typeof navigator.vibrate === "function") navigator.vibrate([35, 25, 35]); // dvojitý impulz pre wrong
}
  selectedButton.classList.add(isCorrect ? "correct" : "incorrect");

  const correctBtn = answersContainer?.querySelector('[data-correct="true"]');
  if (correctBtn) correctBtn.classList.add("correct");

  const status = document.getElementById("quiz-answer-status");

  // QUIZ ANSWER RESULT
  if (isCorrect) {
    if (status) {
      status.textContent = t("correct");
      status.className = "show correct";
    }

    score++;
    if (scoreSpan) scoreSpan.textContent = String(score);

    if (isVibrationOn && navigator.vibrate) navigator.vibrate(140);
  } else {
    if (status) {
      status.textContent = t("wrong");
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

  const resultMsgElement = document.getElementById("result-message");
  const finalScoreElement = document.getElementById("final-score");
  const maxScoreElement = document.getElementById("max-score");

  if (resultMsgElement) {
    // ak existuje element pre výslednú vetu

    if (percentage === 100)
      // ak má hráč 100%
      resultMsgElement.textContent = t("resultGreat"); // zobrazím text pre perfektný výsledok
    else if (percentage >= 80)
      // ak má 80% alebo viac
      resultMsgElement.textContent = t("resultGood"); // zobrazím veľmi dobrý výsledok
    else if (percentage >= 50)
      // ak má 50% alebo viac
      resultMsgElement.textContent = t("resultOk"); // zobrazím stredný výsledok
    // ak má menej ako 50%
    else resultMsgElement.textContent = t("resultBad"); // zobrazím slabší výsledok
  }
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
    if (typeof window.restartGlobeQuiz === "function") {
      /* ja skontrolujem, že reset existuje */
      window.restartGlobeQuiz(); /* ja resetnem globe quiz, aby neostal posledný stav */
    }

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

    const globe = document.getElementById("globe-screen"); // ja nájdem 3D globe screen
    const globeStart = document.getElementById("globe-start-screen"); // ja nájdem globe start
    const globeResult = document.getElementById("globe-result-screen"); // ja nájdem globe result
    if (globe)
      globe.style.setProperty(
        "display",
        "none",
        "important",
      ); /* ja schovám globe screen */
    if (globeStart)
      globeStart.style.removeProperty(
        "display",
      ); /* ja nezabetónujem start na display none */
    if (globeResult)
      globeResult.style.removeProperty(
        "display",
      ); /* ja nezabetónujem result na display none */

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
      .forEach((el) => el.style.removeProperty("display"));

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

window.showMaps = function () {
  /* ja otvorím Map Master vždy čisto a od začiatku */
  const globeScreen =
    document.getElementById("globe-screen"); /* ja nájdem 3D globe screen */
  if (!globeScreen) return; /* ak ho nenájdem, nič nerobím */

  /* ja schovám všetky ostatné screeny */
  const screens = [
    "home-screen",
    "quiz-screen",
    "start-screen",
    "flag-screen",
    "result-screen",
    "maps-screen",
  ];

  screens.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.setProperty("display", "none", "important");
  });

  /* ja ukážem globe */
  globeScreen.style.setProperty("display", "block", "important");

  /* ja schovám výsledok ak ostal */
  const globeResult = document.getElementById("globe-result-screen");
  if (globeResult)
    globeResult.style.setProperty("display", "none", "important");

  /* ja ukážem start overlay */
  const globeStart = document.getElementById("globe-start-screen");
  if (globeStart) globeStart.classList.add("show");

  /* ja resetnem quiz */
  if (typeof restartGlobeQuiz === "function") restartGlobeQuiz();

  /* ja zapíšem history aby BACK fungoval */
  history.replaceState({ screen: "globe-start" }, "", "");
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



