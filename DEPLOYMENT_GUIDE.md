# ICT Hubs Deployment Guide

## Quick Start for Non-Programmers

### Step 1: GitHub Repository Setup ✅
- Repository created at: https://github.com/RUKUNDOETIENNE1/Icthubs.git
- SSH key generated and ready to add to GitHub

### Step 2: Add SSH Key to GitHub
1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Title: "ICT Hubs Development Key"
4. Key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEoBuHwSvRDMS9/jeVDB9cgdS9xwduWG38XjmFvf0GcG rukundoetienne1@gmail.com`
5. Click "Add SSH key"

### Step 3: Vercel Deployment
1. Go to: https://vercel.com
2. Sign up/login with GitHub
3. Click "New Project"
4. Select the "Icthubs" repository
5. Vercel will auto-detect it as a static site
6. Click "Deploy"
7. **Important:** After deployment, go to your project settings and ensure the domain is linked to the correct deployment

### Step 4: Domain Setup (icthubs.com) with OrangeHost
Since OrangeHost only allows nameserver changes (not DNS record management), you need to use Vercel as your DNS provider.

1. In Vercel project, go to "Domains" tab
2. Add custom domain: `icthubs.com`
3. Vercel will provide you with their nameservers (typically: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
4. Log in to your OrangeHost account
5. Navigate to domain management for icthubs.com
6. Find the "Nameservers" section
7. Replace the OrangeHost nameservers with Vercel's nameservers:
   - Nameserver 1: `ns1.vercel-dns.com`
   - Nameserver 2: `ns2.vercel-dns.com`
8. Save the changes

### Step 5: Final Configuration
- Wait for DNS propagation (5-30 minutes, sometimes up to 48 hours)
- Go back to Vercel domain settings and click "Refresh" to verify
- Test the domain: https://icthubs.com
- Enable HTTPS in Vercel domain settings

## Project Structure
- **Static Website:** HTML/CSS/JS files in root directory
- **CMS System:** Next.js application in `/cms` folder
- **Database:** Supabase PostgreSQL
- **Storage:** Supabase Storage for media files

## Important Notes
- The main website is static HTML files
- The CMS is a separate Next.js application
- Both can be deployed independently
- Domain should point to the main static site
- CMS can be deployed to a subdomain if needed
