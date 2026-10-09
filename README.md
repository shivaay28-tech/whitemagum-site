# Whitemagum IT Solutions site (React + Node)

## Run locally
    npm install
    cp .env.example .env     # fill in SMTP details
    npm run dev              # site on :5173, API on :3001

## Deploy (single Node process)
    npm install
    npm run build
    npm start                # serves dist/ and /api/inquiry

Put it behind nginx or your host's proxy with HTTPS. Run with pm2 to keep it alive.

## Before going live
- Edit COMPANY, CREDS in src/App.jsx with the exact trade license details.
- Set real SMTP credentials in .env (never commit this file).
