import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Collection, List } from 'immutable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import ministersStore from '@/data/ministers.store';
import MinisterNameplate from '@/components/MinisterNameplate.vue';
import SearchBarComponent from '@/components/SearchBar.vue';
import YearDividerComponent from '@/components/YearDivider.vue';
import { Minister } from '@/data/minister.model';
import { AutoScrollService } from '@/services/auto-scroll.service.ts';
import { SearchState, toQuery } from '@/data/search.model';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('/deceased-ministers');

@Component({
  components: {
    MinisterNameplate,
    SearchBarComponent,
    YearDividerComponent
  }
})
export default class DeceasedMinistersView extends Vue {
  public ministersByYear = Collection.Keyed<
    number,
    Collection<number, Minister>
  >([]);
  public ministers = List<Minister>();

  private destroyed$ = new Subject<void>();

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

  public years: number[] = [];
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
          `li[data-year="${search.value}"] .minister-nameplates`
        );
        if (sectionEl) {
          window.scrollTo({
            top: (sectionEl as HTMLElement).offsetTop - 477,
            behavior: 'smooth'
          });
        }
      } else if (search.type === 'by-name' && search.value) {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }

  private userInteractionTimeout?: number;

  // TODO: use dependency injection instead (need to figure out the broader DI
  // story)
  private scrollService?: AutoScrollService;
  private scrollReset = false;

  private async mounted() {
    // (window as any).DCM = this;
    ministersStore.ministers$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateMinisters);

    const scrollOptions = {
      msPerPx: 64,
      onScrollEnd: () => this.onScrollEnd()
    };

    this.scrollService = new AutoScrollService(scrollOptions);

    logger.trace({ function: 'mounted', mountedAt: performance.now() });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private beforeDestroy() {
    if (this.scrollService) {
      this.scrollService.stop();
    }
  }

  private updateMinisters(list: List<Minister>) {
    logger.trace({ function: 'updateMinisters', startedAt: performance.now() });

    this.loading = true;
    this.pauseScroll();

    this.ministers = list
      .filter(m => m.state === 'published' && !!m.dateOfDeath)
      .sort((a, b) =>
        (a.name.surname || a.name.given).localeCompare(
          b.name.surname || b.name.given
        )
      );

    logger.trace({
      function: 'updateMinisters',
      filteredAt: performance.now()
    });

    this.ministersByYear = this.ministers.groupBy(m =>
      m.dateOfDeath ? m.dateOfDeath.year() : 1900
    );

    const allYears = this.ministersByYear.keySeq().sort((a, b) => b - a);

    logger.trace({ function: 'updateMinisters', mappedAt: performance.now() });

    this.loading = false;
    this.pageInYears(allYears).then(() => {
      Vue.nextTick(() => this.onSearch(this.searchState, this.searchState));
      logger.trace({
        function: 'updateMinisters',
        finishedAt: performance.now()
      });
    });

    return;
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
    this.$router.push({
      name: 'DeceasedMinisters',
      query: toQuery(search)
    });
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
    const timeoutMs = this.$appConfig.userInactivityDurationSeconds * 1000;
    logger.trace(
      `Pausing automated scroll and allowing user activity for ${timeoutMs} milliseconds.`
    );

    if (this.userInteractionTimeout) {
      clearTimeout(this.userInteractionTimeout);
    }

    this.pauseScroll();
    this.userInteractionTimeout = setTimeout(() => {
      delete this.userInteractionTimeout;
      this.doSearch({ type: 'none' });
    }, this.$appConfig.userInactivityDurationSeconds * 1000);
  }
}
