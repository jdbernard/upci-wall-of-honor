import { Component, Prop, Vue } from 'vue-property-decorator';
import UPCILogo from '@/assets/svg-components/UPCILogo.vue';
import UPCIIcon from '@/assets/svg-components/UPCIIcon.vue';
import OotFIcon from '@/assets/svg-components/OotFIcon.vue';
import VERSION from '@/version-info';
import { User } from '@/data/user.model';
import PowerToolsComponent from '@/components/admin/PowerTools.vue';

@Component({
  components: {
    UPCILogo,
    UPCIIcon,
    OotFIcon,
    PowerToolsComponent
  }
})
export default class AdminNavBarComponent extends Vue {
  @Prop()
  public collapsed!: boolean;

  public version = VERSION;
  public user: User | null = null;
  public powerToolsEnabled = false;
  private ptFirstClick = 0;

  public async mounted() {
    this.user = await this.$auth.getUser();
  }

  public enablePowerTools() {
    if (this.powerToolsEnabled) return;

    const now = performance.now();
    if (now - this.ptFirstClick < 500) {
      this.powerToolsEnabled = true;
    } else {
      this.ptFirstClick = now;
    }
  }
}
