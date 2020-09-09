import { Component, Prop, Vue } from 'vue-property-decorator';
import UPCILogo from '@/assets/svg-components/UPCILogo.vue';
import UPCIIcon from '@/assets/svg-components/UPCIIcon.vue';
import OotFIcon from '@/assets/svg-components/OotFIcon.vue';
import VERSION from '@/version-info';
import { User } from '@/data/user.model';

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

  public version = VERSION;
  public user: User | null = null;

  public async mounted() {
    this.user = await this.$auth.getUser();
  }
}
