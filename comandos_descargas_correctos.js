
        // #playaudio - Audio de YouTube
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
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda.replace(/"/g, '\\"') + '"', { timeout: 60000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: 'audio.mp3' });
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

        // #tiktok - Video de TikTok
        if (texto.startsWith('#tiktok')) {
            const link = texto.replace('#tiktok', '').trim();
            if (!link || !link.includes('tiktok.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #tiktok (link)\n╰━━━━━━━━━━━━━━━━⬣' });
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
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '"', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎵 *TIKTOK* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar TikTok\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
