import csv, re

#Nombre de la aplicación
app_name = 'com.aws.android'

#Path del archivo CSV generado por frida
csv_frida_path = 'Javascript/frida_connections/' + app_name.replace('.', '_') + '.csv'
# Path del archivo CSV generado por mitmproxy.py
csv_mitm_path = 'mitm/mitm_connections.csv'
# Almacena los puertos que han establecido una conexión interceptados por frida
frida_ports_hooked = []
mitmproxy_ports_hooked = []


# Filtramos solo las filas correspondientes a la intercepción de socket.getOutputStream()
with open(csv_frida_path, 'r', encoding='utf-16') as file:
    content = file.read()
    lines = content.split('\n')
    filtered_rows = [line for line in lines if 'socket.getOutputStream' in line]
    # Buscamos los puertos locales interceptados por Frida
    for item in filtered_rows:
        print(item)
        if "lPort" in item:
            port = re.search(r'"lPort": "(\d+)"', item)
            lPort = port.group(1)
            frida_ports_hooked.append(lPort)
            

#Abrimos el archivo CSV generado por mitmproxy.py
with open(csv_mitm_path, 'r') as file:
    reader = csv.reader(file, delimiter=";")
    # Buscamos solo las filas que contengan el nombre de la aplicación
    for row in reader:
        if app_name in row[0]:
            # Añadimos el puerto al array de puertos interceptados por mitmproxy
            mitmproxy_ports_hooked.append(row[2])

# Creamos un csv con el nombre de la aplicación y el numero de puertos interceptados por frida y mitmproxy
with open('Python/matches/comparative_ports.csv', mode='w', newline='') as file:
    writer = csv.writer(file, delimiter=";")
    # Añadimos el encabezado si el archivo está vacío
    if file.tell() == 0:
        writer.writerow(["App", "Frida_Ports", "mitmproxy_Ports"])
    writer.writerow([app_name, len(frida_ports_hooked), len(mitmproxy_ports_hooked)])
