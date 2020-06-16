import '@/class-component-hooks';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { dom as FA_DOM } from '@fortawesome/fontawesome-svg-core';

import { logService, LogLevel, ConsoleLogAppender } from '@/services/logging';
import { nameDisplay } from '@/filters/name-display.filter';

Vue.component('fa-icon', FontAwesomeIcon);
FA_DOM.watch();

Vue.filter('nameDisplay', nameDisplay);

const consoleLogAppender = new ConsoleLogAppender(LogLevel.ALL);
logService.ROOT_LOGGER.appenders.push(consoleLogAppender);

const logger = logService.getLogger('main');

Vue.config.productionTip = false;
Vue.config.errorHandler = function(err, vm, info) {
  logger.error({ err, vm, info });
};

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
