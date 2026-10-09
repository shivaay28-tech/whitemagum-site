import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleInquiry, tooMany } from './inquiry.js';

const app = express();
const PORT = process.env.PORT || 3001;
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

app.set('trust proxy', 1); // correct client IP behind nginx / hosting proxy
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(express.json({ limit: '10kb' }));

app.post('/api/inquiry', async (req, res) => {
  if (tooMany(req.ip || 'unknown')) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again later.' });
  }
  const result = await handleInquiry(req.body);
  res.status(result.status).json(result.body);
});

// Serve the built React app in production
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
