const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const DATA_DIR = './bot_data';
const WARN_FILE = path.join(DATA_DIR, 'warns.json');
const BAN_FILE = path.join(DATA_DIR, 'bans.json');
const MODE_FILE = path.join(DATA_DIR, 'mode.json');
const MUTE_FILE = path.join(DATA_DIR, 'mutes.json');
const MSG_COUNT_FILE = path.join(DATA_DIR, 'msgcount.json');
const PROTECTION_FILE = path.join(DATA_DIR, 'protection.json');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const ECONOMY_FILE = path.join(DATA_DIR, 'economy.json');
const COOLDOWNS_FILE = path.join(DATA_DIR, 'cooldowns.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

function loadData(file, defaultValue = {}) {
    try {
        if (fs.existsSync(file)) {
            return JSON.parse(fs.readFileSync(file, 'utf8'));
        }
    } catch (e) {}
    return defaultValue;
}

function saveData(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

let warns = loadData(WARN_FILE);
let bans = loadData(BAN_FILE);
let groupMode = loadData(MODE_FILE);
let mutes = loadData(MUTE_FILE);
let msgCount = loadData(MSG_COUNT_FILE);
let protection = loadData(PROTECTION_FILE, {});
let games = loadData(GAMES_FILE, {});
let economy = loadData(ECONOMY_FILE, {});
let cooldowns = loadData(COOLDOWNS_FILE, {});

// Configuración de bienvenidas y despedidas
let welcomeSettings = loadData('./bot_data/welcome.json', {});
let goodbyeSettings = loadData('./bot_data/goodbye.json', {});

const defaultWelcomeMsg = '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\n┃ 👤 @user\n┃ ✨ ¡Bienvenido al grupo!\n┃ 📌 Lee las reglas y diviértete\n╰━━━━━━━━━━━━━━━━⬣';
const defaultGoodbyeMsg = '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\n┃ 👤 @user\n┃ 🚀 ¡Nos vemos pronto!\n┃ 💫 Siempre serás bienvenido\n╰━━━━━━━━━━━━━━━━⬣';

function saveWelcomeConfig() { saveData('./bot_data/welcome.json', welcomeSettings); }
function saveGoodbyeConfig() { saveData('./bot_data/goodbye.json', goodbyeSettings); }

let spamTracker = {};
let russianRouletteTimers = {};

// Respuestas para 8ball (14 respuestas)
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

// Verdades y Retos (20 cada uno)
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
// Palabras para Wordle (30 palabras de 5 letras)
const wordleWords = [
    "PERRO", "GATO", "CASA", "PERA", "MANO", "BOCA", "PELO", "RISA", "LUNA", "SOL",
    "MAR", "FLOR", "FUEGO", "AGUA", "NUBE", "AMOR", "VIDA", "ALMA", "SUENO", "TIEMPO",
    "MUNDO", "CIELO", "ROJO", "AZUL", "VERDE", "BLANCO", "NEGRO", "DULCE", "FUERTE", "RAPIDO"
].filter(w => w.length === 5);

// Palabras para Ahorcado (30 palabras)
const hangmanWords = [
    "ELEFANTE", "MARIPOSA", "CASTILLO", "BICICLETA", "CHOCOLATE", "TELEFONO", "COMPUTADORA",
    "LIBRO", "ESCUELA", "MEDICO", "HOSPITAL", "AVION", "TREN", "CARRO", "MOTO", "CAMION",
    "BUS", "TAXI", "BARCO", "SUBMARINO", "HELICOPTERO", "COHETE", "PLANETA", "GALAXIA",
    "UNIVERSO", "ATOMO", "MOLECULA", "CELULA", "ORGANO", "SISTEMA"
];

const hangmanStages = [
    "```\n   +---+\n   |   |\n       |\n       |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n       |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n   |   |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|   |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n       |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n  /    |\n       |\n=========\n```",
    "```\n   +---+\n   |   |\n   O   |\n  /|\\  |\n  / \\  |\n       |\n=========\n```"
];

// Trivia preguntas (30 preguntas)
const triviaQuestions = [
    { question: "¿Cuál es el planeta más grande del sistema solar?", options: ["Marte", "Júpiter", "Saturno", "Neptuno"], answer: "b" },
    { question: "¿Quién pintó la Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], answer: "c" },
    { question: "¿En qué año llegó el hombre a la luna?", options: ["1969", "1972", "1965", "1970"], answer: "a" },
    { question: "¿Cuál es el río más largo del mundo?", options: ["Amazonas", "Nilo", "Yangtsé", "Misisipi"], answer: "a" },
    { question: "¿Qué país ganó el mundial 2018?", options: ["Alemania", "Brasil", "Francia", "Argentina"], answer: "c" },
    { question: "¿Cuál es el animal más rápido del mundo?", options: ["León", "Guepardo", "Tigre", "Pantera"], answer: "b" },
    { question: "¿Quién escribió 'Cien años de soledad'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Julio Cortázar", "Pablo Neruda"], answer: "b" },
    { question: "¿Cuál es el océano más grande?", options: ["Atlántico", "Índico", "Pacífico", "Ártico"], answer: "c" },
    { question: "¿En qué año comenzó la Segunda Guerra Mundial?", options: ["1935", "1939", "1941", "1945"], answer: "b" },
    { question: "¿Qué país tiene la población más grande?", options: ["India", "EE.UU.", "China", "Indonesia"], answer: "c" },
    { question: "¿Cuál es el metal más caro del mundo?", options: ["Oro", "Platino", "Rodio", "Paladio"], answer: "c" },
    { question: "¿Quién descubrió la penicilina?", options: ["Louis Pasteur", "Alexander Fleming", "Marie Curie", "Isaac Newton"], answer: "b" },
    { question: "¿Cuál es la montaña más alta del mundo?", options: ["K2", "Kangchenjunga", "Everest", "Lhotse"], answer: "c" },
    { question: "¿Qué idioma tiene más hablantes nativos?", options: ["Inglés", "Español", "Mandarín", "Hindi"], answer: "c" },
    { question: "¿Quién fue el primer hombre en pisar la luna?", options: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"], answer: "b" },
    { question: "¿Cuál es el país más pequeño del mundo?", options: ["Mónaco", "San Marino", "Vaticano", "Malta"], answer: "c" },
    { question: "¿Qué vitamina produce el cuerpo con la luz solar?", options: ["Vitamina A", "Vitamina C", "Vitamina D", "Vitamina E"], answer: "c" },
    { question: "¿Quién pintó 'La noche estrellada'?", options: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Salvador Dalí"], answer: "b" },
    { question: "¿Cuál es el desierto más grande del mundo?", options: ["Sahara", "Gobi", "Árabe", "Antártida"], answer: "d" },
    { question: "¿Qué instrumento toca Mozart?", options: ["Violín", "Piano", "Flauta", "Guitarra"], answer: "b" },
    { question: "¿Cuál es el animal más grande del mundo?", options: ["Elefante", "Ballena Azul", "Jirafa", "Tiburón Ballena"], answer: "b" },
    { question: "¿Quién escribió 'Hamlet'?", options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"], answer: "c" },
    { question: "¿En qué continente está Egipto?", options: ["Asia", "Europa", "África", "América"], answer: "c" },
    { question: "¿Cuál es el río más caudaloso del mundo?", options: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], answer: "b" },
    { question: "¿Quién fue el primer presidente de Estados Unidos?", options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], answer: "c" },
    { question: "¿Qué planeta es conocido como el 'Planeta Rojo'?", options: ["Marte", "Júpiter", "Venus", "Mercurio"], answer: "a" },
    { question: "¿Cuál es el hueso más largo del cuerpo humano?", options: ["Húmero", "Radio", "Fémur", "Tibia"], answer: "c" },
    { question: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Lope de Vega", "Miguel de Cervantes", "Francisco de Quevedo", "Luis de Góngora"], answer: "b" },
    { question: "¿Cuál es el país más grande del mundo?", options: ["Canadá", "China", "EE.UU.", "Rusia"], answer: "d" },
    { question: "¿Qué gas es más abundante en la atmósfera?", options: ["Oxígeno", "Dióxido de Carbono", "Nitrógeno", "Argón"], answer: "c" }
];

// Textos de batalla (15 textos)
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
// Chistes (30 chistes)
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

// Frases motivacionales (30 frases)
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

// Piropos (30 piropos)
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

// Insultos (30 insultos)
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
// Datos curiosos (30 datos)
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

// ==================== SISTEMA DE ECONOMÍA ====================

// Minerales para minar (10 minerales)
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

// Animales para cazar (20 animales)
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

// Peces para pescar (25 peces)
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

// Árboles para talar (15 cosas)
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
// Items de aventura
const aventuraItems = [
    { nombre: "🗺️ Mapa antiguo", valor: 50, rareza: 15 },
    { nombre: "🔑 Llave dorada", valor: 100, rareza: 10 },
    { nombre: "💍 Anillo mágico", valor: 200, rareza: 7 },
    { nombre: "📜 Pergamino", valor: 80, rareza: 12 },
    { nombre: "🏺 Vasija ancestral", valor: 150, rareza: 8 },
    { nombre: "⚔️ Espada legendaria", valor: 500, rareza: 2 },
    { nombre: "🛡️ Escudo encantado", valor: 300, rareza: 4 },
    { nombre: "👑 Corona real", valor: 1000, rareza: 0.5 },
    { nombre: "💎 Gema mística", valor: 250, rareza: 5 },
    { nombre: "🕯️ Lámpara mágica", valor: 180, rareza: 6 },
    { nombre: "📿 Collar de perlas", valor: 120, rareza: 9 },
    { nombre: "🏆 Trofeo", valor: 400, rareza: 3 },
    { nombre: "🎭 Máscara ritual", valor: 90, rareza: 11 },
    { nombre: "🔮 Bola de cristal", valor: 220, rareza: 5.5 },
    { nombre: "⚗️ Poción mágica", valor: 75, rareza: 13 }
];

// Items del cofre pirata
const cofreItems = [
    { nombre: "🪙 Moneda de oro", valor: 50, rareza: 20 },
    { nombre: "💎 Rubí pirata", valor: 150, rareza: 12 },
    { nombre: "🔱 Tridente", valor: 200, rareza: 8 },
    { nombre: "🏴‍☠️ Bandera pirata", valor: 80, rareza: 15 },
    { nombre: "⚓ Ancla", valor: 60, rareza: 16 },
    { nombre: "🗡️ Daga pirata", valor: 120, rareza: 10 },
    { nombre: "🧭 Brújula", valor: 90, rareza: 13 },
    { nombre: "💀 Calavera", valor: 180, rareza: 9 },
    { nombre: "🍾 Ron", valor: 40, rareza: 18 },
    { nombre: "🐦 Loro", valor: 250, rareza: 5 },
    { nombre: "🔫 Pistola de chispa", valor: 300, rareza: 4 },
    { nombre: "👑 Corona pirata", valor: 500, rareza: 1.5 },
    { nombre: "💰 Tesoro", valor: 1000, rareza: 0.5 },
    { nombre: "🗺️ Mapa del tesoro", valor: 150, rareza: 7 },
    { nombre: "🐙 Kraken", valor: 800, rareza: 1 }
];

// Frutas y verduras para granja (20 items)
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

// Recetas para hornear (15 recetas)
const recetas = [
    { nombre: "🍞 Pan", ingredientes: ["🌾 Trigo"], valor: 30 },
    { nombre: "🥐 Croissant", ingredientes: ["🌾 Trigo", "🧈 Mantequilla"], valor: 50 },
    { nombre: "🍰 Pastel", ingredientes: ["🍎 Manzana", "🌾 Trigo", "🥚 Huevo"], valor: 80 },
    { nombre: "🍪 Galletas", ingredientes: ["🌾 Trigo", "🍫 Chocolate"], valor: 40 },
    { nombre: "🥧 Tarta", ingredientes: ["🍎 Manzana", "🌾 Trigo", "🍯 Miel"], valor: 70 },
    { nombre: "🍩 Dona", ingredientes: ["🌾 Trigo", "🍫 Chocolate"], valor: 45 },
    { nombre: "🧁 Cupcake", ingredientes: ["🌾 Trigo", "🍓 Fresa"], valor: 55 },
    { nombre: "🥖 Baguette", ingredientes: ["🌾 Trigo"], valor: 35 },
    { nombre: "🍕 Pizza", ingredientes: ["🌾 Trigo", "🍅 Tomate", "🧀 Queso"], valor: 100 },
    { nombre: "🍔 Hamburguesa", ingredientes: ["🌾 Trigo", "🥩 Carne", "🥬 Lechuga"], valor: 90 },
    { nombre: "🌮 Taco", ingredientes: ["🌽 Maíz", "🥩 Carne", "🧀 Queso"], valor: 60 },
    { nombre: "🥪 Sándwich", ingredientes: ["🌾 Trigo", "🥬 Lechuga", "🍅 Tomate"], valor: 40 },
    { nombre: "🍣 Sushi", ingredientes: ["🐟 Salmón", "🌾 Arroz", "🥑 Aguacate"], valor: 120 },
    { nombre: "🥘 Paella", ingredientes: ["🐟 Atún", "🦐 Gamba", "🌾 Arroz"], valor: 150 },
    { nombre: "🍲 Sopa", ingredientes: ["🥕 Zanahoria", "🥔 Papa", "🧅 Cebolla"], valor: 50 }
];

// Tienda de herramientas
const tiendaItems = [
    { nombre: "⛏️ Pico de hierro", precio: 500, efecto: "+5% suerte en minar", duracion: 7 },
    { nombre: "🏹 Arco de caza", precio: 600, efecto: "+5% suerte en cazar", duracion: 7 },
    { nombre: "🎣 Caña de oro", precio: 550, efecto: "+5% suerte en pescar", duracion: 7 },
    { nombre: "🪓 Hacha afilada", precio: 450, efecto: "+5% suerte en talar", duracion: 7 },
    { nombre: "🧭 Brújula mágica", precio: 800, efecto: "+10% suerte en aventura", duracion: 7 }
];

// Función para normalizar texto (quitar tildes, mayúsculas, espacios)
function normalizeString(str) {
    if (!str) return "";
    return str.toString().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

// Función para obtener item por nombre
function getItemByName(lista, nombre) {
    const nombreNorm = normalizeString(nombre);
    return lista.find(item => normalizeString(item.nombre) === nombreNorm);
}

// Función para obtener item por nombre en inventario
function getInventoryItem(inventario, nombre) {
    const nombreNorm = normalizeString(nombre);
    return inventario.find(item => normalizeString(item.nombre) === nombreNorm);
}

// Función para seleccionar item por rareza
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

// Función para obtener cooldown
function getCooldown(userId, action) {
    if (!cooldowns[userId]) cooldowns[userId] = {};
    const last = cooldowns[userId][action] || 0;
    const now = Date.now();
    return { last, remaining: Math.max(0, 600000 - (now - last)), canUse: now - last >= 600000 };
}

// Función para actualizar cooldown
function updateCooldown(userId, action) {
    if (!cooldowns[userId]) cooldowns[userId] = {};
    cooldowns[userId][action] = Date.now();
    saveData(COOLDOWNS_FILE, cooldowns);
}

// Función para obtener usuario económico
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

// Función para guardar usuario económico
function saveEconomyUser(userId, data) {
    economy[userId] = data;
    saveData(ECONOMY_FILE, economy);
}

// Función para agregar item al inventario
function addInventoryItem(userId, item, cantidad = 1) {
    const user = getEconomyUser(userId);
    const existing = user.inventory.find(i => normalizeString(i.nombre) === normalizeString(item.nombre));
    if (existing) {
        existing.cantidad += cantidad;
    } else {
        user.inventory.push({ nombre: item.nombre, valor: item.valor, cantidad: cantidad });
    }
    saveEconomyUser(userId, user);
}

// Función para eliminar item del inventario
function removeInventoryItem(userId, nombre, cantidad = 1) {
    const user = getEconomyUser(userId);
    const index = user.inventory.findIndex(i => normalizeString(i.nombre) === normalizeString(nombre));
    if (index !== -1) {
        if (user.inventory[index].cantidad <= cantidad) {
            user.inventory.splice(index, 1);
        } else {
            user.inventory[index].cantidad -= cantidad;
        }
        saveEconomyUser(userId, user);
        return true;
    }
    return false;
}

// Función para vender item
function sellInventoryItem(userId, nombre, cantidad) {
    const user = getEconomyUser(userId);
    const item = user.inventory.find(i => normalizeString(i.nombre) === normalizeString(nombre));
    if (!item) return { success: false, reason: "No tienes ese item" };
    if (item.cantidad < cantidad) return { success: false, reason: `Solo tienes ${item.cantidad} ${item.nombre}` };
    
    const totalGanancia = item.valor * cantidad;
    user.wallet += totalGanancia;
    removeInventoryItem(userId, nombre, cantidad);
    saveEconomyUser(userId, user);
    return { success: true, ganancia: totalGanancia, nombre: item.nombre, cantidad };
}
async function iniciarBot() {
    const { state, saveCreds } = await useMultiFileAuthState('sesion_shotobot');
    
    
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

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log('🔐 Escanea el QR con WhatsApp');
        }
        
        if (connection === 'open') {
            console.log('✅ ShotoBot conectado exitosamente');
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) iniciarBot();
        }
    });

    sock.ev.on('creds.update', saveCreds);

    async function getContactName(jid) {
        try {
            const contact = await sock.contactQuery(jid);
            return contact.name || contact.notify || jid.split('@')[0];
        } catch {
            return jid.split('@')[0];
        }
    }

    async function isAdmin(groupId, userId) {
        try {
            const groupMetadata = await getGroupMetadataCached(groupId);
            const participants = groupMetadata.participants;
            const user = participants.find(p => p.id === userId);
            return user && (user.admin === 'admin' || user.admin === 'superadmin');
        } catch {
            return false;
        }
    }

    async function getMentionedOrReplied(mensaje) {
        if (mensaje.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            return mensaje.message.extendedTextMessage.contextInfo.mentionedJid;
        }
        if (mensaje.message.extendedTextMessage?.contextInfo?.participant) {
            return [mensaje.message.extendedTextMessage.contextInfo.participant];
        }
        return null;
    }

    async function deleteMessage(jid, key) {
        try {
            await sock.sendMessage(jid, { delete: key });
            return true;
        } catch {
            return false;
        }
    }

    async function checkAndDeleteMuted(jid, sender, key) {
        if (mutes[sender] && mutes[sender].until > Date.now()) {
            await deleteMessage(jid, key);
            return true;
        }
        return false;
    }

    async function addWarn(groupId, userId, reason, emoji) {
        if (!warns[groupId]) warns[groupId] = {};
        if (!warns[groupId][userId]) warns[groupId][userId] = 0;
        warns[groupId][userId]++;
        const currentWarns = warns[groupId][userId];
        
        await sock.sendMessage(groupId, { 
            text: `╭━━〔 ⚠️ 𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀 〕━⬣
┃ ${emoji} Razón: ${reason}
┃ 👤 @${await getContactName(userId)}
┃ 📊 Warns: ${currentWarns}/3
┃ ⚠️ 3 warns = expulsión automática
╰━━━━━━━━━━━━━━━━⬣`, 
            mentions: [userId] 
        });
        
        if (currentWarns >= 3) {
            await sock.groupParticipantsUpdate(groupId, [userId], 'remove');
            delete warns[groupId][userId];
            await sock.sendMessage(groupId, { 
                text: `╭━━〔 🚫 𝐄𝐗𝐏𝐔𝐋𝐒𝐈𝐎́𝐍 〕━━⬣
┃ 🔴 @${await getContactName(userId)}
┃ ⚠️ Expulsado por 3 warns
┃ 📌 Razón: ${reason}
╰━━━━━━━━━━━━━━━━⬣`, 
                mentions: [userId] 
            });
            return true;
        }
        saveData(WARN_FILE, warns);
        return false;
    }

    async function checkSpam(groupId, userId, mensajeKey) {
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
            await sock.sendMessage(groupId, { react: { text: '⚠️', key: mensajeKey } });
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

    // Función para ruleta rusa
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

    // Funciones de juegos
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

    function newTriviaGame() {
        const randomQ = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
        return { question: randomQ.question, options: randomQ.options, answer: randomQ.answer };
    }

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
    // Procesar mensajes para protecciones
    
    // Evento de bienvenida y despedida
    sock.ev.on('group-participants.update', async (update) => {
        try {
            const { id, participants, action } = update;
            if (action === 'add') {
                for (const user of participants) {
                    if (welcomeSettings[id] && welcomeSettings[id].enabled) {
                        let mensaje = welcomeSettings[id].message || defaultWelcomeMsg;
                        let userId = user;
                        if (typeof user !== 'string') userId = user.id || user;
                        let nombre = userId;
                        try {
                            const contact = await sock.contactQuery(userId);
                            nombre = contact.name || contact.notify || userId.split('@')[0];
                        } catch(e) {
                            nombre = userId.split('@')[0];
                        }
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
                        let userId = user;
                        if (typeof user !== 'string') userId = user.id || user;
                        let nombre = userId;
                        try {
                            const contact = await sock.contactQuery(userId);
                            nombre = contact.name || contact.notify || userId.split('@')[0];
                        } catch(e) {
                            nombre = userId.split('@')[0];
                        }
                        mensaje = mensaje.replace(/@user/g, '@' + nombre);
                        await sock.sendMessage(id, { text: mensaje, mentions: [userId] });
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        } catch(e) {
            console.log('Error en evento de grupo:', e.message);
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const mensaje = m.messages[0];
        if (!mensaje.message) return;
        
        const remitente = mensaje.key.remoteJid;
        const sender = mensaje.key.participant || remitente;
        const isGroupChat = remitente.endsWith('@g.us');
        
        if (!isGroupChat || mensaje.key.fromMe) return;
        
        const userIsAdmin = await isAdmin(remitente, sender);
        if (userIsAdmin) return;
        
        await checkSpam(remitente, sender, mensaje.key);
        
        const texto = mensaje.message.conversation || mensaje.message.extendedTextMessage?.text;
        if (protection[remitente]?.antilinks && hasLink(texto)) {
            await deleteMessage(remitente, mensaje.key);
            await addWarn(remitente, sender, 'Envío de link', '🔗');
            await sock.sendMessage(remitente, { react: { text: '🔗', key: mensaje.key } });
            return;
        }
        
        if (protection[remitente]?.antistickers && mensaje.message.stickerMessage) {
            await deleteMessage(remitente, mensaje.key);
            await addWarn(remitente, sender, 'Envío de sticker', '🎴');
            await sock.sendMessage(remitente, { react: { text: '🎴', key: mensaje.key } });
            return;
        }
        
        if (protection[remitente]?.antiimg && mensaje.message.imageMessage) {
            await deleteMessage(remitente, mensaje.key);
            await addWarn(remitente, sender, 'Envío de imagen', '🖼️');
            await sock.sendMessage(remitente, { react: { text: '🖼️', key: mensaje.key } });
            return;
        }
        
        if (protection[remitente]?.antivideos && mensaje.message.videoMessage) {
            await deleteMessage(remitente, mensaje.key);
            await addWarn(remitente, sender, 'Envío de video', '🎥');
            await sock.sendMessage(remitente, { react: { text: '🎥', key: mensaje.key } });
            return;
        }
        
        if (protection[remitente]?.antiaudios && mensaje.message.audioMessage) {
            await deleteMessage(remitente, mensaje.key);
            await addWarn(remitente, sender, 'Envío de audio', '🎵');
            await sock.sendMessage(remitente, { react: { text: '🎵', key: mensaje.key } });
            return;
        }
    });

    // Procesar comandos
    sock.ev.on('messages.upsert', async (m) => {
        const mensaje = m.messages[0];
        if (!mensaje.message) return;
        
        const texto = mensaje.message.conversation || mensaje.message.extendedTextMessage?.text;
        const remitente = mensaje.key.remoteJid;
        const sender = mensaje.key.participant || remitente;
        const isGroupChat = remitente.endsWith('@g.us');
        
        if (!texto) return;
        
        if (bans[sender]) {
            await sock.sendMessage(remitente, { react: { text: '🚫', key: mensaje.key } });
            return;
        }
        
        if (groupMode[remitente] === 'on' && isGroupChat) {
            const isAdminUser = await isAdmin(remitente, sender);
            if (!isAdminUser && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '⚠️', key: mensaje.key } });
                return;
            }
        }
        
        // ==================== COMANDOS DE INFORMACIÓN ====================
        
        // #ping
        if (texto === '#ping') {
            const startTime = Date.now();
            await sock.sendMessage(remitente, { text: '🏓 Calculando ping...' });
            const endTime = Date.now();
            const ping = endTime - startTime;
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: `╭━━〔 🏓 𝐏𝐈𝐍𝐆 〕━━━━⬣\n┃ ⚡ Velocidad: ${ping}ms\n┃ 📡 Estado: ${ping < 200 ? '🟢 Excelente' : ping < 500 ? '🟡 Normal' : '🔴 Lento'}\n┃ 🤖 Bot: Activo\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #8ball
        if (texto.startsWith('#8ball')) {
            const question = texto.replace('#8ball', '').trim();
            if (!question) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #8ball (tu pregunta)\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const response = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 🎱 𝐁𝐎𝐋𝐀 𝐌𝐀́𝐆𝐈𝐂𝐀 〕━⬣\n┃ 📝 Pregunta: ${question}\n┃ ✨ Respuesta: ${response}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #dado
        if (texto === '#dado') {
            const roll = Math.floor(Math.random() * 6) + 1;
            const dado = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][roll - 1];
            await sock.sendMessage(remitente, { text: `╭━━〔 🎲 𝐃𝐀𝐃𝐎 〕━━━━━⬣\n┃ ${dado} Saliste: ${roll}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #moneda
        if (texto === '#moneda') {
            const result = Math.random() < 0.5 ? '🌕 CARA' : '🌑 CRUZ';
            await sock.sendMessage(remitente, { text: `╭━━〔 🪙 𝐌𝐎𝐍𝐄𝐃𝐀 〕━━━⬣\n┃ ${result}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #random
        if (texto.startsWith('#random')) {
            const parts = texto.split(' ');
            if (parts.length < 3) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #random (min) (max)\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const min = parseInt(parts[1]);
            const max = parseInt(parts[2]);
            if (isNaN(min) || isNaN(max)) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Usa números válidos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const random = Math.floor(Math.random() * (max - min + 1)) + min;
            await sock.sendMessage(remitente, { text: `╭━━〔 🎲 𝐑𝐀𝐍𝐃𝐎𝐌 〕━━━⬣\n┃ 📊 Rango: ${min} - ${max}\n┃ 🎯 Número: ${random}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #verdadoreto
        if (texto === '#verdadoreto') {
            const type = Math.random() < 0.5 ? 'VERDAD' : 'RETO';
            const content = type === 'VERDAD' ? truths[Math.floor(Math.random() * truths.length)] : dares[Math.floor(Math.random() * dares.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 🎲 𝐕𝐄𝐑𝐃𝐀𝐃 𝐎 𝐑𝐄𝐓𝐎 〕━⬣\n┃ 📌 ${type}\n┃ 📝 ${content}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #top
        if (texto.startsWith('#top') && isGroupChat) {
            const topic = texto.replace('#top', '').trim() || 'SIN TEMA';
            const groupMetadata = await getGroupMetadataCached(remitente);
            const participants = groupMetadata.participants;
            const shuffled = [...participants].sort(() => 0.5 - Math.random());
            const top10 = shuffled.slice(0, 10);
            let topText = `╭━━〔 📊 𝐓𝐎𝐏 𝟏𝟎 ${topic.toUpperCase()} 〕━⬣\n`;
            for (let i = 0; i < top10.length; i++) {
                topText += `┃ ${i+1}. @${top10[i].id.split('@')[0]}\n`;
            }
            topText += `╰━━━━━━━━━━━━━━━━⬣`;
            await sock.sendMessage(remitente, { text: topText, mentions: top10.map(p => p.id) });
        }
        
        // #gay
        if (texto.startsWith('#gay')) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target && isGroupChat) target = [sender];
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #gay @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const percent = Math.floor(Math.random() * 101);
            const bar = '🌈'.repeat(Math.floor(percent / 10)) + '⬜'.repeat(10 - Math.floor(percent / 10));
            await sock.sendMessage(remitente, { text: `╭━━〔 🏳️‍🌈 𝐆𝐀𝐘𝐌𝐄𝐓𝐑𝐎 〕━⬣\n┃ 👤 @${await getContactName(target[0])}\n┃ 📊 ${percent}% gay\n┃ ${bar}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        
        // #iq
        if (texto.startsWith('#iq')) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target && isGroupChat) target = [sender];
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #iq @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const iq = Math.floor(Math.random() * 151) + 50;
            let nivel = iq < 70 ? '🔴 Muy bajo' : iq < 90 ? '🟡 Bajo' : iq < 110 ? '🟢 Normal' : iq < 130 ? '🟣 Alto' : '🔵 Genio';
            await sock.sendMessage(remitente, { text: `╭━━〔 🧠 𝐈𝐐 𝐌𝐄𝐓𝐑𝐎 〕━━━⬣\n┃ 👤 @${await getContactName(target[0])}\n┃ 📊 ${iq} puntos\n┃ 🏷️ ${nivel}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        // #femboy
        if (texto.startsWith('#femboy')) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target && isGroupChat) target = [sender];
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #femboy @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const percent = Math.floor(Math.random() * 101);
            await sock.sendMessage(remitente, { text: `╭━━〔 🎀 𝐅𝐄𝐌𝐁𝐎𝐘𝐌𝐄𝐓𝐑𝐎 〕━⬣\n┃ 👤 @${await getContactName(target[0])}\n┃ 📊 ${percent}% femboy\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        
        // #fachero
        if (texto.startsWith('#fachero')) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target && isGroupChat) target = [sender];
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #fachero @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const percent = Math.floor(Math.random() * 101);
            await sock.sendMessage(remitente, { text: `╭━━〔 💅 𝐅𝐀𝐂𝐇𝐄𝐑𝐎𝐌𝐄𝐓𝐑𝐎 〕━⬣\n┃ 👤 @${await getContactName(target[0])}\n┃ 📊 ${percent}% fachero\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        
        // #lesbiana
        if (texto.startsWith('#lesbiana')) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target && isGroupChat) target = [sender];
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #lesbiana @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const percent = Math.floor(Math.random() * 101);
            await sock.sendMessage(remitente, { text: `╭━━〔 👩‍❤️‍💋‍👩 𝐋𝐄𝐒𝐁𝐈𝐀𝐍𝐀 〕━⬣\n┃ 👤 @${await getContactName(target[0])}\n┃ 📊 ${percent}% lesbiana\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        
        // #ruleta_rusa
        if (texto.startsWith('#ruleta_rusa') && isGroupChat) {
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #ruleta_rusa @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const oponente = targets[0];
            if (russianRouletteTimers[remitente]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 🔫 𝐑𝐔𝐋𝐄𝐓𝐀 〕━━━━⬣\n┃ ⚠️ Ya hay una partida activa\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const jugadores = [sender, oponente];
            const resultado = jugarRuleta(jugadores);
            const nombreGanador = await getContactName(resultado.ganador);
            const nombrePerdedor = await getContactName(resultado.victima);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🔫 𝐑𝐔𝐋𝐄𝐓𝐀 𝐑𝐔𝐒𝐀 〕━⬣\n┃ 💀 @${nombrePerdedor} ha muerto\n┃ 🏆 @${nombreGanador} sobrevive\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [resultado.victima, resultado.ganador] });
        }
        
        // #trivia
        if (texto === '#trivia') {
            if (!games[remitente]) games[remitente] = {};
            games[remitente].trivia = newTriviaGame();
            saveData(GAMES_FILE, games);
            const trivia = games[remitente].trivia;
            await sock.sendMessage(remitente, { text: `╭━━〔 ❓ 𝐓𝐑𝐈𝐕𝐈𝐀 〕━━━━⬣\n┃ 📝 ${trivia.question}\n┃ \n┃ a) ${trivia.options[0]}\n┃ b) ${trivia.options[1]}\n┃ c) ${trivia.options[2]}\n┃ d) ${trivia.options[3]}\n┃ \n┃ 📌 Responde con: #trivia_responder (a/b/c/d)\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #trivia_responder
        if (texto.startsWith('#trivia_responder')) {
            const answer = texto.replace('#trivia_responder', '').trim().toLowerCase();
            if (!games[remitente]?.trivia) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Inicia #trivia primero\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const trivia = games[remitente].trivia;
            if (answer === trivia.answer) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ✅ 𝐓𝐑𝐈𝐕𝐈𝐀 〕━━━━⬣\n┃ 🎉 ¡Correcto! ${trivia.options[['a','b','c','d'].indexOf(answer)]}\n┃ 📚 La respuesta era: ${trivia.options[['a','b','c','d'].indexOf(trivia.answer)]}\n╰━━━━━━━━━━━━━━━━⬣` });
            } else {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐓𝐑𝐈𝐕𝐈𝐀 〕━━━━⬣\n┃ 😭 Incorrecto!\n┃ 📚 La respuesta correcta era: ${trivia.options[['a','b','c','d'].indexOf(trivia.answer)]}\n╰━━━━━━━━━━━━━━━━⬣` });
            }
            delete games[remitente].trivia;
            saveData(GAMES_FILE, games);
        }
        
        // #ppt
        if (texto.startsWith('#ppt')) {
            const choices = ["piedra", "papel", "tijera"];
            const userChoice = texto.replace('#ppt', '').trim().toLowerCase();
            if (!choices.includes(userChoice)) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #ppt piedra/papel/tijera\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const botChoice = choices[Math.floor(Math.random() * choices.length)];
            let result;
            if (userChoice === botChoice) result = "EMPATE 😐";
            else if ((userChoice === "piedra" && botChoice === "tijera") ||
                     (userChoice === "papel" && botChoice === "piedra") ||
                     (userChoice === "tijera" && botChoice === "papel")) result = "GANASTE 🎉";
            else result = "PERDISTE 😭";
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🪨 𝐏𝐈𝐄𝐃𝐑𝐀 𝐏𝐀𝐏𝐄𝐋 𝐓𝐈𝐉𝐄𝐑𝐀 〕━⬣\n┃ 🎮 Tú: ${userChoice}\n┃ 🤖 Bot: ${botChoice}\n┃ 📊 Resultado: ${result}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #batalla
        if (texto.startsWith('#batalla') && isGroupChat) {
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #batalla @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const oponente = targets[0];
            const ganador = Math.random() < 0.5 ? sender : oponente;
            const perdedor = ganador === sender ? oponente : sender;
            const textoBatalla = battleTexts[Math.floor(Math.random() * battleTexts.length)];
            const batallaFinal = textoBatalla.replace(/{p1}/g, await getContactName(sender))
                                              .replace(/{p2}/g, await getContactName(oponente))
                                              .replace(/{winner}/g, await getContactName(ganador))
                                              .replace(/{loser}/g, await getContactName(perdedor));
            await sock.sendMessage(remitente, { text: `╭━━〔 ⚔️ 𝐁𝐀𝐓𝐀𝐋𝐋𝐀 〕━━━━⬣\n┃ ${batallaFinal}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [sender, oponente] });
        }
        
        // #ship
        if (texto.startsWith('#ship') && isGroupChat) {
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length < 2) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #ship @tag1 @tag2\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const user1 = targets[0];
            const user2 = targets[1];
            const porcentaje = Math.floor(Math.random() * 101);
            const bar = '❤️'.repeat(Math.floor(porcentaje / 10)) + '🖤'.repeat(10 - Math.floor(porcentaje / 10));
            await sock.sendMessage(remitente, { text: `╭━━〔 💕 𝐒𝐇𝐈𝐏 〕━━━━━━⬣\n┃ 💑 @${await getContactName(user1)} + @${await getContactName(user2)}\n┃ 📊 ${porcentaje}% de amor\n┃ ${bar}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [user1, user2] });
        }
        
        // #pareja
        if (texto === '#pareja' && isGroupChat) {
            const groupMetadata = await getGroupMetadataCached(remitente);
            const participants = groupMetadata.participants;
            const shuffled = [...participants].sort(() => 0.5 - Math.random());
            const pareja1 = shuffled[0];
            const pareja2 = shuffled[1];
            const porcentaje = Math.floor(Math.random() * 101);
            await sock.sendMessage(remitente, { text: `╭━━〔 💑 𝐏𝐀𝐑𝐄𝐉𝐀 〕━━━━⬣\n┃ 🎲 Pareja aleatoria:\n┃ 👤 @${await getContactName(pareja1.id)}\n┃ ❤️ + \n┃ 👤 @${await getContactName(pareja2.id)}\n┃ 📊 Compatibilidad: ${porcentaje}%\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [pareja1.id, pareja2.id] });
        }
        
        // #chiste
        if (texto === '#chiste') {
            const chiste = chistes[Math.floor(Math.random() * chistes.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 😂 𝐂𝐇𝐈𝐒𝐓𝐄 〕━━━━⬣\n┃ ${chiste}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #frase
        if (texto === '#frase') {
            const frase = frases[Math.floor(Math.random() * frases.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 💭 𝐅𝐑𝐀𝐒𝐄 〕━━━━━⬣\n┃ ✨ ${frase}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #piropo
        if (texto === '#piropo') {
            const piropo = piropos[Math.floor(Math.random() * piropos.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 🌹 𝐏𝐈𝐑𝐎𝐏𝐎 〕━━━━⬣\n┃ ${piropo}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #insulto
        if (texto.startsWith('#insulto') && isGroupChat) {
            let target = await getMentionedOrReplied(mensaje);
            if (!target || !target[0]) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #insulto @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const insulto = insultos[Math.floor(Math.random() * insultos.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 🤬 𝐈𝐍𝐒𝐔𝐋𝐓𝐎 〕━━━⬣\n┃ @${await getContactName(target[0])} ${insulto}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
        }
        
        // #dato
        if (texto === '#dato') {
            const dato = datosCuriosos[Math.floor(Math.random() * datosCuriosos.length)];
            await sock.sendMessage(remitente, { text: `╭━━〔 🔍 𝐃𝐀𝐓𝐎 𝐂𝐔𝐑𝐈𝐎𝐒𝐎 〕━⬣\n┃ ${dato}\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        // #wordle
        if (texto === '#wordle') {
            if (!games[remitente]) games[remitente] = {};
            games[remitente].wordle = newWordleGame();
            saveData(GAMES_FILE, games);
            await sock.sendMessage(remitente, { text: `╭━━〔 🟩 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣\n┃ 🎮 ¡Nueva partida!\n┃ 📝 Adivina la palabra de 5 letras\n┃ 🔢 Tienes 6 intentos\n┃ 📌 Usa: #wordle_palabra (palabra)\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #wordle_palabra
        if (texto.startsWith('#wordle_palabra')) {
            const guess = texto.replace('#wordle_palabra', '').trim().toUpperCase();
            if (!games[remitente]?.wordle || games[remitente].wordle.guessed) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Inicia #wordle primero\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const game = games[remitente].wordle;
            if (guess.length !== 5) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 La palabra debe tener 5 letras\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const result = checkWordleGuess(guess, game.word);
            game.attempts++;
            game.history.push(`#${game.attempts}: ${guess} → ${result}`);
            let historyText = game.history.join('\n');
            if (guess === game.word) {
                game.guessed = true;
                await sock.sendMessage(remitente, { text: `╭━━〔 🎉 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣\n┃ ✅ ¡Correcto! Era: ${game.word}\n┃ 🔢 Intentos: ${game.attempts}/6\n┃ 📜 Historial:\n${historyText}\n╰━━━━━━━━━━━━━━━━⬣` });
                delete games[remitente].wordle;
            } else if (game.attempts >= 6) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣\n┃ 😭 Perdiste! Era: ${game.word}\n┃ 📜 Historial:\n${historyText}\n╰━━━━━━━━━━━━━━━━⬣` });
                delete games[remitente].wordle;
            } else {
                await sock.sendMessage(remitente, { text: `╭━━〔 🟩 𝐖𝐎𝐑𝐃𝐋𝐄 〕━━━━━⬣\n┃ ${result}\n┃ 🔢 Intento ${game.attempts}/6\n┃ 📜 Historial:\n${historyText}\n╰━━━━━━━━━━━━━━━━⬣` });
            }
            saveData(GAMES_FILE, games);
        }
        
        // #ahorcado
        if (texto === '#ahorcado') {
            if (!games[remitente]) games[remitente] = {};
            games[remitente].hangman = newHangmanGame();
            saveData(GAMES_FILE, games);
            const display = getHangmanDisplay(games[remitente].hangman);
            await sock.sendMessage(remitente, { text: `╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[0]}\n┃ 📝 Palabra: ${display}\n┃ ❌ Fallos: 0/6\n┃ 📌 Usa: #ahorcado_letra (letra) o #ahorcado_palabra (palabra)\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #ahorcado_letra
        if (texto.startsWith('#ahorcado_letra')) {
            const letter = texto.replace('#ahorcado_letra', '').trim().toUpperCase();
            if (!games[remitente]?.hangman || games[remitente].hangman.guessed) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Inicia #ahorcado primero\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const game = games[remitente].hangman;
            if (letter.length !== 1 || !letter.match(/[A-Z]/)) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Ingresa una sola letra\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            if (game.guessedLetters.includes(letter)) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Ya usaste la letra "${letter}"\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            game.guessedLetters.push(letter);
            if (!game.word.includes(letter)) game.attempts++;
            const display = getHangmanDisplay(game);
            if (!display.includes('_')) {
                game.guessed = true;
                await sock.sendMessage(remitente, { text: `╭━━〔 🎉 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[game.attempts]}\n┃ ✅ ¡Ganaste! Era: ${game.word}\n╰━━━━━━━━━━━━━━━━⬣` });
                delete games[remitente].hangman;
            } else if (game.attempts >= 6) {
                await sock.sendMessage(remitente, { text: `╭━━〔 💀 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[6]}\n┃ 😭 Perdiste! Era: ${game.word}\n╰━━━━━━━━━━━━━━━━⬣` });
                delete games[remitente].hangman;
            } else {
                await sock.sendMessage(remitente, { text: `╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[game.attempts]}\n┃ 📝 Palabra: ${display}\n┃ ❌ Fallos: ${game.attempts}/6\n╰━━━━━━━━━━━━━━━━⬣` });
            }
            saveData(GAMES_FILE, games);
        }
        
        // #ahorcado_palabra
        if (texto.startsWith('#ahorcado_palabra')) {
            const guess = texto.replace('#ahorcado_palabra', '').trim().toUpperCase();
            if (!games[remitente]?.hangman || games[remitente].hangman.guessed) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Inicia #ahorcado primero\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const game = games[remitente].hangman;
            if (guess === game.word) {
                game.guessed = true;
                await sock.sendMessage(remitente, { text: `╭━━〔 🎉 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[game.attempts]}\n┃ ✅ ¡Ganaste! Era: ${game.word}\n╰━━━━━━━━━━━━━━━━⬣` });
                delete games[remitente].hangman;
            } else {
                game.attempts++;
                if (game.attempts >= 6) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 💀 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[6]}\n┃ 😭 Perdiste! Era: ${game.word}\n╰━━━━━━━━━━━━━━━━⬣` });
                    delete games[remitente].hangman;
                } else {
                    const display = getHangmanDisplay(game);
                    await sock.sendMessage(remitente, { text: `╭━━〔 🪢 𝐀𝐇𝐎𝐑𝐂𝐀𝐃𝐎 〕━━━⬣\n${hangmanStages[game.attempts]}\n┃ 📝 Palabra: ${display}\n┃ ❌ Fallos: ${game.attempts}/6\n┃ ❌ "${guess}" no es correcta\n╰━━━━━━━━━━━━━━━━⬣` });
                }
            }
            saveData(GAMES_FILE, games);
        }
        
        // #conecta4
        if (texto.startsWith('#conecta4') && isGroupChat) {
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #conecta4 @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            if (!games[remitente]) games[remitente] = {};
            games[remitente].connect4 = newConnect4Game();
            games[remitente].connect4.players = [sender, targets[0]];
            saveData(GAMES_FILE, games);
            const boardDisplay = printConnect4Board(games[remitente].connect4.board);
            await sock.sendMessage(remitente, { text: `╭━━〔 🟡 𝐂𝐎𝐍𝐄𝐂𝐓𝐀 𝟒 〕━━━⬣\n┃ 🎮 @${await getContactName(sender)} vs @${await getContactName(targets[0])}\n┃ 🔴 Turno: @${await getContactName(sender)}\n┃ 📌 Usa: #conecta4_col (1-7)\n${boardDisplay}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [sender, targets[0]] });
        }
        
        // #conecta4_col (para jugar)
        if (texto.startsWith('#conecta4_col')) {
            const col = parseInt(texto.replace('#conecta4_col', '').trim()) - 1;
            if (!games[remitente]?.connect4) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Inicia #conecta4 primero\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const game = games[remitente].connect4;
            const jugadorActual = game.turn === '🔴' ? game.players[0] : game.players[1];
            if (sender !== jugadorActual) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ ⏳ Espera tu turno\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            if (isNaN(col) || col < 0 || col > 6) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #conecta4_col (1-7)\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            if (!makeMove(game.board, col, game.turn)) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Columna llena!\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            game.turn = game.turn === '🔴' ? '🟡' : '🔴';
            const boardDisplay = printConnect4Board(game.board);
            await sock.sendMessage(remitente, { text: `╭━━〔 🟡 𝐂𝐎𝐍𝐄𝐂𝐓𝐀 𝟒 〕━━━⬣\n${boardDisplay}\n┃ 🔴 Turno: @${await getContactName(game.turn === '🔴' ? game.players[0] : game.players[1])}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [game.players[0], game.players[1]] });
            saveData(GAMES_FILE, games);
        }
        // ==================== COMANDOS DE DESCARGA ====================
        
        // #playaudio - Audio de YouTube
        if (texto.startsWith('#playaudio')) {
            const busqueda = texto.replace('#playaudio', '').trim();
            if (!busqueda) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #playaudio (nombre de cancion)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                const outputPath = './tmp/audio_' + Date.now() + '.mp3';
                let titulo = 'Audio';
                let canal = 'Desconocido';
                let vistas = 'N/A';
                let miniatura = '';
                try {
                    const { stdout } = await execPromise(yt + ' -j "ytsearch1:' + busqueda.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 15000 });
                    const info = JSON.parse(stdout);
                    titulo = info.title || 'Audio';
                    canal = info.uploader || info.channel || 'Desconocido';
                    vistas = info.view_count ? info.view_count.toLocaleString() : 'N/A';
                    miniatura = info.thumbnail || '';
                } catch(e) {}
                if (miniatura) {
                    await sock.sendMessage(remitente, { image: { url: miniatura }, caption: '╭━━〔 🎵 *PLAYAUDIO* 〕━━━⬣\n┃ 🎤 *' + titulo.substring(0, 50) + '*\n┃ 👤 ' + canal + '\n┃ 👁️ ' + vistas + '\n╰━━━━━━━━━━━━━━━━⬣' });
                }
                await execPromise(yt + ' -x --audio-format mp3 -o "' + outputPath + '" "ytsearch1:' + busqueda.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 60000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { audio: fs3.readFileSync(outputPath), mimetype: 'audio/mpeg', fileName: titulo + '.mp3' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error('No se descargo');
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo obtener el audio\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #tiktok - Video de TikTok
        if (texto.startsWith('#tiktok')) {
            const link = texto.replace('#tiktok', '').trim();
            if (!link || !link.includes('tiktok.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #tiktok (link)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/tiktok_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎵 *TIKTOK* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar TikTok\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #youtube - Video de YouTube
        if (texto.startsWith('#youtube')) {
            const link = texto.replace('#youtube', '').trim();
            if (!link || (!link.includes('youtube.com') && !link.includes('youtu.be'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #youtube (link)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/yt_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 60000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🎬 *YOUTUBE* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #instagram - Video de Instagram
        if (texto.startsWith('#instagram')) {
            const link = texto.replace('#instagram', '').trim();
            if (!link || !link.includes('instagram.com')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #instagram (link)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/ig_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 📷 *INSTAGRAM* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #facebook - Video de Facebook
        if (texto.startsWith('#facebook')) {
            const link = texto.replace('#facebook', '').trim();
            if (!link || (!link.includes('facebook.com') && !link.includes('fb.watch'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #facebook (link)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/fb_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 📘 *FACEBOOK* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }

        // #twitter - Video de Twitter/X
        if (texto.startsWith('#twitter')) {
            const link = texto.replace('#twitter', '').trim();
            if (!link || (!link.includes('twitter.com') && !link.includes('x.com'))) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #twitter (link)\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: '🕐', key: mensaje.key } });
            try {
                const { exec } = require('child_process');
                const util = require('util');
                const execPromise = util.promisify(exec);
                const fs3 = require('fs');
                if (!fs3.existsSync('./tmp')) fs3.mkdirSync('./tmp');
                const outputPath = './tmp/tw_' + Date.now() + '.mp4';
                const yt = '/data/data/com.termux/files/usr/bin/yt-dlp';
                await execPromise(yt + ' -f best -o "' + outputPath + '" "' + link.replace(/"/g, '\\"') + '" 2>/dev/null', { timeout: 30000 });
                if (fs3.existsSync(outputPath)) {
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: '╭━━〔 🐦 *TWITTER/X* 〕━━━⬣\n┃ ✅ Video descargado\n╰━━━━━━━━━━━━━━━━⬣' });
                    fs3.unlinkSync(outputPath);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                } else {
                    throw new Error();
                }
            } catch (error) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ No se pudo descargar\n╰━━━━━━━━━━━━━━━━⬣' });
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
            }
        }
        // ==================== COMANDOS DE ECONOMÍA ====================
        
        // #minar
        if (texto === '#minar') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'minar');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
                await sock.sendMessage(remitente, { text: `╭━━〔 ⛏️ 𝐌𝐈𝐍𝐀𝐑 〕━━━━⬣\n┃ ⏰ Espera ${minutos}m ${segundos}s\n┃ 🕐 Cooldown: 10 minutos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const item = selectItemByRarity(minerales);
            addInventoryItem(sender, item);
            updateCooldown(sender, 'minar');
            
            await sock.sendMessage(remitente, { text: `╭━━〔 ⛏️ 𝐌𝐈𝐍𝐀𝐑 〕━━━━⬣\n┃ ✨ ¡Has minado ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #cazar
        if (texto === '#cazar') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'cazar');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🏹 𝐂𝐀𝐙𝐀𝐑 〕━━━━⬣\n┃ ⏰ Espera ${minutos}m ${segundos}s\n┃ 🕐 Cooldown: 10 minutos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const item = selectItemByRarity(animales);
            addInventoryItem(sender, item);
            updateCooldown(sender, 'cazar');
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🏹 𝐂𝐀𝐙𝐀𝐑 〕━━━━⬣\n┃ ✨ ¡Has cazado ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #pescar
        if (texto === '#pescar') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'pescar');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🎣 𝐏𝐄𝐒𝐂𝐀𝐑 〕━━━━⬣\n┃ ⏰ Espera ${minutos}m ${segundos}s\n┃ 🕐 Cooldown: 10 minutos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const item = selectItemByRarity(peces);
            addInventoryItem(sender, item);
            updateCooldown(sender, 'pescar');
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🎣 𝐏𝐄𝐒𝐂𝐀𝐑 〕━━━━⬣\n┃ ✨ ¡Has pescado ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #talar
        if (texto === '#talar') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'talar');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🪓 𝐓𝐀𝐋𝐀𝐑 〕━━━━⬣\n┃ ⏰ Espera ${minutos}m ${segundos}s\n┃ 🕐 Cooldown: 10 minutos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const item = selectItemByRarity(arboles);
            addInventoryItem(sender, item);
            updateCooldown(sender, 'talar');
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🪓 𝐓𝐀𝐋𝐀𝐑 〕━━━━⬣\n┃ ✨ ¡Has talado ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #aventura
        if (texto === '#aventura') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'aventura');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                const segundos = Math.floor((cooldown.remaining % 60000) / 1000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🗺️ 𝐀𝐕𝐄𝐍𝐓𝐔𝐑𝐀 〕━━━⬣\n┃ ⏰ Espera ${minutos}m ${segundos}s\n┃ 🕐 Cooldown: 10 minutos\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            updateCooldown(sender, 'aventura');
            const opcion = Math.random();
            
            if (opcion < 0.4) {
                const monedas = Math.floor(Math.random() * 200) + 50;
                user.wallet += monedas;
                saveEconomyUser(sender, user);
                await sock.sendMessage(remitente, { text: `╭━━〔 🗺️ 𝐀𝐕𝐄𝐍𝐓𝐔𝐑𝐀 〕━━━⬣\n┃ 🪙 ¡Encontraste ${monedas} shoCoins!\n┃ ✨ Una recompensa modesta\n╰━━━━━━━━━━━━━━━━⬣` });
            } else if (opcion < 0.7) {
                const item = selectItemByRarity(aventuraItems);
                addInventoryItem(sender, item);
                await sock.sendMessage(remitente, { text: `╭━━〔 🗺️ 𝐀𝐕𝐄𝐍𝐓𝐔𝐑𝐀 〕━━━⬣\n┃ ✨ ¡Encontraste ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
            } else {
                await sock.sendMessage(remitente, { text: `╭━━〔 🗺️ 𝐀𝐕𝐄𝐍𝐓𝐔𝐑𝐀 〕━━━⬣\n┃ 😔 No encontraste nada...\n┃ 🔍 Sigue explorando!\n╰━━━━━━━━━━━━━━━━⬣` });
            }
        }
        
        // #vender
        if (texto.startsWith('#vender')) {
            const args = texto.replace('#vender', '').trim().split(' ');
            if (args.length < 2) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #vender (item) (cantidad)\n┃ 📌 #vender_all\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            if (args[0] === 'all') {
                const user = getEconomyUser(sender);
                if (user.inventory.length === 0) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐕𝐄𝐍𝐃𝐄𝐑 〕━━━━⬣\n┃ 📦 No tienes nada en tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
                let totalGanancia = 0;
                let itemsVendidos = [];
                for (const item of user.inventory) {
                    totalGanancia += item.valor * item.cantidad;
                    itemsVendidos.push(`${item.cantidad}x ${item.nombre} (${item.valor * item.cantidad} shoCoins)`);
                }
                user.wallet += totalGanancia;
                user.inventory = [];
                saveEconomyUser(sender, user);
                await sock.sendMessage(remitente, { text: `╭━━〔 💰 𝐕𝐄𝐍𝐓𝐀 𝐓𝐎𝐓𝐀𝐋 〕━⬣\n┃ 📦 Items:\n┃ ${itemsVendidos.join('\n┃ ')}\n┃ ✨ Ganancia total: ${totalGanancia} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
            } else {
                const nombreItem = args.slice(0, -1).join(' ');
                const cantidad = parseInt(args[args.length - 1]);
                if (isNaN(cantidad) || cantidad < 1) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #vender (item) (cantidad)\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
                const resultado = sellInventoryItem(sender, nombreItem, cantidad);
                if (resultado.success) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 💰 𝐕𝐄𝐍𝐓𝐀 〕━━━━━⬣\n┃ ✅ Vendiste ${resultado.cantidad}x ${resultado.nombre}\n┃ ✨ Ganaste: ${resultado.ganancia} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
                } else {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ ${resultado.reason}\n╰━━━━━━━━━━━━━━━━⬣` });
                }
            }
        }
        
        // #inventario
        if (texto === '#inventario') {
            const user = getEconomyUser(sender);
            if (user.inventory.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 📦 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 〕━⬣\n┃ 📭 Tu inventario está vacío\n┃ 📌 Usa #minar, #cazar, #pescar, #talar\n┃ 📌 Para vender usa: #vender (item) (cantidad)\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            let inventoryText = `╭━━〔 📦 𝐈𝐍𝐕𝐄𝐍𝐓𝐀𝐑𝐈𝐎 〕━⬣\n`;
            for (const item of user.inventory) {
                inventoryText += `┃ • ${item.nombre}: ${item.cantidad} (${item.valor} c/u)\n`;
            }
            inventoryText += `┃ \n┃ 📌 Vender: #vender (item) (cantidad)\n┃ 📌 Vender todo: #vender_all\n╰━━━━━━━━━━━━━━━━⬣`;
            await sock.sendMessage(remitente, { text: inventoryText });
        }
        
        // #daily
        if (texto === '#daily') {
            const user = getEconomyUser(sender);
            const now = Date.now();
            const lastDaily = user.lastDaily || 0;
            const remaining = 86400000 - (now - lastDaily);
            
            if (remaining > 0) {
                const horas = Math.floor(remaining / 3600000);
                const minutos = Math.floor((remaining % 3600000) / 60000);
                await sock.sendMessage(remitente, { text: `╭━━〔 📅 𝐃𝐀𝐈𝐋𝐘 〕━━━━⬣\n┃ ⏰ Próxima recompensa en:\n┃ ${horas}h ${minutos}m\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const recompensa = Math.floor(Math.random() * 500) + 100;
            user.wallet += recompensa;
            user.lastDaily = now;
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 📅 𝐃𝐀𝐈𝐋𝐘 〕━━━━⬣\n┃ ✨ ¡Recompensa diaria!\n┃ 💰 Obtuviste: ${recompensa} shoCoins\n┃ 📅 Vuelve mañana por más\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        // #trabajar
        if (texto === '#trabajar') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'trabajar');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                await sock.sendMessage(remitente, { text: `╭━━〔 💼 𝐓𝐑𝐀𝐁𝐀𝐉𝐀𝐑 〕━━━⬣\n┃ ⏰ Espera ${minutos} minutos\n┃ 🕐 Cooldown: 1 hora\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const salario = Math.floor(Math.random() * 200) + 50;
            user.wallet += salario;
            updateCooldown(sender, 'trabajar');
            saveEconomyUser(sender, user);
            
            const trabajos = ["💻 Programador", "👨‍🍳 Cocinero", "📦 Repartidor", "🧹 Limpieza", "📝 Profesor", "🚗 Uber", "📞 Telemarketing", "📊 Data entry"];
            const trabajo = trabajos[Math.floor(Math.random() * trabajos.length)];
            
            await sock.sendMessage(remitente, { text: `╭━━〔 💼 𝐓𝐑𝐀𝐁𝐀𝐉𝐀𝐑 〕━━━⬣\n┃ 🏢 Trabajaste como: ${trabajo}\n┃ 💰 Ganaste: ${salario} shoCoins\n┃ ✨ Vuelve en 1 hora\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #cofre
        if (texto === '#cofre') {
            const user = getEconomyUser(sender);
            const now = Date.now();
            const lastChest = user.lastChest || 0;
            const remaining = 21600000 - (now - lastChest);
            
            if (remaining > 0) {
                const horas = Math.floor(remaining / 3600000);
                const minutos = Math.floor((remaining % 3600000) / 60000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🎁 𝐂𝐎𝐅𝐑𝐄 〕━━━━⬣\n┃ ⏰ Próximo cofre en:\n┃ ${horas}h ${minutos}m\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            user.lastChest = now;
            
            const opcion = Math.random();
            if (opcion < 0.6) {
                const monedas = Math.floor(Math.random() * 500) + 100;
                user.wallet += monedas;
                saveEconomyUser(sender, user);
                await sock.sendMessage(remitente, { text: `╭━━〔 🎁 𝐂𝐎𝐅𝐑𝐄 〕━━━━⬣\n┃ 🪙 ¡Abriste el cofre!\n┃ 💰 Encontraste: ${monedas} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
            } else {
                const item = selectItemByRarity(cofreItems);
                addInventoryItem(sender, item);
                await sock.sendMessage(remitente, { text: `╭━━〔 🎁 𝐂𝐎𝐅𝐑𝐄 〕━━━━⬣\n┃ ✨ ¡Abriste el cofre!\n┃ 🏆 Encontraste: ${item.nombre}\n┃ 💰 Valor: ${item.valor} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
            }
        }
        
        // #robar
        if (texto.startsWith('#robar') && isGroupChat) {
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #robar @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const victima = targets[0];
            if (victima === sender) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 🚫 No puedes robarte a ti mismo\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const ladron = getEconomyUser(sender);
            const victimaData = getEconomyUser(victima);
            
            if (victimaData.bank > 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 🚫 𝐑𝐎𝐁𝐎 〕━━━━━⬣\n┃ 🏦 @${await getContactName(victima)} tiene su dinero en el banco\n┃ 🔒 No puedes robarle\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [victima] });
                return;
            }
            
            const roboMax = Math.floor(victimaData.wallet * 0.1);
            if (roboMax <= 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 🚫 𝐑𝐎𝐁𝐎 〕━━━━━⬣\n┃ 💰 @${await getContactName(victima)} no tiene dinero para robar\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [victima] });
                return;
            }
            
            const robo = Math.floor(Math.random() * roboMax) + 1;
            const exito = Math.random() < 0.6;
            
            if (exito) {
                ladron.wallet += robo;
                victimaData.wallet -= robo;
                saveEconomyUser(sender, ladron);
                saveEconomyUser(victima, victimaData);
                await sock.sendMessage(remitente, { text: `╭━━〔 🦝 𝐑𝐎𝐁𝐎 𝐄𝐗𝐈𝐓𝐎𝐒𝐎 〕━⬣\n┃ ✅ Le robaste ${robo} shoCoins a @${await getContactName(victima)}\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [victima] });
            } else {
                const castigo = Math.floor(robo / 2);
                ladron.wallet -= castigo;
                saveEconomyUser(sender, ladron);
                await sock.sendMessage(remitente, { text: `╭━━〔 🚨 𝐑𝐎𝐁𝐎 𝐅𝐀𝐋𝐋𝐈𝐃𝐎 〕━⬣\n┃ ❌ Te atraparon! Perdiste ${castigo} shoCoins\n┃ 👮 @${await getContactName(victima)} te vio\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [victima] });
            }
        }
        
        // #transferir
        if (texto.startsWith('#transferir')) {
            const parts = texto.split(' ');
            if (parts.length < 3) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #transferir (cantidad) @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const cantidad = parseInt(parts[1]);
            if (isNaN(cantidad) || cantidad <= 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Ingresa una cantidad válida\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const targets = await getMentionedOrReplied(mensaje);
            if (!targets || targets.length === 0) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #transferir (cantidad) @tag\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            const destinatario = targets[0];
            
            const remitenteData = getEconomyUser(sender);
            const destinatarioData = getEconomyUser(destinatario);
            
            const comision = Math.floor(cantidad * 0.05);
            const total = cantidad + comision;
            
            if (remitenteData.bank < total) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 💰 No tienes suficiente dinero en el banco\n┃ 📊 Necesitas: ${total} (${cantidad} + ${comision} comisión)\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            remitenteData.bank -= total;
            destinatarioData.bank += cantidad;
            saveEconomyUser(sender, remitenteData);
            saveEconomyUser(destinatario, destinatarioData);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 💸 𝐓𝐑𝐀𝐍𝐒𝐅𝐄𝐑𝐄𝐍𝐂𝐈𝐀 〕━⬣\n┃ ✅ Transferiste ${cantidad} shoCoins a @${await getContactName(destinatario)}\n┃ 💸 Comisión (5%): ${comision} shoCoins\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [destinatario] });
        }
        
        // #banco
        if (texto === '#banco') {
            const user = getEconomyUser(sender);
            await sock.sendMessage(remitente, { text: `╭━━〔 🏦 𝐁𝐀𝐍𝐂𝐎 〕━━━━━⬣\n┃ 👤 Usuario: @${await getContactName(sender)}\n┃ 💰 Cartera: ${user.wallet} shoCoins\n┃ 🏦 Banco: ${user.bank} shoCoins\n┃ 📊 Total: ${user.wallet + user.bank} shoCoins\n┃ \n┃ 📌 Depositar: #depositar (cantidad/all)\n┃ 📌 Retirar: #retirar (cantidad/all)\n╰━━━━━━━━━━━━━━━━⬣`, mentions: [sender] });
        }
        
        // #depositar
        if (texto.startsWith('#depositar')) {
            const args = texto.replace('#depositar', '').trim();
            const user = getEconomyUser(sender);
            
            let cantidad;
            if (args === 'all') {
                cantidad = user.wallet;
            } else {
                cantidad = parseInt(args);
                if (isNaN(cantidad) || cantidad <= 0) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #depositar (cantidad/all)\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
            }
            
            if (user.wallet < cantidad) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 💰 No tienes suficiente dinero en cartera\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            user.wallet -= cantidad;
            user.bank += cantidad;
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🏦 𝐃𝐄𝐏𝐎𝐒𝐈𝐓𝐎 〕━━━⬣\n┃ ✅ Depositaste ${cantidad} shoCoins\n┃ 🏦 Banco: ${user.bank} shoCoins\n┃ 💰 Cartera: ${user.wallet} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #retirar
        if (texto.startsWith('#retirar')) {
            const args = texto.replace('#retirar', '').trim();
            const user = getEconomyUser(sender);
            
            let cantidad;
            if (args === 'all') {
                cantidad = user.bank;
            } else {
                cantidad = parseInt(args);
                if (isNaN(cantidad) || cantidad <= 0) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 #retirar (cantidad/all)\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
            }
            
            if (user.bank < cantidad) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 🏦 No tienes suficiente dinero en el banco\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            user.bank -= cantidad;
            user.wallet += cantidad;
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🏦 𝐑𝐄𝐓𝐈𝐑𝐎 〕━━━━⬣\n┃ ✅ Retiraste ${cantidad} shoCoins\n┃ 🏦 Banco: ${user.bank} shoCoins\n┃ 💰 Cartera: ${user.wallet} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        // #rank
        if (texto === '#rank' && isGroupChat) {
            const groupMetadata = await getGroupMetadataCached(remitente);
            const participants = groupMetadata.participants;
            const rankings = [];
            
            for (const p of participants) {
                const userData = economy[p.id] || { wallet: 0, bank: 0 };
                const total = userData.wallet + userData.bank;
                rankings.push({ id: p.id, total });
            }
            
            rankings.sort((a, b) => b.total - a.total);
            const top10 = rankings.slice(0, 10);
            let rankText = `╭━━〔 🏆 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎 〕━⬣\n`;
            for (let i = 0; i < top10.length; i++) {
                rankText += `┃ ${i+1}. @${top10[i].id.split('@')[0]} - ${top10[i].total} shoCoins\n`;
            }
            rankText += `╰━━━━━━━━━━━━━━━━⬣`;
            await sock.sendMessage(remitente, { text: rankText, mentions: top10.map(r => r.id) });
        }
        
        // #globalrank
        if (texto === '#globalrank') {
            const rankings = [];
            for (const [id, data] of Object.entries(economy)) {
                const total = (data.wallet || 0) + (data.bank || 0);
                rankings.push({ id, total });
            }
            rankings.sort((a, b) => b.total - a.total);
            const top10 = rankings.slice(0, 10);
            let rankText = `╭━━〔 🌍 𝐑𝐀𝐍𝐊𝐈𝐍𝐆 𝐆𝐋𝐎𝐁𝐀𝐋 〕━⬣\n`;
            for (let i = 0; i < top10.length; i++) {
                rankText += `┃ ${i+1}. @${top10[i].id.split('@')[0]} - ${top10[i].total} shoCoins\n`;
            }
            rankText += `╰━━━━━━━━━━━━━━━━⬣`;
            await sock.sendMessage(remitente, { text: rankText, mentions: top10.map(r => r.id) });
        }
        
        // #tienda
        if (texto === '#tienda') {
            let tiendaText = `╭━━〔 🛒 𝐓𝐈𝐄𝐍𝐃𝐀 〕━━━━⬣\n`;
            for (const item of tiendaItems) {
                tiendaText += `┃ • ${item.nombre}: ${item.precio} shoCoins\n┃   ${item.efecto} (${item.duracion} días)\n┃ \n`;
            }
            tiendaText += `┃ 📌 Comprar: #comprar (nombre del item)\n╰━━━━━━━━━━━━━━━━⬣`;
            await sock.sendMessage(remitente, { text: tiendaText });
        }
        
        // #comprar
        if (texto.startsWith('#comprar')) {
            const nombreItem = texto.replace('#comprar', '').trim();
            const itemTienda = tiendaItems.find(i => normalizeString(i.nombre) === normalizeString(nombreItem));
            
            if (!itemTienda) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Item no encontrado en la tienda\n┃ 📌 Usa #tienda para ver los items\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const user = getEconomyUser(sender);
            if (user.wallet < itemTienda.precio) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 💰 No tienes suficientes shoCoins\n┃ 📊 Necesitas: ${itemTienda.precio} shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            user.wallet -= itemTienda.precio;
            user.tools.push({ nombre: itemTienda.nombre, comprado: Date.now(), duracion: itemTienda.duracion * 86400000 });
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🛒 𝐂𝐎𝐌𝐏𝐑𝐀 〕━━━━⬣\n┃ ✅ Compraste ${itemTienda.nombre}\n┃ 💰 Costo: ${itemTienda.precio} shoCoins\n┃ ✨ Efecto: ${itemTienda.efecto}\n┃ ⏰ Duración: ${itemTienda.duracion} días\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #weekly
        if (texto === '#weekly') {
            const user = getEconomyUser(sender);
            const now = Date.now();
            const lastWeekly = user.lastWeekly || 0;
            const remaining = 604800000 - (now - lastWeekly);
            
            if (remaining > 0) {
                const dias = Math.floor(remaining / 86400000);
                const horas = Math.floor((remaining % 86400000) / 3600000);
                await sock.sendMessage(remitente, { text: `╭━━〔 📆 𝐖𝐄𝐄𝐊𝐋𝐘 〕━━━━⬣\n┃ ⏰ Próxima recompensa en:\n┃ ${dias}d ${horas}h\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const recompensa = Math.floor(Math.random() * 2000) + 500;
            user.wallet += recompensa;
            user.lastWeekly = now;
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 📆 𝐖𝐄𝐄𝐊𝐋𝐘 〕━━━━⬣\n┃ ✨ ¡Recompensa semanal!\n┃ 💰 Obtuviste: ${recompensa} shoCoins\n┃ 📅 Vuelve la próxima semana\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #monthly
        if (texto === '#monthly') {
            const user = getEconomyUser(sender);
            const now = Date.now();
            const lastMonthly = user.lastMonthly || 0;
            const remaining = 2592000000 - (now - lastMonthly);
            
            if (remaining > 0) {
                const dias = Math.floor(remaining / 86400000);
                await sock.sendMessage(remitente, { text: `╭━━〔 📅 𝐌𝐎𝐍𝐓𝐇𝐋𝐘 〕━━━━⬣\n┃ ⏰ Próxima recompensa en:\n┃ ${dias} días\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const recompensa = Math.floor(Math.random() * 5000) + 1000;
            user.wallet += recompensa;
            user.lastMonthly = now;
            saveEconomyUser(sender, user);
            
            await sock.sendMessage(remitente, { text: `╭━━〔 📅 𝐌𝐎𝐍𝐓𝐇𝐋𝐘 〕━━━━⬣\n┃ ✨ ¡Recompensa mensual!\n┃ 💰 Obtuviste: ${recompensa} shoCoins\n┃ 📅 Vuelve el próximo mes\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #code
        if (texto.startsWith('#code')) {
            const codigo = texto.replace('#code', '').trim().toUpperCase();
            const user = getEconomyUser(sender);
            
            if (codigo === 'SHOTOBOT') {
                if (user.usedCode) {
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐂𝐎𝐃𝐈𝐆𝐎 〕━━━━⬣\n┃ 🚫 Ya canjeaste este código\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
                user.wallet += 1000;
                user.usedCode = true;
                saveEconomyUser(sender, user);
                await sock.sendMessage(remitente, { text: `╭━━〔 🎫 𝐂𝐎𝐃𝐈𝐆𝐎 𝐂𝐀𝐍𝐉𝐄𝐀𝐃𝐎 〕━⬣\n┃ ✅ ¡Código válido!\n┃ 💰 Recibiste 1000 shoCoins\n╰━━━━━━━━━━━━━━━━⬣` });
            } else {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐂𝐎𝐃𝐈𝐆𝐎 〕━━━━⬣\n┃ ❌ Código inválido\n╰━━━━━━━━━━━━━━━━⬣` });
            }
        }
        
        // #granja
        if (texto === '#granja') {
            const user = getEconomyUser(sender);
            const cooldown = getCooldown(sender, 'granja');
            
            if (!cooldown.canUse) {
                const minutos = Math.ceil(cooldown.remaining / 60000);
                await sock.sendMessage(remitente, { text: `╭━━〔 🌾 𝐆𝐑𝐀𝐍𝐉𝐀 〕━━━━⬣\n┃ ⏰ Espera ${minutos} minutos\n┃ 🕐 Cooldown: 1 hora\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            const item = selectItemByRarity(granjaItems);
            addInventoryItem(sender, item);
            updateCooldown(sender, 'granja');
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🌾 𝐆𝐑𝐀𝐍𝐉𝐀 〕━━━━⬣\n┃ ✨ ¡Cosechaste ${item.nombre}!\n┃ 💰 Valor: ${item.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        
        // #hornear
        if (texto.startsWith('#hornear')) {
            const nombreReceta = texto.replace('#hornear', '').trim();
            const receta = recetas.find(r => normalizeString(r.nombre) === normalizeString(nombreReceta));
            
            if (!receta) {
                let recetasText = `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Recetas disponibles:\n`;
                for (const r of recetas) {
                    recetasText += `┃ • ${r.nombre}: ${r.ingredientes.join(' + ')}\n`;
                }
                recetasText += `╰━━━━━━━━━━━━━━━━⬣`;
                await sock.sendMessage(remitente, { text: recetasText });
                return;
            }
            
            const user = getEconomyUser(sender);
            let tieneIngredientes = true;
            
            for (const ingrediente of receta.ingredientes) {
                const item = getInventoryItem(user.inventory, ingrediente);
                if (!item || item.cantidad < 1) {
                    tieneIngredientes = false;
                    break;
                }
            }
            
            if (!tieneIngredientes) {
                await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐇𝐎𝐑𝐍𝐄𝐀𝐑 〕━━━━⬣\n┃ 🚫 No tienes los ingredientes necesarios\n┃ 📌 Necesitas: ${receta.ingredientes.join(', ')}\n╰━━━━━━━━━━━━━━━━⬣` });
                return;
            }
            
            for (const ingrediente of receta.ingredientes) {
                removeInventoryItem(sender, ingrediente, 1);
            }
            addInventoryItem(sender, { nombre: receta.nombre, valor: receta.valor });
            
            await sock.sendMessage(remitente, { text: `╭━━〔 🧁 𝐇𝐎𝐑𝐍𝐄𝐀𝐑 〕━━━━⬣\n┃ ✨ ¡Horneaste ${receta.nombre}!\n┃ 💰 Valor: ${receta.valor} shoCoins\n┃ 📦 Se ha añadido a tu inventario\n╰━━━━━━━━━━━━━━━━⬣` });
        }
        // ==================== MENÚ ====================
        
        

        // #bienvenida on/off
        if (texto.startsWith('#bienvenida')) {
            const args = texto.split(' ');
            if (args.length < 2 || (args[1] !== 'on' && args[1] !== 'off')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #bienvenida on/off\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Solo administradores\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            if (!welcomeSettings[remitente]) welcomeSettings[remitente] = {};
            welcomeSettings[remitente].enabled = args[1] === 'on';
            if (!welcomeSettings[remitente].message) welcomeSettings[remitente].message = defaultWelcomeMsg;
            saveWelcomeConfig();
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\n┃ ✅ Bienvenidas ' + (args[1] === 'on' ? 'activadas' : 'desactivadas') + '\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #despedida on/off
        if (texto.startsWith('#despedida')) {
            const args = texto.split(' ');
            if (args.length < 2 || (args[1] !== 'on' && args[1] !== 'off')) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #despedida on/off\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Solo administradores\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            if (!goodbyeSettings[remitente]) goodbyeSettings[remitente] = {};
            goodbyeSettings[remitente].enabled = args[1] === 'on';
            if (!goodbyeSettings[remitente].message) goodbyeSettings[remitente].message = defaultGoodbyeMsg;
            saveGoodbyeConfig();
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\n┃ ✅ Despedidas ' + (args[1] === 'on' ? 'activadas' : 'desactivadas') + '\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #setbienvenida
        if (texto.startsWith('#setbienvenida')) {
            const nuevoMensaje = texto.replace('#setbienvenida', '').trim();
            if (!nuevoMensaje) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #setbienvenida (tu mensaje)\n┃ 📌 Usa @user para etiquetar\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Solo administradores\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            if (!welcomeSettings[remitente]) welcomeSettings[remitente] = {};
            welcomeSettings[remitente].message = nuevoMensaje;
            saveWelcomeConfig();
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 🎉 𝐁𝐈𝐄𝐍𝐕𝐄𝐍𝐈𝐃𝐀 〕━━⬣\n┃ ✅ Mensaje de bienvenida actualizado\n╰━━━━━━━━━━━━━━━━⬣' });
        }

        // #setdespedida
        if (texto.startsWith('#setdespedida')) {
            const nuevoMensaje = texto.replace('#setdespedida', '').trim();
            if (!nuevoMensaje) {
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #setdespedida (tu mensaje)\n┃ 📌 Usa @user para etiquetar\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            const userIsAdmin = isGroupChat ? await isAdmin(remitente, sender) : true;
            if (!userIsAdmin && !mensaje.key.fromMe) {
                await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                await sock.sendMessage(remitente, { text: '╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Solo administradores\n╰━━━━━━━━━━━━━━━━⬣' });
                return;
            }
            if (!goodbyeSettings[remitente]) goodbyeSettings[remitente] = {};
            goodbyeSettings[remitente].message = nuevoMensaje;
            saveGoodbyeConfig();
            await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
            await sock.sendMessage(remitente, { text: '╭━━〔 👋 𝐃𝐄𝐒𝐏𝐄𝐃𝐈𝐃𝐀 〕━━⬣\n┃ ✅ Mensaje de despedida actualizado\n╰━━━━━━━━━━━━━━━━⬣' });
        }



        // #addbot - Unirse a grupos
        if (texto.startsWith("#addbot")) {
            const link = texto.replace("#addbot", "").trim();
            if (!link || !link.includes("chat.whatsapp.com")) {
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ 📌 #addbot (link de invitación)\n╰━━━━━━━━━━━━━━━━⬣" });
                return;
            }
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });
            try {
                let code = link.split("chat.whatsapp.com/")[1];
                code = code.split("?")[0];
                code = code.split("/")[0];
                if (!code || code.length < 5) throw new Error();
                const groupInfo = await sock.groupGetInviteInfo(code);
                const memberCount = groupInfo.size || groupInfo.participants?.length || 0;
                if (memberCount < 15) {
                    await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ADDBOT 〕━━━⬣\n┃ 📌 Grupo con " + memberCount + " miembros\n┃ ⚠️ Mínimo 15 miembros\n╰━━━━━━━━━━━━━━━━⬣" });
                    await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });
                    return;
                }
                await sock.sendMessage(remitente, { text: "╭━━〔 🔗 ADDBOT 〕━━━⬣\n┃ ✅ Grupo: " + (groupInfo.subject || "Sin nombre") + "\n┃ 👥 Miembros: " + memberCount + "\n┃ ⏳ Me uniré en 1 minuto...\n╰━━━━━━━━━━━━━━━━⬣" });
                await new Promise(resolve => setTimeout(resolve, 60000));
                await sock.groupAcceptInvite(code);
                await sock.sendMessage(remitente, { text: "╭━━〔 ✅ ADDBOT 〕━━━⬣\n┃ 🎉 Me uní al grupo\n┃ 👑 Dame admin\n╰━━━━━━━━━━━━━━━━⬣", mentions: [sender] });
                await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });
            } catch (error) {
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\n┃ ⚠️ Link inválido o expirado\n╰━━━━━━━━━━━━━━━━⬣" });
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });
            }
        }


        // #menu
        if (texto === '#menu') {
            const nombreUsuario = await getContactName(sender);
            const userEconomy = getEconomyUser(sender);
            const totalCoins = userEconomy.wallet + userEconomy.bank;
            
            const menu = `╭━━〔 🤍 𝐒𝐇𝐎𝐓𝐎𝐁𝐎𝐓 ♥ 〕━━⊷
┃ 👤 Usuario: @${nombreUsuario}
┃ 🤖 Versión: Beta 2.0
┃ 🧠 Comandos: 82
┃ 🏆 Nivel: proximamente
┃ ✨ XP: proximamente
┃ 💰 ShoCoins: ${totalCoins}
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 ℹ️ INFORMACIÓN 〕━━━
┃ ℹ️ #ping
┃ \`Velocidad del bot\`
┃ ℹ️ #menu
┃ \`Muestra este menu\`
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 👑 ADMINISTRACIÓN 〕━━⊷
┃ 👑 #promote @tag
┃ \`Da admin al usuario\`
┃ 👑 #demote @tag
┃ \`Quita admin al usuario\`
┃ 👑 #cerrar
┃ \`Cierra el grupo\`
┃ 👑 #abrir
┃ \`Abre el grupo\`
┃ 👑 #kick @tag
┃ \`Expulsa al usuario\`
┃ 👑 #mute @tag
┃ \`Mutea al usuario (24h)\`
┃ 👑 #unmute @tag
┃ \`Desmutea al usuario\`
┃ 👑 #warn @tag
┃ \`Da advertencia (3 = expulsión)\`
┃ 👑 #unwarn @tag
┃ \`Quita una advertencia\`
┃ 👑 #warnlist
┃ \`Lista de advertencias\`
┃ 👑 #hide
┃ \`Elimina mensaje respondido\`
┃ 👑 #modoadmins on/off
┃ \`Modo solo admins\`
┃ 👑 #banbot @tag
┃ \`Banea usuario del bot\`
┃ 👑 #unbanbot @tag
┃ \`Desbanea usuario del bot\`
┃ 👑 #tagall
┃ \`Etiqueta a todos\`
┃ 👑 #listadmins
┃ \`Lista de admins\`
┃ 👑 #listmiembros
┃ \`Lista de miembros\`
┃ 👑 #listmensajes
┃ \`Contador de mensajes\`
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 🛡️ PROTECCIÓN 〕━━⊷
┃ 🛡 #antispam on/off
┃ \`5 msg en 10s = warn\`
┃ 🛡 #antilinks on/off
┃ \`Warn por links\`
┃ 🛡 #antistickers on/off
┃ \`Warn por stickers\`
┃ 🛡 #antiimg on/off
┃ \`Warn por imágenes\`
┃ 🛡 #antivideos on/off
┃ \`Warn por videos\`
┃ 🛡 #antiaudios on/off
┃ \`Warn por audios\`
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 🎮 JUEGOS Y DIVERSIÓN 〕━━⊷
┃ 🎮 #8ball (pregunta)
┃ \`La bola mágica\`
┃ 🎮 #dado
┃ \`Lanza un dado\`
┃ 🎮 #moneda
┃ \`Cara o cruz\`
┃ 🎮 #random (min) (max)
┃ \`Número aleatorio\`
┃ 🎮 #verdadoreto
┃ \`Verdad o reto\`
┃ 🎮 #top (tema)
┃ \`Top 10 aleatorio\`
┃ 🎮 #gay @tag
┃ \`% de qué tan gay eres\`
┃ 🎮 #iq @tag
┃ \`% de tu IQ\`
┃ 🎮 #femboy @tag
┃ \`% de que tan femboy eres\`
┃ 🎮 #fachero @tag
┃ \`Facherómetro\`
┃ 🎮 #lesbiana @tag
┃ \`% de que tan lesbiana eres\`
┃ 🎮 #wordle
┃ \`Adivina la palabra\`
┃ 🎮 #ahorcado
┃ \`Juego del ahorcado\`
┃ 🎮 #ruleta_rusa @tag
┃ \`Ruleta rusa\`
┃ 🎮 #trivia
┃ \`Preguntas de trivia\`
┃ 🎮 #ppt piedra/papel/tijera
┃ \`Juega contra el bot\`
┃ 🎮 #batalla @tag
┃ \`Pelea contra alguien\`
┃ 🎮 #ship @tag1 @tag2
┃ \`Porcentaje de amor\`
┃ 🎮 #pareja
┃ \`Pareja aleatoria\`
┃ 🎮 #chiste
┃ \`Chiste aleatorio\`
┃ 🎮 #frase
┃ \`Frase motivacional\`
┃ 🎮 #piropo
┃ \`Piropo aleatorio\`
┃ 🎮 #insulto @tag
┃ \`Insulto gracioso\`
┃ 🎮 #dato
┃ \`Dato curioso\`
┃ 🎮 #conecta4 @tag
┃ \`Conecta 4\`
╰━━━━━━━━━━━━━━━━━━━⬣

╭━━〔 💰 𝐄𝐂𝐎𝐍𝐎𝐌𝐈𝐀 〕━━⊷
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
┃ 📥 #youtube (link)
┃ \`Descargar video YT\`
┃ 📥 #instagram (link)
┃ \`Descargar video IG\`
┃ 📥 #facebook (link)
┃ \`Descargar video FB\`
┃ 📥 #twitter (link)
┃ \`Descargar video X\`
╰━━━━━━━━━━━━━━━━━━━⬣

By: ShotoBot | By: mikelennn | By: 2941160601`;
            
            const imgPath = '/sdcard/Pictures/shotobot/shotobot.menu.jpg';
            if (fs.existsSync(imgPath)) {
                await sock.sendMessage(remitente, { image: fs.readFileSync(imgPath), caption: menu, mentions: [sender] });
            } else {
                await sock.sendMessage(remitente, { text: menu, mentions: [sender] });
            }
        }
        // ==================== COMANDOS DE ADMINISTRACIÓN ====================
        
        if (isGroupChat) {
            const adminCommands = ['#promote', '#demote', '#cerrar', '#abrir', '#kick', '#mute', '#unmute', '#warn', '#unwarn', '#warnlist', '#hide', '#modoadmins', '#banbot', '#unbanbot', '#tagall', '#listadmins', '#listmiembros', '#listmensajes', '#antispam', '#antilinks', '#antistickers', '#antiimg', '#antivideos', '#antiaudios'];
            const command = texto.split(' ')[0];
            
            if (adminCommands.includes(command)) {
                const userIsAdmin = await isAdmin(remitente, sender);
                if (!userIsAdmin && !mensaje.key.fromMe) {
                    await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ ⚠️ No tienes permisos\n┃ 👑 Solo administradores\n╰━━━━━━━━━━━━━━━━⬣` });
                    return;
                }
                
                // Comandos de protección
                const protectionCommands = ['#antispam', '#antilinks', '#antistickers', '#antiimg', '#antivideos', '#antiaudios'];
                if (protectionCommands.includes(command)) {
                    const action = texto.split(' ')[1];
                    if (action !== 'on' && action !== 'off') {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Usa: ${command} on/off\n╰━━━━━━━━━━━━━━━━⬣` });
                        return;
                    }
                    if (!protection[remitente]) protection[remitente] = {};
                    const protectionKey = command.substring(1);
                    protection[remitente][protectionKey] = action === 'on';
                    saveData(PROTECTION_FILE, protection);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    const estado = action === 'on' ? '✅ activada' : '❌ desactivada';
                    await sock.sendMessage(remitente, { text: `╭━━〔 🛡️ 𝐏𝐑𝐎𝐓𝐄𝐂𝐂𝐈𝐎́𝐍 〕━⬣\n┃ ${estado}\n┃ 📌 ${command}\n╰━━━━━━━━━━━━━━━━⬣` });
                }
                
                // #promote
                if (command === '#promote') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Etiqueta o responde al usuario\n╰━━━━━━━━━━━━━━━━⬣` });
                        return;
                    }
                    try {
                        await sock.groupParticipantsUpdate(remitente, [target[0]], 'promote');
                        await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 👑 𝐏𝐑𝐎𝐌𝐎𝐓𝐄 〕━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 👤 Ahora es administrador\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                    } catch (error) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    }
                }
                
                // #demote
                if (command === '#demote') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    try {
                        await sock.groupParticipantsUpdate(remitente, [target[0]], 'demote');
                        await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 📉 𝐃𝐄𝐌𝐎𝐓𝐄 〕━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 👤 Ya no es administrador\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                    } catch (error) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    }
                }
                
                // #cerrar
                if (command === '#cerrar') {
                    try {
                        await sock.groupSettingUpdate(remitente, 'announcement');
                        await sock.sendMessage(remitente, { react: { text: '🔐', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 🔒 𝐆𝐑𝐔𝐏𝐎 𝐂𝐄𝐑𝐑𝐀𝐃𝐎 〕━⬣\n┃ ✅ Solo admins pueden enviar\n╰━━━━━━━━━━━━━━━━━━⬣` });
                    } catch (error) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    }
                }
                
                // #abrir
                if (command === '#abrir') {
                    try {
                        await sock.groupSettingUpdate(remitente, 'not_announcement');
                        await sock.sendMessage(remitente, { react: { text: '🔓', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 🔓 𝐆𝐑𝐔𝐏𝐎 𝐀𝐁𝐈𝐄𝐑𝐓𝐎 〕━⬣\n┃ ✅ Todos pueden enviar\n╰━━━━━━━━━━━━━━━━━━⬣` });
                    } catch (error) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    }
                }
                
                // #kick
                if (command === '#kick') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    if (target[0] === sender) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ ⚠️ No puedes expulsarte a ti mismo\n╰━━━━━━━━━━━━━━━━⬣` });
                        return;
                    }
                    try {
                        await sock.groupParticipantsUpdate(remitente, [target[0]], 'remove');
                        await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 👢 𝐊𝐈𝐂𝐊 〕━━━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 👤 Ha sido expulsado\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                    } catch (error) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                    }
                }
                
                // #mute
                if (command === '#mute') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    mutes[target[0]] = { until: Date.now() + 24 * 60 * 60 * 1000 };
                    saveData(MUTE_FILE, mutes);
                    await sock.sendMessage(remitente, { react: { text: '🔇', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 🔇 𝐌𝐔𝐓𝐄 〕━━━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 🔇 Muteado por 24h\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                }
                
                // #unmute
                if (command === '#unmute') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0] || !mutes[target[0]]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    delete mutes[target[0]];
                    saveData(MUTE_FILE, mutes);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 🔊 𝐔𝐍𝐌𝐔𝐓𝐄 〕━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 🔊 Desmuteado\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                }
                
                // #warn
                if (command === '#warn') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 ❌ 𝐄𝐑𝐑𝐎𝐑 〕━━━━⬣\n┃ 📌 Etiqueta o responde al usuario\n╰━━━━━━━━━━━━━━━━⬣` });
                        return;
                    }
                    await addWarn(remitente, target[0], 'Advertencia manual', '👑');
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
                
                // #unwarn
                if (command === '#unwarn') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0] || !warns[remitente] || !warns[remitente][target[0]]) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    warns[remitente][target[0]]--;
                    if (warns[remitente][target[0]] === 0) delete warns[remitente][target[0]];
                    saveData(WARN_FILE, warns);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 ⚠️ 𝐔𝐍𝐖𝐀𝐑𝐍 〕━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 📊 Warns restantes: ${warns[remitente][target[0]] || 0}/3\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                }
                
                // #warnlist
                if (command === '#warnlist') {
                    if (!warns[remitente] || Object.keys(warns[remitente]).length === 0) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        await sock.sendMessage(remitente, { text: `╭━━〔 📋 𝐖𝐀𝐑𝐍𝐋𝐈𝐒𝐓 〕━⬣\n┃ 📌 No hay warns\n╰━━━━━━━━━━━━━━━━⬣` });
                        return;
                    }
                    let list = `╭━━〔 📋 𝐖𝐀𝐑𝐍𝐋𝐈𝐒𝐓 〕━⬣\n`;
                    for (const [user, count] of Object.entries(warns[remitente])) {
                        list += `┃ 👤 @${user.split('@')[0]}: ${count}/3\n`;
                    }
                    list += `╰━━━━━━━━━━━━━━━━⬣`;
                    await sock.sendMessage(remitente, { text: list, mentions: Object.keys(warns[remitente]) });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
                
                // #hide
                if (command === '#hide') {
                    const quotedMsg = mensaje.message.extendedTextMessage?.contextInfo?.stanzaId;
                    const quotedParticipant = mensaje.message.extendedTextMessage?.contextInfo?.participant;
                    if (!quotedMsg) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    await deleteMessage(remitente, { remoteJid: remitente, fromMe: false, id: quotedMsg, participant: quotedParticipant });
                    await sock.sendMessage(remitente, { react: { text: '🚮', key: mensaje.key } });
                }
                
                // #modoadmins
                if (command === '#modoadmins') {
                    const mode = texto.split(' ')[1];
                    if (mode !== 'on' && mode !== 'off') {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    groupMode[remitente] = mode;
                    saveData(MODE_FILE, groupMode);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 ⚙️ 𝐌𝐎𝐃𝐎 〕━━━━━⬣\n┃ ✅ Modo admins: ${mode.toUpperCase()}\n╰━━━━━━━━━━━━━━━━⬣` });
                }
                
                // #banbot
                if (command === '#banbot') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0]) return;
                    bans[target[0]] = true;
                    saveData(BAN_FILE, bans);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 🚫 𝐁𝐀𝐍𝐁𝐎𝐓 〕━━━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ 🚫 Baneado del bot\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                }
                
                // #unbanbot
                if (command === '#unbanbot') {
                    const target = await getMentionedOrReplied(mensaje);
                    if (!target || !target[0] || !bans[target[0]]) return;
                    delete bans[target[0]];
                    saveData(BAN_FILE, bans);
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                    await sock.sendMessage(remitente, { text: `╭━━〔 ✅ 𝐔𝐍𝐁𝐀𝐍𝐁𝐎𝐓 〕━⬣\n┃ ✅ @${await getContactName(target[0])}\n┃ ✅ Desbaneado del bot\n╰━━━━━━━━━━━━━━━━⬣`, mentions: target });
                }
                
                // #tagall
                if (command === '#tagall') {
                    const groupMetadata = await getGroupMetadataCached(remitente);
                    const participants = groupMetadata.participants;
                    const message = texto.replace('#tagall', '').trim() || 'Sin mensaje';
                    const mentions = participants.map(p => p.id);
                    let tagAllText = `╭━━〔 📢 𝐓𝐀𝐆𝐀𝐋𝐋 〕━━━⬣\n┃ 💬 ${message}\n┃ 👥 ${participants.length} miembros\n╰━━━━━━━━━━━━━━━━⬣\n\n`;
                    tagAllText += mentions.map(m => `@${m.split('@')[0]}`).join('\n');
                    await sock.sendMessage(remitente, { text: tagAllText, mentions });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
                
                // #listadmins
                if (command === '#listadmins') {
                    const groupMetadata = await getGroupMetadataCached(remitente);
                    const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
                    let list = `╭━━〔 👑 𝐀𝐃𝐌𝐈𝐍𝐒 〕━━━⬣\n┃ 📌 Total: ${admins.length}\n`;
                    for (const admin of admins) {
                        list += `┃ 👤 @${admin.id.split('@')[0]}\n`;
                    }
                    list += `╰━━━━━━━━━━━━━━━━⬣`;
                    await sock.sendMessage(remitente, { text: list, mentions: admins.map(a => a.id) });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
                
                // #listmiembros
                if (command === '#listmiembros') {
                    const groupMetadata = await getGroupMetadataCached(remitente);
                    const participants = groupMetadata.participants;
                    let list = `╭━━〔 👥 𝐌𝐈𝐄𝐌𝐁𝐑𝐎𝐒 〕━⬣\n┃ 📌 Total: ${participants.length}\n`;
                    for (const member of participants) {
                        list += `┃ 👤 @${member.id.split('@')[0]}\n`;
                    }
                    list += `╰━━━━━━━━━━━━━━━━⬣`;
                    await sock.sendMessage(remitente, { text: list, mentions: participants.map(p => p.id) });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
                
                // #listmensajes
                if (command === '#listmensajes') {
                    if (!msgCount[remitente] || Object.keys(msgCount[remitente]).length === 0) {
                        await sock.sendMessage(remitente, { react: { text: '❌', key: mensaje.key } });
                        return;
                    }
                    let list = `╭━━〔 💬 𝐌𝐄𝐍𝐒𝐀𝐉𝐄𝐒 〕━⬣\n`;
                    const sorted = Object.entries(msgCount[remitente]).sort((a, b) => b[1] - a[1]);
                    for (const [user, count] of sorted.slice(0, 10)) {
                        list += `┃ 👤 @${user.split('@')[0]}: ${count} msjs\n`;
                    }
                    list += `╰━━━━━━━━━━━━━━━━⬣`;
                    await sock.sendMessage(remitente, { text: list, mentions: Object.keys(msgCount[remitente]) });
                    await sock.sendMessage(remitente, { react: { text: '✅', key: mensaje.key } });
                }
            }
        }
    });
}

iniciarBot().catch(err => console.log('Error:', err));

