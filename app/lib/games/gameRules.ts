import type { GameTurnAction, NewGameType } from "./gameTypes";

export type ExpectedGameAnswer =
    | { pairIdByCard: Record<string, string> }
    | { correctOptionId: string }
    | { orderedIds: string[] };

export function scoreGameTurn(
    type: NewGameType,
    action: GameTurnAction,
    expected: ExpectedGameAnswer
) {
    let correct = false;

    if (type === "MEMORY" && action.kind === "MEMORY" && "pairIdByCard" in expected) {
        const [first, second] = action.cardIds;
        correct = Boolean(first && second && first !== second && expected.pairIdByCard[first] === expected.pairIdByCard[second]);
    }

    if (type === "CHARACTER_EVENT" && action.kind === "CHARACTER_EVENT" && "correctOptionId" in expected) {
        correct = action.optionId === expected.correctOptionId;
    }

    if (type === "BIBLE_ORDER" && action.kind === "BIBLE_ORDER" && "orderedIds" in expected) {
        correct = action.orderedIds.length === expected.orderedIds.length
            && action.orderedIds.every((id, index) => id === expected.orderedIds[index]);
    }

    return { correct, points: correct ? 10 : 0 };
}

export function isValidTurnAction(type: NewGameType, action: unknown): action is GameTurnAction {
    if (!action || typeof action !== "object" || !("kind" in action)) return false;
    const candidate = action as Record<string, unknown>;
    if (candidate.kind !== type) return false;

    if (type === "MEMORY") {
        return Array.isArray(candidate.cardIds)
            && candidate.cardIds.length === 2
            && candidate.cardIds.every((id) => typeof id === "string" && id.length > 0)
            && candidate.cardIds[0] !== candidate.cardIds[1];
    }

    if (type === "CHARACTER_EVENT") return typeof candidate.optionId === "string" && candidate.optionId.length > 0;

    return Array.isArray(candidate.orderedIds)
        && candidate.orderedIds.length > 1
        && candidate.orderedIds.every((id) => typeof id === "string" && id.length > 0)
        && new Set(candidate.orderedIds).size === candidate.orderedIds.length;
}

