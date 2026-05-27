const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Eliminar comando viejo
const oldCommand = /\/\/ #addbot[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g;
bot = bot.replace(oldCommand, '');

const newCommand = `
        // #addbot (para que el bot entre a grupos)
        if (texto.startsWith('#addbot')) {
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
            
            let link = texto.split(' ')[1];
            if (!link) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 #addbot https://chat.whatsapp.com/CODIGO\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            link = link.trim();
            let code = link.includes('chat.whatsapp.com/') ? link.split('chat.whatsapp.com/')[1] : link;
            code = code.split('?')[0];
            code = code.split('/')[0];
            code = code.trim();
            
            if (!code || code.length < 5) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 Código de invitación inválido\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🔄', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🔗 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ ⏳ Intentando unirme...\\n┃ 📌 Código: ' + code + '\\n╰━━━━━━━━━━━━━━━━⬣' });
            
            try {
                // Método 1: groupAcceptInvite
                const result = await sock.groupAcceptInvite(code);
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ✅ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 🎉 ¡Me uní al grupo!\\n┃ 📌 ID: ' + result + '\\n╰━━━━━━━━━━━━━━━━⬣' });
            } catch (error) {
                console.log('Error groupAcceptInvite:', error.message);
                
                // Método 2: Intentar con query
                try {
                    const result2 = await sock.query({
                        tag: 'iq',
                        attrs: { type: 'set', xmlns: 'w:g2', to: '@g.us' },
                        content: [{ tag: 'add', attrs: {}, content: [{ tag: 'link', attrs: { code: code } }] }]
                    });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: '╭━━〔 ✅ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 🎉 ¡Me uní al grupo!\\n╰━━━━━━━━━━━━━━━━⬣' });
                } catch (error2) {
                    console.log('Error query:', error2.message);
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ ⚠️ No pude unirme\\n┃ 📌 El link puede estar expirado\\n┃ 📌 O el bot ya está en el grupo\\n╰━━━━━━━━━━━━━━━━⬣' });
                }
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
}

fs.writeFileSync('bot.js', bot);
console.log('✅ Comando #addbot actualizado');
