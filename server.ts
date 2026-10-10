import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { randomUUID, createHash, randomInt } from 'node:crypto';
import nodemailer from 'nodemailer';

// Load env files from the project directory, even if npm run dev is launched from another folder.
const PROJECT_DIR = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(PROJECT_DIR, '.env.local'), quiet: true });
dotenv.config({ path: path.join(PROJECT_DIR, '.env'), override: false, quiet: true });

// Accept both the documented Aiven variable names and common MySQL aliases.
function envValue(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.SESSION_SECRET || 'development-only-change-this-secret-before-deploying';
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

let pool: Pool | null = null;

function db(): Pool | null {
  if (pool) return pool;
  const host = envValue('AIVEN_MYSQL_HOST', 'MYSQL_HOST', 'DB_HOST');
  const user = envValue('AIVEN_MYSQL_USER', 'MYSQL_USER', 'DB_USER');
  const password = envValue('AIVEN_MYSQL_PASSWORD', 'MYSQL_PASSWORD', 'DB_PASSWORD');
  const database = envValue('AIVEN_MYSQL_DATABASE', 'MYSQL_DATABASE', 'DB_NAME');
  const port = envValue('AIVEN_MYSQL_PORT', 'MYSQL_PORT', 'DB_PORT');
  if (!host || !user || !password || !database) return null;
  pool = mysql.createPool({
    host, port: Number(port || 3306),
    user, password, database,
    waitForConnections: true, connectionLimit: 5, ssl: process.env.AIVEN_MYSQL_SSL === 'false' ? undefined : { rejectUnauthorized: process.env.AIVEN_MYSQL_SSL_REJECT_UNAUTHORIZED === 'true' }
  });
  return pool;
}
async function query<T = any>(sql: string, values: any[] = []): Promise<T> {
  const conn = db(); if (!conn) throw new Error('Aiven MySQL credentials are missing. Check the project-root .env.local for AIVEN_MYSQL_HOST, AIVEN_MYSQL_USER, AIVEN_MYSQL_PASSWORD and AIVEN_MYSQL_DATABASE (or MYSQL_HOST/MYSQL_USER/MYSQL_PASSWORD/MYSQL_DATABASE aliases).');
  const [rows] = await conn.execute(sql, values); return rows as T;
}
function send(res: Response, data: any = null, message = 'Operation successful.', status = 200) {
  return res.status(status).json({ success: status < 400, data, message });
}
function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return send(res, null, 'Authentication required.', 401);
  try { (req as any).user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return send(res, null, 'Session expired. Please log in again.', 401); }
}
const safeUser = (u: any) => ({ id: u.id, name: u.name, email: u.email, location: u.location || '', farmArea: Number(u.farm_area || 0), soilType: u.soil_type || '', preferredCrop: u.preferred_crop || '', preferred_language: u.preferred_language || 'en', avatarUrl: u.avatar_url || '', email_verified: !!u.email_verified });
async function ai(prompt: string, system?: string, extraParts: any[] = []) {
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini is not configured. Add GEMINI_API_KEY to .env.local.');
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const result = await client.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: [{ text: `${system ? system + '\n\n' : ''}${prompt}` }, ...extraParts] });
  return result.text || '';
}

function parseJsonText(text: string): any {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(cleaned); } catch { throw new Error('AI service returned an unreadable response. Please retry; no sample data was substituted.'); }
}
function mailTransport() {
  const host = envValue('SMTP_HOST');
  const user = envValue('SMTP_USER');
  const password = envValue('SMTP_PASSWORD');
  if (!host || !user || !password) throw new Error('Email delivery is not configured. Set SMTP_HOST, SMTP_USER and SMTP_PASSWORD in .env.local.');
  return nodemailer.createTransport({
    host, port: Number(envValue('SMTP_PORT') || 587),
    secure: Number(envValue('SMTP_PORT') || 587) === 465,
    auth: { user, pass: password }
  });
}
async function deliverOtp(email: string, userId: string, purpose = 'register') {
  const otp = String(randomInt(0, 1000000)).padStart(6, '0');
  const hash = createHash('sha256').update(`${email}:${otp}`).digest('hex');
  await query('DELETE FROM user_email_otps WHERE email=? AND purpose=?', [email, purpose]);
  await query('INSERT INTO user_email_otps (id,user_id,email,purpose,code_hash,expires_at,attempts) VALUES (?,?,?,?,?,DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 MINUTE),0)',
    [randomUUID(), userId, email, purpose, hash]);
  const transport = mailTransport();
  await transport.sendMail({
    from: envValue('SMTP_FROM') || envValue('SMTP_USER'),
    to: email,
    subject: purpose === 'register' ? 'Verify your Krishibhoomi email' : 'Krishibhoomi verification code',
    text: `Your Krishibhoomi verification code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    html: `<p>Your Krishibhoomi verification code is <strong style="font-size:24px;letter-spacing:4px">${otp}</strong>.</p><p>It expires in 10 minutes. If you did not request this, ignore this email.</p>`
  });
}
async function getVerifiedSoilReport(reportId: string, userId: string) {
  if (!reportId) throw new Error('Select a saved soil report before requesting recommendations. No default or demo soil values are used.');
  const rows: any[] = await query('SELECT * FROM soil_analysis WHERE id=? AND user_id=? LIMIT 1', [reportId, userId]);
  if (!rows[0]) throw new Error('The selected soil report was not found for this account.');
  return rows[0];
}

app.get('/api/health', async (_req, res) => {
  let database = 'not configured';
  try { if (db()) { await query('SELECT 1'); database = 'connected'; } } catch (error: any) { database = 'unavailable'; console.error('[DB health]', error?.code || error?.message || 'connection failed'); }
  send(res, { status: 'ok', database, runtime: 'Node.js / Express', envFile: path.join(PROJECT_DIR, '.env.local') }, 'Krishibhoomi API is running.');
});
app.post('/api/auth/register', async (req, res, next) => {
  let createdId = '';
  try {
    const body = req.body || {};
    const name = String(body.name ?? body.fullName ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return send(res, null, 'A valid name, email and password of at least 8 characters are required.', 400);
    }
    const id = randomUUID(); createdId = id;
    const passwordHash = await bcrypt.hash(password, 12);
    await query('INSERT INTO users (id,name,email,password_hash,email_verified) VALUES (?,?,?,?,FALSE)', [id, name, email, passwordHash]);
    try {
      await deliverOtp(email, id, 'register');
    } catch (mailError: any) {
      await query('DELETE FROM users WHERE id=?', [id]).catch(() => {});
      console.error('[SMTP registration]', mailError?.code || mailError?.message || 'delivery failed');
      return send(res, null, mailError?.message || 'Could not send verification email. Check SMTP configuration.', 503);
    }
    return send(res, { email, pendingVerification: true, requiresVerification: true }, 'Verification code sent to your email. Verify it to activate your account.', 201);
  } catch (e: any) {
    if (e?.code === 'ER_DUP_ENTRY') return send(res, null, 'An account with this email already exists. Try logging in instead.', 409);
    next(e);
  }
});
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim(), password = String(req.body?.password || '');
    const rows: any[] = await query('SELECT * FROM users WHERE email=? LIMIT 1', [email]);
    if (!rows[0] || !rows[0].password_hash || !(await bcrypt.compare(password, rows[0].password_hash))) return send(res, null, 'Invalid email or password.', 401);
    const user = rows[0];
    const pending: any[] = await query('SELECT id FROM user_email_otps WHERE email=? AND purpose=\'register\' LIMIT 1', [email]);
    if (pending.length) return send(res, { requiresOtp: true, email }, 'A verification code is pending. Verify your email before logging in.', 403);
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    send(res, { token, access_token: token, user: safeUser(user) }, 'Login successful.');
  } catch (e) { next(e); }
});
app.get('/api/auth/profile', auth, async (req, res, next) => {
  try { const rows: any[] = await query('SELECT id,name,email,location,farm_area,soil_type,preferred_crop,preferred_language,avatar_url,created_at,email_verified FROM users WHERE id=? LIMIT 1', [(req as any).user.sub]); if (!rows[0]) return send(res, null, 'User not found.', 404); send(res, { user: safeUser(rows[0]) }); } catch (e) { next(e); }
});
app.put('/api/auth/profile', auth, async (req, res, next) => {
  try {
    const b = req.body || {}, uid = (req as any).user.sub;
    const fields: Record<string,string> = { name:'name', location:'location', farmArea:'farm_area', soilType:'soil_type', preferredCrop:'preferred_crop', preferred_language:'preferred_language', avatarUrl:'avatar_url' };
    const sets: string[] = [], vals: any[] = [];
    for (const [key, col] of Object.entries(fields)) if (b[key] !== undefined) { sets.push(`${col}=?`); vals.push(b[key]); }
    if (sets.length) { vals.push(uid); await query(`UPDATE users SET ${sets.join(', ')} WHERE id=?`, vals); }
    const rows: any[] = await query('SELECT id,name,email,location,farm_area,soil_type,preferred_crop,preferred_language,avatar_url,email_verified FROM users WHERE id=? LIMIT 1', [uid]);
    send(res, { user: rows[0] ? safeUser(rows[0]) : null });
  } catch (e) { next(e); }
});
app.post('/api/auth/logout', (_req, res) => send(res, null, 'Logged out.'));
app.post('/api/auth/forgot-password', (_req, res) => send(res, null, 'If the account exists, follow the password reset instructions.'));
app.post('/api/auth/reset-password', (_req, res) => send(res, null, 'Password reset is not configured. Configure an email/OTP provider before enabling this flow.', 501));
app.post('/api/auth/verify-otp', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const otp = String(req.body?.otp || '').replace(/\D/g, '');
    if (!email || !/^\d{6}$/.test(otp)) return send(res, null, 'Enter the email address and 6-digit code.', 400);
    const rows: any[] = await query("SELECT *, (expires_at > UTC_TIMESTAMP()) AS is_valid FROM user_email_otps WHERE email=? AND purpose='register' ORDER BY created_at DESC LIMIT 1", [email]);
    const row = rows[0];
    if (!row || !Number(row.is_valid)) return send(res, null, 'Verification code expired or not found. Request a new code.', 400);
    if (Number(row.attempts) >= 5) return send(res, null, 'Too many incorrect attempts. Request a new code.', 429);
    const expected = createHash('sha256').update(`${email}:${otp}`).digest('hex');
    if (expected !== row.code_hash) {
      await query('UPDATE user_email_otps SET attempts=attempts+1 WHERE id=?', [row.id]);
      return send(res, null, 'Incorrect verification code.', 400);
    }
    await query('UPDATE users SET email_verified=TRUE WHERE id=?', [row.user_id]);
    await query('DELETE FROM user_email_otps WHERE email=? AND purpose=?', [email, 'register']);
    const users: any[] = await query('SELECT * FROM users WHERE id=? LIMIT 1', [row.user_id]);
    if (!users[0]) return send(res, null, 'Account not found.', 404);
    const token = jwt.sign({ sub: users[0].id }, JWT_SECRET, { expiresIn: '7d' });
    return send(res, { token, access_token: token, user: safeUser(users[0]) }, 'Email verified successfully.');
  } catch (e) { next(e); }
});
app.post('/api/auth/resend-otp', async (req, res, next) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const users: any[] = await query('SELECT id,email_verified FROM users WHERE email=? LIMIT 1', [email]);
    if (!users[0]) return send(res, null, 'No account exists for that email address.', 404);
    if (users[0].email_verified) return send(res, null, 'This email is already verified.', 400);
    await deliverOtp(email, users[0].id, 'register');
    return send(res, { email }, 'A new verification code was sent to your email.');
  } catch (e: any) { send(res, null, e?.message || 'Could not send verification email.', 503); }
});
app.post('/api/auth/google', (_req, res) => send(res, null, 'Google sign-in requires Google OAuth client configuration.', 501));
app.post('/api/auth/google/verify-otp', (_req, res) => send(res, null, 'Google sign-in verification is not configured.', 501));

app.post('/api/records', auth, async (req, res, next) => {
  try {
    const { type, payload } = req.body || {};
    if (!type || payload === undefined) return send(res, null, 'Record type and payload are required.', 400);
    await query('INSERT INTO app_records (user_id,record_type,payload) VALUES (?,?,?)', [(req as any).user.sub, String(type).slice(0,80), JSON.stringify(payload)]);
    send(res, null, 'Record saved to Aiven MySQL.', 201);
  } catch (e) { next(e); }
});
app.post('/api/translate', async (req, res) => {
  try { const { text, targetLanguage = 'English' } = req.body || {}; if (!text) return send(res, { text: '' }); const translated = await ai(`Translate the following UI text into ${targetLanguage}. Return only the translation and preserve placeholders.\n\n${text}`); send(res, { text: translated, translation: translated }); }
  catch (e: any) { send(res, null, e.message || 'Translation failed.', 503); }
});
app.post('/api/soil/analyze', auth, async (req, res, next) => {
  try {
    const body = req.body || {};
    const params = body.parameters || {};
    const metadata = body.metadata || {};
    const values: Record<string, number | null> = {};
    for (const key of ['nitrogen','phosphorus','potassium','ph','organicCarbon','sulphur','zinc','iron','manganese','copper','boron','electricalConductivity']) {
      const raw = params[key];
      values[key] = raw === null || raw === undefined || raw === '' ? null : Number(raw);
      if (values[key] !== null && (!Number.isFinite(values[key] as number) || (values[key] as number) < 0)) return send(res, null, `Invalid soil measurement: ${key}.`, 400);
    }
    if (['nitrogen','phosphorus','potassium','ph','organicCarbon'].some(k => values[k] === null)) return send(res, null, 'N, P, K, pH and Organic Carbon values are required. Missing values are not filled with estimates.', 400);
    const userId = String((req as any).user.sub);
    const id = randomUUID();
    await query(`INSERT INTO soil_analysis (id,user_id,sample_name,source,nitrogen,phosphorus,potassium,ph,organic_carbon,sulphur,zinc,iron,manganese,copper,boron,electrical_conductivity,raw_ocr_data)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id,userId,metadata.sampleId || metadata.fileName || 'Soil report',body.source || 'manual',values.nitrogen,values.phosphorus,values.potassium,values.ph,values.organicCarbon,values.sulphur,values.zinc,values.iron,values.manganese,values.copper,values.boron,values.electricalConductivity,JSON.stringify({values,metadata})]);
    let analysis: any = { status: 'not_generated', summary: 'Measurements were saved. AI interpretation is unavailable until Gemini is configured and reachable.', limitations: ['No health score or deficiency classification has been generated.'], nextSteps: ['Review the saved measurements with your soil laboratory or local KVK.'] };
    try {
      analysis = parseJsonText(await ai(`Review these measured soil laboratory values only. Do not invent missing data, health scores, thresholds, crop yields, fertilizer dosages, or market prices. State that values are stored and farmer-reviewed, distinguish measurement from interpretation, and return JSON with keys summary (string), limitations (array of strings), nextSteps (array of strings). Measurements: ${JSON.stringify(values)}. Metadata: ${JSON.stringify({soilType:metadata.soilTexture,location:metadata.location,season:metadata.season})}`,
        'You are an Indian agricultural decision-support assistant. Return valid JSON only. Do not claim a lab diagnosis.'));
    } catch { /* Saving verified measurements must not be reported as failed merely because AI interpretation is unavailable. */ }
    return send(res, { analysisId:id, result:analysis, analysis, values, metadata, source:body.source || 'manual' }, 'Reviewed soil measurements saved to MySQL.', 201);
  } catch (e: any) { if (e?.message?.includes('Gemini')) return send(res, null, e.message, 503); next(e); }
});
app.post('/api/soil/upload', auth, async (req, res) => {
  try {
    const { fileName, fileType, fileSize, fileBase64 } = req.body || {};
    if (typeof fileBase64 !== 'string' || !fileBase64) return send(res, null, 'Upload a PDF or image file to extract.', 400);
    const mime = String(fileType || '').toLowerCase();
    if (!['application/pdf','image/jpeg','image/jpg','image/png'].includes(mime)) return send(res, null, 'Only PDF, JPG, JPEG and PNG soil reports are supported.', 400);
    const encoded = fileBase64.includes(',') ? fileBase64.slice(fileBase64.indexOf(',') + 1) : fileBase64;
    const bytes = Buffer.from(encoded, 'base64');
    if (!bytes.length || bytes.length > 10 * 1024 * 1024) return send(res, null, 'File is empty or exceeds the 10 MB limit.', 400);
    const mimeType = mime === 'image/jpg' ? 'image/jpeg' : mime;
    const raw = await ai(`Extract only values explicitly printed in this soil laboratory report. Never infer, calculate, or fill missing measurements. If a field is absent or unreadable, use null. Return valid JSON with keys farmerName, sampleId, labName, district, soilTexture, testDate, averageConfidence (0-100 or null), and parameters. parameters must contain nitrogen, phosphorus, potassium, ph, organicCarbon, sulphur, zinc, iron, manganese, copper, boron, electricalConductivity; each parameter is {value:number|null, unit:string, reportedUnit:string|null, confidence:number|null}. Use standard units only when explicitly reported; do not convert units. File name: ${String(fileName || 'soil-report')}.`,
      'You are a document OCR extractor, not an agronomist. Return JSON only. Null means not found or unreadable. Do not add example or placeholder values.',
      [{ inlineData: { mimeType, data: bytes.toString('base64') } }] as any);
    const extracted = parseJsonText(raw);
    const labels: Record<string, [string,string,string]> = {
      nitrogen:['Nitrogen','N','kg/ha'], phosphorus:['Phosphorus','P','kg/ha'], potassium:['Potassium','K','kg/ha'],
      ph:['Soil pH','pH',''], organicCarbon:['Organic Carbon','OC','%'], sulphur:['Sulphur','S','ppm'],
      zinc:['Zinc','Zn','ppm'], iron:['Iron','Fe','ppm'], manganese:['Manganese','Mn','ppm'], copper:['Copper','Cu','ppm'],
      boron:['Boron','B','ppm'], electricalConductivity:['Electrical Conductivity','EC','dS/m']
    };
    const parameters: any = {};
    for (const [key, [name,symbol,unit]] of Object.entries(labels)) {
      const item = extracted.parameters?.[key] || {};
      const n = item.value === null || item.value === undefined || item.value === '' ? null : Number(item.value);
      const validValue = n !== null && Number.isFinite(n) && n >= 0;
      parameters[key] = { name, symbol, unit: item.unit || unit, value: validValue ? n : null,
        status: validValue ? 'Needs farmer review' : 'Not found in report', reportedUnit: item.reportedUnit ?? null };
    }
    const found = Object.values(parameters).filter((p:any) => p.value !== null).length;
    if (!found) return send(res, null, 'No soil measurements could be reliably extracted. Try a clearer report. No sample values were created.', 422);
    const reportId = randomUUID();
    const report = {
      reportId, uploadId: randomUUID(), extractionStatus: found === 12 ? 'complete' : 'partial', extractedCount: found,
      missingFields: Object.entries(parameters).filter(([,p]:any) => p.value === null).map(([k]) => k),
      fileName: String(fileName || 'soil-report'), fileType: mimeType, fileSize: String(fileSize || `${(bytes.length/1024/1024).toFixed(2)} MB`),
      sampleId: extracted.sampleId || undefined, labName: extracted.labName || undefined, farmerName: extracted.farmerName || undefined,
      district: extracted.district || undefined, soilTexture: extracted.soilTexture || undefined,
      metadata: { farmerName: extracted.farmerName, sampleId: extracted.sampleId, labName: extracted.labName, district: extracted.district, soilType: extracted.soilTexture, testDate: extracted.testDate },
      parameters, averageConfidence: extracted.averageConfidence !== null && extracted.averageConfidence !== undefined && Number.isFinite(Number(extracted.averageConfidence)) ? Number(extracted.averageConfidence) : null,
      extractedAt: new Date().toISOString()
    };
    return send(res, { extractedReport: report }, 'OCR extraction completed. Review every extracted value before saving.');
  } catch (e: any) {
    console.error('[soil OCR]', e?.message || 'extraction failed');
    return send(res, null, e?.message || 'Soil OCR failed. No sample values were used.', 503);
  }
});
app.get('/api/soil/history', auth, async (req, res, next) => {
  try { const rows = await query('SELECT * FROM soil_analysis WHERE user_id=? ORDER BY created_at DESC LIMIT 100', [(req as any).user.sub]); send(res, rows); } catch (e) { next(e); }
});
app.get('/api/soil/reports/:report_id/file', auth, (_req, res) => send(res, null, 'Soil report file storage is not configured in this Node.js version.', 501));
function soilPayload(row: any) {
  return { soilReportId: row.id, sampleName: row.sample_name, source: row.source,
    nitrogen: row.nitrogen === null ? null : Number(row.nitrogen), phosphorus: row.phosphorus === null ? null : Number(row.phosphorus),
    potassium: row.potassium === null ? null : Number(row.potassium), ph: row.ph === null ? null : Number(row.ph),
    organicCarbon: row.organic_carbon === null ? null : Number(row.organic_carbon), sulphur: row.sulphur === null ? null : Number(row.sulphur),
    zinc: row.zinc === null ? null : Number(row.zinc), iron: row.iron === null ? null : Number(row.iron),
    manganese: row.manganese === null ? null : Number(row.manganese), copper: row.copper === null ? null : Number(row.copper),
    boron: row.boron === null ? null : Number(row.boron), electricalConductivity: row.electrical_conductivity === null ? null : Number(row.electrical_conductivity) };
}

async function cropRoute(req: Request, res: Response) {
  try {
    const b = req.body || {};
    const userId = String((req as any).user.sub);
    const reportId = String(b.soilReportId || "");

    if (!reportId) {
      return send(
        res,
        null,
        "Select a saved soil report before generating recommendations.",
        400
      );
    }

    const report = await getVerifiedSoilReport(reportId, userId);
    const soil: any = soilPayload(report);

    const required = [
      "nitrogen",
      "phosphorus",
      "potassium",
      "ph",
      "organicCarbon",
    ];

    if (
      required.some(
        (key) =>
          soil[key] === null ||
          soil[key] === undefined ||
          !Number.isFinite(Number(soil[key]))
      )
    ) {
      return send(
        res,
        null,
        "The selected soil report is missing required measurements. Select a complete report.",
        422
      );
    }

    // Read the soil texture saved with the report, when available.
    let reportMetadata: any = {};

    try {
      const raw = report.raw_ocr_data;
      const parsed =
        typeof raw === "string" ? JSON.parse(raw) : raw;

      reportMetadata = parsed?.metadata || {};
    } catch {
      reportMetadata = {};
    }

    // Prefer the verified report's texture over an unrelated UI default.
   
const reportSoilType = String(
  reportMetadata.soilType ||
  reportMetadata.soilTexture ||
  ""
).trim();

// Prefer the saved report's soil texture over a UI default.
const requestedSoilType = String(b.soilType || "").trim();

if (!reportSoilType && !requestedSoilType) {
  return send(
    res,
    null,
    "Soil texture is missing from the saved report. Verify the soil type before requesting recommendations.",
    422
  );
}

if (
  reportSoilType &&
  requestedSoilType &&
  reportSoilType.toLowerCase() !== requestedSoilType.toLowerCase()
) {
  console.warn("[crop recommendation] Soil texture mismatch", {
    reportId,
    reportSoilType,
    requestedSoilType,
  });
}

const soilType = reportSoilType || requestedSoilType;

const soilTypeSource = reportSoilType
  ? "saved-soil-report"
  : "farmer-provided-not-verified-in-report";


    const input = {
      soilReportId: soil.soilReportId,
measurements: {
  nitrogen: soil.nitrogen,
  phosphorus: soil.phosphorus,
  potassium: soil.potassium,
  ph: soil.ph,
  organicCarbon: soil.organicCarbon,
  sulphur: soil.sulphur,
  zinc: soil.zinc,
  iron: soil.iron,
  manganese: soil.manganese,
  copper: soil.copper,
  boron: soil.boron,
  electricalConductivity: soil.electricalConductivity,
},
soilType,
soilTypeSource,

      season,
      location: location || "Not provided",
      irrigationAvailability:
        irrigationAvailability || "Not provided",
      previousCrop: previousCrop || "Not provided",
      sowingMonth: sowingMonth || "Not provided",
      farmArea:
        Number.isFinite(Number(b.farmArea)) &&
        Number(b.farmArea) > 0
          ? Number(b.farmArea)
          : null,
    };

    const prompt = `
Recommend Indian crops for the supplied farm conditions.

VERIFIED INPUTS:
${JSON.stringify(input, null, 2)}

MANDATORY RULES:
1. Use the supplied soil measurements exactly as written.
2. Do not assume the farm has black soil unless soilType says
   black soil. If soilType is Sandy Loam, evaluate it as Sandy Loam.
3. Never invent soil measurements, irrigation, previous crops,
   farm history, local market prices, or expected yields.
4. Evaluate each crop separately for soil texture, pH, nutrient
   suitability, organic carbon, season, water availability,
   location and sowing month.
5. Do not use a fixed list or fixed ranking. Choose crops based
   on the current inputs, and change rankings when the evidence
   supports a change.
6. Return at most five distinct crops. Return fewer if the
   available evidence does not support five suitable choices.
7. Suitability is a heuristic compatibility score from 0 to 100.
   It is NOT yield probability, a success guarantee, or a validated
   scientific measurement.
8. Score according to the evidence. Do not inflate scores to reach
   80-95. Low compatibility must have a low score.
9. Reasons, limiting factors, scoreMeaning and scoreFactors must
   agree with the score and supplied measurements.
10. Do not label a nutrient deficient using its number alone unless
    a suitable crop-specific reference and compatible units support it.
11. Unknown information must be identified in missingInformation.
12. Do not repeat a crop under alternate names.
13. Do not claim a crop is suitable for conditions that contradict
    the supplied inputs.
14. Return JSON only, with no Markdown fences.
15. Treat soilTypeSource as provenance. A farmer-provided soil type
    is not a verified measurement from the saved soil report.
16. Never assume measurement units, laboratory methods, or conversions
    that are not supplied by the saved report.
17. Do not infer nutrient deficiency or sufficiency from raw numbers
    unless units and appropriate agronomic reference ranges are known.
18. Separate measured soil facts from farmer-provided farm conditions.
    Mark unknown or unverified information explicitly.
19. If the available evidence is insufficient to rank a crop confidently,
    explain the uncertainty and lower confidence rather than inflating scores.


Return this structure:
{
  "summaryNote": "Explanation grounded in the supplied inputs",
  "recommendations": [
    {
      "cropName": "Common crop name",
      "category": "Cereal, Pulse, Oilseed, Cash Crop, Vegetable, Horticulture, Plantation, Spices, or Other",
      "origin": "National or International",
      "scientificName": "Scientific name",
      "suitability": 0,
      "harvestDuration": "Duration or unknown",
      "season": "Suitable season",
      "waterNeed": "Water requirement",
      "reasons": [],
      "limitingFactors": [],
      "missingInformation": [],
      "scoreMeaning": "Meaning consistent with the score",
      "scoreFactors": {
        "soilTypeMatch": "Assessment",
        "phMatch": "Assessment",
        "nutrientAssessment": "Assessment or unknown",
        "seasonMatch": "Assessment",
        "waterMatch": "Assessment",
        "regionalMatch": "Assessment"
      },
      "observedOptionalSoilMeasurements": {},
      "details": {
        "idealSoilPh": "Range or unknown",
        "commonVarieties": [],
        "agronomyTips": []
      }
    }
  ]
}

Sort recommendations by suitability, highest first.
`;

    const raw = parseJsonText(
      await ai(
        prompt,
        "You are a cautious Indian agronomy decision-support assistant. Follow the supplied evidence. Never substitute a default soil type or fixed crop ranking. Return valid JSON only."
      )
    );

    if (!Array.isArray(raw?.recommendations)) {
      throw new Error(
        "Crop recommendation response is missing its recommendations array."
      );
    }

    const seen = new Set<string>();

    const recommendations = raw.recommendations
      .filter((item: any) => {
        if (
          !item ||
          typeof item.cropName !== "string" ||
          !item.cropName.trim() ||
          typeof item.suitability !== "number" ||
          !Number.isFinite(item.suitability) ||
          item.suitability < 0 ||
          item.suitability > 100
        ) {
          return false;
        }

        const key = item.cropName.trim().toLowerCase();

        if (seen.has(key)) return false;
        seen.add(key);

        return true;
      })
      .map((item: any) => ({
        ...item,
        cropName: item.cropName.trim(),
        reasons: Array.isArray(item.reasons) ? item.reasons : [],
        limitingFactors: Array.isArray(item.limitingFactors)
          ? item.limitingFactors
          : [],
        missingInformation: Array.isArray(item.missingInformation)
          ? item.missingInformation
          : [],
      }))
      .sort(
        (a: any, b: any) => b.suitability - a.suitability
      )
      .slice(0, 5);

    if (!recommendations.length) {
      return send(
        res,
        null,
        "No valid crop recommendations could be produced for these inputs. Review the soil report and try again.",
        422
      );
    }

    return send(
      res,
      {
        soilReportId: soil.soilReportId,
        inputUsed: input,
        summaryNote:
          typeof raw.summaryNote === "string"
            ? raw.summaryNote
            : "Recommendations are ranked by heuristic compatibility.",
        recommendations,
        scoringDisclaimer:
          "Compatibility scores are heuristic assessments, not yield probabilities or guarantees.",
      },
      "Crop recommendations generated using the selected saved soil report."
    );
  } catch (e: any) {
    console.error("[crop recommendation]", e?.message || "failed");

    return send(
      res,
      null,
      e?.message || "Crop recommendations are unavailable.",
      e?.message?.includes("Gemini") ? 503 : 422
    );
  }
}
async function fertilizerRoute(req: Request, res: Response) {
  try {
    const b=req.body||{}, soil:any=soilPayload(await getVerifiedSoilReport(String(b.soilReportId||''),String((req as any).user.sub)));
    const required=['nitrogen','phosphorus','potassium','ph'];
    if(required.some(k=>soil[k]===null)) return send(res,null,'Selected soil report is missing required nutrient values.',422);
    const raw=parseJsonText(await ai(`Return JSON {nutrientConditions:{nitrogen:{value:number|null,status:"Low"|"Medium"|"Good"|"High"|"Unknown",note:string},phosphorus:{value:number|null,status:"Low"|"Medium"|"Good"|"High"|"Unknown",note:string},potassium:{value:number|null,status:"Low"|"Medium"|"Good"|"High"|"Unknown",note:string},ph:{value:number|null,status:"Low"|"Medium"|"Good"|"High"|"Unknown",note:string}},recommendations:[{fertilizer:string,purpose:string,category:string,applicationTiming:string,applicationMethod:string,precautions:string,quantity:string|null}],soilHealthAdvisory:string}. Base advice on this saved soil report and crop only. Do not prescribe exact fertilizer dose unless soil test and local recommendation support it; otherwise quantity must be null and explain local soil-test/KVK confirmation. Inputs: ${JSON.stringify({soil,crop:b.targetCrop,area:b.farmArea,growthStage:b.growthStage,previouslyApplied:b.previouslyAppliedFertilizers})}`,
      'Indian agricultural extension advisor. Return JSON only. No invented lab values, product prices, or blanket chemical dosages.'));
    raw.soilReportId=soil.soilReportId;
    if(!raw.nutrientConditions || !Array.isArray(raw.recommendations)) throw new Error('Fertilizer recommendation response incomplete.');
    return send(res,raw,'Fertilizer guidance generated from saved soil report.');
  } catch(e:any){return send(res,null,e?.message||'Fertilizer guidance unavailable.',e?.message?.includes('Gemini')?503:422);}
}
async function pesticideRoute(req: Request, res: Response) {
  try {
    const b=req.body||{}, soil:any=soilPayload(await getVerifiedSoilReport(String(b.soilReportId||''),String((req as any).user.sub)));
    if(!b.crop||!b.growthStage||!b.observedProblem) return send(res,null,'Crop, growth stage and observed symptoms are required.',400);
    const raw=parseJsonText(await ai(`Return JSON {id:string,soilReportId:string,recommendations:[{recommendation:string,when:string,ipmSteps:[{action:string,when:string,why:string,source:string}],safetyPrecautions:string[]}]}. The farmer reports the symptoms; do not claim a confirmed diagnosis. Prioritize scouting, cultural, mechanical and biological IPM. Do not prescribe chemical product/dose; recommend local KVK confirmation and label-approved options if needed. Soil report context: ${JSON.stringify(soil)}. Crop: ${b.crop}; stage: ${b.growthStage}; reported issue: ${b.observedProblem}; location: ${b.location||'not supplied'}.`));
    raw.soilReportId=soil.soilReportId;
    if(!Array.isArray(raw.recommendations)||!raw.recommendations[0]) throw new Error('IPM response incomplete.');
    return send(res,raw,'IPM guidance generated using the selected soil report and reported symptoms.');
  }catch(e:any){return send(res,null,e?.message||'IPM guidance unavailable.',e?.message?.includes('Gemini')?503:422);}
}
app.post('/api/crop/recommend', auth, cropRoute);
app.post('/api/fertilizer/recommend', auth, fertilizerRoute);
app.post('/api/pesticide/recommend', auth, pesticideRoute);
app.post('/api/yield/predict', auth, async (req,res) => {
  try {
    const b=req.body||{}, soil:any=soilPayload(await getVerifiedSoilReport(String(b.soilReportId||''),String((req as any).user.sub)));
    const result=parseJsonText(await ai(`Provide a cautious crop yield range only if there is enough location, crop, season, irrigation and agronomic context. Return JSON {estimate:number|null,unit:string,confidence:string,limitations:string[]}. Do not invent farm-specific history or claim precision. Soil: ${JSON.stringify(soil)}; user inputs: ${JSON.stringify(b)}`,'Agronomy advisor. JSON only. If evidence is insufficient, estimate must be null.'));
    return send(res,{result,soilReportId:soil.soilReportId});
  }catch(e:any){return send(res,null,e?.message||'Yield prediction unavailable.',e?.message?.includes('Gemini')?503:422);}
});
app.get('/api/market/prices', auth, (_req,res) => send(res, [], 'No live market-price provider is configured; no prices are displayed.'));
app.post('/api/profit/calculate', auth, (req,res) => {
  const b=req.body||{};
  const required=['expectedYield','marketPrice','totalCost'];
  if(required.some(k=>b[k]===undefined||b[k]===''||!Number.isFinite(Number(b[k]))||Number(b[k])<0)) return send(res,null,'Enter your actual yield, selling price and total cost. No default figures are used.',400);
  const revenue=Number(b.expectedYield)*Number(b.marketPrice),cost=Number(b.totalCost);
  send(res,{revenue,cost,profit:revenue-cost,roi:cost>0?((revenue-cost)/cost)*100:null,source:'user-entered'},'Calculated from user-entered figures.');
});
app.post('/api/scenario/simulate', auth, async (req,res) => {
  try {
    const scenarios=req.body?.scenarios;
    const soil=soilPayload(await getVerifiedSoilReport(String(req.body?.soilReportId||''),String((req as any).user.sub)));
    if(!Array.isArray(scenarios)||!scenarios.length) return send(res,null,'Add scenarios using your actual soil report and farm estimates.',400);
    const result=[];
    for(const s of scenarios){
      const nums=['area','expectedYield','sellingPrice','seedCost','fertilizerCost','pesticideCost','labourCost','otherCosts'];
      if(!s.crop?.trim()||nums.some(k=>s[k]===undefined||!Number.isFinite(Number(s[k]))||Number(s[k])<0)||Number(s.area)<=0) return send(res,null,'Each scenario requires crop, positive area and actual non-negative yield, price and cost inputs.',400);
      const totalCost=Number(s.area)*(Number(s.seedCost)+Number(s.fertilizerCost)+Number(s.pesticideCost)+Number(s.labourCost)+Number(s.otherCosts));
      const totalRevenue=Number(s.area)*Number(s.expectedYield)*Number(s.sellingPrice);
      result.push({id:s.id,name:s.name,crop:s.crop,totalCost,totalRevenue,netProfit:totalRevenue-totalCost,roiPercentage:totalCost>0?((totalRevenue-totalCost)/totalCost)*100:0});
    }
    return send(res,{scenarios:result,soilReportId:soil.soilReportId,soilContext:soil,source:'saved soil report plus user-entered estimates',disclaimer:'Financial outputs are arithmetic comparisons of your entered estimates. Soil measurements are attached as context; they do not imply a validated yield forecast.'},'Scenarios compared using the selected soil report and entered values.');
  } catch(e:any){ return send(res,null,e?.message||'Scenario comparison unavailable.',e?.message?.includes('Gemini')?503:422); }
});
app.get('/api/reports', auth, async (req,res,next) => {
  try { const rows = await query('SELECT id,record_type,payload,created_at FROM app_records WHERE user_id=? ORDER BY created_at DESC LIMIT 100', [(req as any).user.sub]); send(res, rows); } catch (e) { next(e); }
});
async function aiRoute(req: Request, res: Response, title: string) {
  try {
    const body = req.body || {};
    let soil: any = null;
    if (body.soilReportId) soil = soilPayload(await getVerifiedSoilReport(String(body.soilReportId), String((req as any).user.sub)));
    if (title === 'personalized farming strategy' && !soil) return send(res, null, 'Select a saved soil report before generating a farm strategy.', 400);
    const result = await ai(`Provide ${title} for an Indian farmer. Use only the supplied facts and selected saved soil measurements. Do not invent missing values, prices, yields, fertilizer doses, diagnoses or certainty. Clearly label uncertainty. Input: ${JSON.stringify({body,soil})}`,
      'Krishibhoomi agricultural decision-support assistant. Return concise plain text or structured JSON; never fabricate data.');
    return send(res, { result, text: result, soilReportId: soil?.soilReportId || null }, `${title} completed using supplied data.`);
  } catch (e: any) { return send(res, null, e?.message || `${title} unavailable.`, e?.message?.includes('Gemini') ? 503 : 422); }
}
app.post('/api/strategy/generate', auth, (req,res) => aiRoute(req,res,'personalized farming strategy'));
app.post('/api/strategy/ask-ai', auth, (req,res) => aiRoute(req,res,'answer to the farmer question'));

if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.use((_req, res) => res.sendFile('index.html', { root: 'dist' }));
}
app.use((req, res) => send(res, null, `Route not found: ${req.method} ${req.path}`, 404));
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err?.code === 'ER_DUP_ENTRY') return send(res, null, 'This record already exists.', 409);
  console.error('[API]', err?.code || err?.name || 'Error');
  send(res, null, process.env.NODE_ENV === 'production' ? 'The service could not complete this request.' : (err?.message || 'Internal server error.'), 500);
});
async function initializeDatabase() {
  if (!db()) return;
  await query(`CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY, name VARCHAR(160) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL, google_sub VARCHAR(255) NULL UNIQUE, location VARCHAR(255) NULL,
    farm_area DECIMAL(12,2) NULL, soil_type VARCHAR(160) NULL, preferred_crop VARCHAR(160) NULL,
    preferred_language VARCHAR(16) NOT NULL DEFAULT 'en', avatar_url TEXT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  await query(`CREATE TABLE IF NOT EXISTS app_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(64) NOT NULL, record_type VARCHAR(80) NOT NULL,
    payload JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_records_user_type_created (user_id, record_type, created_at),
    CONSTRAINT fk_kbnode_app_records_user_v1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await query(`CREATE TABLE IF NOT EXISTS user_email_otps (
    id VARCHAR(64) PRIMARY KEY, user_id VARCHAR(64) NOT NULL, email VARCHAR(255) NOT NULL,
    purpose VARCHAR(32) NOT NULL, code_hash CHAR(64) NOT NULL, expires_at DATETIME NOT NULL,
    attempts INT NOT NULL DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email_otp (email,purpose,created_at),
    CONSTRAINT fk_kbnode_email_otps_user_v1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
  await query(`CREATE TABLE IF NOT EXISTS soil_analysis (
    id VARCHAR(64) PRIMARY KEY, user_id VARCHAR(64) NOT NULL, sample_name VARCHAR(255) NULL,
    source VARCHAR(32) NULL, health_score DECIMAL(8,2) NULL, health_rating VARCHAR(64) NULL,
    nitrogen DECIMAL(12,3) NULL, phosphorus DECIMAL(12,3) NULL, potassium DECIMAL(12,3) NULL,
    ph DECIMAL(8,3) NULL, organic_carbon DECIMAL(12,4) NULL, sulphur DECIMAL(12,4) NULL,
    zinc DECIMAL(12,4) NULL, iron DECIMAL(12,4) NULL, manganese DECIMAL(12,4) NULL,
    copper DECIMAL(12,4) NULL, boron DECIMAL(12,4) NULL, electrical_conductivity DECIMAL(12,4) NULL,
    raw_ocr_data JSON NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_soil_user_created (user_id, created_at),
    CONSTRAINT fk_kbnode_soil_analysis_user_v1 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);
}
initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`Krishibhoomi running at http://localhost:${PORT}`));
}).catch((error) => {
  console.error('[Startup] Database initialization failed:', error?.code || error?.name || 'Error');
  process.exit(1);
});
