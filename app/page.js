import content from "../data/content.json";

export default function Home() {
  return (
    <main className="container">
      <header className="hero">
        <div className="badge">🇮🇱 🇺🇿</div>
        <h1>{content.header.embassy_title}</h1>
        <p className="subtitle">{content.header.embassy_subtitle}</p>
        <div className="headline-box">
          <h2>{content.header.page_title}</h2>
          <p>{content.header.welcome_text}</p>
        </div>
      </header>

      <section className="card card-sec">
        <h3>🛡️ {content.security_protocol.title}</h3>
        <ul>
          {content.security_protocol.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>📞 {content.emergency_contacts.title}</h3>
        {content.emergency_contacts.contacts.map((c, i) => (
          <div key={i} className="contact-item">
            <div>
              <strong>{c.role}</strong>
              <p>{c.name}</p>
            </div>
            <a href={`tel:${c.phone}`} className="btn-call">{c.display_phone}</a>
          </div>
        ))}
      </section>

      <section className="card">
        <h3>📍 {content.location.title}</h3>
        <p className="address">
          <strong>EN:</strong> {content.location.address_en}<br />
          <strong>RU:</strong> {content.location.address_ru}
        </p>
        <p className="driver-note">{content.location.driver_note}</p>
        <div className="btn-row">
          <a href={content.location.yandex_maps_url} target="_blank" rel="noreferrer" className="btn btn-yan">🗺️ Yandex Maps</a>
          <a href={content.location.google_maps_url} target="_blank" rel="noreferrer" className="btn btn-goo">🌐 Google Maps</a>
        </div>
      </section>

      <section className="card">
        <h3>💡 {content.practical_info.title}</h3>
        {content.practical_info.sections.map((s, i) => (
          <div key={i} className="tip-box">
            <h4>{s.category}</h4>
            <p>{s.description}</p>
          </div>
        ))}
      </section>

      <footer className="footer">
        <p>{content.footer.rights}</p>
        <a href={content.footer.official_website_url} target="_blank" rel="noreferrer">לאתר משרד החוץ</a>
      </footer>
    </main>
  );
}
