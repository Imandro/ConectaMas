export function getJwtSecret(): string {
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;
    if (!secret) throw new Error('JWT secret is not configured');
    return secret;
}
