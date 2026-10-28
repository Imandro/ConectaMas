import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            preferredLanguage?: string;
            region?: string;
            // Removed extra fields to keep session light
        } & DefaultSession["user"];
    }

    interface User {
        preferredLanguage?: string;
        region?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        preferredLanguage?: string;
        region?: string;
        // Removed extra fields
    }
}
