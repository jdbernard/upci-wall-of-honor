import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AdminNavBarComponent from '@/components/admin/NavBar.vue';
import { logService } from '@jdbernard/logging';

const logger = logService.getLogger('/admin');

@Component({
  components: {
    AdminNavBarComponent
  }
})
export default class AdministrationView extends Vue {
  public navCollapsed = false;

  public handleNavCollapse(collapsed: boolean): void {
    this.navCollapsed = collapsed;
  }

  private mounted() {
    if (window.innerWidth <= 480) {
      this.navCollapsed = true;
    }
  }
}
