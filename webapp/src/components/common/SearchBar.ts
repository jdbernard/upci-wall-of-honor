import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import debounce from 'lodash.debounce';

@Component({})
export default class SearchBarComponent extends Vue {
  @Prop() years!: number[];
  byName = false;
  byYear = false;

  public searchByName() {
    this.byName = true;
    this.byYear = false;
  }

  public searchByYear() {
    this.byYear = true;
    this.byName = false;
  }

  public handleNameUpdate: (evt: KeyboardEvent) => string = debounce(
    (evt: KeyboardEvent) => {
      const input: HTMLInputElement = evt?.target as HTMLInputElement;
      return this.emitFilterChanged(input?.value);
    },
    200
  );

  @Emit() emitFilterChanged(filter: string) {
    console.log('filter: ', filter);
    return filter;
  }

  @Emit() emitYearSelected(year: number) {
    return year;
  }
}
