const readline = require('readline');

console.log('╔════════════════════════════════════════════════════════════════════════════════╗');
console.log('║                         🤖 SHOTOBOT - MODO DE PRUEBA LOCAL                     ║');
console.log('║                      EXACTAMENTE IGUAL AL BOT DE WHATSAPP                      ║');
console.log('╚════════════════════════════════════════════════════════════════════════════════╝');
console.log('');
console.log('💡 Escribe #menu para ver todos los comandos');
console.log('❌ Escribe "salir" para terminar');
console.log('');

// ==================== VARIABLES GLOBALES ====================
let economy = {};
let cooldowns = {};
let games = {};
let warns = {};
let bans = {};
let mutes = {};
let protection = {};
let groupMode = {};
let msgCount = {};
let spamTracker = {};
let russianRouletteTimers = {};

// ==================== RESPONSES 8BALL ====================
const eightBallResponses = [
    "✨ Sí, definitivamente",
    "🌟 Es seguro que sí",
    "🎱 Sin duda",
    "💫 Sí, claro",
    "⭐ Lo más probable",
    "✨ Las estrellas dicen que sí",
    "🌙 Mejor no decirte ahora",
    "⭐ Pregunta más tarde",
    "💫 No puedo predecirlo ahora",
    "✨ Concéntrate y pregunta de nuevo",
    "🌟 No cuentes con ello",
    "🎱 Mi respuesta es no",
    "💫 Muy dudoso",
    "✨ Las estrellas dicen que no"
];
// ==================== VERDADES ====================
const truths = [
    "¿Cuál es tu mayor miedo?",
    "¿Has mentido alguna vez a tu mejor amigo?",
    "¿Cuál es tu secreto más vergonzoso?",
    "¿Qué fue lo peor que hiciste por amor?",
    "¿Alguna vez has robado algo?",
    "¿Cuál es tu mayor arrepentimiento?",
    "¿Qué es lo que nadie sabe de ti?",
    "¿Has fingido estar enfermo para no hacer algo?",
    "¿Cuál es el peor consejo que has dado?",
    "¿Qué cosa ilegal has hecho?",
    "¿Qué es lo que más te avergüenza de tu pasado?",
    "¿Has ghosteado a alguien?",
    "¿Cuál es tu mayor inseguridad?",
    "¿Qué mentira le dices más seguido a tus padres?",
    "¿Has hecho algo malo y culpado a otro?",
    "¿Cuál es tu obsesión secreta?",
    "¿Qué es lo que más te arrepientes de haber dicho?",
    "¿Alguna vez has espiado el teléfono de alguien?",
    "¿Cuál es la peor cita que has tenido?",
    "¿Qué cosa no harías ni por todo el dinero del mundo?"
];

// ==================== RETOS ====================
const dares = [
    "🎭 Envía un mensaje diciendo 'me gustas' al 3er contacto de tu lista",
    "💃 Baila 10 segundos y graba el audio",
    "🎤 Canta una canción completa",
    "📸 Envía tu última foto de galería",
    "😡 Manda un audio insultando a alguien (sin ofender)",
    "🧹 Di algo bonito al que te castigó",
    "🤣 Haz reír a alguien con un chiste malo",
    "📝 Escribe un poema de amor y envíalo",
    "🎮 Haz el sonido de tu animal favorito",
    "😎 Cambia tu foto de perfil por 1 hora",
    "💬 Manda un mensaje con solo emojis",
    "🔊 Grita 'SOY EL MEJOR' en un audio",
    "📖 Cuenta un chiste malo",
    "🎭 Imita a un famoso",
    "😏 Haz una declaración de amor falsa",
    "🎬 Actúa como si fueras un robot",
    "🤪 Haz 10 sentadillas y graba el audio",
    "😈 Di algo picante en un audio",
    "🎤 Cuenta tu peor experiencia en el baño",
    "💀 Haz el peor baile del mundo"
];
// ==================== CHISTES ====================
const chistes = [
    "¿Qué le dice un jardinero a otro? ¡Nos vemos cuando podamos!",
    "¿Por qué los pájaros no usan Facebook? Porque ya tienen Twitter",
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    "¿Cómo se llama el campeón de buceo japonés? Tokofondo",
    "¿Qué le dice un techo a otro? Techo de menos",
    "¿Por qué los peces no juegan al fútbol? Porque le tienen miedo a la red",
    "¿Qué le dice un semáforo a otro? No me mires que me cambio",
    "¿Cómo se dice pañuelo en japonés? Saka-moko",
    "¿Por qué los fantasmas son malos mintiendo? Porque se les ve la mentira",
    "¿Qué hace un perro con un taladro? Taladrando",
    "¿Cuál es el colmo de un electricista? Que su hijo sea un apagado",
    "¿Qué le dice una uva a otra? ¡Pasa la uva!",
    "¿Por qué los patos siempre llegan tarde? Porque están pato-ando",
    "¿Cómo se llama el hermano de Bruce Lee? Bro-ccoli",
    "¿Qué le dice un limón a otro? ¡Naranja!",
    "¿Por qué los esqueletos no pelean? Porque no tienen agallas",
    "¿Qué hace un niño con un ventilador? Abanica",
    "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro",
    "¿Por qué los gatos no tocan el piano? Porque ya tienen la cola",
    "¿Qué le dice un paraguas a otro? ¡Sombra!",
    "¿Cómo se despide un panadero? ¡Nos vemos en la masa!",
    "¿Qué hace un hipopótamo en la nevera? ¡Hipo-termia!",
    "¿Por qué los pandas no comen carne? Porque no tienen Pa'da",
    "¿Cómo se le dice a una computadora triste? ¡Compu-triste!",
    "¿Qué le dice una pared a otra? ¡Nos encontramos en la esquina!",
    "¿Por qué las tijeras son malas contando? Porque solo saben cortar",
    "¿Qué hace un coche en el cine? ¡Auto-película!",
    "¿Cómo se le dice a un perro electricista? ¡Perro-conectado!",
    "¿Qué le dice una mesa a otra? ¡Te tengo madera!",
    "¿Por qué el tomate se puso rojo? Porque vio la ensalada"
];

// ==================== FRASES MOTIVACIONALES ====================
const frases = [
    "✨ El éxito no es la clave de la felicidad. La felicidad es la clave del éxito.",
    "🌟 Cree en ti mismo y todo será posible.",
    "💪 No te rindas, cada fracaso es un paso más cerca del éxito.",
    "🌱 El único límite es tu mente.",
    "🚀 Sueña en grande y atrévete a fallar.",
    "🌈 No importa qué tan lento vayas, siempre que no te detengas.",
    "🦋 El futuro depende de lo que hagas hoy.",
    "⭐ El único lugar donde el éxito viene antes que el trabajo es en el diccionario.",
    "🔥 La perseverancia es el camino hacia el éxito.",
    "💫 Cree en los milagros, pero no dependas de ellos.",
    "🌙 La noche es más oscura justo antes del amanecer.",
    "☀️ Levántate cada día con la certeza de que vas a lograrlo.",
    "🎯 El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "🏆 No cuentes los días, haz que los días cuenten.",
    "💎 La única forma de hacer un gran trabajo es amar lo que haces.",
    "📚 El conocimiento es poder, el poder es libertad.",
    "🎨 La creatividad es la inteligencia divirtiéndose.",
    "🤝 Trata a los demás como quieres que te traten a ti.",
    "😊 La felicidad no es algo hecho. Viene de tus propias acciones.",
    "🌻 Cree que puedes y ya estás a medio camino.",
    "🕊️ La paz no es la ausencia de conflictos, es la capacidad de manejarlos.",
    "💖 El amor y la amabilidad nunca se desperdician.",
    "🎉 Cada día es una nueva oportunidad para cambiar tu vida.",
    "🔮 No esperes el momento perfecto, haz que el momento sea perfecto.",
    "🦅 Vuela alto, sueña en grande, nunca mires hacia atrás.",
    "🍀 La suerte es cuando la preparación se encuentra con la oportunidad.",
    "💡 Las ideas pueden cambiar el mundo.",
    "🏔️ Las grandes montañas se escalan paso a paso.",
    "🌊 El mar es peligroso pero también hermoso, así es la vida.",
    "⭐ Tú eres el arquitecto de tu propio destino"
];
// ==================== PIROPOS ====================
const piropos = [
    "🌹 Si la belleza fuera tiempo, tú serías una eternidad.",
    "💫 Eres como una estrella: brillas sin importar la oscuridad.",
    "🌸 Tu sonrisa ilumina mi día más que el sol.",
    "✨ Eres el sueño del que nunca quiero despertar.",
    "💖 Eres la razón por la que creo en el amor a primera vista.",
    "🌙 Si la noche te viera, se pondría celosa de tu belleza.",
    "💎 Si las palabras fueran monedas, tú serías todo mi tesoro.",
    "🌺 Eres más hermosa que un jardín en primavera.",
    "💘 Tu mirada es un imán que atrapa mi corazón.",
    "🦋 Eres la mariposa que revolotea en mis sueños.",
    "🌞 Eres mi sol en los días fríos.",
    "💕 Si Dios pintó el cielo, seguro que él te pintó a ti.",
    "🎨 Eres la obra de arte más perfecta que he visto.",
    "📖 Tu historia es mi libro favorito.",
    "🍫 Eres más dulce que el chocolate.",
    "🎵 Tu voz es la melodía más hermosa.",
    "💭 Te imagino cuando no estás, eso es amor.",
    "💫 Eres el ángel que bajó del cielo por error.",
    "✨ Tu belleza es eterna como las estrellas.",
    "🌹 Eres la rosa más bella del jardín.",
    "💖 Amor a primera vista no existe, hasta que te vi a ti.",
    "🌸 Eres mi primavera favorita.",
    "💎 Eres una joya única e irrepetible.",
    "🦋 Me robaste el corazón sin permiso.",
    "💕 Me gustas más que el café de la mañana.",
    "🌙 Eres mi luna llena perfecta.",
    "💫 Contigo hasta las estrellas son menos brillantes.",
    "✨ Eres mi deseo secreto.",
    "💖 Me haces creer en finales felices.",
    "🌹 Si la perfección existiera, se llamaría como tú"
];

// ==================== INSULTOS ====================
const insultos = [
    "🤡 Eres más feo que un pie por detrás",
    "😤 Tienes menos gracia que un calcetín mojado",
    "🧠 Oye, ¿te robaron el cerebro o solo lo dejaste en casa?",
    "👎 Eres como un termo: por fuera frío, por dentro vacío",
    "🙄 Tu inteligencia es como el aceite de cocina, siempre por los suelos",
    "🤢 Das más asco que una sopa de calcetines",
    "🥴 Tienes menos chiste que un semáforo en obra negra",
    "🦧 Te falta un eslabón en la cadena evolutiva",
    "🐌 Eres más lento que el caballo del malo",
    "💩 Das pena hasta a los que no tienen sentimientos",
    "😒 Tienes menos personalidad que una puerta",
    "🤮 Hueles peor que un changarro de carnitas",
    "🪨 Tienes menos sentimientos que una piedra",
    "🎭 Eres como una sombra: siempre estorbas",
    "🧟 Das más miedo que una película de terror",
    "🫏 Eres más bruto que un burro en una cristalería",
    "🐷 Comes como cerdo y hueles como uno",
    "😺 Tienes más vidas que un gato, pero ninguna sirve",
    "🕳️ Mide tu ego, no cabe en el universo",
    "💨 Tu opinión vale menos que el aire que respiras",
    "🤥 Mientes más que un político en campaña",
    "🎪 Eres un circo completo sin payaso",
    "🪤 Caes mal hasta en el tutorial de la vida",
    "🧽 Eres como una esponja: absorbes todo lo malo",
    "🐀 Más falso que un billete de 300 pesos",
    "🕷️ Das más repelús que una araña gigante",
    "🥫 Tu cerebro cabe en una lata de atún",
    "🎰 Eres más confuso que una máquina tragamonedas",
    "🔮 Ser feo es normal, pero tú ya es profesional",
    "👻 Más espantoso que un fantasma en Halloween"
];

// ==================== DATOS CURIOSOS ====================
const datosCuriosos = [
    "🐙 Los pulpos tienen tres corazones y sangre azul.",
    "🍌 Los plátanos son bayas, pero las fresas no.",
    "🐘 Los elefantes no pueden saltar.",
    "🌍 El 90% de la gente escribe 'google' mal antes de buscarlo.",
    "💧 Un litro de agua pesa exactamente un kilogramo.",
    "🐪 Los camellos tienen tres párpados.",
    "🦒 Las jirafas pueden limpiarse los oídos con su lengua.",
    "🐬 Los delfines tienen nombres unos para otros.",
    "🦋 Las mariposas pueden ver colores que los humanos no.",
    "🐧 Los pingüinos tienen una glándula que convierte el agua salada en dulce.",
    "🦎 Los lagartos pueden regenerar su cola.",
    "🐙 El pulpo tiene tres corazones y nueve cerebros.",
    "🦅 Las águilas pueden ver un conejo desde 3 kilómetros.",
    "🐘 Los elefantes se reconocen en el espejo.",
    "🐒 Los monos se ríen cuando les hacen cosquillas.",
    "🌙 La luna tiene terremotos lunares.",
    "☀️ El sol es blanco, no amarillo.",
    "🪐 Saturno flotaría en el agua.",
    "🌎 La Tierra pesa 6,000 trillones de toneladas.",
    "💎 El diamante más grande pesa 3,100 quilates.",
    "🏔️ El Monte Everest no es el punto más alto de la Tierra, el volcán Mauna Kea lo es.",
    "🌊 La fosa de las Marianas es más profunda que el Everest es alto.",
    "⚡ Un rayo es cinco veces más caliente que el sol.",
    "🍞 Tostar pan cambia su estructura molecular.",
    "💩 Las heces de ballena valen miles de dólares.",
    "🦷 Los dientes son la única parte del cuerpo que no se repara sola.",
    "👅 La huella de la lengua es única como las huellas dactilares.",
    "❤️ El corazón humano genera suficiente presión para disparar sangre 9 metros.",
    "👁️ El ojo humano puede distinguir 10 millones de colores.",
    "🧠 El cerebro humano almacena información equivalente a 2.5 millones de gigabytes"
];
// ==================== MINERALES ====================
const minerales = [
    { nombre: "🪨 Piedra", valor: 5, rareza: 35 },
    { nombre: "⛏️ Carbón", valor: 10, rareza: 25 },
    { nombre: "🔩 Hierro", valor: 25, rareza: 15 },
    { nombre: "🥉 Cobre", valor: 30, rareza: 10 },
    { nombre: "🥈 Plata", valor: 60, rareza: 6 },
    { nombre: "🥇 Oro", valor: 120, rareza: 4 },
    { nombre: "💎 Zafiro", valor: 250, rareza: 2.5 },
    { nombre: "❤️ Rubí", valor: 300, rareza: 1.5 },
    { nombre: "💚 Esmeralda", valor: 350, rareza: 0.8 },
    { nombre: "✨ Diamante", valor: 500, rareza: 0.2 }
];

// ==================== ANIMALES PARA CAZAR ====================
const animales = [
    { nombre: "🐭 Ratón", valor: 8, rareza: 20 },
    { nombre: "🐇 Conejo", valor: 15, rareza: 15 },
    { nombre: "🦊 Zorro", valor: 35, rareza: 12 },
    { nombre: "🐗 Jabalí", valor: 50, rareza: 10 },
    { nombre: "🦌 Ciervo", valor: 70, rareza: 8 },
    { nombre: "🐺 Lobo", valor: 90, rareza: 7 },
    { nombre: "🐻 Oso", valor: 120, rareza: 6 },
    { nombre: "🦁 León", valor: 160, rareza: 5 },
    { nombre: "🐅 Tigre", valor: 200, rareza: 4 },
    { nombre: "🦍 Gorila", valor: 250, rareza: 3 },
    { nombre: "🦏 Rinoceronte", valor: 300, rareza: 2.5 },
    { nombre: "🐘 Elefante", valor: 350, rareza: 2 },
    { nombre: "🦒 Jirafa", valor: 280, rareza: 2.2 },
    { nombre: "🐃 Búfalo", valor: 220, rareza: 3.5 },
    { nombre: "🦅 Águila", valor: 180, rareza: 4.5 },
    { nombre: "🐊 Cocodrilo", valor: 320, rareza: 2.8 },
    { nombre: "🐍 Serpiente", valor: 100, rareza: 6.5 },
    { nombre: "🦚 Pavo real", valor: 150, rareza: 5.5 },
    { nombre: "🐺 Hiena", valor: 130, rareza: 6 },
    { nombre: "🦣 Mamut", valor: 800, rareza: 0.5 }
];

// ==================== PECES ====================
const peces = [
    { nombre: "🐟 Sardina", valor: 6, rareza: 18 },
    { nombre: "🐠 Lenguado", valor: 12, rareza: 14 },
    { nombre: "🐡 Pez globo", valor: 25, rareza: 12 },
    { nombre: "🐟 Trucha", valor: 35, rareza: 10 },
    { nombre: "🐠 Salmón", valor: 50, rareza: 8 },
    { nombre: "🐟 Atún", valor: 70, rareza: 7 },
    { nombre: "🦈 Tiburón", valor: 150, rareza: 5 },
    { nombre: "🐋 Ballena", valor: 300, rareza: 3 },
    { nombre: "🐙 Pulpo", valor: 90, rareza: 6 },
    { nombre: "🦑 Calamar", valor: 80, rareza: 6.5 },
    { nombre: "🦞 Langosta", valor: 120, rareza: 5.5 },
    { nombre: "🦀 Cangrejo", valor: 60, rareza: 7.5 },
    { nombre: "🐚 Caracola", valor: 20, rareza: 13 },
    { nombre: "⭐ Estrella de mar", valor: 30, rareza: 11 },
    { nombre: "🐠 Pez payaso", valor: 45, rareza: 9 },
    { nombre: "🐟 Pez espada", valor: 110, rareza: 5.8 },
    { nombre: "🐠 Dorado", valor: 140, rareza: 5.2 },
    { nombre: "🐟 Mero", valor: 95, rareza: 6.2 },
    { nombre: "🦐 Gamba", valor: 25, rareza: 12.5 },
    { nombre: "🦑 Calamar gigante", valor: 250, rareza: 3.5 },
    { nombre: "🐋 Orca", valor: 400, rareza: 2 },
    { nombre: "🐟 Pez ángel", valor: 55, rareza: 8.2 },
    { nombre: "🐠 Pez loro", valor: 65, rareza: 7.8 },
    { nombre: "🐟 Pez globo gigante", valor: 200, rareza: 4.2 },
    { nombre: "🐉 Dragón de mar", valor: 500, rareza: 0.8 }
];

// ==================== ÁRBOLES PARA TALAR ====================
const arboles = [
    { nombre: "🍃 Rama", valor: 4, rareza: 30 },
    { nombre: "🍂 Hojas", valor: 3, rareza: 25 },
    { nombre: "🌿 Hierba", valor: 5, rareza: 20 },
    { nombre: "🌱 Brote", valor: 8, rareza: 15 },
    { nombre: "🌰 Bellota", valor: 12, rareza: 12 },
    { nombre: "🍎 Manzana", valor: 15, rareza: 10 },
    { nombre: "🍐 Pera", valor: 18, rareza: 9 },
    { nombre: "🪵 Madera", valor: 25, rareza: 8 },
    { nombre: "🌳 Tronco", valor: 40, rareza: 6 },
    { nombre: "🍄 Hongo", valor: 30, rareza: 7 },
    { nombre: "🌲 Pino", valor: 60, rareza: 5 },
    { nombre: "🍯 Miel", valor: 50, rareza: 5.5 },
    { nombre: "🌴 Palma", valor: 80, rareza: 4 },
    { nombre: "🍁 Arce", valor: 100, rareza: 3 },
    { nombre: "🌳 Roble milenario", valor: 300, rareza: 0.5 }
];

// ==================== GRANJA ====================
const granjaItems = [
    { nombre: "🍎 Manzana", valor: 15, rareza: 12 },
    { nombre: "🍐 Pera", valor: 18, rareza: 11 },
    { nombre: "🍊 Naranja", valor: 20, rareza: 10 },
    { nombre: "🍋 Limón", valor: 12, rareza: 13 },
    { nombre: "🍌 Plátano", valor: 25, rareza: 9 },
    { nombre: "🍉 Sandía", valor: 40, rareza: 7 },
    { nombre: "🍇 Uva", valor: 30, rareza: 8 },
    { nombre: "🍓 Fresa", valor: 35, rareza: 7.5 },
    { nombre: "🫐 Arándano", valor: 28, rareza: 8.5 },
    { nombre: "🥝 Kiwi", valor: 22, rareza: 9.5 },
    { nombre: "🍒 Cereza", valor: 32, rareza: 8 },
    { nombre: "🥑 Aguacate", valor: 45, rareza: 6 },
    { nombre: "🍅 Tomate", valor: 20, rareza: 10 },
    { nombre: "🥕 Zanahoria", valor: 15, rareza: 11 },
    { nombre: "🌽 Maíz", valor: 25, rareza: 9 },
    { nombre: "🥔 Papa", valor: 18, rareza: 10.5 },
    { nombre: "🍆 Berenjena", valor: 30, rareza: 8 },
    { nombre: "🥦 Brócoli", valor: 35, rareza: 7.5 },
    { nombre: "🧄 Ajo", valor: 28, rareza: 8.5 },
    { nombre: "🧅 Cebolla", valor: 22, rareza: 9.5 }
];
// ==================== FUNCIONES DEL SISTEMA ====================
function normalizeString(str) {
    if (!str) return "";
    return str.toString().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function getEconomyUser(userId) {
    if (!economy[userId]) {
        economy[userId] = {
            wallet: 100,
            bank: 0,
            inventory: [],
            tools: [],
            lastDaily: 0,
            lastWeekly: 0,
            lastMonthly: 0,
            lastWork: 0,
            lastChest: 0,
            lastFarm: 0
        };
    }
    return economy[userId];
}

function addInventoryItem(userId, item, cantidad = 1) {
    const user = getEconomyUser(userId);
    const existing = user.inventory.find(i => normalizeString(i.nombre) === normalizeString(item.nombre));
    if (existing) {
        existing.cantidad += cantidad;
    } else {
        user.inventory.push({ nombre: item.nombre, valor: item.valor, cantidad: cantidad });
    }
    economy[userId] = user;
}

function removeInventoryItem(userId, nombre, cantidad = 1) {
    const user = getEconomyUser(userId);
    const index = user.inventory.findIndex(i => normalizeString(i.nombre) === normalizeString(nombre));
    if (index !== -1) {
        if (user.inventory[index].cantidad <= cantidad) {
            user.inventory.splice(index, 1);
        } else {
            user.inventory[index].cantidad -= cantidad;
        }
        economy[userId] = user;
        return true;
    }
    return false;
}

function selectItemByRarity(items) {
    const totalRareza = items.reduce((sum, item) => sum + item.rareza, 0);
    let random = Math.random() * totalRareza;
    let acum = 0;
    for (const item of items) {
        acum += item.rareza;
        if (random <= acum) return { ...item };
    }
    return { ...items[0] };
}

function getCooldown(userId, action) {
    if (!cooldowns[userId]) cooldowns[userId] = {};
    const last = cooldowns[userId][action] || 0;
    const now = Date.now();
    const remaining = Math.max(0, 600000 - (now - last));
    return { canUse: now - last >= 600000, remaining };
}

function updateCooldown(userId, action) {
    if (!cooldowns[userId]) cooldowns[userId] = {};
    cooldowns[userId][action] = Date.now();
}

function sellInventoryItem(userId, nombre, cantidad) {
    const user = getEconomyUser(userId);
    const item = user.inventory.find(i => normalizeString(i.nombre) === normalizeString(nombre));
    if (!item) return { success: false, reason: "No tienes ese item" };
    if (item.cantidad < cantidad) return { success: false, reason: `Solo tienes ${item.cantidad} ${item.nombre}` };
    const totalGanancia = item.valor * cantidad;
    user.wallet += totalGanancia;
    removeInventoryItem(userId, nombre, cantidad);
    economy[userId] = user;
    return { success: true, ganancia: totalGanancia, nombre: item.nombre, cantidad };
}
// ==================== TEXTOS DE BATALLA ====================
const battleTexts = [
    "💥 {p1} lanza un puñetazo devastador, pero {p2} lo esquiva y contraataca con una patada voladora. ¡{winner} gana la pelea!",
    "⚡ {p1} usa un rayo láser, {p2} se defiende con un escudo y responde con un super golpe. ¡{winner} es el campeón!",
    "🔥 {p1} invoca una bola de fuego, {p2} la esquiva y da un golpe crítico. ¡{winner} gana!",
    "🌪️ {p1} crea un tornado, {p2} lo absorbe y lo devuelve. ¡{winner} se lleva la victoria!",
    "💪 {p1} y {p2} chocan sus puños, la onda expansiva derriba a {loser}. ¡{winner} triunfa!",
    "🌀 {p1} usa el poder de la galaxia, pero {p2} refleja el ataque. ¡{winner} es el vencedor!",
    "⚔️ {p1} saca una espada legendaria, {p2} bloquea con un escudo mágico. ¡{winner} gana por KO!",
    "💢 {p1} se transforma en super sayayin, {p2} no puede con tanto poder. ¡{winner} destruye todo!",
    "🦸 {p1} vuela hacia {p2} con un super puñetazo, {p2} sale volando. ¡{winner} gana!",
    "🎮 {p1} usa un combo mortal, {p2} queda noqueado. ¡{winner} es el nuevo campeón!",
    "💀 {p1} invoca los poderes oscuros, {p2} intenta huir pero es alcanzado. ¡{winner} gana!",
    "✨ {p1} brilla con luz propia, {p2} queda cegado y recibe el golpe final. ¡{winner} vence!",
    "🌋 {p1} desata un volcán, {p2} queda atrapado en la lava. ¡{winner} es imparable!",
    "💫 {p1} se multiplica en 10 clones, todos atacan a {p2} al mismo tiempo. ¡{winner} gana!",
    "🏆 {p1} y {p2} se dan tremenda pelea, pero al final {winner} levanta el trofeo!"
];

// ==================== PALABRAS WORDLE ====================
const wordleWords = [
    "PERRO", "GATO", "CASA", "PERA", "MANO", "BOCA", "PELO", "RISA", "LUNA", "SOL",
    "MAR", "FLOR", "FUEGO", "AGUA", "NUBE", "AMOR", "VIDA", "ALMA", "SUENO", "TIEMPO",
    "MUNDO", "CIELO", "ROJO", "AZUL", "VERDE", "BLANCO", "NEGRO", "DULCE", "FUERTE", "RAPIDO"
].filter(w => w.length === 5);

// ==================== PALABRAS AHORCADO ====================
const hangmanWords = [
    "ELEFANTE", "MARIPOSA", "CASTILLO", "BICICLETA", "CHOCOLATE", "TELEFONO", "COMPUTADORA",
    "LIBRO", "ESCUELA", "MEDICO", "HOSPITAL", "AVION", "TREN", "CARRO", "MOTO", "CAMION",
    "BUS", "TAXI", "BARCO", "SUBMARINO", "HELICOPTERO", "COHETE", "PLANETA", "GALAXIA",
    "UNIVERSO", "ATOMO", "MOLECULA", "CELULA", "ORGANO", "SISTEMA"
];

// ==================== TRIVIA ====================
const triviaQuestions = [
    { question: "¿Cuál es el planeta más grande del sistema solar?", options: ["Marte", "Júpiter", "Saturno", "Neptuno"], answer: "b" },
    { question: "¿Quién pintó la Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], answer: "c" },
    { question: "¿En qué año llegó el hombre a la luna?", options: ["1969", "1972", "1965", "1970"], answer: "a" }
];

// ==================== TIENDA ====================
const tiendaItems = [
    { nombre: "⛏️ Pico de hierro", precio: 500, efecto: "+5% suerte en minar", duracion: 7 },
    { nombre: "🏹 Arco de caza", precio: 600, efecto: "+5% suerte en cazar", duracion: 7 },
    { nombre: "🎣 Caña de oro", precio: 550, efecto: "+5% suerte en pescar", duracion: 7 },
    { nombre: "🪓 Hacha afilada", precio: 450, efecto: "+5% suerte en talar", duracion: 7 },
    { nombre: "🧭 Brújula mágica", precio: 800, efecto: "+10% suerte en aventura", duracion: 7 }
];

// ==================== RECETAS HORNEAR ====================
const recetas = [
    { nombre: "🍞 Pan", ingredientes: ["🌾 Trigo"], valor: 30 },
    { nombre: "🍰 Pastel", ingredientes: ["🍎 Manzana", "🌾 Trigo", "🥚 Huevo"], valor: 80 },
    { nombre: "🍪 Galletas", ingredientes: ["🌾 Trigo", "🍫 Chocolate"], valor: 40 }
];
// ==================== FUNCIONES WORDLE ====================
function newWordleGame() {
    const randomWord = wordleWords[Math.floor(Math.random() * wordleWords.length)];
    return { word: randomWord, attempts: 0, maxAttempts: 6, guessed: false, history: [] };
}

function checkWordleGuess(word, target) {
    let result = "";
    for (let i = 0; i < word.length; i++) {
        if (word[i] === target[i]) result += "🟩";
        else if (target.includes(word[i])) result += "🟨";
        else result += "⬛";
    }
    return result;
}

// ==================== FUNCIONES AHORCADO ====================
function newHangmanGame() {
    const randomWord = hangmanWords[Math.floor(Math.random() * hangmanWords.length)];
    return { word: randomWord, guessedLetters: [], attempts: 0, maxAttempts: 6, guessed: false };
}

function getHangmanDisplay(game) {
    let display = "";
    for (let letter of game.word) {
        if (game.guessedLetters.includes(letter)) display += letter + " ";
        else display += "_ ";
    }
    return display.trim();
}

const hangmanStages = [
    "```\n   +---+\n   |   |\n       |\n       |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n       |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n   |   |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|   |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n  /    |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n  / \\  |\n       |\n=========\n```"
];

// ==================== FUNCIONES CONECTA 4 ====================
function newConnect4Game() {
    const board = Array(6).fill().map(() => Array(7).fill('⚫'));
    return { board, turn: '🔴', gameActive: true, players: [] };
}

function printConnect4Board(board) {
    let display = "╭───┬───┬───┬───┬───┬───┬───╮\n";
    for (let i = 0; i < 6; i++) {
        display += "│";
        for (let j = 0; j < 7; j++) {
            display += ` ${board[i][j]} │`;
        }
        display += "\n";
        if (i < 5) display += "├───┼───┼───┼───┼───┼───┼───┤\n";
    }
    display += "╰───┴───┴───┴───┴───┴───┴───╯\n";
    display += "  1   2   3   4   5   6   7";
    return display;
}

function makeMove(board, col, player) {
    for (let i = 5; i >= 0; i--) {
        if (board[i][col] === '⚫') {
            board[i][col] = player;
            return true;
        }
    }
    return false;
}

// ==================== FUNCIONES TRIVIA ====================
function newTriviaGame() {
    const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    return { question: randomQ.question, options: randomQ.options, answer: randomQ.answer };
}

// ==================== RULETA RUSA ====================
function jugarRuleta(participantes) {
    const balaPos = Math.floor(Math.random() * 6);
    const primerTiro = Math.floor(Math.random() * 2);
    let turno = primerTiro;
    let victima = null;
    for (let i = 0; i < 6; i++) {
        if (i === balaPos) {
            victima = participantes[turno];
            break;
        }
        turno = 1 - turno;
    }
    return { victima, ganador: participantes[1 - participantes.indexOf(victima)] };
}
// ==================== FUNCIONES ADMIN Y WARN ====================
async function isAdmin(groupId, userId) {
    // En modo prueba, el usuario "TestUser" es admin
    // Para simular otros usuarios como no admin
    if (userId === 'TestUser') return true;
    if (userId.includes('Admin')) return true;
    return false;
}

async function addWarn(groupId, userId, reason, emoji) {
    if (!warns[groupId]) warns[groupId] = {};
    if (!warns[groupId][userId]) warns[groupId][userId] = 0;
    warns[groupId][userId]++;
    const currentWarns = warns[groupId][userId];
    
    console.log(`\n╭━━〔 ⚠️ 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀 〕━⬣`);
    console.log(`┃ ${emoji} Razón: ${reason}`);
    console.log(`┃ 👤 @${userId}`);
    console.log(`┃ 📊 Warns: ${currentWarns}/3`);
    console.log(`┃ ⚠️ 3 warns = expulsión automática`);
    console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    
    if (currentWarns >= 3) {
        console.log(`\n╭━━〔 🚫 𝐄𝐗𝐏𝐔𝐋𝐒𝐈𝐎́𝐍 〕━━⬣`);
        console.log(`┃ 🔴 @${userId}`);
        console.log(`┃ ⚠️ Expulsado por 3 warns`);
        console.log(`┃ 📌 Razón: ${reason}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        delete warns[groupId][userId];
        return true;
    }
    return false;
}

async function checkSpam(groupId, userId, msg) {
    if (!protection[groupId]?.antispam) return false;
    
    const now = Date.now();
    if (!spamTracker[groupId]) spamTracker[groupId] = {};
    if (!spamTracker[groupId][userId]) {
        spamTracker[groupId][userId] = { count: 1, times: [now] };
        return false;
    }
    
    const userSpam = spamTracker[groupId][userId];
    userSpam.times = userSpam.times.filter(t => now - t < 10000);
    userSpam.times.push(now);
    userSpam.count = userSpam.times.length;
    
    if (userSpam.count >= 5) {
        console.log(`[SISTEMA] ⚠️ Spam detectado de @${userId}`);
        await addWarn(groupId, userId, 'Spam (5 mensajes en 10 segundos)', '📨');
        spamTracker[groupId][userId] = { count: 1, times: [now] };
        return true;
    }
    return false;
}

function hasLink(texto) {
    if (!texto) return false;
    const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\.[a-z]{2,}\/[^\s]+)/i;
    return linkRegex.test(texto);
}

async function deleteMessage(jid, key) {
    console.log(`[SISTEMA] 🗑️ Mensaje eliminado en ${jid}`);
    return true;
}

async function checkAndDeleteMuted(jid, sender, key) {
    if (mutes[sender] && mutes[sender].until > Date.now()) {
        await deleteMessage(jid, key);
        console.log(`[SISTEMA] 🔇 Usuario ${sender} muteado - mensaje eliminado`);
        return true;
    }
    return false;
}
// ==================== PROCESAMIENTO DE PROTECCIONES ====================
async function procesarMensaje(texto, remitente, usuario) {
    const isGroupChat = true;
    const mensajeKey = { id: Date.now() };
    
    if (remitente === usuario) return;
    
    const userIsAdmin = await isAdmin(remitente, usuario);
    
    if (!userIsAdmin) {
        const estaMuteado = await checkAndDeleteMuted(remitente, usuario, mensajeKey);
        if (estaMuteado) return;
        
        await checkSpam(remitente, usuario, mensajeKey);
        
        if (protection[remitente]?.antilinks && hasLink(texto)) {
            await deleteMessage(remitente, mensajeKey);
            await addWarn(remitente, usuario, 'Envío de link', '🔗');
            console.log(`[REACCIÓN] 🔗`);
            return;
        }
    }
    
    await procesarComando(texto, usuario, remitente);
}

// Función para obtener menciones
function getMentionedOrReplied(fullText) {
    const parts = fullText.split(' ');
    for (const part of parts) {
        if (part.startsWith('@')) {
            return [part.substring(1)];
        }
    }
    return null;
}

// Función para obtener nombre de contacto (simulado)
async function getContactName(jid) {
    if (jid === 'TestUser') return 'UsuarioTest';
    return jid;
}
// ==================== PROCESAR COMANDOS PRINCIPALES ====================
async function procesarComando(texto, usuario, remitente = 'grupo@g.us') {
    const cmd = texto.toLowerCase().trim();
    const fullText = texto;
    
    // #ping
    if (cmd === '#ping') {
        const ping = Math.floor(Math.random() * 200) + 50;
        console.log(`\n╭━━〔 🏓 𝐏𝐈𝐍𝐆 〕━━━━⬣`);
        console.log(`┃ ⚡ Velocidad: ${ping}ms`);
        console.log(`┃ 📡 Estado: ${ping < 150 ? '🟢 Excelente' : ping < 300 ? '🟡 Normal' : '🔴 Lento'}`);
        console.log(`┃ 🤖 Bot: Activo`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #menu
    else if (cmd === '#menu') {
        const userEco = getEconomyUser(usuario);
        const totalCoins = userEco.wallet + userEco.bank;
        const nombreUsuario = usuario === 'TestUser' ? 'Mikelennn' : usuario;
        
        console.log(`\n╭━━〔 🤍 𝐒𝐇𝐎𝐓𝐎𝐁𝐎𝐓 ♥ 〕━━⊷`);
        console.log(`┃ 👤 Usuario: @${nombreUsuario}`);
        console.log(`┃ 🤖 Versión: Beta 2.0`);
        console.log(`┃ 🧠 Comandos: 75`);
        console.log(`┃ 💰 ShoCoins: ${totalCoins}`);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`╭━━〔 ℹ️ INFORMACIÓN 〕━━━`);
        console.log(`┃ ℹ️ #ping`);
        console.log(`┃ \`Velocidad del bot\``);
        console.log(`┃ ℹ️ #menu`);
        console.log(`┃ \`Muestra este menu\``);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`╭━━〔 👑 ADMINISTRACIÓN 〕━━⊷`);
        console.log(`┃ 👑 #promote @tag`);
        console.log(`┃ \`Da admin al usuario\``);
        console.log(`┃ 👑 #demote @tag`);
        console.log(`┃ \`Quita admin al usuario\``);
        console.log(`┃ 👑 #cerrar`);
        console.log(`┃ \`Cierra el grupo\``);
        console.log(`┃ 👑 #abrir`);
        console.log(`┃ \`Abre el grupo\``);
        console.log(`┃ 👑 #kick @tag`);
        console.log(`┃ \`Expulsa al usuario\``);
        console.log(`┃ 👑 #mute @tag`);
        console.log(`┃ \`Mutea al usuario (24h)\``);
        console.log(`┃ 👑 #unmute @tag`);
        console.log(`┃ \`Desmutea al usuario\``);
        console.log(`┃ 👑 #warn @tag`);
        console.log(`┃ \`Da advertencia (3 = expulsión)\``);
        console.log(`┃ 👑 #unwarn @tag`);
        console.log(`┃ \`Quita una advertencia\``);
        console.log(`┃ 👑 #warnlist`);
        console.log(`┃ \`Lista de advertencias\``);
        console.log(`┃ 👑 #hide`);
        console.log(`┃ \`Elimina mensaje respondido\``);
        console.log(`┃ 👑 #modoadmins on/off`);
        console.log(`┃ \`Modo solo admins\``);
        console.log(`┃ 👑 #banbot @tag`);
        console.log(`┃ \`Banea usuario del bot\``);
        console.log(`┃ 👑 #unbanbot @tag`);
        console.log(`┃ \`Desbanea usuario del bot\``);
        console.log(`┃ 👑 #tagall`);
        console.log(`┃ \`Etiqueta a todos\``);
        console.log(`┃ 👑 #listadmins`);
        console.log(`┃ \`Lista de admins\``);
        console.log(`┃ 👑 #listmiembros`);
        console.log(`┃ \`Lista de miembros\``);
        console.log(`┃ 👑 #listmensajes`);
        console.log(`┃ \`Contador de mensajes\``);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`╭━━〔 🛡️ PROTECCIÓN 〕━━⊷`);
        console.log(`┃ 🛡 #antispam on/off`);
        console.log(`┃ \`5 msg en 10s = warn\``);
        console.log(`┃ 🛡 #antilinks on/off`);
        console.log(`┃ \`Warn por links\``);
        console.log(`┃ 🛡 #antistickers on/off`);
        console.log(`┃ \`Warn por stickers\``);
        console.log(`┃ 🛡 #antiimg on/off`);
        console.log(`┃ \`Warn por imágenes\``);
        console.log(`┃ 🛡 #antivideos on/off`);
        console.log(`┃ \`Warn por videos\``);
        console.log(`┃ 🛡 #antiaudios on/off`);
        console.log(`┃ \`Warn por audios\``);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`╭━━〔 🎮 JUEGOS Y DIVERSIÓN 〕━━⊷`);
        console.log(`┃ 🎮 #8ball (pregunta)`);
        console.log(`┃ \`La bola mágica\``);
        console.log(`┃ 🎮 #dado`);
        console.log(`┃ \`Lanza un dado\``);
        console.log(`┃ 🎮 #moneda`);
        console.log(`┃ \`Cara o cruz\``);
        console.log(`┃ 🎮 #random (min) (max)`);
        console.log(`┃ \`Número aleatorio\``);
        console.log(`┃ 🎮 #verdadoreto`);
        console.log(`┃ \`Verdad o reto\``);
        console.log(`┃ 🎮 #top (tema)`);
        console.log(`┃ \`Top 10 aleatorio\``);
        console.log(`┃ 🎮 #gay @tag`);
        console.log(`┃ \`% de qué tan gay eres\``);
        console.log(`┃ 🎮 #iq @tag`);
        console.log(`┃ \`% de tu IQ\``);
        console.log(`┃ 🎮 #femboy @tag`);
        console.log(`┃ \`% de que tan femboy eres\``);
        console.log(`┃ 🎮 #fachero @tag`);
        console.log(`┃ \`Facherómetro\``);
        console.log(`┃ 🎮 #lesbiana @tag`);
        console.log(`┃ \`% de que tan lesbiana eres\``);
        console.log(`┃ 🎮 #wordle`);
        console.log(`┃ \`Adivina la palabra\``);
        console.log(`┃ 🎮 #ahorcado`);
        console.log(`┃ \`Juego del ahorcado\``);
        console.log(`┃ 🎮 #ruleta_rusa @tag`);
        console.log(`┃ \`Ruleta rusa\``);
        console.log(`┃ 🎮 #trivia`);
        console.log(`┃ \`Preguntas de trivia\``);
        console.log(`┃ 🎮 #ppt piedra/papel/tijera`);
        console.log(`┃ \`Juega contra el bot\``);
        console.log(`┃ 🎮 #batalla @tag`);
        console.log(`┃ \`Pelea contra alguien\``);
        console.log(`┃ 🎮 #ship @tag1 @tag2`);
        console.log(`┃ \`Porcentaje de amor\``);
        console.log(`┃ 🎮 #pareja`);
        console.log(`┃ \`Pareja aleatoria\``);
        console.log(`┃ 🎮 #chiste`);
        console.log(`┃ \`Chiste aleatorio\``);
        console.log(`┃ 🎮 #frase`);
        console.log(`┃ \`Frase motivacional\``);
        console.log(`┃ 🎮 #piropo`);
        console.log(`┃ \`Piropo aleatorio\``);
        console.log(`┃ 🎮 #insulto @tag`);
        console.log(`┃ \`Insulto gracioso\``);
        console.log(`┃ 🎮 #dato`);
        console.log(`┃ \`Dato curioso\``);
        console.log(`┃ 🎮 #conecta4 @tag`);
        console.log(`┃ \`Conecta 4\``);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`╭━━〔 💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀 〕━━⊷`);
        console.log(`┃ 💰 #minar`);
        console.log(`┃ \`Minar minerales\``);
        console.log(`┃ 💰 #cazar`);
        console.log(`┃ \`Cazar animales\``);
        console.log(`┃ 💰 #pescar`);
        console.log(`┃ \`Pescar peces\``);
        console.log(`┃ 💰 #talar`);
        console.log(`┃ \`Talar madera\``);
        console.log(`┃ 💰 #aventura`);
        console.log(`┃ \`Explorar aventura\``);
        console.log(`┃ 💰 #vender (item) (cant/all)`);
        console.log(`┃ \`Vender recursos\``);
        console.log(`┃ 💰 #inventario`);
        console.log(`┃ \`Ver inventario\``);
        console.log(`┃ 💰 #daily`);
        console.log(`┃ \`Recompensa diaria\``);
        console.log(`┃ 💰 #trabajar`);
        console.log(`┃ \`Trabajar por dinero\``);
        console.log(`┃ 💰 #cofre`);
        console.log(`┃ \`Abrir cofre (cada 6h)\``);
        console.log(`┃ 💰 #robar @usuario`);
        console.log(`┃ \`Robar a alguien\``);
        console.log(`┃ 💰 #transferir (cant) @usuario`);
        console.log(`┃ \`Transferir dinero\``);
        console.log(`┃ 💰 #banco`);
        console.log(`┃ \`Ver tu saldo\``);
        console.log(`┃ 💰 #depositar (cant|all)`);
        console.log(`┃ \`Depositar en banco\``);
        console.log(`┃ 💰 #retirar (cant|all)`);
        console.log(`┃ \`Retirar del banco\``);
        console.log(`┃ 💰 #rank`);
        console.log(`┃ \`Ranking de shoCoins\``);
        console.log(`┃ 💰 #tienda`);
        console.log(`┃ \`Tienda de herramientas\``);
        console.log(`┃ 💰 #comprar (item)`);
        console.log(`┃ \`Comprar herramienta\``);
        console.log(`┃ 💰 #weekly`);
        console.log(`┃ \`Recompensa semanal\``);
        console.log(`┃ 💰 #monthly`);
        console.log(`┃ \`Recompensa mensual\``);
        console.log(`┃ 💰 #code (código)`);
        console.log(`┃ \`Canjear código\``);
        console.log(`┃ 💰 #globalrank`);
        console.log(`┃ \`Ranking global\``);
        console.log(`┃ 💰 #granja`);
        console.log(`┃ \`Sistema de granja\``);
        console.log(`┃ 💰 #hornear`);
        console.log(`┃ \`Hornear comida\``);
        console.log(`╰━━━━━━━━━━━━━━━━━━━⬣`);
        console.log(``);
        console.log(`By: ShotoBot | By: mikelennn | By: 2941160601`);
    }
    
    // #8ball
    else if (fullText.startsWith('#8ball')) {
        const pregunta = fullText.replace('#8ball', '').trim();
        if (!pregunta) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 #8ball (tu pregunta)`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const response = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
            console.log(`\n╭━━〔 🎱 𝐁𝐎𝐋𝐀 𝐌𝐀́𝐆𝐈𝐂𝐀 〕━⬣`);
            console.log(`┃ 📝 Pregunta: ${pregunta}`);
            console.log(`┃ ✨ Respuesta: ${response}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #dado
    else if (cmd === '#dado') {
        const roll = Math.floor(Math.random() * 6) + 1;
        const dado = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][roll - 1];
        console.log(`\n╭━━〔 🎲 𝐃𝐀𝐃𝐎 〕━━━━━⬣`);
        console.log(`┃ ${dado} Saliste: ${roll}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #moneda
    else if (cmd === '#moneda') {
        const result = Math.random() < 0.5 ? '🌕 CARA' : '🌑 CRUZ';
        console.log(`\n╭━━〔 🪙 𝐌𝐎𝐍𝐄𝐃𝐀 〕━━━⬣`);
        console.log(`┃ ${result}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #random
    else if (fullText.startsWith('#random')) {
        const parts = fullText.split(' ');
        if (parts.length < 3) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 #random (min) (max)`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const min = parseInt(parts[1]);
            const max = parseInt(parts[2]);
            if (isNaN(min) || isNaN(max)) {
                console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
                console.log(`┃ 📌 Usa números válidos`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            } else {
                const random = Math.floor(Math.random() * (max - min + 1)) + min;
                console.log(`\n╭━━〔 🎲 𝐑𝐀𝐍𝐃𝐎𝐌 〕━━━⬣`);
                console.log(`┃ 📊 Rango: ${min} - ${max}`);
                console.log(`┃ 🎯 Número: ${random}`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            }
        }
    }
    
    // #verdadoreto
    else if (cmd === '#verdadoreto') {
        const type = Math.random() < 0.5 ? 'VERDAD' : 'RETO';
        const content = type === 'VERDAD' ? truths[Math.floor(Math.random() * truths.length)] : dares[Math.floor(Math.random() * dares.length)];
        console.log(`\n╭━━〔 🎲 𝐕𝐄𝐑𝐃𝐀𝐃 𝐎 𝐑𝐄𝐓𝐎 〕━⬣`);
        console.log(`┃ 📌 ${type}`);
        console.log(`┃ 📝 ${content}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #gay
    else if (fullText.startsWith('#gay')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const percent = Math.floor(Math.random() * 101);
        const bar = '🌈'.repeat(Math.floor(percent / 10)) + '⬜'.repeat(10 - Math.floor(percent / 10));
        console.log(`\n╭━━〔 🏳️‍🌈 𝐆𝐀𝐘𝐌𝐄𝐓𝐑𝐎 〕━⬣`);
        console.log(`┃ 👤 @${target[0]}`);
        console.log(`┃ 📊 ${percent}% gay`);
        console.log(`┃ ${bar}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    // #iq
    else if (fullText.startsWith('#iq')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const iq = Math.floor(Math.random() * 151) + 50;
        let nivel = iq < 70 ? '🔴 Muy bajo' : iq < 90 ? '🟡 Bajo' : iq < 110 ? '🟢 Normal' : iq < 130 ? '🟣 Alto' : '🔵 Genio';
        console.log(`\n╭━━〔 🧠 𝐈𝐐 𝐌𝐄𝐓𝐑𝐎 〕━━━⬣`);
        console.log(`┃ 👤 @${target[0]}`);
        console.log(`┃ 📊 ${iq} puntos`);
        console.log(`┃ 🏷️ ${nivel}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #femboy
    else if (fullText.startsWith('#femboy')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const percent = Math.floor(Math.random() * 101);
        console.log(`\n╭━━〔 🎀 𝐅𝐄𝐌𝐁𝐎𝐘𝐌𝐄𝐓𝐑𝐎 〕━⬣`);
        console.log(`┃ 👤 @${target[0]}`);
        console.log(`┃ 📊 ${percent}% femboy`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #fachero
    else if (fullText.startsWith('#fachero')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const percent = Math.floor(Math.random() * 101);
        console.log(`\n╭━━〔 💅 𝐅𝐀𝐂𝐇𝐄𝐑𝐎𝐌𝐄𝐓𝐑𝐎 〕━⬣`);
        console.log(`┃ 👤 @${target[0]}`);
        console.log(`┃ 📊 ${percent}% fachero`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #lesbiana
    else if (fullText.startsWith('#lesbiana')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const percent = Math.floor(Math.random() * 101);
        console.log(`\n╭━━〔 👩‍❤️‍💋‍👩 𝐋𝐄𝐒𝐁𝐈𝐀𝐍𝐀 〕━⬣`);
        console.log(`┃ 👤 @${target[0]}`);
        console.log(`┃ 📊 ${percent}% lesbiana`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #chiste
    else if (cmd === '#chiste') {
        const chiste = chistes[Math.floor(Math.random() * chistes.length)];
        console.log(`\n╭━━〔 😂 𝐂𝐇𝐈𝐒𝐓𝐄 〕━━━━⬣`);
        console.log(`┃ ${chiste}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #frase
    else if (cmd === '#frase') {
        const frase = frases[Math.floor(Math.random() * frases.length)];
        console.log(`\n╭━━〔 💭 𝐅𝐑𝐀𝐒𝐄 〕━━━━━⬣`);
        console.log(`┃ ✨ ${frase}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #piropo
    else if (cmd === '#piropo') {
        const piropo = piropos[Math.floor(Math.random() * piropos.length)];
        console.log(`\n╭━━〔 🌹 𝐏𝐈𝐑𝐎𝐏𝐎 〕━━━━⬣`);
        console.log(`┃ ${piropo}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #insulto
    else if (fullText.startsWith('#insulto')) {
        let target = getMentionedOrReplied(fullText);
        if (!target) target = [usuario];
        const insulto = insultos[Math.floor(Math.random() * insultos.length)];
        console.log(`\n╭━━〔 🤬 𝐈𝐍𝐒𝐔𝐋𝐓𝐎 〕━━━⬣`);
        console.log(`┃ @${target[0]} ${insulto}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #dato
    else if (cmd === '#dato') {
        const dato = datosCuriosos[Math.floor(Math.random() * datosCuriosos.length)];
        console.log(`\n╭━━〔 🔍 𝐃𝐀𝐓𝐎 𝐂𝐔𝐑𝐈𝐎𝐒𝐎 〕━⬣`);
        console.log(`┃ ${dato}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #minar
    else if (cmd === '#minar') {
        const cooldown = getCooldown(usuario, 'minar');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
            console.log(`\n╭━━〔 ⛏️ 𝐌𝐈𝐍𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos}m ${segundos}s`);
            console.log(`┃ 🕐 Cooldown: 10 minutos`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const item = selectItemByRarity(minerales);
            addInventoryItem(usuario, item);
            updateCooldown(usuario, 'minar');
            console.log(`\n╭━━〔 ⛏️ 𝐌𝐈𝐍𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Has minado ${item.nombre}!`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`┃ 📦 Se ha añadido a tu inventario`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #cazar
    else if (cmd === '#cazar') {
        const cooldown = getCooldown(usuario, 'cazar');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
            console.log(`\n╭━━〔 🏹 𝐂𝐀𝐙𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos}m ${segundos}s`);
            console.log(`┃ 🕐 Cooldown: 10 minutos`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const item = selectItemByRarity(animales);
            addInventoryItem(usuario, item);
            updateCooldown(usuario, 'cazar');
            console.log(`\n╭━━〔 🏹 𝐂𝐀𝐙𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Has cazado ${item.nombre}!`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`┃ 📦 Se ha añadido a tu inventario`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #pescar
    else if (cmd === '#pescar') {
        const cooldown = getCooldown(usuario, 'pescar');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
            console.log(`\n╭━━〔 🎣 𝐏𝐄𝐒𝐂𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos}m ${segundos}s`);
            console.log(`┃ 🕐 Cooldown: 10 minutos`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const item = selectItemByRarity(peces);
            addInventoryItem(usuario, item);
            updateCooldown(usuario, 'pescar');
            console.log(`\n╭━━〔 🎣 𝐏𝐄𝐒𝐂𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Has pescado ${item.nombre}!`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`┃ 📦 Se ha añadido a tu inventario`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #talar
    else if (cmd === '#talar') {
        const cooldown = getCooldown(usuario, 'talar');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
            console.log(`\n╭━━〔 🪓 𝐓𝐀𝐋𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos}m ${segundos}s`);
            console.log(`┃ 🕐 Cooldown: 10 minutos`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const item = selectItemByRarity(arboles);
            addInventoryItem(usuario, item);
            updateCooldown(usuario, 'talar');
            console.log(`\n╭━━〔 🪓 𝐓𝐀𝐋𝐀𝐑 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Has talado ${item.nombre}!`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`┃ 📦 Se ha añadido a tu inventario`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #granja
    else if (cmd === '#granja') {
        const cooldown = getCooldown(usuario, 'granja');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
            console.log(`\n╭━━〔 🌾 𝐆𝐑𝐀𝐍𝐉𝐀 〕━━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos}m ${segundos}s`);
            console.log(`┃ 🕐 Cooldown: 10 minutos`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const item = selectItemByRarity(granjaItems);
            addInventoryItem(usuario, item);
            updateCooldown(usuario, 'granja');
            console.log(`\n╭━━〔 🌾 𝐆𝐑𝐀𝐍𝐉𝐀 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Cosechaste ${item.nombre}!`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`┃ 📦 Se ha añadido a tu inventario`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #inventario
    else if (cmd === '#inventario') {
        const user = getEconomyUser(usuario);
        if (user.inventory.length === 0) {
            console.log(`\n╭━━〔 📦 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 〕━⬣`);
            console.log(`┃ 📭 Tu inventario está vacío`);
            console.log(`┃ 📌 Usa #minar, #cazar, #pescar, #talar`);
            console.log(`┃ 📌 Para vender usa: #vender (item) (cantidad)`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            console.log(`\n╭━━〔 📦 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 〕━⬣`);
            for (const item of user.inventory) {
                console.log(`┃ • ${item.nombre}: ${item.cantidad} (${item.valor} c/u)`);
            }
            console.log(`┃ `);
            console.log(`┃ 📌 Vender: #vender (item) (cantidad)`);
            console.log(`┃ 📌 Vender todo: #vender_all`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #vender
    else if (fullText.startsWith('#vender')) {
        const args = fullText.replace('#vender', '').trim().split(' ');
        if (args.length < 2) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 #vender (item) (cantidad)`);
            console.log(`┃ 📌 #vender_all`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else if (args[0] === 'all') {
            const user = getEconomyUser(usuario);
            if (user.inventory.length === 0) {
                console.log(`\n╭━━〔 ❌ 𝐕𝐄𝐍𝐃𝐄𝐑 〕━━━━⬣`);
                console.log(`┃ 📦 No tienes nada en tu inventario`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            } else {
                let totalGanancia = 0;
                let itemsVendidos = [];
                for (const item of user.inventory) {
                    totalGanancia += item.valor * item.cantidad;
                    itemsVendidos.push(`${item.cantidad}x ${item.nombre} (${item.valor * item.cantidad} shoCoins)`);
                }
                user.wallet += totalGanancia;
                user.inventory = [];
                economy[usuario] = user;
                console.log(`\n╭━━〔 💰 𝐕𝐄𝐍𝐓𝐀 𝐓𝐎𝐓𝐀𝐋 〕━⬣`);
                console.log(`┃ 📦 Items vendidos:`);
                for (const item of itemsVendidos) {
                    console.log(`┃ ${item}`);
                }
                console.log(`┃ ✨ Ganancia total: ${totalGanancia} shoCoins`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            }
        } else {
            const cantidad = parseInt(args[args.length - 1]);
            const nombreItem = args.slice(0, -1).join(' ');
            if (isNaN(cantidad) || cantidad < 1) {
                console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
                console.log(`┃ 📌 #vender (item) (cantidad)`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            } else {
                const resultado = sellInventoryItem(usuario, nombreItem, cantidad);
                if (resultado.success) {
                    console.log(`\n╭━━〔 💰 𝐕𝐄𝐍𝐓𝐀 〕━━━━━⬣`);
                    console.log(`┃ ✅ Vendiste ${resultado.cantidad}x ${resultado.nombre}`);
                    console.log(`┃ ✨ Ganaste: ${resultado.ganancia} shoCoins`);
                    console.log(`╰━━━━━━━━━━━━━━━━⬣`);
                } else {
                    console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
                    console.log(`┃ ${resultado.reason}`);
                    console.log(`╰━━━━━━━━━━━━━━━━⬣`);
                }
            }
        }
    }
    
    // #banco
    else if (cmd === '#banco') {
        const user = getEconomyUser(usuario);
        console.log(`\n╭━━〔 🏦 𝐁𝐀𝐍𝐂𝐎 〕━━━━━⬣`);
        console.log(`┃ 👤 Usuario: @${usuario}`);
        console.log(`┃ 💰 Cartera: ${user.wallet} shoCoins`);
        console.log(`┃ 🏦 Banco: ${user.bank} shoCoins`);
        console.log(`┃ 📊 Total: ${user.wallet + user.bank} shoCoins`);
        console.log(`┃ `);
        console.log(`┃ 📌 Depositar: #depositar (cantidad/all)`);
        console.log(`┃ 📌 Retirar: #retirar (cantidad/all)`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #depositar
    else if (fullText.startsWith('#depositar')) {
        const args = fullText.replace('#depositar', '').trim();
        const user = getEconomyUser(usuario);
        let cantidad;
        if (args === 'all') {
            cantidad = user.wallet;
        } else {
            cantidad = parseInt(args);
            if (isNaN(cantidad) || cantidad <= 0) {
                console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
                console.log(`┃ 📌 #depositar (cantidad/all)`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
                return;
            }
        }
        if (user.wallet < cantidad) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 💰 No tienes suficiente dinero en cartera`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            user.wallet -= cantidad;
            user.bank += cantidad;
            economy[usuario] = user;
            console.log(`\n╭━━〔 🏦 𝐃𝐄𝐏𝐎𝐒𝐈𝐓𝐎 〕━━━⬣`);
            console.log(`┃ ✅ Depositaste ${cantidad} shoCoins`);
            console.log(`┃ 🏦 Banco: ${user.bank} shoCoins`);
            console.log(`┃ 💰 Cartera: ${user.wallet} shoCoins`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #retirar
    else if (fullText.startsWith('#retirar')) {
        const args = fullText.replace('#retirar', '').trim();
        const user = getEconomyUser(usuario);
        let cantidad;
        if (args === 'all') {
            cantidad = user.bank;
        } else {
            cantidad = parseInt(args);
            if (isNaN(cantidad) || cantidad <= 0) {
                console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
                console.log(`┃ 📌 #retirar (cantidad/all)`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
                return;
            }
        }
        if (user.bank < cantidad) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 🏦 No tienes suficiente dinero en el banco`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            user.bank -= cantidad;
            user.wallet += cantidad;
            economy[usuario] = user;
            console.log(`\n╭━━〔 🏦 𝐑𝐄𝐓𝐈𝐑𝐎 〕━━━━⬣`);
            console.log(`┃ ✅ Retiraste ${cantidad} shoCoins`);
            console.log(`┃ 🏦 Banco: ${user.bank} shoCoins`);
            console.log(`┃ 💰 Cartera: ${user.wallet} shoCoins`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #daily
    else if (cmd === '#daily') {
        const user = getEconomyUser(usuario);
        const now = Date.now();
        const lastDaily = user.lastDaily || 0;
        const remaining = 86400000 - (now - lastDaily);
        if (remaining > 0) {
            const horas = Math.floor(remaining / 3600000);
            const minutos = Math.floor((remaining % 3600000) / 60000);
            console.log(`\n╭━━〔 📅 𝐃𝐀𝐈𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ⏰ Próxima recompensa en: ${horas}h ${minutos}m`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const recompensa = Math.floor(Math.random() * 500) + 100;
            user.wallet += recompensa;
            user.lastDaily = now;
            economy[usuario] = user;
            console.log(`\n╭━━〔 📅 𝐃𝐀𝐈𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Recompensa diaria!`);
            console.log(`┃ 💰 Obtuviste: ${recompensa} shoCoins`);
            console.log(`┃ 📅 Vuelve mañana por más`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #weekly
    else if (cmd === '#weekly') {
        const user = getEconomyUser(usuario);
        const now = Date.now();
        const lastWeekly = user.lastWeekly || 0;
        const remaining = 604800000 - (now - lastWeekly);
        if (remaining > 0) {
            const dias = Math.floor(remaining / 86400000);
            console.log(`\n╭━━〔 📆 𝐖𝐄𝐄𝐊𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ⏰ Próxima recompensa en: ${dias} días`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const recompensa = Math.floor(Math.random() * 2000) + 500;
            user.wallet += recompensa;
            user.lastWeekly = now;
            economy[usuario] = user;
            console.log(`\n╭━━〔 📆 𝐖𝐄𝐄𝐊𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Recompensa semanal!`);
            console.log(`┃ 💰 Obtuviste: ${recompensa} shoCoins`);
            console.log(`┃ 📅 Vuelve la próxima semana`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #monthly
    else if (cmd === '#monthly') {
        const user = getEconomyUser(usuario);
        const now = Date.now();
        const lastMonthly = user.lastMonthly || 0;
        const remaining = 2592000000 - (now - lastMonthly);
        if (remaining > 0) {
            const dias = Math.floor(remaining / 86400000);
            console.log(`\n╭━━〔 📅 𝐌𝐎𝐍𝐓𝐇𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ⏰ Próxima recompensa en: ${dias} días`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const recompensa = Math.floor(Math.random() * 5000) + 1000;
            user.wallet += recompensa;
            user.lastMonthly = now;
            economy[usuario] = user;
            console.log(`\n╭━━〔 📅 𝐌𝐎𝐍𝐓𝐇𝐋𝐘 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Recompensa mensual!`);
            console.log(`┃ 💰 Obtuviste: ${recompensa} shoCoins`);
            console.log(`┃ 📅 Vuelve el próximo mes`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #trabajar
    else if (cmd === '#trabajar') {
        const cooldown = getCooldown(usuario, 'trabajar');
        if (!cooldown.canUse) {
            const minutos = Math.ceil(cooldown.remaining / 60000);
            console.log(`\n╭━━〔 💼 𝐓𝐑𝐀𝐁𝐀𝐉𝐀𝐑 〕━━━⬣`);
            console.log(`┃ ⏰ Espera ${minutos} minutos`);
            console.log(`┃ 🕐 Cooldown: 1 hora`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            const salario = Math.floor(Math.random() * 200) + 50;
            const user = getEconomyUser(usuario);
            user.wallet += salario;
            updateCooldown(usuario, 'trabajar');
            economy[usuario] = user;
            const trabajos = ["💻 Programador", "👨‍🍳 Cocinero", "📦 Repartidor", "🧹 Limpieza", "📝 Profesor", "🚗 Uber", "📞 Telemarketing", "📊 Data entry"];
            const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
            console.log(`\n╭━━〔 💼 𝐓𝐑𝐀𝐁𝐀𝐉𝐀𝐑 〕━━━⬣`);
            console.log(`┃ 🏢 Trabajaste como: ${trabajo}`);
            console.log(`┃ 💰 Ganaste: ${salario} shoCoins`);
            console.log(`┃ ✨ Vuelve en 1 hora`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #cofre
    else if (cmd === '#cofre') {
        const user = getEconomyUser(usuario);
        const now = Date.now();
        const lastChest = user.lastChest || 0;
        const remaining = 21600000 - (now - lastChest);
        if (remaining > 0) {
            const horas = Math.floor(remaining / 3600000);
            const minutos = Math.floor((remaining % 3600000) / 60000);
            console.log(`\n╭━━〔 🎁 𝐂𝐎𝐅𝐑𝐄 〕━━━━⬣`);
            console.log(`┃ ⏰ Próximo cofre en: ${horas}h ${minutos}m`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        } else {
            user.lastChest = now;
            economy[usuario] = user;
            const cofreItems = [
                { nombre: "🪙 Moneda de oro", valor: 50, rareza: 20 },
                { nombre: "💎 Rubí pirata", valor: 150, rareza: 12 },
                { nombre: "🏴‍☠️ Bandera pirata", valor: 80, rareza: 15 },
                { nombre: "💀 Calavera", valor: 180, rareza: 9 }
            ];
            const item = selectItemByRarity(cofreItems);
            addInventoryItem(usuario, item);
            console.log(`\n╭━━〔 🎁 𝐂𝐎𝐅𝐑𝐄 〕━━━━⬣`);
            console.log(`┃ ✨ ¡Abriste el cofre!`);
            console.log(`┃ 🏆 Encontraste: ${item.nombre}`);
            console.log(`┃ 💰 Valor: ${item.valor} shoCoins`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #wordle
    else if (cmd === '#wordle') {
        if (!games[usuario]) games[usuario] = {};
        games[usuario].wordle = newWordleGame();
        console.log(`\n╭━━〔 🟩 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣`);
        console.log(`┃ 🎮 ¡Nueva partida!`);
        console.log(`┃ 📝 Adivina la palabra de 5 letras`);
        console.log(`┃ 🔢 Tienes 6 intentos`);
        console.log(`┃ 📌 Usa: #wordle_palabra (palabra)`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #wordle_palabra
    else if (fullText.startsWith('#wordle_palabra')) {
        const guess = fullText.replace('#wordle_palabra', '').trim().toUpperCase();
        if (!games[usuario]?.wordle || games[usuario].wordle.guessed) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 Inicia #wordle primero`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        const game = games[usuario].wordle;
        if (guess.length !== 5) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 La palabra debe tener 5 letras`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        const result = checkWordleGuess(guess, game.word);
        game.attempts++;
        game.history.push(`#${game.attempts}: ${guess} → ${result}`);
        let historyText = game.history.join('\n');
        if (guess === game.word) {
            game.guessed = true;
            console.log(`\n╭━━〔 🎉 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣`);
            console.log(`┃ ✅ ¡Correcto! Era: ${game.word}`);
            console.log(`┃ 🔢 Intentos: ${game.attempts}/6`);
            console.log(`┃ 📜 Historial:\n${historyText}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            delete games[usuario].wordle;
        } else if (game.attempts >= 6) {
            console.log(`\n╭━━〔 ❌ 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣`);
            console.log(`┃ 😭 Perdiste! Era: ${game.word}`);
            console.log(`┃ 📜 Historial:\n${historyText}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            delete games[usuario].wordle;
        } else {
            console.log(`\n╭━━〔 🟩 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣`);
            console.log(`┃ ${result}`);
            console.log(`┃ 🔢 Intento ${game.attempts}/6`);
            console.log(`┃ 📜 Historial:\n${historyText}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #ahorcado
    else if (cmd === '#ahorcado') {
        if (!games[usuario]) games[usuario] = {};
        games[usuario].hangman = newHangmanGame();
        const display = getHangmanDisplay(games[usuario].hangman);
        console.log(`\n╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
        console.log(`${hangmanStages[0]}`);
        console.log(`┃ 📝 Palabra: ${display}`);
        console.log(`┃ ❌ Fallos: 0/6`);
        console.log(`┃ 📌 Usa: #ahorcado_letra (letra) o #ahorcado_palabra (palabra)`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // #ahorcado_letra
    else if (fullText.startsWith('#ahorcado_letra')) {
        const letter = fullText.replace('#ahorcado_letra', '').trim().toUpperCase();
        if (!games[usuario]?.hangman || games[usuario].hangman.guessed) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 Inicia #ahorcado primero`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        const game = games[usuario].hangman;
        if (letter.length !== 1 || !letter.match(/[A-Z]/)) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 Ingresa una sola letra`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        if (game.guessedLetters.includes(letter)) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 Ya usaste la letra "${letter}"`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        game.guessedLetters.push(letter);
        if (!game.word.includes(letter)) game.attempts++;
        const display = getHangmanDisplay(game);
        if (!display.includes('_')) {
            game.guessed = true;
            console.log(`\n╭━━〔 🎉 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
            console.log(`${hangmanStages[game.attempts]}`);
            console.log(`┃ ✅ ¡Ganaste! Era: ${game.word}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            delete games[usuario].hangman;
        } else if (game.attempts >= 6) {
            console.log(`\n╭━━〔 💀 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
            console.log(`${hangmanStages[6]}`);
            console.log(`┃ 😭 Perdiste! Era: ${game.word}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            delete games[usuario].hangman;
        } else {
            console.log(`\n╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
            console.log(`${hangmanStages[game.attempts]}`);
            console.log(`┃ 📝 Palabra: ${display}`);
            console.log(`┃ ❌ Fallos: ${game.attempts}/6`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        }
    }
    
    // #ahorcado_palabra
    else if (fullText.startsWith('#ahorcado_palabra')) {
        const guess = fullText.replace('#ahorcado_palabra', '').trim().toUpperCase();
        if (!games[usuario]?.hangman || games[usuario].hangman.guessed) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 Inicia #ahorcado primero`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        const game = games[usuario].hangman;
        if (guess === game.word) {
            game.guessed = true;
            console.log(`\n╭━━〔 🎉 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
            console.log(`${hangmanStages[game.attempts]}`);
            console.log(`┃ ✅ ¡Ganaste! Era: ${game.word}`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            delete games[usuario].hangman;
        } else {
            game.attempts++;
            if (game.attempts >= 6) {
                console.log(`\n╭━━〔 💀 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
                console.log(`${hangmanStages[6]}`);
                console.log(`┃ 😭 Perdiste! Era: ${game.word}`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
                delete games[usuario].hangman;
            } else {
                const display = getHangmanDisplay(game);
                console.log(`\n╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣`);
                console.log(`${hangmanStages[game.attempts]}`);
                console.log(`┃ 📝 Palabra: ${display}`);
                console.log(`┃ ❌ Fallos: ${game.attempts}/6`);
                console.log(`┃ ❌ "${guess}" no es correcta`);
                console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            }
        }
    }
    
    // #shoto_ai
    else if (fullText.startsWith('#shoto_ai')) {
        const pregunta = fullText.replace('#shoto_ai', '').trim();
        if (!pregunta) {
            console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
            console.log(`┃ 📌 #shoto_ai (tu pregunta)`);
            console.log(`╰━━━━━━━━━━━━━━━━⬣`);
            return;
        }
        console.log(`\n╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣`);
        console.log(`┃ 💭 Pensando...`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
        await new Promise(r => setTimeout(r, 1000));
        const respuestas = [
            "✨ ¡Hola! Soy Shoto_AI, tu asistente virtual. ¿En qué puedo ayudarte?",
            "🌟 Interesante pregunta. Déjame pensar...",
            "💫 Como inteligencia artificial, te recomiendo disfrutar el momento.",
            "🎱 ¡Buena pregunta! La respuesta depende del contexto.",
            "⭐ Eso es algo que deberías investigar más a fondo.",
            "🔮 Según mi base de datos, eso es fascinante!"
        ];
        const respuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
        console.log(`\n╭━━〔 🤖 𝐒𝐇𝐎𝐓𝐎_𝐀𝐈 〕━━━⬣`);
        console.log(`┃ 📝 Pregunta: ${pregunta.substring(0, 100)}`);
        console.log(`┃ ✨ Respuesta: ${respuesta}`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    // Comando no reconocido
    else {
        console.log(`\n╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣`);
        console.log(`┃ ❌ Comando no reconocido: "${texto}"`);
        console.log(`┃ 📌 Escribe #menu para ver los comandos disponibles`);
        console.log(`╰━━━━━━━━━━━━━━━━⬣`);
    }
    
    console.log('');
}

// ==================== INICIAR SIMULADOR ====================
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function prompt() {
    rl.question('🔹 Tú: ', async (input) => {
        if (input.toLowerCase() === 'salir' || input.toLowerCase() === 'exit') {
            console.log('\n👋 ¡Hasta luego! Gracias por probar ShotoBot.');
            rl.close();
            process.exit(0);
        }
        if (input.trim()) {
            await procesarComando(input.trim(), 'TestUser');
        }
        prompt();
    });
}

prompt();
