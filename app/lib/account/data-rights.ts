import { prisma } from '../prisma';
import { Prisma } from '@prisma/client';

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['ACTIVE', 'PENDING', 'PAST_DUE', 'SUSPENDED']);

export function canDeleteWithSubscriptions(subscriptions: Array<{ status: string; currentPeriodEnd?: Date | string | null }>): { allowed: boolean; reason?: 'ACTIVE_SUBSCRIPTION' } {
  const now = Date.now();
  return subscriptions.some((subscription) => ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)
    || (subscription.status === 'CANCELLED' && subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd).getTime() > now))
    ? { allowed: false, reason: 'ACTIVE_SUBSCRIPTION' }
    : { allowed: true };
}

export function sanitizePaymentRecord(record: {
  provider: string;
  providerResourceId?: string;
  amount: unknown;
  currency: string;
  status: string;
  metadata?: unknown;
  userId?: string | null;
}) {
  return {
    provider: record.provider,
    amount: typeof record.amount === 'object' && record.amount !== null && 'toString' in record.amount
      ? String(record.amount)
      : record.amount,
    currency: record.currency,
    status: record.status,
  };
}

export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [profile, checkins, journalEntries, forumPosts, forumReplies, questions, answers, prayerRequests, prayerUpdates, devotionals, struggles, readingProgress, triviaAttempts, watchedVideos, gameScores, gameParticipations, groupMemberships, ledGroups, taskCompletions, friendships, supportMessages, forumNotifications, questionLikes, answerLikes, streak, legalConsents, pushSubscriptions, billingTransactions, billingSubscriptions, mascot, leaderApplications, aiChatMessages] = await prisma.$transaction([
    prisma.user.findUnique({ where: { id: userId }, select: {
      id: true, email: true, name: true, username: true, role: true, isAnonymous: true, gender: true,
      spiritualStatus: true, sinsToOvercome: true, problemsFaced: true, connectionMethods: true,
      spiritualLevel: true, hasCompletedOnboarding: true, leaderPhone: true, age: true, country: true,
      preferredLanguage: true, region: true, bio: true, profileType: true, totalXP: true, weeklyXP: true,
      aiContextEnabled: true, aiContextConsentAt: true,
      createdAt: true, updatedAt: true, isPremium: true,
    } }),
    prisma.dailyCheckin.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.journalEntry.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.forumPost.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.forumReply.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.question.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.answer.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.prayerRequest.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.prayerUpdate.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.userDevotional.findMany({ where: { userId } }),
    prisma.userStruggle.findMany({ where: { userId } }),
    prisma.readingProgress.findUnique({ where: { userId } }),
    prisma.userTriviaAttempt.findMany({ where: { userId } }),
    prisma.userVideo.findMany({ where: { userId } }),
    prisma.gameScore.findMany({ where: { userId } }),
    prisma.gamePlayer.findMany({ where: { userId }, select: { roomId: true, status: true, score: true, joinedAt: true } }),
    prisma.groupMember.findMany({ where: { userId } }),
    prisma.group.findMany({ where: { leaderId: userId }, select: { id: true, name: true, description: true, motto: true, privacy: true, createdAt: true, updatedAt: true } }),
    prisma.groupTaskCompletion.findMany({ where: { userId } }),
    prisma.friendship.findMany({ where: { OR: [{ requesterId: userId }, { addresseeId: userId }] } }),
    prisma.supportMessage.findMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } }),
    prisma.forumNotification.findMany({ where: { userId }, select: { type: true, postId: true, replyId: true, isRead: true, createdAt: true } }),
    prisma.questionLike.findMany({ where: { userId }, select: { questionId: true } }),
    prisma.answerLike.findMany({ where: { userId }, select: { answerId: true } }),
    prisma.streak.findUnique({ where: { userId } }),
    prisma.legalConsent.findMany({ where: { userId }, select: { document: true, version: true, locale: true, country: true, source: true, acceptedAt: true } }),
    prisma.pushSubscription.findMany({ where: { userId }, select: { createdAt: true } }),
    prisma.billingTransaction.findMany({ where: { userId }, select: { provider: true, amount: true, currency: true, status: true, kind: true, productCode: true, paidAt: true, createdAt: true } }),
    prisma.billingSubscription.findMany({ where: { userId }, select: { provider: true, productCode: true, status: true, currentPeriodStart: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, createdAt: true } }),
    prisma.mascot.findUnique({ where: { userId }, select: { level: true, experience: true, flamePoints: true, name: true, mood: true, createdAt: true, updatedAt: true } }),
    prisma.leaderApplication.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
    prisma.aiChatMessage.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } }),
  ]);

  if (!profile) throw new Error('User not found');
  return {
    exportedAt: new Date().toISOString(),
    profile,
    data: { checkins, journalEntries, forumPosts, forumReplies, questions, answers, prayerRequests, prayerUpdates, devotionals, struggles, readingProgress, triviaAttempts, watchedVideos, gameScores, gameParticipations, groupMemberships, ledGroups, taskCompletions, friendships, supportMessages, forumNotifications, questionLikes, answerLikes, streak, legalConsents, pushSubscriptions, mascot, leaderApplications, aiChatMessages },
    payments: {
      transactions: billingTransactions.map(sanitizePaymentRecord),
      subscriptions: billingSubscriptions,
    },
  };
}

export async function deleteUserAccount(userId: string): Promise<void> {
  const account = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!account) throw new Error('User not found');
  const subscriptions = await prisma.billingSubscription.findMany({ where: { userId }, select: { status: true, currentPeriodEnd: true } });
  const deletion = canDeleteWithSubscriptions(subscriptions);
  if (!deletion.allowed) throw new Error(deletion.reason);

  await prisma.$transaction(async (tx) => {
    await tx.group.deleteMany({ where: { leaderId: userId } });
    await tx.groupNeed.updateMany({ where: { userId }, data: { userId: null } });
    await tx.supportMessage.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } });
    await tx.aiChatMessage.deleteMany({ where: { userId } });
    if (account.email) {
      await tx.resetToken.deleteMany({ where: { identifier: account.email } });
      await tx.verificationToken.deleteMany({ where: { identifier: account.email } });
    }
    await tx.billingTransaction.updateMany({ where: { userId }, data: { userId: null, metadata: Prisma.JsonNull } });
    await tx.user.delete({ where: { id: userId } });
  });
}
