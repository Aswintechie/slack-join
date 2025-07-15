#!/usr/bin/env node

// Load environment variables from .env file
import 'dotenv/config'

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import slackin from '../lib/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read package.json
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'))

// Simple argument parser
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    port: process.env.PORT || 3000,
    hostname: process.env.HOSTNAME || process.env.WEBSITE_HOSTNAME || '0.0.0.0',
    channels: process.env.SLACK_CHANNELS,
    interval: parseInt(process.env.SLACK_INTERVAL) || 5000,
    path: '/',
    silent: false,
    cors: false,
    coc: null,
    css: null,
    help: false
  }

  const positional = []

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '-p':
      case '--port':
        options.port = parseInt(nextArg)
        i++
        break
      case '-h':
      case '--hostname':
        options.hostname = nextArg
        i++
        break
      case '-c':
      case '--channels':
        options.channels = nextArg
        i++
        break
      case '-i':
      case '--interval':
        options.interval = parseInt(nextArg)
        i++
        break
      case '-P':
      case '--path':
        options.path = nextArg
        i++
        break
      case '-s':
      case '--silent':
        options.silent = true
        break
      case '-x':
      case '--cors':
        options.cors = true
        break
      case '-C':
      case '--coc':
        options.coc = nextArg
        i++
        break
      case '-S':
      case '--css':
        options.css = nextArg
        i++
        break
      case '--help':
        options.help = true
        break
      default:
        if (!arg.startsWith('-')) {
          positional.push(arg)
        }
        break
    }
  }

  return { options, positional }
}

function showHelp() {
  console.log(`
${pkg.name} v${pkg.version}
${pkg.description}

Usage: slackin [options] <team-id> <api-token> <google-captcha-secret> <google-captcha-sitekey>

Options:
  -p, --port <port>           Port to listen on (default: $PORT or 3000)
  -h, --hostname <hostname>   Hostname to listen on (default: $HOSTNAME or 0.0.0.0)
  -c, --channels <channels>   Comma-separated channel names for single-channel guests
  -i, --interval <ms>         How frequently to poll Slack (default: 5000ms)
  -P, --path <path>           Path to serve slackin under (default: /)
  -s, --silent               Do not print out warns or errors
  -x, --cors                 Enable CORS for all routes
  -C, --coc <url>            Full URL to a CoC that needs to be agreed to
  -S, --css <url>            Full URL to a custom CSS file to use on main page
      --help                 Show this help message

Environment Variables:
  SLACK_SUBDOMAIN            Slack team subdomain
  SLACK_API_TOKEN           Slack API token
  SLACK_CHANNELS            Comma-separated channel names
  SLACK_INTERVAL            Polling interval in milliseconds
  GOOGLE_CAPTCHA_SECRET     Google reCAPTCHA secret key
  GOOGLE_CAPTCHA_SITEKEY    Google reCAPTCHA site key
  EMAIL_SLACK_LIST          Comma-separated list of allowed emails
`)
}

// Parse arguments
const { options, positional } = parseArgs()

if (options.help) {
  showHelp()
  process.exit(0)
}

// Get required parameters
const org = positional[0] || process.env.SLACK_SUBDOMAIN
const token = positional[1] || process.env.SLACK_API_TOKEN
const gcaptcha_secret = positional[2] || process.env.GOOGLE_CAPTCHA_SECRET
const gcaptcha_sitekey = positional[3] || process.env.GOOGLE_CAPTCHA_SITEKEY
const emails = process.env.EMAIL_SLACK_LIST || ''

// Validate required parameters
if (!org || !token || !gcaptcha_secret || !gcaptcha_sitekey) {
  console.error('Error: Missing required parameters')
  showHelp()
  process.exit(1)
}

// Configure slackin
const config = {
  ...options,
  org,
  token,
  gcaptcha_secret,
  gcaptcha_sitekey,
  emails
}

try {
  const server = slackin(config)
  
  server.listen(options.port, options.hostname, (err) => {
    if (err) {
      console.error('Failed to start server:', err)
      process.exit(1)
    }
    
    if (!options.silent) {
      console.log(`${new Date().toISOString()} – slackin listening on ${options.hostname}:${options.port}`)
      console.log(`Slack team: ${org}`)
      if (options.channels) {
        console.log(`Channels: ${options.channels}`)
      }
    }
  })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    if (!options.silent) console.log('Received SIGTERM, shutting down gracefully')
    server.close(() => {
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    if (!options.silent) console.log('Received SIGINT, shutting down gracefully')
    server.close(() => {
      process.exit(0)
    })
  })

} catch (error) {
  console.error('Failed to start slackin:', error.message)
  process.exit(1)
}
