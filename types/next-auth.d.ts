import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            // Removed extra fields to keep session light
        } & DefaultSession["user"];
    }

    interface User {
        // Standard User fields are enough, add specific optional if strictly needed for auth flow
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        // Removed extra fields
    }
}
