# BASTION - Boveda Personal de Credenciales

Proyecto Integrador - Logica de Programacion - UIDE

> Tema del proyecto integrador: **El impacto de las nuevas tecnologias en la
> sociedad: desarrollo y proyeccion de soluciones informaticas.**

## Demo en vivo

La aplicacion funciona en el navegador: el codigo real de `bastion.py` se ejecuta
con Pyodide (Python sobre WebAssembly), sin servidor. La profe puede entrar,
usarla y ver en el panel "Consola Python" lo que ocurre por dentro.

**https://bluenovasas.github.io/bastion-uide/webapp/**

## Datos del proyecto

| Campo | Valor |
|-------|-------|
| Nombre del proyecto | BASTION - Boveda Personal de Credenciales |
| Integrante | David Alexander Benz Zambrano (trabajo individual) |
| Cedula | 1726678673 |
| Correo institucional | dabezza@uide.edu.ec |
| Materia | Logica de Programacion |
| Docente | Msc. Lilian Aman |
| Carrera | Ingenieria en Ciberseguridad |
| Universidad | Universidad Internacional del Ecuador (UIDE) |
| Paralelo | 1-CIB-1A |
| Fecha de entrega | 28 de junio de 2026 |

## Objetivo del sistema

Desarrollar una solucion informatica de gestion personal de credenciales que
centralice y proteja las contrasenas del usuario en un entorno local, aplicando
las estructuras de programacion y los fundamentos de seguridad vistos en las
cuatro unidades de la asignatura. BASTION genera contrasenas seguras, las
organiza por categorias y las resguarda en una boveda local protegida por una
contrasena maestra cuyo hash se almacena con SHA-256, sin depender de la nube.

## Descripcion de funcionalidades

| Funcionalidad | Descripcion |
|---------------|-------------|
| Crear boveda | Define la contrasena maestra y crea la boveda local |
| Iniciar sesion | Valida la contrasena maestra (maximo 3 intentos y bloqueo) |
| Generar contrasena | Crea una clave segura segun longitud y tipos de caracteres, con indicador de fortaleza |
| Agregar credencial | Registra un servicio con su categoria, usuario y contrasena |
| Buscar credencial | Localiza una credencial por nombre, sin distinguir mayusculas |
| Ver credenciales | Lista todas las credenciales con la contrasena enmascarada |
| Cambiar contrasena maestra | Sustituye la clave maestra previa validacion |
| Ver historial de accesos | Lista los accesos registrados con su fecha y hora |

## Contenido del repositorio

| Carpeta / archivo | Contenido |
|-------------------|-----------|
| [`bastion.py`](bastion.py) | Codigo fuente completo del sistema (Python) |
| [`webapp/`](webapp/) | Aplicacion web funcional (ejecuta bastion.py con Pyodide) |
| [`documento/`](documento/) | Documento del proyecto en PDF |
| [`presentacion/`](presentacion/) | Presentacion final (PowerPoint y PDF) |
| [`diagramas/`](diagramas/) | Diagramas de funcionalidad (casos de uso, flujo) y de arquitectura |
| [`prototipo/`](prototipo/) | Prototipo de interfaz de alta fidelidad (HTML, CSS y JS) |
| [`autonomos/`](autonomos/) | Aprendizajes autonomos del periodo, en carpetas |
| [`videos/`](videos/) | Enlaces a los videos explicativos (Loom) |

## Documento del proyecto

El documento completo (introduccion, descripcion del problema, relacion con los
contenidos de la asignatura, explicacion del sistema, reflexion sobre el impacto
de la tecnologia, cronograma y conclusiones) esta en:
[`documento/Proyecto_Integrador_BASTION.pdf`](documento/Proyecto_Integrador_BASTION.pdf)

## Estructuras de programacion aplicadas

| Estructura | Donde se aplica |
|------------|-----------------|
| while con contador (intentos) | Funcion de inicio de sesion |
| while True con break | Menus e iteraciones de validacion |
| for con range() | Generacion de contrasena caracter por caracter |
| for con .items() | Busqueda y listado de credenciales |
| if / elif / else | Menus, validaciones y calculo de fortaleza |
| Diccionarios | Categorias y almacenamiento de credenciales |
| Operadores relacionales y logicos | Validaciones (and, or, not, in) |
| Contadores (+=) | Conteo de intentos, tipos y credenciales |
| Tuplas | Categorias predefinidas (CATEGORIAS) |
| Listas | Historial de accesos con fecha y hora |
| Funciones con parametros por defecto | registrar_acceso, pedir_entero |

## Como ejecutar

```
python3 bastion.py
```

No requiere instalar dependencias externas: usa solo la biblioteca estandar de Python.

## Videos del entregable

| Video | Contenido | Duracion | Enlace |
|-------|-----------|----------|--------|
| Video 0 | Explicacion general del repositorio y el prototipo | 2:13 min | https://www.loom.com/share/730d6ef14cd249f590bf2939a9e092c6 |
| Video 1 | Explicacion del diagrama de flujo en Raptor | 2:41 min | https://www.loom.com/share/6bcada5da58e4e4c9ea3d76b6f34dff9 |
| Video 2 | Demostracion del codigo Python en funcionamiento | 4:24 min | https://www.loom.com/share/a2bdcf658b0049ec8ab9f98a79a68b6f |

Los videos se alojan en Loom para no superar el limite de 100 MB por archivo de GitHub.

## Licencia

MIT License - David Alexander Benz Zambrano - 2026
