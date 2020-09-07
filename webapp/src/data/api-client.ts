import { default as Axios } from 'axios';
import AppConfigStore from '@/data/app.config.store';

const apiHttp = Axios.create({
  baseURL: ''
});

AppConfigStore.appConfig.then(
  cfg => (apiHttp.defaults.baseURL = cfg.apiBaseUrl)
);

export default apiHttp;
