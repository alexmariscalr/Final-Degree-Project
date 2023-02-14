import csv, re

csv_frida_path = 'Javascript\com_aws_android_frida.txt'
csv_mitm_path = 'Python\mitm\com_aws_android_mitm.csv'
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
            
# Vemos qué puertos ha interceptado el proxy
with open(csv_mitm_path, 'r') as file:
    reader = csv.reader(file, delimiter=";")
    # Salta la primera fila
    next(reader)
    for row in reader:
        mitmproxy_ports_hooked.append(row[1])

#Convertimos en una lista para eliminar repetidos
frida_ports_hooked = list(set(frida_ports_hooked))
mitmproxy_ports_hooked = list(set(mitmproxy_ports_hooked))

#Mostramos los puertos interceptados por ambos métodos

puertos_coinciden = [puerto for puerto in mitmproxy_ports_hooked if puerto in frida_ports_hooked]
puertos_no_coinciden = [puerto for puerto in mitmproxy_ports_hooked if puerto not in frida_ports_hooked]

print("Puertos que coinciden:", puertos_coinciden)
print("Puertos que no coinciden:", puertos_no_coinciden)