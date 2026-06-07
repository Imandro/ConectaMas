import { saveGameScore as serverSaveGameScore, getBestScores as serverGetBestScores } from "@/app/actions/gameScore";

export async function saveGameScore(
    gameType: string,
    score: number,
    maxScore: number | null,
    timeSpent: number | null
) {
    try {
        const res = await serverSaveGameScore(gameType, score, maxScore, timeSpent);
        if (res && res.success) {
            // Also update local storage so it's in sync
            const localKey = `best_score_${gameType}`;
            const currentBest = parseInt(localStorage.getItem(localKey) || "0");
            if (score > currentBest) {
                localStorage.setItem(localKey, score.toString());
            }
            return res;
        }
    } catch (err) {
        console.warn(`Server saveGameScore failed for ${gameType}, falling back to localStorage:`, err);
    }

    // Local fallback
    if (typeof window !== "undefined") {
        const localKey = `best_score_${gameType}`;
        const currentBest = parseInt(localStorage.getItem(localKey) || "0");
        const isNewRecord = score > currentBest;
        if (isNewRecord) {
            localStorage.setItem(localKey, score.toString());
        }

        return {
            success: true,
            xpGained: 0,
            isNewRecord,
            gameScore: { id: "local_" + Date.now(), score }
        };
    }

    return {
        success: false,
        error: "Window undefined"
    };
}

export async function getBestScores(gameType: string) {
    try {
        const res = await serverGetBestScores(gameType);
        if (res && res.success) {
            // Update local storage to keep in sync
            if (typeof window !== "undefined") {
                localStorage.setItem(`best_score_${gameType}`, (res.bestScore ?? 0).toString());
            }
            return res;
        }
    } catch (err) {
        console.warn(`Server getBestScores failed for ${gameType}, falling back to localStorage:`, err);
    }

    // Local fallback
    if (typeof window !== "undefined") {
        const localKey = `best_score_${gameType}`;
        const bestScore = parseInt(localStorage.getItem(localKey) || "0");
        return {
            success: true,
            bestScore,
            totalGames: 0,
            recentScores: []
        };
    }

    return {
        success: true,
        bestScore: 0,
        totalGames: 0,
        recentScores: []
    };
}
