"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock3, HelpCircle, Layers3, Shuffle, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";
import { saveGameScore } from "../clientGameScore";
import { memoryPairs } from "@/app/data/games/memoryData";
import { characterEvents } from "@/app/data/games/characterEventData";
import { bibleOrderChallenges } from "@/app/data/games/bibleOrderData";
import { GameHeader, GameResult, GameShell, GameStats } from "./GameShell";

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

type MemoryCard = { id: string; pairId: string; label: string; reference: string };

function useGameClock(active: boolean, initialSeconds: number, onExpire: () => void) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!active) return;
        const timer = window.setInterval(() => {
            setTimeLeft((current) => {
                if (current <= 1) {
                    window.clearInterval(timer);
                    onExpireRef.current();
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
        return () => window.clearInterval(timer);
    }, [active, initialSeconds]);

    return { timeLeft, resetClock: () => setTimeLeft(initialSeconds) };
}

export function MemoryGameView() {
    const { t } = useLanguage();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [cards, setCards] = useState<MemoryCard[]>([]);
    const [flipped, setFlipped] = useState<string[]>([]);
    const [matched, setMatched] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const scoreRef = useRef(0);
    const saved = useRef(false);
    const finish = () => {
        if (saved.current || !started) return;
        saved.current = true;
        setFinished(true);
        void saveGameScore("bible-memory", scoreRef.current, memoryPairs.length * 10, 60).catch(() => undefined);
    };
    const { timeLeft } = useGameClock(started && !finished, 60, finish);

    const start = () => {
        saved.current = false;
        setCards(shuffle(memoryPairs.flatMap((pair) => [
            { id: `${pair.id}-front`, pairId: pair.id, label: pair.front, reference: pair.reference },
            { id: `${pair.id}-back`, pairId: pair.id, label: pair.back, reference: pair.reference },
        ])));
        setFlipped([]);
        setMatched([]);
        setScore(0);
        scoreRef.current = 0;
        setFinished(false);
        setStarted(true);
    };

    const flip = (card: MemoryCard) => {
        if (!started || finished || flipped.length >= 2 || flipped.includes(card.id) || matched.includes(card.pairId)) return;
        const next = [...flipped, card.id];
        setFlipped(next);
        if (next.length !== 2) return;
        const first = cards.find((item) => item.id === next[0]);
        const second = cards.find((item) => item.id === next[1]);
        window.setTimeout(() => {
            if (first && second && first.pairId === second.pairId) {
                const nextMatched = [...matched, first.pairId];
                setMatched(nextMatched);
                scoreRef.current += 10;
                setScore(scoreRef.current);
                if (nextMatched.length === memoryPairs.length) finish();
            }
            setFlipped([]);
        }, 500);
    };

    return (
        <GameShell className="container py-4">
            <GameHeader title={t.game_ui.memory_title} subtitle={t.game_ui.memory_desc} icon={<Layers3 size={22} />}>
                {started && !finished && <GameStats score={score} timeLeft={timeLeft} label={t.game_ui.score} />}
            </GameHeader>
            {!started ? (
                <section className="game-result ui-surface-elevated text-center">
                    <Layers3 size={48} className="text-warning mb-3" aria-hidden="true" />
                    <h2 className="h3 fw-bold">{t.game_ui.memory_instruction}</h2>
                    <p className="text-muted">{t.game_ui.memory_found.replace("{current}", "0").replace("{total}", String(memoryPairs.length))}</p>
                    <button type="button" className="btn btn-warning rounded-pill px-4 py-3 fw-bold game-action" onClick={start}>{t.game_ui.start}</button>
                </section>
            ) : finished ? (
                <GameResult title={t.game_ui.result_title} message={t.game_ui.result_message} score={score} onRestart={start} restartLabel={t.game_ui.restart} />
            ) : (
                <section aria-label={t.game_ui.memory_instruction} className="game-memory-grid">
                    {cards.map((card) => {
                        const visible = flipped.includes(card.id) || matched.includes(card.pairId);
                        return (
                            <button type="button" key={card.id} className={`game-memory-card ${visible ? "is-visible" : ""}`} onClick={() => flip(card)} aria-label={visible ? `${card.label}, ${card.reference}` : "Carta oculta"}>
                                {visible ? <><strong>{card.label}</strong><small>{card.reference}</small></> : <HelpCircle size={28} aria-hidden="true" />}
                            </button>
                        );
                    })}
                </section>
            )}
        </GameShell>
    );
}

export function CharacterEventGameView() {
    const { t } = useLanguage();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [round, setRound] = useState(0);
    const [score, setScore] = useState(0);
    const scoreRef = useRef(0);
    const [feedback, setFeedback] = useState<boolean | null>(null);
    const saved = useRef(false);
    const current = characterEvents[round % characterEvents.length];
    const options = useMemo(() => shuffle([
        current,
        ...characterEvents.filter((item) => item.id !== current.id).slice((round % 4), (round % 4) + 2),
    ]), [current, round]);
    const finish = () => {
        if (saved.current) return;
        saved.current = true;
        setFinished(true);
        void saveGameScore("character-event", scoreRef.current, 100, 200).catch(() => undefined);
    };
    const { timeLeft, resetClock } = useGameClock(started && !finished && feedback === null, 20, finish);

    const start = () => {
        saved.current = false;
        setRound(0);
        setScore(0);
        scoreRef.current = 0;
        setFeedback(null);
        setFinished(false);
        setStarted(true);
        resetClock();
    };

    const answer = (id: string) => {
        if (!started || finished || feedback !== null) return;
        const correct = id === current.id;
        setFeedback(correct);
        if (correct) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
        }
        window.setTimeout(() => {
            if (round >= 9) finish();
            else {
                setRound((value) => value + 1);
                setFeedback(null);
                resetClock();
            }
        }, 650);
    };

    return (
        <GameShell className="container py-4">
            <GameHeader title={t.game_ui.character_title} subtitle={t.game_ui.character_desc} icon={<Sparkles size={22} />}>
                {started && !finished && <GameStats score={score} timeLeft={timeLeft} label={t.game_ui.score} />}
            </GameHeader>
            {!started ? (
                <section className="game-result ui-surface-elevated text-center">
                    <Sparkles size={48} className="text-warning mb-3" aria-hidden="true" />
                    <h2 className="h3 fw-bold">{t.game_ui.character_title}</h2>
                    <p className="text-muted">{t.game_ui.choose}</p>
                    <button type="button" className="btn btn-warning rounded-pill px-4 py-3 fw-bold game-action" onClick={start}>{t.game_ui.start}</button>
                </section>
            ) : finished ? (
                <GameResult title={t.game_ui.result_title} message={t.game_ui.result_message} score={score} onRestart={start} restartLabel={t.game_ui.restart} />
            ) : (
                <section className="ui-surface-elevated game-question-card" aria-live="polite">
                    <p className="small text-muted mb-2">{t.game_ui.round.replace("{current}", String(round + 1)).replace("{total}", "10")}</p>
                    <h2 className="h3 fw-bold mb-2">{current.character}</h2>
                    <p className="text-muted mb-4">{current.hint}</p>
                    <p className="fw-bold mb-3">{t.game_ui.choose}</p>
                    <div className="d-grid gap-2">
                        {options.map((option) => (
                            <button type="button" key={option.id} className={`game-choice p-3 ${feedback !== null && option.id === current.id ? "border-success" : ""}`} onClick={() => answer(option.id)} disabled={feedback !== null}>
                                <span className="d-flex align-items-center justify-content-between gap-2"><span>{option.event}</span>{feedback !== null && option.id === current.id && <Check className="text-success" size={18} aria-hidden="true" />}</span>
                            </button>
                        ))}
                    </div>
                    {feedback !== null && <p className={`mt-3 mb-0 fw-bold ${feedback ? "text-success" : "text-danger"}`} role="status">{feedback ? t.game_ui.correct : t.game_ui.incorrect}</p>}
                </section>
            )}
        </GameShell>
    );
}

export function BibleOrderGameView() {
    const { t } = useLanguage();
    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);
    const [round, setRound] = useState(0);
    const [selected, setSelected] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const scoreRef = useRef(0);
    const [feedback, setFeedback] = useState<boolean | null>(null);
    const [items, setItems] = useState(() => shuffle(bibleOrderChallenges[0].items));
    const saved = useRef(false);
    const current = bibleOrderChallenges[round % bibleOrderChallenges.length];
    const finish = () => {
        if (saved.current) return;
        saved.current = true;
        setFinished(true);
        void saveGameScore("bible-order", scoreRef.current, 50, 150).catch(() => undefined);
    };
    const { timeLeft, resetClock } = useGameClock(started && !finished && feedback === null, 30, finish);

    const start = () => {
        saved.current = false;
        setRound(0);
        setSelected([]);
        setScore(0);
        scoreRef.current = 0;
        setFeedback(null);
        setItems(shuffle(bibleOrderChallenges[0].items));
        setFinished(false);
        setStarted(true);
        resetClock();
    };

    const select = (id: string) => {
        if (!started || finished || feedback !== null || selected.includes(id)) return;
        const next = [...selected, id];
        setSelected(next);
        if (next.length !== items.length) return;
        const correct = next.every((value, index) => value === current.orderedIds[index]);
        setFeedback(correct);
        if (correct) {
            scoreRef.current += 10;
            setScore(scoreRef.current);
        }
        window.setTimeout(() => {
            if (round >= 4) finish();
            else {
                const nextRound = round + 1;
                setRound(nextRound);
                setSelected([]);
                setFeedback(null);
                setItems(shuffle(bibleOrderChallenges[nextRound].items));
                resetClock();
            }
        }, 700);
    };

    return (
        <GameShell className="container py-4">
            <GameHeader title={t.game_ui.order_title} subtitle={t.game_ui.order_desc} icon={<Shuffle size={22} />}>
                {started && !finished && <GameStats score={score} timeLeft={timeLeft} label={t.game_ui.score} />}
            </GameHeader>
            {!started ? (
                <section className="game-result ui-surface-elevated text-center">
                    <Shuffle size={48} className="text-warning mb-3" aria-hidden="true" />
                    <h2 className="h3 fw-bold">{t.game_ui.order_title}</h2>
                    <p className="text-muted">{t.game_ui.order_instruction}</p>
                    <button type="button" className="btn btn-warning rounded-pill px-4 py-3 fw-bold game-action" onClick={start}>{t.game_ui.start}</button>
                </section>
            ) : finished ? (
                <GameResult title={t.game_ui.result_title} message={t.game_ui.result_message} score={score} onRestart={start} restartLabel={t.game_ui.restart} />
            ) : (
                <section className="ui-surface-elevated game-question-card" aria-live="polite">
                    <div className="d-flex justify-content-between gap-3 mb-3"><p className="small text-muted mb-0">{current.title}</p><span className="small text-muted"><Clock3 size={15} aria-hidden="true" /> {timeLeft}s</span></div>
                    <h2 className="h5 fw-bold mb-3">{t.game_ui.order_instruction}</h2>
                    <div className="d-grid gap-2">
                        {items.map((item) => {
                            const position = selected.indexOf(item.id);
                            return <button type="button" key={item.id} className="game-choice p-3" onClick={() => select(item.id)} disabled={selected.includes(item.id) || feedback !== null}><span className="d-flex align-items-center gap-3"><span className="badge rounded-pill bg-primary">{position >= 0 ? position + 1 : "·"}</span>{item.label}</span></button>;
                        })}
                    </div>
                    {feedback !== null && <p className={`mt-3 mb-0 fw-bold ${feedback ? "text-success" : "text-danger"}`} role="status">{feedback ? <><Check size={18} aria-hidden="true" /> {t.game_ui.correct}</> : <><X size={18} aria-hidden="true" /> {t.game_ui.incorrect}</>}</p>}
                </section>
            )}
        </GameShell>
    );
}

