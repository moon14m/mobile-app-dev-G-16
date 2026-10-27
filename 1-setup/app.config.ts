import type { ConfigContext, ExpoConfig } from 'expo/config';

// One codebase, three builds (Lab 03). app.json holds the shared settings;
// APP_VARIANT gives each build its own name and bundle id so all three can sit on one phone.
const variant = process.env.APP_VARIANT ?? 'development';
const production = variant === 'production';
const staging = variant === 'staging';
const appId = production ? 'com.group16.formalearn' : `com.group16.formalearn.${variant}`;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: production ? 'FormaLearn' : staging ? 'FormaLearn (Staging)' : 'FormaLearn (Dev)',
  slug: 'formalearn',
  ios: { ...config.ios, bundleIdentifier: appId },
  android: { ...config.android, package: appId },
});
