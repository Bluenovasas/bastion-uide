/*
  BASTION - Web App
  Ejecuta el codigo real de bastion.py dentro del navegador mediante Pyodide.
  La interfaz (presentacion) llama a las funciones de Python (logica) y guarda
  la boveda en el almacenamiento local del navegador (persistencia).
  Autor: David Alexander Benz Zambrano - UIDE 1-CIB-1A
*/

const $ = (s) => document.querySelector(s);
const CLAVE_LS = "bastion_boveda_v1";
let py = null;          // funciones de Python expuestas
let boveda = null;      // boveda en memoria
let intentos = 0;
const MAX_INTENTOS = 3;

// ---------- Consola en vivo ----------
function log(texto, clase = "info") {
  const box = $("#log");
  const div = document.createElement("div");
  div.className = "l " + clase;
  div.textContent = texto;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
function logPy(llamada) { log(">>> " + llamada, "py"); }
function logRes(valor) { log("<<< " + valor, "res"); }

// ---------- Persistencia (localStorage) ----------
function guardar() {
  localStorage.setItem(CLAVE_LS, JSON.stringify(boveda));
  log("guardar_boveda()  ->  boveda.json escrito en el navegador", "info");
}
function cargarBovedaLS() {
  const raw = localStorage.getItem(CLAVE_LS);
  return raw ? JSON.parse(raw) : null;
}

// ---------- Arranque de Pyodide ----------
async function iniciar() {
  try {
    log("Cargando Pyodide (motor de Python)...", "info");
    py = {};
    const pyodide = await loadPyodide();
    log("Pyodide listo. Importando bastion.py...", "info");

    const fuente = await (await fetch("../bastion.py")).text();
    pyodide.FS.writeFile("bastion.py", fuente);

    pyodide.runPython(`
import bastion
import json as _json
from datetime import datetime as _dt

def web_crear(clave):
    return _json.dumps({"hash_maestra": bastion.calcular_hash(clave), "credenciales": {}, "historial": []})

def web_verificar(h, clave):
    return bastion.calcular_hash(clave) == h

def web_generar(longitud, mayus, nums, simb):
    alfabeto = bastion.string.ascii_lowercase
    tipos = 1
    if mayus:
        alfabeto += bastion.string.ascii_uppercase; tipos += 1
    if nums:
        alfabeto += bastion.string.digits; tipos += 1
    if simb:
        alfabeto += "!@#$%&*?-_"; tipos += 1
    clave = "".join(bastion.random.choice(alfabeto) for _ in range(int(longitud)))
    return _json.dumps({"clave": clave, "fortaleza": bastion.calcular_fortaleza(int(longitud), tipos)})

def web_fortaleza(clave):
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

def web_categorias():
    return _json.dumps(list(bastion.CATEGORIAS))
`);

    py.crear = pyodide.globals.get("web_crear");
    py.verificar = pyodide.globals.get("web_verificar");
    py.generar = pyodide.globals.get("web_generar");
    py.fortaleza = pyodide.globals.get("web_fortaleza");
    py.enmascarar = pyodide.globals.get("web_enmascarar");
    py.ahora = pyodide.globals.get("web_ahora");
    py.categorias = pyodide.globals.get("web_categorias");

    log("bastion.py cargado. Funciones disponibles: calcular_hash, calcular_fortaleza,", "res");
    log("    generar, enmascarar, registrar_acceso, CATEGORIAS.", "res");
    $("#estado").textContent = "Python activo";
    $("#estado").classList.add("ok");

    arrancarUI();
  } catch (e) {
    $("#estado").textContent = "Error al cargar Python";
    log("ERROR: " + e.message, "err");
    log("Revisa tu conexion a internet (Pyodide se descarga la primera vez).", "warn");
  }
}

// ---------- Pantallas ----------
function mostrar(id) {
  ["#pantalla-carga", "#pantalla-bloqueo", "#app"].forEach((s) => { $(s).hidden = true; });
  $(id).hidden = false;
}

function arrancarUI() {
  boveda = cargarBovedaLS();
  if (boveda) {
    // Boveda existente: pantalla de inicio de sesion
    $("#bloqueo-titulo").textContent = "Iniciar sesion";
    $("#bloqueo-sub").textContent = "Ingrese su contrasena maestra para abrir la boveda.";
    $("#clave-2").hidden = true;
    $("#btn-bloqueo").textContent = "Entrar";
  } else {
    $("#bloqueo-titulo").textContent = "Crear boveda";
    $("#bloqueo-sub").textContent = "Defina una contrasena maestra (minimo 8 caracteres).";
    $("#clave-2").hidden = false;
    $("#btn-bloqueo").textContent = "Crear boveda";
  }
  mostrar("#pantalla-bloqueo");
  $("#clave-1").focus();
}

// ---------- Crear / iniciar sesion ----------
function accionBloqueo() {
  const c1 = $("#clave-1").value;
  const msg = $("#bloqueo-msg");
  msg.textContent = ""; msg.className = "msg";

  if (!boveda) {
    // Crear
    const c2 = $("#clave-2").value;
    if (c1.length < 8) { msg.textContent = "La contrasena maestra debe tener al menos 8 caracteres."; msg.classList.add("error"); return; }
    if (c1 !== c2) { msg.textContent = "Las contrasenas no coinciden."; msg.classList.add("error"); return; }
    logPy('bastion.calcular_hash("' + "*".repeat(c1.length) + '")');
    boveda = JSON.parse(py.crear(c1));
    logRes('"' + boveda.hash_maestra.slice(0, 24) + '..."  (hash SHA-256)');
    guardar();
    registrarAcceso("Boveda creada");
    abrirApp();
  } else {
    // Iniciar sesion
    logPy('bastion.calcular_hash("' + "*".repeat(c1.length) + '") == hash_maestra');
    const ok = py.verificar(boveda.hash_maestra, c1);
    logRes(ok ? "True  (acceso concedido)" : "False  (contrasena incorrecta)");
    if (ok) {
      intentos = 0;
      registrarAcceso("Acceso concedido");
      abrirApp();
    } else {
      intentos++;
      const rest = MAX_INTENTOS - intentos;
      if (rest <= 0) {
        msg.textContent = "Boveda bloqueada por seguridad. Recargue la pagina para reintentar.";
        msg.classList.add("error");
        $("#btn-bloqueo").disabled = true;
        log("Boveda bloqueada: demasiados intentos fallidos.", "err");
      } else {
        msg.textContent = "Contrasena incorrecta. Intentos restantes: " + rest;
        msg.classList.add("error");
      }
    }
  }
  $("#clave-1").value = ""; $("#clave-2").value = "";
}

function registrarAcceso(evento) {
  logPy('registrar_acceso(boveda, evento="' + evento + '")');
  const fecha = py.ahora();
  boveda.historial.push({ fecha, evento });
  logRes('historial.append({fecha: "' + fecha + '", evento: "' + evento + '"})');
  guardar();
}

function abrirApp() {
  $("#btn-bloquear").hidden = false;
  mostrar("#app");
  render();
}

function bloquear() {
  $("#btn-bloquear").hidden = true;
  log("Sesion cerrada.", "info");
  arrancarUI();
}

// ---------- Render principal ----------
function render() {
  const cred = boveda.credenciales;
  const nombres = Object.keys(cred);
  const cats = new Set(nombres.map((n) => cred[n].categoria));
  let fuertes = 0;

  const filtro = ($("#buscar").value || "").toLowerCase();
  const lista = $("#lista");
  lista.innerHTML = "";

  if (nombres.length === 0) {
    lista.innerHTML = '<div class="vacio">La boveda esta vacia. Genera o agrega una credencial.</div>';
  }

  nombres.forEach((nombre) => {
    const d = cred[nombre];
    const f = py.fortaleza(d.contrasena);
    if (f === "Fuerte") fuertes++;
    if (filtro && !nombre.toLowerCase().includes(filtro)) return;

    const enmasc = py.enmascarar(d.contrasena);
    const colores = { Debil: "var(--red)", Media: "var(--amber)", Fuerte: "var(--green)" };
    const anchos = { Debil: "33%", Media: "66%", Fuerte: "100%" };
    const card = document.createElement("div");
    card.className = "tarjeta";
    card.innerHTML = `
      <div class="serv">${escape(nombre)}<span class="chip">${escape(d.categoria)}</span></div>
      <div class="user">${escape(d.usuario || "-")}</div>
      <div class="clave"><span data-clave="${escape(d.contrasena)}" data-ver="0">${escape(enmasc)}</span>
        <span><button class="mini" data-toggle>ver</button> <button class="mini" data-copiar="${escape(d.contrasena)}">copiar</button></span>
      </div>
      <div class="fuerza"><span class="barra"><i style="width:${anchos[f]};background:${colores[f]}"></i></span>${f}</div>`;
    lista.appendChild(card);
  });

  $("#stat-total").textContent = nombres.length;
  $("#stat-fuertes").textContent = fuertes;
  $("#stat-cat").textContent = cats.size;
  $("#stat-acc").textContent = boveda.historial.length;
}

function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------- Modales ----------
function abrirModal(titulo, htmlCuerpo) {
  $("#modal-titulo").textContent = titulo;
  $("#modal-cuerpo").innerHTML = htmlCuerpo;
  $("#modal").hidden = false;
}
function cerrarModal() { $("#modal").hidden = true; }

function modalGenerar(prefijoServicio) {
  abrirModal("Generar contrasena segura", `
    <div class="fila"><label>Longitud: <b id="lg-val">16</b></label>
      <input id="lg" type="range" min="8" max="64" value="16" style="width:60%"></div>
    <div class="fila"><label><input id="op-may" type="checkbox" checked> Mayusculas</label>
      <label><input id="op-num" type="checkbox" checked> Numeros</label>
      <label><input id="op-sim" type="checkbox" checked> Simbolos</label></div>
    <button id="gen-go" class="btn primario">Generar con Python</button>
    <div id="gen-out" hidden>
      <div class="salida" id="gen-clave"></div>
      <div class="fuerza"><span class="barra"><i id="gen-barra"></i></span><span id="gen-fz"></span></div>
      <button id="gen-guardar" class="btn">Guardar en una credencial</button>
    </div>`);
  $("#lg").addEventListener("input", (e) => { $("#lg-val").textContent = e.target.value; });
  $("#gen-go").addEventListener("click", () => {
    const lg = +$("#lg").value, may = $("#op-may").checked, num = $("#op-num").checked, sim = $("#op-sim").checked;
    logPy(`generar_contrasena(${lg}, mayus=${cap(may)}, numeros=${cap(num)}, simbolos=${cap(sim)})`);
    const r = JSON.parse(py.generar(lg, may, num, sim));
    logRes(`"${r.clave}"   ->  fortaleza: ${r.fortaleza}`);
    const colores = { Debil: "var(--red)", Media: "var(--amber)", Fuerte: "var(--green)" };
    const anchos = { Debil: "33%", Media: "66%", Fuerte: "100%" };
    $("#gen-clave").textContent = r.clave;
    $("#gen-fz").textContent = r.fortaleza;
    $("#gen-barra").style.width = anchos[r.fortaleza];
    $("#gen-barra").style.background = colores[r.fortaleza];
    $("#gen-out").hidden = false;
    $("#gen-guardar").onclick = () => modalAgregar(r.clave);
  });
}

function modalAgregar(clavePrefill) {
  const cats = JSON.parse(py.categorias());
  const ops = cats.map((c, i) => `<option value="${escape(c)}">${escape(c)}</option>`).join("");
  abrirModal("Agregar credencial", `
    <input id="ag-serv" class="input" placeholder="Nombre del servicio (ej: Instagram)">
    <select id="ag-cat" class="input">${ops}</select>
    <input id="ag-user" class="input" placeholder="Usuario o correo">
    <input id="ag-clave" class="input" placeholder="Contrasena" value="${clavePrefill ? escape(clavePrefill) : ""}">
    <p id="ag-msg" class="msg"></p>
    <button id="ag-go" class="btn primario">Guardar credencial</button>`);
  $("#ag-go").addEventListener("click", () => {
    const serv = $("#ag-serv").value.trim();
    const m = $("#ag-msg");
    if (!serv) { m.textContent = "El nombre del servicio es obligatorio."; m.className = "msg error"; return; }
    const cat = $("#ag-cat").value, user = $("#ag-user").value.trim(), clave = $("#ag-clave").value;
    if (!clave) { m.textContent = "La contrasena no puede quedar vacia."; m.className = "msg error"; return; }
    logPy(`boveda["credenciales"]["${serv}"] = {categoria, usuario, contrasena}`);
    boveda.credenciales[serv] = { categoria: cat, usuario: user, contrasena: clave };
    logRes(`credencial "${serv}" guardada en el diccionario`);
    guardar();
    cerrarModal();
    render();
  });
}

function modalHistorial() {
  const h = boveda.historial;
  logPy("for i, registro in enumerate(boveda['historial']):  # LISTA (Unidad 4)");
  logRes(`${h.length} accesos registrados`);
  const filas = h.length === 0
    ? '<div class="vacio">Sin accesos registrados.</div>'
    : h.map((r, i) => `<div class="hist-fila"><span class="ev">${i + 1}. ${escape(r.evento)}</span><span class="fe">${escape(r.fecha)}</span></div>`).join("");
  abrirModal("Historial de accesos", `<div class="hist">${filas}</div>`);
}

function cap(b) { return b ? "True" : "False"; }

// ---------- Eventos ----------
document.addEventListener("click", (e) => {
  const t = e.target;
  if (t.id === "btn-bloqueo") accionBloqueo();
  else if (t.id === "btn-bloquear") bloquear();
  else if (t.id === "modal-x" || t.id === "modal") cerrarModal();
  else if (t.dataset && t.dataset.accion === "generar") modalGenerar();
  else if (t.dataset && t.dataset.accion === "agregar") modalAgregar();
  else if (t.dataset && t.dataset.accion === "historial") modalHistorial();
  else if (t.hasAttribute && t.hasAttribute("data-toggle")) {
    const span = t.closest(".clave").querySelector("[data-clave]");
    const ver = span.getAttribute("data-ver") === "1";
    span.textContent = ver ? py.enmascarar(span.getAttribute("data-clave")) : span.getAttribute("data-clave");
    span.setAttribute("data-ver", ver ? "0" : "1");
    t.textContent = ver ? "ver" : "ocultar";
  } else if (t.hasAttribute && t.hasAttribute("data-copiar")) {
    navigator.clipboard && navigator.clipboard.writeText(t.getAttribute("data-copiar"));
    t.textContent = "copiado";
    setTimeout(() => { t.textContent = "copiar"; }, 1200);
  }
});
$("#clave-1").addEventListener("keydown", (e) => { if (e.key === "Enter") accionBloqueo(); });
$("#clave-2").addEventListener("keydown", (e) => { if (e.key === "Enter") accionBloqueo(); });
$("#buscar").addEventListener("input", render);

// Arrancar
iniciar();
