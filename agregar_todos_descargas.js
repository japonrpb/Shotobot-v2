const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar la posición exacta donde termina el comando #dato
const lines = bot.split('\n');
let insertPos = -1;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('// #dato')) {
        insertPos = i;
        break;
    }
}

if (insertPos === -1) {
    console.log('No se encontró // #dato');
    process.exit(1);
}

// Buscar la llave de cierre del comando #dato
for (let i = insertPos; i < lines.length; i++) {
    if (lines[i].trim() === '}') {
        insertPos = i;
        break;
    }
}

console.log(`Insertando comandos en línea: ${insertPos + 1}`);

const comandos = `
        // #playaudio - Audio de YouTube con info
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
                const axios = require('axios');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                
                // Obtener información del video
                const infoOutput = './tmp/info_' + Date.now() + '.json';
                await execPromise(yt + ' -j "ytsearch1:' + busqueda.replace(/"/g, '\\\\"') + '" > ' + infoOutput, { timeout: 30000 });
                
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
                    await sock.sendMessage(remitente, { image: { url: miniatura }, caption: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 *' + titulo.substring(0, 50) + '*\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + ' vistas\\n┃ ⏱️ ' + duracion + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                } else {
                    await sock.sendMessage(remitente, { text: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 ' + titulo.substring(0, 50) + '\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + ' vistas\\n┃ ⏱️ ' + duracion + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                }
                
                // Descargar y enviar audio
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda.replace(/"/g, '\\\\"') + '"', { timeout: 60000 });
                
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: titulo + '.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error('No se descargo');
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Error: ' + error.message.substring(0, 50) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
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
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎵 *TIKTOK* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar TikTok\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #youtube - Video de YouTube
        if (texto.startsWith('#youtube')) {
            const link = texto.replace('#youtube', '').trim();
            if (!link || (!link.includes('youtube.com') && !link.includes('youtu.be'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #youtube (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/yt_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 60000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎬 *YOUTUBE* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
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

        // #instagram - Video de Instagram
        if (texto.startsWith('#instagram')) {
            const link = texto.replace('#instagram', '').trim();
            if (!link || !link.includes('instagram.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #instagram (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/ig_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 📷 *INSTAGRAM* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
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

        // #facebook - Video de Facebook
        if (texto.startsWith('#facebook')) {
            const link = texto.replace('#facebook', '').trim();
            if (!link || (!link.includes('facebook.com') && !link.includes('fb.watch'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #facebook (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/fb_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 📘 *FACEBOOK* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
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

        // #twitter - Video de Twitter/X
        if (texto.startsWith('#twitter')) {
            const link = texto.replace('#twitter', '').trim();
            if (!link || (!link.includes('twitter.com') && !link.includes('x.com'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #twitter (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/tw_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🐦 *TWITTER/X* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣' });
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
`;

// Insertar en la posición encontrada
lines.splice(insertPos + 1, 0, comandos);
const newContent = lines.join('\n');
fs.writeFileSync('bot.js', newContent);
console.log('✅ Todos los comandos de descarga agregados correctamente');
