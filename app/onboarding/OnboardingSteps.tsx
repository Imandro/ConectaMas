"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";
import { Check, ArrowRight, Shield, Heart, User, Sparkles, RefreshCw, Zap, X, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import LlamiMascot from "@/app/components/LlamiMascot";

import { useLanguage } from "../LanguageContext";

const getSpiritualStatusOptions = (t: any) => [
    {
        id: "ACCEPT",
        title: t.onboarding.status_accept,
        icon: Sparkles,
        color: "success",
        prayer: t.onboarding.prayer_accept
    },
    {
        id: "RENEW",
        title: t.onboarding.status_renew,
        icon: RefreshCw,
        color: "warning",
        prayer: t.onboarding.prayer_renew
    },
    {
        id: "DEEPEN",
        title: t.onboarding.status_deepen,
        icon: Zap,
        color: "primary",
        prayer: t.onboarding.prayer_deepen
    },
    {
        id: "UNSURE",
        title: t.onboarding.status_unsure,
        icon: X,
        color: "secondary",
        prayer: null
    }
];

const getSinOptions = (t: any) => [
    t.onboarding.sin_pride,
    t.onboarding.sin_anger,
    t.onboarding.sin_lust,
    t.onboarding.sin_gluttony,
    t.onboarding.sin_greed,
    t.onboarding.sin_sloth,
    t.onboarding.sin_envy,
    t.onboarding.sin_lying,
    t.onboarding.sin_gossip,
    t.onboarding.sin_impatience,
    t.onboarding.sin_fear,
    t.onboarding.sin_doubt,
    t.onboarding.sin_anxiety,
    t.onboarding.sin_procrastination,
    t.onboarding.sin_addiction,
    t.onboarding.sin_pornography,
    t.onboarding.sin_masturbation,
    t.onboarding.sin_fornication,
    t.onboarding.sin_adultery,
    t.onboarding.sin_idolatry,
    t.onboarding.sin_blasphemy,
    t.onboarding.sin_unforgiveness,
    t.onboarding.sin_rebellion,
    t.onboarding.sin_apathy,
    t.onboarding.sin_selfishness,
    t.onboarding.sin_materialism,
    t.onboarding.sin_lack_of_faith,
    t.onboarding.sin_disobedience,
    t.onboarding.sin_complaining,
    t.onboarding.sin_bitterness,
    t.onboarding.sin_jealousy,
    t.onboarding.sin_control,
    t.onboarding.sin_manipulation,
    t.onboarding.sin_judgment,
    t.onboarding.sin_criticism,
    t.onboarding.sin_ingratitude,
    t.onboarding.sin_cowardice,
    t.onboarding.sin_passivity,
    t.onboarding.sin_arrogance,
    t.onboarding.sin_vanity,
    t.onboarding.sin_superstition,
    t.onboarding.sin_witchcraft,
    t.onboarding.sin_occultism,
    t.onboarding.sin_drug_abuse,
    t.onboarding.sin_alcohol_abuse,
    t.onboarding.sin_gambling,
    t.onboarding.sin_theft,
    t.onboarding.sin_violence,
    t.onboarding.sin_murder,
    t.onboarding.sin_abortion,
    t.onboarding.sin_euthanasia,
    t.onboarding.sin_suicide_thoughts,
    t.onboarding.sin_self_harm,
    t.onboarding.sin_rejection,
    t.onboarding.sin_abandonment,
    t.onboarding.sin_loneliness,
    t.onboarding.sin_depression,
    t.onboarding.sin_grief,
    t.onboarding.sin_trauma,
    t.onboarding.sin_abuse,
    t.onboarding.sin_sexual_abuse,
    t.onboarding.sin_physical_abuse,
    t.onboarding.sin_emotional_abuse,
    t.onboarding.sin_spiritual_abuse,
    t.onboarding.sin_financial_problems,
    t.onboarding.sin_work_problems,
    t.onboarding.sin_family_problems,
    t.onboarding.sin_relationship_problems,
    t.onboarding.sin_health_problems,
    t.onboarding.sin_mental_health_problems,
    t.onboarding.sin_identity_crisis,
    t.onboarding.sin_purpose_crisis,
    t.onboarding.sin_lack_of_direction,
    t.onboarding.sin_lack_of_motivation,
    t.onboarding.sin_lack_of_discipline,
    t.onboarding.sin_lack_of_self_control,
    t.onboarding.sin_lack_of_peace,
    t.onboarding.sin_lack_of_joy,
    t.onboarding.sin_lack_of_love,
    t.onboarding.sin_lack_of_hope,
    t.onboarding.sin_lack_of_wisdom,
    t.onboarding.sin_lack_of_understanding,
    t.onboarding.sin_lack_of_knowledge,
    t.onboarding.sin_lack_of_truth,
    t.onboarding.sin_lack_of_justice,
    t.onboarding.sin_lack_of_mercy,
    t.onboarding.sin_lack_of_grace,
    t.onboarding.sin_lack_of_forgiveness,
    t.onboarding.sin_lack_of_compassion,
    t.onboarding.sin_lack_of_patience,
    t.onboarding.sin_lack_of_kindness,
    t.onboarding.sin_lack_of_goodness,
    t.onboarding.sin_lack_of_faithfulness,
    t.onboarding.sin_lack_of_gentleness,
    t.onboarding.sin_lack_of_self_control_fruit,
    t.onboarding.sin_other
];

const getProblemOptions = (t: any) => [
    t.onboarding.problem_anxiety,
    t.onboarding.problem_depression,
    t.onboarding.problem_fear,
    t.onboarding.problem_loneliness,
    t.onboarding.problem_grief,
    t.onboarding.problem_addiction,
    t.onboarding.problem_relationship,
    t.onboarding.problem_family,
    t.onboarding.problem_work,
    t.onboarding.problem_financial,
    t.onboarding.problem_health,
    t.onboarding.problem_identity,
    t.onboarding.problem_purpose,
    t.onboarding.problem_self_esteem,
    t.onboarding.problem_anger,
    t.onboarding.problem_unforgiveness,
    t.onboarding.problem_bitterness,
    t.onboarding.problem_guilt,
    t.onboarding.problem_shame,
    t.onboarding.problem_rejection,
    t.onboarding.problem_abandonment,
    t.onboarding.problem_abuse,
    t.onboarding.problem_trauma,
    t.onboarding.problem_spiritual_dryness,
    t.onboarding.problem_doubt,
    t.onboarding.problem_lack_of_faith,
    t.onboarding.problem_lack_of_direction,
    t.onboarding.problem_procrastination,
    t.onboarding.problem_stress,
    t.onboarding.problem_burnout,
    t.onboarding.problem_insomnia,
    t.onboarding.problem_eating_disorder,
    t.onboarding.problem_perfectionism,
    t.onboarding.problem_comparison,
    t.onboarding.problem_envy,
    t.onboarding.problem_jealousy,
    t.onboarding.problem_pride,
    t.onboarding.problem_control,
    t.onboarding.problem_manipulation,
    t.onboarding.problem_lying,
    t.onboarding.problem_gossip,
    t.onboarding.problem_criticism,
    t.onboarding.problem_judgment,
    t.onboarding.problem_materialism,
    t.onboarding.problem_consumerism,
    t.onboarding.problem_apathy,
    t.onboarding.problem_passivity,
    t.onboarding.problem_cowardice,
    t.onboarding.problem_disobedience,
    t.onboarding.problem_rebellion,
    t.onboarding.problem_idolatry,
    t.onboarding.problem_occultism,
    t.onboarding.problem_superstition,
    t.onboarding.problem_other
];

const getConnectionOptions = (t: any) => [
    t.onboarding.connection_prayer,
    t.onboarding.connection_bible_study,
    t.onboarding.connection_community,
    t.onboarding.connection_worship,
    t.onboarding.connection_service,
    t.onboarding.connection_evangelism,
    t.onboarding.connection_discipleship,
    t.onboarding.connection_fasting,
    t.onboarding.connection_meditation,
    t.onboarding.connection_solitude,
    t.onboarding.connection_journaling,
    t.onboarding.connection_generosity,
    t.onboarding.connection_gratitude,
    t.onboarding.connection_forgiveness,
    t.onboarding.connection_confession,
    t.onboarding.connection_mentorship,
    t.onboarding.connection_small_group,
    t.onboarding.connection_retreats,
    t.onboarding.connection_missions,
    t.onboarding.connection_social_justice,
    t.onboarding.connection_creation_care,
    t.onboarding.connection_spiritual_gifts,
    t.onboarding.connection_theology,
    t.onboarding.connection_apologetics,
    t.onboarding.connection_history,
    t.onboarding.connection_arts,
    t.onboarding.connection_music,
    t.onboarding.connection_writing,
    t.onboarding.connection_nature,
    t.onboarding.connection_silence,
    t.onboarding.connection_reflection,
    t.onboarding.connection_other
];

export default function OnboardingSteps() {
    const { t } = useLanguage();
    const [step, setStep] = useState(1);
    const [spiritualStatus, setSpiritualStatus] = useState<string>("");
    const [sinsSelected, setSinsSelected] = useState<string[]>([]);
    const [problemsSelected, setProblemsSelected] = useState<string[]>([]);
    const [connectionSelected, setConnectionSelected] = useState<string[]>([]);
    const [gender, setGender] = useState<string>('');
    const [age, setAge] = useState<number | "">("");
    const [mascotName, setMascotName] = useState<string>('Llami');
    const [leaderPhone, setLeaderPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const SPIRITUAL_STATUS_OPTIONS = getSpiritualStatusOptions(t);
    const SIN_OPTIONS = getSinOptions(t);
    const PROBLEM_OPTIONS = getProblemOptions(t);
    const CONNECTION_OPTIONS = getConnectionOptions(t);

    const totalSteps = 10;

    const handleToggle = (item: string, list: string[], setter: (val: string[]) => void) => {
        if (list.includes(item)) {
            setter(list.filter(i => i !== item));
        } else {
            setter([...list, item]);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await submitOnboarding({
                spiritualStatus,
                sinsToOvercome: sinsSelected,
                problemsFaced: problemsSelected,
                connectionMethods: connectionSelected,
                gender,
                age: Number(age),
                mascotName,
                leaderPhone: leaderPhone || undefined,
            });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert(t.common.error || 'Error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOption = SPIRITUAL_STATUS_OPTIONS.find(opt => opt.id === spiritualStatus);

    return (
        <div className="min-vh-100 bg-primary d-flex align-items-center justify-content-center p-3">
            <div className="w-100" style={{ maxWidth: '600px' }}>
                {/* Progress Bar */}
                <div className="mb-4 rounded-pill p-1 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                    <div
                        className="progress-bar bg-warning transition-all duration-500 rounded-pill"
                        role="progressbar"
                        style={{ width: `${(step / totalSteps) * 100}%`, height: '8px', backgroundColor: '#f3b33e' }}
                    />
                </div>

                <div className="card bg-primary border-0 shadow-none text-white rounded-4">
                    <div className="card-body p-4 p-md-5">

                        {/* STEP 1: Spiritual Status */}
                        {step === 1 && (
                            <div className="text-center animate-fade-in">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Shield className="text-warning" size={32} />
                                </div>
                                <h1 className="fw-bold mb-2 text-white" style={{ fontSize: '2rem' }}>
                                    {t.onboarding.welcome || "Bienvenido a Conecta+"}
                                </h1>
                                <p className="text-white-50 lead mb-4" style={{ fontSize: '1.1rem' }}>
                                    {t.onboarding.spiritual_status_title}
                                </p>

                                <div className="d-flex flex-column gap-3 mb-5">
                                    {SPIRITUAL_STATUS_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = spiritualStatus === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setSpiritualStatus(option.id)}
                                                className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${isSelected ? 'fw-bold shadow-lg' : ''}`}
                                                style={{
                                                    border: '2px solid',
                                                    borderColor: isSelected ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                    backgroundColor: isSelected ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                                }}
                                            >
                                                <div className="d-flex align-items-center justify-content-center" style={{ width: '40px' }}>
                                                    <Icon size={24} className="text-warning" />
                                                </div>
                                                <span className="text-white">{option.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedOption && selectedOption.prayer && (
                                    <div className="p-4 rounded-4 mb-5 text-start animate-fade-in" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <h6 className="fw-bold text-warning mb-2">{t.onboarding.prayer || "Oración"}</h6>
                                        <p className="fst-italic text-white-50 small m-0">
                                            &quot;{selectedOption.prayer}&quot;
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!spiritualStatus}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                    style={{
                                        opacity: !spiritualStatus ? 0.5 : 1,
                                        backgroundColor: '#f3b33e', // Slightly more orange gold like in image
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Sins to Overcome */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.sins_title}</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    {t.onboarding.sins_subtitle}
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {SIN_OPTIONS.map((sin) => (
                                        <button
                                            key={sin}
                                            onClick={() => handleToggle(sin, sinsSelected, setSinsSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${sinsSelected.includes(sin) ? 'fw-bold' : ''}`}
                                            style={{
                                                border: '2px solid',
                                                fontSize: '1rem',
                                                borderColor: sinsSelected.includes(sin) ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                backgroundColor: sinsSelected.includes(sin) ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <div className="d-flex align-items-center justify-content-center" style={{ width: '24px' }}>
                                                {sinsSelected.includes(sin) ? <Check className="text-warning" size={20} /> : <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid rgba(255,255,255,0.2)' }} />}
                                            </div>
                                            <span className="text-white">{sin}</span>
                                        </button>
                                    ))}
                                    <div className="mt-2">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill"
                                        >
                                            {t.onboarding.skip}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(3)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Problems Faced */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.problems_title}</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    {t.onboarding.problems_subtitle}
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {PROBLEM_OPTIONS.map((problem) => (
                                        <button
                                            key={problem}
                                            onClick={() => handleToggle(problem, problemsSelected, setProblemsSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${problemsSelected.includes(problem) ? 'fw-bold' : ''}`}
                                            style={{
                                                border: '2px solid',
                                                fontSize: '1rem',
                                                borderColor: problemsSelected.includes(problem) ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                backgroundColor: problemsSelected.includes(problem) ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <div className="d-flex align-items-center justify-content-center" style={{ width: '24px' }}>
                                                {problemsSelected.includes(problem) ? <Check className="text-warning" size={20} /> : <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid rgba(255,255,255,0.2)' }} />}
                                            </div>
                                            <span className="text-white">{problem}</span>
                                        </button>
                                    ))}
                                    <div className="mt-2">
                                        <button
                                            onClick={() => setStep(4)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill"
                                        >
                                            {t.onboarding.skip}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(4)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 4: Connection Methods */}
                        {step === 4 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.connection_title}</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    {t.onboarding.connection_subtitle}
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {CONNECTION_OPTIONS.map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => handleToggle(method, connectionSelected, setConnectionSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${connectionSelected.includes(method) ? 'fw-bold' : ''}`}
                                            style={{
                                                border: '2px solid',
                                                fontSize: '1rem',
                                                borderColor: connectionSelected.includes(method) ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                backgroundColor: connectionSelected.includes(method) ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <div className="d-flex align-items-center justify-content-center" style={{ width: '24px' }}>
                                                {connectionSelected.includes(method) ? <Check className="text-warning" size={20} /> : <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid rgba(255,255,255,0.2)' }} />}
                                            </div>
                                            <span className="text-white">{method}</span>
                                        </button>
                                    ))}
                                    <div className="mt-2">
                                        <button
                                            onClick={() => setStep(5)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill"
                                        >
                                            {t.onboarding.skip}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(5)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 5: Gender Selection */}
                        {step === 5 && (
                            <div className="animate-fade-in">
                                <div className="text-center mb-4">
                                    <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                        <User size={32} className="text-warning" />
                                    </div>
                                    <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.gender_title}</h2>
                                    <p className="text-white-50 mb-4">
                                        {t.onboarding.gender_subtitle}
                                    </p>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('MALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3 ${gender === 'MALE' ? 'fw-bold' : ''}`}
                                            style={{
                                                border: '2px solid',
                                                borderColor: gender === 'MALE' ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                backgroundColor: gender === 'MALE' ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <span className="fs-1">👨</span>
                                            <span className="text-white">{t.onboarding.gender_male}</span>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('FEMALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3 ${gender === 'FEMALE' ? 'fw-bold' : ''}`}
                                            style={{
                                                border: '2px solid',
                                                borderColor: gender === 'FEMALE' ? '#f3b33e' : 'rgba(255, 255, 255, 0.1)',
                                                backgroundColor: gender === 'FEMALE' ? 'rgba(243, 179, 62, 0.15)' : 'rgba(255, 255, 255, 0.05)'
                                            }}
                                        >
                                            <span className="fs-1">👩</span>
                                            <span className="text-white">{t.onboarding.gender_female}</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(6)}
                                    disabled={!gender}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-4 text-primary"
                                    style={{
                                        opacity: !gender ? 0.5 : 1,
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 6: Age */}
                        {step === 6 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <User size={32} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.age_title}</h2>
                                <p className="text-white-50 mb-4">
                                    {t.onboarding.age_subtitle}
                                </p>

                                <div className="mb-4 d-flex justify-content-center">
                                    <input
                                        type="number"
                                        min="10"
                                        max="99"
                                        className="form-control form-control-lg text-center fw-bold text-white rounded-4 py-3"
                                        placeholder="Ej. 18"
                                        value={age}
                                        onChange={(e) => setAge(parseInt(e.target.value) || "")}
                                        style={{
                                            fontSize: '1.5rem',
                                            width: '120px',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(7)}
                                    disabled={!age || Number(age) < 10 || Number(age) > 100}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-4 text-primary"
                                    style={{
                                        opacity: (!age || Number(age) < 10) ? 0.5 : 1,
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 7: Name Your Mascot */}
                        {step === 7 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto mb-4 d-flex justify-content-center">
                                    <div className="rounded-circle p-4 shadow-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                        <LlamiMascot streak={1} level={1} />
                                    </div>
                                </div>

                                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.mascot_title}</h2>
                                <p className="text-white-50 mb-4" style={{ fontSize: '1rem' }}>
                                    {t.onboarding.mascot_subtitle}
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center fw-bold text-white rounded-4 py-3"
                                        placeholder="Ej. Fe, Esperanza, Llami..."
                                        value={mascotName}
                                        onChange={(e) => setMascotName(e.target.value)}
                                        style={{
                                            fontSize: '1.2rem',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(8)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 8: Leader Phone */}
                        {step === 8 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Shield size={40} className="text-warning" />
                                </div>

                                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>{t.onboarding.leader_title}</h2>
                                <p className="text-white-50 mb-4" style={{ fontSize: '1rem' }}>
                                    {t.onboarding.leader_subtitle}
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg text-center fw-bold text-white rounded-4 py-3"
                                        placeholder="Ej. +54 9 11 1234 5678"
                                        value={leaderPhone}
                                        onChange={(e) => setLeaderPhone(e.target.value)}
                                        style={{
                                            fontSize: '1.2rem',
                                            outline: 'none',
                                            boxShadow: 'none',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)'
                                        }}
                                    />
                                </div>

                                <div className="d-grid gap-3">
                                    <button
                                        onClick={() => setStep(9)}
                                        className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                        style={{
                                            backgroundColor: '#f3b33e',
                                            border: 'none',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setLeaderPhone("");
                                            setStep(9);
                                        }}
                                        className="btn btn-link text-white-50 text-decoration-none"
                                    >
                                        {t.onboarding.skip}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 9: Community & Support Intro */}
                        {step === 9 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Users size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-3 text-white">{t.onboarding.community_title}</h2>
                                <p className="text-white-50 mb-4">
                                    {t.onboarding.community_subtitle}
                                </p>

                                <div className="card bg-white bg-opacity-10 border-0 rounded-4 p-4 text-start mb-4">
                                    <div className="d-flex align-items-start gap-3">
                                        <div className="bg-warning bg-opacity-25 p-2 rounded-circle">
                                            <Heart size={20} className="text-warning" />
                                        </div>
                                        <div>
                                            <h6 className="fw-bold text-white mb-1">Apoyo Anónimo y Seguro</h6>
                                            <p className="text-white-50 small mb-0">
                                                Tus amigos podrán enviarte pequeños mensajes de ánimo (&quot;¡Estoy orando por ti!&quot;) sin necesidad de ver tus luchas o detalles privados.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(10)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {t.common.continue || "Continuar"} <ArrowRight size={20} />
                                </button>
                            </div>
                        )}


                        {/* STEP 10: Support Ad (Fundraising) */}
                        {step === 10 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Heart size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-3 text-white">{t.onboarding.support_title}</h2>
                                <p className="text-white-50 mb-4">
                                    {t.onboarding.support_subtitle}
                                </p>

                                <div className="card bg-white text-dark rounded-4 p-4 shadow-lg mb-4 text-start">
                                    <h5 className="fw-bold text-primary mb-2">{t.onboarding.support_goal}</h5>
                                    <div className="progress bg-secondary bg-opacity-10 rounded-pill mb-3" style={{ height: '12px' }}>
                                        <div
                                            className="progress-bar bg-warning rounded-pill"
                                            role="progressbar"
                                            style={{ width: '48%' }}
                                        ></div>
                                    </div>
                                    <p className="small text-muted mb-0">
                                        Cada aporte nos acerca a la meta. Si este proyecto bendice tu vida, considera sembrar una semilla hoy.
                                    </p>
                                </div>

                                <a
                                    href="https://www.paypal.me/Imandrox"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg mb-3"
                                    style={{ backgroundColor: '#f3b33e', border: 'none' }}
                                >
                                    <Heart size={20} fill="currentColor" /> {t.onboarding.support_button}
                                </a>

                                <button
                                    onClick={() => setStep(11)}
                                    className="btn btn-link text-white-50 text-decoration-none w-100"
                                >
                                    {t.onboarding.continue_without_support}
                                </button>
                            </div>
                        )}

                        {/* STEP 11: Final Confirmation */}
                        {step === 11 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Sparkles size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-3 text-white">{t.onboarding.final_title}</h2>
                                <p className="text-white-50 mb-4">
                                    {t.onboarding.final_subtitle}
                                </p>

                                <div className="p-4 rounded-4 mb-4 text-start" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    <p className="text-white mb-0 italic">
                                        "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas."
                                        <br /><span className="text-warning small">- Josué 1:9</span>
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <span>{t.onboarding.saving}...</span>
                                    ) : (
                                        <>{t.onboarding.start_journey} <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
