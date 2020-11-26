import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { List } from 'immutable';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { uuid } from '@cfworker/uuid';
import { logService } from '@jdbernard/logging';
import { BoardCategory } from '@/data/board-category.model';
import { BoardMember } from '@/data/board-member.model';
import boardCategoriesStore from '@/data/board-categories.store';
import boardMembersStore from '@/data/board-members.store';
import AdminLoadingPlaceholder from '@/components/admin/LoadingPlaceholder.vue';
import toastService from '@/components/admin/toast.service';
import { keyBy, bySortOrder } from '@/util';

const logger = logService.getLogger('/admin/leadership/executive');

interface RowEditData {
  needsTitle: boolean;
  name: string;
  title: string;
  saving: boolean;
}

@Component({
  components: {
    AdminLoadingPlaceholder,
    draggable
  }
})
export default class AdminGeneralBoardView extends Vue {
  public loading = true;
  public curCategoryId = '';
  public searchInput = '';

  public categories = List<BoardCategory>();
  public members = {} as Record<string, BoardMember[]>;

  private destroyed$ = new Subject<void>();

  public newData: RowEditData = {
    name: '',
    needsTitle: false,
    saving: false,
    title: ''
  };

  public rowEdits = {} as Record<string, RowEditData>;

  isMatch(m: BoardMember, s: string): boolean {
    if (!s || !s.trim()) return true;
    return (
      m.name.toLowerCase().indexOf(s.toLowerCase()) >= 0 ||
      (!!m.title && m.title.toLowerCase().indexOf(s.toLowerCase()) >= 0)
    );
  }

  public addMember(catId: string) {
    this.newData.needsTitle =
      this.categories.find(c => c.id === catId)?.includeTitles || false;
    const validData = this.validateAndReport(this.newData);
    if (!validData) return;

    this.newData.saving = true;
    const newMember: BoardMember = {
      id: uuid(),
      categoryId: catId,
      name: validData.name
    };

    if (this.newData.title) {
      newMember.title = this.newData.title;
    }

    boardMembersStore
      .persistBoardMember(newMember)
      .then(() => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: 'Added ' + newMember.name + '.'
        });
        this.newData.name = '';
        this.newData.title = '';
        this.newData.saving = false;
        this.newData.needsTitle = false;
        const firstInput = ((this.$refs?.firstInput ||
          []) as HTMLInputElement[]).find(
          el => el.dataset.catid === newMember.categoryId
        );
        if (firstInput) firstInput.focus();
      })
      .catch(error => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to add ' + newMember.name + '.'
        });
        this.newData.saving = false;
        logger.error(error);
      });
  }

  public editMember(m: BoardMember) {
    Vue.set(this.rowEdits, m.id, {
      name: m.name,
      title: m.title,
      needsTitle:
        this.categories.find(c => c.id === m.categoryId)?.includeTitles ||
        false,
      saving: false
    });
  }

  public cancelEdit(m: BoardMember) {
    Vue.delete(this.rowEdits, m.id);
    logger.trace({ function: 'cancelEdit' });
  }

  public removeMember(m: BoardMember) {
    boardMembersStore
      .removeBoardMember(m)
      .then(() => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: m.name + ' removed.'
        });
      })
      .catch(() => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to remove ' + m.name + '.'
        });
      });
  }

  public saveMember(m: BoardMember) {
    const validData = this.validateAndReport(this.rowEdits[m.id]);
    if (!validData) return;

    const edits = this.rowEdits[m.id];
    edits.saving = true;
    const updated: BoardMember = {
      ...m,
      name: validData.name
    };

    if (validData.title) updated.title = validData.title;

    boardMembersStore
      .persistBoardMember(updated)
      .then(memberResult => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: memberResult.name + ' saved.'
        });
        Vue.delete(this.rowEdits, m.id);
      })
      .catch(error => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to save the changes the ' + m.name
        });
        this.rowEdits[m.id].saving = false;
        logger.error({ function: 'saveMember', error });
      });
  }

  public validateAndReport(d: RowEditData): RowEditData | undefined {
    const validation = this.validateEdits(d);
    if (!validation.isValid) {
      toastService.makeToast({
        duration: 10000,
        type: 'error',
        message: validation.message
      });
    }
    return validation.validData;
  }

  public validateEdits(
    d: RowEditData,
    needsTitle?: boolean
  ): { message: string; isValid: boolean; validData?: RowEditData } {
    if (!d) {
      return { message: 'No data provided.', isValid: false };
    }

    if (!d.name || !d.name.trim()) {
      return {
        message: 'Board members must have a name.',
        isValid: false
      };
    }

    if ((d.needsTitle || needsTitle) && (!d.title || !d.title.trim())) {
      return {
        message: 'Board members in this category must have a title.',
        isValid: false
      };
    }

    return { message: '', isValid: true, validData: d };
  }

  private async mounted() {
    combineLatest(
      boardCategoriesStore.boardCategories$,
      boardMembersStore.boardMembers$
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateCategoriesAndMembers);

    logger.trace({ function: 'mounted' });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private byLastName(a: BoardMember, b: BoardMember): number {
    const aParts = a.name.split(' ');
    const bParts = b.name.split(' ');
    const lastA = aParts[aParts.length - 1];
    const lastB = bParts[bParts.length - 1];

    return lastA.localeCompare(lastB);
  }

  private updateCategoriesAndMembers(
    value: [List<BoardCategory>, List<BoardMember>]
  ) {
    this.categories = value[0].sort(bySortOrder);
    this.members = keyBy(
      value[1].sort(this.byLastName),
      'categoryId'
    ).toJS() as Record<string, BoardMember[]>;
    this.loading = false;
    if (!this.curCategoryId) {
      this.curCategoryId = this.categories.first({ id: '' }).id;
    }
  }
}
