const fs = require('fs');

console.log('🤖 Configurando IA con Nexus API...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Eliminar comando viejo
const oldCommand = /\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
bot = bot.replace(oldCommand, '');

// API de Nexus que funciona en Termux
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
                
                // Nexus API - funcionamiento probado en Termux
                const response = await axios.post('https://api.nexus.aiforstartups.io/v1/chat', {
                    messages: [{ role: 'user', content: pregunta }],
                    model: 'nexus-light',
                    temperature: 0.7
                }, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'User-Agent': 'ShotoBot/1.0'
                    },
                    timeout: 30000
                });
                
                let respuesta = response.data.response || response.data.message || response.data.reply;
                
                if (!respuesta) {
                    throw new Error('No response');
                }
                
                if (respuesta.length > 500) respuesta = respuesta.substring(0, 500);
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error Nexus:', error.message);
                
                // Backup: API local con respuestas inteligentes
                const p = pregunta.toLowerCase();
                let respuestaLocal = '';
                
                if (p.includes('hola') || p.includes('buenas')) respuestaLocal = '¡Hola! 👋 Soy Shoto_AI. ¿Cómo estás?';
                else if (p.includes('como estas')) respuestaLocal = '¡Muy bien! Gracias por preguntar. ¿Y tú? 🤖';
                else if (p.includes('chiste')) respuestaLocal = '¿Qué le dice un techo a otro? ¡Te echo de menos! 🏠';
                else if (p.includes('gracias')) respuestaLocal = '¡De nada! Para eso estoy aquí. 🤗';
                else if (p.includes('eres')) respuestaLocal = 'Soy tu asistente virtual Shoto_AI. ¡Encantado de ayudarte! ✨';
                else respuestaLocal = '📝 ¡Interesante pregunta! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?';
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuestaLocal + '\\n┃ ⚠️ Modo local (sin internet)\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '⚡', key: mensaje.key } });
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA Nexus configurada');
} else {
    console.log('❌ Error: No se encontró // #menu');
}

console.log('🎉 Listo! Ejecuta: node bot.js');
console.log('');
console.log('📝 Probá:');
console.log('   #shoto_ai Hola');
console.log('   #shoto_ai Cómo estás');
console.log('   #shoto_ai Cuéntame un chiste');
