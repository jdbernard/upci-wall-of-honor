import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import UPCILogo from '@/assets/svg-components/UPCILogo.vue';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('LOGGER_NAME');

@Component({ components: { UPCILogo } })
export default class AdminLoginView extends Vue {
  public username = '';
  public password = '';

  public login() {
    console.log('login');
  }
}
