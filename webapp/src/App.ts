import { Component, Vue } from 'vue-property-decorator';
import AppConfigStore from '@/data/app.config.store';
import { AppConfig, defaultConfig } from '@/data/app.config.model';
import { logService, ConsoleLogAppender } from '@/services/logging';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faTimes
);

@Component({})
export default class App extends Vue {
  public version = process.env.UPCI_WOH_VERSION;

  private appConfig: AppConfig = defaultConfig;
  private consoleLogAppender!: ConsoleLogAppender;

  constructor() {
    super();
    this.configure();
  }

  private async configure(): Promise<void> {
    this.appConfig = await AppConfigStore.appConfig;

    // Because modules like the router will start logging messages before this
    // component is initialized, the console appender is initialized and added
    // in main.ts
    this.consoleLogAppender = logService.ROOT_LOGGER.appenders[0];
    this.consoleLogAppender.threshold = this.appConfig.loggingLevel;
  }
}
