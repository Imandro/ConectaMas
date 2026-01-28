"use client";

import { useState, useRef } from "react";
import { Camera, Edit2 } from "lucide-react";
import { updateProfileImage, updateUsername } from "./actions";
import { toast } from "react-hot-toast";
import { Check, X } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

interface ProfileHeaderProps {
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
        spiritualLevel: string;
        username?: string | null;
        lastUsernameChange?: Date | string | null;
        age?: number | null;
        bannerUrl?: string | null;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const { t } = useLanguage();
    const [image, setImage] = useState(user.image);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [username, setUsername] = useState(user.username || "");
    const [pendingUsername, setPendingUsername] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation (Max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t.profile.image_too_large);
            return;
        }

        setIsUploading(true);

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                // Optimistic update
                setImage(base64String);
                await updateProfileImage(base64String);
                toast.success(t.profile.image_updated);
            } catch (error) {
                console.error("Error upload:", error);
                toast.error(t.profile.image_error);
                setImage(user.image); // Revert
            } finally {
                setIsUploading(false);
            }
        };
        reader.readAsDataURL(file);
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

    const [banner, setBanner] = useState(user.bannerUrl);
    const [isUploadingBanner, setIsUploadingBanner] = useState(false);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // ... (existing helper functions)

    const handleBannerClick = () => {
        bannerInputRef.current?.click();
    }

    const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t.profile.image_too_large);
            return;
        }
        setIsUploadingBanner(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                setBanner(base64String);
                await require("./actions").updateBannerImage(base64String);
                toast.success(t.profile.image_updated);
            } catch (error) {
                toast.error(t.profile.image_error);
                setBanner(user.bannerUrl);
            } finally {
                setIsUploadingBanner(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="card border-0 shadow-sm bg-white rounded-4 mb-4 overflow-hidden">
            {/* Banner Section */}
            <div
                className="position-relative bg-light"
                style={{ height: '120px', cursor: 'pointer' }}
                onClick={handleBannerClick}
            >
                <input
                    type="file"
                    ref={bannerInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleBannerChange}
                />
                {banner ? (
                    <img src={banner} className="w-100 h-100 object-fit-cover" alt="Banner" />
                ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                        <small>{t.profile.banner_label || "Tocá para agregar portada"}</small>
                    </div>
                )}
                <div className="position-absolute bottom-0 end-0 p-2 m-2 bg-white rounded-circle shadow-sm" style={{ opacity: 0.8 }}>
                    <Camera size={14} />
                </div>
            </div>

            <div className="p-4 pt-0 position-relative">
                <div className="d-flex align-items-end gap-4" style={{ marginTop: '-40px' }}>
                    <div className="position-relative cursor-pointer" onClick={handleImageClick}>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="d-none"
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        {image ? (
                            <div
                                className="bg-white rounded-circle overflow-hidden shadow-sm p-1"
                                style={{ width: '90px', height: '90px' }}
                            >
                                <img src={image} alt="Profile" className="w-100 h-100 rounded-circle object-fit-cover" />
                            </div>
                        ) : (
                            <div className="bg-white p-1 rounded-circle shadow-sm">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center display-4 fw-bold" style={{ width: '80px', height: '80px' }}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            </div>
                        )}
                        <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm border">
                            <Camera size={16} className="text-secondary" />
                        </div>
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
