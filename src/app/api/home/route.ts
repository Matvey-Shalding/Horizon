// app/api/update-user/route.ts
import { updateOnClose } from 'actions/updateOnClose';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json(); // Parse the JSON data sent from the frontend

    const { userData, userBanks } = body;

    // Call the Server Action to update the database
    await updateOnClose(userData, userBanks);

    return NextResponse.json({ message: 'Data updated successfully' });
  } catch (error) {
    console.error('Error in update-user API route:', error);
    return NextResponse.json({ message: 'Failed to update data' }, { status: 500 });
  }
}
