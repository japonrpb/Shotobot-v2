const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Agregar caché para groupMetadata
const cacheCode = `
// CACHÉ PARA EVITAR RATE LIMIT
const groupMetadataCache = new Map();

async function getGroupMetadataCached(groupId) {
    if (!groupId || !groupId.endsWith('@g.us')) {
        return await sock.groupMetadata(groupId);
    }
    const now = Date.now();
    const cached = groupMetadataCache.get(groupId);
    if (cached && (now - cached.time) < 300000) {
        return cached.data;
    }
    const data = await sock.groupMetadata(groupId);
    groupMetadataCache.set(groupId, { data, time: now });
    return data;
}
`;

// Reemplazar sock.groupMetadata por getGroupMetadataCached
bot = bot.replace(/await sock\.groupMetadata\(/g, 'await getGroupMetadataCached(');
bot = bot.replace('const sock = makeWASocket({', cacheCode + '\n    const sock = makeWASocket({');

fs.writeFileSync('bot.js', bot);
console.log('✅ Caché para groupMetadata agregado');
