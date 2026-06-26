# BASTION Web - aplicacion funcional

Version web de BASTION. La interfaz se ejecuta en el navegador y el codigo real
de `bastion.py` corre con Pyodide (Python compilado a WebAssembly). No hay
servidor: todo ocurre en el navegador del usuario y la boveda se guarda en el
almacenamiento local.

## Demo en vivo

https://bluenovasas.github.io/bastion-uide/webapp/

## Como funciona (las tres capas)

- Capa de presentacion: la interfaz en HTML, CSS y JavaScript.
- Capa de logica: `bastion.py`, ejecutado con Pyodide. El hash SHA-256, la
  generacion de contrasenas, el calculo de fortaleza y el enmascarado los realiza
  el mismo codigo Python del proyecto.
- Capa de persistencia: el almacenamiento local del navegador (la boveda en JSON).

El panel "Consola Python" muestra en vivo cada llamada a Python y su resultado,
para evidenciar que la logica corre realmente en Python.

## Archivos

| Archivo | Contenido |
|---------|-----------|
| `index.html` | Estructura de la interfaz |
| `styles.css` | Estilos |
| `app.js` | Carga de Pyodide, llamadas a bastion.py y logica de la interfaz |
