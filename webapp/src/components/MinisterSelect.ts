import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { List } from 'immutable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Minister } from '@/data/minister.model';
import ministersStore from '@/data/ministers.store';
import { nameDisplay } from '@/filters/name-display.filter';

@Component({})
export default class MinisterSelectComponent extends Vue {
  @Prop() value!: string | null;

  public ministerName = '';
  public livingMinisters = List<Minister>();

  public get matchingMinisters(): List<Minister> {
    return this.livingMinisters.filter(
      m =>
        nameDisplay(m)
          .toLowerCase()
          .indexOf(this.ministerName.toLowerCase()) >= 0
    );
  }

  public inputChanged() {
    const minister = this.livingMinisters.find(
      m => nameDisplay(m) === this.ministerName
    );
    this.select(minister);
  }

  public select(m: Minister | undefined) {
    if (m) {
      this.ministerName = nameDisplay(m);
    }
    this.$emit('input', m?.id || null);
  }

  @Watch('value')
  public onValueChange(newVal: string | null, oldVal: string | null) {
    if (!oldVal) return;
    const minister = this.livingMinisters.find(m => m.id === newVal);
    this.ministerName = minister ? nameDisplay(minister) : '';
  }

  private destroyed$ = new Subject<void>();

  private async mounted() {
    ministersStore.livingMinistersWithBio$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(list => {
        this.livingMinisters = list;
        const minister = list.find(m => m.id === this.value);
        if (minister) this.ministerName = nameDisplay(minister);
      });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
