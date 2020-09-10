import { Component, Vue } from 'vue-property-decorator';
import AdminNavBarComponent from '@/components/admin/NavBar.vue';
import ToasterComponent from '@/components/admin/Toaster.vue';

@Component({
  components: {
    AdminNavBarComponent,
    ToasterComponent
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
