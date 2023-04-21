# Script to automate the proxy initialization and the execution of the frida script
# --------------------------------------------------------------------------------

import os

# Lista de apps que vamos a analizar
apps = ['com.aws.android']
# apps = ['com.aws.android', 'com.home.weather.radar',
#         'bp.free.puzzle.game.mahjong.onet', 'com.google.android.youtube', 'om.lbe.parallel.intl', 'video.like']

# Abrir otra terminal y ejecutar el script de frida
for app in apps:
    # Crear un archivo txt para cada aplicación
    os.system('frida -U -l traffic_dataAnalysis.js -f ' + app +
              ' > ' + app.replace('.', '_') + '.txt')
