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

# Asegurarse de estar en el home
cd ~

echo -e "${YELLOW}[1/7] Actualizando Termux...${NC}"
pkg update -y && pkg upgrade -y

echo -e "${YELLOW}[2/7] Instalando dependencias...${NC}"
pkg install -y nodejs-lts git python ffmpeg

echo -e "${YELLOW}[3/7] Instalando yt-dlp...${NC}"
pip install yt-dlp

echo -e "${YELLOW}[4/7] Eliminando instalación anterior...${NC}"
rm -rf shotobot

echo -e "${YELLOW}[5/7] Descargando ShotoBot...${NC}"
git clone https://github.com/japonrpb/ShotoBot-v2.git shotobot

echo -e "${YELLOW}[6/7] Instalando dependencias de Node.js...${NC}"
cd shotobot
npm install

echo -e "${YELLOW}[7/7] Configurando carpetas...${NC}"
mkdir -p tmp bot_data

# Crear alias para fácil inicio
echo "" >> ~/.bashrc
echo "# ShotoBot alias" >> ~/.bashrc
echo "alias shotobot='cd ~/shotobot && node bot.js'" >> ~/.bashrc

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ SHOTOBOT INSTALADO CORRECTAMENTE           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📌 Para iniciar el bot:${NC}"
echo -e "   ${YELLOW}shotobot${NC}"
echo -e "   ${YELLOW}O también: cd ~/shotobot && node bot.js${NC}"
echo ""
echo -e "${BLUE}📌 Si el QR se ve deforme, ajusta el zoom en Termux${NC}"
echo ""
