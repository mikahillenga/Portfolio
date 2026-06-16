/* =====================================================================
   CGI-oefenomgeving — applicatielogica
   Geen build-stap nodig: open index.html in je browser.
   Voortgang/notities/aangevinkte modelpunten staan in localStorage.
   ===================================================================== */

(function () {
  "use strict";

  const DATA = window.CGI_DATA;
  const STORE_KEY = "cgi-oefen-v1";

  /* ---------- localStorage helpers ---------- */
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  let store = loadStore();
  function getEntry(id) {
    if (!store[id]) store[id] = { notitie: "", rating: null, checked: {} };
    if (!store[id].checked) store[id].checked = {};
    return store[id];
  }
  function checkedCount(id) {
    const c = (store[id] && store[id].checked) || {};
    return Object.keys(c).filter(k => c[k]).length;
  }

  /* ---------- algemene helpers ---------- */
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(str) {
    return String(str).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function lolById(id) { return DATA.lols.find(l => l.id === id); }
  function groupById(id) { return id === "alg" ? DATA.algGroep : lolById(id); }
  function lolLabel(id) {
    if (id === "alg") return "Portfolio-breed";
    const l = lolById(id);
    return l ? ("LOL " + l.nummer + " — " + l.naam) : id;
  }
  function lolColor(id) {
    if (id === "alg") return DATA.algGroep.kleur;
    const l = lolById(id);
    return l ? l.kleur : "#2563eb";
  }
  function allGroupIds() { return DATA.lols.map(l => l.id).concat(["alg"]); }

  /* ---------- spraak: voorlezen (TTS) + herkenning (STT) ---------- */
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  const synth = window.speechSynthesis || null;
  let activeRec = null;        // lopende SpeechRecognition (browser)
  let activeRecorder = null;   // lopende MediaRecorder (Whisper)
  let dutchVoice = undefined;  // gecachte NL-stem

  /* ---------- transcriptie-instellingen (browser of lokale Whisper) ---------- */
  const STT_KEY = "cgi-stt-v1";
  const STT_PRESETS = {
    openai:     { url: "http://127.0.0.1:8000/v1/audio/transcriptions", label: "OpenAI-compatible (/v1/audio/transcriptions)" },
    whispercpp: { url: "http://127.0.0.1:8080/inference",               label: "whisper.cpp server (/inference)" },
    asr:        { url: "http://127.0.0.1:9000/asr",                     label: "whisper-asr-webservice (/asr)" }
  };
  const sttDefault = { engine: "browser", format: "openai", url: STT_PRESETS.openai.url, lang: "nl", model: "base" };
  let sttSettings = (function () {
    try { return Object.assign({}, sttDefault, JSON.parse(localStorage.getItem(STT_KEY)) || {}); }
    catch (e) { return Object.assign({}, sttDefault); }
  })();
  function saveStt() { try { localStorage.setItem(STT_KEY, JSON.stringify(sttSettings)); } catch (e) {} }

  function pickDutchVoice() {
    if (!synth) return null;
    if (dutchVoice !== undefined) return dutchVoice;
    const voices = synth.getVoices() || [];
    dutchVoice = voices.find(v => /nl(-|_)?NL/i.test(v.lang)) || voices.find(v => /^nl/i.test(v.lang)) || null;
    return dutchVoice;
  }
  if (synth && typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", () => { dutchVoice = undefined; pickDutchVoice(); });
  }

  function stopSpeaking() { if (synth) try { synth.cancel(); } catch (e) {} }

  function speak(text, onDone) {
    if (!synth) return false;
    stopSpeaking();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "nl-NL";
    const v = pickDutchVoice();
    if (v) u.voice = v;
    u.rate = 1.0; u.pitch = 1.0;
    if (onDone) u.onend = onDone;
    synth.speak(u);
    return true;
  }

  function stopRecognition() {
    if (activeRec) { try { activeRec.stop(); } catch (e) {} activeRec = null; }
  }
  function stopRecorder() {
    if (activeRecorder) { try { activeRecorder.stop(); } catch (e) {} activeRecorder = null; }
  }
  function stopAllCapture() { stopRecognition(); stopRecorder(); }

  /* Zet opgenomen audio om naar 16kHz mono WAV — universeel leesbaar voor Whisper. */
  async function blobToWav16k(blob) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("AudioContext niet beschikbaar");
    const arr = await blob.arrayBuffer();
    const tmp = new AC();
    const decoded = await tmp.decodeAudioData(arr);
    if (tmp.close) tmp.close();
    const rate = 16000;
    const off = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * rate)), rate);
    const src = off.createBufferSource();
    src.buffer = decoded;           // multi-channel wordt automatisch naar mono gemengd
    src.connect(off.destination);
    src.start(0);
    const rendered = await off.startRendering();
    return encodeWav(rendered.getChannelData(0), rate);
  }
  function encodeWav(samples, rate) {
    const buf = new ArrayBuffer(44 + samples.length * 2);
    const v = new DataView(buf);
    const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); w(8, "WAVE"); w(12, "fmt ");
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
    w(36, "data"); v.setUint32(40, samples.length * 2, true);
    let o = 44;
    for (let i = 0; i < samples.length; i++) {
      let x = Math.max(-1, Math.min(1, samples[i]));
      v.setInt16(o, x < 0 ? x * 0x8000 : x * 0x7FFF, true); o += 2;
    }
    return new Blob([buf], { type: "audio/wav" });
  }
  function addParam(url, k, val) { return url + (url.indexOf("?") < 0 ? "?" : "&") + k + "=" + encodeURIComponent(val); }

  /* Stuurt audio naar de lokale Whisper-server en geeft de transcriptie terug. */
  async function transcribeViaWhisper(blob) {
    const s = sttSettings;
    let sendBlob = blob, filename = "speech.webm";
    try { sendBlob = await blobToWav16k(blob); filename = "speech.wav"; } catch (e) { /* val terug op ruwe opname */ }

    const fd = new FormData();
    let url = s.url;
    if (s.format === "asr") {
      fd.append("audio_file", sendBlob, filename);
      url = addParam(url, "output", "json");
      if (s.lang) url = addParam(url, "language", s.lang);
    } else if (s.format === "whispercpp") {
      fd.append("file", sendBlob, filename);
      fd.append("response_format", "json");
      if (s.lang) fd.append("language", s.lang);
    } else { // openai-compatible
      fd.append("file", sendBlob, filename);
      fd.append("model", s.model || "whisper-1");
      fd.append("response_format", "json");
      if (s.lang) fd.append("language", s.lang);
    }

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const ct = res.headers.get("content-type") || "";
    if (ct.indexOf("application/json") >= 0) {
      const j = await res.json();
      return ((j && (j.text || j.transcription)) || "").trim();
    }
    return (await res.text()).trim();
  }

  /* Opnemen + transcriberen via lokale Whisper. */
  async function startWhisperRecording(ta, entry, micBtn, status, interim) {
    if (!navigator.mediaDevices || !window.MediaRecorder) { status.textContent = "Opname wordt niet ondersteund in deze browser."; return; }
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { status.textContent = "Geen microfoontoegang. Sta de microfoon toe (en gebruik http://localhost of https)."; return; }

    let rec;
    try { rec = new MediaRecorder(stream); } catch (e) { status.textContent = "Kon de opname niet starten."; stream.getTracks().forEach(t => t.stop()); return; }
    activeRecorder = rec;
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());
      micBtn.textContent = "🎤 Spreek antwoord";
      micBtn.classList.remove("rec-on");
      if (activeRecorder === rec) activeRecorder = null;
      const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
      status.textContent = "Transcriberen met Whisper…";
      interim.hidden = false; interim.textContent = "⏳ Even geduld, je laptop verwerkt de audio…";
      micBtn.disabled = true;
      try {
        const text = await transcribeViaWhisper(blob);
        if (text) {
          const sep = ta.value && !/\s$/.test(ta.value) ? " " : "";
          ta.value = ta.value + sep + text;
          entry.notitie = ta.value; saveStore(store);
          status.textContent = "Klaar ✓ (via Whisper)";
        } else { status.textContent = "Geen tekst herkend."; }
      } catch (err) {
        status.textContent = "Whisper-fout: " + err.message + " — draait de server? Controleer ⚙ Transcriptie.";
      }
      interim.hidden = true; interim.textContent = "";
      micBtn.disabled = false;
    };
    micBtn.textContent = "⏹ Stop opnemen";
    micBtn.classList.add("rec-on");
    status.textContent = "Aan het opnemen… (Whisper). Klik om te stoppen en te transcriberen.";
    rec.start();
  }

  /* Bouwt de spreek-balk (voorlezen + antwoord inspreken) onder een vraag. */
  function speakBar(q, ta, entry) {
    const bar = el("div", "speak-bar");

    // Voorlezen
    const readBtn = el("button", "btn btn-small btn-ghost speak-read", "🔊 Lees voor");
    readBtn.title = synth ? "Laat de assessor de vraag voorlezen" : "Voorlezen wordt niet ondersteund in deze browser";
    if (!synth) readBtn.disabled = true;
    readBtn.addEventListener("click", () => {
      stopRecognition();
      readBtn.classList.add("busy");
      speak(q.vraag, () => readBtn.classList.remove("busy"));
    });
    bar.appendChild(readBtn);

    // Inspreken (STT)
    const micBtn = el("button", "btn btn-small btn-ghost speak-mic", "🎤 Spreek antwoord");
    const status = el("span", "speak-status");
    const interim = el("div", "speak-interim");
    interim.hidden = true;

    const canBrowser = !!SpeechRec;
    const canWhisper = !!(navigator.mediaDevices && window.MediaRecorder);
    if (!canBrowser && !canWhisper) {
      micBtn.disabled = true;
      micBtn.title = "Geen spraakopname mogelijk in deze browser. Typen kan altijd.";
    } else {
      micBtn.addEventListener("click", () => {
        if (activeRecorder) { stopRecorder(); return; }   // toggle Whisper-opname uit
        if (activeRec) { stopRecognition(); return; }      // toggle browser-opname uit
        stopSpeaking();
        if (sttSettings.engine === "whisper") {
          if (!canWhisper) { status.textContent = "Opname niet ondersteund in deze browser."; return; }
          startWhisperRecording(ta, entry, micBtn, status, interim);
        } else {
          if (!canBrowser) { status.textContent = "Spraakherkenning werkt in Chrome/Edge. Of kies Whisper bij ⚙."; return; }
          startBrowserDictation(ta, entry, micBtn, status, interim);
        }
      });
    }
    bar.appendChild(micBtn);
    bar.appendChild(status);

    const wrap = el("div", "speak-wrap");
    wrap.appendChild(bar);
    wrap.appendChild(interim);
    return wrap;
  }

  function startBrowserDictation(ta, entry, micBtn, status, interim) {
    let rec;
    try { rec = new SpeechRec(); } catch (e) { status.textContent = "Kon de microfoon niet starten."; return; }
    rec.lang = "nl-NL";
    rec.continuous = true;
    rec.interimResults = true;
    activeRec = rec;

    micBtn.textContent = "⏹ Stop opnemen";
    micBtn.classList.add("rec-on");
    status.textContent = "Aan het luisteren… spreek je antwoord in.";
    interim.hidden = false;

    rec.onresult = (e) => {
      let finalTxt = "", interimTxt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalTxt += t; else interimTxt += t;
      }
      if (finalTxt) {
        const sep = ta.value && !/\s$/.test(ta.value) ? " " : "";
        ta.value = ta.value + sep + finalTxt.trim();
        entry.notitie = ta.value;
        saveStore(store);
      }
      interim.textContent = interimTxt;
    };
    rec.onerror = (e) => {
      const m = e.error === "not-allowed" || e.error === "service-not-allowed"
        ? "Geen microfoontoegang. Sta de microfoon toe in je browser."
        : e.error === "no-speech" ? "Niets gehoord — probeer opnieuw."
        : "Spraakfout: " + e.error;
      status.textContent = m;
    };
    rec.onend = () => {
      micBtn.textContent = "🎤 Spreek antwoord";
      micBtn.classList.remove("rec-on");
      interim.hidden = true;
      interim.textContent = "";
      if (activeRec === rec) activeRec = null;
      if (!status.textContent.startsWith("Spraakfout") && !status.textContent.startsWith("Geen")) status.textContent = "Opname gestopt.";
    };
    try { rec.start(); } catch (e) { status.textContent = "Opname loopt al."; }
  }

  /* ---------- view switching ---------- */
  function showView(name) {
    stopSpeaking();
    stopAllCapture();
    if (typeof podPlaying !== "undefined" && podPlaying && name !== "podcast") podStop();
    $$(".view").forEach(v => v.classList.add("is-hidden"));
    const view = $("#view-" + name);
    if (view) view.classList.remove("is-hidden");
    $$(".nav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.view === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "flashcards") renderFlashcards();
    if (name === "meerkeuze") renderMeerkeuze();
    if (name === "podcast") renderPodcast();
    if (name === "spiekbriefje") renderFacts();
    if (name === "voortgang") renderVoortgang();
    if (name === "beoordeling") renderBeoordeling();
  }

  /* ===================================================================
     HOME
  =================================================================== */
  function renderHome() {
    $("#studentNaam").textContent = DATA.meta.student + " · " + DATA.meta.organisatie;

    const grid = $("#homeLolGrid");
    grid.innerHTML = "";
    DATA.lols.forEach(l => {
      const n = DATA.vragen.filter(q => q.lol === l.id).length;
      const card = el("button", "lol-card");
      card.style.setProperty("--lolc", l.kleur);
      card.innerHTML =
        '<span class="lol-num">Leeruitkomst ' + l.nummer + '</span>' +
        '<h3>' + esc(l.naam) + '</h3>' +
        '<p>' + esc(l.kern) + '</p>' +
        '<div class="lol-meta">' + n + ' oefenvragen · ' + esc(l.leerdoel) + '</div>';
      card.addEventListener("click", () => openOefen(l.id));
      grid.appendChild(card);
    });

    const algN = DATA.vragen.filter(q => q.lol === "alg").length;
    const algCard = el("button", "lol-card");
    algCard.style.setProperty("--lolc", DATA.algGroep.kleur);
    algCard.innerHTML =
      '<span class="lol-num">Portfolio-breed</span>' +
      '<h3>Overkoepelende vragen</h3>' +
      '<p>Elevator pitch, eigenaarschap, POP-groei, niveau 2 en je beroepsperspectief.</p>' +
      '<div class="lol-meta">' + algN + ' oefenvragen</div>';
    algCard.addEventListener("click", () => openOefen("alg"));
    grid.appendChild(algCard);

    const tips = $("#cgiTipsList");
    tips.innerHTML = "";
    DATA.cgiTips.forEach(t => tips.appendChild(el("li", null, esc(t))));
  }

  function openOefen(lolId) {
    showView("oefenen");
    $("#filterLol").value = lolId;
    $("#filterType").value = "all";
    renderOefen();
  }

  /* ===================================================================
     OEFENEN
  =================================================================== */
  function buildLolSelect(selectEl, includeAll, includeAlg) {
    selectEl.innerHTML = "";
    if (includeAll) selectEl.appendChild(new Option("Alle leeruitkomsten", "all"));
    DATA.lols.forEach(l => selectEl.appendChild(new Option("LOL " + l.nummer + " — " + l.naam, l.id)));
    if (includeAlg) selectEl.appendChild(new Option("Portfolio-breed", "alg"));
  }

  function starrPills() {
    const wrap = el("div", "starr-hint");
    [
      ["S", "Situatie — context kort"],
      ["T", "Taak — wat moest jij"],
      ["A", "Actie — wat deed jíj"],
      ["R", "Resultaat — uitkomst"],
      ["R", "Reflectie — wat leerde je"]
    ].forEach(p => wrap.appendChild(el("span", "starr-pill", "<b>" + p[0] + "</b> · " + esc(p[1]))));
    return wrap;
  }

  function questionCard(q) {
    const entry = getEntry(q.id);
    const card = el("div", "q-card");

    const head = el("div", "q-head");
    const lolTag = el("span", "tag tag-lol", esc(lolLabel(q.lol)));
    lolTag.style.background = lolColor(q.lol);
    head.appendChild(lolTag);
    head.appendChild(el("span", "tag tag-" + q.type, esc(DATA.types[q.type].label)));
    if (q.koppeling) head.appendChild(el("span", "tag tag-koppeling", esc(q.koppeling)));
    card.appendChild(head);

    card.appendChild(el("p", "q-text", esc(q.vraag)));
    card.appendChild(el("p", "q-typehint", esc(DATA.types[q.type].uitleg)));
    card.appendChild(starrPills());

    const ta = el("textarea", "q-answer");
    ta.placeholder = "Typ hier je antwoord, of gebruik het alleen om hardop te oefenen…";
    ta.value = entry.notitie || "";
    ta.addEventListener("input", () => { entry.notitie = ta.value; saveStore(store); });
    card.appendChild(ta);

    card.appendChild(speakBar(q, ta, entry));

    const actions = el("div", "q-actions");
    const btnModel = el("button", "btn btn-small btn-ghost", "💡 Toon modelpunten");
    actions.appendChild(btnModel);

    const rating = el("div", "rating");
    [["bad", "Onvoldoende"], ["ok", "Voldoende"], ["good", "Goed"]].forEach(r => {
      const b = el("button", "rate-btn", esc(r[1]));
      if (entry.rating === r[0]) b.classList.add("sel-" + r[0]);
      b.addEventListener("click", () => {
        entry.rating = (entry.rating === r[0]) ? null : r[0];
        saveStore(store);
        $$(".rate-btn", rating).forEach(x => x.classList.remove("sel-bad", "sel-ok", "sel-good"));
        if (entry.rating) b.classList.add("sel-" + entry.rating);
      });
      rating.appendChild(b);
    });
    actions.appendChild(rating);
    card.appendChild(actions);

    // model points panel (collapsed) with checkable items
    const model = el("div", "model");
    model.style.display = "none";

    const mHead = el("div", "model-head");
    mHead.appendChild(el("h4", null, "Waar let de assessor op — vink aan wat je noemde"));
    const cov = el("span", "model-cov");
    mHead.appendChild(cov);
    model.appendChild(mHead);

    const ul = el("div", "mp-list");
    function refreshCov() {
      const n = checkedCount(q.id), t = q.modelpunten.length;
      cov.textContent = n + " / " + t + " genoemd";
      cov.className = "model-cov " + (n === 0 ? "" : (n / t >= 0.6 ? "cov-good" : "cov-mid"));
    }
    q.modelpunten.forEach((m, i) => {
      const label = el("label", "mp");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!entry.checked[i];
      cb.addEventListener("change", () => {
        entry.checked[i] = cb.checked;
        saveStore(store);
        label.classList.toggle("mp-on", cb.checked);
        refreshCov();
      });
      if (cb.checked) label.classList.add("mp-on");
      label.appendChild(cb);
      label.appendChild(el("span", null, esc(m)));
      ul.appendChild(label);
    });
    model.appendChild(ul);
    refreshCov();
    card.appendChild(model);

    btnModel.addEventListener("click", () => {
      const open = model.style.display !== "none";
      model.style.display = open ? "none" : "block";
      btnModel.textContent = open ? "💡 Toon modelpunten" : "🙈 Verberg modelpunten";
    });

    return card;
  }

  function filteredQuestions() {
    const lol = $("#filterLol").value;
    const type = $("#filterType").value;
    return DATA.vragen.filter(q =>
      (lol === "all" || q.lol === lol) &&
      (type === "all" || q.type === type)
    );
  }

  function renderOefen() {
    const cont = $("#oefenContainer");
    cont.innerHTML = "";
    const list = filteredQuestions();
    if (!list.length) {
      cont.appendChild(el("div", "empty", "Geen vragen voor deze combinatie. Pas je filter aan."));
      return;
    }
    list.forEach(q => cont.appendChild(questionCard(q)));
  }

  /* ===================================================================
     FLASHCARDS
  =================================================================== */
  let flashDeck = [];
  let flashIdx = 0;
  let flashFlipped = false;
  let flashCardEl = null;

  function buildFlashDeck() {
    const lol = $("#flashLol").value;
    const type = $("#flashType").value;
    const hide = $("#flashHideKnown").checked;
    flashDeck = DATA.vragen.filter(q =>
      (lol === "all" || q.lol === lol) &&
      (type === "all" || q.type === type) &&
      (!hide || !(store[q.id] && store[q.id].known))
    );
  }

  function renderFlashcards() {
    buildFlashDeck();
    if (flashIdx >= flashDeck.length) flashIdx = 0;
    showFlashCard();
  }

  function showFlashCard() {
    const stage = $("#flashStage");
    stage.innerHTML = "";
    flashFlipped = false;
    const flipBtn = $("#flashFlip");

    if (!flashDeck.length) {
      stage.appendChild(el("div", "empty", "Geen kaarten voor deze selectie. Pas je filter aan of zet 'Verberg gekende' uit."));
      flipBtn.disabled = true;
      updateFlashProgress();
      return;
    }
    flipBtn.disabled = false;
    flipBtn.textContent = "Toon antwoord";

    const q = flashDeck[flashIdx];
    const card = el("div", "flashcard");
    const inner = el("div", "flashcard-inner");

    const tags =
      '<div class="flash-tags">' +
        '<span class="tag tag-lol" style="background:' + lolColor(q.lol) + '">' + esc(lolLabel(q.lol)) + '</span>' +
        '<span class="tag tag-' + q.type + '">' + esc(DATA.types[q.type].label) + '</span>' +
      '</div>';

    const front = el("div", "flash-face flash-front",
      tags +
      '<div class="flash-q">' + esc(q.vraag) + '</div>' +
      '<div class="flash-hint">💭 Beantwoord eerst zelf — klik op de kaart voor het sterke antwoord.</div>');

    let bb = '<div class="flash-back-label">Sterk antwoord bevat</div><ul class="flash-points">';
    q.modelpunten.forEach(m => { bb += '<li>' + esc(m) + '</li>'; });
    bb += '</ul>';
    if (q.koppeling) bb += '<div class="flash-koppeling">' + esc(q.koppeling) + '</div>';
    const back = el("div", "flash-face flash-back", bb);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    card.addEventListener("click", toggleFlip);
    stage.appendChild(card);
    flashCardEl = card;

    updateFlashProgress();
  }

  function toggleFlip() {
    if (!flashDeck.length) return;
    flashFlipped = !flashFlipped;
    if (flashCardEl) flashCardEl.classList.toggle("flipped", flashFlipped);
    $("#flashFlip").textContent = flashFlipped ? "Verberg antwoord" : "Toon antwoord";
  }

  function flashNext() { if (flashDeck.length) { flashIdx = (flashIdx + 1) % flashDeck.length; showFlashCard(); } }
  function flashPrev() { if (flashDeck.length) { flashIdx = (flashIdx - 1 + flashDeck.length) % flashDeck.length; showFlashCard(); } }

  function flashMark(known) {
    if (!flashDeck.length) return;
    const q = flashDeck[flashIdx];
    getEntry(q.id).known = known;
    saveStore(store);
    if (known && $("#flashHideKnown").checked) {
      // kaart valt uit de deck: opnieuw opbouwen en op dezelfde plek blijven
      buildFlashDeck();
      if (flashIdx >= flashDeck.length) flashIdx = 0;
      showFlashCard();
    } else if (known) {
      flashNext();
    } else {
      updateFlashProgress();
    }
  }

  function updateFlashProgress() {
    const prog = $("#flashProgress");
    const deckLol = $("#flashLol").value;
    const all = DATA.vragen.filter(q => deckLol === "all" || q.lol === deckLol);
    const known = all.filter(q => store[q.id] && store[q.id].known).length;
    if (!flashDeck.length) { prog.textContent = "0 kaarten · " + known + " van " + all.length + " gemarkeerd als gekend"; return; }
    prog.textContent = "Kaart " + (flashIdx + 1) + " / " + flashDeck.length + " · " + known + " van " + all.length + " gemarkeerd als gekend";
  }

  function flashKeydown(e) {
    if ($("#view-flashcards").classList.contains("is-hidden")) return;
    const t = e.target.tagName;
    if (t === "INPUT" || t === "TEXTAREA" || t === "SELECT") return;
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleFlip(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); flashNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); flashPrev(); }
  }

  /* ===================================================================
     MEERKEUZE (kennisquiz)
  =================================================================== */
  let mcDeck = [];
  let mcIdx = 0;
  let mcAnswered = false;
  let mcScore = 0;
  let mcDone = 0;
  let mcWrong = [];

  function buildMcDeck() {
    const lol = $("#mcLol").value;
    mcDeck = DATA.mcVragen.filter(q => lol === "all" || q.lol === lol);
  }

  function renderMeerkeuze() {
    buildMcDeck();
    mcIdx = 0; mcScore = 0; mcDone = 0; mcWrong = [];
    $("#mcResult").classList.add("is-hidden");
    $("#mcStage").style.display = "";
    document.querySelector(".mc-controls").style.display = "";
    document.querySelector("#view-meerkeuze .mc-bar").style.display = "";
    showMcQuestion();
  }

  function showMcQuestion() {
    const stage = $("#mcStage");
    stage.innerHTML = "";
    mcAnswered = false;
    const nextBtn = $("#mcNext");
    nextBtn.disabled = true;

    if (!mcDeck.length) {
      stage.appendChild(el("div", "empty", "Geen meerkeuzevragen voor deze selectie."));
      updateMcBar();
      return;
    }

    const q = mcDeck[mcIdx];
    const card = el("div", "mc-card");

    const head = el("div", "q-head");
    const lolTag = el("span", "tag tag-lol", esc(lolLabel(q.lol)));
    lolTag.style.background = lolColor(q.lol);
    head.appendChild(lolTag);
    head.appendChild(el("span", "tag tag-kennis", "Kennisvraag"));
    card.appendChild(head);

    card.appendChild(el("p", "mc-q", esc(q.vraag)));

    const opts = el("div", "mc-opts");
    const letters = ["A", "B", "C", "D", "E", "F"];
    const buttons = [];
    // antwoordvolgorde per beurt schudden zodat het juiste antwoord niet vast op plek A staat
    const order = shuffle(q.opties.map((_, i) => i));
    order.forEach((oi, k) => {
      const b = el("button", "mc-opt");
      b.innerHTML = '<span class="mc-letter">' + letters[k] + '</span><span class="mc-opt-txt">' + esc(q.opties[oi]) + '</span>';
      b.addEventListener("click", () => answerMc(oi, buttons, q));
      buttons.push({ btn: b, oi: oi });
      opts.appendChild(b);
    });
    card.appendChild(opts);

    const fb = el("div", "mc-feedback");
    fb.hidden = true;
    card.appendChild(fb);

    stage.appendChild(card);
    updateMcBar();
  }

  function answerMc(chosenOi, buttons, q) {
    if (mcAnswered) return;
    mcAnswered = true;
    const correct = chosenOi === q.correct;
    if (correct) mcScore++; else mcWrong.push(q.id);
    mcDone++;
    getEntry(q.id).mc = correct;
    saveStore(store);

    buttons.forEach(item => {
      item.btn.disabled = true;
      if (item.oi === q.correct) item.btn.classList.add("mc-correct");
      if (item.oi === chosenOi && !correct) item.btn.classList.add("mc-wrong");
    });

    const fb = $("#mcStage .mc-feedback");
    fb.hidden = false;
    fb.className = "mc-feedback " + (correct ? "fb-good" : "fb-bad");
    fb.innerHTML = "<b>" + (correct ? "✓ Goed!" : "✗ Niet juist.") + "</b> " + esc(q.uitleg || "");

    const nextBtn = $("#mcNext");
    nextBtn.disabled = false;
    nextBtn.textContent = (mcIdx === mcDeck.length - 1) ? "Bekijk resultaat →" : "Volgende →";
    updateMcBar();
  }

  function mcNext() {
    if (!mcAnswered) return;
    if (mcIdx < mcDeck.length - 1) { mcIdx++; showMcQuestion(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else finishMc();
  }

  function updateMcBar() {
    $("#mcProgress").textContent = mcDeck.length ? ("Vraag " + (mcIdx + 1) + " / " + mcDeck.length) : "Geen vragen";
    $("#mcScore").textContent = "Goed: " + mcScore + " / " + mcDone;
  }

  function finishMc() {
    $("#mcStage").style.display = "none";
    document.querySelector(".mc-controls").style.display = "none";
    document.querySelector("#view-meerkeuze .mc-bar").style.display = "none";
    const total = mcDeck.length;
    const pct = total ? Math.round(mcScore / total * 100) : 0;
    const msg = pct >= 80 ? "Sterk! Je kent je feiten goed." :
                pct >= 60 ? "Goed op weg — herhaal de foute vragen even." :
                "Nog wat te oefenen. Loop het spiekbriefje en je bijlagen na.";
    const res = $("#mcResult");
    res.classList.remove("is-hidden");
    res.innerHTML =
      '<h2>Quiz afgerond 🎯</h2>' +
      '<div class="result-stat">' +
        '<div class="stat-box"><div class="num" style="color:var(--primary-d)">' + pct + '%</div><div class="lbl">Score</div></div>' +
        '<div class="stat-box"><div class="num" style="color:var(--good)">' + mcScore + '</div><div class="lbl">Goed</div></div>' +
        '<div class="stat-box"><div class="num" style="color:var(--bad)">' + (total - mcScore) + '</div><div class="lbl">Fout</div></div>' +
      '</div>' +
      '<p class="muted">' + esc(msg) + '</p>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        (mcWrong.length ? '<button class="btn btn-primary" id="mcReviewWrong">Oefen de ' + mcWrong.length + ' foute opnieuw</button>' : '') +
        '<button class="btn btn-ghost" id="mcRetry">Opnieuw beginnen</button>' +
      '</div>';
    if (mcWrong.length) $("#mcReviewWrong").addEventListener("click", () => {
      const ids = mcWrong.slice();
      mcDeck = DATA.mcVragen.filter(q => ids.indexOf(q.id) >= 0);
      mcIdx = 0; mcScore = 0; mcDone = 0; mcWrong = [];
      $("#mcResult").classList.add("is-hidden");
      $("#mcStage").style.display = "";
      document.querySelector(".mc-controls").style.display = "";
      document.querySelector("#view-meerkeuze .mc-bar").style.display = "";
      showMcQuestion();
    });
    $("#mcRetry").addEventListener("click", renderMeerkeuze);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ===================================================================
     PODCAST (audio-samenvatting via TTS, twee stemmen)
  =================================================================== */
  let podPlaying = false;
  let podChap = 0;
  let podLine = 0;
  let podRate = 1;
  let podBuilt = false;

  function podVoiceFor(speaker) {
    const voices = (synth && synth.getVoices()) || [];
    const nl = voices.filter(v => /^nl/i.test(v.lang));
    if (speaker === "N") return nl[0] || pickDutchVoice() || null;
    return nl[1] || nl[0] || pickDutchVoice() || null; // tweede stem indien beschikbaar
  }

  function renderPodcast() {
    const pod = DATA.podcast;
    $("#podTitel").textContent = pod.titel;
    // schatting totale duur (~150 woorden/min)
    let words = 0;
    pod.hoofdstukken.forEach(h => h.regels.forEach(r => { words += r.t.split(/\s+/).length; }));
    const mins = Math.round(words / 135); // Nederlandse TTS ~135 woorden/min, plus pauzes tussen regels
    $("#podIntro").textContent = pod.intro + " Geschatte duur: ongeveer " + mins + " minuten.";

    if (!podBuilt) {
      const chaps = $("#podChapters");
      chaps.innerHTML = "<div class='pod-chapters-h'>Hoofdstukken</div>";
      pod.hoofdstukken.forEach((h, i) => {
        const b = el("button", "pod-chap");
        b.textContent = h.titel;
        b.addEventListener("click", () => { podJumpTo(i); });
        chaps.appendChild(b);
      });
      podBuilt = true;
    }
    renderPodTranscript();
    podHighlight();
    podUpdateUi();
    if (!synth) $("#podStatus").textContent = "Let op: voorlezen wordt niet ondersteund in deze browser. Het transcript kun je wel lezen.";
  }

  function renderPodTranscript() {
    const wrap = $("#podTranscript");
    wrap.innerHTML = "";
    const pod = DATA.podcast;
    pod.hoofdstukken.forEach((h, ci) => {
      const sec = el("div", "pod-sec");
      sec.id = "pod-sec-" + ci;
      sec.appendChild(el("h3", "pod-sec-title", esc(h.titel)));
      h.regels.forEach((r, li) => {
        const line = el("div", "pod-line");
        line.id = "pod-line-" + ci + "-" + li;
        const naam = DATA.podcast.sprekers[r.s] || r.s;
        line.innerHTML = '<span class="pod-spk pod-spk-' + r.s + '">' + esc(naam) + '</span>' +
                         '<span class="pod-txt">' + esc(r.t) + '</span>';
        line.addEventListener("click", () => { podChap = ci; podLine = li; podHighlight(); if (podPlaying) { stopSpeaking(); podSpeakCurrent(); } });
        sec.appendChild(line);
      });
      wrap.appendChild(sec);
    });
  }

  function podCurrentLine() {
    const h = DATA.podcast.hoofdstukken[podChap];
    return h ? h.regels[podLine] : null;
  }

  function podSpeakCurrent() {
    if (!synth) return;
    const r = podCurrentLine();
    if (!r) { podStop(); return; }
    podHighlight();
    const u = new SpeechSynthesisUtterance(r.t);
    u.lang = "nl-NL";
    const v = podVoiceFor(r.s);
    if (v) u.voice = v;
    u.rate = podRate;
    u.pitch = r.s === "N" ? 1.06 : 0.94; // licht verschil zodat de twee stemmen herkenbaar zijn
    u.onend = () => { if (podPlaying) podAdvance(); };
    synth.speak(u);
  }

  function podAdvance() {
    const pod = DATA.podcast;
    const h = pod.hoofdstukken[podChap];
    if (podLine < h.regels.length - 1) { podLine++; }
    else if (podChap < pod.hoofdstukken.length - 1) { podChap++; podLine = 0; }
    else { podStop(); $("#podStatus").textContent = "Einde van de podcast. Mooi gedaan!"; return; }
    podSpeakCurrent();
  }

  function podPlay() {
    if (!synth) return;
    podPlaying = true;
    stopSpeaking();
    podSpeakCurrent();
    podUpdateUi();
  }
  function podPause() {
    podPlaying = false;
    stopSpeaking();
    podUpdateUi();
    $("#podStatus").textContent = "Gepauzeerd.";
  }
  function podStop() {
    podPlaying = false;
    stopSpeaking();
    podUpdateUi();
  }
  function podToggle() { if (podPlaying) podPause(); else podPlay(); }

  function podJumpTo(ci) {
    podChap = ci; podLine = 0;
    podHighlight();
    const sec = $("#pod-sec-" + ci);
    if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    if (podPlaying) { stopSpeaking(); podSpeakCurrent(); }
  }
  function podNextChap() { if (podChap < DATA.podcast.hoofdstukken.length - 1) podJumpTo(podChap + 1); }
  function podPrevChap() { if (podChap > 0) podJumpTo(podChap - 1); }

  function podHighlight() {
    $$(".pod-line.is-current").forEach(e => e.classList.remove("is-current"));
    $$(".pod-chap.is-current").forEach(e => e.classList.remove("is-current"));
    const line = $("#pod-line-" + podChap + "-" + podLine);
    if (line) {
      line.classList.add("is-current");
      if (podPlaying && line.scrollIntoView) line.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    const chaps = $$("#podChapters .pod-chap");
    if (chaps[podChap]) chaps[podChap].classList.add("is-current");
    const h = DATA.podcast.hoofdstukken[podChap];
    if (h) $("#podNowTitle").textContent = h.titel;
  }

  function podUpdateUi() {
    const btn = $("#podPlay");
    if (btn) btn.textContent = podPlaying ? "⏸ Pauze" : "▶ Afspelen";
  }

  /* ===================================================================
     CGI-SIMULATIE
  =================================================================== */
  let sim = null;
  let simInterval = null;

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickSimQuestions(aantal, scope, lolFilter) {
    let pool = DATA.vragen.slice();
    if (lolFilter && lolFilter !== "all") pool = pool.filter(q => q.lol === lolFilter);
    if (scope === "open") {
      pool = shuffle(pool.filter(q => q.type === "open")).concat(shuffle(pool.filter(q => q.type !== "open")));
    } else if (scope === "kritisch") {
      pool = shuffle(pool.filter(q => q.type === "kritisch" || q.type === "doorvraag")).concat(shuffle(pool.filter(q => q.type === "open")));
    } else {
      pool = shuffle(pool);
    }
    return pool.slice(0, Math.min(aantal, pool.length));
  }

  function startSim() {
    const aantal = parseInt($("#simAantal").value, 10);
    const scope = $("#simScope").value;
    const lolFilter = $("#simLol").value;
    const qs = pickSimQuestions(aantal, scope, lolFilter);
    sim = { qs: qs, idx: 0, started: Date.now() };

    $("#simSetup").classList.add("is-hidden");
    $("#simResult").classList.add("is-hidden");
    $("#simRun").classList.remove("is-hidden");
    $("#simTotal").textContent = qs.length;

    if (simInterval) clearInterval(simInterval);
    simInterval = setInterval(updateTimer, 1000);
    updateTimer();
    renderSimQuestion();
  }

  function updateTimer() {
    if (!sim) return;
    const s = Math.floor((Date.now() - sim.started) / 1000);
    $("#simTimer").textContent =
      String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  }

  function renderSimQuestion() {
    const slot = $("#simQuestionSlot");
    slot.innerHTML = "";
    const q = sim.qs[sim.idx];
    slot.appendChild(questionCard(q));
    if ($("#simSpeak") && $("#simSpeak").checked) speak(q.vraag);
    $("#simIndex").textContent = sim.idx + 1;
    $("#simFill").style.width = ((sim.idx + 1) / sim.qs.length * 100) + "%";
    $("#btnSimPrev").style.visibility = sim.idx === 0 ? "hidden" : "visible";
    $("#btnSimNext").textContent = (sim.idx === sim.qs.length - 1) ? "Afronden ✓" : "Volgende →";
  }

  function simNext() {
    if (sim.idx < sim.qs.length - 1) { sim.idx++; renderSimQuestion(); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else finishSim();
  }
  function simPrev() {
    if (sim.idx > 0) { sim.idx--; renderSimQuestion(); window.scrollTo({ top: 0, behavior: "smooth" }); }
  }

  function finishSim() {
    if (simInterval) clearInterval(simInterval);
    const elapsed = Math.floor((Date.now() - sim.started) / 1000);
    const mm = Math.floor(elapsed / 60), ss = elapsed % 60;

    let totalMp = 0, checkedMp = 0;
    sim.qs.forEach(q => { totalMp += q.modelpunten.length; checkedMp += checkedCount(q.id); });
    const pct = totalMp ? Math.round(checkedMp / totalMp * 100) : 0;

    $("#simRun").classList.add("is-hidden");
    const res = $("#simResult");
    res.classList.remove("is-hidden");
    res.innerHTML =
      '<h2>Simulatie afgerond 🎉</h2>' +
      '<p class="muted">Je beantwoordde ' + sim.qs.length + ' vragen in ' + mm + ' min ' + ss + ' sec. ' +
      'Je vinkte ' + checkedMp + ' van de ' + totalMp + ' kernpunten aan als genoemd.</p>' +
      '<div class="result-stat">' +
        statBox(pct + "%", "Kernpunten genoemd", "var(--primary-d)") +
        statBox(sim.qs.length, "Vragen", "var(--accent)") +
        statBox(mm + ":" + String(ss).padStart(2, "0"), "Tijd", "var(--text)") +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<button class="btn btn-primary" id="btnSimToBeoordeling">Bekijk je CGI-beoordeling</button>' +
        '<button class="btn btn-ghost" id="btnSimAgain">Nieuwe simulatie</button>' +
      '</div>';
    $("#btnSimToBeoordeling").addEventListener("click", () => showView("beoordeling"));
    $("#btnSimAgain").addEventListener("click", resetSimSetup);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function statBox(n, label, color) {
    return '<div class="stat-box"><div class="num" style="color:' + color + '">' + n + '</div><div class="lbl">' + label + '</div></div>';
  }

  function resetSimSetup() {
    if (simInterval) clearInterval(simInterval);
    sim = null;
    $("#simRun").classList.add("is-hidden");
    $("#simResult").classList.add("is-hidden");
    $("#simSetup").classList.remove("is-hidden");
  }

  /* ===================================================================
     SPIEKBRIEFJE
  =================================================================== */
  function renderFacts() {
    const grid = $("#factGrid");
    grid.innerHTML = "";
    DATA.feiten.forEach(f => {
      const card = el("div", "fact-card");
      let h = "<h3>" + esc(f.titel) + "</h3><ul>";
      f.items.forEach(i => { h += "<li>" + esc(i) + "</li>"; });
      h += "</ul>";
      card.innerHTML = h;
      grid.appendChild(card);
    });
  }

  /* ===================================================================
     VOORTGANG (zelfbeoordeling)
  =================================================================== */
  function renderVoortgang() {
    const cont = $("#voortgangContainer");
    cont.innerHTML = "";

    cont.appendChild(el("h3", "beo-section-title", "Zelfbeoordeling — open vragen"));
    allGroupIds().forEach(gid => {
      const qs = DATA.vragen.filter(q => q.lol === gid);
      if (!qs.length) return;
      let good = 0, ok = 0, bad = 0;
      qs.forEach(q => {
        const r = (store[q.id] && store[q.id].rating) || null;
        if (r === "good") good++; else if (r === "ok") ok++; else if (r === "bad") bad++;
      });
      const rated = good + ok + bad;
      const total = qs.length;
      const card = el("div", "prog-card");
      card.style.setProperty("--lolc", lolColor(gid));
      const pct = n => total ? (n / total * 100) + "%" : "0%";
      card.innerHTML =
        '<div class="prog-top"><h3>' + esc(lolLabel(gid)) + '</h3>' +
        '<span class="prog-count">' + rated + ' / ' + total + ' beoordeeld</span></div>' +
        '<div class="bar">' +
          '<span class="b-good" style="width:' + pct(good) + '"></span>' +
          '<span class="b-ok" style="width:' + pct(ok) + '"></span>' +
          '<span class="b-bad" style="width:' + pct(bad) + '"></span>' +
        '</div>' +
        '<div class="prog-legend">' +
          '<span><span class="dot good"></span>Goed: ' + good + '</span>' +
          '<span><span class="dot ok"></span>Voldoende: ' + ok + '</span>' +
          '<span><span class="dot bad"></span>Onvoldoende: ' + bad + '</span>' +
          '<span><span class="dot none"></span>Open: ' + (total - rated) + '</span>' +
        '</div>';
      cont.appendChild(card);
    });

    // ---- Meerkeuze-quiz voortgang ----
    cont.appendChild(el("h3", "beo-section-title", "Meerkeuze-quiz"));
    const qvs = allGroupIds().map(quizVerdict);
    if (!qvs.some(v => v.answered > 0)) {
      cont.appendChild(el("div", "empty", "Nog geen meerkeuzevragen beantwoord. Ga naar <b>Meerkeuze</b> om je kennis te toetsen."));
      return;
    }
    qvs.forEach(v => {
      const total = v.total;
      const wrong = v.answered - v.correct;
      const pct = n => total ? (n / total * 100) + "%" : "0%";
      const card = el("div", "prog-card");
      card.style.setProperty("--lolc", lolColor(v.gid));
      card.innerHTML =
        '<div class="prog-top"><h3>' + esc(lolLabel(v.gid)) + '</h3>' +
        '<span class="prog-count">' + v.correct + ' goed · ' + v.answered + ' / ' + total + ' beantwoord</span></div>' +
        '<div class="bar">' +
          '<span class="b-good" style="width:' + pct(v.correct) + '"></span>' +
          '<span class="b-bad" style="width:' + pct(wrong) + '"></span>' +
        '</div>' +
        '<div class="prog-legend">' +
          '<span><span class="dot good"></span>Goed: ' + v.correct + '</span>' +
          '<span><span class="dot bad"></span>Fout: ' + wrong + '</span>' +
          '<span><span class="dot none"></span>Nog niet: ' + (total - v.answered) + '</span>' +
        '</div>';
      cont.appendChild(card);
    });
  }

  /* ===================================================================
     CGI-BEOORDELAAR
     Berekent per leeruitkomst een oordeel op basis van de aangevinkte
     modelpunten (dekking) en de breedte (hoeveel vragen geoefend).
  =================================================================== */
  function groupVerdict(gid) {
    const qs = DATA.vragen.filter(q => q.lol === gid);
    let attempted = 0, attemptedMp = 0, attemptedChecked = 0;
    const strong = [];
    const gaps = [];
    qs.forEach(q => {
      const e = store[q.id] || {};
      const nChecked = checkedCount(q.id);
      const total = q.modelpunten.length;
      const isAttempted = nChecked > 0 || !!e.rating;
      if (isAttempted) {
        attempted++;
        attemptedMp += total;
        attemptedChecked += nChecked;
        const c = total ? nChecked / total : 0;
        if (c >= 0.7) strong.push(q);
        q.modelpunten.forEach((m, i) => {
          if (!(e.checked && e.checked[i])) gaps.push({ q: q, text: m });
        });
      }
    });
    const breadth = qs.length ? attempted / qs.length : 0;
    const coverage = attemptedMp ? attemptedChecked / attemptedMp : 0;

    let bandKey;
    if (attempted === 0) bandKey = "none";
    else if (coverage >= 0.8) bandKey = "goed";
    else if (coverage >= 0.6) bandKey = "voldoende";
    else if (coverage >= 0.4) bandKey = "bijna";
    else bandKey = "onvoldoende";

    // breedte-gate: zonder genoeg bewijs geen 'goed'
    let breadthNote = "";
    if (bandKey === "goed" && breadth < 0.5) { bandKey = "voldoende"; breadthNote = "Je hebt nog niet de helft van de vragen geoefend — oefen er meer om dit oordeel te bevestigen."; }
    else if (attempted > 0 && breadth < 0.34) { breadthNote = "Gebaseerd op weinig vragen; oefen er meer voor een betrouwbaarder beeld."; }

    return {
      gid: gid, bandKey: bandKey, coverage: coverage, breadth: breadth,
      attempted: attempted, total: qs.length, strong: strong, gaps: gaps, breadthNote: breadthNote
    };
  }

  const BAND_SCORE = { goed: 3, voldoende: 2, bijna: 1, onvoldoende: 0 };

  function computeOverallKey(attemptedVerdicts) {
    if (!attemptedVerdicts.length) return "none";
    const avg = attemptedVerdicts.reduce((s, v) => s + BAND_SCORE[v.bandKey], 0) / attemptedVerdicts.length;
    if (avg >= 2.5) return "goed";
    if (avg >= 1.6) return "voldoende";
    if (avg >= 0.8) return "bijna";
    return "onvoldoende";
  }

  function renderBeoordeling() {
    const cont = $("#beoordelingContainer");
    cont.innerHTML = "";

    const verdicts = allGroupIds().map(groupVerdict);
    const attemptedVerdicts = verdicts.filter(v => v.bandKey !== "none");

    // intro / assessor persona
    const intro = el("div", "assessor-intro");
    intro.innerHTML =
      '<div class="assessor-avatar" aria-hidden="true">👩‍⚖️</div>' +
      '<div><h3>Je CGI-beoordelaar</h3>' +
      '<p>Hieronder vind je twee losse beoordelingen: het <b>CGI-oordeel</b> (op basis van de kernpunten die je ' +
      'per open vraag aanvinkte) en een aparte <b>kennisquiz-beoordeling</b> (op basis van je meerkeuze-antwoorden). ' +
      'Dit is een oefenindicatie, geen officieel cijfer.</p></div>';
    cont.appendChild(intro);

    // ---------- 1) CGI-oordeel (open vragen) ----------
    cont.appendChild(el("h3", "beo-section-title", "1 · CGI-oordeel — open vragen"));
    if (!attemptedVerdicts.length) {
      cont.appendChild(el("div", "empty",
        "Nog geen open vragen geoefend. Ga naar <b>Oefenen</b> of <b>CGI-simulatie</b>, beantwoord vragen en vink per vraag aan welke kernpunten je noemde."));
    } else {
      const overallKey = computeOverallKey(attemptedVerdicts);
      const oBand = DATA.rubric.banden[overallKey];
      const overall = el("div", "verdict-overall");
      overall.style.setProperty("--vc", oBand.kleur);
      const dims = DATA.rubric.dimensies.map(d =>
        '<li><b>' + esc(d.naam) + '</b> — ' + esc(d.toelichting) + '</li>').join("");
      overall.innerHTML =
        '<div class="vo-top">' +
          '<div><div class="vo-label">Voorlopig eindoordeel</div>' +
          '<div class="vo-band" style="color:' + oBand.kleur + '">' + esc(oBand.label) + '</div></div>' +
          '<div class="vo-badge" style="background:' + oBand.kleur + '">' + esc(bandShort(overallKey)) + '</div>' +
        '</div>' +
        '<p class="vo-advies">' + esc(oBand.advies) + '</p>' +
        '<div class="vo-dims"><div class="vo-dims-t">Een assessor weegt vier dimensies (bijlage O):</div><ul>' + dims + '</ul></div>' +
        '<p class="muted vo-note">Gebaseerd op ' + attemptedVerdicts.length + ' van de ' + verdicts.length + ' onderdelen die je hebt geoefend.</p>';
      cont.appendChild(overall);
      verdicts.forEach(v => cont.appendChild(verdictCard(v)));
    }

    // ---------- 2) Kennisquiz-beoordeling (los) ----------
    cont.appendChild(el("h3", "beo-section-title", "2 · Kennisquiz-beoordeling — meerkeuze"));
    renderQuizBeoordeling(cont);

    // CTA
    const cta = el("div", "beoordeling-cta");
    cta.innerHTML = '<button class="btn btn-ghost" id="btnBeoToOefen">Oefen de zwakke punten</button>' +
                    '<button class="btn btn-ghost" id="btnBeoMc">Doe de meerkeuze-quiz</button>';
    cont.appendChild(cta);
    $("#btnBeoToOefen").addEventListener("click", () => openOefen("all"));
    $("#btnBeoMc").addEventListener("click", () => showView("meerkeuze"));
  }

  /* Losse beoordeling op basis van de meerkeuze-antwoorden (per leeruitkomst). */
  function quizVerdict(gid) {
    const qs = DATA.mcVragen.filter(q => q.lol === gid);
    let answered = 0, correct = 0;
    qs.forEach(q => {
      const e = store[q.id];
      if (e && typeof e.mc === "boolean") { answered++; if (e.mc) correct++; }
    });
    let bandKey;
    if (answered === 0) bandKey = "none";
    else { const s = correct / answered; bandKey = s >= 0.8 ? "goed" : s >= 0.6 ? "voldoende" : s >= 0.4 ? "bijna" : "onvoldoende"; }
    return { gid: gid, total: qs.length, answered: answered, correct: correct, bandKey: bandKey };
  }

  function renderQuizBeoordeling(cont) {
    const qvs = allGroupIds().map(quizVerdict);
    const done = qvs.filter(v => v.answered > 0);
    const totAns = done.reduce((s, v) => s + v.answered, 0);
    const totCor = done.reduce((s, v) => s + v.correct, 0);

    if (!totAns) {
      cont.appendChild(el("div", "empty",
        "Nog geen meerkeuzevragen beantwoord. Ga naar <b>Meerkeuze</b> om je kennis te toetsen."));
      return;
    }

    const pct = Math.round(totCor / totAns * 100);
    const oKey = pct >= 80 ? "goed" : pct >= 60 ? "voldoende" : pct >= 40 ? "bijna" : "onvoldoende";
    const oBand = DATA.rubric.banden[oKey];

    const block = el("div", "quiz-beo");
    let rows = "";
    qvs.forEach(v => {
      const band = DATA.rubric.banden[v.bandKey];
      const p = v.answered ? Math.round(v.correct / v.answered * 100) : 0;
      const stat = v.answered ? (v.correct + "/" + v.answered + " goed") : "niet gedaan";
      rows +=
        '<div class="quiz-row" style="--lolc:' + lolColor(v.gid) + '">' +
          '<div class="quiz-row-name">' + esc(lolLabel(v.gid)) + '</div>' +
          '<div class="quiz-row-bar"><span style="width:' + p + '%;background:' + band.kleur + '"></span></div>' +
          '<div class="quiz-row-stat">' + stat + '</div>' +
          '<span class="quiz-badge" style="background:' + band.kleur + '">' + esc(bandShort(v.bandKey)) + '</span>' +
        '</div>';
    });
    block.innerHTML =
      '<div class="quiz-overall" style="border-color:' + oBand.kleur + '">' +
        '<div><div class="vo-label">Quizscore totaal</div>' +
          '<div class="vo-band" style="color:' + oBand.kleur + '">' + pct + '% goed — ' + esc(bandShort(oKey)) + '</div></div>' +
        '<div class="quiz-overall-num" style="background:' + oBand.kleur + '">' + totCor + '/' + totAns + '</div>' +
      '</div>' +
      '<div class="quiz-rows">' + rows + '</div>' +
      '<p class="muted quiz-note">Apart van het CGI-oordeel. Gebaseerd op je laatste antwoord per meerkeuzevraag.</p>';
    cont.appendChild(block);
  }

  function bandShort(key) {
    return { goed: "GOED", voldoende: "VOLDOENDE", bijna: "BIJNA", onvoldoende: "ONVOLD.", none: "—" }[key] || "—";
  }

  function verdictCard(v) {
    const band = DATA.rubric.banden[v.bandKey];
    const grp = groupById(v.gid);
    const card = el("div", "verdict-card");
    card.style.setProperty("--vc", band.kleur);
    card.style.setProperty("--lolc", lolColor(v.gid));

    let html =
      '<div class="vc-head">' +
        '<h3>' + esc(lolLabel(v.gid)) + '</h3>' +
        '<span class="vc-badge" style="background:' + band.kleur + '">' + esc(band.label) + '</span>' +
      '</div>';

    if (v.bandKey === "none") {
      html += '<p class="muted">' + esc(band.advies) + '</p>';
      card.innerHTML = html;
      return card;
    }

    const pct = Math.round(v.coverage * 100);
    html +=
      '<div class="vc-meter"><div class="vc-meter-fill" style="width:' + pct + '%;background:' + band.kleur + '"></div></div>' +
      '<div class="vc-stats">' +
        '<span><b>' + pct + '%</b> kernpunten genoemd</span>' +
        '<span><b>' + v.attempted + '/' + v.total + '</b> vragen geoefend</span>' +
      '</div>';

    if (grp && grp.criteria) html += '<p class="vc-criteria"><b>Wat ik wil zien:</b> ' + esc(grp.criteria) + '</p>';
    html += '<p class="vc-advies">' + esc(band.advies) + '</p>';
    if (v.breadthNote) html += '<p class="vc-warn">⚠ ' + esc(v.breadthNote) + '</p>';

    if (v.strong.length) {
      html += '<div class="vc-block vc-strong"><h4>Sterk onderbouwd</h4><ul>' +
        v.strong.slice(0, 3).map(q => '<li>' + esc(shortQ(q.vraag)) + '</li>').join("") + '</ul></div>';
    }
    if (v.gaps.length) {
      const gaps = dedupeGaps(v.gaps).slice(0, 4);
      html += '<div class="vc-block vc-gap"><h4>Hier zou ik op doorvragen</h4><ul>' +
        gaps.map(g => '<li>' + esc(g) + '</li>').join("") + '</ul></div>';
    }
    if (grp && grp.vervolgvraag) {
      html += '<div class="vc-followup"><span class="vc-fu-icon">🎤</span><div><b>Vervolgvraag van de assessor</b><p>' +
        esc(grp.vervolgvraag) + '</p></div></div>';
    }

    card.innerHTML = html;
    return card;
  }

  function shortQ(q) { return q.length > 90 ? q.slice(0, 88) + "…" : q; }
  function dedupeGaps(gaps) {
    const seen = {}, out = [];
    gaps.forEach(g => { if (!seen[g.text]) { seen[g.text] = 1; out.push(g.text); } });
    return out;
  }

  /* ===================================================================
     PDF / PRINT — beoordelingsrapport
  =================================================================== */
  function buildPrintReport() {
    const root = $("#printRoot");
    const verdicts = allGroupIds().map(groupVerdict);
    const attempted = verdicts.filter(v => v.bandKey !== "none");
    const datum = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });

    let html =
      '<div class="pr-doc">' +
      '<div class="pr-head">' +
        '<div><h1>CGI-oefenrapport</h1>' +
        '<div class="pr-sub">Portfolio Oriënterende Stage</div></div>' +
        '<div class="pr-meta">' +
          '<div><b>' + esc(DATA.meta.student) + '</b> (' + esc(DATA.meta.studentnummer) + ')</div>' +
          '<div>' + esc(DATA.meta.opleiding) + '</div>' +
          '<div>' + esc(DATA.meta.organisatie) + '</div>' +
          '<div>Gegenereerd: ' + esc(datum) + '</div>' +
        '</div>' +
      '</div>';

    if (!attempted.length) {
      html += '<h2 class="pr-section">1 · CGI-oordeel — open vragen</h2>' +
              '<p class="pr-note">Nog geen open vragen geoefend. Vink je modelpunten aan om dit oordeel te genereren.</p>';
      html += '<h2 class="pr-section">2 · Kennisquiz-beoordeling (los)</h2>' + quizReportHtml();
      html += '<p class="pr-foot">Oefenindicatie — geen officieel cijfer. Gegenereerd met de CGI-oefenomgeving.</p></div>';
      root.innerHTML = html;
      return;
    }

    html += '<h2 class="pr-section">1 · CGI-oordeel — open vragen</h2>';
    const overallKey = computeOverallKey(attempted);
    const oBand = DATA.rubric.banden[overallKey];
    html +=
      '<div class="pr-overall" style="border-color:' + oBand.kleur + '">' +
        '<div class="pr-overall-top"><span class="pr-ol">Voorlopig eindoordeel</span>' +
        '<span class="pr-band" style="background:' + oBand.kleur + '">' + esc(oBand.label) + '</span></div>' +
        '<p>' + esc(oBand.advies) + '</p>' +
        '<div class="pr-dims"><b>Beoordelingsdimensies (bijlage O):</b><ul>' +
          DATA.rubric.dimensies.map(d => '<li><b>' + esc(d.naam) + '</b> — ' + esc(d.toelichting) + '</li>').join("") +
        '</ul></div>' +
      '</div>';

    verdicts.forEach(v => {
      const band = DATA.rubric.banden[v.bandKey];
      const grp = groupById(v.gid);
      html += '<div class="pr-card" style="border-left-color:' + lolColor(v.gid) + '">';
      html += '<div class="pr-card-top"><h2>' + esc(lolLabel(v.gid)) + '</h2>' +
              '<span class="pr-band" style="background:' + band.kleur + '">' + esc(band.label) + '</span></div>';
      if (v.bandKey === "none") {
        html += '<p class="pr-muted">' + esc(band.advies) + '</p></div>';
        return;
      }
      html += '<div class="pr-stats">' + Math.round(v.coverage * 100) + '% kernpunten genoemd · ' +
              v.attempted + '/' + v.total + ' vragen geoefend</div>';
      html += '<p class="pr-advies">' + esc(band.advies) + '</p>';
      if (v.strong.length) {
        html += '<div class="pr-block"><b>Sterk onderbouwd:</b><ul>' +
          v.strong.slice(0, 2).map(q => '<li>' + esc(shortQ(q.vraag)) + '</li>').join("") + '</ul></div>';
      }
      if (v.gaps.length) {
        html += '<div class="pr-block"><b>Aandachtspunten (assessor vraagt door):</b><ul>' +
          dedupeGaps(v.gaps).slice(0, 3).map(g => '<li>' + esc(g) + '</li>').join("") + '</ul></div>';
      }
      if (grp && grp.vervolgvraag) {
        html += '<div class="pr-fu"><b>Vervolgvraag:</b> ' + esc(grp.vervolgvraag) + '</div>';
      }
      html += '</div>';
    });

    html += '<h2 class="pr-section">2 · Kennisquiz-beoordeling (los)</h2>' + quizReportHtml();

    html += '<p class="pr-foot">Oefenindicatie op basis van zelf aangevinkte kernpunten en je quiz-antwoorden — geen officieel cijfer. ' +
            'Gegenereerd met de CGI-oefenomgeving.</p></div>';
    root.innerHTML = html;
  }

  function quizReportHtml() {
    const qvs = allGroupIds().map(quizVerdict);
    const done = qvs.filter(v => v.answered > 0);
    const totAns = done.reduce((s, v) => s + v.answered, 0);
    const totCor = done.reduce((s, v) => s + v.correct, 0);
    if (!totAns) return '<p class="pr-muted">Nog geen meerkeuzevragen beantwoord.</p>';
    const pct = Math.round(totCor / totAns * 100);
    let h = '<div class="pr-quiz-overall"><b>Quizscore totaal:</b> ' + pct + '% goed (' + totCor + '/' + totAns + ')</div>';
    h += '<table class="pr-quiz"><tbody>';
    qvs.forEach(v => {
      const band = DATA.rubric.banden[v.bandKey];
      const stat = v.answered ? (v.correct + '/' + v.answered + ' goed') : 'niet gedaan';
      h += '<tr><td>' + esc(lolLabel(v.gid)) + '</td><td>' + stat + '</td>' +
           '<td><span class="pr-band" style="background:' + band.kleur + '">' + esc(bandShort(v.bandKey)) + '</span></td></tr>';
    });
    h += '</tbody></table>';
    return h;
  }

  function downloadPdf() {
    buildPrintReport();
    document.body.classList.add("printing");
    setTimeout(() => { window.print(); }, 60);
  }
  window.addEventListener("afterprint", () => document.body.classList.remove("printing"));

  /* ===================================================================
     TRANSCRIPTIE-INSTELLINGEN (paneel)
  =================================================================== */
  function setupSttPanel() {
    const panel = $("#sttPanel");
    if (!panel) return;

    // waarden invullen vanuit opgeslagen settings
    $$('input[name="sttEngine"]').forEach(r => { r.checked = (r.value === sttSettings.engine); });
    $("#sttFormat").value = sttSettings.format;
    $("#sttUrl").value = sttSettings.url;
    $("#sttLang").value = sttSettings.lang;
    $("#sttModel").value = sttSettings.model;
    reflectEngine();

    function reflectEngine() {
      const isW = sttSettings.engine === "whisper";
      $("#sttWhisperOpts").style.display = isW ? "block" : "none";
      const pill = $("#sttActivePill");
      if (pill) { pill.textContent = isW ? "Actief: lokale Whisper" : "Actief: browser"; pill.className = "stt-pill " + (isW ? "on" : ""); }
    }

    $$('input[name="sttEngine"]').forEach(r => r.addEventListener("change", () => {
      if (r.checked) { sttSettings.engine = r.value; saveStt(); reflectEngine(); }
    }));
    $("#sttFormat").addEventListener("change", () => {
      sttSettings.format = $("#sttFormat").value;
      // vul standaard-URL in als die nog leeg is of een andere preset was
      const presets = Object.keys(STT_PRESETS).map(k => STT_PRESETS[k].url);
      if (!$("#sttUrl").value || presets.indexOf($("#sttUrl").value) >= 0) {
        sttSettings.url = STT_PRESETS[sttSettings.format].url;
        $("#sttUrl").value = sttSettings.url;
      }
      saveStt();
    });
    $("#sttUrl").addEventListener("input", () => { sttSettings.url = $("#sttUrl").value.trim(); saveStt(); });
    $("#sttLang").addEventListener("input", () => { sttSettings.lang = $("#sttLang").value.trim(); saveStt(); });
    $("#sttModel").addEventListener("input", () => { sttSettings.model = $("#sttModel").value.trim(); saveStt(); });

    $("#sttTest").addEventListener("click", async () => {
      const out = $("#sttTestResult");
      out.textContent = "Bezig met testen…";
      out.className = "muted";
      try {
        await fetch(sttSettings.url, { method: "OPTIONS", mode: "cors" });
        out.textContent = "✓ Endpoint bereikbaar. Probeer nu een vraag in te spreken.";
        out.className = "stt-ok";
      } catch (e) {
        out.textContent = "✗ Niet bereikbaar. Draait de Whisper-server op dit adres? Zie de uitleg hieronder.";
        out.className = "stt-bad";
      }
    });

    $("#btnSttToggle").addEventListener("click", () => panel.classList.toggle("is-hidden"));
    $("#sttClose").addEventListener("click", () => panel.classList.add("is-hidden"));
  }

  /* ===================================================================
     INIT
  =================================================================== */
  function init() {
    renderHome();
    setupSttPanel();
    $$("[data-view]").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));

    buildLolSelect($("#filterLol"), true, true);
    buildLolSelect($("#simLol"), true, true);
    $("#filterLol").addEventListener("change", renderOefen);
    $("#filterType").addEventListener("change", renderOefen);
    $("#btnRandom").addEventListener("click", () => {
      const list = filteredQuestions();
      if (!list.length) return;
      const q = list[Math.floor(Math.random() * list.length)];
      const cont = $("#oefenContainer");
      cont.innerHTML = "";
      cont.appendChild(questionCard(q));
    });
    renderOefen();

    // flashcards
    buildLolSelect($("#flashLol"), true, true);
    $("#flashLol").addEventListener("change", () => { flashIdx = 0; renderFlashcards(); });
    $("#flashType").addEventListener("change", () => { flashIdx = 0; renderFlashcards(); });
    $("#flashHideKnown").addEventListener("change", () => { flashIdx = 0; renderFlashcards(); });
    $("#flashShuffle").addEventListener("click", () => { flashDeck = shuffle(flashDeck); flashIdx = 0; showFlashCard(); });
    $("#flashFlip").addEventListener("click", toggleFlip);
    $("#flashNext").addEventListener("click", flashNext);
    $("#flashPrev").addEventListener("click", flashPrev);
    $("#flashKnown").addEventListener("click", () => flashMark(true));
    $("#flashAgain").addEventListener("click", () => flashMark(false));
    document.addEventListener("keydown", flashKeydown);

    // meerkeuze
    buildLolSelect($("#mcLol"), true, true);
    $("#mcLol").addEventListener("change", renderMeerkeuze);
    $("#mcShuffle").addEventListener("click", () => { mcDeck = shuffle(mcDeck); mcIdx = 0; mcScore = 0; mcDone = 0; mcWrong = []; showMcQuestion(); });
    $("#mcRestart").addEventListener("click", renderMeerkeuze);
    $("#mcNext").addEventListener("click", mcNext);

    // podcast
    $("#podPlay").addEventListener("click", podToggle);
    $("#podNext").addEventListener("click", podNextChap);
    $("#podPrev").addEventListener("click", podPrevChap);
    $("#podRate").addEventListener("change", () => {
      podRate = parseFloat($("#podRate").value) || 1;
      if (podPlaying) { stopSpeaking(); podSpeakCurrent(); }
    });

    $("#btnPdf").addEventListener("click", downloadPdf);
    $("#btnStartSim").addEventListener("click", startSim);
    $("#btnSimNext").addEventListener("click", simNext);
    $("#btnSimPrev").addEventListener("click", simPrev);
    $("#btnStopSim").addEventListener("click", () => { if (confirm("Simulatie stoppen?")) resetSimSetup(); });

    $("#btnReset").addEventListener("click", () => {
      if (confirm("Weet je zeker dat je alle notities, beoordelingen en aangevinkte punten wilt wissen?")) {
        store = {};
        saveStore(store);
        renderVoortgang();
        renderOefen();
        alert("Voortgang gewist.");
      }
    });

    showView("home");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
