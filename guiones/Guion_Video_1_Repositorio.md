## Video 1 - Guion: Explicacion del repositorio y del proyecto BASTION

Duracion objetivo: 4 a 6 minutos. Tono profesional y claro. Narracion en primera persona, voz de David.

---

### Escena 1 - Introduccion (0:00 - 0:40)

**En pantalla:**
Plano inicial con la identidad visual de Blue Nova (azul y cyan sobre fondo navy). Aparece el titulo "BASTION - Boveda Personal de Credenciales" y, debajo, los datos academicos: David Alexander Benz Zambrano, Blue Nova SAS, UIDE, Ingenieria en Ciberseguridad, Logica de Programacion (Msc. Lilian Aman), paralelo 1-CIB-1A. Transicion suave hacia el navegador.

**Narracion sugerida:**
"Hola, soy David Benz. En este primer video les presento BASTION, mi proyecto integrador de Logica de Programacion. BASTION es una boveda personal de credenciales: genera contrasenas seguras, las organiza por categorias y las protege detras de una unica contrasena maestra. Lo desarrolle de forma individual bajo Blue Nova SAS, para la carrera de Ingenieria en Ciberseguridad de la UIDE, paralelo 1-CIB-1A, con la docente Msc. Lilian Aman. Vamos a recorrer el repositorio completo para ver como esta organizado todo el trabajo."

---

### Escena 2 - Portada del repositorio y README (0:40 - 1:45)

**En pantalla:**
Navegador abriendo github.com/Bluenovasas/bastion-uide. Se muestra la portada del README: el titulo, la linea "Proyecto Integrador - Logica de Programacion - UIDE" y la fila de badges (Demo en vivo, Python 3, JavaScript ES6, Pyodide WebAssembly, License MIT). Hacer scroll hasta el bloque "Demo en vivo" con el enlace destacado y bajar a la captura del dashboard.

**Narracion sugerida:**
"Este es el repositorio en GitHub, bajo la cuenta Bluenovasas. Lo primero que vemos es el README, que funciona como portada del proyecto. Arriba estan los badges que resumen el stack: Python 3, JavaScript, Pyodide sobre WebAssembly y licencia MIT, ademas del badge de la demo en vivo. Justo aqui esta el enlace a la aplicacion funcionando en el navegador, en bluenovasas.github.io barra bastion-uide barra webapp. Y un poco mas abajo se ve la captura del dashboard de BASTION, con la identidad visual de Blue Nova: azul y cyan sobre fondo navy. Quien entre al repositorio entiende en segundos de que trata el proyecto y puede probarlo sin instalar nada."

---

### Escena 3 - Recorrido por las carpetas (1:45 - 3:35)

**En pantalla:**
Volver al inicio del repositorio, a la vista de archivos y carpetas. Ir senalando cada elemento de la lista mientras se nombra: bastion.py, y las carpetas webapp, documento, presentacion, manuales, diagramas, prototipo, autonomos, videos y capturas. Opcionalmente abrir un par de carpetas (por ejemplo webapp y manuales) para mostrar su contenido.

**Narracion sugerida:**
"Ahora recorramos la estructura del repositorio carpeta por carpeta. En la raiz esta bastion.py, el codigo fuente del sistema, escrito en Python con la biblioteca estandar. La carpeta webapp contiene la aplicacion web completa: el index.html con la interfaz, styles.css con los estilos de Blue Nova, app.js que integra la logica con Pyodide, y el favicon. En documento esta el informe del proyecto en PDF, en formato APA. La carpeta presentacion guarda las diapositivas finales en PowerPoint y en PDF. En manuales encontramos el Manual de Usuario, el Manual Tecnico y el Guion del video. La carpeta diagramas reune los casos de uso, el diagrama de arquitectura y el flujo hecho en Raptor. En prototipo esta el prototipo de interfaz de alta fidelidad. La carpeta autonomos contiene los dos aprendizajes autonomos del periodo. En videos estan los enlaces de Loom a los videos explicativos. Y en capturas guardo las imagenes de la aplicacion, como las que aparecen en el README. Cada carpeta tiene un proposito claro, para que cualquier persona encuentre rapido lo que busca."

---

### Escena 4 - Commits firmados con GPG (3:35 - 4:25)

**En pantalla:**
Abrir el historial de commits del repositorio. Mostrar la lista con la etiqueta "Verified" en verde junto a cada commit. Hacer clic en un commit y, opcionalmente, abrir el detalle de la firma para mostrar que la firma GPG es valida.

**Narracion sugerida:**
"Un detalle importante de calidad y seguridad es que todos los commits del repositorio estan firmados con GPG. Si entramos al historial, cada commit muestra la etiqueta Verified en verde. Esto significa que GitHub comprobo la firma criptografica y confirma que esos cambios fueron hechos realmente por mi y no fueron alterados. Para un proyecto de Ciberseguridad esto no es un adorno: es la misma idea de integridad y autenticidad que aplicamos dentro de BASTION, ahora aplicada al control de versiones del proyecto."

---

### Escena 5 - Integracion de las cuatro unidades (4:25 - 5:25)

**En pantalla:**
Volver al README, a la tabla "Estructuras de programacion (integracion de las 4 unidades)". Ir resaltando cada fila de la tabla mientras se explica: Unidad 1, Unidad 2, Unidad 3 y Unidad 4.

**Narracion sugerida:**
"BASTION no es solo codigo: integra de forma intencional las cuatro unidades de la asignatura, y esto se ve resumido en esta tabla del README. La Unidad 1, analisis y diagramas, esta en los casos de uso, el flujo en Raptor y la arquitectura en tres capas. La Unidad 2, entorno y tipos de datos, aparece en el uso de GitHub y en las variables de tipo str, int y bool. La Unidad 3, que es el corazon del proyecto, aporta los bucles while con contador, los for con range y con items, las decisiones if elif else, los operadores y los contadores con mas igual. Y la Unidad 4, datos y funciones, se refleja en la tupla CATEGORIAS, la lista del historial y las funciones con parametros por defecto. Ademas, la seguridad se apoya en el hash SHA-256 de la maestra, en la generacion de contrasenas con el modulo secrets y en el login con maximo tres intentos."

---

### Escena 6 - Cierre e invitacion a los otros videos (5:25 - 6:00)

**En pantalla:**
Volver a la portada del README o al dashboard de la aplicacion. Sobreimpresion con el nombre del autor y una llamada a los siguientes videos: "Video 2 - Diapositivas" y "Video 3 - Funcionamiento". Cierre con el logo de Blue Nova y la UIDE.

**Narracion sugerida:**
"Con esto cerramos el recorrido por el repositorio de BASTION. Ya vieron como esta organizado todo el proyecto: el codigo, la aplicacion web, los documentos, los manuales, los diagramas y la evidencia de las cuatro unidades. Los invito a ver los otros dos videos: en el siguiente recorro las diapositivas de la presentacion, y en el ultimo muestro la aplicacion funcionando en vivo, generando y guardando credenciales. Gracias por acompanarme, soy David Benz, y este ha sido BASTION."

---

### Resumen de tiempos

| Escena | Contenido | Tiempo |
|--------|-----------|--------|
| 1 | Introduccion (autor y proyecto) | 0:00 - 0:40 |
| 2 | Portada del README, badges, demo y dashboard | 0:40 - 1:45 |
| 3 | Recorrido por las carpetas | 1:45 - 3:35 |
| 4 | Commits firmados con GPG (Verified) | 3:35 - 4:25 |
| 5 | Integracion de las cuatro unidades | 4:25 - 5:25 |
| 6 | Cierre e invitacion a los otros videos | 5:25 - 6:00 |