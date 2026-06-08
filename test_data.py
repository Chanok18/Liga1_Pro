import urllib.request
import json

# Verificar equipos
try:
    r = urllib.request.urlopen('http://127.0.0.1:8080/api/equipos', timeout=5)
    equipos = json.loads(r.read())
    print(f"✅ Equipos cargados: {len(equipos)}")
except Exception as e:
    print(f"❌ Error equipos: {e}")

# Verificar jugadores
try:
    r = urllib.request.urlopen('http://127.0.0.1:8080/api/jugadores', timeout=5)
    jugadores = json.loads(r.read())
    print(f"✅ Jugadores cargados: {len(jugadores)}")
except Exception as e:
    print(f"❌ Error jugadores: {e}")

# Verificar partidos
try:
    r = urllib.request.urlopen('http://127.0.0.1:8080/api/partidos', timeout=5)
    partidos = json.loads(r.read())
    print(f"✅ Partidos cargados: {len(partidos)}")
    
    # Detallar por estado
    finalizados = [p for p in partidos if p.get('estado') == 'FINALIZADO']
    en_vivo = [p for p in partidos if p.get('estado') == 'EN_VIVO']
    programados = [p for p in partidos if p.get('estado') == 'PROGRAMADO']
    
    print(f"  - Finalizados: {len(finalizados)}")
    print(f"  - En vivo: {len(en_vivo)}")
    print(f"  - Programados: {len(programados)}")
except Exception as e:
    print(f"❌ Error partidos: {e}")
