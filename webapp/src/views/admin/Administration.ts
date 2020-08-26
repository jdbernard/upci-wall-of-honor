import { Component, Vue } from 'vue-property-decorator';
import AdminNavBarComponent from '@/components/admin/NavBar.vue';

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
    document.documentElement.style.setProperty('--base-font-size', '16px');
    if (window.innerWidth <= 480) {
      this.navCollapsed = true;
    }
  }

  private destroyed() {
    document.documentElement.style.setProperty('--base-font-size', '32px');
  }
}
