const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const oldPlayaudio = /\/\/ #playaudio[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;

const fixedPlayaudio = `
        // #playaudio - Audio de YouTube con info (definitivo)
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (nombre de cancion)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            
            let audioEnviado = false;
            
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                
                // Escapar la búsqueda correctamente
                const buscarEscapado = busqueda.replace(/[\\"']/g, '\\\\$&').replace(/[áéíóú]/gi, function(m) {
                    const map = { 'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u', 'Á':'A', 'É':'E', 'Í':'I', 'Ó':'O', 'Ú':'U' };
                    return map[m];
                });
                
                const infoOutput = './tmp/info_' + Date.now() + '.json';
                try {
                    await execPromise(yt + ' -j "ytsearch1:' + buscarEscapado + '" > ' + infoOutput + ' 2>/dev/null', { timeout: 30000 });
                } catch(e) {}
                
                let titulo = 'Audio';
                let canal = 'Desconocido';
                let vistas = 'N/A';
                let duracion = 'N/A';
                let miniatura = '';
                
                if (fs3.existsSync(infoOutput)) {
                    const infoRaw = fs3.readFileSync(infoOutput, 'utf8');
                    try {
                        const info = JSON.parse(infoRaw);
                        titulo = info.title || 'Audio';
                        canal = info.uploader || info.channel || 'Desconocido';
                        vistas = info.view_count ? info.view_count.toLocaleString() : 'N/A';
                        const seg = info.duration || 0;
                        const minutos = Math.floor(seg / 60);
                        const segundos = seg % 60;
                        duracion = minutos + ':' + (segundos < 10 ? '0' : '') + segundos;
                        miniatura = info.thumbnail || '';
                    } catch(e) {}
                    fs3.unlinkSync(infoOutput);
                }
                
                if (miniatura) {
                    await sock.sendMessage(remitente, { image: { url: miniatura }, caption: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 *' + titulo.substring(0, 50) + '*\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + ' vistas\\n┃ ⏱️ ' + duracion + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                } else {
                    await sock.sendMessage(remitente, { text: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 ' + titulo.substring(0, 50) + '\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + ' vistas\\n┃ ⏱️ ' + duracion + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                }
                
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + buscarEscapado + '" 2>/dev/null', { timeout: 90000 });
                
                if (fs3.existsSync(outputPath) && !audioEnviado) {
                    audioEnviado = true;
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: titulo + '.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else if (!audioEnviado) {
                    throw new Error('No se pudo descargar');
                }
            } catch (error) {
                if (!audioEnviado) {
                    console.log('Error playaudio:', error.message);
                    let msgError = '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n';
                    if (error.message && error.message.includes('HTTP Error 403')) {
                        msgError = '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Video restringido o no disponible\\n';
                    } else if (error.message && error.message.includes('No video results')) {
                        msgError = '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se encontró la canción\\n';
                    }
                    msgError += '╰━━━━━━━━━━━━━━━━⬣';
                    await sock.sendMessage(remitente, { text: msgError });
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                }
            }
        }
`;

if (bot.includes('// #playaudio')) {
    bot = bot.replace(oldPlayaudio, fixedPlayaudio);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ #playaudio corregido definitivamente');
} else {
    console.log('❌ No se encontró #playaudio');
}
