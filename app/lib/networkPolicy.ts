export function isPollingAllowed(online: boolean, hidden: boolean) {
    return online && !hidden;
}
