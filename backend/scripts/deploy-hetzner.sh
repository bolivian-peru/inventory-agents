#!/bin/bash
# IFA Backend - 1-Click Hetzner Deployment Script
# This script sets up the complete IFA backend on a fresh Hetzner server

set -e  # Exit on any error

echo "🤖 IFA Backend - Automated Deployment"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Get user inputs
echo -e "${YELLOW}Step 1: Configuration${NC}"
echo "Enter your domain (e.g., app.yourdomain.com):"
read -r DOMAIN

echo "Enter your email for SSL certificate:"
read -r EMAIL

echo "Enter your Anthropic API key:"
read -r ANTHROPIC_KEY

echo "Enter your Etsy API key:"
read -r ETSY_KEY

echo "Enter your Etsy shared secret:"
read -r ETSY_SECRET

echo ""
echo -e "${GREEN}Configuration complete!${NC}"
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo ""

# Update system
echo -e "${YELLOW}Step 2: Updating system...${NC}"
apt-get update -y
apt-get upgrade -y

# Install Node.js 22
echo -e "${YELLOW}Step 3: Installing Node.js 22...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs

# Install PostgreSQL
echo -e "${YELLOW}Step 4: Installing PostgreSQL...${NC}"
apt-get install -y postgresql postgresql-contrib

# Install Redis
echo -e "${YELLOW}Step 5: Installing Redis...${NC}"
apt-get install -y redis-server

# Install Nginx
echo -e "${YELLOW}Step 6: Installing Nginx...${NC}"
apt-get install -y nginx

# Install Certbot
echo -e "${YELLOW}Step 7: Installing Certbot...${NC}"
apt-get install -y certbot python3-certbot-nginx

# Install PM2
echo -e "${YELLOW}Step 8: Installing PM2...${NC}"
npm install -g pm2

# Generate random passwords
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -hex 32)

# Setup PostgreSQL
echo -e "${YELLOW}Step 9: Setting up PostgreSQL...${NC}"
sudo -u postgres psql -c "CREATE USER ifa WITH PASSWORD '$DB_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE ifa OWNER ifa;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ifa TO ifa;"

# Clone repository
echo -e "${YELLOW}Step 10: Cloning IFA repository...${NC}"
mkdir -p /opt/ifa
cd /opt/ifa
git clone https://github.com/bolivian-peru/agents-inventory.git .

# Setup backend
cd /opt/ifa/backend
npm install

# Create .env file
echo -e "${YELLOW}Step 11: Creating configuration...${NC}"
cat > .env << EOF
# Database
DATABASE_URL=postgres://ifa:${DB_PASSWORD}@localhost:5432/ifa

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=${JWT_SECRET}
TOKEN_ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Etsy OAuth
ETSY_API_KEY=${ETSY_KEY}
ETSY_SHARED_SECRET=${ETSY_SECRET}
ETSY_REDIRECT_URI=https://${DOMAIN}/etsy/oauth/callback

# Anthropic
ANTHROPIC_API_KEY=${ANTHROPIC_KEY}

# OpenClaw
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_WORKSPACES_DIR=/opt/openclaw/workspaces

# Server
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://${DOMAIN}
EOF

# Run migrations
echo -e "${YELLOW}Step 12: Running database migrations...${NC}"
npm run migrate

# Build application
echo -e "${YELLOW}Step 13: Building application...${NC}"
npm run build

# Setup PM2
echo -e "${YELLOW}Step 14: Setting up PM2...${NC}"
pm2 start dist/index.js --name ifa-api
pm2 save
pm2 startup

# Configure Nginx
echo -e "${YELLOW}Step 15: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/ifa << 'NGINX_EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_buffering off;
    }

    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:8080/health;
    }
}
NGINX_EOF

sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" /etc/nginx/sites-available/ifa
ln -sf /etc/nginx/sites-available/ifa /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL
echo -e "${YELLOW}Step 16: Setting up SSL certificate...${NC}"
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect

# Setup firewall
echo -e "${YELLOW}Step 17: Configuring firewall...${NC}"
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Create OpenClaw workspaces directory
mkdir -p /opt/openclaw/workspaces

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Your IFA backend is now running at: https://$DOMAIN"
echo ""
echo "Test it:"
echo "  curl https://$DOMAIN/health"
echo ""
echo "Credentials saved to: /opt/ifa/backend/.env"
echo ""
echo "Useful commands:"
echo "  pm2 status         - Check status"
echo "  pm2 logs ifa-api   - View logs"
echo "  pm2 restart ifa-api - Restart API"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Save these credentials securely!${NC}"
echo ""
echo "Database Password: $DB_PASSWORD"
echo "JWT Secret: $JWT_SECRET"
echo ""
echo -e "${GREEN}Happy selling with your AI agent! 🤖${NC}"
