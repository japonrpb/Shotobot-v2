const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const comandos = `

        // #playaudio - Audio de YouTube (API delirius)
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (texto o link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.delirius.store/ytplay?query=' + encodeURIComponent(busqueda));
                if (response.data && response.data.data && response.data.data.audio) {
                    await sock.sendMessage(remitente, { audio: { url: response.data.data.audio }, mimetype: 'audio/mpeg' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #youtube - Video de YouTube
        if (texto.startsWith('#youtube')) {
            const link = texto.replace('#youtube', '').trim();
            if (!link) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #youtube (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.delirius.store/ytdl?url=' + encodeURIComponent(link));
                if (response.data && response.data.data && response.data.data.video) {
                    await sock.sendMessage(remitente, { video: { url: response.data.data.video }, caption: '✅ Video de YouTube' });
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
                const axios = require('axios');
                const response = await axios.get('https://api.delirius.store/igdl?url=' + encodeURIComponent(link));
                if (response.data && response.data.data && response.data.data.url) {
                    await sock.sendMessage(remitente, { video: { url: response.data.data.url }, caption: '📥 Video de Instagram' });
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
            if (!link || !link.includes('facebook.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #facebook (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.delirius.store/fbdl?url=' + encodeURIComponent(link));
                if (response.data && response.data.data && response.data.data.video) {
                    await sock.sendMessage(remitente, { video: { url: response.data.data.video }, caption: '📥 Video de Facebook' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #twitter - Video de Twitter
        if (texto.startsWith('#twitter')) {
            const link = texto.replace('#twitter', '').trim();
            if (!link || (!link.includes('twitter.com') && !link.includes('x.com'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #twitter (link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.delirius.store/twitter?url=' + encodeURIComponent(link));
                if (response.data && response.data.data && response.data.data.video) {
                    await sock.sendMessage(remitente, { video: { url: response.data.data.video }, caption: '📥 Video de Twitter/X' });
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
    bot = bot.replace('// #menu', comandos + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comandos agregados con API delirius.store');
} else {
    console.log('⚠️ No se encontró // #menu');
}
