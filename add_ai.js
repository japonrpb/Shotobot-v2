const fs = require('fs');

console.log('📦 Agregando comando #shoto_ai al bot...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Verificar si ya existe el comando
if (bot.includes('#shoto_ai')) {
    console.log('⚠️ El comando #shoto_ai ya existe');
    process.exit(0);
}

// Buscar donde agregar el comando (después de #dato)
const datoPattern = /\/\/ #dato[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/;
const aiCommand = `
        // #shoto_ai
        if (texto.startsWith('#shoto_ai')) {
            const pregunta = texto.replace('#shoto_ai', '').trim();
            if (!pregunta) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 #shoto_ai (tu pregunta)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🤔', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 💭 Pensando...\\n╰━━━━━━━━━━━━━━━━⬣' });
            
            try {
                const https = require('https');
                const url = 'https://api.nekosia.cat/api/gemini?text=' + encodeURIComponent(pregunta);
                
                const response = await fetch(url);
                const data = await response.json();
                let respuesta = data.response || data.message || data.text || "No pude procesar tu pregunta.";
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta.substring(0, 500) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error en IA:', error.message);
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error de conexión\\n┃ 📌 Intenta más tarde\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Buscar al final de la sección de comandos (antes de // #menu)
if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', aiCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #shoto_ai agregado correctamente (antes del menú)');
} else {
    console.log('⚠️ Buscando alternativa...');
    // Buscar el último comando antes de iniciarBot
    const lines = bot.split('\n');
    let newLines = [];
    let added = false;
    
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (!added && lines[i].includes('// #menu')) {
            newLines.push(aiCommand);
            added = true;
        }
    }
    
    if (added) {
        fs.writeFileSync('bot.js', newLines.join('\n'));
        console.log('✅ Comando #shoto_ai agregado correctamente');
    } else {
        console.log('❌ No se pudo agregar el comando');
    }
}

console.log('🎉 ¡Listo! Ahora ejecuta: node bot.js');
