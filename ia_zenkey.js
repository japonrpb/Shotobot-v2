const fs = require('fs');

console.log('🤖 Configurando IA con ZenKey API (funciona 100%)...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Eliminar comando viejo
const oldCommand = /\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
bot = bot.replace(oldCommand, '');

const newCommand = `
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
                const axios = require('axios');
                
                // API de ZenKey - Funciona perfecto en Termux
                const response = await axios.post('https://zenkey-api.vercel.app/api/chat', {
                    message: pregunta,
                    user: 'shoto'
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                });
                
                let respuesta = response.data.reply || response.data.message || response.data.response || "No pude procesar tu pregunta.";
                if (respuesta.length > 500) respuesta = respuesta.substring(0, 500);
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error:', error.message);
                
                // API alternativa
                try {
                    const response2 = await axios.get('https://api.popcat.xyz/gpt?prompt=' + encodeURIComponent(pregunta), { timeout: 15000 });
                    let respuesta2 = response2.data.response || response2.data.text || "No pude procesar tu pregunta.";
                    if (respuesta2.length > 500) respuesta2 = respuesta2.substring(0, 500);
                    
                    await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta2 + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } catch (error2) {
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error de conexión\\n┃ 📌 Intenta de nuevo en unos segundos\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                }
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA configurada correctamente');
} else {
    console.log('⚠️ Buscando alternativa...');
    bot = bot + newCommand;
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA agregada al final');
}

console.log('🎉 Listo! Ejecuta: node bot.js');
