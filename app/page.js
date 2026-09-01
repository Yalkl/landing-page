"use client";
import { useState, useEffect } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [rates, setRates] = useState({ USD: 1, ILS: 3.65, UZS: 12800 });
  const [currencyValues, setCurrencyValues] = useState({ ILS: '100', USD: '27.4', UZS: '350685' });

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => setData(d));
    fetch('/api/rates').then(r => r.json()).then(r => {
      setRates(r);
      calcFromILS(100, r);
    });
  }, []);

  const calcFromILS = (val, r = rates) => {
    const usd = val / r.ILS;
    const uzs = usd * r.UZS;
    setCurrencyValues({ ILS: val, USD: usd.toFixed(2), UZS: Math.round(uzs) });
  };

  const calcFromUSD = (val, r = rates) => {
    const ils = val * r.ILS;
    const uzs = val * r.UZS;
    setCurrencyValues({ ILS: ils.toFixed(2), USD: val, UZS: Math.round(uzs) });
  };

  const calcFromUZS = (val, r = rates) => {
    const usd = val / r.UZS;
    const ils = usd * r.ILS;
    setCurrencyValues({ ILS: ils.toFixed(2), USD: usd.toFixed(2), UZS: val });
  };

  const downloadVCF = () => {
    if (!data) return;
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:Embassy of Israel Tashkent\nTEL;TYPE=WORK:${data.emergency_contacts.contacts[0].phone}\nADR;TYPE=WORK:;;${data.location.address_en};;;;\nNOTE:Israel Embassy Emergency & Duty Line\nEND:VCARD`;
    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Israel_Embassy_Tashkent.vcf';
    a.click();
  };

  if (!data) return <main className="container"><p style={{textAlign:'center', padding:40}}>טוען נתונים...</p></main>;

  return (
    <main className="container">
      <header className="hero">
        <div className="badge">🇮🇱 🇺🇿</div>
        <h1>{data.header.embassy_title}</h1>
        <p className="subtitle">{data.header.embassy_subtitle}</p>
        {data.header.instagram_url && (
          <a href={data.header.instagram_url} target="_blank" rel="noreferrer" className="btn-insta">
            📸 עקבו באינסטגרם
          </a>
        )}
        <div className="headline-box" style={{marginTop: 16}}>
          <h2>{data.header.page_title}</h2>
          <p>{data.header.welcome_text}</p>
        </div>
      </header>

      <section className="card">
        <h3>💱 מחשבון מטבע (עדכון חי)</h3>
        <div className="conv-grid">
          <div className="conv-box">
            <label>שקלים (₪)</label>
            <input type="number" value={currencyValues.ILS} onChange={e => calcFromILS(Number(e.target.value))} />
          </div>
          <div className="conv-box">
            <label>דולר ($)</label>
            <input type="number" value={currencyValues.USD} onChange={e => calcFromUSD(Number(e.target.value))} />
          </div>
          <div className="conv-box">
            <label>סום אוזבקי (UZS)</label>
            <input type="number" value={currencyValues.UZS} onChange={e => calcFromUZS(Number(e.target.value))} />
          </div>
        </div>
      </section>

      <section className="card card-sec">
        <h3>🛡️ {data.security_protocol.title}</h3>
        <ul>{data.security_protocol.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </section>

      <section className="card">
        <h3>📞 {data.emergency_contacts.title}</h3>
        {data.emergency_contacts.contacts.map((c, i) => (
          <div key={i} className="contact-item">
            <div><strong>{c.role}</strong><p>{c.name}</p></div>
            <a href={`tel:${c.phone}`} className="btn-call">{c.display_phone}</a>
          </div>
        ))}
        <button onClick={downloadVCF} className="btn-vcf">📥 שמור את איש הקשר בטלפון</button>
      </section>

      <section className="card">
        <h3>📍 {data.location.title}</h3>
        <p className="address"><strong>EN:</strong> {data.location.address_en}<br /><strong>RU:</strong> {data.location.address_ru}</p>
        <p className="driver-note">{data.location.driver_note}</p>
        <div className="btn-row">
          <a href={data.location.yandex_maps_url} target="_blank" rel="noreferrer" className="btn btn-yan">🗺️ Yandex Maps</a>
          <a href={data.location.google_maps_url} target="_blank" rel="noreferrer" className="btn btn-goo">🌐 Google Maps</a>
        </div>
      </section>

      <section className="card">
        <h3>💡 {data.practical_info.title}</h3>
        {data.practical_info.sections.map((s, i) => (
          <div key={i} className="tip-box"><h4>{s.category}</h4><p>{s.description}</p></div>
        ))}
      </section>

      <footer className="footer">
        <p>{data.footer.rights}</p>
        <a href={data.footer.official_website_url} target="_blank" rel="noreferrer">לאתר משרד החוץ</a>
        <a href="/admin" className="admin-btn">🔒 כניסת מנהל (עריכת תוכן)</a>
      </footer>
    </main>
  );
}
