const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

const newCommand = `
        // #addbot (unirse a grupos con mínimo 15 miembros)
        if (texto.startsWith('#addbot') && texto.includes('https://chat.whatsapp.com/')) {
            const link = texto.split(' ')[1];
            if (!link || !link.includes('https://chat.whatsapp.com/')) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 #addbot (link de invitación)\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🔄', key: mensaje.key } });
            
            try {
                // Extraer código del link
                let code = link.split('https://chat.whatsapp.com/')[1];
                code = code.split('?')[0];
                code = code.split('/')[0];
                code = code.trim();
                
                if (!code || code.length < 5) {
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 Link inválido\\n╰━━━━━━━━━━━━━━━━⬣' });
                    return;
                }
                
                // Obtener información del grupo sin unirse (para ver cuántos miembros tiene)
                const groupInfo = await sock.groupGetInviteInfo(code);
                const memberCount = groupInfo.size || groupInfo.participants?.length || 0;
                
                if (memberCount < 15) {
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 📌 El grupo tiene ${memberCount} miembros\\n┃ ⚠️ Mínimo requerido: 15 miembros\\n┃ 🚫 No me puedo unir\\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
                
                // Confirmar que se unirá
                await sock.sendMessage(remitente, { text: `╭━━〔 🔗 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ ✅ Grupo verificado: ${groupInfo.subject || groupInfo.title || 'Sin nombre'}\\n┃ 👥 Miembros: ${memberCount}\\n┃ ⏳ Me uniré en 1 minuto...\\n╰━━━━━━━━━━━━━━━━⬣` });
                
                // Esperar 1 minuto
                await new Promise(resolve => setTimeout(resolve, 60000));
                
                // Unirse al grupo
                await sock.groupAcceptInvite(code);
                
                // Mensaje de éxito etiquetando al usuario
                await sock.sendMessage(remitente, { text: `╭━━〔 ✅ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 🎉 @${await getContactName(sender)}\\n┃ 📌 ¡Me uní al grupo con éxito!\\n┃ 👑 Para que funcione correctamente,\\n┃ 📌 dame admin en el grupo\\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [sender] });
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                
            } catch (error) {
                console.log('Error en #addbot:', error.message);
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ ⚠️ No pude verificar el grupo\\n┃ 📌 Link inválido, expirado\\n┃ 📌 O el grupo es privado\\n╰━━━━━━━━━━━━━━━━⬣` });
            }
        }
`;

// Insertar antes de // #menu
if (bot.includes('// #menu')) {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Comando #addbot agregado correctamente');
} else {
    console.log('❌ No se encontró // #menu');
}

console.log('📌 Requisitos:');
console.log('   - El grupo debe tener mínimo 15 miembros');
console.log('   - El bot se une después de 1 minuto');
console.log('   - Se etiqueta al usuario que solicitó la unión');
