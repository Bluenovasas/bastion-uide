## Guion Video 2: La presentacion de BASTION, diapositiva por diapositiva

Duracion objetivo: 5 a 7 minutos. Voz en primera persona (David). Reparto aproximado: 11 diapositivas en unos 6 minutos, alrededor de 30 a 40 segundos por diapositiva.

---

### Diapositiva 1 - Portada (0:00 - 0:30)

**En pantalla:** Portada con el logo de la UIDE, el titulo "BASTION" en dorado, el subtitulo "Boveda de credenciales con generador de contrasenas seguras", y los datos del estudiante: David Alexander Benz Zambrano, Ingenieria en Ciberseguridad, paralelo 1-CIB-1A, asignatura Logica de Programacion con la docente Msc. Lilian Aman.

**Narracion sugerida:** "Hola, soy David Benz, estudiante de Ingenieria en Ciberseguridad en la UIDE. En este video voy a explicar, diapositiva por diapositiva, la presentacion de mi proyecto integrador llamado BASTION. BASTION es una boveda personal de credenciales con un generador de contrasenas seguras, desarrollada para la asignatura de Logica de Programacion. La idea es recorrer juntos toda la presentacion para que se entienda que problema resuelve y como esta construido."

---

### Diapositiva 2 - El problema (0:30 - 1:05)

**En pantalla:** Diapositiva "El problema: demasiadas claves, mal gestionadas", con tres tarjetas: reutilizacion de la misma contrasena, claves debiles faciles de romper, y credenciales guardadas en texto plano.

**Narracion sugerida:** "Hoy todos manejamos decenas de cuentas, y eso genera tres malos habitos que aqui resumo. Primero, reutilizar la misma clave en muchos sitios, asi una sola filtracion compromete todo. Segundo, usar contrasenas cortas y predecibles, faciles de romper por fuerza bruta o diccionario. Y tercero, anotar las credenciales en notas o archivos sin cifrar. Estos tres problemas son exactamente los que el diseno de BASTION busca corregir."

---

### Diapositiva 3 - La solucion BASTION (1:05 - 1:40)

**En pantalla:** Diapositiva "La solucion: que es BASTION", con la definicion del gestor y tarjetas de generador seguro, boveda cifrada, almacenamiento 100% local y organizacion por categorias.

**Narracion sugerida:** "BASTION es un gestor personal de credenciales que hace dos cosas: genera contrasenas robustas y las custodia en una boveda local, accesible con una sola contrasena maestra. Trabaja completamente en el equipo, sin nube, lo que reduce la superficie de ataque. Ademas organiza las credenciales por categorias para encontrarlas rapido. En resumen, ataca de frente los tres problemas de la diapositiva anterior."

---

### Diapositiva 4 - Arquitectura en tres capas (1:40 - 2:20)

**En pantalla:** Diapositiva de la arquitectura en tres capas: capa de presentacion (consola o web), capa de logica de negocio (bastion.py con generador, validaciones y gestor de credenciales) y capa de persistencia (archivo local).

**Narracion sugerida:** "El sistema esta organizado en tres capas bien separadas. La capa de presentacion es la interfaz, ya sea la consola o la version web. La capa de logica de negocio es el corazon, el archivo bastion.py, donde viven el generador, las validaciones y el gestor de credenciales. Y la capa de persistencia es el almacenamiento local en un archivo. Esta separacion me permite cambiar la interfaz sin tocar la logica ni la forma de guardar los datos."

---

### Diapositiva 5 - Funcionalidades del sistema, casos de uso (2:20 - 3:00)

**En pantalla:** Diapositiva de funcionalidades con el diagrama de casos de uso: un unico actor, el Usuario, conectado a crear boveda, desbloquear boveda, generar contrasena, agregar credencial, buscar credencial y ver la boveda organizada.

**Narracion sugerida:** "Aqui se ven las funcionalidades como casos de uso, todos iniciados por un unico actor, el Usuario. El usuario puede crear la boveda, desbloquearla con la clave maestra, generar una contrasena, agregar una credencial, buscarla y ver toda la boveda organizada. Lo interesante es que algunas funciones reutilizan a otras: agregar una credencial reutiliza el generador, y ver la boveda reutiliza la busqueda. Eso evita repetir codigo."

---

### Diapositiva 6 - Integracion de las cuatro unidades (3:00 - 3:40)

**En pantalla:** Diapositiva que resume como el proyecto integra las cuatro unidades de la asignatura: U1 analisis y diagramas; U2 GitHub y tipos de datos; U3 bucles y condicionales; U4 tuplas, listas y funciones.

**Narracion sugerida:** "Esta diapositiva muestra que BASTION no es un ejercicio suelto, sino la integracion de las cuatro unidades del curso. En la unidad uno hice el analisis y los diagramas. En la dos publique el codigo en GitHub y use los tipos de datos basicos. En la tres aplique los bucles while y for junto con los condicionales. Y en la cuatro sume tuplas, listas y funciones con parametros. Todo el temario de la materia esta vivo dentro de este unico proyecto."

---

### Diapositiva 7 - El codigo en accion (3:40 - 4:25)

**En pantalla:** Diapositiva "El codigo en accion" con fragmentos de bastion.py: el while con contador de intentos en el login, el for con range() del generador, el for con .items() para listar credenciales, y la tupla CATEGORIAS con la lista de historial.

**Narracion sugerida:** "Esta es la parte tecnica que mas me gusta. El inicio de sesion usa un while con un contador que limita a maximo tres intentos. El generador arma la contrasena con un for con range, eligiendo cada caracter con la libreria secrets, que da aleatoriedad criptograficamente segura. Para listar y buscar uso un for con punto items sobre los diccionarios. Y para organizar tengo una tupla fija de categorias y una lista que guarda el historial. Cada estructura cumple un proposito concreto, no esta de adorno."

---

### Diapositiva 8 - Reflexion sobre el impacto de la tecnologia (4:25 - 5:00)

**En pantalla:** Diapositiva de reflexion sobre el impacto de la tecnologia y la responsabilidad de gestionar credenciales de forma segura.

**Narracion sugerida:** "Mas alla del codigo, quiero reflexionar un momento. La gestion de credenciales es una responsabilidad real: detras de cada contrasena hay datos, dinero y privacidad de personas. Construir herramientas de seguridad implica un compromiso etico de proteger al usuario y no exponerlo. Para mi, como futuro ingeniero en ciberseguridad, BASTION es una practica de ese principio: la tecnologia bien hecha deberia cuidar a las personas, no ponerlas en riesgo."

---

### Diapositiva 9 - Conclusiones y limitaciones (5:00 - 5:35)

**En pantalla:** Diapositiva de conclusiones y limitaciones: lo que se logro como version academica y lo que queda planificado, como el cifrado autenticado y el doble factor.

**Narracion sugerida:** "En conclusiones, BASTION cumple su objetivo: genera contrasenas seguras, las almacena de forma local y protege el acceso con una clave maestra mediante hash SHA-256. Tambien soy honesto con las limitaciones: esta es una version academica, asi que el cifrado autenticado completo y el doble factor quedan planificados como evolucion del producto. Reconocer lo que falta es parte de un buen diseno de ingenieria."

---

### Diapositiva 10 - La aplicacion web en vivo (5:35 - 6:05)

**En pantalla:** Diapositiva de la aplicacion web en vivo, con la captura de la interfaz y la direccion de la demo publicada en GitHub Pages.

**Narracion sugerida:** "Para que no se quede solo en teoria, publique una demo web en vivo. Esta version corre el mismo bastion.py dentro del navegador gracias a Pyodide, asi que cualquiera puede probar el generador y la boveda sin instalar nada. La demo esta en GitHub Pages y mantiene la identidad visual de Blue Nova, con el azul y el cyan sobre fondo navy. Es la prueba de que el diseno funciona de verdad."

---

### Diapositiva 11 - Gracias y cierre (6:05 - 6:30)

**En pantalla:** Diapositiva de cierre con el agradecimiento, el nombre del autor David Alexander Benz Zambrano y la referencia al repositorio del proyecto.

**Narracion sugerida:** "Con esto cierro el recorrido por la presentacion de BASTION. Gracias por acompanarme en esta explicacion diapositiva por diapositiva. El proyecto, el codigo y la documentacion estan disponibles en el repositorio, con los commits firmados. Soy David Benz, y este ha sido mi proyecto integrador de Logica de Programacion. Muchas gracias."
