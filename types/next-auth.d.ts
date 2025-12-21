import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            leaderPhone?: string | null;
            hasSeenTutorialTour?: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        leaderPhone?: string | null;
        hasSeenTutorialTour?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        leaderPhone?: string | null;
        hasSeenTutorialTour?: boolean;
    }
}
