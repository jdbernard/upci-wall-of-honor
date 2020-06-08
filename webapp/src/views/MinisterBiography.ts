import { Component, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';
import MinistersStore from '@/data/ministers.store';
import OotFLogo from '@/assets/svg-components/OotFLogo.vue';
import MinisterPhoto from '@/components/MinisterPhoto.vue';

const dateFormat = 'MMM. D, YYYY';

@Component({
  components: {
    OotFLogo,
    MinisterPhoto
  }
})
export default class MinisterBiographyView extends Vue {
  public minister: Minister | null = null;

  public async mounted() {
    this.minister =
      (await MinistersStore.ministers).find(
        m => m.slug === this.$route.params.slug
      ) || null;
  }

  public get deathFormatted(): string {
    if (this.minister) {
      return this.minister.dateOfDeath?.format(dateFormat) || 'present';
    } else {
      return '';
    }
  }

  public get birthFormatted(): string {
    if (this.minister) {
      return this.minister.dateOfBirth.format(dateFormat);
    } else {
      return '';
    }
  }
}
