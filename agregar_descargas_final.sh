#!/bin/bash

sed -i '/\/\/ #menu/i\

        // #playaudio - Audio de YouTube\
        if (texto.startsWith("#playaudio")) {\
            const busqueda = texto.replace("#playaudio", "").trim();\
            if (!busqueda) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #playaudio (nombre de cancion)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const axios = require("axios");\
                let videoUrl = busqueda;\
                if (!busqueda.includes("youtube.com") && !busqueda.includes("youtu.be")) {\
                    const searchRes = await axios.get("https://api.delirius.store/ytplay?query=" + encodeURIComponent(busqueda));\
                    if (searchRes.data && searchRes.data.data && searchRes.data.data.url) {\
                        videoUrl = searchRes.data.data.url;\
                    } else {\
                        throw new Error("No encontrado");\
                    }\
                }\
                const apiUrl = "https://api.delirius.store/download/ytmp3?url=" + encodeURIComponent(videoUrl);\
                const response = await axios.get(apiUrl);\
                if (response.data && response.data.status && response.data.data) {\
                    const data = response.data.data;\
                    if (data.image) await sock.sendMessage(remitente, { image: { url: data.image }, caption: "╭━━〔 🎵 *AUDIO* 〕━━━⬣\\n┃ 🎵 " + data.title + "\\n┃ 👤 " + data.author + "\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    await sock.sendMessage(remitente, { audio: { url: data.download }, mimetype: "audio/mpeg", fileName: data.title + ".mp3" });\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo obtener el audio\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
\
        // #tiktok - Video de TikTok\
        if (texto.startsWith("#tiktok")) {\
            const link = texto.replace("#tiktok", "").trim();\
            if (!link || !link.includes("tiktok.com")) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #tiktok (link)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const { exec } = require("child_process");\
                const util = require("util");\
                const execPromise = util.promisify(exec);\
                const outputPath = "./tmp/tiktok_" + Date.now() + ".mp4";\
                const fs3 = require("fs");\
                if (!fs3.existsSync("./tmp")) fs3.mkdirSync("./tmp");\
                await execPromise("yt-dlp -f best -o \"" + outputPath + "\" \"" + link + "\"", { timeout: 30000 });\
                if (fs3.existsSync(outputPath)) {\
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: "╭━━〔 🎵 *TIKTOK* 〕━━━⬣\\n┃ ✅ Video descargado sin marca\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    fs3.unlinkSync(outputPath);\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar el TikTok\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
\
        // #youtube - Video de YouTube\
        if (texto.startsWith("#youtube")) {\
            const link = texto.replace("#youtube", "").trim();\
            if (!link) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #youtube (link)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const { exec } = require("child_process");\
                const util = require("util");\
                const execPromise = util.promisify(exec);\
                const outputPath = "./tmp/yt_" + Date.now() + ".mp4";\
                const fs3 = require("fs");\
                if (!fs3.existsSync("./tmp")) fs3.mkdirSync("./tmp");\
                await execPromise("yt-dlp -f best -o \"" + outputPath + "\" \"" + link + "\"", { timeout: 60000 });\
                if (fs3.existsSync(outputPath)) {\
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: "╭━━〔 🎬 *YOUTUBE* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    fs3.unlinkSync(outputPath);\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar el video\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
\
        // #facebook - Video de Facebook\
        if (texto.startsWith("#facebook")) {\
            const link = texto.replace("#facebook", "").trim();\
            if (!link || (!link.includes("facebook.com") && !link.includes("fb.watch"))) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #facebook (link)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const { exec } = require("child_process");\
                const util = require("util");\
                const execPromise = util.promisify(exec);\
                const outputPath = "./tmp/fb_" + Date.now() + ".mp4";\
                const fs3 = require("fs");\
                if (!fs3.existsSync("./tmp")) fs3.mkdirSync("./tmp");\
                await execPromise("yt-dlp -f best -o \"" + outputPath + "\" \"" + link + "\"", { timeout: 30000 });\
                if (fs3.existsSync(outputPath)) {\
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: "╭━━〔 📘 *FACEBOOK* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    fs3.unlinkSync(outputPath);\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar el video\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
\
        // #instagram - Video de Instagram\
        if (texto.startsWith("#instagram")) {\
            const link = texto.replace("#instagram", "").trim();\
            if (!link || !link.includes("instagram.com")) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #instagram (link)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const { exec } = require("child_process");\
                const util = require("util");\
                const execPromise = util.promisify(exec);\
                const outputPath = "./tmp/ig_" + Date.now() + ".mp4";\
                const fs3 = require("fs");\
                if (!fs3.existsSync("./tmp")) fs3.mkdirSync("./tmp");\
                await execPromise("yt-dlp -f best -o \"" + outputPath + "\" \"" + link + "\"", { timeout: 30000 });\
                if (fs3.existsSync(outputPath)) {\
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: "╭━━〔 📷 *INSTAGRAM* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    fs3.unlinkSync(outputPath);\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar el video\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
\
        // #twitter - Video de Twitter\
        if (texto.startsWith("#twitter")) {\
            const link = texto.replace("#twitter", "").trim();\
            if (!link || (!link.includes("twitter.com") && !link.includes("x.com"))) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ 📌 #twitter (link)\\n╰━━━━━━━━━━━━━━━━⬣" });\
                return;\
            }\
            await sock.sendMessage(remitente, { react: { text: "🕐", key: mensaje.key } });\
            try {\
                const { exec } = require("child_process");\
                const util = require("util");\
                const execPromise = util.promisify(exec);\
                const outputPath = "./tmp/tw_" + Date.now() + ".mp4";\
                const fs3 = require("fs");\
                if (!fs3.existsSync("./tmp")) fs3.mkdirSync("./tmp");\
                await execPromise("yt-dlp -f best -o \"" + outputPath + "\" \"" + link + "\"", { timeout: 30000 });\
                if (fs3.existsSync(outputPath)) {\
                    await sock.sendMessage(remitente, { video: fs3.readFileSync(outputPath), caption: "╭━━〔 🐦 *TWITTER/X* 〕━━━⬣\\n┃ ✅ Video descargado\\n╰━━━━━━━━━━━━━━━━⬣" });\
                    fs3.unlinkSync(outputPath);\
                    await sock.sendMessage(remitente, { react: { text: "✅", key: mensaje.key } });\
                } else {\
                    throw new Error();\
                }\
            } catch (error) {\
                await sock.sendMessage(remitente, { text: "╭━━〔 ❌ ERROR 〕━━━━⬣\\n┃ ⚠️ No se pudo descargar el video\\n╰━━━━━━━━━━━━━━━━⬣" });\
                await sock.sendMessage(remitente, { react: { text: "❌", key: mensaje.key } });\
            }\
        }\
' bot.js

echo "✅ Comandos de descarga agregados correctamente"
