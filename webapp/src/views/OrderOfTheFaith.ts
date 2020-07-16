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

  private nextPageTimeout: number | null = null;
  private userInteractionTimeout: number | null = null;

  get matchingMinisters(): List<Minister> {
    return this.ministers.filter(m => {
      if (this.searchState.type !== 'by-name' || !this.searchState.value) {
        return true;
      } else {
        return (
          m.name.given.toLowerCase().startsWith(this.searchState.value) ||
          (m.name.surname &&
            m.name.surname.toLowerCase().startsWith(this.searchState.value))
        );
      }
    });
  }

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

    this.startKioskDisplay();
    logger.trace({ function: 'mounted', mby: this.ministersByYear });
  }

  public beforeUpdate() {
    this.updateNextAndPrev(this.$route.params);
  }

  public doSearch(search: SearchState) {
    logger.trace({ function: 'doSearch', search });

    if (search.type === 'none') {
      this.$router.push(this.$route.path);
      this.startKioskDisplay();
    } else {
      this.allowUserInteraction();
      if (search.type === 'by-year' && search.value) {
        this.$router.push({
          name: 'OrderOfTheFaith',
          params: { year: search.value, page: '1' }
        });
      } else if (search.type === 'by-name' && search.value) {
        this.$router.push({
          name: 'OrderOfTheFaith',
          query: toQuery(search)
        });
      } else {
        this.$router.push({
          name: 'OrderOfTheFaith',
          params: this.$route.params,
          query: toQuery(search)
        });
      }
    }
  }

  public get hasNameResults(): boolean {
    return this.searchState.type === 'by-name' && !!this.searchState.value;
  }

  public get onOverview(): boolean {
    return !this.$route.params.year && !this.hasNameResults;
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
      this.prevPage = null;
      this.nextPage = { year: this.years[0], page: 1 };
    }
  }

  public startKioskDisplay(delay?: number) {
    delay = delay || this.appConfig.pageDurationSeconds * 1000;

    if (this.nextPageTimeout) {
      logger.trace({
        function: 'startKioskDisplay',
        status: 'already in kiosk mode'
      });
      return;
    } else {
      logger.trace({
        function: 'startKioskDisplay',
        status: `starting in ${delay} ms`
      });
      setTimeout(this.autoAdvance, delay);
    }
  }

  private autoAdvance() {
    this.updating = true;
    setTimeout(() => {
      if (this.nextPage) {
        this.$router.push({
          name: 'OrderOfTheFaith',
          params: {
            // TODO: gross toString
            year: this.nextPage.year.toString(),
            page: this.nextPage.page.toString()
          }
        });
      } else {
        this.$router.push({ name: 'OrderOfTheFaith' });
      }

      this.nextPageTimeout = setTimeout(
        this.autoAdvance,
        this.appConfig.pageDurationSeconds * 1000
      );

      this.updating = false;
    }, 500);
  }

  private allowUserInteraction() {
    const timeoutMs = this.appConfig.userInactivityDurationSeconds * 1000;
    logger.trace(
      `Pausing kiosk mode  and allowing user activity for ${timeoutMs} milliseconds.`
    );

    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }

    if (this.nextPageTimeout) {
      clearTimeout(this.nextPageTimeout);
      this.nextPageTimeout = null;
    }
    this.userInteractionTimeout = setTimeout(() => {
      delete this.userInteractionTimeout;
      this.doSearch({ type: 'none' });
    }, this.appConfig.userInactivityDurationSeconds * 1000);
  }
}
