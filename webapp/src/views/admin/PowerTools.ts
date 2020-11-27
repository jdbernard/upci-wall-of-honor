import { Component, Vue } from 'vue-property-decorator';
import { List } from 'immutable';
import { take } from 'rxjs/operators';
import { logService } from '@jdbernard/logging';
import {
  Minister,
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

  public allMinisters = List<Minister>();
  public failedRecords = List<Minister>();

  public m11LoadMinisters() {
    ministersStore.ministers$.pipe(take(1)).subscribe(m => {
      this.allMinisters = m;
      logger.info({
        function: 'm11LoadMinisters',
        ministersLoaded: this.allMinisters.size,
        status: 'ready for DB migraiton'
      });
    });
  }

  public m11PersistMinisters() {
    Promise.allSettled(
      this.allMinisters.map(m => {
        return ministersStore.persistMinister(m).catch(error => {
          logger.error({ function: 'm11PersistMinisters', error });
          this.failedRecords.push(m);
        });
      })
    ).then(() => {
      logger.info({
        function: 'm11PrsistMinisters',
        ministersPersisted: this.allMinisters.size - this.failedRecords.size,
        failedRecords: this.failedRecords.size
      });
    });
  }
}
