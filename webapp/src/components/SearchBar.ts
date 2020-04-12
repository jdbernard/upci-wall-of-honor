import { Component, Emit, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class SearchBarComponent extends Vue {
  @Prop() years!: number[];
  byName = false;
  byYear = false;

  @Emit() nameFilterChanged(filter: string) {
    return filter;
  }
}
