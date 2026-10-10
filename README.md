# Krishibhoomi Smart Farming

React, TypeScript and Vite frontend with a TypeScript/Node.js/Express backend served from the same local origin.

## Run

1. Install Node.js (LTS).
2. In this folder, run:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open **http://localhost:3000**. Express serves the API and Vite frontend together, so only port 3000 is required. If `.env.local` already exists, keep it and do not overwrite it.

## Configuration

Set values in `.env.local` as needed:
- `SESSION_SECRET`: use a random secret of at least 32 characters.
- `GEMINI_API_KEY`: Google Gemini API key for AI features.
- `AIVEN_MYSQL_HOST`, `AIVEN_MYSQL_PORT`, `AIVEN_MYSQL_DATABASE`, `AIVEN_MYSQL_USER`, `AIVEN_MYSQL_PASSWORD`: Aiven MySQL connection details.
- `AIVEN_MYSQL_SSL=true`: keep SSL enabled for Aiven.

Never commit `.env.local` or publish secrets.

## Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, TypeScript, Express (`server.ts`)
- Database: MySQL on Aiven (`mysql2`)
- AI: Google Gemini API

Some legacy features (file OCR, OTP email delivery and Google OAuth verification) are intentionally returned as not configured rather than falsely reporting success. Configure their provider integrations before relying on them.


## Real-data and provider configuration

- Start locally with `npm run dev`; the Express API and Vite frontend use port 3000.
- Copy `.env.example` to `.env.local` and set the actual Aiven MySQL credentials and Gemini API key. Set `GEMINI_MODEL` to a model name enabled for your Google AI Studio/API key (for example `gemini-2.5-flash` if available); an unsupported model name prevents OCR and AI recommendations from working.
- For Gmail OTP, set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` to the sending Gmail address, and `SMTP_PASSWORD` to a Google App Password (not the Gmail sign-in password). Set `SMTP_FROM` to the sender address. If SMTP is not configured or delivery fails, registration returns an error instead of pretending an email was sent.
- Soil OCR supports PDF, JPG/JPEG and PNG via Gemini. Review extracted values before saving; fields that are absent or unreadable remain null.
- Crop, fertilizer and pesticide recommendations require a saved soil report belonging to the signed-in farmer. Recommendations are not produced from hidden sample soil profiles.
- Scenario comparisons require a saved soil report and actual farmer-entered yield, price, area and cost values. The financial comparison is arithmetic on those entries, not a guaranteed yield forecast.
- Live mandi prices are not shown because no live market data provider is configured. Yield predictions are marked unavailable if evidence is insufficient. The PDF report does not invent crop yields, fertilizer doses, pesticide prescriptions, profit, market prices or confidence scores.
- The app does not delete or migrate existing farmer accounts automatically. New registration requires email OTP delivery and verification.
