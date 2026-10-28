export function isCapacitorRuntime() {
    if (typeof window === 'undefined') return false;
    const markedByUrl = new URLSearchParams(window.location.search).get('conecta_native') === 'capacitor';
    let markedByStorage = false;
    try {
        if (markedByUrl) localStorage.setItem('conecta_native', 'capacitor');
        markedByStorage = localStorage.getItem('conecta_native') === 'capacitor';
    } catch { /* storage may be unavailable */ }
    return markedByUrl || markedByStorage || Boolean((window as Window & { Capacitor?: unknown }).Capacitor) || navigator.userAgent.includes('Capacitor');
}
