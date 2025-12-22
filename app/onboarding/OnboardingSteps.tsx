"use client";

import { useState } from "react";
import { submitOnboarding } from "./actions";
import { Check, ArrowRight, Shield, Heart, User, Sparkles, RefreshCw, Zap, X } from "lucide-react";
import { useRouter } from "next/navigation";
import LlamiMascot from "@/app/components/LlamiMascot";

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
    const [leaderPhone, setLeaderPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const totalSteps = 8;

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
                leaderPhone: leaderPhone || undefined,
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
        <div className="min-vh-100 bg-primary d-flex align-items-center justify-content-center p-3">
            <div className="w-100" style={{ maxWidth: '600px' }}>
                {/* Progress Bar */}
                <div className="mb-4 bg-white bg-opacity-10 rounded-pill p-1 shadow-sm">
                    <div
                        className="progress-bar bg-warning transition-all duration-500 rounded-pill"
                        role="progressbar"
                        style={{ width: `${(step / totalSteps) * 100}%`, height: '8px' }}
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
                                    Bienvenido a Conecta<span className="text-warning">+</span>
                                </h1>
                                <p className="text-white-50 lead mb-4" style={{ fontSize: '1.1rem' }}>
                                    ¿Dónde estás espiritualmente?
                                </p>

                                <div className="d-flex flex-column gap-3 mb-5">
                                    {SPIRITUAL_STATUS_OPTIONS.map((option) => {
                                        const Icon = option.icon;
                                        const isSelected = spiritualStatus === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => setSpiritualStatus(option.id)}
                                                className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${isSelected
                                                    ? `border-warning bg-white bg-opacity-10 fw-bold shadow-lg`
                                                    : 'border-white border-opacity-10 bg-white bg-opacity-5'
                                                    }`}
                                                style={{ border: '2px solid' }}
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
                                    <div className="bg-white bg-opacity-5 p-4 rounded-4 mb-5 text-start animate-fade-in border border-white border-opacity-10">
                                        <h6 className="fw-bold text-warning mb-2">Oración</h6>
                                        <p className="fst-italic text-white-50 small m-0">
                                            "{selectedOption.prayer}"
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
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 2: Sins to Overcome */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>Pecados que Quiero Dejar</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    Selecciona lo que resuene contigo. Esto es privado.
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {SIN_OPTIONS.map((sin) => (
                                        <button
                                            key={sin}
                                            onClick={() => handleToggle(sin, sinsSelected, setSinsSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${sinsSelected.includes(sin)
                                                ? 'border-warning bg-white bg-opacity-10 fw-bold'
                                                : 'border-white border-opacity-5 bg-white bg-opacity-5'
                                                }`}
                                            style={{ border: '2px solid', fontSize: '1rem' }}
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
                                            Prefiero omitir este paso
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
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 3: Problems Faced */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>Problemas que Enfrento</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    ¿Con qué luchas actualmente?
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {PROBLEM_OPTIONS.map((problem) => (
                                        <button
                                            key={problem}
                                            onClick={() => handleToggle(problem, problemsSelected, setProblemsSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${problemsSelected.includes(problem)
                                                ? 'border-warning bg-white bg-opacity-10 fw-bold'
                                                : 'border-white border-opacity-5 bg-white bg-opacity-5'
                                                }`}
                                            style={{ border: '2px solid', fontSize: '1rem' }}
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
                                            Prefiero omitir este paso
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
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 4: Connection Methods */}
                        {step === 4 && (
                            <div className="animate-fade-in">
                                <h2 className="fw-bold mb-2 text-center text-white" style={{ fontSize: '1.8rem' }}>¿Cómo Quiero Conectar Más?</h2>
                                <p className="text-white-50 text-center mb-4" style={{ fontSize: '1rem' }}>
                                    ¿De qué formas quieres crecer en tu relación con Dios?
                                </p>

                                <div className="d-flex flex-column gap-2 mb-4" style={{ maxHeight: '450px', overflowY: 'auto', paddingRight: '5px' }}>
                                    {CONNECTION_OPTIONS.map((method) => (
                                        <button
                                            key={method}
                                            onClick={() => handleToggle(method, connectionSelected, setConnectionSelected)}
                                            className={`btn btn-lg text-start d-flex align-items-center gap-3 p-3 transition-all rounded-4 ${connectionSelected.includes(method)
                                                ? 'border-warning bg-white bg-opacity-10 fw-bold'
                                                : 'border-white border-opacity-5 bg-white bg-opacity-5'
                                                }`}
                                            style={{ border: '2px solid', fontSize: '1rem' }}
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
                                            Prefiero omitir este paso
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
                                    Continuar <ArrowRight size={20} />
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
                                    <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>Sobre ti</h2>
                                    <p className="text-white-50 mb-4">
                                        Para personalizar tu experiencia, dinos tu género.
                                    </p>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('MALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3
                                 ${gender === 'MALE' ? 'border-warning bg-white bg-opacity-10 fw-bold' : 'border-white border-opacity-5 bg-white bg-opacity-5'}
                                 `}
                                            style={{ border: '2px solid' }}
                                        >
                                            <span className="fs-1">👨</span>
                                            <span className="text-white">Hombre</span>
                                        </button>
                                    </div>
                                    <div className="col-6">
                                        <button
                                            onClick={() => setGender('FEMALE')}
                                            className={`w-100 p-4 rounded-4 border transition-all d-flex flex-column align-items-center gap-3
                                 ${gender === 'FEMALE' ? 'border-warning bg-white bg-opacity-10 fw-bold' : 'border-white border-opacity-5 bg-white bg-opacity-5'}
                                 `}
                                            style={{ border: '2px solid' }}
                                        >
                                            <span className="fs-1">👩</span>
                                            <span className="text-white">Mujer</span>
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
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 6: Name Your Mascot */}
                        {step === 6 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto mb-4 d-flex justify-content-center">
                                    <div className="bg-white bg-opacity-5 rounded-circle p-4 border border-white border-opacity-10 shadow-lg">
                                        <LlamiMascot streak={1} level={1} />
                                    </div>
                                </div>

                                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>Dale nombre a tu compañera</h2>
                                <p className="text-white-50 mb-4" style={{ fontSize: '1rem' }}>
                                    Tu mascota te acompañará en cada paso. ¿Cómo quieres que se llame?
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="text"
                                        className="form-control form-control-lg text-center fw-bold text-white bg-white bg-opacity-5 border-white border-opacity-10 rounded-4 py-3"
                                        placeholder="Ej. Fe, Esperanza, Llami..."
                                        value={mascotName}
                                        onChange={(e) => setMascotName(e.target.value)}
                                        style={{ fontSize: '1.2rem', outline: 'none', boxShadow: 'none' }}
                                    />
                                </div>

                                <button
                                    onClick={() => setStep(7)}
                                    className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                    style={{
                                        backgroundColor: '#f3b33e',
                                        border: 'none',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    Continuar <ArrowRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* STEP 7: Leader Phone */}
                        {step === 7 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Shield size={40} className="text-warning" />
                                </div>

                                <h2 className="fw-bold mb-2 text-white" style={{ fontSize: '1.8rem' }}>Contacto de Emergencia</h2>
                                <p className="text-white-50 mb-4" style={{ fontSize: '1rem' }}>
                                    Ingresa el número de WhatsApp de tu líder o mentor para tenerlo a mano en caso de necesitar ayuda (SOS).
                                </p>

                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        className="form-control form-control-lg text-center fw-bold text-white bg-white bg-opacity-5 border-white border-opacity-10 rounded-4 py-3"
                                        placeholder="Ej. +54 9 11 1234 5678"
                                        value={leaderPhone}
                                        onChange={(e) => setLeaderPhone(e.target.value)}
                                        style={{ fontSize: '1.2rem', outline: 'none', boxShadow: 'none' }}
                                    />
                                </div>

                                <div className="d-grid gap-3">
                                    <button
                                        onClick={() => setStep(8)}
                                        className="btn btn-warning w-100 fw-bold py-3 rounded-pill d-flex align-items-center justify-content-center gap-2 text-primary shadow-lg"
                                        style={{
                                            backgroundColor: '#f3b33e',
                                            border: 'none',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        Continuar <ArrowRight size={20} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setLeaderPhone("");
                                            setStep(8);
                                        }}
                                        className="btn btn-link text-white-50 text-decoration-none"
                                    >
                                        Prefiero omitir este paso
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* STEP 8: Final Confirmation */}
                        {step === 8 && (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-4" style={{ width: '80px', height: '80px', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                    <Sparkles size={40} className="text-warning" />
                                </div>
                                <h2 className="fw-bold mb-3 text-white">¡Todo Listo!</h2>
                                <p className="text-white-50 mb-4">
                                    Has dado el primer paso hacia una vida de mayor conexión con Dios. Estamos emocionados de acompañarte.
                                </p>

                                <div className="p-4 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-4 mb-4 text-start">
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
                                        <span>Guardando...</span>
                                    ) : (
                                        <>¡Empezar mi Camino! <ArrowRight size={20} /></>
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
