const ISO3_TO_ISO2 = {
  CAN: "ca",
  USA: "us",
  MEX: "mx",
  BRA: "br",
  ARG: "ar",
  RUS: "ru",
  CHN: "cn",
  IND: "in",
  AUS: "au",
  DEU: "de",
  FRA: "fr",
  ESP: "es",
  ITA: "it",
  GBR: "gb",
  CZE: "cz",
  POL: "pl",
  NOR: "no",
  SWE: "se",
  FIN: "fi",
  SAU: "sa",
  EGY: "eg",
  ETH: "et",
  ZAF: "za",
  TUR: "tr",
  IRN: "ir",
  KAZ: "kz",
  PER: "pe",
  MAR: "ma",
  VNM: "vn",
  PHL: "ph",
  MDG: "mg",
};

console.time("GLOBE_INIT"); // meranie init času

// www/globe.js
(function () {
  "use strict"; // prísnejší režim
  function safeVibrate(pattern) {
    /* ja spravím vibráciu bezpečne */
    if (navigator && typeof navigator.vibrate === "function") {
      /* ja skontrolujem či vibrácia existuje */
      navigator.vibrate(pattern); /* ja zavibrujem */
    }
  }

  let globeInstance = null; // uloží Globe() inštanciu
  let initRunning = false; // ochrana proti 2x init
  let bordersEnabled = false; // borders sa zapnú až po prvom kliku

  const TEX_GLOBE = "./data/earth-blue-marble.jpg"; // ✅ tvoja textúra
  const COUNTRIES_GEOJSON = "./data/countries.geojson"; // ✅ geojson krajín

  window.updateGlobeBubbles = function () {
    // ja to dám na window, aby to fungovalo aj keď to volá kód mimo tohto súboru
    if (typeof updateMapBubbles === "function") {
      // ja použijem map bubliny, ak existujú
      updateMapBubbles(); // ja ich len prepočítam
      return; // ja skončím
    }

    if (typeof updateBubbles === "function") {
      // ja skúsim iný názov funkcie, ak ho mám v projekte
      updateBubbles(); // ja ich prepočítam
      return; // ja skončím
    }

    // ja nerobím nič, ak v projekte nie je žiadna funkcia na bubliny, hlavne aby sa appka nerozbila
  };

  let countriesLoaded = false; // či už sú krajiny načítané
  let countriesFeatures = null; // features z geojsonu

  /* =========================
   MAP QUIZ STATE (mozog hry)
   ========================= */

  let quizCountries = []; // tu si uložím zoznam 30 krajín ktoré budeme hrať
  let currentQuestionIndex = 0; // tu si pamätám index aktuálnej otázky (0 = prvá otázka)
  let quizScore = 0; // tu si ukladám skóre hráča
  let currentCorrectFeature = null; // tu si uložím správnu krajinu pre aktuálnu otázku
  let answerLocked = false; // tu si pamätám či už hráč klikol (aby nemohol klikať 10x)
  let highlightCorrectFeature = null; // tu si pamätám ktorú krajinu zafarbím na zeleno
  let highlightWrongFeature = null; // tu si pamätám ktorú krajinu zafarbím na červeno
  let bubbleData = []; // ja sem budem dávať 2 bubliny (correct, wrong)
  let lastCameraMoveTime = 0;

  // ja z polygonu vytiahnem približný stred (lat,lng) aby som tam prilepila bublinu
  function getFeatureCenterLatLng(feat) {
    const g = feat?.geometry;
    if (!g) return { lat: 0, lng: 0 };

    // ja si zoberiem prvý ring z Polygon alebo MultiPolygon
    let ring = null;

    if (g.type === "Polygon") ring = g.coordinates?.[0];
    if (g.type === "MultiPolygon") ring = g.coordinates?.[0]?.[0];

    if (!ring || ring.length === 0) return { lat: 0, lng: 0 };

    // ring je [lng,lat], ja spravím priemer
    let sumLng = 0;
    let sumLat = 0;
    let n = 0;

    for (const p of ring) {
      const lng = Number(p?.[0]);
      const lat = Number(p?.[1]);
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      sumLng += lng;
      sumLat += lat;
      n++;
    }

    if (!n) return { lat: 0, lng: 0 };
    return { lat: sumLat / n, lng: sumLng / n };
  }

  // tu si definujem názvy krajín pre jednotlivé obtiažnosti
  const EASY_COUNTRIES = [
    // tu mám easy krajiny
    "United States of America",
    "Brazil",
    "Australia",
    "China",
    "India",
    "Canada",
    "Russia",
    "Egypt",
    "Mexico",
    "Argentina",
  ];

  const MEDIUM_COUNTRIES = [
    // tu mám medium krajiny
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Turkey",
    "Saudi Arabia",
    "South Africa",
    "Japan",
    "Thailand",
    "Ukraine",
  ];

  const HARD_COUNTRIES = [
    // tu mám hard krajiny
    "Poland",
    "Vietnam",
    "Philippines",
    "Madagascar",
    "Morocco",
    "Iran",
    "Kazakhstan",
    "Peru",
    "Norway",
    "Ethiopia",
  ];

  const COUNTRY_NAME_MAP = {
    USA: "United States of America",
    Tanzania: "United Republic of Tanzania",
    "Czech Republic": "Czechia",
    Russia: "Russia",
  };

  function shuffleArray(arr) {
    // tu spravím shuffle pola (Fisher Yates)
    const a = arr.slice(); // tu spravím kópiu, aby som nemenila pôvodné pole
    for (let i = a.length - 1; i > 0; i--) {
      // tu idem odzadu
      const j = Math.floor(Math.random() * (i + 1)); // tu vyberiem náhodný index
      [a[i], a[j]] = [a[j], a[i]]; // tu prehodím prvky
    }
    return a; // tu vrátim premiešanú kópiu
  }

  function pickFeaturesByNames(names, features) {
    // tu nájdem GeoJSON features podľa názvov krajín
    const norm = (s) =>
      String(s || "")
        .trim()
        .toLowerCase(); // tu znormalizujem text pre porovnanie
    const map = new Map(); // tu spravím mapu názov -> feature

    features.forEach((f) => {
      // tu prejdem všetky features
      const n1 = norm(f?.properties?.name); // tu zoberiem properties.name
      const n2 = norm(f?.properties?.ADMIN); // tu zoberiem properties.ADMIN
      if (n1) map.set(n1, f); // tu uložím do mapy podľa name
      if (n2) map.set(n2, f); // tu uložím do mapy podľa ADMIN
    });

    const picked = []; // tu budem dávať nájdené krajiny v poradí
    const missing = []; // tu budem dávať názvy ktoré som nenašla

    names.forEach((name) => {
      // tu prejdem zoznam názvov ktoré chceme v quize
      const key = norm(COUNTRY_NAME_MAP[name] || name); // tu si spravím kľúč
      const feat = map.get(key); // tu skúsim nájsť feature
      if (feat)
        picked.push(feat); // tu pridám feature ak existuje
      else missing.push(name); // tu si zapíšem že chýba
    });

    if (missing.length) console.warn("MISSING COUNTRIES:", missing); // tu vypíšem čo nenašlo
    return picked; // tu vrátim nájdené features
  }

  function buildQuizCountries() {
    // tu poskladám quiz: easy potom medium potom hard, shuffle len v rámci skupín
    if (!countriesFeatures || !countriesFeatures.length) return []; // tu skončím ak ešte nemám geojson features

    const easy = pickFeaturesByNames(EASY_COUNTRIES, countriesFeatures); // tu zoberiem easy features
    const medium = pickFeaturesByNames(MEDIUM_COUNTRIES, countriesFeatures); // tu zoberiem medium features
    const hard = pickFeaturesByNames(HARD_COUNTRIES, countriesFeatures); // tu zoberiem hard features

    const easyShuf = shuffleArray(easy); // tu premiešam iba easy
    const medShuf = shuffleArray(medium); // tu premiešam iba medium
    const hardShuf = shuffleArray(hard); // tu premiešam iba hard

    const result = [...easyShuf, ...medShuf, ...hardShuf]; // tu zachovám poradie skupín
    console.log(
      "QUIZ ORDER:",
      result.map(
        (f) => f?.properties?.name || f?.properties?.ADMIN || "Unknown",
      ),
    ); // tu si vypíšem poradie
    return result; // tu vrátim finálny zoznam otázok
  }

  function qs(id) {
    return document.getElementById(id); // krátka cesta na element
  }

  function showLoader() {
    document.body.classList.add("globe-loading"); // css trieda pre loading
    const ld = qs("globe-loader"); // loader element
    if (ld) ld.style.display = "flex"; // ukáž loader
  }

  function hideLoader() {
    document.body.classList.remove("globe-loading"); // zruš loading triedu
    const ld = qs("globe-loader"); // loader element
    if (ld) ld.style.display = "none"; // schovaj loader
  }

  function showGlobeScreenOnly() {
    const globeScreen = qs("globe-screen"); // screen s globusom
    if (globeScreen)
      globeScreen.style.setProperty("display", "block", "important"); // natvrdo ukáž
  }

  function getCanvasSize() {
    const el = qs("globe-canvas"); // kontajner pre globe
    if (!el) return { w: 0, h: 0 }; // ak nič, vráť nuly
    return { w: el.clientWidth, h: el.clientHeight }; // reálna veľkosť kontajnera
  }

  function sizeGlobeToContainer() {
    if (!globeInstance) return; // globe ešte neexistuje
    const { w, h } = getCanvasSize(); // zisti veľkosť kontajnera
    if (w > 20 && h > 20) {
      globeInstance.width(w); // nastav šírku
      globeInstance.height(h); // nastav výšku
    }
  }

  async function waitForRealSize(maxFrames = 90) {
    for (let i = 0; i < maxFrames; i++) {
      const { w, h } = getCanvasSize(); // stále kontrolujem
      if (w > 20 && h > 20) return true; // už je OK
      await new Promise(requestAnimationFrame); // počkaj 1 frame
    }
    return false; // kontajner sa nikdy nezobudil
  }

  function createGlobeIfNeeded() {
    console.log("CREATE_GLOBE_CALLED"); // debug

    if (globeInstance) return; // už existuje
    if (typeof Globe !== "function") {
      console.log("Globe() nie je dostupné, globe.gl sa nenačítalo"); // debug
      return;
    }

    const container = qs("globe-canvas"); // kontajner
    console.log(
      "CONTAINER SIZE:",
      container?.clientWidth,
      container?.clientHeight,
    ); // debug
    if (!container) return; // bez kontajnera koniec

    console.time("CREATE_GLOBE"); // meranie vytvorenia

    globeInstance = Globe()(container) // vytvor globe
      .globeImageUrl(TEX_GLOBE) // ✅ reálna textúra, aby Zem nebola tmavá
      .backgroundColor("#000000"); // pozadie

    try {
      if (typeof THREE !== "undefined") {
        const capMat = new THREE.MeshLambertMaterial({
          side: THREE.DoubleSide /* ja dovolím klik z oboch strán */,
          transparent: true /* ja nechám transparentné farby fungovať */,
          opacity: 1,
        });

        globeInstance.polygonCapMaterial(
          capMat,
        ); /* ja nastavím materiál pre caps */
      }
    } catch (e) {
      console.log("DoubleSide cap skipped:", e);
    }

    console.timeEnd("CREATE_GLOBE"); // meranie vytvorenia koniec

    const dpr = window.devicePixelRatio || 1; /* ja zistím DPR */
    const renderDpr = Math.min(dpr, 2); /* ja capnem max 2 kvôli výkonu */
    globeInstance
      .renderer()
      .setPixelRatio(renderDpr); /* ja nastavím presné kreslenie pre klik */
    console.log("DEVICE PIXEL RATIO:", dpr);
    console.log("RENDER PIXEL RATIO:", renderDpr);

    console.log("DEVICE PIXEL RATIO:", window.devicePixelRatio); // debug
    console.log(
      "RENDER PIXEL RATIO:",
      globeInstance.renderer().getPixelRatio(),
    ); // debug

    globeInstance
      .htmlElementsData(bubbleData) /* ja nastavím dáta */
      .htmlLat((d) => d.lat) /* ja nastavím lat */
      .htmlLng((d) => d.lng) /* ja nastavím lng */
      .htmlAltitude((d) => d.alt) /* ja nastavím altitude */
      .htmlElement((d) => {
        /* ja vytvorím HTML bublinu */
        const el = document.createElement("div"); /* ja vytvorím bublinu */
        el.className = `globe-bubble ${d.kind} show`; /* ja nastavím triedy */
        const flagHTML = d.iso2
          ? `<img class="flag-img" src="flags/${d.iso2}.webp" alt="">`
          : ``; // ja ukážem vlajku len keď mám iso2

        el.innerHTML = `<div class="bubble-inner">${flagHTML}<span class="name">${d.name}</span></div>`; // ja dám vlajku + názov

        el.style.pointerEvents = "none"; /* ja neblokujem klik */
        el.style.userSelect = "none"; /* ja neoznačujem text */

        let lastCameraMoveTime = 0;
        const CAMERA_SETTLE_DELAY = 250;

        function clampBubbleToScreen() {
          /* ja clampujem len keď sa kamera nehýbe, aby sa bubliny netriasli */
          let stableFrames = 0; /* ja rátam koľko framov je kamera stabilná */
          let lastPOV = null; /* ja si pamätám posledný pointOfView */

          function step() {
            if (performance.now() - lastCameraMoveTime < CAMERA_SETTLE_DELAY) {
              requestAnimationFrame(step); // ja počkám ďalší frame a skúsim znova
              return; // ja teraz nič nehýbem, lebo kamera sa ešte hýbe
            }
            const pov =
              globeInstance && typeof globeInstance.pointOfView === "function"
                ? globeInstance.pointOfView()
                : null; /* ja zistím aktuálny POV */
            const eps = 0.0002; /* ja nastavím citlivosť detekcie pohybu */

            if (pov && lastPOV) {
              /* ja porovnám či sa kamera hýbe */
              const moving =
                Math.abs(pov.lat - lastPOV.lat) > eps ||
                Math.abs(pov.lng - lastPOV.lng) > eps ||
                Math.abs(pov.altitude - lastPOV.altitude) > eps;

              if (moving) {
                /* ja keď sa hýbe kamera, nerobím clamp */
                stableFrames = 0; /* ja resetnem stabilitu */
                lastPOV = {
                  lat: pov.lat,
                  lng: pov.lng,
                  altitude: pov.altitude,
                }; /* ja uložím nový POV */
                requestAnimationFrame(step); /* ja pokračujem */
                return; /* ja skončím tento frame */
              }
            }

            if (pov && !lastPOV)
              lastPOV = {
                lat: pov.lat,
                lng: pov.lng,
                altitude: pov.altitude,
              }; /* ja nastavím prvý POV */

            stableFrames += 1; /* ja pridám stabilný frame */

            if (stableFrames < 4) {
              /* ja čakám pár framov, aby to bolo fakt stabilné */
              requestAnimationFrame(step); /* ja pokračujem */
              return; /* ja skončím */
            }

            const pad = 12; /* ja nechám okraj */
            const host =
              document.getElementById("globe-screen") ||
              document.body; /* ja zoberiem kontajner */
            const hostRect =
              host.getBoundingClientRect(); /* ja zistím hranice */
            const r = el.getBoundingClientRect(); /* ja zistím rozmer bubliny */

            const hud =
              document.getElementById("globe-hud"); /* ja nájdem HUD */
            const hudRect = hud
              ? hud.getBoundingClientRect()
              : null; /* ja zistím hranice HUD */

            let dx = 0; /* ja posun X */
            let dy = 0; /* ja posun Y */

            if (r.left < hostRect.left + pad)
              dx = hostRect.left + pad - r.left; /* ja posuniem doprava */
            if (r.right > hostRect.right - pad)
              dx = hostRect.right - pad - r.right; /* ja posuniem doľava */
            const topLimit = hudRect
              ? hudRect.bottom + pad
              : hostRect.top + pad; /* ja nedovolím ísť pod HUD */
            if (r.top < topLimit)
              dy = topLimit - r.top; /* ja posuniem dole pod HUD */
            if (r.bottom > hostRect.bottom - pad)
              dy = hostRect.bottom - pad - r.bottom; /* ja posuniem hore */

            dx = Math.round(dx); /* ja odstránim subpixel */
            dy = Math.round(dy); /* ja odstránim subpixel */

            /* ja zabránim prekrytiu: posuniem WRONG bublinu mimo CORRECT bubliny */
            if (el.classList.contains("wrong")) {
              const correctEl = document.querySelector(
                ".globe-bubble.correct.show",
              ); /* ja nájdem correct */
              if (correctEl) {
                const a = el.getBoundingClientRect(); /* ja zistím môj rect */
                const b =
                  correctEl.getBoundingClientRect(); /* ja zistím correct rect */

                const overlap = !(
                  a.right < b.left ||
                  a.left > b.right ||
                  a.bottom < b.top ||
                  a.top > b.bottom
                ); /* ja zistím či sa prekrývame */

                if (overlap) {
                  const overlapH =
                    Math.min(a.bottom, b.bottom) -
                    Math.max(a.top, b.top); /* ja zistím výšku prekrytia */
                  const push = Math.ceil(overlapH + 12); /* ja pridám padding */

                  const canUp =
                    a.top + dy - push >=
                    hostRect.top + pad; /* ja skontrolujem či sa zmestím hore */
                  const canDown =
                    a.bottom + dy + push <=
                    hostRect.bottom -
                      pad; /* ja skontrolujem či sa zmestím dole */

                  if (a.top < b.top) {
                    dy = canUp
                      ? dy - push
                      : dy +
                        push; /* ja som hore, tak idem ešte vyššie (ak sa dá) */
                  } else {
                    dy = canDown
                      ? dy + push
                      : dy -
                        push; /* ja som dole, tak idem ešte nižšie (ak sa dá) */
                  }
                }
              }
            }

            el.style.translate = `${dx}px ${dy}px`; /* ja spravím clamp až keď je kamera stabilná */
          }

          requestAnimationFrame(step); /* ja spustím */
        }

        clampBubbleToScreen(); /* ja zavolám clamp */

        return el; /* ja vrátim bublinu */
      });

    // ✅ jemne zosvetlíme scénu, aby textúra nebola tmavá (lacné, veľký efekt)
    try {
      const scene = globeInstance.scene(); // three scene
      if (scene && typeof THREE !== "undefined") {
        const amb = new THREE.AmbientLight(0xffffff, 0.85); // silnejšie ambient svetlo
        scene.add(amb); // pridaj do scény
      }
    } catch (e) {
      console.log("Light add skipped:", e); // ak by THREE nebolo
    }

    const ctrls = globeInstance.controls(); // OrbitControls
    if (ctrls) {
      ctrls.enableDamping = false; // ✅ vypni damping, to často robí “slow motion”
      ctrls.rotateSpeed = 3.0; // ✅ rýchlejšie otáčanie prstom
      ctrls.zoomSpeed = 2.2; // rýchlejší pinch zoom
      ctrls.autoRotate = false; // bez autorotate
      ctrls.enableZoom = true; // zoom povolený
      ctrls.enablePan = false; // pan vypnutý
      ctrls.minDistance = 120; // 🔍 dovolí veľmi blízky zoom (ostrovy)
      ctrls.maxDistance = 800; // 🌍 dovolí aj vzdialiť celý glóbus
    }

    globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 3.6 }, 0);

    globeInstance.onGlobeClick((coords) => {
      if (answerLocked) return;
      if (!countriesFeatures) return;

      const hit = findFeatureByLatLng(lat, lng);
      if (!hit) return;

      /* ja ručne spustím polygon klik */
      if (globeInstance && globeInstance.__polygonClickHandler) {
        globeInstance.__polygonClickHandler(hit);
      }
    });

    window.addEventListener("resize", () => {
      sizeGlobeToContainer(); // pri resize dorovnaj
    });
  }

  function applyPolygonStyle(isDragging) {
    // ja riadim celý vizuál poligonov, aj drag aj quiz highlight
    if (!globeInstance) return; // ja skončím ak glóbus ešte neexistuje

    globeInstance.polygonsTransitionDuration(0); // ja nechcem animácie

    globeInstance.polygonAltitude((feat) => {
      const isCorrect =
        highlightCorrectFeature && feat === highlightCorrectFeature;
      const isWrong = highlightWrongFeature && feat === highlightWrongFeature;
      const isHit = isCorrect || isWrong;

      if (isHit) return 0.01; // highlight
      return bordersEnabled ? 0.003 : 0.0008; // ⭐ viac visible borders
    });

    globeInstance.polygonCapColor((feat) => {
      // ja farbím vrch krajiny
      if (highlightCorrectFeature && feat === highlightCorrectFeature)
        return "rgb(9,82,9)"; // správna
      if (highlightWrongFeature && feat === highlightWrongFeature)
        return "rgba(255,0,0,0.60)"; // zlá
      return "rgba(0,0,0,0)"; // ostatné transparentné aby bola vidno earth textura
    });

    globeInstance.polygonStrokeColor(() => {
      if (isDragging) return "rgba(0,0,0,0)";
      return bordersEnabled
        ? "rgba(0,0,0,1)" // ⭐ ostrá línia
        : "rgba(0,0,0,0)";
    });

    globeInstance.polygonSideColor((feat) => {
      const isCorrect =
        highlightCorrectFeature && feat === highlightCorrectFeature;
      const isWrong = highlightWrongFeature && feat === highlightWrongFeature;
      const isHit = isCorrect || isWrong;

      if (isDragging) return "rgba(0,0,0,0)";
      if (isHit) return "rgba(0,0,0,0)";

      return bordersEnabled
        ? "rgba(0,0,0,0.75)" // ⭐ silnejšie boky = viac viditeľné
        : "rgba(0,0,0,0)";
    });
  }

  async function loadCountriesOnce() {
    console.time("LOAD_COUNTRIES"); // tu si meriam načítanie
    console.log("LOAD COUNTRIES START"); // tu si vypíšem debug

    if (countriesLoaded) return; // tu stopnem, ak už sú načítané
    countriesLoaded = true; // tu označím ako načítané

    try {
      if (!globeInstance) throw new Error("globeInstance neexistuje"); // tu stopnem, ak glóbus nie je pripravený

      const res = await fetch(COUNTRIES_GEOJSON); // tu načítam geojson
      if (!res.ok)
        throw new Error("countries.geojson sa nenačítal (možný 404)"); // tu stopnem, ak fetch zlyhal

      const geo = await res.json(); // tu parse JSON

      if (
        geo &&
        geo.type === "FeatureCollection" &&
        Array.isArray(geo.features)
      ) {
        countriesFeatures = geo.features; // tu uložím features
        /* ===== MERGE SOMALIA + SOMALILAND ===== */
        {
          const somalia = countriesFeatures.find(
            (f) => (f?.properties?.name || f?.properties?.ADMIN) === "Somalia",
          );

          const somaliland = countriesFeatures.find(
            (f) =>
              (f?.properties?.name || f?.properties?.ADMIN) === "Somaliland",
          );

          if (somalia && somaliland) {
            const mergeCoords = (geomA, geomB) => {
              if (geomA.type === "Polygon")
                geomA = {
                  type: "MultiPolygon",
                  coordinates: [geomA.coordinates],
                };
              if (geomB.type === "Polygon")
                geomB = {
                  type: "MultiPolygon",
                  coordinates: [geomB.coordinates],
                };

              return {
                type: "MultiPolygon",
                coordinates: [
                  ...(geomA.coordinates || []),
                  ...(geomB.coordinates || []),
                ],
              };
            };

            somalia.geometry = mergeCoords(
              somalia.geometry,
              somaliland.geometry,
            );

            /* odstránim Somaliland z datasetu */
            countriesFeatures = countriesFeatures.filter(
              (f) => f !== somaliland,
            );
          }
        }
      } else if (
        geo &&
        geo.type === "GeometryCollection" &&
        Array.isArray(geo.geometries)
      ) {
        countriesFeatures = geo.geometries
          .filter(
            (g) => g && (g.type === "Polygon" || g.type === "MultiPolygon"),
          )
          .map((g, i) => ({
            type: "Feature",
            geometry: g,
            properties: { name: `Country ${i + 1}` },
          }));
      } else {
        throw new Error("Neznámy formát geojsonu");
      }

      console.log("FEATURES COUNT:", countriesFeatures.length);

      globeInstance;

      globeInstance.polygonsData(countriesFeatures); // ja nastavím GeoJSON dáta krajín do globu, bez tohto by sa nič nevykreslilo

      globeInstance.polygonCapCurvatureResolution(5); // ja nastavím rozlíšenie zakrivenia polygonov, nižšie číslo = lepší výkon, vyššie = hladšie okraje

      globeInstance.polygonAltitude((feat) => {
        // ja určujem výšku polygonu nad povrchom zemegule (ovplyvňuje aj vizuálnu "hrúbku" borders)

        if (highlightCorrectFeature && feat === highlightCorrectFeature)
          return 0.006; // ja zdvihnem správnu krajinu vyššie, aby bola výrazná

        if (highlightWrongFeature && feat === highlightWrongFeature)
          return 0.006; // ja zdvihnem nesprávnu krajinu rovnako vysoko ako správnu

        return 0.004;
      });

      globeInstance.polygonsTransitionDuration(0);

      applyPolygonStyle(false);

      quizCountries = buildQuizCountries();
      currentQuestionIndex = 0;
      quizScore = 0;

      showNextQuestion();
    } catch (err) {
      console.log("GeoJSON chyba:", err);
      countriesLoaded = false;
      countriesFeatures = null;
    } finally {
      console.timeEnd("LOAD_COUNTRIES");
    }
  }

  function setGlobeQuestionText(txt) {
    const el = qs("globe-question");
    if (!el) return;
    el.textContent = txt;
  }

  const CAMERA_FOCUS_MS = 1200; /* čas animácie kamery — musí byť rovnaký ako pointOfView */

  function moveCameraTo(lat, lng) {
    if (!globeInstance) return;

    lastCameraMoveTime = performance.now(); // ja si uložím čas pohybu kamery

    globeInstance.pointOfView(
      { lat: lat, lng: lng, altitude: 2.2 },
      CAMERA_FOCUS_MS,
    );
  }

  function updateGlobeStatusUI() {
    const total =
      quizCountries && quizCountries.length ? quizCountries.length : 30;
    const qNum = Math.min(currentQuestionIndex + 1, total);

const qEl = document.getElementById("globe-qcount");
qEl.textContent = `${qNum} / ${total}`;
const sEl = document.getElementById("globe-score");
if (sEl) sEl.textContent = `${t("score")}: ${quizScore}`;

    const fill = document.getElementById("globe-progress-fill");
    const pct = Math.max(
      0,
      Math.min(100, (currentQuestionIndex / total) * 100),
    );
    if (fill) fill.style.width = `${pct}%`;
  }

  function showGlobeNextButton() {
    const btn =
      document.getElementById("globe-next-btn") ||
      document.getElementById("next-btn");
    if (!btn) return;

    btn.style.display = "block";
    btn.disabled = false;
    btn.classList.add("show");
  }

  function showNextQuestion() {
    /* ja posuniem quiz na ďalšiu otázku */

    if (!quizCountries || quizCountries.length === 0) {
      /* ja skúsim vytvoriť zoznam otázok */
      quizCountries =
        buildQuizCountries(); /* ja postavím quiz z geojson features */
    }

    if (!quizCountries || quizCountries.length === 0) {
      /* ja stále nič nemám */
      setGlobeQuestionText("Loading..."); /* ja ukážem loading */
      return; /* ja končím */
    }

 if (currentQuestionIndex >= quizCountries.length) {

  const resultScreen = document.getElementById("globe-result-screen");
  const scoreEl = document.getElementById("globe-final-score");
  const maxEl = document.getElementById("globe-max-score");

  if (scoreEl) scoreEl.textContent = String(quizScore);
  if (maxEl) maxEl.textContent = String(quizCountries.length);

  /* percentá výkonu */
  const pct = quizCountries.length ? quizScore / quizCountries.length : 0;

  let key;

  if (pct >= 0.9) key = "resultGreat";
  else if (pct >= 0.7) key = "resultGood";
  else if (pct >= 0.4) key = "resultOk";
  else key = "resultBad";

if (globeResultMessageEl) globeResultMessageEl.textContent = t(key);

  const hud = document.getElementById("globe-hud");
  if (hud) hud.style.display = "none";

  if (resultScreen) {
    resultScreen.style.display = "flex";
    resultScreen.classList.add("show");
  }

  return;
}

    answerLocked = false; /* ja dovolím nové kliknutie */
    currentCorrectFeature =
      quizCountries[
        currentQuestionIndex
      ]; /* ja nastavím správnu krajinu pre túto otázku */

    highlightCorrectFeature = null; /* ja zruším zelený highlight */
    highlightWrongFeature = null; /* ja zruším červený highlight */
    bubbleData = []; /* ja zruším bubliny */
    if (globeInstance)
      globeInstance.htmlElementsData(
        [],
      ); /* ja reálne vymažem bubliny z globusu */

    const labelEl =
      document.getElementById(
        "country-label",
      ); /* ja schovám label po odpovedi */
    if (labelEl) labelEl.classList.remove("show"); /* ja schovám */

    applyPolygonStyle(false); /* ja vrátim normálny vizuál */
    updateGlobeStatusUI(); /* ja obnovím Question X of Y, Score, progress */

    const displayName = getDisplayNameFromFeature(
      currentCorrectFeature,
    ); /* ja získam krátky názov do UI */
setGlobeQuestionText(`${t("question")}: ${displayName}`);
  }

  const DISPLAY_NAME_MAP = {
    "United Republic of Tanzania": "Tanzania",
    "Czech Republic": "Czechia",
    Czechia: "Czechia",
  };

function getDisplayNameFromFeature(feat) {
  const raw =
    feat?.properties?.name ||
    feat?.properties?.ADMIN ||
    feat?.properties?.NAME ||
    "";

  const lang =
    localStorage.getItem("lang") ||
    localStorage.getItem("language") ||
    localStorage.getItem("selectedLang") ||
    localStorage.getItem("selectedLanguage") ||
    "en";

  const shortName = DISPLAY_NAME_MAP?.[raw] || raw;

  const iso3 = feat?.id || ""; /* ISO3 z geojson, napr AFG */
  const iso2 = window.ISO3_TO_ISO2?.[iso3] || ""; /* ISO2, napr AF */

  /* 1) Najprv skúsim automatický preklad cez Intl pre KAŽDÚ krajinu */
  if (iso2 && typeof Intl !== "undefined" && Intl.DisplayNames) {
    try {
      const dn = new Intl.DisplayNames([lang], { type: "region" });
      const autoName = dn.of(iso2);
      if (autoName) return autoName;
    } catch (e) {
      /* nič, spadnem na fallback */
    }
  }

  /* 2) Fallback: ak máš v lang.js vlastné preklady pre niektoré názvy */
  const manual = window.LANG?.[lang]?.countries?.[shortName];
  return manual || shortName;
}


function findFeatureByLatLng(lat, lng) {
  if (!countriesFeatures || !countriesFeatures.length) return null;

  for (const f of countriesFeatures) {
    const g = f?.geometry;
    if (!g) continue;

    const checkRing = (ring) => {
      if (!ring || ring.length < 3) return false;

      let inside = false;

      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const xi = ring[i][0];
        const yi = ring[i][1];
        const xj = ring[j][0];
        const yj = ring[j][1];

        const intersects =
          (yi > lat) !== (yj > lat) &&
          lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

        if (intersects) inside = !inside;
      }

      return inside;
    };

    const checkPolygon = (poly) => {
      if (!poly || !poly.length) return false;

      if (checkRing(poly[0])) return true; /* vonkajší ring */

      return false;
    };

    if (g.type === "Polygon") {
      if (checkPolygon(g.coordinates)) return f;
    }

    if (g.type === "MultiPolygon") {
      for (const poly of g.coordinates) {
        if (checkPolygon(poly)) return f;
      }
    }
  }

  return null;
}

  function wireGlobePolygonClick() {
    if (!globeInstance) return;

    const handlePolyClick = (poly) => {
      if (!poly || !poly.properties) return;
      if (answerLocked) return;
      answerLocked = true;

      let clickedFeature = poly;

      // ja opravím Somalia klik: keď je otázka Somalia a trafím Somaliland, beriem to ako Somalia
      // ja opravím Somalia klik: keď je otázka Somalia a trafím Somaliland, beriem to ako Somalia
      const clickedNameSL = String(
        clickedFeature?.properties?.name || "",
      ).trim();
      const correctNameSL = String(
        currentCorrectFeature?.properties?.name || "",
      ).trim();

      if (correctNameSL === "Somalia" && clickedNameSL === "Somaliland") {
        clickedFeature = currentCorrectFeature; // ja prepnem klik na Somalia
      }

    const labelEl = document.getElementById("country-label");
const nameEl = document.getElementById("country-name");
const flagEl = document.getElementById("country-flag");

if (labelEl && poly) {

  const displayName = getDisplayNameFromFeature(poly); // použije preklady

  if (nameEl) nameEl.textContent = displayName || "Unknown";

  const iso3 =
    poly?.properties?.ISO_A3 ||
    poly?.properties?.ADM0_A3 ||
    poly?.properties?.iso_a3 ||
    "";

  const iso2 = (ISO3_TO_ISO2[iso3] || "").toLowerCase();

  if (flagEl) {
    if (iso2) {
      flagEl.src = `flags2/${iso2}.webp`;
      flagEl.style.display = "block";
    } else {
      flagEl.style.display = "none";
    }
  }

  labelEl.classList.add("show");
}

      const isCorrect = clickedFeature === currentCorrectFeature;

      const getFeatureCenter = (feat) => {
        const coordsRoot = feat?.geometry?.coordinates;
        if (!coordsRoot) return { lat: 0, lng: 0 };

        let sumLat = 0;
        let sumSin = 0;
        let sumCos = 0;
        let n = 0;

        const toRad = (v) => (v * Math.PI) / 180;
        const toDeg = (v) => (v * 180) / Math.PI;

        const walk = (node) => {
          if (!node) return;

          if (typeof node[0] === "number" && typeof node[1] === "number") {
            const lng = node[0];
            const lat = node[1];
            if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;

            sumLat += lat;
            const r = toRad(lng);
            sumSin += Math.sin(r);
            sumCos += Math.cos(r);
            n++;
            return;
          }

          for (let i = 0; i < node.length; i++) walk(node[i]);
        };

        walk(coordsRoot);

        if (!n) return { lat: 0, lng: 0 };

        const lat = sumLat / n;
        const lng = toDeg(Math.atan2(sumSin / n, sumCos / n));
        return { lat: lat, lng: lng };
      };

   const getName = (feat) => getDisplayNameFromFeature(feat) || "Unknown";
const correctCenter = getFeatureCenter(currentCorrectFeature);
const wrongCenter = getFeatureCenter(clickedFeature);


if (isCorrect) {
  safeVibrate(140); /* vibrácia pre correct */

  moveCameraTo(correctCenter.lat, correctCenter.lng);
} else {
  safeVibrate([180, 90, 180]); /* vibrácia pre wrong */

  const toRad = (v) => (v * Math.PI) / 180;
  const toDeg = (v) => (v * 180) / Math.PI;

  const lat1 = toRad(correctCenter.lat);
  const lng1 = toRad(correctCenter.lng);
  const lat2 = toRad(wrongCenter.lat);
  const lng2 = toRad(wrongCenter.lng);

  const x1 = Math.cos(lat1) * Math.cos(lng1);
  const y1 = Math.cos(lat1) * Math.sin(lng1);
  const z1 = Math.sin(lat1);

  const x2 = Math.cos(lat2) * Math.cos(lng2);
  const y2 = Math.cos(lat2) * Math.sin(lng2);
  const z2 = Math.sin(lat2);

  let xm = x1 + x2;
  let ym = y1 + y2;
  let zm = z1 + z2;

  const len = Math.hypot(xm, ym, zm) || 1;
  xm /= len;
  ym /= len;
  zm /= len;

  const midLat = toDeg(Math.asin(zm));
  const midLng = toDeg(Math.atan2(ym, xm));

  globeInstance.pointOfView(
    { lat: midLat, lng: midLng, altitude: 3.2 },
    1200
  );
}

      showGlobeNextButton();

      const correctName = getName(currentCorrectFeature);
      const wrongName = getName(clickedFeature);

      const correctISO3 = String(currentCorrectFeature?.id || "").toUpperCase();
      const wrongISO3 = String(clickedFeature?.id || "").toUpperCase();

      const ISO2_OVERRIDES = {
        GTM: "gt",
        PRT: "pt",
        SVK: "sk",
        JPN: "jp",
        PNG: "pg",
        USA: "us",
        GBR: "gb",
      };

      const fixISO2 = (code) => {
        const base = String(code || "").toUpperCase();
        if (!base) return "";
        if (base.length === 2) return base.toLowerCase();

        const override = ISO2_OVERRIDES[base];
        if (override) return override;

        const mapped = ISO3_TO_ISO2?.[base];
        if (typeof mapped === "string" && mapped.length === 2)
          return mapped.toLowerCase();

        return "";
      };

      const correctISO2 = fixISO2(correctISO3);
      const wrongISO2 = fixISO2(wrongISO3);

      bubbleData = [];

      bubbleData.push({
        kind: "correct",
        name: correctName,
        iso2: correctISO2,
        lat: correctCenter.lat,
        lng: correctCenter.lng,
        alt: 0.06,
      });

      if (!isCorrect) {
        bubbleData.push({
          kind: "wrong",
          name: wrongName,
          iso2: wrongISO2,
          lat: wrongCenter.lat,
          lng: wrongCenter.lng,
          alt: 0.06,
        });
      }

      globeInstance.htmlElementsData(bubbleData);
      if (typeof window.updateGlobeBubbles === "function")
        window.updateGlobeBubbles();

      if (isCorrect) quizScore += 1;

      highlightCorrectFeature = currentCorrectFeature;
      highlightWrongFeature = isCorrect ? null : clickedFeature;

      applyPolygonStyle(false);

      window.updateGlobeBubbles();
    };

    globeInstance.onPolygonClick(handlePolyClick); /* ja napojím klik handler */
    globeInstance.onGlobeClick((coords) => {
      console.log(
        "GLOBE CLICK coords:",
        coords.lat,
        coords.lng,
      ); /* ja si vypíšem lat,lng */

      if (answerLocked) return;

      const f = findFeatureByLatLng(coords.lat, coords.lng);
      console.log(
        "GLOBE CLICK feature:",
        f?.properties?.name || f?.properties?.ADMIN || "NULL",
      ); /* ja si vypíšem čo našlo */

      if (!f) return;
      handlePolyClick(f);
    });
  } // ja uzavriem wireGlobePolygonClick

  function hapticTap() {
    /* ja chcem rovnaký jemný haptic ako menu a classic */
    try {
      if (typeof hapticClick === "function") {
        /* ja použijem tvoju menu haptic funkciu */
        hapticClick(); /* toto je ten istý pocit ako v menu */
        return;
      }
    } catch (e) {}

    if (navigator && typeof navigator.vibrate === "function") {
      navigator.vibrate(60); /* fallback rovnaký ako v hapticClick */
    }
  }

  function wireGlobePlayAgain() {
    const restartBtn = document.getElementById("globe-restart-btn");
    if (!restartBtn) return;

    restartBtn.onclick = () => {
      hapticTap(); // vibrácia pri Play Again

      const resultScreen = document.getElementById("globe-result-screen");
      if (resultScreen) resultScreen.style.display = "none"; // skryť results

      const hud = document.getElementById("globe-hud");
      if (hud) hud.style.display = "block"; // zobraziť HUD

      const nextBtn = document.getElementById("globe-next-btn");
      if (nextBtn) {
        nextBtn.classList.remove("show"); // odstrániť animáciu
        nextBtn.style.display = "none"; // skryť tlačidlo
        nextBtn.disabled = true; // deaktivovať klik
      }

      answerLocked = false; // odomknúť odpoveď
      highlightCorrectFeature = null; // zrušiť highlight správnej
      highlightWrongFeature = null; // zrušiť highlight zlej

      // zosúladiť bordersEnabled s aktuálnym stavom toggle v UI
      bordersEnabled = document.getElementById("reactor")?.checked === true;

      bubbleData = []; // vymazať bubliny
      if (globeInstance) globeInstance.htmlElementsData([]); // odstrániť HTML prvky z glóbusu

      quizCountries = buildQuizCountries(); // vytvoriť nové otázky
      currentQuestionIndex = 0; // reset indexu
      quizScore = 0; // reset skóre

      applyPolygonStyle(false); // aplikovať štýl polygonov podľa bordersEnabled
      showNextQuestion(); // zobraziť prvú otázku
    };
  }

  window.restartGlobeQuiz = function () {
    /* ja resetnem Map Master pri BACK */

    const resultScreen = document.getElementById("globe-result-screen");
    if (resultScreen) resultScreen.style.display = "none";

    const hud = document.getElementById("globe-hud");
    if (hud) hud.style.display = "block";

    const nextBtn = document.getElementById("globe-next-btn");
    if (nextBtn) {
      nextBtn.classList.remove("show");
      nextBtn.style.display = "none";
      nextBtn.disabled = true;
    }

    const labelEl = document.getElementById("country-label");
    if (labelEl) labelEl.classList.remove("show");

    answerLocked = false;
    highlightCorrectFeature = null;
    highlightWrongFeature = null;
    bordersEnabled = false;

    bubbleData = [];
    if (globeInstance) globeInstance.htmlElementsData([]);

    quizCountries = buildQuizCountries();
    currentQuestionIndex = 0;
    quizScore = 0;

    applyPolygonStyle(false);
    showNextQuestion();
  };

  function wireGlobeNextButton() {
    const btn = document.getElementById("globe-next-btn");
    if (!btn) return;
    btn.onclick = () => {
      hapticTap(); /* ja vibrujem pri Next */

      btn.classList.remove("show");
      btn.style.display = "none";

      highlightCorrectFeature = null;
      highlightWrongFeature = null;

      btn.classList.remove("show");
      btn.style.display = "none";

      highlightCorrectFeature = null;
      highlightWrongFeature = null;

      bubbleData = [];
      if (globeInstance) globeInstance.htmlElementsData([]);

      applyPolygonStyle(false);

      currentQuestionIndex = currentQuestionIndex + 1;

      showNextQuestion();
    };
  }

  function wireBordersToggle() {
    const label = document.getElementById("globe-borders-label");
if (label) label.textContent = t("countryBorders");
    const input = document.getElementById("reactor");
    if (!input) return;

    input.checked = bordersEnabled;

    input.onchange = null;

    input.addEventListener("change", () => {
      bordersEnabled = input.checked;
      applyPolygonStyle(false);
    });

    const wrap = input.closest(".reactor-widget");
    if (wrap) {
      wrap.style.pointerEvents = "auto";
      wrap.addEventListener("pointerdown", (e) => e.stopPropagation(), {
        passive: true,
      });
      wrap.addEventListener("touchstart", (e) => e.stopPropagation(), {
        passive: true,
      });
      wrap.addEventListener("click", (e) => e.stopPropagation(), {
        passive: true,
      });
    }
  }

  window.initGlobeOnce = async function () {
    if (initRunning) return;
    if (countriesLoaded && globeInstance) return;
    initRunning = true;

    const preloadOnly = document.body.classList.contains("globe-preload");
    const alreadyReady = !!globeInstance && countriesLoaded;
    let loaderShown = false;

    try {
      if (!preloadOnly) showGlobeScreenOnly();

      if (!preloadOnly && !alreadyReady) {
        showLoader();
        loaderShown = true;
      }

      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 120));

      sizeGlobeToContainer();
      await waitForRealSize(90);

      createGlobeIfNeeded();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      sizeGlobeToContainer();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      sizeGlobeToContainer();

      await loadCountriesOnce();
      wireBordersToggle();

      wireGlobePolygonClick();
      wireGlobePlayAgain();
      wireGlobeNextButton();

      globeInstance.pointOfView({ lat: 20, lng: 10, altitude: 3.8 }, 0);

      if (globeInstance.controls) globeInstance.controls().update();
    } finally {
      initRunning = false;
      if (loaderShown) hideLoader();
      console.timeEnd("GLOBE_INIT");
    }
  };
})();

/* =========================
   MAP MASTER START SCREEN
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* ja počkám kým je DOM */

  const startScreen =
    document.getElementById("globe-start-screen"); /* ja nájdem start screen */
  const startBtn =
    document.getElementById("globe-start-btn"); /* ja nájdem LET'S GO */

  if (startScreen) {
    startScreen.classList.add("show"); /* ja zobrazím start screen */
  }

  if (startBtn && startScreen) {
    startBtn.addEventListener("click", () => {
      /* ja kliknem na LET'S GO */

      try {
        if (typeof hapticClick === "function")
          hapticClick(); /* ja dám jemný haptic ako menu */
      } catch (e) {} /* ja nič nepokazím ak haptic zlyhá */

      startScreen.classList.remove("show"); /* ja schovám start screen */

      try {
        if (typeof startGlobeQuiz === "function")
          startGlobeQuiz(); /* ja spustím quiz */
      } catch (e) {} /* ja nič nepokazím ak by bola chyba */
    });
  }
});

/* ========================= */
/* 🌍 GLOBE RESULTS (Map Master) */
/* ========================= */

/* 1) tieto elementy si nájdem v tvojom HTML podľa ID, aby som ich vedela ovládať z JS */
const globeResultScreen = document.getElementById(
  "globe-result-screen",
); /* toto je overlay div s results */
const globeFinalScoreEl =
  document.getElementById(
    "globe-final-score",
  ); /* sem píšem finálne score číslo */
const globeMaxScoreEl =
  document.getElementById("globe-max-score"); /* sem píšem max počet otázok */
const globeResultMessageEl = document.getElementById("globe-result-message");
const globeRestartBtn =
  document.getElementById("globe-restart-btn"); /* Play Again button */



/* 3) táto funkcia skryje results overlay (keď hráš znova) */
function hideGlobeResults() {
  /* toto volám pred štartom novej hry */
  if (!globeResultScreen) return; /* bezpečnosť */
  globeResultScreen.classList.remove("show"); /* zoberiem triedu */
  globeResultScreen.style.display = "none"; /* skryjem overlay */
}

/* 4) klik na Play Again: resetujem quiz a začnem znova */
if (globeRestartBtn) {
  /* ak button existuje */
  globeRestartBtn.addEventListener("click", () => {
    /* keď klikneš */
    hideGlobeResults(); /* schovám results okno */
    restartGlobeQuiz(); /* toto je funkcia, ktorú teraz pridáme v tvojom globe.js */
  });
}
