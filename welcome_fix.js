const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Agregar variables de configuración
const configVars = `
// Configuración de bienvenidas y despedidas
let welcomeSettings = loadData('./bot_data/welcome.json', {});
let goodbyeSettings = loadData('./bot_data/goodbye.json', {});

const defaultWelcomeMsg = '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\\n┃ 👤 @user\\n┃ ✨ ¡Bienvenido al grupo!\\n┃ 📌 Lee las reglas y diviértete\\n╰━━━━━━━━━━━━━━━━⬣';
const defaultGoodbyeMsg = '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\\n┃ 👤 @user\\n┃ 🚀 ¡Nos vemos pronto!\\n┃ 💫 Siempre serás bienvenido\\n╰━━━━━━━━━━━━━━━━⬣';

function saveWelcomeConfig() {
    saveData('./bot_data/welcome.json', welcomeSettings);
}

function saveGoodbyeConfig() {
    saveData('./bot_data/goodbye.json', goodbyeSettings);
}
`;

// Insertar después de cooldowns
bot = bot.replace('let cooldowns = loadData(COOLDOWNS_FILE, {});', 'let cooldowns = loadData(COOLDOWNS_FILE, {});\n' + configVars);

// Comandos
const welcomeCommands = `

        // #bienvenida on/off
        if (texto.startsWith('#bienvenida')) {
            const args = texto.split(' ');
            if (args.length < 2 || (args[1] !== 'on' && args[1] !== 'off')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #bienvenida on/off\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Solo administradores\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            if (!welcomeSettings[remitente]) welcomeSettings[remitente] = {};
            welcomeSettings[remitente].enabled = args[1] === 'on';
            if (!welcomeSettings[remitente].message) {
                welcomeSettings[remitente].message = defaultWelcomeMsg;
            }
            saveWelcomeConfig();
            
            const estado = args[1] === 'on' ? '✅ activada' : '❌ desactivada';
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\\n┃ ' + estado + '\\n┃ 📌 Bienvenidas ' + (args[1] === 'on' ? 'activadas' : 'desactivadas') + '\\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #despedida on/off
        if (texto.startsWith('#despedida')) {
            const args = texto.split(' ');
            if (args.length < 2 || (args[1] !== 'on' && args[1] !== 'off')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #despedida on/off\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Solo administradores\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            if (!goodbyeSettings[remitente]) goodbyeSettings[remitente] = {};
            goodbyeSettings[remitente].enabled = args[1] === 'on';
            if (!goodbyeSettings[remitente].message) {
                goodbyeSettings[remitente].message = defaultGoodbyeMsg;
            }
            saveGoodbyeConfig();
            
            const estado = args[1] === 'on' ? '✅ activada' : '❌ desactivada';
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\\n┃ ' + estado + '\\n┃ 📌 Despedidas ' + (args[1] === 'on' ? 'activadas' : 'desactivadas') + '\\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #setbienvenida
        if (texto.startsWith('#setbienvenida')) {
            const nuevoMensaje = texto.replace('#setbienvenida', '').trim();
            if (!nuevoMensaje) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #setbienvenida (tu mensaje)\\n┃ 📌 Usa @user para etiquetar\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Solo administradores\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            if (!welcomeSettings[remitente]) welcomeSettings[remitente] = {};
            welcomeSettings[remitente].message = nuevoMensaje;
            saveWelcomeConfig();
            
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\\n┃ ✅ Mensaje actualizado\\n┃ 📌 ' + nuevoMensaje.substring(0, 80) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #setdespedida
        if (texto.startsWith('#setdespedida')) {
            const nuevoMensaje = texto.replace('#setdespedida', '').trim();
            if (!nuevoMensaje) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #setdespedida (tu mensaje)\\n┃ 📌 Usa @user para etiquetar\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ Solo administradores\\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            
            if (!goodbyeSettings[remitente]) goodbyeSettings[remitente] = {};
            goodbyeSettings[remitente].message = nuevoMensaje;
            saveGoodbyeConfig();
            
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\\n┃ ✅ Mensaje actualizado\\n┃ 📌 ' + nuevoMensaje.substring(0, 80) + '\\n╰━━━━━━━━━━━━━━━━⬣' });
        }
`;

// Insertar antes de // #menu
bot = bot.replace('// #menu', welcomeCommands + '\n        // #menu');

// Evento de grupo
const groupEvents = `

    // Evento de bienvenida y despedida
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        
        if (action === 'add') {
            for (const user of participants) {
                if (welcomeSettings[id] && welcomeSettings[id].enabled) {
                    let mensaje = welcomeSettings[id].message || defaultWelcomeMsg;
                    const nombre = await getContactName(user);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [user] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
        
        if (action === 'remove') {
            for (const user of participants) {
                if (goodbyeSettings[id] && goodbyeSettings[id].enabled) {
                    let mensaje = goodbyeSettings[id].message || defaultGoodbyeMsg;
                    const nombre = await getContactName(user);
                    mensaje = mensaje.replace(/@user/g, '@' + nombre);
                    await sock.sendMessage(id, { text: mensaje, mentions: [user] });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }
    });
`;

// Insertar después de la función iniciarBot() pero antes de sock.ev.on('messages.upsert'
bot = bot.replace('sock.ev.on(\'messages.upsert\'', groupEvents + '\n    sock.ev.on(\'messages.upsert\'');

fs.writeFileSync('bot.js', bot);
console.log('✅ Comandos de bienvenida y despedida agregados correctamente');
