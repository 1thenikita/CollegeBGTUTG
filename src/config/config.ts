// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaultConfig } = require('./defaultConfig');

let config;

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { devConfig } = require('./devConfig');

  config = devConfig;
} else {
  config = defaultConfig;
}

export const getConfig = (): typeof defaultConfig => {
  return config;
};
