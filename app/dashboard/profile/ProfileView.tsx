"use client";

import { useLanguage } from "@/app/LanguageContext";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getSnapshot, saveSnapshot } from '@/app/lib/offlineStore';
import ProfileHeader from "./ProfileHeader";
import PushNotificationManager from "@/app/components/PushNotificationManager";
import ClientProfileActions from "./ClientProfileActions";
import { ExternalLink } from "lucide-react";

export interface ProfileUser {
    name: string | null;
    email: string | null;
    gender?: string | null;
    spiritualLevel?: string | null;
    role?: string | null;
    leaderPhone?: string | null;
    username?: string | null;
    lastUsernameChange?: Date | string | null;
    age?: number | null;
    bio?: string | null;
    country?: string | null;
    profileType?: string | null;
}

interface ProfileViewProps {
    user: ProfileUser;
}

export default function ProfileView({ user }: ProfileViewProps) {
    const { t } = useLanguage();
    const { data: session } = useSession();
    const snapshotUserId = (session?.user as { id?: string; email?: string } | undefined)?.id
        || session?.user?.email
        || null;
    const [profile, setProfile] = useState(user);

    useEffect(() => {
        setProfile(user);
        if (!snapshotUserId) return;
        if (navigator.onLine) {
            void saveSnapshot('/dashboard/profile', snapshotUserId, user);
            return;
        }

        void getSnapshot<ProfileUser>('/dashboard/profile', snapshotUserId).then((snapshot) => {
            if (snapshot?.payload) setProfile(snapshot.payload);
        });
    }, [snapshotUserId, user]);

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <h1 className="ui-page-header fw-bold text-secondary mb-4">{t.profile.title}</h1>

            <ProfileHeader
                user={{
                    name: profile.name,
                    email: profile.email,
                    spiritualLevel: profile.spiritualLevel || '',
                    username: profile.username,
                    lastUsernameChange: profile.lastUsernameChange
                        ? profile.lastUsernameChange instanceof Date
                            ? profile.lastUsernameChange.toISOString()
                            : profile.lastUsernameChange
                        : null,
                    age: profile.age
                }}
            />

            <div className="border-top pt-4">
                <div className="row g-3">
                    <div className="col-6">
                        <label className="small text-muted fw-bold">{t.profile.gender}</label>
                        <p className="fw-medium">
                            {profile.gender === 'MALE' ? t.profile.gender_male :
                                profile.gender === 'FEMALE' ? t.profile.gender_female :
                                    t.profile.gender_unspecified}
                        </p>
                    </div>
                </div>
            </div>

            <PushNotificationManager />

            <div className="ui-surface border-0 shadow-sm p-4">
                <h5 className="fw-bold mb-4">{t.profile.account_settings}</h5>

                <ClientProfileActions
                    userRole={profile.role || 'USER'}
                    initialLeaderPhone={profile.leaderPhone}
                    initialName={profile.name}
                    initialUsername={profile.username}
                    initialBio={profile.bio}
                    initialCountry={profile.country}
                    initialProfileType={profile.profileType}
                />

                <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">{t.profile.legal}</h6>
                    <a href="/legal/terms" target="_blank" rel="noreferrer" className="text-decoration-none text-muted small d-flex align-items-center gap-2">
                        <span className="bg-light p-1 rounded-circle">
                            <ExternalLink size={16} />
                        </span>
                        {t.profile.terms}
                    </a>
                </div>
            </div>
        </div>
    );
}
