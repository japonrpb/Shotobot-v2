const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

console.log('🔧 Aplicando parche para rate limit...');

// Verificar si ya tiene el caché
if (bot.includes('groupCache')) {
    console.log('⚠️ El caché ya está instalado');
    process.exit(0);
}

// Código del caché
const cacheCode = `
// ==================== CACHÉ PARA EVITAR RATE LIMIT ====================
const groupCache = new Map();

async function getGroupMeta(jid) {
    if (!jid || !jid.endsWith('@g.us')) {
        return await sock.groupMetadata(jid);
    }
    
    const now = Date.now();
    const cached = groupCache.get(jid);
    
    // Cache por 5 minutos (300,000 ms)
    if (cached && (now - cached.timestamp) < 300000) {
        return cached.data;
    }
    
    try {
        const data = await sock.groupMetadata(jid);
        groupCache.set(jid, { data, timestamp: now });
        return data;
    } catch (error) {
        // Si falla y hay caché, usar el caché viejo
        if (cached) return cached.data;
        throw error;
    }
}
`;

// Buscar donde insertar el código (después de la creación del socket)
const socketLine = 'const sock = makeWASocket({';
if (bot.includes(socketLine)) {
    bot = bot.replace(socketLine, cacheCode + '\n    ' + socketLine);
    console.log('✅ Caché agregado');
} else {
    console.log('❌ No se encontró la línea del socket');
}

// Reemplazar las llamadas a groupMetadata
const antes = 'await sock.groupMetadata(';
const despues = 'await getGroupMeta(';

if (bot.includes(antes)) {
    bot = bot.split(antes).join(despues);
    console.log('✅ Reemplazadas las llamadas a groupMetadata');
} else {
    console.log('⚠️ No se encontraron llamadas a groupMetadata');
}

// Guardar el archivo
fs.writeFileSync('bot.js', bot);
console.log('🎉 Parche aplicado correctamente');
console.log('');
console.log('📌 Reinicia el bot con: pm2 restart shotobot');
