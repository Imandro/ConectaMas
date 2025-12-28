import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  server: {
    url: 'https://conecta-mas.vercel.app',
    androidScheme: 'https',
    cleartext: true
  }
};

export default config;
