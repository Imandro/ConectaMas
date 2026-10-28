export const MOBILE_NAV_HREFS = [
    '/dashboard',
    '/dashboard/devotionals',
    '/dashboard/bible',
    '/dashboard/prayer',
    '/dashboard/games',
    '/dashboard/chat',
] as const;

export function isMobilePrimaryNav(pathname: string) {
    return MOBILE_NAV_HREFS.some((href) => pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}/`)));
}
