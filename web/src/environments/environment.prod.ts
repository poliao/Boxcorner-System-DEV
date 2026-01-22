import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  // apiUrl: 'http://bca-system.sytes.net/api'
  apiUrl: 'http://localhost:8080/api'
};
