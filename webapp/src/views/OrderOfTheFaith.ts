import { Component, Prop, Vue } from 'vue-property-decorator';
import { Route, RawLocation } from 'vue-router';
import { Collection, List } from 'immutable';
import AppConfigStore from '@/data/app.config.store';
import MinistersStore from '@/data/ministers.store';
import SearchBarComponent from '@/components/SearchBar.vue';
import YearDividerComponent from '@/components/YearDivider.vue';
import { Minister } from '@/data/minister.model';
import { AppConfig, defaultConfig } from '@/data/app.config.model';
import { SearchState, toQuery } from '@/data/search.model';
import { logService } from '@/services/logging';
import OotFEntry from '@/components/OotFEntry.vue';
import OotFLogo from '@/assets/svg-components/OotFLogo.vue';

const logger = logService.getLogger('/order-of-the-faith');

const PAGE_SIZE = 4;

@Component({
  components: {
    OotFEntry,
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

  public updating = false;

  public prevPage: { year: number; page: number } | null = null;
  public nextPage: { year: number; page: number } | null = null;

  public async mounted() {
    (window as any).OotF = this;
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

    this.updateNextAndPrev(this.$route.params);
    logger.trace({ function: 'mounted', mby: this.ministersByYear });
  }

  public beforeRouteUpdate(to: Route, from: Route, next: () => void) {
    if (to.params === from.params) {
      next();
    } else {
      this.updating = true;
      setTimeout(() => {
        this.updating = false;
        this.updateNextAndPrev(to.params);
        next();
      }, 500);
    }
  }

  public doSearch(search: SearchState) {
    logger.trace({ function: 'doSearch', search });
    const query = toQuery(search);

    if (this.onOverview) {
      this.$router.push({
        name: 'OrderOfTheFaith',
        query
      });
    } else {
      this.$router.push({
        name: 'OrderOfTheFaithByYear',
        params: this.$route.params,
        query
      });
    }
  }

  public get onOverview(): boolean {
    return !this.$route.params.year;
  }

  public page(year: string | number, page: string | number) {
    logger.trace({ function: 'page', params: { year, page } });

    if (typeof year === 'string') year = parseInt(year);
    if (typeof page === 'string') page = parseInt(page);

    const ministersInYear = this.ministersByYear.get(year) || List<Minister>();
    const requestedPage = ministersInYear.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    );

    logger.trace({ function: 'page', requestedPage });
    return requestedPage;
  }

  public updateNextAndPrev(params: { [key: string]: string }) {
    logger.trace({ function: 'updateNextAndPrev' });
    if (params.year) {
      const year = parseInt(params.year);
      const page = parseInt(params.page);

      const yearIdx = this.years.indexOf(year);

      if (page > 1) {
        this.prevPage = { year, page: page - 1 };
      } else if (yearIdx > 0) {
        const prevYear = this.years[yearIdx - 1];
        const numMinisters = ((this.ministersByYear.get(prevYear) ||
          List<Minister>()) as List<Minister>).size;
        this.prevPage = {
          year: prevYear,
          page: Math.floor(numMinisters / PAGE_SIZE) + 1
        };
      } else {
        this.prevPage = null;
      }

      const numMinistersInYear = ((this.ministersByYear.get(year) ||
        List<Minister>()) as List<Minister>).size;

      if (page * PAGE_SIZE < numMinistersInYear) {
        this.nextPage = { year, page: page + 1 };
      } else if (yearIdx >= 0 && yearIdx < this.years.length - 1) {
        this.nextPage = { year: this.years[yearIdx + 1], page: 1 };
      } else {
        this.nextPage = null;
      }
    } else {
      this.prevPage = this.nextPage = null;
    }
  }
}
