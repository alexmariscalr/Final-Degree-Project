# Script to automate the proxy initialization and the execution of the frida script
# --------------------------------------------------------------------------------

import os

# Lista de apps que vamos a analizar
apps = ['com.aws.android', 'com.wego.android', 'fr.vinted',
        'jp.pokemon.pokemonunite', 'com.abc.news']

# Abrir otra terminal y ejecutar el script de frida
for app in apps:
    # Crear un archivo txt para cada aplicación
    os.system('frida -U -l apps/traffic_dataAnalysis.js -f ' + app +
              ' > apps/' + app.replace('.', '_') + '.txt')
