const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar la función isAdmin y reemplazarla
const oldIsAdmin = `    async function isAdmin(groupId, userId) {
        try {
            const groupMetadata = await sock.groupMetadata(groupId);
            const participants = groupMetadata.participants;
            const user = participants.find(p => p.id === userId);
            return user && (user.admin === 'admin' || user.admin === 'superadmin');
        } catch {
            return false;
        }
    }`;

const newIsAdmin = `    // Caché de admins (se actualiza cada 5 minutos)
    const adminCache = new Map();
    
    async function isAdmin(groupId, userId) {
        const cacheKey = groupId;
        const now = Date.now();
        
        // Si el caché existe y tiene menos de 5 minutos, usarlo
        if (adminCache.has(cacheKey) && (now - adminCache.get(cacheKey).timestamp) < 300000) {
            const adminsSet = adminCache.get(cacheKey).admins;
            return adminsSet.has(userId);
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(groupId);
            const adminsSet = new Set();
            for (const p of groupMetadata.participants) {
                if (p.admin === 'admin' || p.admin === 'superadmin') {
                    adminsSet.add(p.id);
                }
            }
            adminCache.set(cacheKey, { admins: adminsSet, timestamp: now });
            return adminsSet.has(userId);
        } catch {
            return false;
        }
    }`;

if (bot.includes(oldIsAdmin)) {
    bot = bot.replace(oldIsAdmin, newIsAdmin);
    fs.writeFileSync('bot.js', bot);
    console.log('✅ Función isAdmin mejorada con caché');
} else {
    console.log('❌ No se encontró la función isAdmin original');
}
