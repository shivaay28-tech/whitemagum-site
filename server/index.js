import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests. Please try again later.' },
});

const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

app.post('/api/inquiry', limiter, async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot: bots fill this, humans never see it

  const name = clean(b.name, 100);
  const company = clean(b.company, 120);
  const email = clean(b.email, 150);
  const phone = clean(b.phone, 30);
  const service = clean(b.service, 60);
  const message = String(b.message ?? '').trim().slice(0, 3000);

  if (!name || !EMAIL.test(email) || message.length < 5) {
    return res.status(400).json({ ok: false, error: 'Please fill in your name, a valid email and a message.' });
  }

  try {
    await transporter.sendMail({
      from: `"Whitemagum Website" <${process.env.SMTP_USER}>`,
      to: process.env.INQUIRY_TO,
      replyTo: email,
      subject: `Website inquiry: ${service || 'General'} (${name})`,
      text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ ok: false, error: 'Could not send your inquiry. Please email us directly.' });
  }
});

// Serve the built React app in production
app.use(express.static(dist));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
