#!/bin/bash

# Colores para mejor visualización
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 🤖 SHOTOBOT - INSTALADOR                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Paso 1: Actualizar Termux
echo -e "${YELLOW}[1/6] Actualizando Termux...${NC}"
pkg update -y && pkg upgrade -y

# Paso 2: Instalar dependencias
echo -e "${YELLOW}[2/6] Instalando dependencias...${NC}"
pkg install -y nodejs-lts git python ffmpeg wget

# Paso 3: Instalar yt-dlp
echo -e "${YELLOW}[3/6] Instalando yt-dlp...${NC}"
pip install yt-dlp

# Paso 4: Clonar repositorio
echo -e "${YELLOW}[4/6] Descargando ShotoBot...${NC}"
git clone https://github.com/japonrpb/ShotoBot-v2.git shotobot
cd shotobot

# Paso 5: Instalar dependencias de Node.js
echo -e "${YELLOW}[5/6] Instalando dependencias de Node.js...${NC}"
npm install

# Paso 6: Instalar sharp para imágenes
echo -e "${YELLOW}[6/6] Instalando librerías adicionales...${NC}"
npm install sharp

# Crear carpetas necesarias
mkdir -p tmp
mkdir -p bot_data

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ SHOTOBOT INSTALADO CORRECTAMENTE           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📌 Para iniciar el bot:${NC}"
echo -e "   ${YELLOW}cd ~/shotobot && node bot.js${NC}"
echo ""
echo -e "${BLUE}📌 Para usar PM2 (segundo plano):${NC}"
echo -e "   ${YELLOW}npm install -g pm2${NC}"
echo -e "   ${YELLOW}pm2 start bot.js --name shotobot${NC}"
echo -e "   ${YELLOW}pm2 save${NC}"
echo ""
echo -e "${BLUE}📌 Escanea el QR con WhatsApp Web cuando aparezca${NC}"
echo ""
