const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Eliminar todas las versiones anteriores del comando
const lines = bot.split('\n');
let newLines = [];
let dentroPlayaudio = false;
let llavesAbiertas = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('// #playaudio')) {
        dentroPlayaudio = true;
        llavesAbiertas = 0;
        continue;
    }
    
    if (dentroPlayaudio) {
        if (line.includes('{')) llavesAbiertas++;
        if (line.includes('}')) llavesAbiertas--;
        if (llavesAbiertas < 0) {
            dentroPlayaudio = false;
            continue;
        }
        continue;
    }
    
    newLines.push(line);
}

const nuevoComando = `
        // #playaudio - Audio de YouTube (versión simple y funcional)
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (nombre de cancion)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            
            const { exec } = require('child_process');
            const util = require('util');
            const execPromise = util.promisify(exec);
            const fs3 = require('fs');
            
            if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
            
            const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
            const outputPath = './tmp/audio_' + Date.now() + '.mp3';
            
            try {
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda + '"', { timeout: 60000 });
                
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: 'audio.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error('No se descargo');
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Buscar dónde insertar (antes de // #menu)
for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].includes('// #menu')) {
        newLines.splice(i, 0, nuevoComando);
        break;
    }
}

fs.writeFileSync('bot.js', newLines.join('\n'));
console.log('✅ #playaudio reemplazado por versión simple');
