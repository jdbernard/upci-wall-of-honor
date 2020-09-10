import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { List } from 'immutable';
import { logService } from '@jdbernard/logging';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ministersStore from '@/data/ministers.store';
import { Minister } from '@/data/minister.model';
import { nameDisplay } from '@/filters/name-display.filter';

const logger = logService.getLogger('/admin/minister-table');
const DATE_FORMAT = 'MMM. D, YYYY';

export interface MinisterRowData {
  id: string;
  displayName: string;
  isOotF: boolean;
  hasBio: boolean;
  dob?: number;
  dod?: number;
  isDeceased: boolean;
  displayDOB: string;
  displayDOD: string;
  slug: string;
}

@Component({})
export default class MinisterTableView extends Vue {
  @Prop({ default: 'all' })
  public filter!: string;

  public currentPage = 1;
  public pageSize = 100;
  public totalPages = 0;

  public ministers = List<Minister>();
  public ministerRowData: MinisterRowData[] = [];

  private filteredMinisters = List<MinisterRowData>();
  private destroyed$ = new Subject();
  private loading = true;

  @Watch('filter')
  onFilterChange(val: string) {
    this.filteredMinisters = (val === 'ootf'
      ? this.ministers.filter(m => !!m.ootfYearInducted)
      : this.ministers
    ).map(m => ({
      id: m.id,
      displayName: nameDisplay(m),
      isOotF: !!m.ootfYearInducted,
      hasBio: !!m.details,
      isDeceased: m.isDeceased,
      dob: m.dateOfBirth ? m.dateOfBirth.valueOf() : undefined,
      dod: m.dateOfDeath ? m.dateOfDeath.valueOf() : undefined,
      displayDOB: m.dateOfBirth?.format(DATE_FORMAT) || 'unknown',
      displayDOD: m.isDeceased
        ? m.dateOfDeath?.format(DATE_FORMAT) || 'unknown'
        : 'living',
      slug: m.slug,
      state: m.state
    }));
    this.ministerRowData = this.filteredMinisters.toJS();
    logger.trace({
      function: 'onFilterChange',
      ministersMappedAt: performance.now()
    });
  }

  public tableFilters = {
    name: {
      value: '',
      keys: ['displayName']
    }
  };

  private async mounted() {
    ministersStore.ministers$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((list: List<Minister>) => {
        this.ministers = list;
        this.onFilterChange(this.filter);
        logger.trace({
          function: 'mounted',
          ministersLoadedAt: performance.now()
        });
        Vue.nextTick(() => (this.loading = false));
      });
    logger.trace({ function: 'mounted', mountedAt: performance.now() });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
