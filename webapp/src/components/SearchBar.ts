import { Component, Emit, Prop, Ref, Vue, Watch } from 'vue-property-decorator';
import debounce from 'lodash.debounce';
import { SearchState } from '@/data/search.model';

@Component({})
export default class SearchBarComponent extends Vue {
  @Prop() years!: number[];
  @Prop({
    default: () => {
      'none';
    }
  })
  searchState!: SearchState;
  @Ref('year-list') yearListEl!: Element;

  @Watch('searchState')
  onSearchStateChanged(state: SearchState) {
    if (state.type === 'by-year') {
      Vue.nextTick(() => this.scrollToYear(state.value));
    }
  }

  public handleNameUpdate: (evt: KeyboardEvent) => void = debounce(
    (evt: KeyboardEvent) => {
      const input: HTMLInputElement = evt?.target as HTMLInputElement;
      if (input) {
        this.search({ type: 'by-name', value: input.value.toLowerCase() });
      }
    },
    200
  );

  public handleYearClick(year: number) {
    this.search({ type: 'by-year', value: year.toString() });
  }

  public close() {
    this.search({ type: 'none' });
  }

  public left() {
    this.yearListEl.scrollBy({ behavior: 'smooth', left: -5 * 32 * 3 });
  }

  public right() {
    this.yearListEl.scrollBy({ behavior: 'smooth', left: 5 * 32 * 3 });
  }

  public leftMore() {
    this.yearListEl.scrollBy({ behavior: 'smooth', left: -10 * 32 * 3 });
  }

  public rightMore() {
    this.yearListEl.scrollBy({ behavior: 'smooth', left: 10 * 32 * 3 });
  }

  private scrollToYear(year: string | null | undefined) {
    if (!this.yearListEl) {
      setTimeout(() => this.scrollToYear(year), 50);
    }

    if (year) {
      const yearEl = this.yearListEl.querySelector(`li[data-year="${year}"]`);
      if (yearEl) {
        (yearEl as HTMLElement).scrollIntoView({ inline: 'start' });
      }
    } else {
      this.yearListEl.scrollIntoView({ inline: 'end' });
    }
  }

  @Emit() search(criteria: SearchState) {
    return criteria;
  }
}
