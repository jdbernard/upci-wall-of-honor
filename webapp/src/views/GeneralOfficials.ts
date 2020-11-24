import { Component, Vue } from 'vue-property-decorator';
import { List, Map } from 'immutable';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { logService } from '@jdbernard/logging';
import {
  LeadershipPosition,
  GENERAL_OFFICIALS_MINISTRY
} from '@/data/leadership-position.model';
import leadershipPositionsStore from '@/data/leadership-positions.store';
import { Minister } from '@/data/minister.model';
import ministersStore from '@/data/ministers.store';
import { AutoScrollService } from '@/services/auto-scroll.service.ts';
import MinisterPhoto from '@/components/MinisterPhoto.vue';

const logger = logService.getLogger('/leadership/executive');

interface Leader extends LeadershipPosition {
  minister: Minister;
}

@Component({
  components: { MinisterPhoto }
})
export default class ExecutiveLeadershipView extends Vue {
  public loading = true;
  public leaders = List<Leader>();
  public livingMinisters = Map<string, Minister>();

  private scrollService?: AutoScrollService;
  private destroyed$ = new Subject<void>();

  public scroll(delay: number) {
    if (this.scrollService) {
      this.scrollService.start(delay);
    }
  }

  public pauseScroll() {
    if (this.scrollService) {
      this.scrollService.stop();
    }
  }

  private async mounted() {
    combineLatest(
      leadershipPositionsStore.leadershipPositions$,
      ministersStore.livingMinistersWithBio$
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateLeadersAndMinisters);

    const scrollOptions = {
      msPerPx: 64,
      onScrollEnd: () => this.onScrollEnd()
    };

    this.scrollService = new AutoScrollService(scrollOptions);
    this.scroll(60000);

    logger.trace({ function: 'mounted' });
  }

  private destroyed() {
    if (this.scrollService) this.scrollService.stop();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private updateLeadersAndMinisters(
    value: [List<LeadershipPosition>, List<Minister>]
  ) {
    this.livingMinisters = Map<string, Minister>(value[1].map(m => [m.id, m]));
    this.leaders = value[0]
      .filter(
        l =>
          l.ministryName === GENERAL_OFFICIALS_MINISTRY &&
          !!this.livingMinisters.get(l.ministerId)?.details
      )
      .map(l => ({
        ...l,
        minister: this.livingMinisters.get(l.ministerId) as Minister
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
    this.loading = false;
  }

  private onScrollEnd() {
    logger.trace({ function: 'onScrollEnd' });
    setTimeout(() => {
      this.$router.push({ name: 'MinistryDirectors' });
    }, 60000);
  }
}
