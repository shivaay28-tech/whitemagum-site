import { useState } from 'react';

const NAV = [['about', 'About'], ['services', 'Services'], ['process', 'Process'], ['credentials', 'Licensing'], ['faq', 'FAQ'], ['contact', 'Contact']];

const SERVICES = [
  ['Managed IT support', 'Helpdesk, device management, patching, backups and onsite visits across Dubai.', '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'],
  ['Cloud and migration', 'Microsoft 365, Google Workspace, Azure and AWS setup, migration and cost control.', '<path d="M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18H7z"/>'],
  ['Cybersecurity', 'Firewalls, endpoint protection, email security, staff awareness training and audits.', '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>'],
  ['Software development', 'Web apps, mobile apps, internal tools and integrations built to your spec.', '<path d="M8 8l-5 4 5 4M16 8l5 4-5 4M14 5l-4 14"/>'],
  ['Websites and e-commerce', 'Fast, bilingual English and Arabic websites with payment and SEO setup.', '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>'],
  ['Networking and hardware', 'Office Wi-Fi, structured cabling, CCTV, servers and hardware procurement.', '<rect x="3" y="3" width="18" height="6" rx="1"/><rect x="3" y="15" width="18" height="6" rx="1"/><path d="M7 6h.01M7 18h.01"/>'],
];

const STEPS = [
  ['Discovery call', 'We learn your setup, users and goals. Free and without obligation.'],
  ['Audit and proposal', 'You get a written scope, timeline and fixed price in AED.'],
  ['Onboarding', 'We document, secure and migrate, with minimal disruption to your team.'],
  ['Ongoing support', 'Monthly reports, regular reviews and a named account manager.'],
];

const COMPANY = {
  address: 'Office No. 512, 5th Floor, Al Khaleej Centre, Al Raffa, Dubai, UAE',
  phone: '+971 50 606 2316',
  tel: '+971506062316',
  email: 'info@whitemagum.ae',
  license: '1289734',
};
const CREDS = [
  ['Legal name', 'WHITE MAGUM INFORMATION TECHNOLOGY SOLUTIONS L.L.C'],
  ['Legal form', 'Limited Liability Company (LLC)'],
  ['Trade license number', '1289734'],
  ['Issuing authority', 'Department of Economy and Tourism, Dubai'],
  ['License activity', 'IT consultancy, web design, IT infrastructure, IT network services, computer systems and communication software design, computer systems housing, data entry, and social media application development and marketing'],
  ['Commercial register', '2253296'],
  ['DCCI membership', '514171'],
  ['Registered office', COMPANY.address],
  ['License issue and expiry', '24/01/2024 to 23/01/2027'],
  ['Ejari / tenancy contract', '0120260922006072 (01/10/2026 to 30/09/2027)'],
];

const FAQ = [
  ['Do you serve free zone and mainland companies?', 'Yes. We support companies in Dubai mainland and free zones. Tell us which one you are in and we will account for its rules.'],
  ['Is your pricing in AED and does it include VAT?', 'Quotes are in AED. VAT at the current UAE rate is shown as a separate line on every proposal and tax invoice.'],
  ['How is my data handled?', 'We only access what we need to deliver the service, under a signed confidentiality clause. See our Privacy Policy in the footer.'],
  ['Is there a long contract?', 'Support plans run on an agreed term, with notice terms written into your service agreement. Projects are fixed-scope with milestone payments.'],
];

function ContactForm() {
  const empty = { name: '', company: '', email: '', phone: '', service: SERVICES[0][0], message: '', website: '' };
  const [f, setF] = useState(empty);
  const [state, setState] = useState({ busy: false, msg: '', err: false });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setState({ busy: true, msg: '', err: false });
    try {
      const r = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(f),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'Something went wrong. Please try again.');
      setF(empty);
      setState({ busy: false, msg: 'Thanks, we received your inquiry and will reply within one business day.', err: false });
    } catch (x) {
      setState({ busy: false, msg: x.message, err: true });
    }
  }

  return (
    <form className="glass" onSubmit={submit}>
      <label htmlFor="n">Full name</label>
      <input id="n" value={f.name} onChange={set('name')} required maxLength={100} autoComplete="name" />
      <label htmlFor="c">Company name</label>
      <input id="c" value={f.company} onChange={set('company')} maxLength={120} autoComplete="organization" />
      <label htmlFor="e">Work email</label>
      <input id="e" type="email" value={f.email} onChange={set('email')} required autoComplete="email" />
      <label htmlFor="p">Phone</label>
      <input id="p" type="tel" value={f.phone} onChange={set('phone')} placeholder="+971" autoComplete="tel" />
      <label htmlFor="s">Service needed</label>
      <select id="s" value={f.service} onChange={set('service')}>
        {SERVICES.map(([t]) => <option key={t}>{t}</option>)}
      </select>
      <label htmlFor="m">How can we help?</label>
      <textarea id="m" rows="4" value={f.message} onChange={set('message')} required minLength={5} maxLength={3000} />
      <input className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set('website')} />
      <button className="btn" type="submit" disabled={state.busy}>{state.busy ? 'Sending...' : 'Send inquiry'}</button>
      <p className={'note' + (state.err ? ' err' : '')} role="status">{state.msg}</p>
    </form>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const go = () => setOpen(false);

  return (
    <>
      <div className="blobs" aria-hidden="true"><i /><i /><i /></div>

      <header>
        <nav className="nav glass" aria-label="Main">
          <a className="logo" href="#top"><b />Whitemagum</a>
          <button className="menu" aria-expanded={open} aria-controls="links" onClick={() => setOpen(!open)}>Menu</button>
          <div className={'links' + (open ? ' open' : '')} id="links">
            {NAV.map(([id, t]) => <a key={id} href={'#' + id} onClick={go}>{t}</a>)}
            <a className="btn" href="#contact" onClick={go}>Get a quote</a>
          </div>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="wrap grid">
            <div>
              <span className="badge glass"><i className="dot" />Registered IT company in Dubai, UAE</span>
              <h1>IT that keeps your Dubai business running.</h1>
              <p className="lead">Whitemagum IT Solutions provides managed IT support, cloud, cybersecurity and custom software for companies across the UAE. One team, clear pricing, fast response.</p>
              <div className="cta"><a className="btn" href="#contact">Book a free consultation</a><a className="btn ghost" href="#services">See our services</a></div>
            </div>
            <aside className="panel glass" aria-label="Company snapshot">
              <h3>Company snapshot</h3>
              <ul>
                <li>Based in<span>Dubai, United Arab Emirates</span></li>
                <li>Support hours<span>Sun to Fri, 9am to 6pm GST</span></li>
                <li>Emergency line<span>24/7 for support clients</span></li>
                <li>Languages<span>English, Arabic, Hindi, Urdu</span></li>
              </ul>
            </aside>
          </div>
          <div className="wrap">
            <div className="stats">
              {[['15 min', 'Target first response for critical tickets'], ['99.9%', 'Uptime target on managed cloud plans'], ['6', 'Core service lines under one contract'], ['AED', 'Transparent pricing, VAT shown separately']].map(([a, b]) => (
                <div className="stat glass" key={a}><strong>{a}</strong><span>{b}</span></div>
              ))}
            </div>
          </div>
        </section>

        <section id="about">
          <div className="wrap about">
            <div>
              <h2>About Whitemagum IT Solutions</h2>
              <p>We are a Dubai-based IT services company that helps small and mid-sized businesses, startups and free zone companies run on reliable, secure technology without hiring a full in-house team.</p>
              <p>We handle the everyday work: setting up offices, managing devices, securing networks, moving to the cloud and building the software your team needs. You get one point of contact and a written service agreement, so you always know what is covered.</p>
              <p>Our engineers work with UAE requirements in mind, including data protection rules, VAT invoicing and the needs of both mainland and free zone companies.</p>
              <a className="btn" href="#contact">Talk to our team</a>
            </div>
            <div className="vm">
              {[['Our mission', 'Make business IT simple, secure and predictable for companies in the UAE.'], ['Our approach', 'Plain language, fixed scopes, documented work and monthly reporting. No lock-in beyond the agreed term.'], ['Our promise', "If we can't solve it, we tell you early and bring in the right specialist."]].map(([t, d]) => (
                <div className="glass" key={t}><h3>{t}</h3><p style={{ margin: 0 }}>{d}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section id="services">
          <div className="wrap">
            <h2>What we do</h2>
            <p style={{ maxWidth: '60ch' }}>Pick one service or bundle them into a single monthly plan.</p>
            <div className="cols">
              {SERVICES.map(([t, d, icon]) => (
                <article className="card glass" key={t}>
                  <div className="ic"><svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: icon }} /></div>
                  <h3>{t}</h3><p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process">
          <div className="wrap">
            <h2>How we work</h2>
            <div className="steps">
              {STEPS.map(([t, d]) => <div className="step glass" key={t}><h3>{t}</h3><p style={{ margin: 0 }}>{d}</p></div>)}
            </div>
          </div>
        </section>

        <section id="credentials">
          <div className="wrap">
            <h2>Licensing and company details</h2>
            <p style={{ maxWidth: '62ch' }}>We operate as a licensed company in the UAE. Our registration details are listed below so you can verify them with the relevant authority.</p>
            <div className="creds">
              {CREDS.map(([k, v]) => <div className="cred glass" key={k}><small>{k}</small><strong>{v}</strong></div>)}
            </div>
          </div>
        </section>

        <section id="faq">
          <div className="wrap" style={{ maxWidth: 820 }}>
            <h2>Questions we get often</h2>
            {FAQ.map(([q, a]) => <details className="glass" key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
        </section>

        <section id="contact">
          <div className="wrap">
            <h2>Get in touch</h2>
            <div className="contact">
              <div className="info glass">
                <h3>Contact details</h3>
                <p><strong>Address</strong><br />{COMPANY.address}</p>
                <p><strong>Phone</strong><br /><a href={'tel:' + COMPANY.tel}>{COMPANY.phone}</a></p>
                <p><strong>WhatsApp</strong><br /><a href={'https://wa.me/' + COMPANY.tel.replace('+', '')}>{COMPANY.phone}</a></p>
                <p><strong>Email</strong><br /><a href={'mailto:' + COMPANY.email}>{COMPANY.email}</a></p>
                <p><strong>Business hours</strong><br />Sunday to Friday, 9am to 6pm GST</p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="fgrid">
            <div><a className="logo" href="#top" style={{ marginBottom: 12 }}><b />Whitemagum</a><p>IT services for businesses in Dubai and across the UAE.</p></div>
            <div><h3>Company</h3>{[['about', 'About us'], ['process', 'How we work'], ['credentials', 'Licensing'], ['faq', 'FAQ']].map(([id, t]) => <a className="fl" key={id} href={'#' + id}>{t}</a>)}</div>
            <div><h3>Services</h3>{SERVICES.slice(0, 4).map(([t]) => <a className="fl" key={t} href="#services">{t}</a>)}</div>
            <div><h3>Contact</h3><a className="fl" href={'mailto:' + COMPANY.email}>{COMPANY.email}</a><a className="fl" href={'tel:' + COMPANY.tel}>{COMPANY.phone}</a><a className="fl" href="#contact">Dubai, UAE</a></div>
          </div>

          <div className="glass legalbox">
            <h3 id="privacy">Privacy Policy</h3>
            <p>We collect only the details you submit through our forms (name, company, email, phone, message) to reply to your inquiry and provide services. We do not sell personal data. We keep data only as long as needed and handle it in line with UAE Federal Decree-Law No. 45 of 2021 on personal data protection. To access or delete your data, email {COMPANY.email}.</p>
            <h3 id="terms">Terms of Service</h3>
            <p>Services are provided under a written agreement or purchase order that sets scope, fees, term and liability. Quotes are valid for 30 days. Prices are in AED, exclusive of VAT unless stated. Disputes are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai.</p>
            <p className="note" style={{ margin: 0 }}>Have a lawyer review these texts before publishing.</p>
          </div>

          <div className="legal">
            <span>&copy; {new Date().getFullYear()} Whitemagum IT Solutions. All rights reserved.</span>
            <span>Trade License {COMPANY.license} &middot; Dubai, UAE &middot; <a href="#privacy">Privacy</a> &middot; <a href="#terms">Terms</a></span>
          </div>
        </div>
      </footer>
    </>
  );
}
