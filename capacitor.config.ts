import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.conectaplus.app',
  appName: 'Conecta+',
  webDir: 'out',
  server: {
    url: 'https://conecta-mas.vercel.app', // Nueva URL de producción
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
