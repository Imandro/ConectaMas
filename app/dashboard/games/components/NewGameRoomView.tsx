"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, Copy, Layers3, LogOut, Play, Shuffle, Sparkles, Users } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/app/LanguageContext";
import { getRoomStatus, leaveGameRoom, startGame, submitGameTurn } from "../actions";
import { GameShell, GameStats } from "./GameShell";
import { isPollingAllowed } from "@/app/lib/networkPolicy";
import type { GameTurnAction } from "@/app/lib/games/gameTypes";

type Player = { id: string; userId: string; status: string; score: number; user: { name: string | null } };
type Room = { id: string; code: string; type: string; status: string; currentTurnUserId: string | null; activeQuestionId: string | null; bombExplodesAt: Date | string | null; currentQuestion: string | null; players: Player[] };
type Question = { type: string; round: number; totalRounds: number; questionId?: string; character?: string; hint?: string; options?: { id: string; label: string }[]; items?: { id: string; label: string }[]; cards?: { id: string; label: string; reference: string }[]; matchedPairIds?: string[] };

const parseQuestion = (value: string | null): Question | null => {
    if (!value) return null;
    try { return JSON.parse(value) as Question; } catch { return null; }
};

export default function NewGameRoomView({ initialRoom, currentUserId, roomId }: { initialRoom: Room; currentUserId: string; roomId: string }) {
    const { t } = useLanguage();
    const [room, setRoom] = useState(initialRoom);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const question = useMemo(() => parseQuestion(room.currentQuestion), [room.currentQuestion]);
    const currentPlayer = room.players.find((player) => player.userId === room.currentTurnUserId);
    const isHost = room.players[0]?.userId === currentUserId;
    const isMyTurn = room.currentTurnUserId === currentUserId;

    const refresh = useCallback(async () => {
        if (!isPollingAllowed(navigator.onLine, document.hidden)) return;
        const result = await getRoomStatus(roomId);
        if (result.success && result.room) setRoom(result.room as Room);
    }, [roomId]);

    useEffect(() => {
        const delay = room.status === "PLAYING" ? 2000 : 6000;
        const interval = window.setInterval(() => void refresh(), delay);
        return () => window.clearInterval(interval);
    }, [refresh, room.status]);

    useEffect(() => {
        if (!room.bombExplodesAt || room.status !== "PLAYING") {
            setTimeLeft(null);
            return;
        }
        const update = () => setTimeLeft(Math.max(0, Math.ceil((new Date(room.bombExplodesAt as string).getTime() - Date.now()) / 1000)));
        update();
        const interval = window.setInterval(update, 1000);
        return () => window.clearInterval(interval);
    }, [room.bombExplodesAt, room.status]);

    useEffect(() => setSelected([]), [room.activeQuestionId]);

    const submit = async (action: GameTurnAction) => {
        if (!room.activeQuestionId || !isMyTurn || loading) return;
        setLoading(true);
        const result = await submitGameTurn(roomId, room.activeQuestionId, action);
        if (!result.success) toast.error(result.error || t.game_ui.incorrect);
        else toast.success(result.correct ? t.game_ui.correct : t.game_ui.incorrect);
        await refresh();
        setLoading(false);
    };

    const leave = async () => {
        setLoading(true);
        const result = await leaveGameRoom(roomId);
        if (result.success) window.location.href = "/dashboard/games";
        else toast.error(result.error || t.game_ui.incorrect);
        setLoading(false);
    };

    const start = async () => {
        setLoading(true);
        const result = await startGame(roomId);
        if (!result.success) toast.error(result.error || t.game_ui.incorrect);
        await refresh();
        setLoading(false);
    };

    const copyLink = async () => {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(t.game_ui.share);
    };

    const title = room.type === "MEMORY" ? t.game_ui.memory_title : room.type === "CHARACTER_EVENT" ? t.game_ui.character_title : t.game_ui.order_title;
    const icon = room.type === "MEMORY" ? <Layers3 size={22} /> : room.type === "CHARACTER_EVENT" ? <Sparkles size={22} /> : <Shuffle size={22} />;

    return (
        <GameShell className="container py-4">
            <div className="game-header ui-surface-elevated">
                <span className="game-header-icon" aria-hidden="true">{icon}</span>
                <div className="flex-grow-1 min-w-0"><h1 className="h4 fw-bold mb-1 text-truncate">{title}</h1><p className="small text-muted mb-0">{t.game_ui.room_game} · {room.code}</p></div>
                <button type="button" className="game-icon-button" onClick={copyLink} aria-label={t.game_ui.share}><Copy size={18} aria-hidden="true" /></button>
                <button type="button" className="game-icon-button" onClick={leave} disabled={loading} aria-label={t.game_ui.leave}><LogOut size={18} aria-hidden="true" /></button>
            </div>

            <section className="ui-surface-elevated game-room-panel">
                {room.status === "WAITING" && <div className="text-center py-4"><Users size={40} className="text-primary mb-3" aria-hidden="true" /><h2 className="h4 fw-bold">{t.game_ui.waiting}</h2><p className="text-muted">{t.game_ui.min_players}</p>{isHost && <button type="button" className="btn btn-primary rounded-pill px-4 py-3 fw-bold game-action" onClick={start} disabled={loading || room.players.length < 2}><Play size={18} aria-hidden="true" /> {t.game_ui.start}</button>}</div>}

                {room.status === "PLAYING" && question && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center gap-3 mb-4"><p className="small text-muted mb-0">{t.game_ui.round.replace("{current}", String(question.round + 1)).replace("{total}", String(question.totalRounds))}</p><GameStats score={room.players.find((player) => player.userId === currentUserId)?.score || 0} timeLeft={timeLeft} label={t.game_ui.score} /></div>
                        <p className={`fw-bold text-center mb-4 ${isMyTurn ? "text-primary" : "text-muted"}`}>{isMyTurn ? t.game_ui.your_turn : t.game_ui.turn_of.replace("{name}", currentPlayer?.user.name || "-")}</p>

                        {room.type === "MEMORY" && question.cards && <div className="game-memory-grid">{question.cards.map((card) => { const pairId = card.id.replace(/-(front|back)$/, ""); const visible = selected.includes(card.id) || question.matchedPairIds?.includes(pairId); return <button type="button" key={card.id} className={`game-memory-card ${visible ? "is-visible" : ""}`} disabled={!isMyTurn || loading || visible || selected.length >= 2} onClick={() => { const next = [...selected, card.id]; setSelected(next); if (next.length === 2) void submit({ kind: "MEMORY", cardIds: next as [string, string] }); }} aria-label={visible ? `${card.label}, ${card.reference}` : t.game_ui.memory_instruction}>{visible ? <><strong>{card.label}</strong><small>{card.reference}</small></> : <HelpIcon />}</button>; })}</div>}

                        {room.type === "CHARACTER_EVENT" && question.options && <div className="game-question-card"><p className="text-muted mb-2">{question.hint}</p><h2 className="h3 fw-bold mb-4">{question.character}</h2><div className="d-grid gap-2">{question.options.map((option) => <button type="button" key={option.id} className="game-choice p-3" disabled={!isMyTurn || loading} onClick={() => void submit({ kind: "CHARACTER_EVENT", optionId: option.id })}>{option.label}</button>)}</div></div>}

                        {room.type === "BIBLE_ORDER" && question.items && <OrderRoom title={t.game_ui.order_instruction} items={question.items} selected={selected} isMyTurn={isMyTurn} loading={loading} onSelect={(id) => { const next = [...selected, id]; setSelected(next); if (next.length === question.items?.length) void submit({ kind: "BIBLE_ORDER", orderedIds: next }); }} />}
                    </div>
                )}

                {room.status === "FINISHED" && <div className="text-center py-4"><Award size={44} className="text-warning mb-3" aria-hidden="true" /><h2 className="h4 fw-bold">{t.game_ui.game_finished}</h2><p className="text-muted">{t.game_ui.result_message}</p></div>}
            </section>

            <section className="ui-surface-elevated game-room-panel mt-3" aria-label={t.game_ui.players}><h2 className="h5 fw-bold mb-3"><Users size={18} aria-hidden="true" /> {t.game_ui.players}</h2><div className="d-grid gap-2">{[...room.players].sort((a, b) => b.score - a.score).map((player) => <div className="d-flex align-items-center justify-content-between gap-3 p-2 rounded-3" key={player.id}><span className="fw-bold text-truncate">{player.user.name || "-"}{player.userId === currentUserId ? " · Tú" : ""}</span><span className="badge bg-primary rounded-pill">{player.score}</span></div>)}</div></section>
        </GameShell>
    );
}

function HelpIcon() { return <span aria-hidden="true"><Sparkles size={24} /></span>; }

function OrderRoom({ title, items, selected, isMyTurn, loading, onSelect }: { title: string; items: { id: string; label: string }[]; selected: string[]; isMyTurn: boolean; loading: boolean; onSelect: (id: string) => void }) {
    return <div className="game-question-card"><h2 className="h5 fw-bold mb-3">{title}</h2><div className="d-grid gap-2">{items.map((item) => <button type="button" key={item.id} className="game-choice p-3" disabled={!isMyTurn || loading || selected.includes(item.id)} onClick={() => onSelect(item.id)}><span className="d-flex align-items-center gap-3"><span className="badge rounded-pill bg-primary">{selected.includes(item.id) ? selected.indexOf(item.id) + 1 : "·"}</span>{item.label}</span></button>)}</div></div>;
}

