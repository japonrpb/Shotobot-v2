const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar el comando #addbot y reemplazarlo
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
            
            // Limpiar el link
            link = link.trim();
            if (!link.includes('chat.whatsapp.com')) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 Link inválido. Debe ser de WhatsApp\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            // Extraer el código
            let code = link.split('chat.whatsapp.com/')[1];
            code = code.split('?')[0]; // Quitar parámetros extras
            code = code.split('/')[0]; // Quitar barras
            
            if (!code || code.length < 5) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ 📌 No se pudo extraer el código del link\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            await sock.sendMessage(remitente, { react: { text: '🔄', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🔗 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ ⏳ Intentando unirme al grupo...\\n┃ 📌 Código: ' + code + '\\n╰━━━━━━━━━━━━━━━━⬣' });
            
            try {
                // Método correcto para unirse a un grupo
                const res = await sock.groupAcceptInvite(code);
                await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ✅ 𝐀𝐃𝐃𝐁𝐎𝐓 〕━━━⬣\\n┃ 🎉 ¡Me uní al grupo con éxito!\\n┃ 📌 ID del grupo: ' + res + '\\n┃ 📌 Hazme admin para funcionar\\n╰━━━━━━━━━━━━━━━━⬣' });
            } catch (error) {
                console.log('Error al unirse:', error.message);
                let mensajeError = '╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\\n┃ ⚠️ No pude unirme\\n';
                if (error.message.includes('409')) {
                    mensajeError += '┃ 📌 El bot ya está en el grupo\\n';
                } else if (error.message.includes('401') || error.message.includes('403')) {
                    mensajeError += '┃ 📌 Link inválido o expirado\\n';
                } else if (error.message.includes('500')) {
                    mensajeError += '┃ 📌 Error del servidor de WhatsApp\\n';
                } else {
                    mensajeError += '┃ 📌 ' + error.message.substring(0, 50) + '\\n';
                }
                mensajeError += '╰━━━━━━━━━━━━━━━━⬣';
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: mensajeError });
            }
        }
`;

if (bot.includes('// #addbot')) {
    bot = bot.replace(/\/\/ #addbot[\s\S]*?}\s*}\s*}\s*}\s*}\s*}/g, newCommand);
} else {
    bot = bot.replace('// #menu', newCommand + '\n        // #menu');
}

fs.writeFileSync('bot.js', bot);
console.log('✅ Comando #addbot actualizado');
