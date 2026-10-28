export const NEW_GAME_TYPES = ["MEMORY", "CHARACTER_EVENT", "BIBLE_ORDER"] as const;

export type NewGameType = (typeof NEW_GAME_TYPES)[number];
export type GameRoomType = "HOT_POTATO" | NewGameType;

export type GameTurnAction =
    | { kind: "MEMORY"; cardIds: [string, string] }
    | { kind: "CHARACTER_EVENT"; optionId: string }
    | { kind: "BIBLE_ORDER"; orderedIds: string[] };

export const GAME_TURN_SECONDS = 20;
export const GAME_MAX_PLAYERS = 8;

export function isNewGameType(value: string): value is NewGameType {
    return (NEW_GAME_TYPES as readonly string[]).includes(value);
}

