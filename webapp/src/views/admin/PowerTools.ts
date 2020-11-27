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
import { nameDisplay } from '@/filters/name-display.filter';

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
  public output = '';

  public m11LoadMinisters() {
    ministersStore.ministers$.pipe(take(1)).subscribe(m => {
      this.allMinisters = m;
      this.output +=
        'Loaded ' + this.allMinisters.size + ' minister records.<br/>';
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
          this.output +=
            '<span class="error">Failed to persist ' +
            nameDisplay(m) +
            '.<br/>';
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
      this.output +=
        'Persisted ' +
        (this.allMinisters.size - this.failedRecords.size) +
        '. <span class="error">Failed to update ' +
        this.failedRecords.size +
        ' records.<br/>';
    });
  }
}
