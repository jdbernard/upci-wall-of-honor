import { Component, Prop, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';
import MinisterPhotoComponent from '@/components/MinisterPhoto.vue';

const dateFormat = 'MMM. D, YYYY';

@Component({ components: { MinisterPhotoComponent } })
export default class MinisterBiographyComponent extends Vue {
  @Prop() public minister!: Minister;

  public get deathFormatted(): string {
    if (this.minister) {
      return this.minister.dateOfDeath?.format(dateFormat) || 'present';
    } else {
      return '';
    }
  }

  public get birthFormatted(): string {
    if (this.minister && this.minister.dateOfBirth) {
      return this.minister.dateOfBirth.format(dateFormat);
    } else {
      return '';
    }
  }
}
