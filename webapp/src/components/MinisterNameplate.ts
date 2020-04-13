import { Component, Prop, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';

const dateFormat = 'MMM. D, YYYY';

@Component({})
export default class MinisterNameplateComponent extends Vue {
  @Prop() minister!: Minister;

  public get deathFormatted(): string {
    return this.minister.dateOfDeath?.format(dateFormat) || 'present';
  }

  public get birthFormatted(): string {
    return this.minister.dateOfBirth.format(dateFormat);
  }
}
