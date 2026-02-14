"use client";

import { signOut } from "next-auth/react";
import { LogOut, RefreshCcw, Phone, HelpCircle, Users, UserCircle, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { resetAccount, updateLeaderPhone, updateName, updateUsername } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/LanguageContext";

export default function ClientProfileActions({
    userRole,
    initialLeaderPhone,
    initialName,
    initialUsername,
    initialBio,
    initialCountry,
    initialProfileType
}: {
    userRole: string,
    initialLeaderPhone?: string | null,
    initialName?: string | null,
    initialUsername?: string | null,
    initialBio?: string | null,
    initialCountry?: string | null,
    initialProfileType?: string | null
}) {
    const { t, language, region, setLanguage, setRegion } = useLanguage();
    const [isResetting, setIsResetting] = useState(false);
    const [leaderPhone, setLeaderPhone] = useState(initialLeaderPhone || "");
    const [name, setName] = useState(initialName || "");
    const [username, setUsername] = useState(initialUsername || "");

    // New States
    const [bio, setBio] = useState(initialBio || "");
    const [country, setCountry] = useState(initialCountry || "");
    const [profileType, setProfileType] = useState(initialProfileType || "NORMAL");

    const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Import new actions
    const { updateBio, updateCountry, updateProfileType } = require("./actions");
    const sessionContext = useSession();
    const update = sessionContext?.update;
    const router = useRouter();

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

    const handleReset = async () => {
        if (confirm(t.profile.reset_confirm)) {
            setIsResetting(true);
            try {
                await resetAccount();
                window.location.href = "/onboarding";
            } catch (error) {
                console.error(error);
                alert(t.profile.reset_error);
            } finally {
                setIsResetting(false);
            }
        }
    };

    const handleUpdateProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            // Update Name
            if (name !== initialName) {
                const res = await updateName(name);
                if (!res.success) {
                    alert(`${t.profile.name_label}: ${getErrorMessage(res)}`);
                    return;
                }
            }

            // Update Username
            if (username !== initialUsername) {
                const res = await updateUsername(username);
                if (!res.success) {
                    alert(`${t.profile.username_label}: ${getErrorMessage(res)}`);
                    return;
                }
            }

            // Update Bio
            if (bio !== initialBio) {
                const res = await updateBio(bio);
                if (!res.success) {
                    alert(`${t.profile.bio_label}: ${getErrorMessage(res)}`);
                    return;
                }
            }

            // Update Country
            if (country !== initialCountry) {
                const res = await updateCountry(country);
                if (!res.success) {
                    alert(`${t.profile.country_label}: ${getErrorMessage(res)}`);
                    return;
                }
            }

            // Update Profile Type
            if (profileType !== initialProfileType) {
                const res = await updateProfileType(profileType);
                if (!res.success) {
                    alert(`${t.profile.type_label}: ${getErrorMessage(res)}`);
                    return;
                }
            }

            // Refresh Session
            if (update) {
                await update({ name: name });
            }
            alert(t.profile.update_success);
            router.refresh();

        } catch (error) {
            console.error(error);
            alert(t.profile.update_error);
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <div className="d-grid gap-3">

            {/* Profile Edit Section */}
            <div className="card shadow-none border rounded-3 p-3 bg-light bg-opacity-50">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <UserCircle size={20} className="text-secondary" />
                    <div>
                        <span className="d-block fw-bold">{t.profile.personal_data}</span>
                        <small className="text-muted fw-normal">{t.profile.personal_data_subtitle}</small>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label small text-muted">{t.profile.name_label}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label small text-muted">{t.profile.username_label}</label>
                    <div className="input-group">
                        <span className="input-group-text bg-white text-muted">@</span>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>{t.profile.username_hint}</small>
                </div>

                {/* Bio Field */}
                <div className="mb-3">
                    <label className="form-label small text-muted">{t.profile.bio_label}</label>
                    <textarea
                        className="form-control"
                        rows={3}
                        placeholder={t.profile.bio_placeholder}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                {/* Country Field */}
                <div className="mb-3">
                    <label className="form-label small text-muted">{t.profile.country_label}</label>
                    <select
                        className="form-select"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <option value="">Seleccionar País...</option>
                        <option value="AR">Argentina</option>
                        <option value="MX">México</option>
                        <option value="CO">Colombia</option>
                        <option value="ES">España</option>
                        <option value="US">Estados Unidos</option>
                        <option value="CL">Chile</option>
                        <option value="PE">Perú</option>
                        <option value="VE">Venezuela</option>
                        <option value="Other">Otro / Other</option>
                    </select>
                </div>

                {/* Profile Type Field */}
                <div className="mb-3">
                    <label className="form-label small text-muted">{t.profile.type_label}</label>
                    <select
                        className="form-select"
                        value={profileType}
                        onChange={(e) => setProfileType(e.target.value)}
                    >
                        <option value="NORMAL">{t.profile.types.NORMAL}</option>
                        <option value="COOPERATOR">{t.profile.types.COOPERATOR}</option>
                        <option value="CHURCH">{t.profile.types.CHURCH}</option>
                    </select>
                </div>

                <button
                    className="btn btn-primary fw-bold w-100"
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile || (name === initialName && username === initialUsername)}
                >
                    {isUpdatingProfile ? t.onboarding.saving : t.profile.save_changes}
                </button>
            </div>

            {/* Language & Region Section */}
            <div className="card shadow-none border rounded-4 p-4 bg-light bg-opacity-25">
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-circle">
                        <Globe size={20} className="text-primary" />
                    </div>
                    <div>
                        <span className="d-block fw-bold h6 mb-0">{t.profile.language_region}</span>
                        <small className="text-muted fw-normal">{t.profile.language_region_subtitle}</small>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-12 col-md-6">
                        <label className="form-label small text-muted fw-bold text-uppercase ls-1">{t.profile.language_label}</label>
                        <select
                            className="form-select border-0 shadow-sm rounded-3 py-2"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            style={{ backgroundColor: 'var(--card-bg)' }}
                        >
                            <option value="es">🇪🇸 Español</option>
                            <option value="en">🇺🇸 English</option>
                            <option value="pt">🇧🇷 Português</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-6">
                        <label className="form-label small text-muted fw-bold text-uppercase ls-1">{t.profile.region_label}</label>
                        <select
                            className="form-select border-0 shadow-sm rounded-3 py-2"
                            value={region}
                            onChange={(e) => setRegion(e.target.value as any)}
                            style={{ backgroundColor: 'var(--card-bg)' }}
                        >
                            <option value="LATAM">{t.profile.regions.LATAM}</option>
                            <option value="ES">{t.profile.regions.ES}</option>
                            <option value="US">{t.profile.regions.US}</option>
                            <option value="BR">{t.profile.regions.BR}</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* Leader Phone Section */}
            <div className="card shadow-none border rounded-3 p-3 bg-light bg-opacity-50">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <Phone size={20} className="text-secondary" />
                    <div>
                        <span className="d-block fw-bold">{t.profile.leader_contact}</span>
                        <small className="text-muted fw-normal">{t.profile.leader_contact_subtitle}</small>
                    </div>
                </div>

                <div className="input-group">
                    <input
                        type="tel"
                        className="form-control"
                        placeholder={t.onboarding.leader_placeholder}
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                    />
                    <button
                        className="btn btn-outline-primary fw-bold"
                        type="button"
                        onClick={async () => {
                            setIsUpdatingPhone(true);
                            try {
                                await updateLeaderPhone(leaderPhone);
                                alert(t.profile.update_success);
                            } catch (error) {
                                console.error(error);
                                alert(t.profile.update_error);
                            } finally {
                                setIsUpdatingPhone(false);
                            }
                        }}
                        disabled={isUpdatingPhone}
                    >
                        {isUpdatingPhone ? '...' : t.common.save}
                    </button>
                </div>
            </div>

            {/* Friends Button */}
            <Link
                href="/dashboard/friends"
                className="btn btn-light fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 border"
            >
                <div className="bg-success bg-opacity-10 p-2 rounded-circle">
                    <Users size={20} className="text-success" />
                </div>
                <div className="text-start">
                    <span className="d-block">{t.profile.friends_manager}</span>
                    <small className="text-muted fw-normal">{t.profile.friends_manager_subtitle}</small>
                </div>
            </Link>

            {/* Only show reset button for ADMIN users */}
            {userRole === 'ADMIN' && (
                <button
                    onClick={handleReset}
                    disabled={isResetting}
                    className="btn btn-light text-danger fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3"
                >
                    <RefreshCcw size={20} />
                    <div className="text-start">
                        <span className="d-block">{t.profile.reset_onboarding}</span>
                        <small className="text-muted fw-normal">{t.profile.reset_onboarding_subtitle}</small>
                    </div>
                </button>
            )}

            {/* Tutorial Hub Button */}
            <Link
                href="/dashboard/tutorials"
                className="btn btn-light fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 border"
            >
                <HelpCircle size={20} className="text-primary" />
                <div className="text-start">
                    <span className="d-block">{t.profile.learning_center}</span>
                    <small className="text-muted fw-normal">{t.profile.learning_center_subtitle}</small>
                </div>
            </Link>

            <button
                onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = "/auth/login";
                }}
                className="btn btn-outline-danger fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3"
            >
                <LogOut size={20} />
                <span>{t.profile.logout}</span>
            </button>

            <button
                onClick={async () => {
                    if (confirm(t.profile.delete_confirm)) {
                        try {
                            const { deleteAccount } = await import("./actions");
                            await deleteAccount();
                            await signOut({ redirect: false });
                            window.location.href = "/";
                        } catch (e) {
                            alert(t.profile.delete_error);
                        }
                    }
                }}
                className="btn btn-danger text-white fw-bold d-flex align-items-center justify-content-start gap-3 p-3 rounded-3 shadow-sm"
            >
                <LogOut size={20} />
                <div className="text-start">
                    <span className="d-block">{t.profile.delete_account}</span>
                    <small className="fw-normal text-white-50">{t.profile.delete_account_subtitle}</small>
                </div>
            </button>
        </div>
    );
}
