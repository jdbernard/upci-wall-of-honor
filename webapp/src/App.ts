import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
  public version = process.env.UPCI_WOH_VERSION;
}
