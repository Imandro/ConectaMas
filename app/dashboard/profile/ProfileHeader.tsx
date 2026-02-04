"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { updateUsername } from "./actions";
import { toast } from "react-hot-toast";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import UserAvatar from "@/app/components/UserAvatar";

interface ProfileHeaderProps {
    user: {
        name: string | null;
        email: string | null;
        spiritualLevel: string;
        username?: string | null;
        lastUsernameChange?: Date | string | null;
        age?: number | null;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const { t } = useLanguage();
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [username, setUsername] = useState(user.username || "");
    const [pendingUsername, setPendingUsername] = useState("");

    const getErrorMessage = (res: any) => {
        if (res.errorKey) {
            let msg = t.profile[res.errorKey as keyof typeof t.profile] as string;
            if (res.errorParams) {
                res.errorParams.forEach((p: any) => {
                    msg = msg.replace('%d', p.toString());
                });
            }
            return msg;
        }
        return res.error || t.profile.error_updating;
    };

    const handleUpdateUsername = async () => {
        if (!pendingUsername) return;
        const result = await updateUsername(pendingUsername);
        if (result.success) {
            setUsername(pendingUsername);
            setIsEditingUsername(false);
            toast.success(t.profile.username_updated);
        } else {
            toast.error(getErrorMessage(result));
        }
    };



    const getSpiritualLevel = (level: string) => {
        if (!level) return t.spiritual_levels.exploring;
        const l = level.toLowerCase();
        if (l === 'explorador' || l === 'exploring') return t.spiritual_levels.exploring;
        if (l === 'principiante' || l === 'beginner') return t.spiritual_levels.beginner;
        if (l === 'creciendo' || l === 'growing') return t.spiritual_levels.growing;
        if (l === 'comprometido' || l === 'committed') return t.spiritual_levels.committed;
        if (l === 'líder' || l === 'leader') return t.spiritual_levels.leader;
        return level;
    };

    return (
        <div className="card border-0 shadow-sm bg-white rounded-4 mb-4 overflow-hidden">
            {/* Simple Header with Initials Avatar */}
            <div className="bg-gradient-primary" style={{ height: '80px' }}></div>

            <div className="p-4 pt-0 position-relative">
                <div className="d-flex align-items-end gap-4" style={{ marginTop: '-40px' }}>
                    <div className="bg-white p-1 rounded-circle shadow-sm">
                        <UserAvatar name={user.name} size={80} />
                    </div>
                </div>

                {/* User Info Below */}
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h4 className="fw-bold mb-0">{user.name || t.auth.name_label}</h4>
                            <p className="text-muted mb-1">{user.email}</p>
                            <span className="badge bg-light text-secondary rounded-pill border">
                                {getSpiritualLevel(user.spiritualLevel)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3">

                        {isEditingUsername ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted fw-bold small">@</span>
                                <input
                                    autoFocus
                                    type="text"
                                    className="form-control form-control-sm"
                                    style={{ maxWidth: '150px' }}
                                    value={pendingUsername}
                                    onChange={(e) => setPendingUsername(e.target.value)}
                                    placeholder={t.auth.username_placeholder || "usuario"}
                                />
                                <button onClick={handleUpdateUsername} className="btn btn-sm btn-success rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                                    <Check size={14} />
                                </button>
                                <button onClick={() => setIsEditingUsername(false)} className="btn btn-sm btn-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: 28, height: 28 }}>
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted small">@{username || "usuario"}</span>
                                <button
                                    onClick={() => {
                                        setPendingUsername(username || "");
                                        setIsEditingUsername(true);
                                    }}
                                    className="btn btn-link text-muted p-0"
                                    title={t.profile.edit_username}
                                >
                                    <Edit2 size={12} />
                                </button>
                            </div>
                        )}
                        {user.age && <small className="text-muted d-block mt-1">{user.age} {t.onboarding.years}</small>}
                    </div>
                </div>
            </div>
        </div>
    );
}
