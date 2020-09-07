import { Component, Vue } from 'vue-property-decorator';
import { take } from 'rxjs/operators';
import { Minister } from '@/data/minister.model';
import MinistersStore from '@/data/ministers.store';
import MinisterBiographyComponent from '@/components/MinisterBiography.vue';
import OotFLogo from '@/assets/svg-components/OotFLogo.vue';

@Component({
  components: {
    MinisterBiographyComponent,
    OotFLogo
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
}
