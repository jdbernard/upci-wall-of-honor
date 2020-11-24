import { Component, Vue } from 'vue-property-decorator';
import { logService, ConsoleLogAppender } from '@jdbernard/logging';
import VERSION from '@/version-info';

import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faSquare } from '@fortawesome/free-regular-svg-icons';
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBuilding,
  faCheck,
  faCheckCircle,
  faExclamationTriangle,
  faGripLines,
  faInfoCircle,
  faPencilAlt,
  faSearch,
  faSearchMinus,
  faSearchPlus,
  faSitemap,
  faSpinner,
  faTimes,
  faTrash,
  faUpload,
  faUser,
  faUserPlus,
  faUsers,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleRight,
  faBuilding,
  faCheck,
  faCheckCircle,
  faCheckSquare as IconDefinition,
  faExclamationTriangle,
  faGripLines,
  faInfoCircle,
  faPencilAlt,
  faSearch,
  faSearchMinus,
  faSearchPlus,
  faSitemap,
  faSpinner,
  faSquare as IconDefinition,
  faTimes,
  faTrash,
  faUpload,
  faUser,
  faUserPlus,
  faUsers,
  faUserTie
);

@Component({})
export default class App extends Vue {
  public version = VERSION;

  private consoleLogAppender!: ConsoleLogAppender;

  constructor() {
    super();
    this.configure();
  }

  private configure() {
    // Because modules like the router will start logging messages before this
    // component is initialized, the console appender is initialized and added
    // in main.ts
    this.consoleLogAppender = logService.ROOT_LOGGER.appenders[0];
    this.consoleLogAppender.threshold = this.$appConfig.loggingLevel;
  }
}
