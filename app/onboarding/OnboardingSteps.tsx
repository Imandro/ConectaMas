"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";
import { Check, ArrowRight, Shield, Heart, User, Sparkles, RefreshCw, Zap, X } from "lucide-react";
import { useRouter } from "next/navigation";

const SPIRITUAL_STATUS_OPTIONS = [
    {
        id: "ACCEPT",
        title: "Aceptar a Jesús por Primera Vez",
        icon: Sparkles,
        color: "success",
        prayer: "Señor Jesús, hoy decido seguirte. Reconozco que eres el Hijo de Dios y que moriste por mis pecados. Te pido perdón y te invito a ser el Señor de mi vida. Gracias por tu amor incondicional. Amén."
    },
    {
        id: "RENEW",
        title: "Reconciliar y Renovar mi Fe",
        icon: RefreshCw,
        color: "warning",
        prayer: "Padre, he estado lejos de Ti. Reconozco que me alejé, pero hoy vuelvo a casa. Perdóname por las veces que te fallé. Renuevo mi compromiso contigo y te pido que restaures mi primer amor. Amén."
    },
    {
        id: "DEEPEN",
        title: "Conectar Más Profundamente con Jesús",
        icon: Zap,
        color: "primary",
        prayer: "Jesús, quiero conocerte más. Llévame más allá de lo superficial. Enséñame a orar, a escucharte y a caminar contigo cada día. Hambre y sedienta mi alma de Ti. Amén."
    },
    {
        id: "UNSURE",
        title: "No Estoy Seguro / Prefiero Omitir",
        icon: X,
        color: "secondary",
        prayer: null
    }
];

const SIN_OPTIONS = [
    "Pornografía / Contenido Sexual",
    "Mentira",
    "Enojo / Ira",
    "Orgullo",
    "Envidia",
    "Pereza Espiritual",
    "Chisme / Murmuración",
    "Adicciones (alcohol, drogas, etc.)",
    "Relaciones Tóxicas",
    "Otros"
];

const PROBLEM_OPTIONS = [
    "Ansiedad / Estrés",
    "Depresión / Tristeza",
    "Soledad",
    "Baja autoestima",
    "Problemas familiares",
    "Presión de grupo",
    "Dudas sobre mi fe",
    "Tentación constante",
    "Falta de propósito",
    "Otros"
];

const CONNECTION_OPTIONS = [
    "Orar más consistentemente",
    "Leer la Biblia diariamente",
    "Ayunar y buscar a Dios",
    "Unirme a un grupo pequeño",
    "Servir en la iglesia",
    "Compartir mi fe con otros",
    "Adorar más (música, alabanza)",
    "Estudiar la Palabra más profundo"
];

export default function OnboardingSteps() {
    const [step, setStep] = useState(1);
    const [spiritualStatus, setSpiritualStatus] = useState<string>("");
    const [sinsSelected, setSinsSelected] = useState<string[]>([]);
    const [problemsSelected, setProblemsSelected] = useState<string[]>([]);
    const [connectionSelected, setConnectionSelected] = useState<string[]>([]);
    const [gender, setGender] = useState<string>('');
    const [mascotName, setMascotName] = useState<string>('Llami');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const totalSteps = 6;

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
                mascotName,
            });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Hubo un error al guardar. Intenta de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedOption = SPIRITUAL_STATUS_OPTIONS.find(opt => opt.id === spiritualStatus);

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
            <div className="w-100" style={{ maxWidth: '600px' }}>
                {/* Progress Bar */}
                <div className="mb-4 bg-white rounded-pill p-1 shadow-sm">
                    <div
                        className="progress-bar bg-warning transition-all duration-500"
                        role="progressbar"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                <div className="card bg-primary border-0 shadow-lg text-white rounded-4">
                    <div className="card-body p-4 p-md-5">

                        {/* STEP 1: Spiritual Status */}
                        {step === 1 && (
                            <div className="text-center animate-fade-in">
                                <div className="mx-auto bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px' }}>
                                    <Shield className="text-warning" size={32} />
                                </div>
                                <h1 className="fw-bold mb-3 text-white">
                                    Bienvenido a Conecta<span className="text-warning">+</span>
                                </h1>
                                <p className="text-white lead mb-4">
                                    ¿Dónde estás espiritualmente?
                                </p>

                                <div className="d-flex flex-column gap-3 mb-4">
                                    {SPIRITUAL_STATUS_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = spiritualStatus === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setSpiritualStatus(option.id)}
                                                className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all ${isSelected
                                                    ? `btn-warning text-primary fw-bold shadow-lg`
                                                    : 'btn-outline-light text-white border-0 bg-white bg-opacity-10'
                                                    }`}
                                            >
                                                <Icon size={24} className={isSelected ? "text-primary" : "text-warning"} />
                                                <span>{option.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedOption && selectedOption.prayer && (
                                    <div className="bg-dark bg-opacity-25 p-4 rounded-3 border border-warning mb-4 text-start animate-fade-in">
                                        <h6 className="fw-bold text-warning mb-2">Oración</h6>
                                        <p className="fst-italic text-light small m-0">
                                            "{selectedOption.prayer}"
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!spiritualStatus}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                    style={{ opacity: !spiritualStatus ? 0.5 : 1 }}
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Sins to Overcome */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-3 text-center">Pecados que Quiero Dejar</h2>
                                <p className="text-white text-center mb-4 small">
                                    Selecciona lo que resuene contigo. Esto es privado.
                                </p>

                                <div className="row g-2 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {SIN_OPTIONS.map((sin) => (
                                        <div className="col-12" key={sin}>
                                            <label className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer transition-all ${sinsSelected.includes(sin)
                                                ? 'bg-warning text-primary fw-bold border-warning'
                                                : 'border-white border-opacity-25 bg-white bg-opacity-10 text-white'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={sinsSelected.includes(sin)}
                                                    onChange={() => handleToggle(sin, sinsSelected, setSinsSelected)}
                                                />
                                                <span>{sin}</span>
                                            </label>
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <button
                                            onClick={() => setStep(3)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill fw-bold"
                                        >
                                            Prefiero omitir este paso
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(3)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Problems Faced */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-3 text-center">Problemas que Enfrento</h2>
                                <p className="text-white text-center mb-4 small">
                                    ¿Con qué luchas actualmente?
                                </p>

                                <div className="row g-2 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {PROBLEM_OPTIONS.map((problem) => (
                                        <div className="col-12" key={problem}>
                                            <label className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer transition-all ${problemsSelected.includes(problem)
                                                ? 'bg-warning text-primary fw-bold border-warning'
                                                : 'border-white border-opacity-25 bg-white bg-opacity-10 text-white'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={problemsSelected.includes(problem)}
                                                    onChange={() => handleToggle(problem, problemsSelected, setProblemsSelected)}
                                                />
                                                <span>{problem}</span>
                                            </label>
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <button
                                            onClick={() => setStep(4)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill fw-bold"
                                        >
                                            Prefiero omitir este paso
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(4)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 4: Connection Methods */}
                        {step === 4 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-3 text-center">¿Cómo Quiero Conectar Más?</h2>
                                <p className="text-white text-center mb-4 small">
                                    ¿De qué formas quieres crecer en tu relación con Dios?
                                </p>

                                <div className="row g-2 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                    {CONNECTION_OPTIONS.map((method) => (
                                        <div className="col-12" key={method}>
                                            <label className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer transition-all ${connectionSelected.includes(method)
                                                ? 'bg-warning text-primary fw-bold border-warning'
                                                : 'border-white border-opacity-25 bg-white bg-opacity-10 text-white'
                                                }`}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={connectionSelected.includes(method)}
                                                    onChange={() => handleToggle(method, connectionSelected, setConnectionSelected)}
                                                />
                                                <span>{method}</span>
                                            </label>
                                        </div>
                                    ))}
                                    <div className="col-12">
                                        <button
                                            onClick={() => setStep(5)}
                                            className="btn btn-link text-white-50 text-decoration-none w-100 rounded-pill fw-bold"
                                        >
                                            Prefiero omitir este paso
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(5)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 5: Gender Selection */}
                        {step === 5 && (
                            <div className="animate-fade-in">
                                <div className="text-center mb-4">
                                    <div className="mx-auto bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px' }}>
                                        <User size={32} className="text-warning" />
                                    </div>
                                    <h2 className="fw-bold mb-2">Sobre ti</h2>
                                    <p className="text-white">
                                        Para personalizar tu experiencia, dinos tu género.
                                    </p>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('MALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3
                                ${gender === 'MALE' ? 'bg-warning border-warning text-primary fw-bold' : 'bg-white bg-opacity-10 border-white border-opacity-25 text-white'}
                                `}
                                        >
                                            <span className="fs-1">👨</span>
                                            <span className="fw-bold">Hombre</span>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('FEMALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3
                                ${gender === 'FEMALE' ? 'bg-warning border-warning text-primary fw-bold' : 'bg-white bg-opacity-10 border-white border-opacity-25 text-white'}
                                `}
                                        >
                                            <span className="fs-1">👩</span>
                                            <span className="fw-bold">Mujer</span>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(6)}
                                    disabled={!gender}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 mt-4 text-primary"
                                    style={{ opacity: !gender ? 0.5 : 1 }}
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 6: Name Your Mascot */}
                        {step === 6 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px' }}>
                                    <span style={{ fontSize: '40px' }}>🦙</span>
                                </div>
                                <h2 className="fw-bold mb-3">Dale nombre a tu compañera</h2>
                                <p className="text-white mb-4">
                                    Tu mascota te acompañará en cada paso. ¿Cómo quieres que se llame?
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center fw-bold text-primary"
                                        placeholder="Ej. Fe, Esperanza, Llami..."
                                        value={mascotName}
                                        onChange={(e) => setMascotName(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(7)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary"
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 7: Final Confirmation */}
                        {step === 7 && (
                            <div className="text-center animate-fade-in">
                                <div className="mx-auto bg-success bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '64px', height: '64px' }}>
                                    <Check className="text-success" size={32} />
                                </div>
                                <h2 className="fw-bold mb-3">¡Todo Listo!</h2>
                                <p className="text-white mb-4">
                                    Estamos emocionados de acompañarte en este viaje espiritual. Tu camino con Dios comienza ahora.
                                </p>

                                <div className="bg-dark bg-opacity-50 p-4 rounded-3 border border-success mb-4 text-start">
                                    <h6 className="fw-bold text-success mb-2">Oración Final</h6>
                                    <p className="fst-italic text-light small m-0">
                                        "Señor, gracias por este nuevo comienzo. Guíame en cada paso, fortaléceme en mis luchas y ayúdame a crecer cada día más cerca de Ti. En el nombre de Jesús, Amén."
                                    </p>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="btn btn-success w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <span>Guardando...</span>
                                    ) : (
                                        <>¡Empezar mi Camino! <Check size={20} /></>
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
