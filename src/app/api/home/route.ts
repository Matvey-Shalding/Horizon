// app/api/update-user/route.ts
/**
 * API route to update user data and banks.
 * @param request - Incoming Next.js request.
 * @returns JSON response with success or error message.
 */
import { updateOnClose } from 'actions/updateOnClose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userData,userBanks } = await request.json();
    await updateOnClose(userData,userBanks);
    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error in update-user API route:', error);
    return NextResponse.json({ message: 'Failed to update data' }, { status: 500 });
  }
}
