const fs = require('fs');
const axios = require('axios');

console.log('🤖 Configurando IA para ShotoBot...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Eliminar comando viejo si existe
const oldCommand = /\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
bot = bot.replace(oldCommand, '');

// API gratuita de Groq (más rápida y confiable)
// Solo necesitas registrarte gratis en https://console.groq.com
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
                // Usar API de Groq (gratis con registro) o una API pública alternativa
                const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                    model: 'mixtral-8x7b-32768',
                    messages: [{ role: 'user', content: pregunta }],
                    temperature: 0.7,
                    max_tokens: 500
                }, {
                    headers: {
                        'Authorization': 'Bearer gsk_public_demo_key', // Reemplazar con tu API key real
                        'Content-Type': 'application/json'
                    }
                });
                
                let respuesta = response.data.choices[0].message.content;
                if (respuesta.length > 500) respuesta = respuesta.substring(0, 500);
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error:', error.message);
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error de conexión\\n┃ 📌 Obtén una API key gratis en console.groq.com\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

// Insertar el comando
if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA configurada');
} else {
    console.log('⚠️ No se encontró // #menu');
}

console.log('📝 PRÓXIMO PASO: Obtén tu API key gratis en https://console.groq.com');
console.log('🎉 Luego ejecuta: node bot.js');
