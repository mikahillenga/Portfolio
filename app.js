/* =====================================================================
   CGI-oefenomgeving — applicatielogica
   Geen build-stap nodig: open index.html in je browser.
   Voortgang/notities worden bewaard in localStorage (alleen lokaal).
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
  function getEntry(id) { return store[id] || (store[id] = { notitie: "", rating: null }); }

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
  function lolLabel(id) {
    if (id === "alg") return "Portfolio-breed";
    const l = lolById(id);
    return l ? ("LOL " + l.nummer + " — " + l.naam) : id;
  }
  function lolColor(id) {
    if (id === "alg") return "#475569";
    const l = lolById(id);
    return l ? l.kleur : "#2563eb";
  }

  /* ---------- view switching ---------- */
  function showView(name) {
    $$(".view").forEach(v => v.classList.add("is-hidden"));
    const view = $("#view-" + name);
    if (view) view.classList.remove("is-hidden");
    $$(".nav-btn").forEach(b => b.classList.toggle("is-active", b.dataset.view === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (name === "spiekbriefje") renderFacts();
    if (name === "voortgang") renderVoortgang();
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
      card.addEventListener("click", () => {
        showView("oefenen");
        $("#filterLol").value = l.id;
        $("#filterType").value = "all";
        renderOefen();
      });
      grid.appendChild(card);
    });

    // Portfolio-breed kaart
    const algN = DATA.vragen.filter(q => q.lol === "alg").length;
    const algCard = el("button", "lol-card");
    algCard.style.setProperty("--lolc", "#475569");
    algCard.innerHTML =
      '<span class="lol-num">Portfolio-breed</span>' +
      '<h3>Overkoepelende vragen</h3>' +
      '<p>Elevator pitch, eigenaarschap, POP-groei, niveau 2 en je beroepsperspectief.</p>' +
      '<div class="lol-meta">' + algN + ' oefenvragen</div>';
    algCard.addEventListener("click", () => {
      showView("oefenen");
      $("#filterLol").value = "alg";
      $("#filterType").value = "all";
      renderOefen();
    });
    grid.appendChild(algCard);

    const tips = $("#cgiTipsList");
    tips.innerHTML = "";
    DATA.cgiTips.forEach(t => tips.appendChild(el("li", null, esc(t))));
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
    const parts = [
      ["S", "Situatie — context kort"],
      ["T", "Taak — wat moest jij"],
      ["A", "Actie — wat deed jíj"],
      ["R", "Resultaat — uitkomst"],
      ["R", "Reflectie — wat leerde je"]
    ];
    parts.forEach(p => {
      const pill = el("span", "starr-pill", "<b>" + p[0] + "</b> · " + esc(p[1]));
      wrap.appendChild(pill);
    });
    return wrap;
  }

  function questionCard(q, opts) {
    opts = opts || {};
    const entry = getEntry(q.id);
    const card = el("div", "q-card");

    // head with tags
    const head = el("div", "q-head");
    const lolTag = el("span", "tag tag-lol", esc(lolLabel(q.lol)));
    lolTag.style.background = lolColor(q.lol);
    head.appendChild(lolTag);
    head.appendChild(el("span", "tag tag-" + q.type, esc(DATA.types[q.type].label)));
    if (q.koppeling) head.appendChild(el("span", "tag tag-koppeling", esc(q.koppeling)));
    card.appendChild(head);

    card.appendChild(el("p", "q-text", esc(q.vraag)));
    card.appendChild(el("p", "q-typehint", esc(DATA.types[q.type].uitleg)));

    // STARR scaffold
    card.appendChild(starrPills());

    // answer textarea
    const ta = el("textarea", "q-answer");
    ta.placeholder = "Typ hier je antwoord, of gebruik het alleen om hardop te oefenen…";
    ta.value = entry.notitie || "";
    ta.addEventListener("input", () => { entry.notitie = ta.value; saveStore(store); });
    card.appendChild(ta);

    // actions
    const actions = el("div", "q-actions");
    const btnModel = el("button", "btn btn-small btn-ghost", "💡 Toon modelpunten");
    actions.appendChild(btnModel);

    const rating = el("div", "rating");
    const rates = [["bad", "Onvoldoende"], ["ok", "Voldoende"], ["good", "Goed"]];
    const rateBtns = {};
    rates.forEach(r => {
      const b = el("button", "rate-btn", esc(r[1]));
      rateBtns[r[0]] = b;
      if (entry.rating === r[0]) b.classList.add("sel-" + r[0]);
      b.addEventListener("click", () => {
        entry.rating = (entry.rating === r[0]) ? null : r[0];
        saveStore(store);
        Object.keys(rateBtns).forEach(k => rateBtns[k].classList.remove("sel-bad", "sel-ok", "sel-good"));
        if (entry.rating) rateBtns[entry.rating].classList.add("sel-" + entry.rating);
      });
      rating.appendChild(b);
    });
    actions.appendChild(rating);
    card.appendChild(actions);

    // model points (collapsed)
    const model = el("div", "model");
    model.style.display = "none";
    let mh = "<h4>Waar let de assessor op — modelpunten uit jouw portfolio</h4><ul>";
    q.modelpunten.forEach(m => { mh += "<li>" + esc(m) + "</li>"; });
    mh += "</ul>";
    model.innerHTML = mh;
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

  function pickSimQuestions(aantal, scope, lolFilter) {
    let pool = DATA.vragen.slice();
    if (lolFilter && lolFilter !== "all") pool = pool.filter(q => q.lol === lolFilter);
    if (scope === "open") {
      // bias naar open: open eerst, aanvullen met rest
      const open = shuffle(pool.filter(q => q.type === "open"));
      const rest = shuffle(pool.filter(q => q.type !== "open"));
      pool = open.concat(rest);
    } else if (scope === "kritisch") {
      const zwaar = shuffle(pool.filter(q => q.type === "kritisch" || q.type === "doorvraag"));
      const rest = shuffle(pool.filter(q => q.type === "open"));
      pool = zwaar.concat(rest);
    } else {
      pool = shuffle(pool);
    }
    return pool.slice(0, Math.min(aantal, pool.length));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
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
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    $("#simTimer").textContent = mm + ":" + ss;
  }

  function renderSimQuestion() {
    const slot = $("#simQuestionSlot");
    slot.innerHTML = "";
    const q = sim.qs[sim.idx];
    slot.appendChild(questionCard(q, { sim: true }));
    $("#simIndex").textContent = sim.idx + 1;
    $("#simFill").style.width = ((sim.idx + 1) / sim.qs.length * 100) + "%";
    $("#btnSimPrev").style.visibility = sim.idx === 0 ? "hidden" : "visible";
    $("#btnSimNext").textContent = (sim.idx === sim.qs.length - 1) ? "Afronden ✓" : "Volgende →";
  }

  function simNext() {
    if (sim.idx < sim.qs.length - 1) { sim.idx++; renderSimQuestion(); window.scrollTo({top:0,behavior:"smooth"}); }
    else finishSim();
  }
  function simPrev() {
    if (sim.idx > 0) { sim.idx--; renderSimQuestion(); window.scrollTo({top:0,behavior:"smooth"}); }
  }

  function finishSim() {
    if (simInterval) clearInterval(simInterval);
    const elapsed = Math.floor((Date.now() - sim.started) / 1000);
    const mm = Math.floor(elapsed / 60), ss = elapsed % 60;

    let good = 0, ok = 0, bad = 0, none = 0;
    sim.qs.forEach(q => {
      const r = (store[q.id] && store[q.id].rating) || null;
      if (r === "good") good++; else if (r === "ok") ok++; else if (r === "bad") bad++; else none++;
    });

    $("#simRun").classList.add("is-hidden");
    const res = $("#simResult");
    res.classList.remove("is-hidden");
    res.innerHTML =
      '<h2>Simulatie afgerond 🎉</h2>' +
      '<p class="muted">Je beantwoordde ' + sim.qs.length + ' vragen in ' + mm + ' min ' + ss + ' sec. ' +
      'Hieronder je zelfbeoordeling — werk de vragen met "onvoldoende" gericht na.</p>' +
      '<div class="result-stat">' +
        statBox(good, "Goed", "var(--good)") +
        statBox(ok, "Voldoende", "var(--ok)") +
        statBox(bad, "Onvoldoende", "var(--bad)") +
        statBox(none, "Niet beoordeeld", "var(--text-soft)") +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
        '<button class="btn btn-primary" id="btnSimAgain">Nieuwe simulatie</button>' +
        '<button class="btn btn-ghost" id="btnSimToOefen">Zwakke vragen oefenen</button>' +
      '</div>';
    $("#btnSimAgain").addEventListener("click", resetSimSetup);
    $("#btnSimToOefen").addEventListener("click", () => { showView("oefenen"); $("#filterLol").value="all"; $("#filterType").value="all"; renderOefen(); });
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
     VOORTGANG
  =================================================================== */
  function renderVoortgang() {
    const cont = $("#voortgangContainer");
    cont.innerHTML = "";
    const groups = DATA.lols.map(l => l.id).concat(["alg"]);
    groups.forEach(gid => {
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
     INIT
  =================================================================== */
  function init() {
    renderHome();

    // nav buttons (en alle elementen met data-view)
    $$("[data-view]").forEach(b => b.addEventListener("click", () => showView(b.dataset.view)));

    // oefenen filters
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

    // simulatie
    $("#btnStartSim").addEventListener("click", startSim);
    $("#btnSimNext").addEventListener("click", simNext);
    $("#btnSimPrev").addEventListener("click", simPrev);
    $("#btnStopSim").addEventListener("click", () => { if (confirm("Simulatie stoppen?")) resetSimSetup(); });

    // reset
    $("#btnReset").addEventListener("click", () => {
      if (confirm("Weet je zeker dat je alle notities en beoordelingen wilt wissen?")) {
        store = {};
        saveStore(store);
        renderVoortgang();
        alert("Voortgang gewist.");
      }
    });

    showView("home");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
