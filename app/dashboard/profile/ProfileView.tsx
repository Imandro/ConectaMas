"use client";

import { useLanguage } from "@/app/LanguageContext";
import ProfileHeader from "./ProfileHeader";
import PushNotificationManager from "@/app/components/PushNotificationManager";
import ClientProfileActions from "./ClientProfileActions";
import Link from "next/link"; // Ensure Link is imported if used, previously it was an anchor tag but Link is better
import { ExternalLink } from "lucide-react";

interface ProfileViewProps {
    user: any; // Type strictly if possible, using 'any' to match previous file for now to avoid breakage
}

export default function ProfileView({ user }: ProfileViewProps) {
    const { t } = useLanguage();

    return (
        <div className="container-fluid py-4 animate-fade-in">
            <h1 className="fw-bold text-secondary mb-4">{t.profile.title}</h1>

            <ProfileHeader
                user={{
                    name: user.name,
                    email: user.email,
                    spiritualLevel: user.spiritualLevel,
                    username: user.username,
                    lastUsernameChange: user.lastUsernameChange ? user.lastUsernameChange.toISOString() : null,
                    age: user.age
                }}
            />

            <div className="border-top pt-4">
                <div className="row g-3">
                    <div className="col-6">
                        <label className="small text-muted fw-bold">{t.profile.gender}</label>
                        <p className="fw-medium">
                            {user.gender === 'MALE' ? t.profile.gender_male :
                                user.gender === 'FEMALE' ? t.profile.gender_female :
                                    t.profile.gender_unspecified}
                        </p>
                    </div>
                </div>
            </div>

            <PushNotificationManager />

            <div className="card border-0 shadow-sm bg-white rounded-4 p-4">
                <h5 className="fw-bold mb-4">{t.profile.account_settings}</h5>

                <ClientProfileActions
                    userRole={user.role || 'USER'}
                    initialLeaderPhone={user.leaderPhone}
                    initialName={user.name}
                    initialUsername={user.username}
                    initialBio={user.bio}
                    initialCountry={user.country}
                    initialProfileType={user.profileType}
                />

                <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">{t.profile.legal}</h6>
                    <a href="/terms" target="_blank" className="text-decoration-none text-muted small d-flex align-items-center gap-2">
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
