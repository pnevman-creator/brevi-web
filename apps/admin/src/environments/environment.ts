export const environment = {
  production: false,
  enableHttpLogs: true,

  app: {
    name: 'Brevi Admin',
    version: '0.1.0',
  },

  api: {
    baseUrl: 'http://localhost:7230/admin',
  },

  features: {
    dashboard: true,
    catalog: true,
  },
  logging: {
    enabled: false,
    endpoint: null,
    sampleRate: 1,
  },
};
