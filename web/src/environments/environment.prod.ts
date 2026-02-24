import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  apiUrl: 'http://13.215.254.25/api'
  // apiUrl: 'http://localhost:8080/api'
  // apiUrl: 'http://192.168.1.156:8080/api'

};
