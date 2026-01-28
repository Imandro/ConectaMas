"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";
import { Check, ArrowRight, Shield, Heart, User, Sparkles, RefreshCw, Zap, X, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import LlamiMascot from "@/app/components/LlamiMascot";

import { useLanguage } from '@/app/LanguageContext';

const getSpiritualStatusOptions = (t: Record<string, any>) => [
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

const getSinOptions = (t: Record<string, any>) => [
    t.onboarding.sin_pride,
    t.onboarding.sin_anger,
    t.onboarding.sin_porn,
    t.onboarding.sin_lie,
    t.onboarding.sin_envy,
    t.onboarding.sin_sloth,
    t.onboarding.sin_gossip,
    t.onboarding.sin_addiction,
    t.onboarding.sin_toxic,
    t.onboarding.sin_other
];

const getProblemOptions = (t: Record<string, any>) => [
    t.onboarding.prob_anxiety,
    t.onboarding.prob_depression,
    t.onboarding.prob_loneliness,
    t.onboarding.prob_esteem,
    t.onboarding.prob_family,
    t.onboarding.prob_pressure,
    t.onboarding.prob_doubt,
    t.onboarding.prob_temptation,
    t.onboarding.prob_purpose,
    t.onboarding.prob_other
];

const getConnectionOptions = (t: Record<string, any>) => [
    t.onboarding.conn_pray,
    t.onboarding.conn_bible,
    t.onboarding.conn_fast,
    t.onboarding.conn_group,
    t.onboarding.conn_serve,
    t.onboarding.conn_share,
    t.onboarding.conn_worship,
    t.onboarding.conn_study
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
                                        placeholder={t.onboarding.age_placeholder}
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
                                        placeholder={t.onboarding.mascot_placeholder}
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
                                        placeholder={t.onboarding.leader_placeholder}
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
                                            <h6 className="fw-bold text-white mb-1">{t.onboarding.community_anonymous_title}</h6>
                                            <p className="text-white-50 small mb-0">
                                                {t.onboarding.community_anonymous_desc}
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
                                        {t.onboarding.support_description}
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
                                        &quot;{t.onboarding.final_verse}&quot;
                                        <br /><span className="text-warning small">{t.onboarding.final_verse_cite}</span>
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
