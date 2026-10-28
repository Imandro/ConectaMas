import Link from "next/link";
import { ArrowLeft, Award, Clock3, Gamepad2, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";

export function GameShell({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <main className={`ui-game-shell game-surface-primary ${className}`}>{children}</main>;
}

export function GameHeader({
    title,
    subtitle,
    backHref = "/dashboard/games",
    icon = <Gamepad2 size={22} aria-hidden="true" />,
    children,
}: {
    title: string;
    subtitle?: string;
    backHref?: string;
    icon?: ReactNode;
    children?: ReactNode;
}) {
    return (
        <header className="game-header ui-surface-elevated">
            <Link href={backHref} className="game-icon-button" aria-label="Volver a juegos">
                <ArrowLeft size={20} aria-hidden="true" />
            </Link>
            <div className="flex-grow-1 min-w-0">
                <div className="d-flex align-items-center gap-2">
                    <span className="game-header-icon" aria-hidden="true">{icon}</span>
                    <h1 className="h4 fw-bold mb-0 text-truncate">{title}</h1>
                </div>
                {subtitle && <p className="small mb-0 mt-1 text-muted">{subtitle}</p>}
            </div>
            {children}
        </header>
    );
}

export function GameStats({ score, timeLeft, label = "Puntos" }: { score: number; timeLeft?: number | null; label?: string }) {
    return (
        <div className="game-stats" aria-live="polite">
            <span><Award size={16} aria-hidden="true" /> {label}: <strong>{score}</strong></span>
            {timeLeft != null && <span><Clock3 size={16} aria-hidden="true" /> {Math.max(0, timeLeft)}s</span>}
        </div>
    );
}

export function GameResult({ title, message, score, onRestart, restartLabel = "Jugar de nuevo" }: {
    title: string;
    message: string;
    score: number;
    onRestart: () => void;
    restartLabel?: string;
}) {
    return (
        <section className="game-result ui-surface-elevated text-center" aria-live="polite">
            <Award size={48} className="text-warning mb-3" aria-hidden="true" />
            <h2 className="h3 fw-bold mb-2">{title}</h2>
            <p className="text-muted mb-3">{message}</p>
            <p className="game-final-score">{score}</p>
            <button type="button" className="btn btn-warning rounded-pill px-4 py-3 fw-bold game-action" onClick={onRestart}>
                <RotateCcw size={18} aria-hidden="true" /> {restartLabel}
            </button>
        </section>
    );
}

