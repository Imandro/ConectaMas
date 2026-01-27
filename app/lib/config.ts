export const config = {
    vapid: {
        publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BGBZ1Q1LwyPolkAPnshPKwQ6NNijzuu8_lqDziuABVb6z60pX1uwKsw1jgO-rCabt5QIf_90OSNqNRgXKti9zyI",
        privateKey: process.env.VAPID_PRIVATE_KEY || "6t4keJpbZzCphI_A5O_XVKOv7uWL9CeI2H0xNmE2Hgc",
        subject: process.env.VAPID_SUBJECT || "mailto:admin@conectaplus.app",
    },
};
