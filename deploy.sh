#!/bin/bash
# Sierra Dorada - Raspberry Pi Deployment Script
# Run this script on your Raspberry Pi

set -e

echo "🍺 Sierra Dorada - Deployment Script"
echo "====================================="

# Variables
APP_DIR="/home/sdpi/sierra-dorada"
REPO_URL="https://github.com/Raydan08x/prototipo-sierradoradapage.git"
BRANCH="main"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

echo -e "${YELLOW}Step 2: Installing required packages...${NC}"
sudo apt install -y nginx postgresql postgresql-contrib git curl

# Install Node.js 20 LTS
echo -e "${YELLOW}Step 3: Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
echo -e "${YELLOW}Step 4: Installing PM2...${NC}"
sudo npm install -g pm2

# Create logs directory
mkdir -p /home/sdpi/logs

# Clone or update repository
echo -e "${YELLOW}Step 5: Setting up application...${NC}"
if [ -d "$APP_DIR" ]; then
    echo "Updating existing installation..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo "Fresh installation..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
echo -e "${YELLOW}Step 6: Installing dependencies...${NC}"
npm ci --production=false

# Build frontend
echo -e "${YELLOW}Step 7: Building frontend...${NC}"
npm run build

# Setup environment file
echo -e "${YELLOW}Step 8: Setting up environment...${NC}"
if [ ! -f "$APP_DIR/.env" ]; then
    cp $APP_DIR/.env.production.example $APP_DIR/.env
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit .env file with your database credentials!${NC}"
    echo "Run: nano $APP_DIR/.env"
fi

# Setup Nginx
echo -e "${YELLOW}Step 9: Configuring Nginx...${NC}"
sudo cp $APP_DIR/nginx.conf /etc/nginx/sites-available/sierradorada.co
sudo ln -sf /etc/nginx/sites-available/sierradorada.co /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Start application with PM2
echo -e "${YELLOW}Step 10: Starting application...${NC}"
cd $APP_DIR
pm2 delete sierra-dorada-api 2>/dev/null || true
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup systemd -u sdpi --hp /home/sdpi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Edit .env: nano $APP_DIR/.env"
echo "2. Setup PostgreSQL: sudo -u postgres createuser -P sierra_admin"
echo "3. Create database: sudo -u postgres createdb -O sierra_admin sierradorada"
echo "4. Run migrations: cd $APP_DIR && npm run db:setup"
echo "5. Configure Cloudflare DNS to point to your Raspberry Pi IP"
echo ""
echo "Monitor logs: pm2 logs sierra-dorada-api"
echo "Status: pm2 status"
