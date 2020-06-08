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

Vue.config.productionTip = false;

const consoleLogAppender = new ConsoleLogAppender(LogLevel.ALL);
logService.ROOT_LOGGER.appenders.push(consoleLogAppender);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
