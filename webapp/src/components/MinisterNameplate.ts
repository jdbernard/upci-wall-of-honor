import { Component, Prop, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';

const DATE_FORMAT = 'MMM. D, YYYY';

@Component({})
export default class MinisterNameplateComponent extends Vue {
  @Prop() minister!: Minister;

  public get deathFormatted(): string {
    return this.minister.isDeceased
      ? this.minister.dateOfDeath?.format(DATE_FORMAT) || 'unknown'
      : 'present';
  }

  public get birthFormatted(): string {
    return this.minister.dateOfBirth?.format(DATE_FORMAT) || 'unknown';
  }
}
