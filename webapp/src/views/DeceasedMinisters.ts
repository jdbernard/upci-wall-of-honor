import { Component, Ref, Vue } from 'vue-property-decorator';
import { Collection, Map, List } from 'immutable';
import moment from 'moment';
import { Minister } from '@/data/minister.model';
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

  private scrolling = true;
  private lastWindowY = 0;
  private lastScrollInvoke = 0;
  private msPerFrame = 32;
  private pxPerFrame = 1;

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

    this.pageInYears(allYears).then(() => this.scroll(0));
    return;
  }

  public scroll = (initialDelay: number) => {
    this.scrolling = true;
    this.lastScrollInvoke = Date.now();

    setTimeout(this.doScroll, initialDelay);
  };

  public pauseScroll = () => {
    this.scrolling = false;
  };

  private doScroll = () => {
    if (!this.scrolling) return;

    const curTime = Date.now();
    const elapsedTime = curTime - this.lastScrollInvoke;
    if (elapsedTime > this.msPerFrame) {
      window.scrollBy({ top: this.pxPerFrame });
      this.lastScrollInvoke = curTime;
    }
    window.requestAnimationFrame(this.doScroll);
  };

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
      nextYear(years);
    });
  };

  private handleYearIntersect = (entries: IntersectionObserverEntry[]) => {
    console.log(entries);
  };
}
