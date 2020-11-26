import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class YearDividerComponent extends Vue {
  @Prop() name!: string;
}
