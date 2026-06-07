"use client";

import { useSession } from 'next-auth/react';
import { useGuest } from '@/app/components/GuestProvider';
import GuestBanner from '@/app/components/GuestBanner';
import GuestSignupSuggestion from '@/app/components/GuestSignupSuggestion';

export default function GuestDashboardWrapper() {
  const { data: session } = useSession();
  const { isGuest } = useGuest();

  if (session?.user) return null;
  if (!isGuest) return null;

  return (
    <>
      <GuestBanner />
      <GuestSignupSuggestion />
    </>
  );
}
