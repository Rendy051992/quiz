/* =========================
   MAPS.JS, CLEAN VERSION
   - pan, pinch, tap to pick
   - transform only #map-transform
   ========================= */

// ===== Map transform state =====
let mapScale = 1;
let mapTx = 0;
let mapTy = 0;

const MAP_MIN_SCALE = 0.45;  // zoom out viac
const MAP_MAX_SCALE = 4;     // max zoom in

const MAP_W = 1010;          // viewBox width
const MAP_H = 666;           // viewBox height

function centerMapAtCurrentScale() {
  const vp = document.getElementById("map-viewport");
  if (!vp) return;

  const vw = vp.clientWidth;
  const vh = vp.clientHeight;

  mapTx = (vw - MAP_W * mapScale) / 2;
  mapTy = (vh - MAP_H * mapScale) / 2;
}



// ===== Game state =====
let targetCountry = null;
let countries = [];


let mapScore = 0;
let mapRoundIndex = 0;
let canScoreThisRound = true;
let mapFinished = false;

// ===== 30 questions =====
const MAP_30_ORDER = [
  "France","Italy","Spain","United Kingdom","Germany","United States","Brazil","Australia","Japan","Mexico",
  "Canada","Argentina","Turkey","Egypt","Nigeria","South Africa","Thailand","Vietnam","Philippines","Sweden",
  "Norway","Portugal","Greece","New Zealand","Ukraine","Iceland",
  "Bangladesh","North Korea","Yemen","Madagascar"
];
const MAP_TOTAL = MAP_30_ORDER.length;

const NAME_ALIASES = {
  "United States": ["United States of America","USA","United States"],
  "North Korea": ["Korea, North","Dem. Rep. Korea","Democratic People's Republic of Korea","North Korea"],
  "Vietnam": ["Viet Nam","Vietnam"],
  "Turkey": ["Türkiye","Turkiye","Turkey"],
  "Philippines": ["The Philippines","Philippines"],
  "South Africa": ["Republic of South Africa","South Africa"]
};

// ===== Helpers =====
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function dist(t1, t2) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function midpoint(t1, t2) {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2
  };
}

function labelOf(pathEl) {
  return (pathEl.getAttribute("aria-label") || "").trim();
}

function findCountryPathByName(targetName) {
  const wanted = [targetName];
  if (NAME_ALIASES[targetName]) {
    NAME_ALIASES[targetName].forEach(n => wanted.push(n));
  }
  return countries.find(p => wanted.includes(labelOf(p))) || null;
}

function resetAllFills() {
  countries.forEach(c => { c.style.fill = ""; });
}

function setQuestionText(text) {
  const el = document.getElementById("map-question");
  if (el) el.textContent = text;
}

function setMapInfoUI(currentNumber) {
  const currentEl = document.getElementById("map-current");
  const totalEl = document.getElementById("map-total");
  const scoreEl = document.getElementById("map-score");

  if (currentEl) currentEl.textContent = String(currentNumber);
  if (totalEl) totalEl.textContent = String(MAP_TOTAL);
  if (scoreEl) scoreEl.textContent = String(mapScore);

  const fill = document.getElementById("map-progress-fill");
  if (fill) {
    const completed = clamp(currentNumber - 1, 0, MAP_TOTAL);
    fill.style.width = ((completed / MAP_TOTAL) * 100) + "%";
  }
}

function applyMapTransform() {
  const layer = document.getElementById("map-transform");
  if (!layer) return;
  layer.style.transform = `translate(${mapTx}px, ${mapTy}px) scale(${mapScale})`;
  layer.style.transformOrigin = "0 0";
}

function fitMapToViewport() {
  const viewport = document.getElementById("map-viewport");
  const q = document.getElementById("map-question");
  const info = document.getElementById("map-info");
  const prog = document.getElementById("map-progress");
  if (!viewport) return;

  const vr = viewport.getBoundingClientRect();

  // reálna viditeľná šírka/výška v Safari
  const vv = window.visualViewport;
  const visibleH = vv ? vv.height : vr.height;
  const visibleW = vv ? vv.width : vr.width;

  // kde končí horné UI
  let uiBottom = vr.top;
  [q, info, prog].filter(Boolean).forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom > uiBottom) uiBottom = r.bottom;
  });

  // dostupná plocha pre mapu (pod UI)
  const availableTop = (uiBottom - vr.top) + 12;
  const availableH = Math.max(120, visibleH - availableTop);
  const availableW = visibleW;

  // base fit
  const fitScale = Math.min(availableW / MAP_W, availableH / MAP_H);

  // ✅ toto je to, čo chceš: väčší default zoom hlavne v landscape
const isLandscape = visibleW > visibleH;
const DEFAULT_ZOOM_MULT = isLandscape ? 2.0 : 1.25;


  // scale s multiplierom
  mapScale = clamp(fitScale * DEFAULT_ZOOM_MULT, MAP_MIN_SCALE, MAP_MAX_SCALE);

  // vycentruj mapu do dostupnej plochy
  mapTx = (availableW - MAP_W * mapScale) / 2;
  mapTy = availableTop + (availableH - MAP_H * mapScale) / 2;

  applyMapTransform();
}

let _fitT1 = null;
let _fitT2 = null;

function scheduleFitMap() {
  const mapsScreen = document.getElementById("maps-screen");

  const doFit = () => {
    if (!mapsScreen) return;
    if (getComputedStyle(mapsScreen).display === "none") return;
    fitMapToViewport();
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(doFit);
  });

  clearTimeout(_fitT1);
  clearTimeout(_fitT2);
  _fitT1 = setTimeout(doFit, 120);
  _fitT2 = setTimeout(doFit, 320);
}

window.addEventListener("resize", scheduleFitMap);
window.addEventListener("orientationchange", () => setTimeout(scheduleFitMap, 250));
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", scheduleFitMap);
}







function endMapsRound() {
  mapFinished = true;
  setQuestionText("Hotovo, Score: " + mapScore + " / " + MAP_TOTAL);

  setTimeout(() => {
    if (typeof window.closeMaps === "function") window.closeMaps();
    window.history.pushState({ screen: "menu" }, "", "");
  }, 1200);
}

// ===== Pick logic =====
function handleCountryPick(pathEl) {
  if (!pathEl) return;
  if (!document.body.classList.contains("maps-mode")) return;

  if (!targetCountry) return;
  if (mapFinished) return;
  if (!canScoreThisRound) return;

  canScoreThisRound = false;

  const isCorrect = (pathEl === targetCountry);

  if (isCorrect) {
    pathEl.style.fill = "#4caf50";
    mapScore++;
    if (typeof hapticClick === "function") hapticClick();
  } else {
    pathEl.style.fill = "#f44336";
    if (typeof triggerVibration === "function") triggerVibration();

    setTimeout(() => {
      pathEl.style.fill = "";
    }, 350);
  }

  setTimeout(() => {
    mapRoundIndex++;                 // ✅ posun po odpovedi
    window.startNewMapRound();       // ✅ zobraz ďalšiu otázku
  }, 700);
}


// ===== DOM Ready, Input Setup =====
document.addEventListener("DOMContentLoaded", () => {
  if (!window.history.state) window.history.replaceState({ screen: "menu" }, "", "");

  const mapsScreen = document.getElementById("maps-screen");
  const svg = document.getElementById("world-map");
  const viewport = document.getElementById("map-viewport");
  if (!mapsScreen || !svg || !viewport) return;

  // get paths
  if (typeof getAllMapPaths === "function") {
    countries = getAllMapPaths() || [];
  } else {
    countries = [];
  }
  if (!countries || countries.length === 0) {
    countries = Array.from(svg.querySelectorAll("path"));
  }

  // ===== Touch state =====
  let isDragging = false;
  let isPinching = false;

  let lastX = 0;
  let lastY = 0;

  let startX = 0;
  let startY = 0;

  let pinchStartDist = 0;
  let pinchStartScale = 1;

  let pinchWorldX = 0;
  let pinchWorldY = 0;

  let moved = false;
  const TAP_MOVE_PX = 10;

  viewport.addEventListener("touchstart", (e) => {
    if (getComputedStyle(mapsScreen).display === "none") return;
    if (!e.touches) return;

    moved = false;

    if (e.touches.length === 2) {
      e.preventDefault();
      isPinching = true;
      isDragging = false;

      const t1 = e.touches[0];
      const t2 = e.touches[1];

      pinchStartDist = dist(t1, t2);
      pinchStartScale = mapScale;

      const m = midpoint(t1, t2);
      pinchWorldX = (m.x - mapTx) / mapScale;
      pinchWorldY = (m.y - mapTy) / mapScale;
      return;
    }

    if (e.touches.length === 1) {
      e.preventDefault();
      isDragging = true;
      isPinching = false;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      lastX = startX;
      lastY = startY;
    }
  }, { passive: false, capture: true });

  viewport.addEventListener("touchmove", (e) => {
    if (getComputedStyle(mapsScreen).display === "none") return;
    if (!e.touches) return;

    if (isPinching && e.touches.length === 2) {
      e.preventDefault();

      const t1 = e.touches[0];
      const t2 = e.touches[1];

      const d = dist(t1, t2);
      if (pinchStartDist <= 0) return;

      const ratio = d / pinchStartDist;
      const newScale = clamp(pinchStartScale * ratio, MAP_MIN_SCALE, MAP_MAX_SCALE);

      const m = midpoint(t1, t2);

      mapScale = newScale;
      mapTx = m.x - pinchWorldX * mapScale;
      mapTy = m.y - pinchWorldY * mapScale;

      applyMapTransform();
      moved = true;
      return;
    }

    if (isDragging && e.touches.length === 1) {
      e.preventDefault();

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      const dxTap = x - startX;
      const dyTap = y - startY;
      if ((dxTap * dxTap + dyTap * dyTap) > (TAP_MOVE_PX * TAP_MOVE_PX)) moved = true;

      const dx = x - lastX;
      const dy = y - lastY;

      mapTx += dx;
      mapTy += dy;

      lastX = x;
      lastY = y;

      applyMapTransform();
    }
  }, { passive: false, capture: true });

  viewport.addEventListener("touchend", (e) => {
    if (getComputedStyle(mapsScreen).display === "none") return;

    // tap pick
    if (!moved) {
      const touch = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : null;
      if (touch) {
        const els = document.elementsFromPoint(touch.clientX, touch.clientY);

        let path = null;
        for (const el of els) {
          if (!el) continue;
          if (el.tagName && el.tagName.toLowerCase() === "path") { path = el; break; }
          if (el.closest) {
            const p = el.closest("path");
            if (p) { path = p; break; }
          }
        }
        if (path) handleCountryPick(path);
      }
    }

    if (!e.touches || e.touches.length === 0) {
      isDragging = false;
      isPinching = false;
      return;
    }

    if (e.touches.length === 1) {
      isPinching = false;
      isDragging = true;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;

      lastX = startX;
      lastY = startY;
    }
  }, { capture: true });

  viewport.addEventListener("touchcancel", () => {
    isDragging = false;
    isPinching = false;
  }, { capture: true });

  // desktop click fallback
  svg.addEventListener("click", (e) => {
    if (getComputedStyle(mapsScreen).display === "none") return;

    const clicked = e.target;
    if (!clicked) return;

    const path = (clicked.tagName === "path") ? clicked : (clicked.closest ? clicked.closest("path") : null);
    if (!path) return;

    handleCountryPick(path);
  });

  // + / - buttons
  const zoomIn = document.getElementById("zoom-in");
  const zoomOut = document.getElementById("zoom-out");

  if (zoomIn) zoomIn.addEventListener("click", () => {
    if (getComputedStyle(mapsScreen).display === "none") return;
    mapScale = clamp(mapScale * 1.15, MAP_MIN_SCALE, MAP_MAX_SCALE);
    applyMapTransform();
  });

  if (zoomOut) zoomOut.addEventListener("click", () => {
    if (getComputedStyle(mapsScreen).display === "none") return;
    mapScale = clamp(mapScale / 1.15, MAP_MIN_SCALE, MAP_MAX_SCALE);
    applyMapTransform();
  });
});

// ===== Game flow =====
window.startNewMapRound = function () {
  if (!countries || countries.length === 0) {
    countries = (typeof getAllMapPaths === "function") ? getAllMapPaths() : [];
  }
  if (!countries || countries.length === 0) return;

  if (mapRoundIndex >= MAP_TOTAL) {
    endMapsRound();
    return;
  }

  mapFinished = false;
  canScoreThisRound = true;

  resetAllFills();

  const targetName = MAP_30_ORDER[mapRoundIndex];
  const found = findCountryPathByName(targetName);

  if (!found) {
    mapRoundIndex++;                 // preskočí chybnú otázku
    window.startNewMapRound();
    return;
  }

  targetCountry = found;

  setQuestionText("Find: " + targetName);
  setMapInfoUI(mapRoundIndex + 1);
};




// ===== Show / Close =====
window.showMaps = function () {
  window.history.pushState({ screen: "maps" }, "", "");
  document.body.classList.add("maps-mode");

  const screens = ["home-screen", "quiz-screen", "start-screen", "flag-screen", "result-screen"];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.setProperty("display", "none", "important");
    showMapsStartOverlay();

  });

  const mapsScreen = document.getElementById("maps-screen");
  if (mapsScreen) {
    mapsScreen.style.setProperty("display", "block", "important");
    mapsScreen.style.zIndex = "10000000";
    mapsScreen.style.pointerEvents = "auto";
  }

const isLandscape = window.innerWidth > window.innerHeight;

if (isLandscape) {
  fitMapToViewportSimple();   // celá mapa v landscape
} else {
  mapScale = 1;               // tvoj portrait štart
  centerMapAtCurrentScale();
  applyMapTransform();
}



setMapInfoUI(1);
window.startNewMapRound();

};


window.closeMaps = function () {
  document.body.classList.remove("maps-mode");

  const mapsScreen = document.getElementById("maps-screen");
  if (mapsScreen) {
    mapsScreen.style.setProperty("display", "none", "important");
    mapsScreen.style.pointerEvents = "none";
  }

  const home = document.getElementById("home-screen");
  if (home) home.style.setProperty("display", "flex", "important");
};

//-----------------------------------------------------------------------------------------------------------------------------------------------


function ensureMapsStartOverlay() {
  if (document.getElementById("maps-start-screen")) return;

  const wrap = document.createElement("div");
  wrap.id = "maps-start-screen";
  wrap.style.position = "fixed";
  wrap.style.inset = "0";
  wrap.style.zIndex = "99999999";
  wrap.style.display = "none";
  wrap.style.alignItems = "center";
  wrap.style.justifyContent = "center";
  wrap.style.background = "rgba(0,0,0,0.35)";
  wrap.style.backdropFilter = "blur(10px)";



  wrap.innerHTML = `
    <div class="start-card">
      <span class="ready-text">Get Ready</span>
      <h1>Maps</h1>
      <div class="start-icon-wrap">🗺️</div>
      <button id="maps-start-btn" type="button" style="background:#2f80ff;">LET'S GO</button>
    </div>
  `;

  document.body.appendChild(wrap);

  const btn = wrap.querySelector("#maps-start-btn");
  btn.addEventListener("click", () => {
    if (typeof hapticClick === "function") hapticClick();
    hideMapsStartOverlay();

    // až teraz spusti map quiz
    if (typeof scheduleFitMap === "function") scheduleFitMap();
    setMapInfoUI(1);
    window.startNewMapRound();
  });
}

function showMapsStartOverlay() {
  ensureMapsStartOverlay();
  const el = document.getElementById("maps-start-screen");
  if (el) el.style.display = "flex";
}

function hideMapsStartOverlay() {
  const el = document.getElementById("maps-start-screen");
  if (el) el.style.display = "none";
}
