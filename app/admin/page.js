"use client";
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [msg, setMsg] = useState('');
  const [loginErr, setLoginErr] = useState('');

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => setData(d));
  }, []);

  const handleLogin = async () => {
    setLoginErr('');
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, checkOnly: true }),
    });
    if (res.ok) {
      setIsAuth(true);
    } else {
      setLoginErr('❌ סיסמה שגויה');
    }
  };

  const handleSave = async () => {
    setMsg('שומר...');
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, data }),
    });
    const resData = await res.json();
    if (res.ok) {
      setMsg('✅ התוכן נשמר בהצלחה והתעדכן באתר!');
    } else {
      setMsg('❌ שגיאה: ' + (resData.error || 'שגיאה בשמירה'));
    }
  };

  if (!isAuth) {
    return (
      <main className="container">
        <div className="card" style={{marginTop: 50, textAlign: 'center'}}>
          <h2>🔒 כניסת מנהל לניהול תוכן</h2>
          <p style={{margin: '12px 0', fontSize: 14, color: '#64748b'}}>הזן סיסמת עריכה</p>
          <input type="password" placeholder="סיסמת מנהל" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{padding: 10, width: '80%', borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 12, textAlign: 'center'}} />
          {loginErr && <p style={{color: '#ef4444', fontSize: 14, marginBottom: 12, fontWeight: 'bold'}}>{loginErr}</p>}
          <br />
          <button onClick={handleLogin} className="btn btn-goo" style={{width: '80%'}}>כניסה למערכת</button>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
        <h2>✏️ עריכת תכני האתר</h2>
        <a href="/" className="btn" style={{background:'#64748b', padding:'6px 12px', flex:'none'}}>חזרה לאתר</a>
      </div>
      {msg && <div style={{padding: 10, background: '#dcfce7', borderRadius: 8, marginBottom: 12, fontWeight: 'bold', textAlign: 'center'}}>{msg}</div>}
      <div className="card">
        <h3>כותרת ופתיח</h3>
        <label style={{fontSize:12, fontWeight:'bold'}}>כותרת ראשית</label>
        <input style={{width:'100%', padding:8, marginBottom:8}} value={data?.header?.page_title || ''} onChange={e => setData({...data, header: {...data.header, page_title: e.target.value}})} />
        <label style={{fontSize:12, fontWeight:'bold'}}>טקסט ברוכים הבאים</label>
        <textarea style={{width:'100%', padding:8, marginBottom:8, height:60}} value={data?.header?.welcome_text || ''} onChange={e => setData({...data, header: {...data.header, welcome_text: e.target.value}})} />
        <label style={{fontSize:12, fontWeight:'bold'}}>קישור אינסטגרם</label>
        <input style={{width:'100%', padding:8}} value={data?.header?.instagram_url || ''} onChange={e => setData({...data, header: {...data.header, instagram_url: e.target.value}})} />
      </div>
      <div className="card">
        <h3>טלפון חירום ראשוני</h3>
        <label style={{fontSize:12, fontWeight:'bold'}}>תפקיד</label>
        <input style={{width:'100%', padding:8, marginBottom:8}} value={data?.emergency_contacts?.contacts[0]?.role || ''} onChange={e => { const c = [...data.emergency_contacts.contacts]; c[0].role = e.target.value; setData({...data, emergency_contacts: {...data.emergency_contacts, contacts: c}}); }} />
        <label style={{fontSize:12, fontWeight:'bold'}}>מספר טלפון לחיוג</label>
        <input style={{width:'100%', padding:8}} value={data?.emergency_contacts?.contacts[0]?.phone || ''} onChange={e => { const c = [...data.emergency_contacts.contacts]; c[0].phone = e.target.value; c[0].display_phone = e.target.value; setData({...data, emergency_contacts: {...data.emergency_contacts, contacts: c}}); }} />
      </div>
      <button onClick={handleSave} className="btn" style={{background:'#22c55e', width:'100%', padding:14, fontSize:16, cursor:'pointer'}}>💾 שמור ופרסם באתר מיד</button>
    </main>
  );
}
