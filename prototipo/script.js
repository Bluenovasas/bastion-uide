/*
  BASTION - Boveda Personal de Credenciales
  Logica del prototipo de interfaz (demostracion visual en el navegador).
  Autor: David Alexander Benz Zambrano - UIDE 1-CIB-1A
*/

/* =====================================================================
   BASTION - Bóveda Personal de Credenciales
   Prototipo funcional de interfaz · UIDE Ciberseguridad · David Benz
   ===================================================================== */
(function () {
  "use strict";

  /* ---------------- Config de categorías ---------------- */
  const ICN = {
    grid: '<path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"/>',
    social: '<path d="M18 8a3 3 0 1 0-2.8-4M6 12a3 3 0 1 0 0 .01M18 19a3 3 0 1 0-2.8-1.9M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
    banca: '<path d="M3 21h18M5 21V10M19 21V10M3 10l9-6 9 6M9 21v-6h6v6"/>',
    trabajo: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    correo: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    api: '<path d="M9 3 4 8l5 5M15 3l5 5-5 5M11 21l2-18"/>',
    otros: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>'
  };

  const CATS = [
    { id: "all",     name: "Todas",             color: "#E8B339", icon: ICN.grid },
    { id: "social",  name: "Redes sociales",    color: "#C2415F", icon: ICN.social },
    { id: "banca",   name: "Banca y finanzas",  color: "#34D399", icon: ICN.banca },
    { id: "trabajo", name: "Trabajo",           color: "#38BDF8", icon: ICN.trabajo },
    { id: "correo",  name: "Correo",            color: "#A78BFA", icon: ICN.correo },
    { id: "api",     name: "Claves API / SSH",  color: "#2DD4BF", icon: ICN.api },
    { id: "otros",   name: "Otros",             color: "#8A97B4", icon: ICN.otros }
  ];
  const catName = (id) => (CATS.find(c => c.id === id) || CATS[6]).name;
  const catColor = (id) => (CATS.find(c => c.id === id) || CATS[6]).color;

  const AV_COLORS = ["#E8B339", "#2DD4BF", "#38BDF8", "#C2415F", "#A78BFA", "#34D399", "#F0A93B", "#F472B6"];

  /* ---------------- Estado ---------------- */
  const STORE = "bastion_vault";
  const MAGIC = "BASTION-V1";
  let state = { master: null, creds: [], cat: "all", q: "" };

  /* ---------------- Cifrado demostrativo (XOR + Base64 sobre UTF-8) ----------------
     No es criptografía de grado producción: ilustra el concepto de bóveda cifrada.
     El producto final usa AES-256-GCM + Argon2id (ver documento PDF, capítulo 8). */
  function keyBytes(master) {
    const salt = "BASTION::salt::2026";
    const raw = new TextEncoder().encode(master + salt);
    // pequeño "stretch": mezcla acumulativa para que la clave no sea el texto plano
    const out = new Uint8Array(Math.max(32, raw.length));
    let acc = 0x9e;
    for (let i = 0; i < out.length; i++) {
      acc = (acc + raw[i % raw.length] + i * 31) & 0xff;
      acc = ((acc << 1) | (acc >> 7)) & 0xff;
      out[i] = acc ^ raw[(i * 7 + 3) % raw.length];
    }
    return out;
  }
  function bytesToB64(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }
  function b64ToBytes(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }
  function encrypt(obj, master) {
    const data = new TextEncoder().encode(JSON.stringify(obj));
    const key = keyBytes(master);
    const out = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length];
    return bytesToB64(out);
  }
  function decrypt(b64, master) {
    try {
      const data = b64ToBytes(b64);
      const key = keyBytes(master);
      const out = new Uint8Array(data.length);
      for (let i = 0; i < data.length; i++) out[i] = data[i] ^ key[i % key.length];
      const txt = new TextDecoder().decode(out);
      const obj = JSON.parse(txt);
      if (!obj || obj.magic !== MAGIC) return null;
      return obj;
    } catch (e) { return null; }
  }
  function persist() {
    const payload = { magic: MAGIC, savedAt: new Date().toISOString(), creds: state.creds };
    try { localStorage.setItem(STORE, encrypt(payload, state.master)); }
    catch (e) { /* file:// sin storage: la sesión sigue en memoria */ }
  }
  function rawStored() { try { return localStorage.getItem(STORE) || ""; } catch (e) { return ""; } }
  function vaultExists() { return rawStored().length > 0; }

  /* ---------------- Aleatoriedad segura ---------------- */
  function rand(n) {
    if (window.crypto && crypto.getRandomValues) {
      const a = new Uint32Array(1); crypto.getRandomValues(a);
      return a[0] % n;
    }
    return Math.floor(Math.random() * n);
  }
  function pick(str) { return str[rand(str.length)]; }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = rand(i + 1);[arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
  }

  /* ---------------- Generador ---------------- */
  const SETS = {
    upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",   // sin I, O ambiguas
    lower: "abcdefghijkmnpqrstuvwxyz",   // sin l
    num:   "23456789",                   // sin 0, 1
    sym:   "!@#$%&*-_=+?."
  };
  function genPassword(len, opts) {
    const active = Object.keys(SETS).filter(k => opts[k]);
    if (active.length === 0) return "";
    let pool = "", out = [];
    active.forEach(k => { pool += SETS[k]; out.push(pick(SETS[k])); }); // garantiza 1 de cada
    while (out.length < len) out.push(pick(pool));
    return shuffle(out).slice(0, len).join("");
  }

  /* ---------------- Fortaleza ---------------- */
  function strength(pw) {
    if (!pw) return { score: 0, label: "-", color: "#5C6884", pct: 0 };
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (pw.length >= 16) s++;
    const variety = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(pw)).length;
    s += Math.max(0, variety - 1);
    if (pw.length >= 20 && variety >= 3) s++;
    s = Math.min(s, 6);
    if (s <= 1) return { score: s, label: "Débil", color: "#F05252", pct: 26 };
    if (s <= 3) return { score: s, label: "Media", color: "#F0A93B", pct: 55 };
    if (s <= 5) return { score: s, label: "Fuerte", color: "#34D399", pct: 80 };
    return { score: s, label: "Muy fuerte", color: "#2DD4BF", pct: 100 };
  }
  function paintMeter(spanEl, pw, lblEl) {
    const st = strength(pw);
    spanEl.style.width = st.pct + "%";
    spanEl.style.background = st.color;
    if (lblEl) { lblEl.textContent = st.label; lblEl.style.color = st.color; }
  }

  /* ---------------- DOM refs ---------------- */
  const $ = (id) => document.getElementById(id);
  const lock = $("lock"), app = $("app");

  /* ===================== LOCK SCREEN ===================== */
  let mode = "create"; // 'create' | 'login'
  function refreshLockMode() {
    mode = vaultExists() ? "login" : "create";
    if (mode === "login") {
      $("lockStateTxt").textContent = "Desbloquear bóveda";
      $("lblMaster").textContent = "Contraseña maestra";
      $("unlockTxt").textContent = "Desbloquear";
      $("confirmField").style.display = "none";
      $("masterMeterWrap").style.display = "none";
      $("masterMeterLbl").style.display = "none";
      $("resetLink").style.display = "inline";
    } else {
      $("lockStateTxt").textContent = "Crear bóveda";
      $("lblMaster").textContent = "Define tu contraseña maestra";
      $("unlockTxt").textContent = "Crear y entrar";
      $("confirmField").style.display = "block";
      $("masterMeterWrap").style.display = "block";
      $("masterMeterLbl").style.display = "flex";
      $("resetLink").style.display = "none";
    }
    $("master").value = ""; $("master2").value = ""; $("lockErr").textContent = "";
  }
  function lockError(msg) {
    $("lockErr").innerHTML = '<svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>' + msg;
  }
  function openApp() {
    lock.style.display = "none";
    app.style.display = "grid";
    renderAll();
  }
  function doUnlock() {
    const m = $("master").value;
    if (mode === "create") {
      if (m.length < 4) { lockError("La clave maestra debe tener al menos 4 caracteres."); return; }
      if (m !== $("master2").value) { lockError("Las contraseñas no coinciden."); return; }
      state.master = m; state.creds = []; persist(); openApp();
      toast("Bóveda creada");
    } else {
      const data = decrypt(rawStored(), m);
      if (!data) { lockError("Contraseña maestra incorrecta."); $("master").value = ""; $("master").focus(); return; }
      state.master = m; state.creds = data.creds || []; openApp();
      toast("Bóveda desbloqueada");
    }
  }
  function lockNow() {
    state.master = null; state.creds = []; state.cat = "all"; state.q = "";
    app.style.display = "none"; lock.style.display = "flex";
    refreshLockMode();
  }
  function loadDemo() {
    state.master = "demo";
    state.creds = [
      { id: uid(), name: "Instagram", user: "@arabellapazmi", pw: "Tr0p1c@l-Sol#92", cat: "social" },
      { id: uid(), name: "Banco Pichincha", user: "0951xxxxxx", pw: "Qz7$mNvK2pLw9!", cat: "banca" },
      { id: uid(), name: "GitHub Bluenovasas", user: "consultingbluenova", pw: "ghp-K9mPx2-Qz7Lw", cat: "api" },
      { id: uid(), name: "Gmail Trabajo", user: "consultingbluenova@gmail.com", pw: "Ble&Nova-2026", cat: "correo" },
      { id: uid(), name: "Servidor n8n (SSH)", user: "root@hub.bluenova", pw: "x9K$mP-vN2qLw7=Rt", cat: "api" },
      { id: uid(), name: "GoHighLevel", user: "david@bluenova", pw: "Gh!L-2026-Sub#4", cat: "trabajo" }
    ];
    persist(); openApp(); toast("Bóveda de ejemplo cargada");
  }
  function resetVault() {
    try { localStorage.removeItem(STORE); } catch (e) {}
    refreshLockMode(); toast("Bóveda borrada");
  }
  function uid() { return "c" + Date.now().toString(36) + rand(9999).toString(36); }

  /* ===================== RENDER ===================== */
  function filtered() {
    const q = state.q.trim().toLowerCase();
    return state.creds.filter(c => {
      const okCat = state.cat === "all" || c.cat === state.cat;
      const okQ = !q || c.name.toLowerCase().includes(q) || (c.user || "").toLowerCase().includes(q);
      return okCat && okQ;
    });
  }
  function renderCats() {
    const host = $("catList"); host.innerHTML = "";
    CATS.forEach(c => {
      const n = c.id === "all" ? state.creds.length : state.creds.filter(x => x.cat === c.id).length;
      const el = document.createElement("div");
      el.className = "cat" + (state.cat === c.id ? " active" : "");
      el.innerHTML =
        '<svg class="ci" viewBox="0 0 24 24" fill="none" stroke="' + c.color + '">' + c.icon + '</svg>' +
        '<span>' + c.name + '</span><span class="count">' + n + '</span>';
      el.onclick = () => { state.cat = c.id; renderAll(); };
      host.appendChild(el);
    });
  }
  function renderStats() {
    const all = state.creds;
    const fuertes = all.filter(c => strength(c.pw).score >= 4).length;
    const debiles = all.filter(c => c.pw && strength(c.pw).score <= 1).length;
    const usadas = new Set(all.map(c => c.cat)).size;
    const data = [
      { k: "Credenciales", v: all.length, c: "#E8B339", ic: ICN.grid },
      { k: "Contraseñas fuertes", v: fuertes, c: "#34D399", ic: '<path d="M20 6 9 17l-5-5"/>' },
      { k: "Requieren mejora", v: debiles, c: "#F0A93B", ic: '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>' },
      { k: "Categorías en uso", v: usadas, c: "#38BDF8", ic: ICN.trabajo }
    ];
    $("stats").innerHTML = data.map(s =>
      '<div class="stat"><div class="k"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="' + s.c + '">' + s.ic + '</svg>' + s.k + '</div><div class="v" style="color:' + s.c + '">' + s.v + '</div></div>'
    ).join("");
  }
  function renderCards() {
    const host = $("cards"); host.innerHTML = "";
    const list = filtered();
    $("viewTitle").textContent = state.cat === "all" ? "Todas las credenciales" : catName(state.cat);
    $("viewSub").textContent = state.q
      ? list.length + ' resultado(s) para "' + state.q + '"'
      : "Tu bóveda local, cifrada con tu clave maestra.";

    if (list.length === 0) {
      host.innerHTML =
        '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        '<p>' + (state.q || state.cat !== "all" ? "Sin coincidencias aquí" : "Tu bóveda está vacía") + '</p>' +
        '<span>' + (state.q || state.cat !== "all" ? "Prueba otra categoría o búsqueda." : 'Usa "Agregar credencial" para guardar tu primera contraseña.') + '</span></div>';
      return;
    }
    list.forEach((c, i) => {
      const st = strength(c.pw);
      const avColor = AV_COLORS[Math.abs(hash(c.name)) % AV_COLORS.length];
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = (i * 0.04) + "s";
      card.innerHTML =
        '<div class="card-top">' +
          '<div class="avatar" style="background:' + avColor + '">' + (c.name[0] || "?").toUpperCase() + '</div>' +
          '<div class="meta"><div class="name">' + esc(c.name) + '</div><div class="user">' + esc(c.user || "-") + '</div></div>' +
          '<span class="pill" style="background:' + hexA(catColor(c.cat), .15) + ';color:' + catColor(c.cat) + '">' + catName(c.cat) + '</span>' +
        '</div>' +
        '<div class="pw-row">' +
          '<span class="pw-val" data-pw>••••••••••••</span>' +
          '<button class="ic-btn" data-act="show" title="Mostrar/ocultar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>' +
          '<button class="ic-btn" data-act="copy" title="Copiar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>' +
        '</div>' +
        '<div class="card-foot">' +
          '<span class="str"><span class="bar"><span style="width:' + st.pct + '%;background:' + st.color + '"></span></span>' + st.label + '</span>' +
          '<button class="ic-btn del" data-act="del" title="Eliminar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
        '</div>';
      const pwEl = card.querySelector("[data-pw]");
      card.querySelector('[data-act="show"]').onclick = () => {
        if (pwEl.dataset.shown === "1") { pwEl.textContent = "••••••••••••"; pwEl.dataset.shown = "0"; }
        else { pwEl.textContent = c.pw; pwEl.dataset.shown = "1"; }
      };
      card.querySelector('[data-act="copy"]').onclick = () => { copyText(c.pw); };
      card.querySelector('[data-act="del"]').onclick = () => {
        state.creds = state.creds.filter(x => x.id !== c.id); persist(); renderAll(); toast("Credencial eliminada");
      };
      host.appendChild(card);
    });
  }
  function renderAll() { renderCats(); renderStats(); renderCards(); }

  function esc(s) { return String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0; return h; }
  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  /* ===================== UTIL: copiar + toast ===================== */
  let toastT;
  function toast(msg) {
    $("toastTxt").textContent = msg;
    const t = $("toast"); t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }
  function copyText(txt) {
    const done = () => toast("Copiado al portapapeles");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done).catch(() => fallbackCopy(txt, done));
    } else fallbackCopy(txt, done);
  }
  function fallbackCopy(txt, cb) {
    const ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ===================== MODALES ===================== */
  function openModal(id) { $(id).classList.add("show"); }
  function closeModal(el) { el.classList.remove("show"); }
  document.querySelectorAll(".modal-bg").forEach(bg => {
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(bg); });
    bg.querySelectorAll("[data-close]").forEach(b => b.onclick = () => closeModal(bg));
  });

  /* ---- Generador ---- */
  const genOpts = { upper: true, lower: true, num: true, sym: true };
  function regen() {
    const len = parseInt($("lenRange").value, 10);
    const pw = genPassword(len, genOpts);
    $("genPw").textContent = pw || "Activa al menos un tipo";
    paintMeter($("genMeter"), pw, $("genMeterTxt"));
  }
  $("lenRange").addEventListener("input", () => { $("lenVal").textContent = $("lenRange").value; regen(); });
  document.querySelectorAll(".tg").forEach(tg => {
    tg.onclick = () => {
      const k = tg.dataset.tg;
      const willOff = tg.classList.contains("on");
      const onCount = Object.values(genOpts).filter(Boolean).length;
      if (willOff && onCount === 1) { toast("Debe quedar al menos un tipo"); return; }
      tg.classList.toggle("on"); genOpts[k] = !willOff; regen();
    };
  });
  $("genAgain").onclick = regen;
  $("genCopy").onclick = () => { const t = $("genPw").textContent; if (t && t.length > 3 && !t.startsWith("Activa")) copyText(t); };
  $("openGen").onclick = () => { regen(); openModal("genModal"); };
  $("genUse").onclick = () => {
    const t = $("genPw").textContent;
    if (!t || t.startsWith("Activa")) return;
    closeModal($("genModal"));
    openAddModal(t);
  };

  /* ---- Agregar credencial ---- */
  function fillCatSelect() {
    const sel = $("addCat"); sel.innerHTML = "";
    CATS.filter(c => c.id !== "all").forEach(c => {
      const o = document.createElement("option"); o.value = c.id; o.textContent = c.name; sel.appendChild(o);
    });
  }
  function openAddModal(prefillPw) {
    $("addName").value = ""; $("addUser").value = "";
    $("addPw").value = prefillPw || "";
    $("addCat").value = state.cat !== "all" ? state.cat : "social";
    paintMeter($("addMeter"), $("addPw").value, null);
    openModal("addModal"); setTimeout(() => $("addName").focus(), 50);
  }
  $("openAdd").onclick = () => openAddModal("");
  $("addPw").addEventListener("input", () => paintMeter($("addMeter"), $("addPw").value, null));
  $("addGenInline").onclick = () => {
    const pw = genPassword(16, { upper: true, lower: true, num: true, sym: true });
    $("addPw").value = pw; paintMeter($("addMeter"), pw, null);
  };
  $("addSave").onclick = () => {
    const name = $("addName").value.trim();
    const pw = $("addPw").value;
    if (!name) { toast("Escribe el nombre del servicio"); $("addName").focus(); return; }
    if (!pw) { toast("Falta la contraseña"); $("addPw").focus(); return; }
    state.creds.unshift({ id: uid(), name, user: $("addUser").value.trim(), pw, cat: $("addCat").value });
    persist(); closeModal($("addModal")); renderAll(); toast("Guardado en la bóveda");
  };

  /* ---- Modal cifrado ---- */
  let ctab = "enc";
  function renderCipher() {
    const payload = { magic: MAGIC, savedAt: new Date().toISOString(), creds: state.creds };
    const box = $("cipherOut");
    if (ctab === "enc") {
      box.classList.remove("plain");
      const enc = encrypt(payload, state.master);
      box.textContent = enc.replace(/(.{64})/g, "$1\n") || "(bóveda vacía)";
    } else {
      box.classList.add("plain");
      box.textContent = JSON.stringify(payload, null, 2);
    }
  }
  document.querySelectorAll(".ctab").forEach(t => {
    t.onclick = () => {
      document.querySelectorAll(".ctab").forEach(x => x.classList.remove("active"));
      t.classList.add("active"); ctab = t.dataset.ctab; renderCipher();
    };
  });
  $("cipherBtn").onclick = () => { ctab = "enc"; document.querySelectorAll(".ctab").forEach((x, i) => x.classList.toggle("active", i === 0)); renderCipher(); openModal("cipherModal"); };

  /* ===================== Listeners lock + topbar ===================== */
  $("master").addEventListener("input", () => {
    if (mode === "create") paintMeter($("masterMeter"), $("master").value, $("masterMeterTxt"));
  });
  function eyeToggle(inputId, btnId) {
    $(btnId).onclick = () => {
      const inp = $(inputId);
      inp.type = inp.type === "password" ? "text" : "password";
    };
  }
  eyeToggle("master", "eyeMaster");
  $("unlockBtn").onclick = doUnlock;
  $("master").addEventListener("keydown", e => { if (e.key === "Enter") { if (mode === "login") doUnlock(); else $("master2").focus(); } });
  $("master2").addEventListener("keydown", e => { if (e.key === "Enter") doUnlock(); });
  $("demoBtn").onclick = loadDemo;
  $("resetBtn").onclick = resetVault;
  $("lockNowBtn").onclick = lockNow;
  $("searchInput").addEventListener("input", e => { state.q = e.target.value; renderCards(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal-bg.show").forEach(closeModal); });

  /* ---- Init ---- */
  fillCatSelect();
  refreshLockMode();
  setTimeout(() => $("master").focus(), 200);

})();
