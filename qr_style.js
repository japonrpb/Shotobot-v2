const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar la sección donde se genera el QR y reemplazarla
const oldQR = /if \(qr\) {\s+qrcode\.generate\(qr, \{ small: true \}\);\s+console\.log\('🔐 Escanea el QR con WhatsApp'\);\s+}/;

const newQR = `if (qr) {
            console.log('');
            console.log('╔════════════════════════════════════════════════════════════════════════════╗');
            console.log('║                                                                                ║');
            console.log('║                         🤍 𝐒𝐇𝐎𝐓𝐎𝐁𝐎𝐓 - 𝐄𝐒𝐂𝐀𝐍𝐄𝐀 𝐄𝐋 𝐐𝐑 ♥                         ║');
            console.log('║                                                                                ║');
            console.log('╚════════════════════════════════════════════════════════════════════════════╝');
            console.log('');
            console.log('📱 1. Abre WhatsApp en tu teléfono');
            console.log('📱 2. Ve a WhatsApp Web (tres puntos → WhatsApp Web)');
            console.log('📱 3. Escanea el código QR con tu teléfono');
            console.log('');
            console.log('┌────────────────────────────────────────────────────────────────────────────┐');
            qrcode.generate(qr, { small: true });
            console.log('└────────────────────────────────────────────────────────────────────────────┘');
            console.log('');
            console.log('⏳ Esperando conexión...');
            console.log('');
            console.log('✨ *SHOTOBOT* - Tu asistente virtual');
            console.log('💡 Una vez conectado, escribe #menu para ver todos los comandos');
            console.log('');
            console.log('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮');
            console.log('┃  🎮 #juegos  |  💰 #economia  |  🛡️ #proteccion  |  📥 #descargas  ┃');
            console.log('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯');
            console.log('');
        }`;

if (bot.includes('if (qr) {')) {
    bot = bot.replace(oldQR, newQR);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Interfaz QR mejorada al estilo ShotoBot');
} else {
    console.log('⚠️ No se encontró la sección del QR');
}
