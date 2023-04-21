import csv
import re
import os


# Creamos una clase para almacenar los datos de las conexiones de Frida
class Frida_Connection:
    def __init__(self, app_name, trace, client, method):
        self.app_name = app_name
        self.trace = trace
        self.client = client
        self.method = method

# Creamos una clase para almacenar los datos de las conexiones de mitmproxy


class Mitm_Connection:
    def __init__(self, app_name, client, server, method, url, error):
        self.app_name = app_name
        self.client = client
        self.server = server
        self.method = method
        self.url = url
        self.error = error


# Ruta del archivo con las conexiones mitmproxy
mitm_path = 'mitm/mitm_connections.csv'
app_list = []
frida_connections = []
mitm_connections = []

for arch in os.listdir('frida/apps'):
    # Imprimir solo los .txt
    if arch.endswith('.txt'):
        app_path = 'frida/apps/' + arch
        app = arch.replace('_', '.')
        app = app.replace('.txt', '')
        if app not in app_list:
            app_list.append(app)
        with open(app_path, 'r', encoding='utf-8') as frida_file:
            content = frida_file.read()
            lines = content.split('\n')

            # Filtramos las líneas que contienen "socket.getOutputStream" o "socket.connect" o "socketChannel.open"

            filtered_rows = [
                line for line in lines if 'socket.getOutputStream' in line or 'socket.connect' in line or 'socketChannel.open' in line or 'SSLContext.getInstance' in line
            ]
            print(filtered_rows)

            for item in filtered_rows:
                connection = Frida_Connection(app, '', '', '')
                # Procesa el "trace"
                match = re.search(r'trace:"(.*?)"', item)
                connection.trace = match.group(1) if match else 'No trace'
                # Procesa el "client"
                match = re.search(r'client": "(.*?)"', item)
                connection.client = match.group(
                    1).replace("/", "") if match else 'No local IP'
                # Procesa el "method"
                match = re.search(r'type": "(.*?)"', item)
                connection.method = "Frida - " + match.group(
                    1) if match else 'No method'
                frida_connections.append(connection)

with open(mitm_path, 'r') as mitm_file:
    reader = csv.reader(mitm_file, delimiter=";")
    for row in reader:
        if (row):
            connection = Mitm_Connection(
                row[0], row[1], row[2], row[3], row[4], row[5])
            mitm_connections.append(connection)


# -----------------CSV CON TODAS LAS CONEXIONES---------------------------
with open('comparativa_todas_conexiones.csv', 'w', newline='') as csvfile:
    columnas = ['APP', 'CLIENT', 'SERVER', 'METHOD',
                'URL', 'TRACE', 'ERROR_MESSAGE']
    writer = csv.DictWriter(csvfile, fieldnames=columnas, delimiter=';')
    writer.writeheader()
    for connection in frida_connections:
        writer.writerow({'APP': connection.app_name, 'CLIENT': connection.client,
                        'SERVER': '-', 'METHOD': connection.method, 'URL': '-', 'TRACE': connection.trace, 'ERROR_MESSAGE': '-'})

    for connection in mitm_connections:
        writer.writerow({'APP': connection.app_name, 'CLIENT': connection.client,
                        'SERVER': connection.server, 'METHOD': connection.method, 'URL': connection.url, 'TRACE': '-', 'ERROR_MESSAGE': connection.error})
