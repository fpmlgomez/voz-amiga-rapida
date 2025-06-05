
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.469e6ad0988b48ee8a4aa988b1b7a731',
  appName: 'ExpreSIA',
  webDir: 'dist',
  server: {
    url: 'https://469e6ad0-988b-48ee-8a4a-a988b1b7a731.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#3B82F6',
      showSpinner: false
    }
  }
};

export default config;
