import { Component, Vue } from 'vue-property-decorator';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons';

library.add(faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight);

@Component({})
export default class App extends Vue {
  public version = process.env.UPCI_WOH_VERSION;
}
