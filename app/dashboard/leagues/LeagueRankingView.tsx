"use client";

import { useLanguage } from "@/app/LanguageContext";
import { Trophy, ArrowUp, ArrowDown, Info } from "lucide-react";
import UserAvatar from "@/app/components/UserAvatar";

interface RankingEntry {
    id: string;
    name: string | null;
    weeklyXP: number;
    league: string;
}

interface LeagueRankingViewProps {
    initialRanking: RankingEntry[];
    userLeague: string;
    currentUserId: string;
}

export default function LeagueRankingView({ initialRanking, userLeague, currentUserId }: LeagueRankingViewProps) {
    const { t } = useLanguage();

    const getLeagueColor = (league: string) => {
        switch (league) {
            case "BRONZE": return "#cd7f32";
            case "SILVER": return "#c0c0c0";
            case "GOLD": return "#ffd700";
            case "DIAMOND": return "#b9f2ff";
            case "LEGEND": return "#ff4500";
            default: return "#ccc";
        }
    };

    const leagueName = t.leagues.names[userLeague as keyof typeof t.leagues.names] || userLeague;

    return (
        <div className="league-ranking-view animate-fade-in">
            <div className="text-center mb-5">
                <div className="d-inline-flex align-items-center justify-content-center bg-white shadow-sm rounded-circle p-4 mb-3" style={{ border: `4px solid ${getLeagueColor(userLeague)}` }}>
                    <Trophy size={48} color={getLeagueColor(userLeague)} />
                </div>
                <h2 className="fw-bold mb-1">{t.leagues.title}</h2>
                <p className="text-muted">{t.leagues.league_ranking}: <span className="fw-bold text-primary">{leagueName}</span></p>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="card-header bg-white border-bottom-0 py-3 d-flex align-items-center justify-content-between">
                    <h5 className="mb-0 fw-bold">{t.leagues.league_ranking}</h5>
                    <div className="dropdown">
                        <button className="btn btn-link text-muted p-0" title={t.leagues.how_it_works}>
                            <Info size={18} />
                        </button>
                    </div>
                </div>
                <div className="list-group list-group-flush">
                    {initialRanking.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted mb-0">{t.leagues.no_rank}</p>
                        </div>
                    ) : (
                        initialRanking.map((player, index) => {
                            const isCurrentUser = player.id === currentUserId;
                            const isPromotionZone = index < 3;
                            const isDemotionZone = index >= initialRanking.length - 3 && initialRanking.length > 10;

                            return (
                                <div
                                    key={player.id}
                                    className={`list-group-item d-flex align-items-center gap-3 border-0 py-3 px-4 ${isCurrentUser ? 'bg-primary-subtle' : ''}`}
                                    style={{ borderLeft: isPromotionZone ? '4px solid #28a745' : isDemotionZone ? '4px solid #dc3545' : '4px solid transparent' }}
                                >
                                    <div className="fw-bold text-muted text-center" style={{ width: '30px' }}>
                                        {index + 1}
                                    </div>
                                    <div className="position-relative">
                                        <UserAvatar name={player.name} size={40} className="shadow-sm" />
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className={`fw-bold ${isCurrentUser ? 'text-primary' : 'text-dark'}`}>
                                            {player.name || "Usuario Anónimo"}
                                            {isCurrentUser && <span className="badge bg-primary ms-2 small" style={{ fontSize: '0.6rem' }}>TÚ</span>}
                                        </div>
                                        <div className="text-muted small d-flex align-items-center gap-1">
                                            {isPromotionZone && <ArrowUp size={12} className="text-success" />}
                                            {isDemotionZone && <ArrowDown size={12} className="text-danger" />}
                                            {player.weeklyXP} XP
                                        </div>
                                    </div>
                                    {isPromotionZone && index === 0 && (
                                        <div className="badge bg-warning text-dark rounded-pill px-3">
                                            🏆 Pro
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <div className="alert alert-info rounded-4 border-0 shadow-sm d-flex align-items-start gap-3">
                <Info className="flex-shrink-0 mt-1" />
                <div>
                    <h6 className="fw-bold mb-1">{t.leagues.how_it_works}</h6>
                    <p className="small mb-0">{t.leagues.rules}</p>
                </div>
            </div>

            <style jsx>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
