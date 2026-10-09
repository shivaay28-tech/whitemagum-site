import nodemailer from 'nodemailer';

const clean = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map();

export function tooMany(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_HITS) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  return false;
}

export async function handleInquiry(body) {
  const b = body || {};
  if (b.website) return { status: 200, body: { ok: true } };

  const name = clean(b.name, 100);
  const company = clean(b.company, 120);
  const email = clean(b.email, 150);
  const phone = clean(b.phone, 30);
  const service = clean(b.service, 60);
  const message = String(b.message ?? '').trim().slice(0, 3000);

  if (!name || !EMAIL.test(email) || message.length < 5) {
    return { status: 400, body: { ok: false, error: 'Please fill in your name, a valid email and a message.' } };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: `"Whitemagum Website" <${process.env.SMTP_USER}>`,
      to: process.env.INQUIRY_TO,
      replyTo: email,
      subject: `Website inquiry: ${service || 'General'} (${name})`,
      text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\n${message}`,
    });
    return { status: 200, body: { ok: true } };
  } catch (err) {
    console.error('Mail error:', err.message);
    return { status: 500, body: { ok: false, error: 'Could not send your inquiry. Please email us directly.' } };
  }
}
