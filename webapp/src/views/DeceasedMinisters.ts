import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Collection, Map, List } from 'immutable';
import AppConfigStore from '@/data/app.config.store';
import MinistersStore from '@/data/ministers.store';
import MinisterNameplate from '@/components/MinisterNameplate.vue';
import SearchBarComponent from '@/components/common/SearchBar.vue';
import YearDividerComponent from '@/components/common/YearDivider.vue';
import { Minister } from '@/data/minister.model';
import { AutoScrollService } from '@/services/auto-scroll.service.ts';
import { AppConfig, defaultConfig } from '@/data/app.config.model';
import { SearchState, toQuery } from '@/data/search.model';
import { logService } from '@/services/logging';

const logger = logService.getLogger('/deceased-ministers');

@Component({
  components: {
    MinisterNameplate,
    SearchBarComponent,
    YearDividerComponent
  }
})
export default class DeceasedMinistersView extends Vue {
  public deceasedMinisters = Map<number, List<Minister>>();
  public years: number[] = [];
  public appConfig: AppConfig = defaultConfig;
  public loading = true;

  public hasUser(): boolean {
    return !!this.userInteractionTimeout;
  }

  @Prop({
    default: () => ({
      type: 'none'
    })
  })
  public searchState!: SearchState;

  @Watch('searchState')
  onSearch(search: SearchState, old: SearchState) {
    logger.trace({ function: 'onSearch', search, old });

    if (search.type === 'none') {
      this.scroll(0);
    } else {
      this.allowUserInteraction();

      if (search.type === 'by-year' && search.value) {
        const sectionEl = this.$el.querySelector(
          `li[data-year="${search.value}"] .ministers-in-year`
        );
        if (sectionEl) {
          window.scrollTo({
            top: (sectionEl as HTMLElement).offsetTop - 477,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  private userInteractionTimeout?: number;

  // TODO: use dependency injection instead (need to figure out the broaders DI
  // story)
  private scrollService?: AutoScrollService;
  private scrollReset = false;

  private async mounted() {
    this.appConfig = await AppConfigStore.appConfig;
    this.deceasedMinisters = await MinistersStore.deceasedMinistersByYear;

    const allYears = this.deceasedMinisters.keySeq().sort((a, b) => b - a);

    const scrollOptions = {
      msPerPx: 64,
      onScrollEnd: () => this.onScrollEnd()
    };

    this.scrollService = new AutoScrollService(scrollOptions);
    this.pageInYears(allYears).then(() => {
      this.loading = false;
      Vue.nextTick(() => this.onSearch(this.searchState, this.searchState));
      logger.trace('mounted');
    });

    return;
  }

  private beforeDestroy() {
    if (this.scrollService) {
      this.scrollService.stop();
    }
  }

  public scroll(delay: number) {
    if (this.scrollService) {
      this.scrollService.start(delay);
    }
  }

  public pauseScroll() {
    if (this.scrollService) {
      this.scrollService.stop();
    }
  }

  private onScrollEnd() {
    logger.trace('onScrollEnd');
    setTimeout(() => {
      this.scrollReset = true;

      setTimeout(() => {
        window.scrollTo({ top: 0 });
        this.scrollReset = false;
        if (this.scrollService) {
          setTimeout(this.scrollService.start, 10000);
        }
      }, 2000);
    }, 10000);
  }

  public doSearch(search: SearchState) {
    logger.trace({ function: 'doSearch', search });
    const query = toQuery(search);
    this.$router.push({ path: '/deceased-ministers', query });
  }

  private afterScrollReset(): Promise<void> {
    this.scrollReset = false;
    return new Promise(resolve => setTimeout(resolve, 10000));
  }

  private beforeScrollReset(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.scrollReset = true;
        Vue.nextTick(resolve);
      }, 10000);
    });
  }

  private pageInYears = (years: Collection.Indexed<number>): Promise<void> => {
    logger.trace({ function: 'pageInYears', startTime: performance.now() });
    return new Promise(resolve => {
      const nextYear = (remainingYears: Collection.Indexed<number>) => {
        if (!remainingYears || remainingYears.count() === 0) {
          logger.trace({
            function: 'pageInYears',
            endTime: performance.now()
          });
          resolve();
        } else {
          this.years.push(remainingYears.first());
          setTimeout(() => nextYear(remainingYears.rest()), 50);
        }
      };
      Vue.nextTick().then(() => nextYear(years));
    });
  };

  private allowUserInteraction() {
    const timeoutMs = this.appConfig.userInactivityDurationSeconds * 1000;
    logger.trace(`Allowing user activity for ${timeoutMs} milliseconds.`);

    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }

    this.pauseScroll();
    this.userInteractionTimeout = setTimeout(() => {
      delete this.userInteractionTimeout;
      this.doSearch({ type: 'none' });
    }, this.appConfig.userInactivityDurationSeconds * 1000);
  }
}
