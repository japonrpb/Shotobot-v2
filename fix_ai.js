const fs = require('fs');

console.log('🔧 Arreglando comando #shoto_ai...');

let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar el bloque del comando #shoto_ai y reemplazarlo
const oldBlock = /\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}\s*}/;
const newBlock = `        // #shoto_ai
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
                const url = 'https://api.ryzendesu.vip/api/ai/gpt?text=' + encodeURIComponent(pregunta);
                const response = await axios.get(url);
                let respuesta = response.data.response || response.data.message || response.data.result || "No pude procesar tu pregunta.";
                
                await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta.substring(0, 500) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error en IA:', error.message);
                try {
                    const axios = require('axios');
                    const url2 = 'https://api.popcat.xyz/gpt?prompt=' + encodeURIComponent(pregunta);
                    const response2 = await axios.get(url2);
                    let respuesta2 = response2.data.response || response2.data.text || "No pude procesar tu pregunta.";
                    await sock.sendMessage(remitente, { text: '╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ 📝 Pregunta: ' + pregunta.substring(0, 100) + '\\n┃ ✨ Respuesta: ' + respuesta2.substring(0, 500) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } catch (error2) {
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣\\n┃ ⚠️ Error de conexión\\n┃ 📌 Intenta más tarde\\n╰━━━━━━━━━━━━━━━━⬣' });
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                }
            }
        }`;

// Reemplazar el bloque
if (bot.includes('// #shoto_ai')) {
    bot = bot.replace(/\/\/ #shoto_ai[\s\S]*?}\s*}\s*}\s*}\s*}\s*}\s*}/, newBlock);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #shoto_ai actualizado');
} else {
    console.log('⚠️ No se encontró el comando, agregándolo...');
    // Buscar antes del menú
    if (bot.includes('// #menu')) {
        bot = bot.replace('// #menu', newBlock + '\n        // #menu');
        fs.writeFileSync('bot.js', bot);
        console.log('✅ Comando #shoto_ai agregado');
    }
}

console.log('🎉 Listo! Ejecuta: node bot.js');
