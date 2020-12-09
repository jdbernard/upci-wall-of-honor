import { Component, Prop, Vue } from 'vue-property-decorator';
import { take } from 'rxjs/operators';
import { LeadershipPosition } from '@/data/leadership-position.model';
import { Minister } from '@/data/minister.model';
import leadershipPositionsStore from '@/data/leadership-positions.store';
import ministersStore from '@/data/ministers.store';
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
  public leadershipPosition: LeadershipPosition | null = null;

  @Prop({ default: undefined })
  public leadershipPositionId!: string | undefined;

  public async mounted() {
    ministersStore.ministers$.pipe(take(1)).subscribe(list => {
      this.minister =
        list.find(
          m => m.state === 'published' && m.slug === this.$route.params.slug
        ) || null;
    });

    if (this.leadershipPositionId) {
      this.leadershipPosition = await leadershipPositionsStore.findLeadershipPositionById(
        this.leadershipPositionId
      );
    }
  }
}
