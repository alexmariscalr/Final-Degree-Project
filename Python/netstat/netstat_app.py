import subprocess
import time

# Inicia mitmproxy en segundo plano
mitmproxy_process = subprocess.Popen(['mitmproxy', '-p', '8081'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Espera a que mitmproxy esté listo
time.sleep(2)

# Recupera el PID de mitmproxy
mitmproxy_pid = mitmproxy_process.pid

# Ejecuta el comando netstat y obtiene la salida
netstat_output = subprocess.check_output(['netstat', '-ano'])

# Divide la salida en líneas y elimina la primera línea (encabezado)
netstat_lines = netstat_output.decode('iso-8859-1').split('\n')[1:]

# Recorre todas las líneas de la salida de netstat
for line in netstat_lines:
    if str(mitmproxy_pid) in line and '127.0.0.1:8081' in line:
        # Divide la línea en campos y obtiene el PID y el estado de la conexión
        fields = line.split()
        pid = fields[-1]
        state = fields[-2]

        # Obtiene el nombre de la aplicación correspondiente al PID
        app_name = subprocess.check_output(['tasklist', '/fi', 'pid eq ' + pid]).decode('iso-8859-1').split('\n')[3].split()[0]

        # Imprime la información de la conexión y la aplicación correspondiente
        print('Connection: 127.0.0.1:8081 - PID: ' + pid + ' - State: ' + state + ' - App: ' + app_name)

# Espera a que mitmproxy termine
mitmproxy_process.kill()
