from mitmproxy import http
from mitmproxy import tcp
import csv
import socket
import json
import time
import os


class Connection:
    def __init__(self, app_name, client, server, method, url, error):
        self.app_name = app_name
        self.client = client
        self.server = server
        self.method = method
        self.url = url
        self.error = error


def request(flow: http.HTTPFlow) -> None:
    connection = Connection('N/A', '', '', 'Proxy-Request', '', '-')
    if flow.request.headers:
        # Obtener el nombre del paquete de la aplicación que envía la petición
        user_agent = flow.request.headers.get("User-Agent")
        if 'User-Agent' in flow.request.headers and 'Mobile' in user_agent:
            if 'X-Requested-With' in flow.request.headers:
                connection.app_name = flow.request.headers.get(
                    "X-Requested-With")
            elif 'User-Agent' in flow.request.headers:
                connection.app_name = flow.request.headers.get("User-Agent")
        elif user_agent and "Package/" in user_agent:
            connection.app_name = user_agent.split("Package/")[1].split(" ")[0]
            print("Package detected")
        connection.app_name = connection.app_name.replace(";", "-")

    # Obtener la IP y el puerto del cliente que envía la petición
    connection.client = flow.client_conn.address[0] + \
        ":" + str(flow.client_conn.address[1])
    if (flow.server_conn.ip_address):
        connection.server = str(
            flow.server_conn.ip_address[0]) + ":" + str(flow.server_conn.ip_address[1])
    connection.url = flow.request.url
    if len(connection.url) > 30:
        connection.url = connection.url[:30] + "..."
    write_connections(connection)


def response(flow: http.HTTPFlow) -> None:
    connection = Connection('N/A', '', '', 'Proxy-Response', '', '-')
    if (flow.server_conn.ip_address):
        connection.server = str(
            flow.server_conn.ip_address[0]) + ":" + str(flow.server_conn.ip_address[1])
    connection.client = flow.client_conn.address[0] + \
        ":" + str(flow.client_conn.address[1])
    connection.url = '-'
    write_connections(connection)


def error(flow: http.HTTPFlow) -> None:
    connection = Connection('N/A', '', '', 'Proxy-Error', '', '-')
    connection.client = flow.client_conn.address[0] + \
        ":" + str(flow.client_conn.address[1])
    # Mensaje de error y tipo de error
    connection.error = flow.error.msg
    write_connections(connection)


def tcp_message(flow: tcp.TCPFlow):
    message = flow.messages[-1]
    message.content = message.content.replace(b"foo", b"bar")
    connection = Connection('N/A', message.from_client,
                            '', 'Proxy-TCP', '', '-')
    write_connections(connection)


# Función para escribir las conexiones en un archivo csv
def write_connections(connection):
    # Ruta del archivo con las conexiones mitmproxy
    mitm_path = 'mitm/mitm_connections.csv'

    # Abrir el archivo en modo append, delimitar por punto y coma
    with open(mitm_path, 'a', newline='') as mitm_file:

        # Escribir la conexión en el archivo
        mitm_file.write('\n' + connection.app_name + ';' + connection.client + ';' +
                        connection.server + ';' + connection.method + ';' + connection.url + ';' + connection.error)

        # Cerramos el archivo
        mitm_file.close()
