import csv
import socket
from mitmproxy import http


apps = []



def request(flow: http.HTTPFlow) -> None:
    client_address = flow.client_conn.address
    server_host = flow.request.host
    server_port = flow.request.port
    server_ip = socket.gethostbyname(server_host)
    
    with open ('mitm/com_aws_android_mitm.csv', mode='r', newline='') as file:
        existing_rows = [row[1] for row in csv.reader(file, delimiter=";")]
        
    with open ('mitm/com_aws_android_mitm.csv', mode='a', newline='') as file:
        writer = csv.writer(file, delimiter=";")

        if file.tell() == 0:
            writer.writerow(["l_addr", "l_port", "r_address", "r_addr_ip", "r_port"])
        
        if client_address[1] not in existing_rows:
            writer.writerow([client_address[0], client_address[1], server_host, server_ip, server_port])

