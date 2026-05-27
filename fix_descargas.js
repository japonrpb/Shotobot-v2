const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const descargasFix = `

        // #playaudio - Audio de YouTube (corregido)
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (texto o link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const ytdl = require('@distube/ytdl-core');
                let videoUrl = busqueda;
                if (!busqueda.includes('youtube.com') && !busqueda.includes('youtu.be')) {
                    const searchUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(busqueda);
                    const axios = require('axios');
                    const searchRes = await axios.get(searchUrl);
                    const videoIdMatch = searchRes.data.match(/watch\\?v=([a-zA-Z0-9_-]{11})/);
                    if (videoIdMatch) {
                        videoUrl = 'https://www.youtube.com/watch?v=' + videoIdMatch[1];
                    } else {
                        throw new Error('No se encontró el video');
                    }
                }
                const info = await ytdl.getInfo(videoUrl);
                const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
                const title = info.videoDetails.title;
                const author = info.videoDetails.author.name;
                const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
                await sock.sendMessage(remitente, { image: { url: thumbnail }, caption: '🎵 *' + title + '*\\n👤 ' + author });
                await sock.sendMessage(remitente, { audio: audioStream, mimetype: 'audio/mpeg', fileName: title + '.mp3' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            } catch (error) {
                console.log('Error playaudio:', error.message);
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n┃ 📌 Intenta con un link directo\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #youtube - Descargar video de YouTube (corregido)
        if (texto.startsWith('#youtube')) {
            const link = texto.replace('#youtube', '').trim();
            if (!link || (!link.includes('youtube.com') && !link.includes('youtu.be'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #youtube (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const ytdl = require('@distube/ytdl-core');
                const info = await ytdl.getInfo(link);
                const videoStream = ytdl(link, { quality: 'lowest' });
                const title = info.videoDetails.title;
                const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
                await sock.sendMessage(remitente, { image: { url: thumbnail }, caption: '🎬 *' + title + '*\\n📥 Descargando...' });
                await sock.sendMessage(remitente, { video: videoStream, caption: '✅ ' + title });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #facebook - Usando API alternativa
        if (texto.startsWith('#facebook')) {
            const link = texto.replace('#facebook', '').trim();
            if (!link || !link.includes('facebook.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #facebook (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://p.oceansaver.in/ajax/download.php', { params: { url: link } });
                if (response.data && response.data.video_url) {
                    await sock.sendMessage(remitente, { video: { url: response.data.video_url }, caption: '📥 Video de Facebook' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #instagram - Usando API alternativa
        if (texto.startsWith('#instagram')) {
            const link = texto.replace('#instagram', '').trim();
            if (!link || !link.includes('instagram.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #instagram (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.instagram.com/oembed', { params: { url: link } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ⚠️ INSTAGRAM 〕━━━⬣\\n┃ Instagram no permite descargas directas\\n┃ 📌 Usa el comando #tiktok para videos\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '⚠️', key: mensaje.key } });
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Instagram bloquea descargas\\n┃ 📌 Usa #tiktok para videos similares\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #twitter - Usando API alternativa
        if (texto.startsWith('#twitter')) {
            const link = texto.replace('#twitter', '').trim();
            if (!link || (!link.includes('twitter.com') && !link.includes('x.com'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #twitter (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://twitsave.com/info', { params: { url: link } });
                if (response.data && response.data.video_url) {
                    await sock.sendMessage(remitente, { video: { url: response.data.video_url }, caption: '📥 Video de Twitter/X' });
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

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', descargasFix + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comandos de descarga actualizados');
} else {
    console.log('⚠️ No se encontró // #menu');
}
