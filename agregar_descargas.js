const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const descargas = `

        // #playaudio - Audio de YouTube
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (texto o link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const ytdl = require('ytdl-core');
                const axios = require('axios');
                let videoUrl = busqueda;
                if (!busqueda.includes('youtube.com') && !busqueda.includes('youtu.be')) {
                    const searchRes = await axios.get('https://yt-api.vercel.app/api/search?q=' + encodeURIComponent(busqueda));
                    if (searchRes.data.videos && searchRes.data.videos[0]) {
                        videoUrl = 'https://youtube.com/watch?v=' + searchRes.data.videos[0].videoId;
                    }
                }
                const info = await ytdl.getInfo(videoUrl);
                const audioStream = ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
                const title = info.videoDetails.title;
                const author = info.videoDetails.author.name;
                const views = info.videoDetails.viewCount;
                const likes = info.videoDetails.likes || 'N/A';
                const thumbnail = info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url;
                await sock.sendMessage(remitente, { image: { url: thumbnail }, caption: '🎵 *' + title + '*\\n👤 ' + author + '\\n👁️ ' + views + ' views\\n❤️ ' + likes + ' likes' });
                await sock.sendMessage(remitente, { audio: audioStream, mimetype: 'audio/mpeg', fileName: title + '.mp3' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #tiktok
        if (texto.startsWith('#tiktok')) {
            const link = texto.replace('#tiktok', '').trim();
            if (!link || !link.includes('tiktok.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #tiktok (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://tikwm.com/api/', { params: { url: link }, timeout: 30000 });
                if (response.data && response.data.data) {
                    await sock.sendMessage(remitente, { video: { url: response.data.data.play }, caption: '🎬 Video de TikTok' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else throw new Error('No se pudo obtener');
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #youtube
        if (texto.startsWith('#youtube')) {
            const link = texto.replace('#youtube', '').trim();
            if (!link || (!link.includes('youtube.com') && !link.includes('youtu.be'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #youtube (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const ytdl = require('ytdl-core');
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

        // #facebook
        if (texto.startsWith('#facebook')) {
            const link = texto.replace('#facebook', '').trim();
            if (!link || !link.includes('facebook.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #facebook (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://fb.watch/api/download', { params: { url: link } });
                if (response.data && response.data.videoUrl) {
                    await sock.sendMessage(remitente, { video: { url: response.data.videoUrl }, caption: '📥 Video de Facebook' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else throw new Error();
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #instagram
        if (texto.startsWith('#instagram')) {
            const link = texto.replace('#instagram', '').trim();
            if (!link || !link.includes('instagram.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #instagram (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index', { params: { url: link }, headers: { 'X-RapidAPI-Key': 'demo', 'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com' } });
                if (response.data && response.data.video) {
                    await sock.sendMessage(remitente, { video: { url: response.data.video }, caption: '📥 Video de Instagram' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else throw new Error();
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #twitter
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
                } else throw new Error();
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Insertar antes de // #menu
if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', descargas + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comandos de descarga agregados');
} else {
    console.log('⚠️ No se encontró // #menu');
}
