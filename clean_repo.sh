#!/bin/bash

echo "🧹 Limpiando repositorio..."

# Archivos a mantener (los importantes)
KEEP_FILES=(
    "bot.js"
    "package.json"
    "package-lock.json"
    "README.md"
    ".gitignore"
)

# Archivos a eliminar (scripts temporales y de prueba)
REMOVE_FILES=(
    "test_bot.js"
    "testSB.js"
    "add_ai.js"
    "add_welcome.js"
    "addbot_comando.js"
    "addbot_correcto.js"
    "addbot_fixed.js"
    "agregar_descargas.js"
    "agregar_todos_descargas.js"
    "comandos_descargas.js"
    "comandos_descargas_final.js"
    "descargas_comandos.js"
    "descargas_final.js"
    "descargas_simple.js"
    "descargas_ytdlp.js"
    "fix_addbot.js"
    "fix_addbot_v2.js"
    "fix_admin_cache.js"
    "fix_ai.js"
    "fix_ai_v2.js"
    "fix_descargas.js"
    "fix_mute.js"
    "fix_playaudio.js"
    "fix_playaudio_busqueda.js"
    "fix_playaudio_final.js"
    "fix_playaudio_simple.js"
    "fix_playaudio_v2.js"
    "fix_rate_limit.js"
    "fix_rate_limit_cache.js"
    "fix_welcome_event.js"
    "ia_huggingface.js"
    "ia_nexus.js"
    "ia_real.js"
    "ia_zenkey.js"
    "mejorar_playaudio.js"
    "playaudio_comando.js"
    "qr_style.js"
    "reemplazar_playaudio.js"
    "setup_ollama.js"
    "solo_playaudio.js"
    "update_menu.js"
    "welcome_fix.js"
    "welcome_simple.js"
    "addbot_correcto.js"
    "SHOTOBOTN.js"
)

# Eliminar archivos
for file in "${REMOVE_FILES[@]}"; do
    if [ -f "$file" ]; then
        git rm --cached "$file" 2>/dev/null
        rm -f "$file"
        echo "🗑️ Eliminado: $file"
    fi
done

# Mantener solo los archivos importantes
echo "✅ Archivos que se mantendrán:"
ls -la bot.js package.json package-lock.json README.md .gitignore 2>/dev/null

echo "📦 Haciendo commit de la limpieza..."
git add .
git commit -m "🧹 Limpieza del repositorio: eliminados scripts temporales y de prueba"

echo "🚀 Subiendo cambios a GitHub..."
git push

echo "🎉 Repositorio limpiado!"
