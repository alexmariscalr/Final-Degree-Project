import csv
import socket
from mitmproxy import http
import socket


apps = []

def request(flow: http.HTTPFlow) -> None:
    content_type = ''

    if flow.request:
        if flow.request.headers:
            content_type = flow.request.headers.get("Content-Type")
            if not content_type:
                content_type = 'No content type'

    client_address = flow.client_conn.address
    server_host = flow.request.host
    server_port = flow.request.port
    server_ip = socket.gethostbyname(server_host)

    if flow.request.host and flow.request.headers:
        app_name = flow.request.host
        for header in flow.request.headers:
            if header[0] == 'User-Agent':
                app_name += '' + header[1]
        print(app_name)
    
    with open ('mitm/com_aws_android_mitm.csv', mode='r', newline='') as file:
        existing_rows = [row[1] for row in csv.reader(file, delimiter=";")]
        
    with open ('mitm/com_aws_android_mitm.csv', mode='a', newline='') as file:
        writer = csv.writer(file, delimiter=";")

        if file.tell() == 0:
            writer.writerow(["content_type","l_addr", "l_port", "r_address", "r_addr_ip", "r_port"])
                            
        if client_address[1] not in existing_rows:
            writer.writerow([content_type,client_address[0], client_address[1], server_host, server_ip, server_port])

