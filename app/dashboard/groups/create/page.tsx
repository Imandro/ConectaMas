"use client";

import { useState } from "react";
import { useLanguage } from "@/app/LanguageContext";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitLeaderApplication, createGroup } from "../actions";
import { toast } from "react-hot-toast";

export default function LeaderSurveyPage() {
    const [step, setStep] = useState(1);
    const [answers, setAnswers] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { t } = useLanguage();

    const questions = [
        {
            id: "motivation",
            title: t.leader_survey.motivation,
            options: [
                t.leader_survey.opt_help,
                t.leader_survey.opt_giveback,
                t.leader_survey.opt_church,
                t.leader_survey.opt_other
            ]
        },
        {
            id: "experience",
            title: t.leader_survey.exp,
            options: [
                t.leader_survey.opt_yes,
                t.leader_survey.opt_assistant,
                t.leader_survey.opt_none
            ]
        },
        {
            id: "commitment",
            title: t.leader_survey.commitment,
            options: [t.leader_survey.opt_commit, t.leader_survey.opt_doubt]
        }
    ];

    const handleSelect = (option: string) => {
        setAnswers({ ...answers, [questions[step - 1].id]: option });
    };

    const handleNext = async () => {
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            // Finish
            setIsSubmitting(true);
            const res = await submitLeaderApplication(answers);

            if (res.success) {
                // Determine next step: Create Group
                // We'll simulate a 2nd step flow here or just create a default group?
                // For MVP, user becomes leader, then redirects to "Create Group" form (or we do it here).
                // Let's create a group immediately for seamlessness.
                const groupRes = await createGroup("Nuevo Grupo", "Creciendo juntos");
                if (groupRes.success) {
                    toast.success(t.leader_survey.success);
                    router.push("/dashboard/groups");
                } else {
                    toast.error(t.leader_survey.error_group);
                }
            } else {
                toast.error(t.leader_survey.error_application);
            }
            setIsSubmitting(false);
        }
    };

    const progress = (step / questions.length) * 100;

    return (
        <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center min-vh-100 animate-fade-in">
            <div className="w-100" style={{ maxWidth: 500 }}>
                {/* Progress */}
                <div className="progress mb-5" style={{ height: 6 }}>
                    <div className="progress-bar bg-primary rounded-pill transition-all" style={{ width: `${progress}%` }}></div>
                </div>

                <h2 className="fw-bold mb-4 text-center">{questions[step - 1].title}</h2>

                <div className="d-flex flex-column gap-3 mb-5">
                    {questions[step - 1].options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            className={`btn text-start p-4 rounded-4 fw-bold border-0 transition-all ${answers[questions[step - 1].id] === opt ? 'bg-primary text-white shadow-lg transform-scale-102' : 'bg-white shadow-sm hover-scale text-dark'}`}
                        >
                            <div className="d-flex align-items-center justify-content-between">
                                {opt}
                                {answers[questions[step - 1].id] === opt && <Check size={20} />}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="d-flex justify-content-between">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="btn btn-light rounded-pill px-4 fw-bold text-muted">
                            <ChevronLeft size={20} /> {t.onboarding.skip.includes('Atrás') ? t.onboarding.skip : 'Atrás'}
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!answers[questions[step - 1].id] || isSubmitting}
                        className="btn btn-dark rounded-pill px-5 py-3 fw-bold ms-auto d-flex align-items-center gap-2"
                    >
                        {isSubmitting ? t.leader_survey.processing : (step === questions.length ? t.leader_survey.finish : t.onboarding.next)}
                        {!isSubmitting && <ChevronRight size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
