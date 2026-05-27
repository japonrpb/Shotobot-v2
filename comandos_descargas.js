// ==================== COMANDOS DE DESCARGA ====================

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
        await execPromise(`yt-dlp -x --audio-format mp3 -o "${outputPath}" "ytsearch1:${busqueda}"`, { timeout: 60000 });
        if (fs3.existsSync(outputPath)) {
            await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: 'audio.mp3' });
            fs3.unlinkSync(outputPath);
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
        } else {
            throw new Error('No se descargo');
        }
    } catch (error) {
        await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Error al descargar audio\n╰━━━━━━━━━━━━━━━━⬣' });
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
        await execPromise(`yt-dlp -f best -o "${outputPath}" "${link}"`, { timeout: 30000 });
        if (fs3.existsSync(outputPath)) {
            await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎵 *TIKTOK* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
            fs3.unlinkSync(outputPath);
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
        } else {
            throw new Error('No se descargo');
        }
    } catch (error) {
        await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar TikTok\n╰━━━━━━━━━━━━━━━━⬣' });
        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
    }
}

// #youtube - Video de YouTube
if (texto.startsWith('#youtube')) {
    const link = texto.replace('#youtube', '').trim();
    if (!link) {
        await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #youtube (link)\n╰━━━━━━━━━━━━━━━━⬣' });
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
        await execPromise(`yt-dlp -f best -o "${outputPath}" "${link}"`, { timeout: 60000 });
        if (fs3.existsSync(outputPath)) {
            await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎬 *YOUTUBE* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
            fs3.unlinkSync(outputPath);
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
        } else {
            throw new Error('No se descargo');
        }
    } catch (error) {
        await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar video\n╰━━━━━━━━━━━━━━━━⬣' });
        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
    }
}
