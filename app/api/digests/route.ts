import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const digests = await prisma.digest.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        videoId: true,
        videoTitle: true,
        markdown: true,
        createdAt: true,
      },
    });

    return NextResponse.json(digests);
  } catch (error) {
    console.error('Error fetching digests:', error);
    return NextResponse.json(
      { error: 'Failed to fetch digests' },
      { status: 500 }
    );
  }
}
