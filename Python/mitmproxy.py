# Description: Script de mitmproxy para obtener información de las solicitudes HTTP realizadas
import csv
import socket
from mitmproxy import http
import socket

# Función que se ejecuta cada vez que se realiza una solicitud
def request(flow: http.HTTPFlow) -> None:
    # Inicializamos la variable content_type
    content_type = ''

    # Obtenemos el tipo de contenido de la solicitud
    if flow.request:
        if flow.request.headers:
            content_type = flow.request.headers.get("Content-Type")
            if not content_type:
                content_type = 'No content type'

    # Obtenemos la dirección IP y el puerto del cliente
    client_address = flow.client_conn.address
    # Obtenemos la dirección IP del servidor
    server_host = flow.request.host
    # Obtenemos el puerto del servidor
    server_port = flow.request.port
    # Obtenemos el nombre del servidor
    server_ip = socket.gethostbyname(server_host)

    # Comprobamos si la dirección IP y el puerto del cliente ya están en el archivo
    with open('mitm/com_aws_android_mitm.csv', mode='r', newline='') as file:
        existing_rows = [row[1] for row in csv.reader(file, delimiter=";")]

    # Si no están, los añadimos
    with open('mitm/com_aws_android_mitm.csv', mode='a', newline='') as file:
        writer = csv.writer(file, delimiter=";")

        # Si el archivo está vacío, añadimos el encabezado
        if file.tell() == 0:
            writer.writerow(["content_type", "l_addr", "l_port",
                            "r_address", "r_addr_ip", "r_port"])

        # Si no está vacío, comprobamos si la dirección IP y el puerto del cliente ya están en el archivo
        if client_address[1] not in existing_rows:
            writer.writerow([content_type, client_address[0],
                            client_address[1], server_host, server_ip, server_port])
