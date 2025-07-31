// app/api/user/banks/route.ts
import { Database } from 'database/database';
import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';

export async function GET() {
  // 1. Get session
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Fetch banks for the authenticated user
  const user = await Database.user.findUnique({
    where: { email: session.user.email },
    include: {
      banks: {
        include: {
          categories: true,
          transactions: true,
        },
      },
    },
  });
  console.log('Banks FROM DB');
  console.log(JSON.stringify(user?.banks, null, 2));

  // 3. Return only the banks
  return NextResponse.json(user?.banks ?? []);
}
