const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar y reemplazar el evento de grupo
const oldEvent = /\/\/ Evento de bienvenida y despedida[\s\S]*?sock\.ev\.on\('group-participants\.update'[\s\S]*?}\s*}\);/g;

const newEvent = `
    // Evento de bienvenida y despedida
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        
        if (action === 'add') {
            for (const user of participants) {
                if (welcomeSettings[id] && welcomeSettings[id].enabled) {
                    let mensaje = welcomeSettings[id].message || defaultWelcomeMsg;
                    const userId = typeof user === 'string' ? user : user.id || user;
                    const nombre = await getContactName(userId);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [userId] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        if (action === 'remove') {
            for (const user of participants) {
                if (goodbyeSettings[id] && goodbyeSettings[id].enabled) {
                    let mensaje = goodbyeSettings[id].message || defaultGoodbyeMsg;
                    const userId = typeof user === 'string' ? user : user.id || user;
                    const nombre = await getContactName(userId);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [userId] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    });
`;

if (bot.match(oldEvent)) {
    bot = bot.replace(oldEvent, newEvent);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Evento de bienvenida corregido');
} else {
    console.log('⚠️ No se encontró el evento, agregándolo manualmente...');
    // Buscar donde insertar el evento
    const lines = bot.split('\n');
    let newLines = [];
    let inserted = false;
    
    for (let i = 0; i < lines.length; i++) {
        newLines.push(lines[i]);
        if (!inserted && lines[i].includes('sock.ev.on(\'messages.upsert\'')) {
            newLines.push(`
    // Evento de bienvenida y despedida
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        
        if (action === 'add') {
            for (const user of participants) {
                if (welcomeSettings[id] && welcomeSettings[id].enabled) {
                    let mensaje = welcomeSettings[id].message || defaultWelcomeMsg;
                    const userId = typeof user === 'string' ? user : user.id || user;
                    const nombre = await getContactName(userId);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [userId] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        if (action === 'remove') {
            for (const user of participants) {
                if (goodbyeSettings[id] && goodbyeSettings[id].enabled) {
                    let mensaje = goodbyeSettings[id].message || defaultGoodbyeMsg;
                    const userId = typeof user === 'string' ? user : user.id || user;
                    const nombre = await getContactName(userId);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [userId] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    });
`);
            inserted = true;
        }
    }
    fs.writeFileSync('bot.js', newLines.join('\n'));
    console.log('✅ Evento de bienvenida agregado');
}

// También arreglar getContactName para que maneje objetos
const oldGetContactName = /async function getContactName\(jid\) \{[\s\S]*?\}/;
const newGetContactName = `async function getContactName(jid) {
        try {
            let jidStr = typeof jid === 'string' ? jid : (jid.id || jid);
            if (!jidStr) return 'Usuario';
            const contact = await sock.contactQuery(jidStr);
            return contact.name || contact.notify || jidStr.split('@')[0];
        } catch {
            let jidStr = typeof jid === 'string' ? jid : (jid.id || jid);
            return jidStr ? jidStr.split('@')[0] : 'Usuario';
        }
    }`;

if (bot.match(oldGetContactName)) {
    bot = bot.replace(oldGetContactName, newGetContactName);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Función getContactName corregida');
}

console.log('🎉 Bienvenidas y despedidas arregladas');
