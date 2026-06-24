# Prototipo de interfaz de BASTION

Prototipo de alta fidelidad de la pantalla principal de BASTION, disenado en el
Aprendizaje Autonomo 1. Materializa la boveda con credenciales organizadas por
categorias, buscador, indicadores de fortaleza y accesos directos para generar
una contrasena o agregar una entrada.

Es una maqueta visual e interactiva en el navegador (HTML, CSS y JavaScript). No
guarda datos reales: carga una boveda de ejemplo para demostrar el diseno.

## Archivos

| Archivo | Contenido |
|---------|-----------|
| `index.html` | Estructura de la pagina (HTML) |
| `estilos.css` | Hoja de estilos (CSS) |
| `script.js` | Logica de la maqueta (JavaScript) |

## Como abrirlo

Opcion 1 (la mas simple): descargar esta carpeta y abrir `index.html` con doble
clic. Se abre en el navegador sin instalar nada.

Opcion 2 (servidor local), util si el navegador bloquea archivos locales:

```
cd prototipo
python3 -m http.server 8000
```

Luego abrir en el navegador: `http://localhost:8000`

## Nota

El prototipo usa tipografias de Google Fonts. Con conexion a internet se ven las
fuentes del diseno; sin conexion el navegador usa fuentes alternativas y el
prototipo sigue funcionando.
