# Slackin - Modernized 🚀

A modernized version of the public Slack invite system, updated for 2025 with the latest dependencies and Node.js features.

## ✨ What's New

This is a **completely modernized** version of the original slackin project with:

### 🔧 Technology Updates
- **Express 5.1.0** (latest) - from Express 4.15.4
- **Socket.io 4.8.1** (latest) - from Socket.io 2.0.3  
- **Node.js 18+** support - from Node.js 6.11.1
- **ES Modules** - converted from CommonJS
- **Modern HTTP client** - replaced superagent with undici
- **Zero vulnerabilities** - all dependencies updated and secure

### 🏗️ Architecture Improvements
- Removed Babel transpilation (native ES modules)
- Removed Gulp build system (no longer needed)
- Updated to modern async/await patterns
- Improved error handling and logging
- Built-in body parsing (Express 5.x)
- Graceful shutdown handling

### 🛡️ Security Enhancements
- Latest Express with security improvements
- Updated reCAPTCHA integration
- Modern IP address handling
- Secure dependency versions

## 📋 Requirements

- **Node.js 18.0.0 or higher**
- **Slack API token** with admin privileges
- **Google reCAPTCHA** site key and secret

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Aswintechie/slack-join.git
cd slack-join

# Install dependencies
npm install

# Start the server
npm start
```

### Environment Variables

Set these environment variables or pass them as command line arguments:

```bash
export SLACK_SUBDOMAIN=your-team-name
export SLACK_API_TOKEN=xoxp-your-token
export GOOGLE_CAPTCHA_SECRET=your-secret
export GOOGLE_CAPTCHA_SITEKEY=your-sitekey
```

### Command Line Usage

```bash
# Basic usage
node bin/slackin.js team-name api-token captcha-secret captcha-sitekey

# With options
node bin/slackin.js \
  --port 3000 \
  --hostname 0.0.0.0 \
  --channels "general,random" \
  --cors \
  team-name api-token captcha-secret captcha-sitekey
```

### Development Mode

```bash
# Auto-restart on changes (Node 18+ built-in)
npm run dev
```

## ⚙️ Configuration Options

| Option | Environment Variable | Description | Default |
|--------|---------------------|-------------|---------|
| `--port` | `PORT` | Port to listen on | 3000 |
| `--hostname` | `HOSTNAME` | Hostname to bind to | 0.0.0.0 |
| `--channels` | `SLACK_CHANNELS` | Comma-separated channel list | All channels |
| `--interval` | `SLACK_INTERVAL` | Polling interval (ms) | 5000 |
| `--cors` | - | Enable CORS | false |
| `--silent` | - | Disable logging | false |
| `--coc` | - | Code of Conduct URL | none |
| `--css` | - | Custom CSS URL | none |

## 🏃‍♂️ Running in Production

### Using PM2

```bash
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'slackin',
    script: 'bin/slackin.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      SLACK_SUBDOMAIN: 'your-team',
      SLACK_API_TOKEN: 'xoxp-your-token',
      GOOGLE_CAPTCHA_SECRET: 'your-secret',
      GOOGLE_CAPTCHA_SITEKEY: 'your-sitekey'
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

USER node
EXPOSE 3000

CMD ["node", "bin/slackin.js"]
```

### Using systemd

```ini
[Unit]
Description=Slackin Slack Invite System
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/slackin
ExecStart=/usr/bin/node bin/slackin.js
Restart=always
RestartSec=10

Environment=NODE_ENV=production
Environment=PORT=3000
Environment=SLACK_SUBDOMAIN=your-team
Environment=SLACK_API_TOKEN=xoxp-your-token
Environment=GOOGLE_CAPTCHA_SECRET=your-secret
Environment=GOOGLE_CAPTCHA_SITEKEY=your-sitekey

[Install]
WantedBy=multi-user.target
```

## 🔧 API Endpoints

- `GET /` - Slack invite page
- `POST /invite` - Submit invite request
- `GET /iframe` - Embeddable iframe
- `GET /iframe/dialog` - Iframe dialog version  
- `GET /badge.svg` - SVG status badge
- `GET /data` - JSON status data

## 🌐 Integration

### Embed as iframe

```html
<iframe 
  src="https://your-domain.com/iframe" 
  width="174" 
  height="30"
  frameborder="0">
</iframe>
```

### Status Badge

```markdown
![Slack](https://your-domain.com/badge.svg)
```

## 🛠️ Development

### Project Structure

```
slack-join/
├── bin/
│   └── slackin.js           # CLI entry point
├── lib/
│   ├── index.js             # Main server logic
│   ├── slack.js             # Slack API integration
│   ├── slack-invite.js      # Invite functionality
│   ├── vd-wrapper.js        # Virtual DOM wrapper
│   ├── splash.js            # Main page template
│   ├── iframe.js            # Iframe template
│   ├── badge.js             # SVG badge generator
│   ├── log.js               # Logging utilities
│   └── assets/              # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

### Key Dependencies

- **express** ^5.1.0 - Web framework
- **socket.io** ^4.8.1 - Real-time communication  
- **undici** ^7.11.0 - Modern HTTP client
- **virtual-dom** ^2.1.1 - Virtual DOM for templates
- **email-regex** ^1.0.0 - Email validation
- **cors** ^2.8.5 - CORS handling

## 🔄 Migration from Original Slackin

If you're migrating from the original slackin:

1. **Node.js**: Update to Node.js 18+ 
2. **Dependencies**: Run `npm install` (all updated automatically)
3. **Environment**: Same environment variables work
4. **API**: All endpoints remain compatible
5. **Build**: No build step required (removed Babel/Gulp)

## 🚨 Breaking Changes from Original

- **Node.js 18+ required** (was 6.11.1)
- **ES Modules** (may affect custom integrations)
- **Updated Slack API usage** (ensure your token has correct scopes)
- **Modern reCAPTCHA** (v2 - ensure your keys are compatible)

## 📝 Environment Variables Reference

```bash
# Required
SLACK_SUBDOMAIN=your-slack-team        # Your Slack workspace name
SLACK_API_TOKEN=xoxp-...               # Slack API token (admin required)
GOOGLE_CAPTCHA_SECRET=...              # reCAPTCHA secret key  
GOOGLE_CAPTCHA_SITEKEY=...             # reCAPTCHA site key

# Optional
PORT=3000                              # Server port
HOSTNAME=0.0.0.0                       # Bind hostname
SLACK_CHANNELS=general,random          # Allowed channels
SLACK_INTERVAL=5000                    # Polling interval (ms)
EMAIL_SLACK_LIST=user@domain.com       # Restricted email list
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `npm test`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Original [slackin](https://github.com/rauchg/slackin) by @rauchg
- Modernization updates for 2025 compatibility
- Express.js, Socket.io, and Node.js communities

---

**Ready to invite the world to your Slack? 🌍✨**
