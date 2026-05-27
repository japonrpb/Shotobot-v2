const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const newCommand = `
        // #addbot (unirse a grupos con minimo 15 miembros)
        if (texto.startsWith('#addbot')) {
            const link = texto.split(' ')[1];
            if (!link || !link.includes('https://chat.whatsapp.com/')) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #addbot (link de invitacion)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🔄', key: mensaje.key } });
            
            try {
                let code = link.split('https://chat.whatsapp.com/')[1];
                code = code.split('?')[0];
                code = code.split('/')[0];
                code = code.trim();
                
                if (!code || code.length < 5) {
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 Link invalido\\n╰━━━━━━━━━━━━━━━━⬣' });
                    return;
                }
                
                // Obtener informacion del grupo
                const groupInfo = await sock.groupGetInviteInfo(code);
                const memberCount = groupInfo.size || groupInfo.participants?.length || 0;
                const groupName = groupInfo.subject || groupInfo.title || 'Sin nombre';
                
                if (memberCount < 15) {
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ADDBOT 〕━━━⬣\\n┃ 📌 Grupo: ' + groupName + '\\n┃ 👥 Miembros: ' + memberCount + '\\n┃ ⚠️ Minimo requerido: 15\\n┃ 🚫 No me puedo unir\\n╰━━━━━━━━━━━━━━━━⬣' });
                    return;
                }
                
                // Confirmar que se unira
                await sock.sendMessage(remitente, { text: '╭━━〔 🔗 ADDBOT 〕━━━⬣\\n┃ ✅ Grupo: ' + groupName + '\\n┃ 👥 Miembros: ' + memberCount + '\\n┃ ⏳ Me unire en 1 minuto...\\n╰━━━━━━━━━━━━━━━━⬣' });
                
                // Esperar 1 minuto
                await new Promise(resolve => setTimeout(resolve, 60000));
                
                // Unirse al grupo
                await sock.groupAcceptInvite(code);
                
                // Mensaje de exito
                await sock.sendMessage(remitente, { text: '╭━━〔 ✅ ADDBOT 〕━━━⬣\\n┃ 🎉 @' + await getContactName(sender) + '\\n┃ 📌 ¡Me uni al grupo con exito!\\n┃ 👑 Dame admin para funcionar\\n╰━━━━━━━━━━━━━━━━⬣', mentions: [sender] });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error en #addbot:', error.message);
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No pude verificar el grupo\\n┃ 📌 Link invalido o expirado\\n╰━━━━━━━━━━━━━━━━⬣' });
            }
        }
`;

if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #addbot agregado');
} else {
    console.log('❌ No se encontro // #menu');
}
