const fs = require('fs');
let bot = fs.readFileSync('bot.js', 'utf8');

// Buscar y reemplazar el menú (solo la parte de comandos totales)
// Cambiar "Comandos: 75" por "Comandos: 81" (6 nuevos comandos de descarga)
bot = bot.replace(/Comandos: 75/g, 'Comandos: 81');

// Buscar y reemplazar la sección de economía para agregar descargas
const oldEconomySection = `╭━━〔 💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀 〕━━⊷`;
const newFullMenu = `╭━━〔 💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀 〕━━⊷
┃ 💰 #minar
┃ \`Minar minerales\`
┃ 💰 #cazar
┃ \`Cazar animales\`
┃ 💰 #pescar
┃ \`Pescar peces\`
┃ 💰 #talar
┃ \`Talar madera\`
┃ 💰 #aventura
┃ \`Explorar aventura\`
┃ 💰 #vender (item) (cant/all)
┃ \`Vender recursos\`
┃ 💰 #inventario
┃ \`Ver inventario\`
┃ 💰 #daily
┃ \`Recompensa diaria\`
┃ 💰 #trabajar
┃ \`Trabajar por dinero\`
┃ 💰 #cofre
┃ \`Abrir cofre (cada 6h)\`
┃ 💰 #robar @usuario
┃ \`Robar a alguien\`
┃ 💰 #transferir (cant) @usuario
┃ \`Transferir dinero\`
┃ 💰 #banco
┃ \`Ver tu saldo\`
┃ 💰 #depositar (cant|all)
┃ \`Depositar en banco\`
┃ 💰 #retirar (cant|all)
┃ \`Retirar del banco\`
┃ 💰 #rank
┃ \`Ranking de shoCoins\`
┃ 💰 #tienda
┃ \`Tienda de herramientas\`
┃ 💰 #comprar (item)
┃ \`Comprar herramienta\`
┃ 💰 #weekly
┃ \`Recompensa semanal\`
┃ 💰 #monthly
┃ \`Recompensa mensual\`
┃ 💰 #code (código)
┃ \`Canjear código\`
┃ 💰 #globalrank
┃ \`Ranking global\`
┃ 💰 #granja
┃ \`Sistema de granja\`
┃ 💰 #hornear
┃ \`Hornear comida\`
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 📥 𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒 〕━━⊷
┃ 📥 #playaudio (texto)
┃ \`Envía audio de YouTube\`
┃ 📥 #tiktok (link)
┃ \`Descarga TikTok sin marca\`
┃ 📥 #facebook (link)
┃ \`Descargar video FB\`
┃ 📥 #instagram (link)
┃ \`Descargar video IG\`
┃ 📥 #youtube (link)
┃ \`Descargar video YT\`
┃ 📥 #twitter (link)
┃ \`Descargar video X\`
╰━━━━━━━━━━━━━━━━━━━⬣

By: ShotoBot | By: mikelennn | By: 2941160601`;

// Insertar la nueva sección
if (bot.includes(oldEconomySection)) {
    // Buscar desde economía hasta el final y reemplazar
    const parts = bot.split(oldEconomySection);
    if (parts.length >= 2) {
        // Buscar dónde termina la sección de economía (hasta el By:)
        const endOfEconomy = parts[1].indexOf('By: ShotoBot');
        if (endOfEconomy > 0) {
            const before = parts[0];
            const after = parts[1].substring(endOfEconomy);
            bot = before + newFullMenu + after;
            fs.writeFileSync('bot.js', bot);
            console.log('✅ Menú actualizado con sección de descargas');
        } else {
            console.log('⚠️ No se encontró el final del menú');
        }
    } else {
        console.log('⚠️ No se pudo dividir el archivo');
    }
} else {
    console.log('⚠️ No se encontró la sección de economía');
}

console.log('🎉 Menú actualizado - Total de comandos: 81');
