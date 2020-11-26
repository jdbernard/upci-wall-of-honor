import { Component, Vue } from 'vue-property-decorator';
import draggable from 'vuedraggable';
import { List, Map } from 'immutable';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import debounce from 'lodash.debounce';
import { uuid } from '@cfworker/uuid';
import { logService } from '@jdbernard/logging';
import leadershipPositionsStore from '@/data/leadership-positions.store';
import {
  LeadershipPosition,
  GENERAL_OFFICIALS_MINISTRY
} from '@/data/leadership-position.model';
import ministersStore from '@/data/ministers.store';
import { Minister } from '@/data/minister.model';
import MinisterSelect from '@/components/MinisterSelect.vue';
import toastService from '@/components/admin/toast.service';

const logger = logService.getLogger('/admin/leadership/executive');

interface RowEditData {
  ministerId: string | null;
  title: string;
  saving: boolean;
}

interface ValidRowData {
  ministerId: string;
  title: string;
}

@Component({
  components: {
    MinisterSelect,
    draggable
  }
})
export default class AdminGeneralOfficialsView extends Vue {
  public loading = true;
  public leaders = Array<LeadershipPosition>();
  public livingMinisters = Map<string, Minister>();

  public newData: RowEditData = {
    title: '',
    ministerId: null,
    saving: false
  };

  public rowEdits = {} as Record<string, RowEditData>;
  private destroyed$ = new Subject<void>();

  public addLeader() {
    const validData = this.validateAndReport(this.newData);
    if (!validData) return;

    this.newData.saving = true;
    const newLeader: LeadershipPosition = {
      id: uuid(),
      ministerId: validData.ministerId,
      title: validData.title,
      ministryName: GENERAL_OFFICIALS_MINISTRY,
      sortOrder:
        this.leaders.reduce(
          (acc, l) => (acc > l.sortOrder ? acc : l.sortOrder),
          0
        ) + 1
    };

    leadershipPositionsStore
      .persistLeadershipPosition(newLeader)
      .then(() => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: 'Added the ' + newLeader.title + ' position.'
        });
        this.newData.title = '';
        this.newData.saving = false;
        this.newData.ministerId = null;
      })
      .catch(error => {
        toastService.makeToast({
          duration: 10000,
          type: 'success',
          message: 'Unable to add the ' + newLeader.title + ' position.'
        });
        this.newData.saving = false;
        logger.error(error);
      });
  }

  public editPosition(l: LeadershipPosition) {
    Vue.set(this.rowEdits, l.id, {
      title: l.title,
      ministerId: l.ministerId,
      saving: false
    });
  }

  public cancelEdit(l: LeadershipPosition) {
    Vue.delete(this.rowEdits, l.id);
    logger.trace({ function: 'cancelEdit' });
  }

  public removePosition(l: LeadershipPosition) {
    leadershipPositionsStore
      .removeLeadershipPosition(l)
      .then(() => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: l.title + ' position removed.'
        });
      })
      .catch(() => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to remove the ' + l.title + ' position.'
        });
      });
  }

  public savePosition(l: LeadershipPosition) {
    const validData = this.validateAndReport(this.rowEdits[l.id]);
    if (!validData) return;

    const edits = this.rowEdits[l.id];
    edits.saving = true;
    const updated: LeadershipPosition = {
      ...l,
      title: validData.title,
      ministerId: validData.ministerId
    };
    leadershipPositionsStore
      .persistLeadershipPosition(updated)
      .then(leaderResult => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: leaderResult.title + ' updates saved.'
        });
        Vue.delete(this.rowEdits, l.id);
      })
      .catch(error => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to save the changes to the ' + l.title + 'position.'
        });
        this.rowEdits[l.id].saving = false;
        logger.error({ function: 'savePosition', error });
      });
  }

  public validateAndReport(d: RowEditData): ValidRowData | undefined {
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
    d: RowEditData
  ): { message: string; isValid: boolean; validData?: ValidRowData } {
    if (!d) {
      return { message: 'No data provided.', isValid: false };
    }

    if (!d.title) {
      return {
        message: 'Missing value for the position title.',
        isValid: false
      };
    }

    if (!d.ministerId || !this.livingMinisters.has(d.ministerId)) {
      return {
        message:
          'You must select a valid minister to hold the position. ' +
          'Also, the minister record must have a biography.',
        isValid: false
      };
    }
    return { message: '', isValid: true, validData: d as ValidRowData };
  }

  public reorder!: () => void;

  private reorderImpl() {
    logger.trace({ function: 'reorder' });
    Promise.all(
      this.leaders.map((l, idx) => {
        l.sortOrder = idx;
        return leadershipPositionsStore.persistLeadershipPosition(l);
      })
    )
      .then(() => {
        toastService.makeToast({
          duration: 5000,
          type: 'success',
          message: 'Re-ordered list saved.'
        });
      })
      .catch(() => {
        toastService.makeToast({
          duration: 10000,
          type: 'error',
          message: 'Unable to re-order the list.'
        });
        this.leaders.sort((a, b) => a.sortOrder - b.sortOrder);
      });
  }

  private async mounted() {
    this.reorder = debounce(this.reorderImpl, 4000);

    combineLatest(
      leadershipPositionsStore.leadershipPositions$,
      ministersStore.livingMinistersWithBio$
    )
      .pipe(takeUntil(this.destroyed$))
      .subscribe(this.updateLeadersAndMinisters);

    logger.trace({ function: 'mounted' });
  }

  private destroyed() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private updateLeadersAndMinisters(
    value: [List<LeadershipPosition>, List<Minister>]
  ) {
    this.leaders = value[0]
      .filter(l => l.ministryName === GENERAL_OFFICIALS_MINISTRY)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .toJS();
    this.livingMinisters = Map<string, Minister>(value[1].map(m => [m.id, m]));
    this.loading = false;
  }
}