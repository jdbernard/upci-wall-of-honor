import { Component, Vue } from 'vue-property-decorator';
import { List, Map } from 'immutable';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { logService } from '@jdbernard/logging';
import { BoardCategory } from '@/data/board-category.model';
import { BoardMember } from '@/data/board-member.model';
import boardCategoriesStore from '@/data/board-categories.store';
import boardMembersStore from '@/data/board-members.store';
import NamedDivider from '@/components/NamedDivider.vue';
import { AutoScrollService } from '@/services/auto-scroll.service.ts';
import { keyBy, bySortOrder } from '@/util';

const logger = logService.getLogger('/leadership/general-board');

@Component({
  components: { NamedDivider }
})
export default class GeneralBoardView extends Vue {
  public loading = true;

  public categories = List<BoardCategory>();
  public members = Map<string, List<BoardMember>>();

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

  private mounted() {
    combineLatest(
      boardCategoriesStore.boardCategories$,
      boardMembersStore.boardMembers$
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateCategoriesAndMembers);

    const scrollOptions = {
      msPerPx: 64,
      onScrollEnd: () => this.onScrollEnd()
    };

    this.scrollService = new AutoScrollService(scrollOptions);
    this.scroll(10000);
  }

  private destroyed() {
    if (this.scrollService) this.scrollService.stop();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private updateCategoriesAndMembers(
    value: [List<BoardCategory>, List<BoardMember>]
  ) {
    this.categories = value[0].sort(bySortOrder);
    this.members = keyBy(value[1].sort(this.byLastName), 'categoryId');
    this.loading = false;
  }

  private byLastName(a: BoardMember, b: BoardMember): number {
    const aParts = a.name.split(' ');
    const bParts = b.name.split(' ');
    const lastA = aParts[aParts.length - 1];
    const lastB = bParts[bParts.length - 1];

    return lastA.localeCompare(lastB);
  }

  private onScrollEnd() {
    logger.trace({ function: 'onScrollEnd' });
    setTimeout(() => {
      this.$router.push({ name: 'GeneralOfficials' });
    }, 10000);
  }
}
