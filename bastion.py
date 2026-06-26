"""
BASTION - Boveda Personal de Credenciales

Autor: David Alexander Benz Zambrano
Cedula: 1726678673
Materia: Logica de Programacion
Docente: Msc. Lilian Aman
Carrera: Ingenieria en Ciberseguridad
Universidad: UIDE - Universidad Internacional del Ecuador
Paralelo: 1-CIB-1A
Proyecto Integrador - Logica de Programacion
Fecha: 28 de junio de 2026

Descripcion:
    BASTION es una boveda personal de credenciales de linea de comandos.
    Permite crear una boveda protegida por una contrasena maestra, generar
    contrasenas seguras y guardarlas, buscarlas y listarlas. Como proyecto
    integrador, reune los contenidos de las cuatro unidades de la asignatura:
    estructuras de decision (if / elif / else), estructuras repetitivas
    (while y for), funciones, y estructuras de datos (tuplas, listas y
    diccionarios).

    Esta version academica usa solo la biblioteca estandar de Python. La
    contrasena maestra se protege con un hash SHA-256 y las credenciales se
    guardan en un archivo JSON local. El cifrado autenticado AES-256-GCM
    descrito en el diseno queda planificado como evolucion del producto.
"""

# ============================================================
# IMPORTACIONES (solo biblioteca estandar de Python)
# ============================================================
import hashlib   # Genera el hash SHA-256 de la contrasena maestra.
import json      # Lee y escribe la boveda en formato JSON (persistencia).
import os        # Verifica si el archivo de la boveda ya existe en el equipo.
import random    # Elige caracteres al azar para construir la contrasena.
import string    # Provee los conjuntos de caracteres (letras, digitos).
import getpass   # Lee la contrasena por teclado sin mostrarla en pantalla.
import sys       # Permite cerrar el programa de forma limpia.
from datetime import datetime   # Marca de fecha y hora para el historial de accesos.


# ============================================================
# CONSTANTES DE CONFIGURACION
# ============================================================
ARCHIVO_BOVEDA = "boveda.json"   # Archivo local donde se guarda la boveda.
LONGITUD_MINIMA = 8              # Longitud minima permitida para una contrasena.
LONGITUD_MAXIMA = 64             # Longitud maxima permitida para una contrasena.
MAX_INTENTOS = 3                 # Numero maximo de intentos de inicio de sesion.

# TUPLA (Unidad 4): coleccion inmutable con las categorias permitidas. Se usa una
# tupla porque las categorias son fijas y no deben cambiar durante la ejecucion.
# Se basan en el prototipo del Autonomo 1.
CATEGORIAS = (
    "Redes sociales",
    "Banca y finanzas",
    "Trabajo",
    "Correo",
    "Claves API / SSH",
    "Otros",
)


# ============================================================
# CAPA DE ALMACENAMIENTO (persistencia en archivo JSON)
# ============================================================
def calcular_hash(texto):
    """Devuelve el hash SHA-256 (texto hexadecimal) de la cadena recibida.

    Parametros:
        texto (str): contenido en claro a transformar.
    Retorna:
        str: hash de 64 caracteres hexadecimales.
    """
    # hashlib trabaja con bytes, por eso se codifica el texto a UTF-8.
    texto_en_bytes = texto.encode("utf-8")
    return hashlib.sha256(texto_en_bytes).hexdigest()


def existe_boveda():
    """Indica si el archivo de la boveda ya fue creado en el equipo.

    Retorna:
        bool: True si existe boveda.json, False en caso contrario.
    """
    return os.path.exists(ARCHIVO_BOVEDA)


def cargar_boveda():
    """Lee la boveda desde el archivo JSON y la devuelve como diccionario.

    Retorna:
        dict: estructura con 'hash_maestra' y 'credenciales'.
    """
    with open(ARCHIVO_BOVEDA, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


def guardar_boveda(boveda):
    """Escribe el diccionario de la boveda en el archivo JSON local.

    Parametros:
        boveda (dict): estructura completa de la boveda a persistir.
    """
    with open(ARCHIVO_BOVEDA, "w", encoding="utf-8") as archivo:
        # indent=4 deja el JSON legible; ensure_ascii=False respeta los acentos.
        json.dump(boveda, archivo, indent=4, ensure_ascii=False)


# ============================================================
# UTILIDADES DE INTERFAZ (lectura y validacion de datos)
# ============================================================
def leer_clave_oculta(mensaje):
    """Lee una clave por teclado ocultando lo que se escribe.

    Si la terminal no permite ocultar el texto, usa input() como alternativa.
    Parametros:
        mensaje (str): texto que se muestra al usuario.
    Retorna:
        str: la clave ingresada.
    """
    try:
        return getpass.getpass(mensaje)
    except Exception:
        # Alternativa: si getpass falla, se lee con input normal.
        return input(mensaje)


def preguntar_si_no(mensaje):
    """Hace una pregunta de si/no y devuelve un valor booleano.

    Usa un bucle WHILE para insistir hasta recibir una respuesta valida.
    Parametros:
        mensaje (str): la pregunta a mostrar.
    Retorna:
        bool: True si la respuesta es afirmativa, False si es negativa.
    """
    # WHILE: se repite hasta que el usuario escriba una opcion valida.
    while True:
        respuesta = input(mensaje + " (s/n): ").strip().lower()
        # OPERADOR LOGICO OR: se aceptan varias formas de decir "si".
        if respuesta == "s" or respuesta == "si":
            return True
        elif respuesta == "n" or respuesta == "no":
            return False
        else:
            print("  Respuesta no valida. Escriba 's' para si o 'n' para no.")


def pedir_entero(mensaje, minimo=LONGITUD_MINIMA, maximo=LONGITUD_MAXIMA):
    """Solicita un numero entero dentro de un rango validando con WHILE.

    Usa PARAMETROS POR DEFECTO (Unidad 4): si no se indican, el rango permitido
    es el de la longitud de contrasena (LONGITUD_MINIMA a LONGITUD_MAXIMA).
    Parametros:
        mensaje (str): texto a mostrar.
        minimo (int): valor minimo aceptado (por defecto LONGITUD_MINIMA).
        maximo (int): valor maximo aceptado (por defecto LONGITUD_MAXIMA).
    Retorna:
        int: el numero validado.
    """
    # WHILE: insiste hasta que el dato sea un entero dentro del rango permitido.
    while True:
        entrada = input(mensaje).strip()
        # Se valida que sean solo digitos antes de convertir a entero.
        if not entrada.isdigit():
            print("  Debe ingresar un numero entero valido.")
            continue
        numero = int(entrada)
        # OPERADORES RELACIONALES y LOGICOS para comprobar el rango.
        if numero < minimo or numero > maximo:
            print("  El valor debe estar entre", minimo, "y", maximo)
        else:
            return numero


def enmascarar(contrasena):
    """Oculta una contrasena dejando visible el primer y el ultimo caracter.

    Ejemplo: 'K9$mP2xQ' se muestra como 'K******Q'.
    Parametros:
        contrasena (str): la contrasena en claro.
    Retorna:
        str: la contrasena enmascarada.
    """
    # IF: si es muy corta, se ocultan todos los caracteres por seguridad.
    if len(contrasena) <= 2:
        return "*" * len(contrasena)
    # Primer caracter + asteriscos intermedios + ultimo caracter.
    asteriscos = "*" * (len(contrasena) - 2)
    return contrasena[0] + asteriscos + contrasena[-1]


# ============================================================
# CAPA DE LOGICA DE NEGOCIO (casos de uso de BASTION)
# ============================================================
def calcular_fortaleza(longitud, tipos_seleccionados):
    """Clasifica la contrasena como Debil, Media o Fuerte.

    Reglas:
        - longitud menor a 8              -> 'Debil'
        - longitud entre 8 y 11           -> 'Media'
        - longitud de 12 o mas con 3+ tipos -> 'Fuerte'
    Parametros:
        longitud (int): cantidad de caracteres de la contrasena.
        tipos_seleccionados (int): cuantos conjuntos de caracteres se usaron.
    Retorna:
        str: 'Debil', 'Media' o 'Fuerte'.
    """
    # IF / ELIF / ELSE con operadores relacionales y logicos.
    if longitud < LONGITUD_MINIMA:
        return "Debil"
    elif longitud <= 11:
        return "Media"
    elif longitud >= 12 and tipos_seleccionados >= 3:
        return "Fuerte"
    else:
        return "Media"


def crear_boveda():
    """CU-01: Crea una boveda nueva protegida por una contrasena maestra.

    Pide la contrasena maestra (minimo 8 caracteres), la confirma, calcula su
    hash SHA-256 y guarda un archivo de boveda con credenciales vacias.
    """
    print("\n=== CREAR BOVEDA NUEVA ===")

    # WHILE: se repite hasta obtener una contrasena maestra valida y confirmada.
    while True:
        clave = leer_clave_oculta("Defina su contrasena maestra (minimo 8): ")
        # OPERADOR RELACIONAL para validar la longitud minima.
        if len(clave) < LONGITUD_MINIMA:
            print("  La contrasena maestra debe tener al menos 8 caracteres.")
            continue
        # Segunda lectura para confirmar que no hubo error de tipeo.
        confirmacion = leer_clave_oculta("Confirme su contrasena maestra: ")
        # OPERADOR de desigualdad para comparar ambas cadenas.
        if clave != confirmacion:
            print("  Las contrasenas no coinciden. Intente de nuevo.")
            continue
        # Si paso ambas validaciones, se sale del bucle.
        break

    # ESTRUCTURAS DE DATOS: la boveda es un DICCIONARIO; 'credenciales' es otro
    # diccionario y 'historial' es una LISTA (Unidad 4) para registrar los accesos.
    boveda = {
        "hash_maestra": calcular_hash(clave),
        "credenciales": {},
        "historial": [],
    }
    guardar_boveda(boveda)
    print("\nBoveda creada correctamente. Ya puede iniciar sesion.")


def registrar_acceso(boveda, evento="Acceso concedido"):
    """Registra un evento de acceso en el historial de la boveda.

    Demuestra una FUNCION CON PARAMETRO POR DEFECTO (Unidad 4): si no se indica
    el evento, se asume "Acceso concedido".
    Parametros:
        boveda (dict): la boveda abierta en memoria.
        evento (str): descripcion del evento (parametro opcional con valor por defecto).
    """
    # LISTA: se agrega al historial un registro con la fecha y hora actual.
    momento = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    boveda["historial"].append({"fecha": momento, "evento": evento})
    guardar_boveda(boveda)


def iniciar_sesion():
    """CU-02: Valida la contrasena maestra y desbloquea la boveda.

    Usa un bucle WHILE con un contador de intentos. Tras 3 intentos fallidos
    bloquea el acceso y cierra el programa por seguridad.
    Retorna:
        dict: la boveda lista para usarse si la clave es correcta.
    """
    print("\n=== INICIAR SESION ===")
    boveda = cargar_boveda()
    # Compatibilidad: si la boveda no tiene historial (version previa), se crea.
    if "historial" not in boveda:
        boveda["historial"] = []

    # CONTADOR de intentos fallidos, inicia en cero.
    intentos = 0

    # WHILE CON CONTADOR: permite como maximo MAX_INTENTOS (3) intentos.
    while intentos < MAX_INTENTOS:
        clave = leer_clave_oculta("Ingrese su contrasena maestra: ")
        # Se compara el hash de lo ingresado contra el hash guardado.
        if calcular_hash(clave) == boveda["hash_maestra"]:
            print("\nAcceso concedido. Bienvenido a su boveda.")
            registrar_acceso(boveda)   # LISTA: se guarda este acceso en el historial.
            return boveda  # Clave correcta: se devuelve la boveda y se sale.
        else:
            # CONTADOR: se incrementa en uno por cada intento fallido.
            intentos += 1
            restantes = MAX_INTENTOS - intentos
            print("  Contrasena incorrecta. Intentos restantes:", restantes)

    # Si se agotaron los intentos, se bloquea y se cierra el programa.
    print("\nBoveda bloqueada por seguridad. Demasiados intentos fallidos.")
    sys.exit()


def generar_contrasena():
    """CU-03: Genera una contrasena segura segun los parametros del usuario.

    Construye el alfabeto con estructuras IF, arma la contrasena con un bucle
    FOR y range(), y calcula su fortaleza.
    Retorna:
        str: la contrasena generada.
    """
    print("\n=== GENERAR CONTRASENA SEGURA ===")

    # Se pide la longitud deseada validada dentro del rango permitido.
    longitud_deseada = pedir_entero(
        "Longitud deseada (8 a 64): ", LONGITUD_MINIMA, LONGITUD_MAXIMA)

    # Variables booleanas que definen que conjuntos de caracteres incluir.
    incluir_mayusculas = preguntar_si_no("Incluir mayusculas?")
    incluir_numeros = preguntar_si_no("Incluir numeros?")
    incluir_simbolos = preguntar_si_no("Incluir simbolos?")

    # El alfabeto base siempre incluye letras minusculas.
    alfabeto = string.ascii_lowercase
    # CONTADOR de tipos de caracteres usados (las minusculas ya cuentan como 1).
    tipos_seleccionados = 1

    # IF: se concatenan conjuntos al alfabeto segun lo elegido por el usuario.
    if incluir_mayusculas:
        alfabeto += string.ascii_uppercase
        tipos_seleccionados += 1   # CONTADOR
    if incluir_numeros:
        alfabeto += string.digits
        tipos_seleccionados += 1   # CONTADOR
    if incluir_simbolos:
        alfabeto += "!@#$%&*?-_"
        tipos_seleccionados += 1   # CONTADOR

    # Se construye la contrasena caracter por caracter.
    contrasena_generada = ""
    # FOR CON RANGE: se repite tantas veces como la longitud deseada.
    for i in range(longitud_deseada):
        contrasena_generada += random.choice(alfabeto)

    # Se calcula y se muestra la fortaleza de la contrasena resultante.
    fortaleza = calcular_fortaleza(longitud_deseada, tipos_seleccionados)
    print("\nContrasena generada:", contrasena_generada)
    print("Fortaleza estimada :", fortaleza)

    return contrasena_generada


def agregar_credencial(boveda, contrasena_sugerida=None):
    """CU-04: Agrega una credencial nueva a la boveda y la guarda en disco.

    Parametros:
        boveda (dict): la boveda abierta en memoria.
        contrasena_sugerida (str): contrasena ya generada a reutilizar (opcional).
    """
    print("\n=== AGREGAR CREDENCIAL ===")

    # WHILE: el nombre del servicio es obligatorio y no puede quedar vacio.
    while True:
        nombre_servicio = input("Nombre del servicio (ej: Instagram): ").strip()
        if nombre_servicio == "":
            print("  El nombre del servicio no puede quedar vacio.")
        else:
            break

    # IF con OPERADOR 'in': si el servicio ya existe, se confirma antes de sobrescribir.
    if nombre_servicio in boveda["credenciales"]:
        if not preguntar_si_no("Ese servicio ya existe. Desea sobrescribirlo?"):
            print("  Operacion cancelada. No se modifico la credencial existente.")
            return

    # Menu numerado de categorias predefinidas.
    print("\nSeleccione una categoria:")
    # FOR con enumerate para recorrer la TUPLA de categorias (Unidad 4) numerada.
    for indice, nombre in enumerate(CATEGORIAS, start=1):
        print("  [" + str(indice) + "]", nombre)

    # WHILE: insiste hasta elegir una categoria valida de la tupla.
    while True:
        opcion_categoria = input("Opcion de categoria: ").strip()
        # OPERADORES RELACIONALES: el numero debe estar dentro del rango de la tupla.
        if opcion_categoria.isdigit() and 1 <= int(opcion_categoria) <= len(CATEGORIAS):
            # Se accede por INDICE a la tupla (se resta 1 porque empieza en 0).
            categoria = CATEGORIAS[int(opcion_categoria) - 1]
            break
        else:
            print("  Opcion de categoria no valida.")

    usuario = input("Usuario o correo: ").strip()

    # IF / ELSE: se usa la contrasena sugerida o se pide una manualmente.
    if contrasena_sugerida is not None and preguntar_si_no(
            "Usar la contrasena generada anteriormente?"):
        contrasena = contrasena_sugerida
    else:
        contrasena = input("Escriba la contrasena a guardar: ").strip()

    # DICCIONARIO: se guarda la credencial usando el servicio como clave.
    boveda["credenciales"][nombre_servicio] = {
        "categoria": categoria,
        "usuario": usuario,
        "contrasena": contrasena,
    }
    guardar_boveda(boveda)
    print("\nCredencial de '" + nombre_servicio + "' guardada correctamente.")


def buscar_credencial(boveda):
    """CU-06: Busca una credencial por el nombre del servicio.

    Recorre el diccionario de credenciales con un FOR y compara sin distinguir
    mayusculas de minusculas.
    Parametros:
        boveda (dict): la boveda abierta en memoria.
    """
    print("\n=== BUSCAR CREDENCIAL ===")
    credenciales = boveda["credenciales"]

    # IF: si no hay credenciales, no tiene sentido buscar.
    if len(credenciales) == 0:
        print("La boveda esta vacia. No hay nada que buscar.")
        return

    busqueda = input("Nombre del servicio a buscar: ").strip()
    # Bandera booleana que indica si se encontro el servicio.
    encontrado = False

    # FOR para iterar el DICCIONARIO con .items() (clave y valor).
    for servicio, datos in credenciales.items():
        # Comparacion sin distinguir mayusculas de minusculas (case insensitive).
        if servicio.lower() == busqueda.lower():
            print("\nServicio encontrado:")
            print("  Servicio :", servicio)
            print("  Categoria:", datos["categoria"])
            print("  Usuario  :", datos["usuario"])
            print("  Clave    :", datos["contrasena"])
            encontrado = True

    # IF con OPERADOR LOGICO NOT: si la bandera sigue en False, no hubo coincidencia.
    if not encontrado:
        print("\nServicio no encontrado en la boveda.")


def ver_credenciales(boveda):
    """CU-07: Muestra todas las credenciales con la contrasena enmascarada.

    Parametros:
        boveda (dict): la boveda abierta en memoria.
    """
    print("\n=== TODAS LAS CREDENCIALES ===")
    credenciales = boveda["credenciales"]

    # IF / ELSE: se avisa si la boveda esta vacia.
    if len(credenciales) == 0:
        print("La boveda esta vacia. Aun no ha guardado credenciales.")
        return

    # Encabezado de la tabla.
    print("")
    print("{:<20} {:<18} {:<25} {:<12}".format(
        "SERVICIO", "CATEGORIA", "USUARIO", "CLAVE"))
    print("-" * 75)

    # CONTADOR para totalizar cuantas credenciales hay.
    total = 0
    # FOR para recorrer el DICCIONARIO de credenciales con .items().
    for servicio, datos in credenciales.items():
        clave_oculta = enmascarar(datos["contrasena"])
        print("{:<20} {:<18} {:<25} {:<12}".format(
            servicio, datos["categoria"], datos["usuario"], clave_oculta))
        total += 1   # CONTADOR de credenciales mostradas.

    print("-" * 75)
    print("Total de credenciales:", total)


def ver_historial(boveda):
    """Muestra el historial de accesos guardado en la boveda.

    Recorre una LISTA (Unidad 4) de registros con un bucle FOR y enumerate.
    Parametros:
        boveda (dict): la boveda abierta en memoria.
    """
    print("\n=== HISTORIAL DE ACCESOS ===")
    # LISTA: registros de acceso acumulados en la boveda.
    historial = boveda["historial"]

    # IF: si la lista esta vacia, se informa y se sale.
    if len(historial) == 0:
        print("Aun no hay accesos registrados.")
        return

    # FOR con enumerate para numerar cada registro de la LISTA.
    for numero, registro in enumerate(historial, start=1):
        print("  " + str(numero) + ".", registro["fecha"], "-", registro["evento"])
    print("\nTotal de accesos registrados:", len(historial))


def cambiar_contrasena_maestra(boveda):
    """CU adicional: Cambia la contrasena maestra de la boveda.

    Valida la contrasena actual y pide la nueva dos veces hasta que coincidan.
    Parametros:
        boveda (dict): la boveda abierta en memoria.
    """
    print("\n=== CAMBIAR CONTRASENA MAESTRA ===")

    actual = leer_clave_oculta("Ingrese su contrasena maestra actual: ")
    # IF: se valida la clave actual comparando los hashes.
    if calcular_hash(actual) != boveda["hash_maestra"]:
        print("  Contrasena actual incorrecta. Operacion cancelada.")
        return

    # WHILE: pide la nueva clave dos veces hasta que coincidan y sean validas.
    while True:
        nueva = leer_clave_oculta("Nueva contrasena maestra (minimo 8): ")
        if len(nueva) < LONGITUD_MINIMA:
            print("  La nueva contrasena debe tener al menos 8 caracteres.")
            continue
        repetir = leer_clave_oculta("Repita la nueva contrasena: ")
        if nueva != repetir:
            print("  Las contrasenas no coinciden. Intente de nuevo.")
            continue
        break

    # Se actualiza el hash y se persiste la boveda.
    boveda["hash_maestra"] = calcular_hash(nueva)
    guardar_boveda(boveda)
    print("\nContrasena maestra actualizada correctamente.")


# ============================================================
# CAPA DE PRESENTACION (menus de la interfaz CLI)
# ============================================================
def menu_principal(boveda):
    """Muestra el menu principal y enruta las acciones del usuario.

    Usa un bucle WHILE True con break y una estructura IF / ELIF / ELSE para
    seleccionar la accion correspondiente.
    Parametros:
        boveda (dict): la boveda abierta y desbloqueada.
    """
    # WHILE True con break: se repite hasta que el usuario cierre la sesion.
    while True:
        print("\n----------- MENU PRINCIPAL -----------")
        print("[1] Generar contrasena segura")
        print("[2] Agregar credencial a la boveda")
        print("[3] Buscar credencial por nombre")
        print("[4] Ver todas las credenciales")
        print("[5] Cambiar contrasena maestra")
        print("[6] Ver historial de accesos")
        print("[7] Cerrar sesion")
        opcion = input("Seleccione una opcion: ").strip()

        # IF / ELIF / ELSE: estructura de seleccion del menu principal.
        if opcion == "1":
            nueva_clave = generar_contrasena()
            # Tras generar, se ofrece guardarla como credencial (relacion include).
            if preguntar_si_no("Desea guardar esta contrasena en una credencial?"):
                agregar_credencial(boveda, nueva_clave)
        elif opcion == "2":
            agregar_credencial(boveda)
        elif opcion == "3":
            buscar_credencial(boveda)
        elif opcion == "4":
            ver_credenciales(boveda)
        elif opcion == "5":
            cambiar_contrasena_maestra(boveda)
        elif opcion == "6":
            ver_historial(boveda)
        elif opcion == "7":
            print("\nSesion cerrada. La boveda quedo guardada y protegida.")
            break
        else:
            print("  Opcion no valida. Elija un numero del 1 al 7.")


def main():
    """Funcion principal: muestra el menu inicial y coordina el programa.

    Usa un bucle WHILE True con break y una estructura IF / ELIF / ELSE. Si aun
    no existe una boveda, oculta la opcion de iniciar sesion.
    """
    print("==================================================")
    print("        BASTION - Boveda Personal de Credenciales")
    print("==================================================")

    # WHILE True con break: bucle del menu inicial del programa.
    while True:
        print("\n--------------- MENU INICIAL ---------------")
        print("[1] Crear boveda nueva")
        # IF: la opcion de iniciar sesion solo se muestra si la boveda existe.
        if existe_boveda():
            print("[2] Iniciar sesion en boveda existente")
        print("[3] Salir")
        opcion = input("Seleccione una opcion: ").strip()

        # IF / ELIF / ELSE: estructura de seleccion del menu inicial.
        if opcion == "1":
            # IF / ELSE: se evita sobrescribir una boveda ya existente.
            if existe_boveda():
                print("  Ya existe una boveda. Use la opcion 2 para iniciar sesion.")
            else:
                crear_boveda()
        elif opcion == "2":
            # OPERADOR LOGICO: la opcion 2 solo es valida si la boveda existe.
            if existe_boveda():
                boveda = iniciar_sesion()
                menu_principal(boveda)
            else:
                print("  Aun no existe una boveda. Cree una con la opcion 1.")
        elif opcion == "3":
            print("\nGracias por usar BASTION. Hasta pronto.")
            break
        else:
            print("  Opcion no valida. Intente nuevamente.")


# Punto de entrada: el programa solo se ejecuta si se corre directamente.
if __name__ == "__main__":
    main()
