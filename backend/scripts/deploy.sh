#!/bin/bash
set -e

# IFA Etsy Plugin - Hetzner Deployment Script
# Usage: curl -fsSL <url>/deploy.sh | bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          IFA Etsy Plugin - Server Setup                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"

# Configuration
INSTALL_DIR="/opt/ifa"
REPO_URL="${REPO_URL:-https://github.com/YOUR_USERNAME/agents-inventory.git}"
DOMAIN="${DOMAIN:-}"
NODE_VERSION="22"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() { echo -e "${GREEN}[IFA]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  error "Please run as root"
fi

# Update system
log "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install dependencies
log "Installing dependencies..."
apt-get install -y \
  curl \
  wget \
  git \
  build-essential \
  nginx \
  certbot \
  python3-certbot-nginx \
  ufw

# Install Node.js
log "Installing Node.js ${NODE_VERSION}..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
apt-get install -y nodejs
npm install -g npm@latest

# Install PostgreSQL 16
log "Installing PostgreSQL 16..."
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update
apt-get install -y postgresql-16 postgresql-contrib-16

# Install Redis
log "Installing Redis..."
apt-get install -y redis-server
systemctl enable redis-server
systemctl start redis-server

# Start PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# Generate secure passwords
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
JWT_SECRET=$(openssl rand -hex 32)
TOKEN_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Setup PostgreSQL
log "Configuring PostgreSQL..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ifa;" 2>/dev/null || true
sudo -u postgres psql -c "DROP USER IF EXISTS ifa;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER ifa WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "CREATE DATABASE ifa OWNER ifa;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ifa TO ifa;"

# Clone repository
log "Cloning repository..."
rm -rf ${INSTALL_DIR}
mkdir -p ${INSTALL_DIR}

if [ -n "${REPO_URL}" ]; then
  git clone ${REPO_URL} ${INSTALL_DIR}
else
  warn "REPO_URL not set, creating empty directory structure"
  mkdir -p ${INSTALL_DIR}/backend
fi

# Install PM2
log "Installing PM2..."
npm install -g pm2

# Install backend dependencies
log "Installing backend dependencies..."
cd ${INSTALL_DIR}/backend
npm install

# Create .env file
log "Creating environment configuration..."
cat > ${INSTALL_DIR}/backend/.env << EOF
# Database
DATABASE_URL=postgres://ifa:${DB_PASSWORD}@localhost:5432/ifa

# Redis
REDIS_URL=redis://localhost:6379

# Security
JWT_SECRET=${JWT_SECRET}
TOKEN_ENCRYPTION_KEY=${TOKEN_ENCRYPTION_KEY}

# Etsy OAuth (CONFIGURE THESE)
ETSY_API_KEY=your-etsy-api-key
ETSY_SHARED_SECRET=your-etsy-shared-secret
ETSY_REDIRECT_URI=https://${DOMAIN:-localhost}/etsy/oauth/callback

# OpenClaw
OPENCLAW_GATEWAY_URL=ws://127.0.0.1:18789
OPENCLAW_WORKSPACES_DIR=/root/.openclaw/workspaces

# Server
PORT=8080
NODE_ENV=production
CORS_ORIGIN=https://${DOMAIN:-localhost}

# Anthropic (CONFIGURE THIS)
ANTHROPIC_API_KEY=your-anthropic-api-key
EOF

chmod 600 ${INSTALL_DIR}/backend/.env

# Run migrations
log "Running database migrations..."
cd ${INSTALL_DIR}/backend
npm run migrate

# Build backend
log "Building backend..."
npm run build

# Create OpenClaw workspaces directory
mkdir -p /root/.openclaw/workspaces

# Create PM2 ecosystem file
log "Creating PM2 ecosystem..."
cat > ${INSTALL_DIR}/ecosystem.config.cjs << EOF
module.exports = {
  apps: [
    {
      name: 'ifa-api',
      cwd: '${INSTALL_DIR}/backend',
      script: 'dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      max_memory_restart: '500M',
      error_file: '/var/log/ifa/api-error.log',
      out_file: '/var/log/ifa/api-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
EOF

# Create log directory
mkdir -p /var/log/ifa

# Start services with PM2
log "Starting services..."
cd ${INSTALL_DIR}
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root

# Configure Nginx
log "Configuring Nginx..."
cat > /etc/nginx/sites-available/ifa << EOF
# IFA API
server {
    listen 80;
    server_name ${DOMAIN:-_};

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # API proxy
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;

        # SSE support
        proxy_buffering off;
        proxy_cache off;
    }

    # Health check endpoint (no logging)
    location /health {
        access_log off;
        proxy_pass http://127.0.0.1:8080/health;
    }
}
EOF

ln -sf /etc/nginx/sites-available/ifa /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t && systemctl reload nginx

# Configure firewall
log "Configuring firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# SSL setup (if domain provided)
if [ -n "${DOMAIN}" ]; then
  log "Setting up SSL with Let's Encrypt..."
  certbot --nginx -d ${DOMAIN} \
    --non-interactive --agree-tos \
    --email admin@${DOMAIN} || warn "SSL setup failed, you can run certbot manually later"
fi

# Install OpenClaw (Claude Code)
log "Installing OpenClaw..."
npm install -g @anthropic-ai/claude-code || warn "OpenClaw installation failed"

# Print summary
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                  Installation Complete!                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📁 Installation directory: ${INSTALL_DIR}"
echo "🔐 Database password saved in: ${INSTALL_DIR}/backend/.env"
echo ""
echo "⚠️  IMPORTANT: Configure these in ${INSTALL_DIR}/backend/.env:"
echo "   - ETSY_API_KEY"
echo "   - ETSY_SHARED_SECRET"
echo "   - ANTHROPIC_API_KEY"
echo ""
echo "📋 Commands:"
echo "   pm2 status           - Check service status"
echo "   pm2 logs ifa-api     - View API logs"
echo "   pm2 restart ifa-api  - Restart API"
echo ""
if [ -n "${DOMAIN}" ]; then
  echo "🌐 API available at: https://${DOMAIN}"
else
  echo "🌐 API available at: http://$(curl -s ifconfig.me):80"
fi
echo ""
echo "Done! 🎉"
