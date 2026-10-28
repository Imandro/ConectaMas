'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import {
    ArrowLeft,
    BookOpen,
    Check,
    Flame,
    HeartHandshake,
    Mic,
    MicOff,
    Send,
    ShieldCheck,
    Sparkles,
    Trash2,
    X,
} from 'lucide-react';
import LlamiMascot from '@/app/components/LlamiMascot';
import {
    AI_CHAT_LIMIT,
    firstName,
    type AiChatMode,
    type AiMessageRole,
} from '@/app/lib/ai/policy';
import styles from './ChatView.module.scss';

type ChatMessage = {
    id: string;
    role: AiMessageRole;
    content: string;
    mode?: AiChatMode;
    createdAt: string;
    verse?: { reference: string; text: string };
};

type ChatViewProps = {
    firstName: string;
    mascotName: string;
    mascotLevel: number;
    streak: number;
};

type SpeechResult = { transcript: string };
type SpeechEvent = { resultIndex: number; results: ArrayLike<ArrayLike<SpeechResult> & { isFinal: boolean }> };
type SpeechRecognitionInstance = {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    onresult: ((event: SpeechEvent) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;
type SpeechWindow = Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };

const ROLE_OPTIONS: Array<{ id: AiChatMode; label: string; description: string; icon: typeof Sparkles }> = [
    { id: 'companion', label: 'Compañero', description: 'Habla sin presión', icon: Sparkles },
    { id: 'bible', label: 'Guía bíblico', description: 'Entiende un pasaje', icon: BookOpen },
    { id: 'prayer', label: 'Oración', description: 'Ora y respira', icon: HeartHandshake },
    { id: 'struggle', label: 'Plan de lucha', description: 'Da un paso concreto', icon: Flame },
];

const STARTERS = ['Quiero orar', 'Me siento ansioso', 'Ayúdame con una lucha'];

function friendlyTime(resetAt: string | null) {
    if (!resetAt) return 'Se renueva en dos horas';
    const minutes = Math.max(1, Math.ceil((new Date(resetAt).getTime() - Date.now()) / 60000));
    if (minutes < 60) return `Se renueva en ${minutes} min`;
    return `Se renueva en ${Math.ceil(minutes / 60)} h`;
}

export default function ChatView({ firstName: rawFirstName, mascotName, mascotLevel, streak }: ChatViewProps) {
    const reduceMotion = useReducedMotion();
    const userFirstName = firstName(rawFirstName);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [mode, setMode] = useState<AiChatMode>('companion');
    const [input, setInput] = useState('');
    const [remaining, setRemaining] = useState(AI_CHAT_LIMIT);
    const [resetAt, setResetAt] = useState<string | null>(null);
    const [contextEnabled, setContextEnabled] = useState(false);
    const [contextConsentGiven, setContextConsentGiven] = useState(false);
    const [showContextPrompt, setShowContextPrompt] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [successNotice, setSuccessNotice] = useState('');
    const [sosNotice, setSosNotice] = useState(false);
    const [voiceListening, setVoiceListening] = useState(false);
    const [voiceStatus, setVoiceStatus] = useState('');
    const [clearHistoryOpen, setClearHistoryOpen] = useState(false);
    const [clearHistoryBusy, setClearHistoryBusy] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const clearDialogCloseRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const response = await fetch('/api/ai/chat', { cache: 'no-store' });
                if (!response.ok) throw new Error('No se pudo cargar el chat');
                const data = await response.json();
                if (cancelled) return;
                setMessages(data.messages || []);
                setRemaining(typeof data.remaining === 'number' ? data.remaining : AI_CHAT_LIMIT);
                setResetAt(data.resetAt || null);
                setContextEnabled(Boolean(data.contextEnabled));
                setContextConsentGiven(Boolean(data.contextConsentAt));
                setShowContextPrompt(!data.contextConsentAt);
            } catch {
                if (!cancelled) setError('No pudimos cargar a Llami. Revisa tu conexión e inténtalo de nuevo.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' });
    }, [messages, sending, reduceMotion]);

    useEffect(() => () => {
        recognitionRef.current?.stop();
    }, []);

    useEffect(() => {
        if (!clearHistoryOpen) return;
        const frame = window.requestAnimationFrame(() => clearDialogCloseRef.current?.focus());
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !clearHistoryBusy) setClearHistoryOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            window.cancelAnimationFrame(frame);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [clearHistoryOpen, clearHistoryBusy]);

    const resizeTextarea = () => {
        const element = textareaRef.current;
        if (!element) return;
        element.style.height = 'auto';
        element.style.height = `${Math.min(element.scrollHeight, 144)}px`;
    };

    const updateContext = async (enabled: boolean) => {
        setSuccessNotice('');
        try {
            const response = await fetch('/api/ai/preferences', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contextEnabled: enabled }),
            });
            if (!response.ok) throw new Error('context');
            const data = await response.json();
            setContextEnabled(Boolean(data.contextEnabled));
            setContextConsentGiven(Boolean(data.consentedAt));
            setShowContextPrompt(false);
        } catch {
            setError('No pudimos guardar tu preferencia de contexto.');
        }
    };

    const sendMessage = async (event?: FormEvent, preset?: string) => {
        event?.preventDefault();
        const content = (preset ?? input).trim();
        if (!content || sending || remaining <= 0) return;
        setError('');
        setSuccessNotice('');
        setSosNotice(false);
        setSending(true);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        const optimistic: ChatMessage = {
            id: `pending-${Date.now()}`,
            role: 'USER',
            content,
            mode,
            createdAt: new Date().toISOString(),
        };
        setMessages((current) => [...current, optimistic]);
        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, mode }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                if (response.status === 429) {
                    setRemaining(0);
                    setResetAt(data.resetAt || null);
                    setError(`Llegaste al límite. ${friendlyTime(data.resetAt || null)}.`);
                } else if (response.status === 503) {
                    if (typeof data.remaining === 'number') setRemaining(data.remaining);
                    if (data.resetAt !== undefined) setResetAt(data.resetAt || null);
                    setError('Llami no está disponible ahora. Tu mensaje quedó guardado; prueba más tarde.');
                } else {
                    setError('No pudimos enviar tu mensaje. Inténtalo de nuevo.');
                }
                return;
            }
            setRemaining(typeof data.remaining === 'number' ? data.remaining : Math.max(0, remaining - 1));
            setResetAt(data.resetAt || null);
            if (data.message) {
                setMessages((current) => [...current, { ...data.message, verse: data.verse }]);
            }
            if (data.safety === 'sos') setSosNotice(true);
        } catch {
            setError('Sin conexión. Tu mensaje quedó guardado si el servidor alcanzó a recibirlo.');
        } finally {
            setSending(false);
        }
    };

    const toggleVoice = () => {
        if (voiceListening) {
            recognitionRef.current?.stop();
            return;
        }
        const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setVoiceStatus('Tu navegador no admite dictado. Puedes escribir el mensaje.');
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'es-MX';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
            let transcript = '';
            for (let index = event.resultIndex; index < event.results.length; index += 1) {
                transcript += event.results[index][0].transcript;
            }
            setInput((current) => `${current.replace(/\s+$/, '')}${current ? ' ' : ''}${transcript}`.trim());
            window.requestAnimationFrame(resizeTextarea);
        };
        recognition.onend = () => {
            setVoiceListening(false);
            setVoiceStatus('Dictado terminado. Revisa el texto antes de enviarlo.');
        };
        recognition.onerror = () => {
            setVoiceListening(false);
            setVoiceStatus('No pudimos usar el micrófono. Puedes escribir el mensaje.');
        };
        recognitionRef.current = recognition;
        setVoiceStatus('Escuchando…');
        setVoiceListening(true);
        recognition.start();
    };

    const clearHistory = () => setClearHistoryOpen(true);

    const confirmClearHistory = async () => {
        if (clearHistoryBusy) return;
        setClearHistoryBusy(true);
        try {
            const response = await fetch('/api/ai/chat', { method: 'DELETE' });
            if (!response.ok) throw new Error('clear-history');
            setMessages([]);
            setClearHistoryOpen(false);
            setSuccessNotice('Historial borrado.');
        } catch {
            setError('No pudimos borrar el historial.');
        } finally {
            setClearHistoryBusy(false);
        }
    };

    return (
        <main className={styles.page}>
            <header className={`${styles.header} ui-surface-glass`}>
                <Link href="/dashboard" className={`${styles.headerButton} rounded-circle d-flex align-items-center justify-content-center p-0`} aria-label="Volver al inicio">
                    <ArrowLeft size={20} aria-hidden="true" />
                </Link>
                <div className={styles.headerIdentity}>
                    <div className={styles.miniFlame} aria-hidden="true"><Flame size={18} /></div>
                    <div>
                        <span className="d-block small text-muted">Privado y seguro</span>
                        <h1 className="h4 mb-0 fw-bold">Habla con Llami</h1>
                    </div>
                </div>
                <button type="button" className={`${styles.headerButton} rounded-circle d-flex align-items-center justify-content-center p-0`} onClick={clearHistory} aria-label="Borrar historial privado">
                    <Trash2 size={18} aria-hidden="true" />
                </button>
            </header>

            <section className={styles.quota} aria-label="Mensajes disponibles">
                <div className="d-flex justify-content-between gap-3 align-items-center">
                    <span className="small fw-semibold">{remaining} de {AI_CHAT_LIMIT} mensajes disponibles</span>
                    <span className="small text-muted">{friendlyTime(resetAt)}</span>
                </div>
                <div className={styles.quotaBar} aria-hidden="true"><span style={{ width: `${(remaining / AI_CHAT_LIMIT) * 100}%` }} /></div>
            </section>

            <section className={styles.roleScroller} aria-label="Enfoque de conversación">
                {ROLE_OPTIONS.map(({ id, label, description, icon: Icon }) => (
                    <button key={id} type="button" className={`${styles.roleButton} ${mode === id ? styles.roleButtonActive : ''}`} onClick={() => setMode(id)} aria-pressed={mode === id}>
                        <Icon size={18} aria-hidden="true" />
                        <span><strong>{label}</strong><small>{description}</small></span>
                    </button>
                ))}
            </section>

            <AnimatePresence>
                {showContextPrompt && (!contextConsentGiven || !contextEnabled) && (
                    <motion.section initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`${styles.contextCard} ui-surface-glass`} aria-labelledby="context-title">
                        <div className={styles.contextIcon}><ShieldCheck size={20} aria-hidden="true" /></div>
                        <div className="flex-grow-1">
                            <h2 id="context-title" className="h6 fw-bold mb-1">Respuestas más personales</h2>
                            <p className="small text-muted mb-3">Si aceptas, Llami podrá usar tu primer nombre y tus luchas activas. El chat se procesa en NVIDIA y permanece privado en Conecta+.</p>
                            <div className="d-flex flex-wrap gap-2">
                                <button type="button" className={`${styles.contextAction} btn btn-primary rounded-pill px-3`} onClick={() => updateContext(true)}><Check size={16} className="me-1" />Activar contexto</button>
                                <button type="button" className={`${styles.contextAction} btn btn-light rounded-pill px-3`} onClick={() => setShowContextPrompt(false)}>Ahora no</button>
                            </div>
                        </div>
                        <button type="button" className={styles.contextClose} onClick={() => setShowContextPrompt(false)} aria-label="Cerrar aviso de contexto"><X size={17} aria-hidden="true" /></button>
                    </motion.section>
                )}
            </AnimatePresence>

            <section className={styles.conversation} aria-live="polite" aria-busy={sending}>
                {loading ? (
                    <div className={`${styles.emptyState} ui-surface-elevated`}><div className={styles.loadingDot} />Cargando tu espacio seguro…</div>
                ) : messages.length === 0 ? (
                    <div className={`${styles.emptyState} ui-surface-elevated`}>
                        <div className={styles.llamiFrame}><LlamiMascot streak={streak} level={mascotLevel} name={mascotName} expression="happy" /></div>
                        <p className="small text-muted mb-1">Hola, {userFirstName}</p>
                        <h2 className="h3 fw-bold mb-2">¿Qué traes hoy en el corazón?</h2>
                        <p className="text-muted mb-4">Puedes hablar con Llami de tu fe, tus preguntas o una lucha. Aquí puedes empezar sin filtros.</p>
                        <div className={styles.starterList}>
                            {STARTERS.map((starter) => <button key={starter} type="button" className={styles.starterButton} onClick={() => sendMessage(undefined, starter)}>{starter}</button>)}
                        </div>
                    </div>
                ) : (
                    <div className={styles.messageList}>
                        {messages.map((message) => (
                            <motion.article key={message.id} initial={{ opacity: 0, y: reduceMotion ? 0 : 12, filter: reduceMotion ? 'none' : 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }} className={`${styles.messageRow} ${message.role === 'USER' ? styles.userRow : styles.assistantRow}`}>
                                {message.role === 'ASSISTANT' && <div className={styles.messageAvatar} aria-hidden="true"><Flame size={16} /></div>}
                                <div className={`${styles.messageBubble} ${message.role === 'USER' ? styles.userBubble : styles.assistantBubble}`}>
                                    <p className="mb-0">{message.content}</p>
                                    {message.verse && <div className={styles.verseCard}><strong>{message.verse.reference}</strong><span>{message.verse.text}</span></div>}
                                </div>
                            </motion.article>
                        ))}
                        {sending && <div className={styles.typing} role="status" aria-live="polite"><span /><span /><span /> Llami está pensando…</div>}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </section>

            {sosNotice && <div className={`${styles.sosNotice} ui-surface`}><ShieldCheck size={18} aria-hidden="true" /><span>Tu seguridad importa. <Link href="/dashboard/sos">Abrir ayuda SOS</Link> o contacta a alguien de confianza ahora.</span></div>}
            {successNotice && <div className={`${styles.successNotice} ui-surface`} role="status">{successNotice}</div>}
            {error && <div className={`${styles.errorNotice} ui-surface`} role="status">{error}</div>}

            <AnimatePresence initial={false}>
                {clearHistoryOpen && (
                    <motion.div
                        className={styles.clearDialogBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.15, ease: 'easeOut' } }}
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget && !clearHistoryBusy) setClearHistoryOpen(false);
                        }}
                    >
                        <motion.section
                            className={`${styles.clearDialog} ui-surface-glass`}
                            role="alertdialog"
                            aria-modal="true"
                            aria-labelledby="clear-history-title"
                            aria-describedby="clear-history-description"
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 12, filter: reduceMotion ? 'none' : 'blur(4px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : 12, filter: reduceMotion ? 'none' : 'blur(4px)', transition: { duration: 0.15, ease: 'easeOut' } }}
                            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                        >
                            <div className={styles.dialogHeader}>
                                <div className={styles.dialogIcon}><Trash2 size={19} aria-hidden="true" /></div>
                                <button ref={clearDialogCloseRef} type="button" className={styles.dialogClose} onClick={() => setClearHistoryOpen(false)} disabled={clearHistoryBusy} aria-label="Cerrar confirmación"><X size={18} aria-hidden="true" /></button>
                            </div>
                            <h2 id="clear-history-title" className="h5 fw-bold mb-2">¿Borrar tu historial?</h2>
                            <p id="clear-history-description" className="text-muted mb-4">Se eliminará tu conversación privada con Llami. Esta acción no se puede deshacer.</p>
                            <div className={styles.dialogActions}>
                                <button type="button" className={styles.dialogSecondary} onClick={() => setClearHistoryOpen(false)} disabled={clearHistoryBusy}>Conservar historial</button>
                                <button type="button" className={styles.dialogDanger} onClick={() => void confirmClearHistory()} disabled={clearHistoryBusy}>{clearHistoryBusy ? 'Borrando…' : 'Borrar historial'}</button>
                            </div>
                        </motion.section>
                    </motion.div>
                )}
            </AnimatePresence>

            <form className={`${styles.composer} ui-surface-glass`} onSubmit={sendMessage}>
                <label className="visually-hidden" htmlFor="llami-message">Escribe tu mensaje</label>
                <textarea ref={textareaRef} id="llami-message" value={input} onChange={(event) => { setInput(event.target.value); resizeTextarea(); }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Escribe lo que llevas dentro…" rows={1} maxLength={2000} disabled={sending || remaining <= 0} />
                <button type="button" className={`${styles.iconButton} ${voiceListening ? styles.iconButtonActive : ''}`} onClick={toggleVoice} aria-label={voiceListening ? 'Detener dictado' : 'Usar micrófono'} aria-pressed={voiceListening} disabled={sending}>
                    {voiceListening ? <MicOff size={20} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
                </button>
                <button type="submit" className={`${styles.sendButton} btn btn-primary`} disabled={!input.trim() || sending || remaining <= 0} aria-label="Enviar mensaje"><Send size={19} aria-hidden="true" /></button>
            </form>
            <div className={styles.footerMeta}>
                <span>{contextEnabled ? 'Contexto personal activado' : 'Contexto personal desactivado'}</span>
                {contextEnabled ? <button type="button" onClick={() => updateContext(false)}>Desactivar</button> : <button type="button" onClick={() => setShowContextPrompt(true)}>Configurar contexto</button>}
                {voiceStatus && <span className={styles.voiceStatus} role="status" aria-live="polite">{voiceStatus}</span>}
            </div>
        </main>
    );
}
