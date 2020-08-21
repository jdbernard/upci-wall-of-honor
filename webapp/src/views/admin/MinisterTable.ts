import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('/admin/minister-table');

@Component({})
export default class MinisterTableView extends Vue {
}
