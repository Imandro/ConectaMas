
const VAPID_PUBLIC_KEY = "BGBZ1Q1LwyPolkAPnshPKwQ6NNijzuu8_lqDziuABVb6z60pX1uwKsw1jgO-rCabt5QIf_90OSNqNRgXKti9zyI";

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    // Node.js doesn't have window.atob, use Buffer instead
    const rawData = Buffer.from(base64, 'base64').toString('binary');

    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

try {
    const key = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    console.log("Key length:", key.length);
    console.log("First byte:", key[0]);

    if (key.length === 65) {
        console.log("Valid P-256 public key length.");
    } else {
        console.error("Invalid length! Expected 65 bytes for P-256.");
    }
} catch (e) {
    console.error("Error decoding key:", e);
}
