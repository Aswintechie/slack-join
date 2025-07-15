# 🔑 Token Setup Guide

This guide explains how to obtain all the required tokens and keys for your slackin application.

## 📋 Required Credentials

You need these 4 pieces of information:
1. **SLACK_SUBDOMAIN** - Your Slack workspace subdomain
2. **SLACK_API_TOKEN** - Slack API token with admin privileges  
3. **GOOGLE_CAPTCHA_SECRET** - Google reCAPTCHA secret key
4. **GOOGLE_CAPTCHA_SITEKEY** - Google reCAPTCHA site key

---

## 1️⃣ Slack Subdomain (SLACK_SUBDOMAIN)

This is the easiest one - it's just your Slack workspace name.

### How to Find It:
- Look at your Slack URL: `https://YOUR-TEAM-NAME.slack.com`
- The `YOUR-TEAM-NAME` part is your subdomain
- **Example**: If your Slack is `https://mycompany.slack.com`, then `SLACK_SUBDOMAIN=mycompany`

---

## 2️⃣ Slack API Token (SLACK_API_TOKEN)

You need a Slack API token with **admin privileges** to invite users.

### ⚠️ **Important: Free Plan Limitations**

**Slack Free Plan CAN work with slackin, BUT with significant limitations:**

- ✅ **API tokens available** - You can still get API tokens on free plans
- ⚠️ **Admin required** - You must be a workspace admin to invite users
- ⚠️ **10 app limit** - Free plans limited to 10 app installations total
- ⚠️ **Strict rate limits** - New 2025 restrictions severely limit API calls for non-Marketplace apps
- ⚠️ **90-day history** - Only recent messages/files visible

**💡 Recommendation**: Slackin works on free plans but paid plans provide a much better experience with higher rate limits and no app installation restrictions.

### Step-by-Step Instructions:

#### Option A: Legacy Token (Easiest)
1. **Go to**: https://api.slack.com/legacy/custom-integrations/legacy-tokens
2. **Sign in** to your Slack workspace
3. **Generate token** for your workspace
4. **Copy the token** (starts with `xoxp-`)
5. **⚠️ Note**: Legacy tokens have broad permissions

#### Option B: Slack App (Recommended for Production)
1. **Go to**: https://api.slack.com/apps
2. **Click "Create New App"**
3. **Choose "From scratch"**
4. **App Name**: "Slackin Bot" (or any name)
5. **Workspace**: Select your workspace
6. **Click "Create App"**

7. **Configure OAuth Scopes**:
   - Go to **"OAuth & Permissions"** in the sidebar
   - Scroll to **"Scopes"** section
   - Add these **Bot Token Scopes**:
     - `channels:read` - View basic info about public channels
     - `users:read` - View people in the workspace
     - `admin.users.invite` - Send invitations to your workspace (requires admin)

8. **Install App**:
   - Click **"Install to Workspace"**
   - **Authorize** the app
   - **Copy the "Bot User OAuth Token"** (starts with `xoxb-`)

#### Option C: User Token (Alternative)
1. **Follow steps 1-6** from Option B
2. **Add User Token Scopes** instead:
   - `admin` - Administer the workspace
   - `client` - Access basic workspace info
3. **Install app** and copy the **"User OAuth Token"** (starts with `xoxp-`)

### 🔒 Security Notes:
- **Keep your token secret** - don't share it publicly
- **Use Bot tokens** when possible (more secure)
- **Admin privileges required** for inviting users

### 🚨 **2025 API Rate Limit Changes**

**Important for Free Plan Users:**

Starting May 29, 2025, Slack implemented severe rate limit restrictions for non-Marketplace apps:

- **conversations.history**: 1 request per minute (was 50+)
- **conversations.replies**: 1 request per minute (was 50+)
- **Apps created before May 29, 2025**: Keep higher limits until Sept 2, 2025
- **Internal customer apps**: Retain higher limits permanently

**What this means for slackin:**
- ✅ **Basic functionality works** - inviting users, showing user counts
- ⚠️ **Slower data updates** - user count updates will be less frequent
- ✅ **Legacy tokens** - May have better rate limits than new OAuth apps

**Solutions:**
1. **Use legacy tokens** (often better rate limits)
2. **Submit to Slack Marketplace** (removes rate limits)
3. **Accept slower updates** (still functional, just less real-time)

---

## 3️⃣ & 4️⃣ Google reCAPTCHA Keys

You need both a **secret key** and a **site key** from Google reCAPTCHA.

### Step-by-Step Instructions:

1. **Go to**: https://www.google.com/recaptcha/admin/create
2. **Sign in** with your Google account

3. **Register a new site**:
   - **Label**: "Slackin" (or any name)
   - **reCAPTCHA type**: Choose **"reCAPTCHA v2"**
   - **Sub type**: Select **"I'm not a robot" Checkbox**

4. **Add your domains**:
   - **For development**: Add `localhost`, `127.0.0.1`
   - **For production**: Add your actual domain (e.g., `mysite.com`)
   - **Example entries**:
     ```
     localhost
     127.0.0.1
     mycompany.com
     slackin.mycompany.com
     ```

5. **Accept terms** and click **"Submit"**

6. **Copy your keys**:
   - **Site key**: This is your `GOOGLE_CAPTCHA_SITEKEY` (public, shown to users)
   - **Secret key**: This is your `GOOGLE_CAPTCHA_SECRET` (private, server-side)

### 📝 Example Result:
```
Site key: 6LcXXXXXXXXXX...XXXXXXXXX (public key)
Secret key: 6LcYYYYYYYYYY...YYYYYYYYY (private key)
```

---

## 🔧 Final Configuration

Once you have all 4 credentials, update your `.env` file:

```bash
# Copy the example file
cp env.example .env

# Edit with your actual values
nano .env
```

**Example `.env` file**:
```bash
# Required: Slack Configuration
SLACK_SUBDOMAIN=mycompany
SLACK_API_TOKEN=xoxp-YOUR-ACTUAL-SLACK-TOKEN-HERE

# Required: Google reCAPTCHA Configuration  
GOOGLE_CAPTCHA_SECRET=YOUR-RECAPTCHA-SECRET-KEY-HERE
GOOGLE_CAPTCHA_SITEKEY=YOUR-RECAPTCHA-SITE-KEY-HERE

# Optional: Server Configuration
PORT=3000
HOSTNAME=0.0.0.0
```

---

## ✅ Testing Your Setup

Test that everything works:

```bash
# Install dependencies
npm install

# Start the application
npm start
```

You should see:
```
slackin listening on 0.0.0.0:3000
Slack team: mycompany
```

Visit `http://localhost:3000` to see your invite page!

---

## 🚨 Troubleshooting

### Slack API Errors
- **"Invalid auth"**: Check your `SLACK_API_TOKEN`
- **"Missing scope"**: Ensure your token has admin/invite permissions
- **"Account inactive"**: Verify the token belongs to an active admin user

### reCAPTCHA Errors  
- **"Invalid site key"**: Check your `GOOGLE_CAPTCHA_SITEKEY`
- **"Invalid secret"**: Verify your `GOOGLE_CAPTCHA_SECRET`
- **"Domain not allowed"**: Add your domain to reCAPTCHA settings

### Network Issues
- **"Connection refused"**: Check if port 3000 is available
- **"Invalid subdomain"**: Verify your `SLACK_SUBDOMAIN` is correct

---

## 🔒 Security Best Practices

1. **Never commit `.env`** - It's already in `.gitignore`
2. **Use environment variables** in production
3. **Rotate tokens regularly** 
4. **Limit token scopes** to minimum required
5. **Monitor token usage** in Slack admin

---

## 🆓 **Free Plan Summary**

### ✅ **What Works on Slack Free Plan:**
- **Basic slackin functionality** - invite page, user invitations
- **API token generation** - legacy tokens and OAuth apps both work
- **reCAPTCHA integration** - no plan restrictions
- **User count display** - shows online/total users (with slower updates)
- **All slackin features** - embed codes, badges, iframe support

### ⚠️ **Free Plan Limitations:**
- **10 app maximum** - slackin counts as 1 of your 10 allowed apps
- **Slower updates** - user counts update less frequently due to rate limits
- **90-day message history** - older Slack data not accessible
- **Admin required** - you must be workspace admin to generate invite tokens

### 💰 **When to Upgrade to Paid Plan:**
- **High traffic** - need real-time user count updates
- **Many apps** - already using 10+ integrations
- **Advanced features** - SSO, advanced admin controls, unlimited history
- **Commercial use** - better rate limits and support for business usage

### 🎯 **Free Plan Recommendation:**
Slackin works perfectly fine on Slack free plans for:
- **Small teams** (under 10 people)
- **Personal projects** 
- **Testing/development**
- **Low-traffic invite pages**

For high-traffic or commercial use, consider upgrading to a paid Slack plan for better performance and reliability.

---

## 📞 Need Help?

- **Slack API Docs**: https://api.slack.com/web
- **reCAPTCHA Docs**: https://developers.google.com/recaptcha
- **Issues**: Open an issue on GitHub

Ready to invite the world to your Slack! 🌍✨ 