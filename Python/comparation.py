import csv
import re
import os


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


# Ruta del archivo con las conexiones mitmproxy
mitm_path = 'Python/mitm/mitm_connections.csv'
app_list = []
frida_connections = []
mitm_connections = []

for arch in os.listdir('Python/frida/apps'):
    # Imprimir solo los .txt
    if arch.endswith('.txt'):
        app_path = 'Python/frida/apps/' + arch
        app = arch.replace('_', '.')
        app = app.replace('.txt', '')
        if app not in app_list:
            app_list.append(app)
        with open(app_path, 'r', encoding='utf-8') as frida_file:
            content = frida_file.read()
            lines = content.split('\n')
            filtered_rows = [
                line for line in lines if 'socket.getOutputStream' in line]
            # Buscamos los puertos locales interceptados por Frida
            for item in filtered_rows:
                connection = Frida_Connection(app, '', '', '')
                # Procesa el "trace"
                match = re.search(r'trace:"(.*?)"', item)
                connection.trace = match.group(1) if match else 'No trace'

                # Procesa el "lAddr"
                match = re.search(r'lAddr": "(.*?)"', item)
                connection.ip_client = match.group(1).replace(
                    '/', '') if match else 'No local IP'

                # Procesa el "lPort"
                match = re.search(r'lPort": (.*?),', item)
                connection.port_client = match.group(1).replace(
                    '"', '') if match else 'No local port'
                frida_connections.append(connection)
        with open(mitm_path, 'r') as mitm_file:
            reader = csv.reader(mitm_file)
            for row in reader:
                columna = row[0].split(';')
                if columna[0] == app:
                    connection = Mitm_Connection(
                        columna[0], columna[1], columna[2], columna[3], columna[4], columna[5])
                    mitm_connections.append(connection)


# -----------------CSV CON TODAS LAS CONEXIONES---------------------------
with open('comparativa_todas_conexiones.csv', 'w', newline='') as csvfile:
    columnas = ['app', 'ip_cliente', 'puerto_cliente', 'metodo',
                'ip_servidor', 'puerto_servidor', 'url', 'stackTrace']
    writer = csv.DictWriter(csvfile, fieldnames=columnas, delimiter=';')
    writer.writeheader()
    for connection in frida_connections:
        writer.writerow({'app': connection.app_name, 'ip_cliente': connection.ip_client,
                        'puerto_cliente': connection.port_client, 'metodo': 'FRIDA', 'ip_servidor': '', 'puerto_servidor': '', 'url': '', 'stackTrace': connection.trace})
    for connection in mitm_connections:
        writer.writerow({'app': connection.app_name, 'ip_cliente': connection.ip_client,
                        'puerto_cliente': connection.port_client, 'metodo': 'MITMPROXY', 'ip_servidor': connection.ip_server, 'puerto_servidor': connection.port_server, 'url': connection.url, 'stackTrace': ''})


# -------------COMPARATIVA NÚMERO CONEXIONES POR APP---------------------------
with open('comparativa_num_conexiones.csv', 'w', newline='') as csvfile:
    columnas = ['app', 'frida_connections', 'mitm_connections']
    writer = csv.DictWriter(csvfile, fieldnames=columnas, delimiter=';')
    writer.writeheader()
    for app in app_list:
        frida_count = 0
        mitm_count = 0
        for connection in frida_connections:
            if connection.app_name == app:
                frida_count += 1
        for connection in mitm_connections:
            if connection.app_name == app:
                mitm_count += 1
        writer.writerow(
            {'app': app, 'frida_connections': frida_count, 'mitm_connections': mitm_count})

# -------------PUERTOS QUE DETECTA FRIDA Y NO MITMPROXY Y VICEVERSA---------------------------
with open('comparativa_puertos_detectados.csv', 'w', newline='') as csvfile:
    columnas = ['ip_cliente', 'puerto_cliente', 'app',
                'stackTrace', 'ip_servidor', 'puerto_servidor', 'url']
    writer = csv.DictWriter(csvfile, fieldnames=columnas, delimiter=';')
    writer.writeheader()
    for connection in frida_connections:
        found = False
        for mitm_connection in mitm_connections:
            if connection.ip_client == mitm_connection.ip_client and connection.port_client == mitm_connection.port_client:
                found = True
        if not found:
            writer.writerow({'ip_cliente': connection.ip_client, 'puerto_cliente': connection.port_client,
                            'app': connection.app_name, 'stackTrace': connection.trace, 'ip_servidor': '', 'puerto_servidor': '', 'url': ''})
    for connection in mitm_connections:
        found = False
        for frida_connection in frida_connections:
            if connection.ip_client == frida_connection.ip_client and connection.port_client == frida_connection.port_client:
                found = True
        if not found:
            writer.writerow({'ip_cliente': connection.ip_client, 'puerto_cliente': connection.port_client, 'app': connection.app_name,
                            'stackTrace': '', 'ip_servidor': connection.ip_server, 'puerto_servidor': connection.port_server, 'url': connection.url})

# -------------PUERTOS QUE DETECTA FRIDA Y MITMPROXY---------------------------
with open('comparativa_puertos_comunes.csv', 'w', newline='') as csvfile:
    columnas = ['ip_cliente', 'puerto_cliente', 'app',
                'stackTrace', 'ip_servidor', 'puerto_servidor', 'url']
    writer = csv.DictWriter(csvfile, fieldnames=columnas, delimiter=';')
    writer.writeheader()
    for connection in frida_connections:
        for mitm_connection in mitm_connections:
            if connection.ip_client == mitm_connection.ip_client and connection.port_client == mitm_connection.port_client:
                writer.writerow({'ip_cliente': connection.ip_client, 'puerto_cliente': connection.port_client, 'app': connection.app_name, 'stackTrace': connection.trace,
                                'ip_servidor': mitm_connection.ip_server, 'puerto_servidor': mitm_connection.port_server, 'url': mitm_connection.url})
