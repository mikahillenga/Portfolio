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

  /* ---------- view switching ---------- */
  function showView(name) {
    $$(".view").forEach(v => v.classList.add("is-hidden"));
    const view = $("#view-" + name);
    if (view) view.classList.remove("is-hidden");
    $$(".nav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.view === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    slot.appendChild(questionCard(sim.qs[sim.idx]));
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
      '<p>Ik beoordeel je op basis van de kernpunten die je per vraag hebt <b>aangevinkt als “genoemd”</b>. ' +
      'Wees daarin eerlijk — dan is dit oordeel een eerlijke spiegel. Dit is een oefenindicatie, geen officieel cijfer.</p></div>';
    cont.appendChild(intro);

    if (!attemptedVerdicts.length) {
      cont.appendChild(el("div", "empty",
        "Je hebt nog geen vragen geoefend. Ga naar <b>Oefenen</b> of <b>CGI-simulatie</b>, beantwoord vragen en vink per vraag aan welke kernpunten je noemde. Daarna geef ik mijn oordeel."));
      return;
    }

    // overall
    const avg = attemptedVerdicts.reduce((s, v) => s + BAND_SCORE[v.bandKey], 0) / attemptedVerdicts.length;
    let overallKey;
    if (avg >= 2.5) overallKey = "goed";
    else if (avg >= 1.6) overallKey = "voldoende";
    else if (avg >= 0.8) overallKey = "bijna";
    else overallKey = "onvoldoende";
    const oBand = DATA.rubric.banden[overallKey];

    const overall = el("div", "verdict-overall");
    overall.style.setProperty("--vc", oBand.kleur);
    let dims = DATA.rubric.dimensies.map(d =>
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

    // per-LOL verdict cards
    verdicts.forEach(v => cont.appendChild(verdictCard(v)));

    // CTA
    const cta = el("div", "beoordeling-cta");
    cta.innerHTML = '<button class="btn btn-ghost" id="btnBeoToOefen">Oefen de zwakke punten</button>' +
                    '<button class="btn btn-ghost" id="btnBeoSim">Doe een CGI-simulatie</button>';
    cont.appendChild(cta);
    $("#btnBeoToOefen").addEventListener("click", () => openOefen("all"));
    $("#btnBeoSim").addEventListener("click", () => showView("simulatie"));
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
     INIT
  =================================================================== */
  function init() {
    renderHome();
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
