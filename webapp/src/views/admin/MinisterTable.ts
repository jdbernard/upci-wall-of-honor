import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { List } from 'immutable';
import { logService } from '@jdbernard/logging';
import AppConfigStore from '@/data/app.config.store';
import MinistersStore from '@/data/ministers.store';
import { AppConfig, defaultConfig } from '@/data/app.config.model';
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
      slug: m.slug
    }));
  }

  public ministers = List<Minister>();
  private filteredMinisters = List<MinisterRowData>();
  public appConfig: AppConfig = defaultConfig;

  public tableFilters = {
    name: {
      value: '',
      keys: ['displayName']
    }
  };

  public get ministerRowData(): MinisterRowData[] {
    return this.filteredMinisters.toJS();
  }

  private async mounted() {
    this.appConfig = await AppConfigStore.appConfig;
    this.ministers = await MinistersStore.ministers;
    this.onFilterChange(this.filter);
    logger.trace({ function: 'mounted', calcStart: performance.now() });
  }
}
