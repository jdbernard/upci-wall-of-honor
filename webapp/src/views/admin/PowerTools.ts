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

interface BatchPersistResults<T> {
  succeeded: List<T>;
  failed: List<T>;
}

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
    /* eslint-disable */
    (window as any).PowerTools = this;
    console.log((window as any).PowerTools);
    /* eslint-enable */
  }

  public allMinisters = List<Minister>();
  public persistResults = {
    succeeded: List<Minister>(),
    failed: List<Minister>()
  } as BatchPersistResults<Minister>;
  public runningBatchPersist = false;

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

  public async m11BatchPersistMinisters() {
    this.runningBatchPersist = true;
    const results = await this.m11PersistInBatches({
      toPersist: this.allMinisters,
      reportProgress: msg => (this.output += msg + '<br/>')
    });

    this.persistResults = results.reduce((acc, res) => ({
      succeeded: acc.succeeded.concat(res.succeeded),
      failed: acc.failed.concat(res.failed)
    }));

    this.output +=
      'Persisted ' +
      this.persistResults.succeeded.size +
      '. <span class="error">Failed to update ' +
      this.persistResults.failed.size +
      ' records.<br/>';

    this.runningBatchPersist = false;
  }

  private async m11PersistInBatches(params: {
    toPersist: List<Minister>;
    batchSize?: number;
    batchDelayInMs?: number;
    results?: List<BatchPersistResults<Minister>>;
    reportProgress?: (msg: string) => void;
  }): Promise<List<BatchPersistResults<Minister>>> {
    const results = params.results || List<BatchPersistResults<Minister>>();
    const { toPersist, reportProgress } = params;

    if (toPersist.size === 0) return results;

    const batchSize = params.batchSize || 50;
    const batchDelayInMs = params.batchDelayInMs || 500;
    const batch = toPersist.take(batchSize);
    const good: Minister[] = [];
    const bad: Minister[] = [];

    if (reportProgress) {
      reportProgress(
        'Persisting batch of ' +
          batchSize +
          '. ' +
          Math.max(0, toPersist.size - batchSize) +
          ' records to follow.'
      );
    }

    return Promise.allSettled(
      batch
        .map(m =>
          ministersStore
            .persistMinister(m)
            .then(() => good.push(m))
            .catch(() => {
              if (reportProgress) {
                reportProgress(
                  '<span class="error">Failed to persist ' +
                    nameDisplay(m) +
                    '.<br/>'
                );
              }
              bad.push(m);
            })
        )
        .push(
          new Promise<void>(resolve => setTimeout(resolve, batchDelayInMs))
        )
    ).then(() =>
      this.m11PersistInBatches({
        toPersist: toPersist.skip(batchSize),
        batchSize: batchSize,
        batchDelayInMs: batchDelayInMs,
        results: results.push({
          succeeded: List<Minister>(good),
          failed: List<Minister>(bad)
        }),
        reportProgress: reportProgress
      })
    );
  }
}
