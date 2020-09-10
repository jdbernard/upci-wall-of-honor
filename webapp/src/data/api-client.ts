import { default as Axios } from 'axios';
import AppConfigStore from '@/data/app.config.store';
import UserStore from '@/data/user.store';

const apiHttp = Axios.create({
  baseURL: '',
  headers: {
    common: { 'Content-Type': 'application/json' }
  }
});

AppConfigStore.appConfig.then(cfg => {
  apiHttp.defaults.baseURL = cfg.apiBaseUrl;
  apiHttp.interceptors.request.use(async reqCfg => {
    const authToken = await UserStore.getAccessToken();
    if (authToken) {
      reqCfg.headers['Authorization'] = 'Bearer ' + authToken;
    }

    return reqCfg;
  });
});

export default apiHttp;
