const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const nuevoPlayaudio = `

        // #playaudio - Audio de YouTube con info
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #playaudio (nombre de cancion)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                const axios = require('axios');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                
                // Obtener información del video
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                const infoOutput = './tmp/info_' + Date.now() + '.json';
                await execPromise(yt + ' -j "ytsearch1:' + busqueda.replace(/"/g, '\\"') + '" > ' + infoOutput, { timeout: 30000 });
                
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
                
                // Enviar imagen con información
                if (miniatura) {
                    await sock.sendMessage(remitente, { image: { url: miniatura }, caption: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\n┃ 🎤 *' + titulo.substring(0, 50) + '*\n┃ 👤 ' + canal + '\n┃ 👁️ ' + vistas + ' vistas\n┃ ⏱️ ' + duracion + '\n╰━━━━━━━━━━━━━━━━⬣' });
                } else {
                    await sock.sendMessage(remitente, { text: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\n┃ 🎤 ' + titulo.substring(0, 50) + '\n┃ 👤 ' + canal + '\n┃ 👁️ ' + vistas + ' vistas\n┃ ⏱️ ' + duracion + '\n╰━━━━━━━━━━━━━━━━⬣' });
                }
                
                // Descargar y enviar audio
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda.replace(/"/g, '\\"') + '"', { timeout: 60000 });
                
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: titulo + '.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error('No se descargo');
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Error: ' + error.message.substring(0, 50) + '\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Buscar y reemplazar el comando #playaudio existente
const oldPlayaudio = /\/\/ #playaudio[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
if (bot.includes('// #playaudio')) {
    bot = bot.replace(oldPlayaudio, nuevoPlayaudio);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ #playaudio mejorado con imagen e información');
} else {
    console.log('⚠️ No se encontró #playaudio');
}
