import { prisma } from './prisma';

export async function getUserQuota(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      packs: {
        where: { digestsLeft: { gt: 0 } },
        orderBy: { purchasedAt: 'asc' }
      }
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  const freeRemaining = Math.max(0, 3 - user.freeDigestsUsed);
  const paidRemaining = user.packs.reduce((sum, pack) => sum + pack.digestsLeft, 0);

  return {
    freeRemaining,
    paidRemaining,
    totalRemaining: freeRemaining + paidRemaining
  };
}

export async function consumeDigest(userId: string) {
  const quota = await getUserQuota(userId);
  
  if (quota.totalRemaining <= 0) {
    throw new Error('No digests remaining');
  }

  if (quota.freeRemaining > 0) {
    // Use free digest
    await prisma.user.update({
      where: { id: userId },
      data: { freeDigestsUsed: { increment: 1 } }
    });
  } else {
    // Use paid digest
    const pack = await prisma.pack.findFirst({
      where: { 
        userId,
        digestsLeft: { gt: 0 }
      },
      orderBy: { purchasedAt: 'asc' }
    });

    if (!pack) {
      throw new Error('No paid digests available');
    }

    await prisma.pack.update({
      where: { id: pack.id },
      data: { digestsLeft: { decrement: 1 } }
    });
  }

  return await getUserQuota(userId);
}