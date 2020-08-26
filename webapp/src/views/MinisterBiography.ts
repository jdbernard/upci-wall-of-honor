import { Component, Vue } from 'vue-property-decorator';
import { take } from 'rxjs/operators';
import { Minister } from '@/data/minister.model';
import MinistersStore from '@/data/ministers.store';
import OotFLogo from '@/assets/svg-components/OotFLogo.vue';
import MinisterPhotoComponent from '@/components/MinisterPhoto.vue';

const dateFormat = 'MMM. D, YYYY';

@Component({
  components: {
    OotFLogo,
    MinisterPhotoComponent
  }
})
export default class MinisterBiographyView extends Vue {
  public minister: Minister | null = null;

  public async mounted() {
    MinistersStore.ministers$.pipe(take(1)).subscribe(list => {
      this.minister =
        list.find(
          m => m.state === 'published' && m.slug === this.$route.params.slug
        ) || null;
    });
  }

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
