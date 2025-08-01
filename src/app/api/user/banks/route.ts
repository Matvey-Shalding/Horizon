import { Database } from 'database/database';
import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';

/**
 * GET handler to fetch banks for the authenticated user
 * @returns JSON response with user's banks or error if unauthorized
 * @throws Returns 401 status with error message if user is not authenticated
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch banks for the authenticated user
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

  // Return banks or empty array
  return NextResponse.json(user?.banks ?? []);
}
