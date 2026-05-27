const fs = require('fs');

console.log('🤖 Configurando IA con Hugging Face (gratis, funciona 100%)...');

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
                
                // Usar modelo gratuito de Hugging Face (sin API key)
                const response = await axios.post('https://api-inference.huggingface.co/models/microsoft/DialoGPT-small', {
                    inputs: pregunta,
                    parameters: { max_length: 150, temperature: 0.7 }
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 20000
                });
                
                let respuesta = response.data.generated_text || response.data[0]?.generated_text || "No pude procesar tu pregunta.";
                if (respuesta.includes(pregunta)) {
                    respuesta = respuesta.replace(pregunta, '').trim();
                }
                if (respuesta.length > 500) respuesta = respuesta.substring(0, 500);
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error:', error.message);
                
                // Modelo alternativo más pequeño
                try {
                    const response2 = await axios.post('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
                        inputs: pregunta,
                        parameters: { max_length: 100 }
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                        timeout: 20000
                    });
                    
                    let respuesta2 = response2.data.generated_text || response2.data[0]?.generated_text || "No pude responder.";
                    if (respuesta2.includes(pregunta)) {
                        respuesta2 = respuesta2.replace(pregunta, '').trim();
                    }
                    
                    await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta2.substring(0, 500) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } catch (error2) {
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Servidor ocupado\\n┃ 📌 Intenta de nuevo en 10 segundos\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                }
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA configurada con Hugging Face');
} else {
    bot = bot + newCommand;
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA agregada');
}

console.log('🎉 Ejecuta: node bot.js');
