import { Component, Prop, Vue } from 'vue-property-decorator';
import { Collection, List } from 'immutable';
import AppConfigStore from '@/data/app.config.store';
import MinistersStore from '@/data/ministers.store';
import SearchBarComponent from '@/components/SearchBar.vue';
import YearDividerComponent from '@/components/YearDivider.vue';
import { Minister } from '@/data/minister.model';
import { AppConfig, defaultConfig } from '@/data/app.config.model';
import { SearchState, toQuery } from '@/data/search.model';
import { logService } from '@/services/logging';
import OotFLogo from '@/assets/svg-components/OotFLogo.vue';

const logger = logService.getLogger('/order-of-the-faith');

const PAGE_SIZE = 4;

@Component({
  components: {
    OotFLogo,
    SearchBarComponent,
    YearDividerComponent
  }
})
export default class OrderOfTheFaithView extends Vue {
  public ministers = List<Minister>();
  public ministersByYear = Collection.Keyed<
    number,
    Collection<number, Minister>
  >([]);

  @Prop({
    default: () => ({
      type: 'none'
    })
  })
  public searchState!: SearchState;

  public years: number[] = [];
  public appConfig: AppConfig = defaultConfig;

  public async mounted() {
    // (window as any).OotF = this;
    this.appConfig = await AppConfigStore.appConfig;
    this.ministers = (await MinistersStore.ministers)
      .filter(m => !!m.ootfYearInducted)
      .sort((a, b) =>
        (a.name.surname || a.name.given).localeCompare(
          b.name.surname || b.name.given
        )
      );

    this.ministersByYear = this.ministers.groupBy(m =>
      m.ootfYearInducted ? m.ootfYearInducted : 1900
    );

    this.years = this.ministersByYear
      .keySeq()
      .sort()
      .reverse()
      .toJS();

    logger.trace({ function: 'mounted', mby: this.ministersByYear });
  }

  public doSearch(search: SearchState) {
    logger.trace({ function: 'doSearch', search });
    const query = toQuery(search);
    this.$router.push({ path: '/order-of-the-faith', query });
  }

  public page(year: number, page: number) {
    logger.trace({ function: 'page', params: { year, page } });
    const ministersInYear = this.ministersByYear.get(year) || [];
    ministersInYear.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }
}
