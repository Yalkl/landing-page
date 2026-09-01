import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    return NextResponse.json({
      USD: 1,
      ILS: data.rates.ILS || 3.65,
      UZS: data.rates.UZS || 12800
    });
  } catch (e) {
    return NextResponse.json({ USD: 1, ILS: 3.65, UZS: 12800 });
  }
}
