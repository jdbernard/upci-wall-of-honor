import { Component, Prop, Vue } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';
import UPCILogo from '@/assets/svg-components/UPCILogo.vue';
import UPCIIcon from '@/assets/svg-components/UPCIIcon.vue';
import OotFIcon from '@/assets/svg-components/OotFIcon.vue';

const logger = logService.getLogger('/admin/nav-bar');

@Component({
  components: {
    UPCILogo,
    UPCIIcon,
    OotFIcon
  }
})
export default class AdminNavBarComponent extends Vue {
  @Prop()
  public collapsed!: boolean;
}
