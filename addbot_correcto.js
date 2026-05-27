const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar donde agregar el comando (antes de // #menu)
const comando = `
        // #addbot (para que el bot entre a grupos)
        if (texto.startsWith('#addbot') && texto.includes('https://chat.whatsapp.com/')) {
            const esGrupo = remitente.endsWith('@g.us');
            let esAdmin = true;
            
            if (esGrupo) {
                const grupoMeta = await sock.groupMetadata(remitente);
                const usuario = grupoMeta.participants.find(p => p.id === sender);
                esAdmin = usuario && (usuario.admin === 'admin' || usuario.admin === 'superadmin');
            }
            
            if (!esAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ ⚠️ Solo administradores\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            const link = texto.split(' ')[1];
            if (!link || !link.includes('https://chat.whatsapp.com/')) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 #addbot (link de invitación)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🔄', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🔗 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ ⏳ Intentando unirme al grupo...\\n╰━━━━━━━━━━━━━━━━⬣' });
            
            try {
                const code = link.split('https://chat.whatsapp.com/')[1];
                await sock.groupAcceptInvite(code);
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ✅ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 🎉 ¡Me uní al grupo con éxito!\\n┃ 📌 Hazme admin para funcionar\\n╰━━━━━━━━━━━━━━━━⬣' });
            } catch (error) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ ⚠️ No pude unirme\\n┃ 📌 Link inválido o expirado\\n╰━━━━━━━━━━━━━━━━⬣' });
            }
        }
`;

// Insertar antes de // #menu
bot = bot.replace('// #menu', comando + '\n        // #menu');
fs.writeFileSync('bot.js', bot);
console.log('✅ Comando #addbot agregado correctamente');
