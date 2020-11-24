import { default as Axios, AxiosInstance } from 'axios';
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

export async function fetchAllPages(http: AxiosInstance, url: string) {
  const sepCh = url.indexOf('?') < 0 ? '?' : '&';
  let resp = await http.get(url);
  const pages = [resp.data];

  while (resp.data.nextPageStartsAfter) {
    resp = await http.get(
      url + sepCh + 'startAfter=' + resp.data.nextPageStartsAfter
    );
    pages.push(resp.data);
  }

  return pages;
}
export default apiHttp;
