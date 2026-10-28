import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.conecta_plus.app',
  appName: 'Conecta+',
  webDir: 'www',
  loggingBehavior: 'none',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://conectaplus.app/?conecta_native=capacitor',
    cleartext: false,
    allowNavigation: ['conectaplus.app', 'www.conectaplus.app'],
  },
};

export default config;
