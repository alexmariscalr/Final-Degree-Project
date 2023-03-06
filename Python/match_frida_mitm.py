import csv
import re
import os

# Path del archivo CSV generado por mitmproxy.py
mitm_path = 'mitm/mitm_connections.csv'


# Creamos una clase para almacenar los datos de las conexiones de Frida
class Frida_Connection:
    def __init__(self, app_name, trace, ip_client, port_client):
        self.app_name = app_name
        self.trace = trace
        self.ip_client = ip_client
        self.port_client = port_client

# Creamos una clase para almacenar los datos de las conexiones de mitmproxy


class Mitm_Connection:
    def __init__(self, app_name, ip_client, port_client, ip_server, port_server, url):
        self.app_name = app_name
        self.ip_client = ip_client
        self.port_client = port_client
        self.ip_server = ip_server
        self.port_server = port_server
        self.url = url


# Array para almacenar las conexiones detectadas por Frida y mitmproxy
frida_connections = []
mitm_connections = []

# Guardar conexiones detectadas por Frida
for arch in os.listdir('apps'):
    frida_path = 'apps/' + arch
    app = arch.replace('_', '.')
    with open(frida_path, 'r', encoding='utf-8') as frida_file:
        content = frida_file.read()
        lines = content.split('\n')
        filtered_rows = [
            line for line in lines if 'socket.getOutputStream' in line]
        # Buscamos los puertos locales interceptados por Frida
        for item in filtered_rows:
            # Creamos un objeto de la clase Frida_Connection vacío
            conexion = Frida_Connection(app.replace('.txt', ''), '', '', '')

            # Si la fila contiene traza, la añadimos al array
            if "trace" in item:
                trace = r'trace:"(.*?)"'
                match = re.search(trace, item)
                if match:
                    trace = match.group(1)
                conexion.trace = trace

            # Si la fila contiene la IP local, la añadimos al array
            if "lAddr" in item:
                lAddr = r'lAddr": "(.*?)"'
                match = re.search(lAddr, item)
                if match:
                    lAddr = match.group(1)
                conexion.ip_client = lAddr.replace('/', '')
            # Si la fila contiene el puerto local, lo añadimos al array
            if "lPort" in item:
                port = re.search(r'"lPort": "(\d+)"', item)
                conexion.port_client = port.group(1)
            else:
                conexion.port_client = ''
            print(conexion.port_client)

            frida_connections.append(conexion)

            # Cerrar el archivo
            frida_file.close()

    # Guardar conexiones detectadas por mitmproxy
    with open(mitm_path, 'r') as file:
        reader = csv.reader(file, delimiter=";")
        # Buscamos solo las filas que contengan el nombre de la aplicación
        for row in reader:
            if app.replace('.txt', '') in row[0]:
                print('Apliación encontrada: ' + app)
                # Añadimos el puerto al array de puertos interceptados por mitmproxy
                mitm_connections.append(Mitm_Connection(
                    row[0], row[1], row[2], row[3], row[4], row[5]))
            else:
                print('No se ha encontrado la aplicación ' + app)

# CSV ordenado por IP y puerto. Columna de detectado por Frida y detectado por mitmproxy. Si no existe el CSV, lo crea. Si existe, lo sobreescribe.
with open('match_frida_mitm.csv', 'w', newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(['app_name', 'trace', 'ip_client', 'port_client',
                    'ip_server', 'port_server', 'url', 'frida', 'mitmproxy'])
    for frida in frida_connections:
        found = False
        for mitm in mitm_connections:
            if frida.ip_client == mitm.ip_client and frida.port_client == mitm.port_client:
                writer.writerow([frida.app_name, frida.trace, frida.ip_client,
                                frida.port_client, mitm.ip_server, mitm.port_server, mitm.url, True, True])
                found = True
        if not found:
            writer.writerow([frida.app_name, frida.trace, frida.ip_client,
                            frida.port_client, '', '', '', True, False])
    for mitm in mitm_connections:
        found = False
        for frida in frida_connections:
            if frida.ip_client == mitm.ip_client and frida.port_client == mitm.port_client:
                found = True
        if not found:
            writer.writerow([mitm.app_name, '', mitm.ip_client, mitm.port_client,
                            mitm.ip_server, mitm.port_server, mitm.url, False, True])
