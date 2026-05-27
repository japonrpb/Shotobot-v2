const fs = require('fs');

console.log('🤖 Configurando IA real para ShotoBot...');

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
                const https = require('https');
                
                const postData = JSON.stringify({
                    messages: [{ role: "user", content: pregunta }],
                    model: "deepseek-r1-1.5b",
                    max_tokens: 500,
                    temperature: 0.7
                });
                
                const options = {
                    hostname: 'api.blackbox.ai',
                    path: '/api/chat',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(postData)
                    },
                    timeout: 30000
                };
                
                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', (chunk) => { data += chunk; });
                    res.on('end', async () => {
                        try {
                            const json = JSON.parse(data);
                            let respuesta = json.response || json.message || json.text || "No pude procesar tu pregunta.";
                            if (respuesta.length > 500) respuesta = respuesta.substring(0, 500);
                            await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                        } catch (e) {
                            await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error al procesar\\n╰━━━━━━━━━━━━━━━━⬣' });
                        }
                    });
                });
                
                req.on('error', async (error) => {
                    console.log('Error:', error.message);
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error de conexión\\n┃ 📌 Prueba de nuevo\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                });
                
                req.write(postData);
                req.end();
                
            } catch (error) {
                console.log('Error:', error.message);
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error inesperado\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ IA real configurada');
} else {
    console.log('❌ Error');
}

console.log('🎉 Ejecuta: node bot.js');
