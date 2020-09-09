import '@/class-component-hooks';
import Vue from 'vue';
import Auth from '@okta/okta-vue';
import App from './App.vue';
import router from './router';
import AppConfigStore from './data/app.config.store';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { dom as FA_DOM } from '@fortawesome/fontawesome-svg-core';
import SmartTable from 'vuejs-smart-table';

import { logService, LogLevel, ConsoleLogAppender } from '@jdbernard/logging';
import { nameDisplay } from '@/filters/name-display.filter';

const consoleLogAppender = new ConsoleLogAppender(LogLevel.ALL);
logService.ROOT_LOGGER.appenders.push(consoleLogAppender);

const logger = logService.getLogger('main');

Vue.component('fa-icon', FontAwesomeIcon);
FA_DOM.watch();

Vue.filter('nameDisplay', nameDisplay);
Vue.use(SmartTable);

Vue.config.productionTip = false;
Vue.config.errorHandler = function(err, vm, info) {
  logger.error({ err, vm, info });
};

// Wait for config to load before continuing application bootstrap
AppConfigStore.appConfig.then(cfg => {
  console.log('AppConfig loaded.');

  Vue.use(vueCtor => {
    vueCtor.prototype.$appConfig = cfg;
  });

  Vue.use(Auth, {
    ...cfg.okta,
    scopes: ['openid', 'profile', 'email'],
    responseType: ['code'],
    pkce: true
  });

  router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app');
});
