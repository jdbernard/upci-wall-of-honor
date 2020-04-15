import { Component, Ref, Vue } from 'vue-property-decorator';
import { Collection, Map, List } from 'immutable';
import moment from 'moment';
import { Minister } from '@/data/minister.model';
import { AutoScrollService } from '@/services/auto-scroll.service.ts';
import MinistersStore from '@/data/ministers.store';
import MinisterNameplate from '@/components/MinisterNameplate.vue';
import SearchBarComponent from '@/components/common/SearchBar.vue';
import YearDividerComponent from '@/components/common/YearDivider.vue';

@Component({
  components: {
    MinisterNameplate,
    SearchBarComponent,
    YearDividerComponent
  }
})
export default class DeceasedMinistersView extends Vue {
  public currentYear = moment().year();
  public ministers: List<Minister> = List();

  public deceasedMinisters = Map<number, List<Minister>>();
  public years: number[] = [];

  // TODO: use dependency injection instead (need to figure out the broaders DI
  // story)
  private scrollService?: AutoScrollService;
  private scrollReset = false;

  @Ref('currentYearDivider') currentYearDivider!: YearDividerComponent;
  private observer?: IntersectionObserver;

  private async mounted() {
    this.ministers = await MinistersStore.ministers;
    this.deceasedMinisters = await MinistersStore.deceasedMinistersByYear;

    const allYears = this.deceasedMinisters.keySeq().sort((a, b) => b - a);
    this.currentYear = allYears.first(moment().year());

    this.observer = new IntersectionObserver(this.handleYearIntersect, {
      root: this.currentYearDivider.$el,
      threshold: 0.75
    });

    const scrollOptions = {
      msPerPx: 64,
      onScrollEnd: () => this.onScrollEnd()
    };

    this.scrollService = new AutoScrollService(scrollOptions);
    this.pageInYears(allYears).then(this.scrollService.start);

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
    return new Promise(resolve => {
      const nextYear = (remainingYears: Collection.Indexed<number>) => {
        if (!remainingYears || remainingYears.count() === 0) {
          resolve();
        } else {
          this.years.push(remainingYears.first());
          setTimeout(() => nextYear(remainingYears.rest()), 50);
        }
      };
      Vue.nextTick().then(() => nextYear(years));
    });
  };

  private handleYearIntersect = (entries: IntersectionObserverEntry[]) => {
    console.log(entries);
  };
}
