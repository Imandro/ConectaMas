import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.conecta_plus.app',
  appName: 'Conecta+',
  webDir: 'www',
  loggingBehavior: 'none',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://conectamas.live/?conecta_native=capacitor',
    cleartext: false,
    allowNavigation: ['conectamas.live', 'www.conectamas.live'],
  },
};

export default config;
