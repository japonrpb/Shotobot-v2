const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar la sección de protección y agregar la verificación de mute
const oldCode = `    // Procesar mensajes para protecciones
    sock.ev.on('messages.upsert', async (m) => {
        const mensaje = m.messages[0];
        if (!mensaje.message) return;
        
        const remitente = mensaje.key.remoteJid;
        const sender = mensaje.key.participant || remitente;
        const isGroupChat = remitente.endsWith('@g.us');
        
        if (!isGroupChat || mensaje.key.fromMe) return;
        
        const userIsAdmin = await isAdmin(remitente, sender);
        if (userIsAdmin) return;
        
        await checkSpam(remitente, sender, mensaje.key);`;

const newCode = `    // Procesar mensajes para protecciones
    sock.ev.on('messages.upsert', async (m) => {
        const mensaje = m.messages[0];
        if (!mensaje.message) return;
        
        const remitente = mensaje.key.remoteJid;
        const sender = mensaje.key.participant || remitente;
        const isGroupChat = remitente.endsWith('@g.us');
        
        if (!isGroupChat || mensaje.key.fromMe) return;
        
        // VERIFICAR MUTE (más importante que todo)
        const estaMuteado = await checkAndDeleteMuted(remitente, sender, mensaje.key);
        if (estaMuteado) return;
        
        const userIsAdmin = await isAdmin(remitente, sender);
        if (userIsAdmin) return;
        
        await checkSpam(remitente, sender, mensaje.key);`;

if (bot.includes(oldCode)) {
    bot = bot.replace(oldCode, newCode);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Corrección aplicada correctamente');
} else {
    console.log('❌ No se encontró el código exacto, intentando método alternativo...');
    
    // Método alternativo
    const lines = bot.split('\n');
    let newLines = [];
    let muteAdded = false;
    
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (lines[i].includes('if (!isGroupChat || mensaje.key.fromMe) return;') && !muteAdded) {
            newLines.push('        ');
            newLines.push('        // VERIFICAR MUTE');
            newLines.push('        const estaMuteado = await checkAndDeleteMuted(remitente, sender, mensaje.key);');
            newLines.push('        if (estaMuteado) return;');
            muteAdded = true;
        }
    }
    
    if (muteAdded) {
        fs.writeFileSync('bot.js', newLines.join('\n'));
        console.log('✅ Corrección aplicada (método alternativo)');
    } else {
        console.log('❌ No se pudo aplicar la corrección');
    }
}
