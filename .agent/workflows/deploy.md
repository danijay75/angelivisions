---
description: Deploy the website to the OVH VPS via SSH with a single command
---

# 🚀 Deploy to OVH VPS

This workflow deploys the Angeli Visions website to the OVH VPS (Ubuntu) via SSH.

## Prerequisites

- SSH access configured to `ubuntu@91.134.143.82`
- The VPS has Node.js 22, PM2, Nginx, and Git installed
- The project is cloned at `/home/ubuntu/angelivisions` on the VPS
- The `.env.local` file is configured on the VPS
- The `deploy.sh` script exists at `/home/ubuntu/angelivisions/deploy.sh`

## Deployment Steps

### 1. Commit and push local changes to GitHub

Ask the user for a commit message, then run the following commands:

```powershell
cd c:\Users\danij\Downloads\angeli-visions-organisateur-d-evenements-maison-de-disque
git add -A
git commit -m "<commit message>"
git push origin main
```

### 2. Deploy to VPS via SSH

// turbo
Run the deploy script on the VPS via SSH (single command, no interactive session needed):

```powershell
ssh ubuntu@91.134.143.82 "cd /home/ubuntu/angelivisions && bash deploy.sh"
```

This command will:
- Pull the latest code from GitHub (`git pull origin main`)
- Install dependencies (`npm install --production=false`)
- Build the Next.js project (`npm run build`)
- Restart the application via PM2 (`pm2 restart angelivisions`)

### 3. Verify deployment

// turbo
Check that the site is running correctly:

```powershell
ssh ubuntu@91.134.143.82 "pm2 status && curl -s -o /dev/null -w '%{http_code}' http://localhost:3000"
```

Expected output:
- PM2 should show the `angelivisions` process as `online`
- The curl command should return `200`

### 4. Optional: Check Nginx status

// turbo
If the site is not accessible from outside:

```powershell
ssh ubuntu@91.134.143.82 "sudo systemctl status nginx --no-pager -l"
```

## Troubleshooting

### Build fails on VPS
If the build fails, check the logs:
```powershell
ssh ubuntu@91.134.143.82 "cd /home/ubuntu/angelivisions && cat .next/trace 2>/dev/null | tail -50"
```

### PM2 process crashes
Check PM2 logs:
```powershell
ssh ubuntu@91.134.143.82 "pm2 logs angelivisions --lines 50 --nostream"
```

### Restart from scratch
If everything is broken:
```powershell
ssh ubuntu@91.134.143.82 "cd /home/ubuntu/angelivisions && pm2 delete angelivisions && npm install --legacy-peer-deps && npm run build && pm2 start npm --name angelivisions -- start && pm2 save"
```

## VPS Connection Info

| Property     | Value                  |
|-------------|------------------------|
| IP          | `91.134.143.82`        |
| User        | `ubuntu`               |
| Project dir | `/home/ubuntu/angelivisions` |
| PM2 name    | `angelivisions`        |
| Node.js     | v22 LTS                |
