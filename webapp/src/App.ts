import { Component, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';
import MinistersStore from '@/data/ministers.store';

@Component({})
export default class App extends Vue {
  public version = process.env.UPCI_WOH_VERSION;

  public ministers: Minister[] = [];

  private async mounted() {
    this.ministers = await MinistersStore.ministers;
  }
}
