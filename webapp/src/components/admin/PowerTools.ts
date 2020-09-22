import { Component, Vue } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';
import {
  exactEquals,
  deepClone,
  fromDTO,
  newMinister,
  toDTO
} from '@/data/minister.model';
import ministersStore from '@/data/ministers.store';

const logger = logService.getLogger('/admin/power-tools');

@Component({})
export default class PowerToolsComponent extends Vue {
  public minister = {
    newMinister,
    deepClone,
    fromDTO,
    toDTO,
    exactEquals,
    store: ministersStore
  };

  public mounted() {
    logger.info('PowerTools enabled.');
  }
}
