#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 🤖 SHOTOBOT - INSTALADOR                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}[1/6] Actualizando Termux...${NC}"
pkg update -y && pkg upgrade -y

echo -e "${YELLOW}[2/6] Instalando dependencias...${NC}"
pkg install -y nodejs-lts git python ffmpeg

echo -e "${YELLOW}[3/6] Instalando yt-dlp...${NC}"
pip install yt-dlp

echo -e "${YELLOW}[4/6] Descargando ShotoBot...${NC}"
cd ~
rm -rf shotobot 2>/dev/null
git clone https://github.com/japonrpb/ShotoBot-v2.git shotobot
cd shotobot

echo -e "${YELLOW}[5/6] Instalando dependencias de Node.js...${NC}"
npm install

echo -e "${YELLOW}[6/6] Configurando carpetas...${NC}"
mkdir -p tmp bot_data

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ SHOTOBOT INSTALADO CORRECTAMENTE           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📌 Para iniciar el bot:${NC}"
echo -e "   ${YELLOW}cd ~/shotobot && node bot.js${NC}"
echo ""
echo -e "${BLUE}📌 Escanea el QR que aparece en la terminal${NC}"
echo ""
