export const environment = {
  production: false,
  enableHttpLogs: true,
  publicSiteUrl: 'http://localhost:4200',

  app: {
    name: 'Brevi Store',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'http://localhost:5000/storefront',
  },

  features: {
    home: true,
    catalog: true,
  },
  logging: {
    enabled: false,
    endpoint: null,
    sampleRate: 1,
  },
};
