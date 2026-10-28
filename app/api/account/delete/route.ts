import { NextResponse } from 'next/server';
import { getApiUserId } from '@/app/lib/api-auth';
import { deleteUserAccount } from '@/app/lib/account/data-rights';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const userId = await getApiUserId(request, { allowWithoutLegal: true });
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await deleteUserAccount(userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'ACTIVE_SUBSCRIPTION') return NextResponse.json({ message: 'Cancela tus suscripciones activas con el proveedor antes de borrar la cuenta' }, { status: 409 });
    console.error('Account deletion failed:', error);
    return NextResponse.json({ message: 'No se pudo borrar la cuenta' }, { status: 500 });
  }
}
