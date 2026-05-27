const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar y reemplazar el comando #playaudio existente
const lines = bot.split('\n');
let newLines = [];
let skipMode = false;
let braceCount = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('// #playaudio')) {
        skipMode = true;
        braceCount = 0;
        continue;
    }
    
    if (skipMode) {
        if (line.includes('{')) braceCount++;
        if (line.includes('}')) braceCount--;
        if (braceCount < 0 || (braceCount === 0 && line.trim() === '}')) {
            skipMode = false;
            continue;
        }
        continue;
    }
    
    newLines.push(line);
}

const nuevoComando = `
        // #playaudio - Audio de YouTube (con mejor búsqueda)
        if (texto.startsWith('#playaudio')) {
            let busqueda = texto.replace('#playaudio', '').trim();
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
                
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                
                // Limpiar búsqueda para caracteres especiales
                let busquedaLimpia = busqueda
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-zA-Z0-9 ]/g, "");
                
                if (!busquedaLimpia) busquedaLimpia = busqueda;
                
                let titulo = 'Audio';
                let canal = 'Desconocido';
                let vistas = 'N/A';
                let miniatura = '';
                
                try {
                    const { stdout } = await execPromise(yt + ' -j "ytsearch1:' + busquedaLimpia + '"', { timeout: 30000 });
                    const info = JSON.parse(stdout);
                    titulo = info.title || 'Audio';
                    canal = info.uploader || info.channel || 'Desconocido';
                    vistas = info.view_count ? info.view_count.toLocaleString() : 'N/A';
                    miniatura = info.thumbnail || '';
                } catch(e) {
                    // Si falla, intentar con la búsqueda original
                    try {
                        const { stdout } = await execPromise(yt + ' -j "ytsearch1:' + busqueda + '"', { timeout: 30000 });
                        const info = JSON.parse(stdout);
                        titulo = info.title || 'Audio';
                        canal = info.uploader || info.channel || 'Desconocido';
                        vistas = info.view_count ? info.view_count.toLocaleString() : 'N/A';
                        miniatura = info.thumbnail || '';
                    } catch(e2) {}
                }
                
                if (miniatura) {
                    await sock.sendMessage(remitente, { image: { url: miniatura }, caption: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 *' + titulo.substring(0, 50) + '*\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                } else {
                    await sock.sendMessage(remitente, { text: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\\n┃ 🎤 ' + titulo.substring(0, 50) + '\\n┃ 👤 ' + canal + '\\n┃ 👁️ ' + vistas + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                }
                
                // Descargar audio
                let cmd = yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busquedaLimpia + '"';
                try {
                    await execPromise(cmd, { timeout: 60000 });
                } catch(e) {
                    cmd = yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda + '"';
                    await execPromise(cmd, { timeout: 60000 });
                }
                
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: titulo + '.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error('No se descargo');
                }
            } catch (error) {
                console.log('Error:', error.message);
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n┃ 📌 Prueba con el nombre exacto\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Insertar antes de // #menu
for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].includes('// #menu')) {
        newLines.splice(i, 0, nuevoComando);
        break;
    }
}

fs.writeFileSync('bot.js', newLines.join('\n'));
console.log('✅ #playaudio mejorado - ahora busca sin acentos');
