/*
  BASTION - Boveda Personal de Credenciales (aplicacion web)
  Interfaz de alta fidelidad (prototipo de David Benz) potenciada con el codigo
  real de bastion.py, ejecutado en el navegador mediante Pyodide.
  Autor: David Alexander Benz Zambrano - Blue Nova SAS - UIDE 1-CIB-1A
*/
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ---------------- Consola Python ---------------- */
  function clog(t, c) {
    const box = $("consolaLog");
    const d = document.createElement("div");
    d.className = "l " + (c || "info");
    d.textContent = t;
    box.appendChild(d);
    box.scrollTop = box.scrollHeight;
  }
  function cap(b) { return b ? "True" : "False"; }

  /* ---------------- Motor Python (Pyodide) ---------------- */
  let PY = null;
  const GLUE = `
import bastion
import json as _json
from datetime import datetime as _dt

def web_hash(clave):
    return bastion.calcular_hash(clave)

def web_generar(longitud, upper, lower, num, sym):
    alfabeto = ""; tipos = 0
    if lower: alfabeto += bastion.string.ascii_lowercase; tipos += 1
    if upper: alfabeto += bastion.string.ascii_uppercase; tipos += 1
    if num:   alfabeto += bastion.string.digits; tipos += 1
    if sym:   alfabeto += "!@#$%&*-_=+?."; tipos += 1
    if not alfabeto:
        return _json.dumps({"clave": "", "fortaleza": "-"})
    clave = "".join(bastion.secrets.choice(alfabeto) for _ in range(int(longitud)))
    return _json.dumps({"clave": clave, "fortaleza": bastion.calcular_fortaleza(int(longitud), tipos)})

def web_fortaleza(clave):
    if not clave:
        return "-"
    tipos = 0
    if any(c.islower() for c in clave): tipos += 1
    if any(c.isupper() for c in clave): tipos += 1
    if any(c.isdigit() for c in clave): tipos += 1
    if any((not c.isalnum()) for c in clave): tipos += 1
    return bastion.calcular_fortaleza(len(clave), tipos)

def web_enmascarar(c):
    return bastion.enmascarar(c)

def web_ahora():
    return _dt.now().strftime("%Y-%m-%d %H:%M:%S")
`;

  async function initPy() {
    clog("Cargando Pyodide (motor de Python)...", "info");
    try {
      const pyodide = await loadPyodide();
      clog("Pyodide listo. Importando bastion.py...", "info");
      const src = await (await fetch("../bastion.py")).text();
      pyodide.FS.writeFile("bastion.py", src);
      pyodide.runPython(GLUE);
      PY = {
        hash: pyodide.globals.get("web_hash"),
        generar: pyodide.globals.get("web_generar"),
        fortaleza: pyodide.globals.get("web_fortaleza"),
        enmascarar: pyodide.globals.get("web_enmascarar"),
        ahora: pyodide.globals.get("web_ahora"),
      };
      clog("bastion.py cargado. Funciones reales disponibles:", "res");
      clog("    calcular_hash, calcular_fortaleza, generar, enmascarar.", "res");
      $("unlockBtn").disabled = false;
      refreshLockMode();
      setTimeout(() => $("master").focus(), 60);
    } catch (e) {
      clog("ERROR: " + e.message, "err");
      clog("Revisa tu conexion a internet (Pyodide se descarga la primera vez).", "warn");
      $("unlockTxt").textContent = "Error al cargar Python";
    }
  }

  /* ---------------- Categorias ---------------- */
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
    { id: "all",     name: "Todas",            color: "#97F8F4", icon: ICN.grid },
    { id: "social",  name: "Redes sociales",   color: "#FF6B9D", icon: ICN.social },
    { id: "banca",   name: "Banca y finanzas", color: "#34D399", icon: ICN.banca },
    { id: "trabajo", name: "Trabajo",          color: "#38BDF8", icon: ICN.trabajo },
    { id: "correo",  name: "Correo",           color: "#A78BFA", icon: ICN.correo },
    { id: "api",     name: "Claves API / SSH", color: "#38D9E6", icon: ICN.api },
    { id: "otros",   name: "Otros",            color: "#8A97B4", icon: ICN.otros }
  ];
  const catName = (id) => (CATS.find(c => c.id === id) || CATS[6]).name;
  const catColor = (id) => (CATS.find(c => c.id === id) || CATS[6]).color;
  const AV_COLORS = ["#119CFF", "#38D9E6", "#9DFF00", "#A78BFA", "#FF6B9D", "#34D399", "#F0A93B", "#97F8F4"];

  /* ---------------- Estado y persistencia ---------------- */
  const STORE = "bastion_boveda_v2";
  let state = { hash: null, creds: [], historial: [], cat: "all", q: "" };

  function load() { try { const r = localStorage.getItem(STORE); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function vaultExists() { return !!load(); }
  function persist() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ hash_maestra: state.hash, creds: state.creds, historial: state.historial }));
      clog("guardar_boveda()  ->  boveda.json escrito en el navegador", "info");
    } catch (e) {}
  }

  /* cifrado demostrativo (solo para la vista "con AES") */
  function encDemo(obj, key) {
    const data = new TextEncoder().encode(JSON.stringify(obj));
    const k = new TextEncoder().encode(key + "::bastion");
    let bin = "";
    for (let i = 0; i < data.length; i++) bin += String.fromCharCode(data[i] ^ k[i % k.length]);
    return btoa(bin);
  }

  /* ---------------- Fortaleza (via Python) ---------------- */
  function fortColor(l) { return ({ "Debil": "#FF5470", "Media": "#F0A93B", "Fuerte": "#9DFF00", "-": "#5E6B86" })[l] || "#5E6B86"; }
  function fortPct(l) { return ({ "Debil": 28, "Media": 58, "Fuerte": 92, "-": 0 })[l] || 0; }
  function fortOf(pw) { return (PY && pw) ? PY.fortaleza(pw) : "-"; }
  function paintMeter(span, pw, lblEl) {
    const l = fortOf(pw);
    span.style.width = fortPct(l) + "%";
    span.style.background = fortColor(l);
    if (lblEl) { lblEl.textContent = l; lblEl.style.color = fortColor(l); }
  }

  /* ---------------- Generador (via Python) ---------------- */
  let lastGenFort = "-";
  function genPassword(len, opts) {
    if (!PY) return "";
    clog(">>> generar_contrasena(" + len + ", mayus=" + cap(opts.upper) + ", min=" + cap(opts.lower) + ", num=" + cap(opts.num) + ", simb=" + cap(opts.sym) + ")", "py");
    const r = JSON.parse(PY.generar(len, opts.upper, opts.lower, opts.num, opts.sym));
    clog('<<< "' + r.clave + '"   ->  fortaleza: ' + r.fortaleza, "res");
    lastGenFort = r.fortaleza;
    return r.clave;
  }

  /* ---------------- DOM principal ---------------- */
  const lock = $("lock"), app = $("app");
  let mode = "create";

  function refreshLockMode() {
    mode = vaultExists() ? "login" : "create";
    if (mode === "login") {
      $("lockStateTxt").textContent = "Desbloquear boveda";
      $("lblMaster").textContent = "Contrasena maestra";
      $("unlockTxt").textContent = "Desbloquear";
      $("confirmField").style.display = "none";
      $("masterMeterWrap").style.display = "none";
      $("masterMeterLbl").style.display = "none";
      $("resetLink").style.display = "inline";
    } else {
      $("lockStateTxt").textContent = "Crear boveda";
      $("lblMaster").textContent = "Define tu contrasena maestra";
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
  function openApp() { lock.style.display = "none"; app.style.display = "grid"; renderAll(); }

  function registrarAcceso(evento) {
    clog('>>> registrar_acceso(boveda, evento="' + evento + '")', "py");
    const fecha = PY.ahora();
    state.historial.push({ fecha, evento });
    clog('<<< historial.append({fecha: "' + fecha + '", evento: "' + evento + '"})', "res");
    persist();
  }

  function doUnlock() {
    const m = $("master").value;
    if (mode === "create") {
      if (m.length < 8) { lockError("La clave maestra debe tener al menos 8 caracteres."); return; }
      if (m !== $("master2").value) { lockError("Las contrasenas no coinciden."); return; }
      clog('>>> bastion.calcular_hash("' + "*".repeat(m.length) + '")', "py");
      state.hash = PY.hash(m);
      clog('<<< "' + state.hash.slice(0, 24) + '..."  (hash SHA-256)', "res");
      state.creds = []; state.historial = [];
      registrarAcceso("Boveda creada");
      openApp(); toast("Boveda creada");
    } else {
      const data = load();
      clog('>>> bastion.calcular_hash("' + "*".repeat(m.length) + '") == hash_maestra', "py");
      const ok = PY.hash(m) === data.hash_maestra;
      clog("<<< " + (ok ? "True  (acceso concedido)" : "False  (contrasena incorrecta)"), "res");
      if (!ok) { lockError("Contrasena maestra incorrecta."); $("master").value = ""; $("master").focus(); return; }
      state.hash = data.hash_maestra; state.creds = data.creds || []; state.historial = data.historial || [];
      registrarAcceso("Acceso concedido");
      openApp(); toast("Boveda desbloqueada");
    }
  }
  function lockNow() {
    state = { hash: null, creds: [], historial: [], cat: "all", q: "" };
    app.style.display = "none"; lock.style.display = "flex";
    clog("Sesion cerrada.", "info");
    refreshLockMode();
  }
  function resetVault() {
    try { localStorage.removeItem(STORE); } catch (e) {}
    refreshLockMode(); toast("Boveda borrada");
  }
  function uid() { return "c" + Date.now().toString(36) + Math.floor(Math.random() * 9999).toString(36); }

  /* ---------------- Render ---------------- */
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
      el.innerHTML = '<svg class="ci" viewBox="0 0 24 24" fill="none" stroke="' + c.color + '">' + c.icon + '</svg>' +
        '<span>' + c.name + '</span><span class="count">' + n + '</span>';
      el.onclick = () => { state.cat = c.id; renderAll(); };
      host.appendChild(el);
    });
  }
  function renderStats() {
    const all = state.creds;
    const fuertes = all.filter(c => fortOf(c.pw) === "Fuerte").length;
    const debiles = all.filter(c => fortOf(c.pw) === "Debil").length;
    const usadas = new Set(all.map(c => c.cat)).size;
    const data = [
      { k: "Credenciales", v: all.length, c: "#97F8F4", ic: ICN.grid },
      { k: "Contrasenas fuertes", v: fuertes, c: "#9DFF00", ic: '<path d="M20 6 9 17l-5-5"/>' },
      { k: "Requieren mejora", v: debiles, c: "#F0A93B", ic: '<path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>' },
      { k: "Categorias en uso", v: usadas, c: "#38BDF8", ic: ICN.trabajo }
    ];
    $("stats").innerHTML = data.map(s =>
      '<div class="stat"><div class="k"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="' + s.c + '">' + s.ic + '</svg>' + s.k + '</div><div class="v" style="color:' + s.c + '">' + s.v + '</div></div>'
    ).join("");
  }
  function renderCards() {
    const host = $("cards"); host.innerHTML = "";
    const list = filtered();
    $("viewTitle").textContent = state.cat === "all" ? "Todas las credenciales" : catName(state.cat);
    $("viewSub").textContent = state.q ? list.length + ' resultado(s) para "' + state.q + '"' : "Tu boveda local, protegida con tu clave maestra.";
    if (list.length === 0) {
      host.innerHTML = '<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' +
        '<p>' + (state.q || state.cat !== "all" ? "Sin coincidencias aqui" : "Tu boveda esta vacia") + '</p>' +
        '<span>' + (state.q || state.cat !== "all" ? "Prueba otra categoria o busqueda." : 'Usa "Agregar credencial" para guardar tu primera contrasena.') + '</span></div>';
      return;
    }
    list.forEach((c, i) => {
      const l = fortOf(c.pw);
      const avColor = AV_COLORS[Math.abs(hash(c.name)) % AV_COLORS.length];
      const masked = (PY && c.pw) ? PY.enmascarar(c.pw) : "************";
      const card = document.createElement("div");
      card.className = "card"; card.style.animationDelay = (i * 0.04) + "s";
      card.innerHTML =
        '<div class="card-top">' +
          '<div class="avatar" style="background:' + avColor + '">' + (c.name[0] || "?").toUpperCase() + '</div>' +
          '<div class="meta"><div class="name">' + esc(c.name) + '</div><div class="user">' + esc(c.user || "-") + '</div></div>' +
          '<span class="pill" style="background:' + hexA(catColor(c.cat), .15) + ';color:' + catColor(c.cat) + '">' + catName(c.cat) + '</span>' +
        '</div>' +
        '<div class="pw-row">' +
          '<span class="pw-val" data-pw data-masked="' + esc(masked) + '">' + esc(masked) + '</span>' +
          '<button class="ic-btn" data-act="show" title="Mostrar/ocultar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button>' +
          '<button class="ic-btn" data-act="copy" title="Copiar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>' +
        '</div>' +
        '<div class="card-foot">' +
          '<span class="str"><span class="bar"><span style="width:' + fortPct(l) + '%;background:' + fortColor(l) + '"></span></span>' + l + '</span>' +
          '<button class="ic-btn del" data-act="del" title="Eliminar"><svg class="icn-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>' +
        '</div>';
      const pwEl = card.querySelector("[data-pw]");
      card.querySelector('[data-act="show"]').onclick = () => {
        if (pwEl.dataset.shown === "1") { pwEl.textContent = pwEl.dataset.masked; pwEl.dataset.shown = "0"; }
        else { pwEl.textContent = c.pw; pwEl.dataset.shown = "1"; }
      };
      card.querySelector('[data-act="copy"]').onclick = () => copyText(c.pw);
      card.querySelector('[data-act="del"]').onclick = () => {
        state.creds = state.creds.filter(x => x.id !== c.id); persist(); renderAll(); toast("Credencial eliminada");
      };
      host.appendChild(card);
    });
  }
  function renderAll() { renderCats(); renderStats(); renderCards(); }

  function esc(s) { return String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
  function hash(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i) | 0; return h; }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }

  /* ---------------- Toast + copiar ---------------- */
  let toastT;
  function toast(msg) {
    $("toastTxt").textContent = msg;
    const t = $("toast"); t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }
  function copyText(txt) {
    const done = () => toast("Copiado al portapapeles");
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done).catch(() => fb(txt, done));
    else fb(txt, done);
  }
  function fb(txt, cb) {
    const ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); cb(); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------------- Modales ---------------- */
  function openModal(id) { $(id).classList.add("show"); }
  function closeModal(el) { el.classList.remove("show"); }
  document.querySelectorAll(".modal-bg").forEach(bg => {
    bg.addEventListener("click", e => { if (e.target === bg) closeModal(bg); });
    bg.querySelectorAll("[data-close]").forEach(b => b.onclick = () => closeModal(bg));
  });

  /* Generador */
  const genOpts = { upper: true, lower: true, num: true, sym: true };
  function regen() {
    const len = parseInt($("lenRange").value, 10);
    const pw = genPassword(len, genOpts);
    $("genPw").textContent = pw || "Activa al menos un tipo";
    const l = pw ? lastGenFort : "-";
    $("genMeter").style.width = fortPct(l) + "%"; $("genMeter").style.background = fortColor(l);
    $("genMeterTxt").textContent = l; $("genMeterTxt").style.color = fortColor(l);
  }
  $("lenRange").addEventListener("change", () => { regen(); });
  $("lenRange").addEventListener("input", () => { $("lenVal").textContent = $("lenRange").value; });
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
  $("genUse").onclick = () => { const t = $("genPw").textContent; if (!t || t.startsWith("Activa")) return; closeModal($("genModal")); openAddModal(t); };

  /* Agregar */
  function fillCatSelect() {
    const sel = $("addCat"); sel.innerHTML = "";
    CATS.filter(c => c.id !== "all").forEach(c => { const o = document.createElement("option"); o.value = c.id; o.textContent = c.name; sel.appendChild(o); });
  }
  function openAddModal(prefillPw) {
    $("addName").value = ""; $("addUser").value = ""; $("addPw").value = prefillPw || "";
    $("addCat").value = state.cat !== "all" ? state.cat : "social";
    paintMeter($("addMeter"), $("addPw").value, null);
    openModal("addModal"); setTimeout(() => $("addName").focus(), 50);
  }
  $("openAdd").onclick = () => openAddModal("");
  $("addPw").addEventListener("input", () => paintMeter($("addMeter"), $("addPw").value, null));
  $("addGenInline").onclick = () => { const pw = genPassword(16, { upper: true, lower: true, num: true, sym: true }); $("addPw").value = pw; paintMeter($("addMeter"), pw, null); };
  $("addSave").onclick = () => {
    const name = $("addName").value.trim(), pw = $("addPw").value;
    if (!name) { toast("Escribe el nombre del servicio"); $("addName").focus(); return; }
    if (!pw) { toast("Falta la contrasena"); $("addPw").focus(); return; }
    clog('>>> boveda["credenciales"]["' + name + '"] = {categoria, usuario, contrasena}', "py");
    state.creds.unshift({ id: uid(), name, user: $("addUser").value.trim(), pw, cat: $("addCat").value });
    clog('<<< credencial "' + name + '" guardada en el diccionario', "res");
    persist(); closeModal($("addModal")); renderAll(); toast("Guardado en la boveda");
  };

  /* Archivo / cifrado */
  let ctab = "dec";
  function renderCipher() {
    const payload = { hash_maestra: state.hash, creds: state.creds, historial: state.historial };
    const box = $("cipherOut");
    if (ctab === "dec") { box.classList.add("plain"); box.textContent = JSON.stringify(payload, null, 2); }
    else { box.classList.remove("plain"); box.textContent = encDemo(payload, state.hash || "k").replace(/(.{64})/g, "$1\n"); }
  }
  document.querySelectorAll(".ctab").forEach(t => {
    t.onclick = () => { document.querySelectorAll(".ctab").forEach(x => x.classList.remove("active")); t.classList.add("active"); ctab = t.dataset.ctab; renderCipher(); };
  });
  $("cipherBtn").onclick = () => { ctab = "dec"; document.querySelectorAll(".ctab").forEach((x, i) => x.classList.toggle("active", i === 0)); renderCipher(); openModal("cipherModal"); };

  /* Historial */
  function renderHist() {
    const host = $("histList");
    if (!state.historial.length) { host.innerHTML = '<div class="empty"><p>Sin accesos registrados.</p></div>'; return; }
    host.innerHTML = state.historial.slice().reverse().map((r) =>
      '<div class="hist-row"><span class="ev">' + esc(r.evento) + '</span><span class="fe">' + esc(r.fecha) + '</span></div>').join("");
  }
  $("histBtn").onclick = () => { clog(">>> for i, r in enumerate(boveda['historial']):  # LISTA (Unidad 4)", "py"); clog("<<< " + state.historial.length + " accesos registrados", "res"); renderHist(); openModal("histModal"); };

  /* ---------------- Lock + topbar ---------------- */
  $("master").addEventListener("input", () => { if (mode === "create") paintMeter($("masterMeter"), $("master").value, $("masterMeterTxt")); });
  $("eyeMaster").onclick = () => { const inp = $("master"); inp.type = inp.type === "password" ? "text" : "password"; };
  $("unlockBtn").onclick = doUnlock;
  $("master").addEventListener("keydown", e => { if (e.key === "Enter") { if (mode === "login") doUnlock(); else $("master2").focus(); } });
  $("master2").addEventListener("keydown", e => { if (e.key === "Enter") doUnlock(); });
  $("resetBtn").onclick = resetVault;
  $("lockNowBtn").onclick = lockNow;
  $("searchInput").addEventListener("input", e => { state.q = e.target.value; renderCards(); });
  $("consolaBar").onclick = () => $("consola").classList.toggle("abierta");
  document.addEventListener("keydown", e => { if (e.key === "Escape") document.querySelectorAll(".modal-bg.show").forEach(closeModal); });

  /* ---------------- Init ---------------- */
  fillCatSelect();
  initPy();

})();
