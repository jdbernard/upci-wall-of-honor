import { Component, Vue } from 'vue-property-decorator';
import { Map, List } from 'immutable';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { logService } from '@jdbernard/logging';
import { BoardCategory } from '@/data/board-category.model';
import { BoardMember } from '@/data/board-member.model';
import boardCategoriesStore from '@/data/board-categories.store';
import boardMembersStore from '@/data/board-members.store';
import AdminLoadingPlaceholder from '@/components/admin/LoadingPlaceholder.vue';
import toastService from '@/components/admin/toast.service';
import { keyBy, bySortOrder } from '@/util';

const logger = logService.getLogger('/admin/leadership/executive');

@Component({
  components: {
    AdminLoadingPlaceholder,
    draggable
  }
})
export default class AdminGeneralBoardView extends Vue {
  public loading = true;
  public categories = List<BoardCategory>();
  public members = Map<string, List<BoardMember>>();
  public searchInput = '';
  private destroyed$ = new Subject<void>();

  private async mounted() {
    boardCategoriesStore.boardCategories$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(cats => (this.categories = cats));

    boardMembersStore.boardMembers$
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateMembers);

    logger.trace({ function: 'mounted' });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private updateMembers(list: List<BoardMember>) {
    this.members = keyBy(list, 'categoryId');
    this.loading = false;
  }
}
