# Description: Script de mitmproxy para obtener información de las solicitudes HTTP realizadas
import csv
import socket
from mitmproxy import http
import socket

# Función que se ejecuta cada vez que se realiza una solicitud
def request(flow: http.HTTPFlow) -> None:
    # Inicializamos las variables
    app_name = ''
    ip_address_client = ''
    ip_address_server = ''
    port_client = ''
    port_server = ''
    url = ''

    #Obtenemos el nombre de la aplicación que realiza la solicitud
    if flow.request.headers:
        # Si la solicitud es realizada por una aplicación móvil
        if 'User-Agent' in flow.request.headers and 'Mobile' in flow.request.headers.get("User-Agent"):
            # Obtenemos el nombre de la aplicación
            if 'X-Requested-With' in flow.request.headers:
                app_name = flow.request.headers.get("X-Requested-With")
            # Si no se encuentra el nombre de la aplicación, se obtiene el User-Agent
            elif 'User-Agent' in flow.request.headers:
                app_name = flow.request.headers.get("User-Agent")

    #Dirección IP (número) y puerto del cliente
    if flow.client_conn.address:
        ip_address_client = socket.gethostbyname(socket.gethostname())
        port_client =  flow.client_conn.address[1]
    
    #Dirección IP (número) y puerto del servidor
    if flow.request.host:
        ip_address_server =  socket.gethostbyname(flow.request.host)
        port_server =  flow.request.port

    #URL de la solicitud
    url = flow.request.pretty_url

    # Creamos un archivo CSV para almacenar los datos, si ya está creado, no se crea de nuevo y se añaden los datos
    with open('mitm/mitm_connections.csv', mode='a', newline='') as file:
        writer = csv.writer(file, delimiter=";")

        # Si el archivo está vacío, añadimos el encabezado
        if file.tell() == 0:
            writer.writerow(["App", "IP_Client", "Port_Client", "IP_Server", "Port_Server", "URL"])
        
        # Si no está vacío, añadimos los datos
        writer.writerow([app_name, ip_address_client,  port_client, ip_address_server, port_server, url])