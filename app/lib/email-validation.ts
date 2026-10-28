export const ALLOWED_EMAIL_DOMAINS = ['gmail.com', 'icloud.com', 'yahoo.com', 'outlook.com'] as const;

export const ALLOWED_EMAIL_ERROR = 'Usa un correo válido de Gmail, iCloud, Yahoo u Outlook';

export function isAllowedEmail(value: unknown): value is string {
    if (typeof value !== 'string') return false;

    const match = value.trim().toLowerCase().match(/^[^@\s]+@([^@\s]+)$/);
    return match !== null && ALLOWED_EMAIL_DOMAINS.includes(match[1] as typeof ALLOWED_EMAIL_DOMAINS[number]);
}

export function isEmailIdentifier(value: unknown): boolean {
    return typeof value === 'string' && /^[^@\s]+@/.test(value.trim());
}
