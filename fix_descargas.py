import re

# Leer el archivo
with open('bot.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Buscar donde termina el comando #dato y antes de // #menu
# Encontrar la posición de // #menu
menu_pos = content.find('        // #menu')

if menu_pos == -1:
    print("No se encontró // #menu")
    exit(1)

# Buscar hacia atrás para encontrar el final del comando #dato
# Buscar la última llave antes de // #menu
search_start = menu_pos - 500
if search_start < 0:
    search_start = 0

# Encontrar la posición de la llave de cierre del último comando
last_brace = content.rfind('}', search_start, menu_pos)

if last_brace == -1:
    last_brace = menu_pos

# Comandos a insertar
comandos = '''

        // #playaudio - Audio de YouTube
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (nombre de cancion)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                await execPromise('yt-dlp -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda.replace(/"/g, '\\\\"') + '"', { timeout: 60000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: { url: outputPath }, mimetype: 'audio/mpeg', fileName: 'audio.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #tiktok - Video de TikTok
        if (texto.startsWith('#tiktok')) {
            const link = texto.replace('#tiktok', '').trim();
            if (!link || !link.includes('tiktok.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #tiktok (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/tiktok_' + Date.now() + '.mp4';
                await execPromise('yt-dlp -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: { url: outputPath }, caption: '╭━━〔 🎵 *TIKTOK* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
'''

# Insertar los comandos
new_content = content[:last_brace] + comandos + content[last_brace:]

# Guardar
with open('bot.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("✅ Comandos agregados correctamente")
