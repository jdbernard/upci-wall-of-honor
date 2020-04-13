import { Component, Vue } from 'vue-property-decorator';
import { Map, Seq } from 'immutable';
import moment from 'moment';
import { Minister } from '@/data/minister.model';
import MinistersStore from '@/data/ministers.store';
import MinisterNameplate from '@/components/MinisterNameplate.vue';
import SearchBarComponent from '@/components/SearchBar.vue';
import YearDividerComponent from '@/components/YearDivider.vue';
import { momentComparator } from '@/util';

@Component({
  components: {
    MinisterNameplate,
    SearchBarComponent,
    YearDividerComponent
  }
})
export default class DeceasedMinistersView extends Vue {
  public currentYear = moment().year();
  public ministers: Minister[] = [];

  public deceasedMinisters = Map<number, Minister[]>();
  public years = Seq<number>([]);

  private scrollInterval?: number;

  //@Ref() readonly ministersList!: HTMLDivElement;

  private async mounted() {
    this.ministers = await MinistersStore.ministers;
    this.deceasedMinisters = this.groupByYear(this.ministers);
    this.years = this.deceasedMinisters.keySeq().sort((a, b) => b - a);
    this.currentYear = this.years.first(moment().year());

    this.scroll();
  }

  private groupByYear(ministerList: Minister[]): Map<number, Minister[]> {
    return Map<number, Minister[]>()
      .withMutations(mutableMap => {
        ministerList.reduce((map: Map<number, Minister[]>, m: Minister) => {
          if (!m || !m.dateOfDeath) return map;
          const year = m.dateOfDeath.year();
          const yearList = map.get(year);
          if (yearList) {
            yearList.push(m);
          } else {
            map.set(year, [m]);
          }
          return map;
        }, mutableMap);
      })
      .map(v =>
        v.sort((a, b) => momentComparator(a.dateOfDeath, b.dateOfDeath))
      );
  }

  public scroll = () => {
    this.scrollInterval = setInterval(
      () => window.scrollBy({ top: 4, behavior: 'smooth' }),
      50
    );
  };

  public pauseScroll = () => {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  };
}
