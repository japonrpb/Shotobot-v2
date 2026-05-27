const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const comandoAudio = `

        // #playaudio - Audio de YouTube (API funcional)
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (texto o link)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const axios = require('axios');
                const response = await axios.get('https://api.ryzendesu.vip/api/downloader/ytmp3?url=' + encodeURIComponent(busqueda));
                if (response.data && response.data.url) {
                    await sock.sendMessage(remitente, { audio: { url: response.data.url }, mimetype: 'audio/mpeg' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', comandoAudio + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #playaudio agregado');
} else {
    console.log('⚠️ No se encontró // #menu');
}
