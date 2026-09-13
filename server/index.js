/*
Simple server to receive an image (multipart/form-data under field `file`) and
call Google Gemini Vision (free tier) to identify the object. Returns JSON
{ name, scientificName, confidence, keyInfo }.

Usage:
  - Set environment variable GEMINI_API_KEY (get a free key at https://aistudio.google.com/apikey)
  - Run: npm install && npm start
  - Call POST /scan with form-data file=... from the mobile app

Note: For local testing from a phone use the machine LAN IP (e.g. http://192.168.1.10:5000/scan)
*/

const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`);
  next();
});
const upload = multer({ storage: multer.memoryStorage() });

const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.warn('WARNING: GEMINI_API_KEY not set. The server will still run but Gemini calls will fail.');
}
const genAI = new GoogleGenerativeAI(GEMINI_KEY);
// "gemini-2.5-flash" (and the "latest" alias, which still resolves to it) is
// no longer available to this API key; Google's own error message points to
// this replacement model.
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

app.get('/', (req, res) => res.json({ ok: true, info: 'scan server' }));

app.post('/scan', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'missing file' });

  try {
    const mime = req.file.mimetype || 'image/jpeg';
    const b64 = req.file.buffer.toString('base64');

    const prompt =
      'Identifie le fruit ou la matière première agricole principale visible sur cette photo. ' +
      'Réponds uniquement avec un JSON strict de la forme ' +
      '{"name": string, "scientificName": string, "confidence": number, "keyInfo": string[]} ' +
      'où name est le nom courant en français, scientificName est le nom scientifique latin, ' +
      'confidence est comprise entre 0 et 1, et keyInfo est une liste de 3 à 5 phrases courtes en français ' +
      "décrivant la valeur nutritionnelle, les saisons de récolte et les zones de production principales.";

    const result = await model.generateContent([
      { inlineData: { mimeType: mime, data: b64 } },
      { text: prompt },
    ]);

    let text = result.response.text().trim();

    // Try to extract a JSON blob from text (Gemini sometimes wraps it in ```json fences)
    let parsed = null;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonStr = text.slice(jsonStart, jsonEnd + 1);
        parsed = JSON.parse(jsonStr);
      }
    } catch (e) {
      // ignore
    }

    if (parsed && parsed.name) {
      return res.json({
        name: parsed.name,
        scientificName: parsed.scientificName ?? '',
        confidence: parsed.confidence ?? 0.9,
        keyInfo: Array.isArray(parsed.keyInfo) ? parsed.keyInfo : [],
        raw: text,
      });
    }

    // Fallback: return first line as name
    const firstLine = text.split('\n').find(Boolean) || 'Produit inconnu';
    return res.json({ name: firstLine, scientificName: '', confidence: 0.6, keyInfo: [], raw: text });
  } catch (err) {
    console.error('scan error', err);
    const message = err?.message || '';
    const isQuotaError = err?.status === 429 || /429|quota/i.test(message);
    if (isQuotaError) {
      return res.status(429).json({
        error: 'quota_exceeded',
        detail: "Quota quotidien de l'API IA atteint. Réessaie plus tard ou demain.",
      });
    }
    return res.status(500).json({ error: 'scan_failed', detail: message });
  }
});

const port = process.env.PORT || 5050;
app.listen(port, () => console.log('scan server listening on', port));

