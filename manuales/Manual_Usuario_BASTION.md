## Que es BASTION y para que sirve

BASTION es una boveda personal de contrasenas. Piensa en ella como una caja fuerte digital donde guardas, en un solo lugar y de forma ordenada, todas las claves que usas a diario: redes sociales, banco, correo, trabajo y mas.

Para abrir esa caja fuerte solo necesitas recordar una clave: la contrasena maestra. Una vez dentro, BASTION te ayuda a:

- Crear contrasenas nuevas y seguras con un solo clic.
- Guardar cada clave junto con su servicio, usuario y categoria.
- Buscar rapidamente la clave que necesitas.
- Ver todo tu listado con las contrasenas tapadas, para que nadie las lea por encima de tu hombro.

Lo mejor: tus datos se quedan en tu equipo o en tu navegador. No viajan a internet ni a ninguna nube.

## Requisitos

Para usar la version web solo necesitas:

- Un navegador moderno (Chrome, Edge, Firefox, Safari o similar).
- Conexion a internet la primera vez, para que la pagina cargue su motor. Despues puedes seguir usandola aunque te quedes sin internet.

No hay que instalar nada ni crear ninguna cuenta.

## Como abrir la aplicacion web

1. Abre tu navegador de siempre.
2. Escribe o pega esta direccion en la barra de arriba:

   `https://bluenovasas.github.io/bastion-uide/webapp/`

3. Presiona Enter y espera unos segundos a que cargue. Listo, ya estas en BASTION.

Consejo: guarda esa direccion en tus favoritos para entrar mas rapido la proxima vez.

## Paso a paso de cada tarea

### 1. Crear tu boveda por primera vez

La primera vez que entras, la boveda esta vacia y BASTION te pide crear tu contrasena maestra.

1. En el campo de la contrasena maestra, escribe una clave que sea facil de recordar para ti pero dificil de adivinar para otros (minimo 8 caracteres).
2. Vuelve a escribirla en el campo de confirmacion para asegurar que no hubo un error de tipeo.
3. Pulsa el boton para crear y entrar.

Importante: BASTION nunca guarda tu contrasena maestra tal cual. Guarda solo una huella matematica de ella (un hash). Por eso, si la olvidas, nadie podra recuperarla, ni siquiera tu.

### 2. Iniciar sesion

Cuando ya tienes una boveda creada, cada vez que abras BASTION solo tienes que desbloquearla.

1. Escribe tu contrasena maestra en el campo que aparece.
2. Pulsa el boton para entrar.
3. Si la clave es correcta, se abre tu boveda con todas tus credenciales.

Tienes un maximo de 3 intentos. Si te equivocas tres veces, la boveda se bloquea por seguridad y debes volver a abrir la aplicacion para reintentar. Esto protege tus datos de quien intente adivinar tu clave.

### 3. Usar la opcion "Mostrar contrasena"

Cuando escribes una clave, normalmente aparece tapada con puntos para que nadie la vea. Si quieres comprobar que la escribiste bien:

1. Busca la casilla o el boton "Mostrar contrasena" junto al campo donde escribes.
2. Actívalo y veras el texto real de lo que escribiste.
3. Vuelve a desactivarlo cuando termines, para taparla de nuevo.

Usa esta opcion solo cuando estes en un lugar privado.

### 4. Generar una contrasena segura

BASTION puede inventar una clave fuerte por ti, asi no tienes que pensarla.

1. Abre la opcion de generar contrasena.
2. Elige la longitud que quieras (de 8 a 64 caracteres). Mientras mas larga, mas segura.
3. Marca que quieres incluir: mayusculas, numeros y simbolos.
4. BASTION crea la clave al instante y te muestra un indicador de fortaleza:
   - Debil: conviene mejorarla.
   - Media: aceptable.
   - Fuerte: muy buena, ideal para cuentas importantes.
5. Si te gusta, puedes copiarla o usarla directamente al guardar una credencial.

Recomendacion para principiantes: largo de 12 o mas, con mayusculas, numeros y simbolos activados. Eso suele dar una clave "Fuerte".

### 5. Agregar una credencial

Una credencial es el conjunto de datos de una cuenta: el servicio, tu usuario y tu clave.

1. Abre la opcion de agregar credencial.
2. Escribe el nombre del servicio (por ejemplo: Instagram, Banco, Gmail).
3. Elige una categoria de la lista:
   - Redes sociales
   - Banca y finanzas
   - Trabajo
   - Correo
   - Claves API / SSH
   - Otros
4. Escribe tu usuario o correo de esa cuenta.
5. Escribe la contrasena, o pega la que acabas de generar.
6. Guarda. La credencial queda almacenada en tu boveda.

### 6. Buscar una credencial

Cuando ya tienes varias cuentas guardadas, encontrar una es muy facil.

1. Abre la opcion de buscar.
2. Escribe el nombre del servicio (por ejemplo: gmail).
3. BASTION te muestra esa credencial con su categoria, usuario y clave.

No importa si escribes con mayusculas o minusculas: "Gmail", "gmail" y "GMAIL" encuentran lo mismo. Si no aparece nada, es que ese servicio aun no esta guardado.

### 7. Ver todas las credenciales

1. Abre la opcion de ver todas las credenciales.
2. Veras un listado con cada servicio, su categoria, el usuario y la clave.

Las contrasenas aparecen enmascaradas (tapadas con asteriscos, dejando ver solo el primer y el ultimo caracter). Asi puedes revisar tu lista sin exponer tus claves a quien este cerca.

### 8. Ver el historial de accesos

BASTION lleva un registro de cuando se entra a tu boveda.

1. Abre la opcion de historial de accesos.
2. Veras una lista con la fecha y la hora de cada ingreso.

Esto te sirve para notar si hubo algun acceso que tu no hiciste.

### 9. Bloquear la sesion (cerrar)

Cuando termines de usar BASTION, conviene cerrar la sesion para que quede protegida.

1. Pulsa la opcion de cerrar o bloquear la sesion.
2. La boveda se cierra y queda guardada. Para volver a usarla, tendras que escribir de nuevo tu contrasena maestra.

Hazlo siempre que te alejes del equipo, sobre todo si no es tuyo.

## Consejos de seguridad

- Elige una contrasena maestra fuerte: larga, con mayusculas, numeros y simbolos. Es la llave de todo, asi que vale la pena que sea buena.
- No la olvides: BASTION no la guarda en claro y no existe forma de recuperarla. Memorizala bien o guardala en un lugar fisico muy seguro.
- No la compartas con nadie, ni la escribas en chats, correos o notas visibles.
- Usa una clave distinta para cada cuenta. Para eso esta el generador: crea una nueva cada vez.
- Bloquea la sesion cuando termines, especialmente en equipos compartidos.
- Activa "Mostrar contrasena" solo en privado, nunca frente a otras personas o camaras.

## Preguntas frecuentes

### Que pasa si olvido la contrasena maestra?

No hay forma de recuperarla. BASTION guarda solo una huella matematica de tu clave, no la clave en si, justamente para que nadie pueda leerla. Si la olvidas, perderias el acceso a lo guardado. Por eso es tan importante elegir una que recuerdes y no compartirla.

### Se guardan mis datos en internet?

No. Tus credenciales se quedan en tu propio equipo o en el almacenamiento de tu navegador. No se suben a ninguna nube ni se envian a ningun servidor. Esto reduce mucho el riesgo de que alguien externo las vea.

### Funciona sin internet?

Si. Solo necesitas internet la primera vez, para que la pagina cargue su motor. Despues puede funcionar aunque te quedes sin conexion.

### En que dispositivos puedo usarlo?

En cualquiera que tenga un navegador moderno: computadora de escritorio, laptop, tablet o telefono. Ten en cuenta que la boveda se guarda en el navegador de cada dispositivo, asi que tus datos no se pasan solos de un equipo a otro.

## Version de consola (para usuarios avanzados)

Ademas de la web, BASTION tiene una version que se ejecuta en la terminal del computador, con los mismos conceptos.

1. Asegurate de tener instalado Python 3.
2. Abre la terminal en la carpeta donde esta el archivo `bastion.py`.
3. Ejecuta este comando:

   `python3 bastion.py`

4. Aparece un menu con opciones numeradas. Solo escribe el numero de la opcion que quieras y presiona Enter:
   - Crear boveda nueva.
   - Iniciar sesion.
   - Generar contrasena, agregar, buscar y ver credenciales, cambiar la maestra y cerrar sesion.

En esta version, al escribir la contrasena no veras lo que tecleas (es a proposito, por seguridad) y tu boveda se guarda en un archivo local llamado `boveda.json`, dentro de la misma carpeta.

## Resumen rapido

| Tarea | Donde la encuentras |
|---|---|
| Crear boveda | Primera pantalla, al entrar sin boveda |
| Iniciar sesion | Pantalla de bloqueo |
| Mostrar contrasena | Casilla junto a cada campo de clave |
| Generar contrasena | Opcion de generar |
| Agregar credencial | Opcion de agregar |
| Buscar credencial | Barra o opcion de buscar |
| Ver todas | Listado principal |
| Historial de accesos | Opcion de historial |
| Bloquear sesion | Boton de cerrar o bloquear |
