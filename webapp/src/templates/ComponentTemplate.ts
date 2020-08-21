import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('LOGGER_NAME');

@Component({})
export default class ComponentTemplate extends Vue {
}
