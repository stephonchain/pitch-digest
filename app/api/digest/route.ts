import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { extractVideoId, getVideoTranscript } from '@/lib/youtube';
import { generateDigest } from '@/lib/openai';
import { getUserQuota, consumeDigest } from '@/lib/quota';
import { z } from 'zod';

const requestSchema = z.object({
  url: z.string().min(1, 'URL is required'),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      const clerkUser = await request.json();
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.email || 'unknown@example.com',
        }
      });
    }

    const body = await request.json();
    const { url } = requestSchema.parse(body);

    // Check quota
    const quota = await getUserQuota(user.id);
    if (quota.totalRemaining <= 0) {
      return NextResponse.json(
        { error: 'quota_exceeded', message: 'No digests remaining' },
        { status: 402 }
      );
    }

    // Extract video ID
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Check if digest already exists for this user and video
    const existingDigest = await prisma.digest.findFirst({
      where: {
        userId: user.id,
        videoId: videoId
      }
    });

    if (existingDigest) {
      return NextResponse.json({
        markdown: existingDigest.markdown,
        quota: await getUserQuota(user.id),
        cached: true
      });
    }

    // Get transcript and generate digest
    const { transcript, title } = await getVideoTranscript(videoId);
    const markdown = await generateDigest(transcript, title);

    // Consume digest quota
    const updatedQuota = await consumeDigest(user.id);

    // Save digest
    const digest = await prisma.digest.create({
      data: {
        userId: user.id,
        videoId,
        videoTitle: title,
        markdown,
      }
    });

    return NextResponse.json({
      markdown,
      quota: updatedQuota,
      cached: false
    });

  } catch (error) {
    console.error('Error in digest API:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}