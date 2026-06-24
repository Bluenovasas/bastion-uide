# BASTION - Boveda Personal de Credenciales

Aprendizaje Autonomo 2 - Logica de Programacion

## Datos academicos

| Campo | Valor |
|-------|-------|
| Autor | David Alexander Benz Zambrano |
| Cedula | 1726678673 |
| Materia | Logica de Programacion |
| Docente | Msc. Lilian Aman |
| Carrera | Ingenieria en Ciberseguridad |
| Universidad | Universidad Internacional del Ecuador (UIDE) |
| Paralelo | 1-CIB-1A |
| Semana | 6 - Bucles (while y for) |
| Fecha de entrega | 21 de junio de 2026 |

## Descripcion del proyecto

BASTION es una boveda personal de credenciales desarrollada en Python que permite
a un usuario generar contrasenas seguras y almacenarlas localmente, protegidas por
una contrasena maestra. El proyecto fue disenado en el Aprendizaje Autonomo 1 y se
implementa en este Aprendizaje Autonomo 2 aplicando las estructuras repetitivas
(bucles while y for) y de seleccion (if / elif / else) vistas en clase.

En esta version academica, la contrasena maestra se protege con un hash SHA-256 y
las credenciales se guardan en un archivo JSON local (`boveda.json`), sin envio a
ningun servidor. El cifrado autenticado AES-256-GCM descrito en el diseno del
Autonomo 1 queda planificado como evolucion del producto.

## Arquitectura

El programa esta organizado en 3 capas, segun el diseno del Autonomo 1:

1. Capa de presentacion: menus de texto e interaccion con el usuario (CLI).
2. Capa de logica de negocio: generador de contrasenas, validaciones y bucles.
3. Capa de almacenamiento: archivo JSON local con el hash SHA-256 de la
   contrasena maestra.

## Estructuras de programacion aplicadas

| Estructura | Donde se aplica |
|------------|-----------------|
| while con contador (intentos) | Funcion de inicio de sesion |
| while True con break | Menus e iteraciones de validacion |
| for con range() | Generacion de contrasena caracter por caracter |
| for con .items() | Busqueda y listado de credenciales |
| if / elif / else | Menus, validaciones y calculo de fortaleza |
| Diccionarios | Categorias y almacenamiento de credenciales |
| Operadores relacionales | Validacion de longitudes y coincidencias |
| Operadores logicos | and, or, not e in en validaciones |
| Contadores (+=) | Conteo de intentos, tipos y credenciales |

## Como ejecutar

```
python3 bastion.py
```

No requiere instalar dependencias externas: usa solo la biblioteca estandar de Python.

## Prototipo de interfaz

La carpeta `prototipo/` contiene la maqueta de alta fidelidad de la pantalla
principal de BASTION (HTML, CSS y JavaScript), disenada en el Aprendizaje
Autonomo 1. Para verla, descargue la carpeta y abra `prototipo/index.html` con
doble clic en el navegador. Mas detalles en `prototipo/README.md`.

## Estructura del repositorio

```
bastion-uide/
├── bastion.py     Codigo fuente principal
├── README.md      Documentacion del proyecto
├── LICENSE        Licencia MIT
├── .gitignore     Exclusiones de Git
├── prototipo/     Prototipo de interfaz de alta fidelidad (HTML, CSS y JS)
│   ├── index.html
│   ├── estilos.css
│   ├── script.js
│   └── README.md
├── docs/          Diagrama de flujo en Raptor
│   └── bastion_diagrama.rap
└── videos/        Videos explicativos del entregable
    ├── video1_diagrama_flujo.mp4
    └── video2_codigo_funcional.mp4
```

## Casos de uso implementados

| Caso de uso | Descripcion |
|-------------|-------------|
| CU-01 | Crear boveda nueva con contrasena maestra |
| CU-02 | Iniciar sesion (desbloquear boveda) |
| CU-03 | Generar contrasena segura |
| CU-04 | Agregar credencial a la boveda |
| CU-06 | Buscar credencial por nombre |
| CU-07 | Ver todas las credenciales organizadas |

## Videos del entregable

> Nota para la evaluacion: los videos del entregable se entregan como enlaces y
> no como archivos subidos al repositorio. GitHub limita el tamano de cada
> archivo a 100 MB y los videos lo superan, por lo que se alojan en Loom y se
> enlazan a continuacion. Cada enlace se abre directamente desde el navegador,
> sin necesidad de iniciar sesion.

| Video | Contenido | Enlace |
|-------|-----------|--------|
| Video 0 | Explicacion general del repositorio y el prototipo | https://www.loom.com/share/730d6ef14cd249f590bf2939a9e092c6 |
| Video 1 | Explicacion del diagrama de flujo en Raptor | https://www.loom.com/share/6bcada5da58e4e4c9ea3d76b6f34dff9 |
| Video 2 | Demostracion del codigo Python en funcionamiento | https://www.loom.com/share/a2bdcf658b0049ec8ab9f98a79a68b6f |

## Licencia

MIT License - David Alexander Benz Zambrano - 2026
