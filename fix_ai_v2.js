const fs = require('fs');

console.log('🔧 Arreglando comando #shoto_ai con API funcional...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar y eliminar el comando viejo si existe
const oldCommand = /\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
bot = bot.replace(oldCommand, '');

// Agregar el nuevo comando funcional
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
                // Usar API de GPT4Free
                const response = await axios.post('https://api.g4f.icu/gpt', {
                    prompt: pregunta,
                    model: 'gpt-3.5-turbo'
                });
                
                let respuesta = response.data.response || response.data.message || response.data.text || "Lo siento, no pude procesar tu pregunta.";
                
                // Limitar longitud de respuesta
                if (respuesta.length > 500) respuesta = respuesta.substring(0, 500) + '...';
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 80) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error en IA:', error.message);
                // Segunda opción - API alternativa
                try {
                    const axios = require('axios');
                    const response2 = await axios.get('https://api.yanxian.me/v1/chat?text=' + encodeURIComponent(pregunta));
                    let respuesta2 = response2.data.text || response2.data.message || "No pude responder.";
                    
                    if (respuesta2.length > 500) respuesta2 = respuesta2.substring(0, 500) + '...';
                    
                    await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 80) + '\\n┃ ✨ Respuesta: ' + respuesta2 + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } catch (error2) {
                    // Tercera opción - respuestas locales
                    const respuestasLocales = [
                        "¡Hola! Soy Shoto_AI, tu asistente virtual. ¿En qué puedo ayudarte?",
                        "Interesante pregunta. La respuesta es que todo depende del contexto.",
                        "Según mi base de datos, eso es algo que deberías investigar más a fondo.",
                        "¡Vaya! No esperaba esa pregunta. Déjame pensar...",
                        "Como inteligencia artificial, te recomiendo que disfrutes el momento.",
                        "La respuesta a tu pregunta es más simple de lo que crees. ¡Sigue adelante!"
                    ];
                    const respuestaLocal = respuestasLocales[Math.floor(Math.random() * respuestasLocales.length)];
                    
                    await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 80) + '\\n┃ ✨ Respuesta: ' + respuestaLocal + '\\n┃ ⚠️ Modo offline\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '⚠️', key: mensaje.key } });
                }
            }
        }
`;

// Buscar donde insertar el comando (antes de // #menu)
if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #shoto_ai agregado correctamente');
} else {
    console.log('⚠️ No se encontró // #menu, agregando al final...');
    // Buscar la última llave de iniciarBot
    const lastBrace = bot.lastIndexOf('}');
    if (lastBrace > 0) {
        bot = bot.slice(0, lastBrace - 10) + newCommand + bot.slice(lastBrace - 10);
        fs.writeFileSync('bot.js', bot);
        console.log('✅ Comando #shoto_ai agregado');
    }
}

console.log('🎉 ¡Listo! Ahora ejecuta: node bot.js');
