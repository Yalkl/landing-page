import { NextResponse } from 'next/server';
import { getContent, saveContent } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getContent();
  return NextResponse.json(data);
}

export async function POST(req) {
  try {
    const { password, data, checkOnly } = await req.json();
    const adminPass = process.env.ADMIN_PASSWORD || 'tashkent2026';
    if (password !== adminPass) {
      return NextResponse.json({ error: 'סיסמה שגויה' }, { status: 401 });
    }
    if (checkOnly) {
      return NextResponse.json({ success: true });
    }
    const success = await saveContent(data);
    if (!success) {
      return NextResponse.json({ error: 'שגיאה בשמירה ל-DB' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
