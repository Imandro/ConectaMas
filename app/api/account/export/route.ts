import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { exportUserData } from '@/app/lib/account/data-rights';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const userId = await getApiUserId(request, { allowWithoutLegal: true });
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  try {
    const data = await exportUserData(userId);
    return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store', 'Content-Disposition': 'attachment; filename="conecta-plus-data.json"' } });
  } catch (error) {
    console.error('Data export failed:', error);
    return NextResponse.json({ message: 'No se pudo exportar la cuenta' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
