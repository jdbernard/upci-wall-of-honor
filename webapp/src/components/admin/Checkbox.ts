import { Component, Model, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class ComponentTemplate extends Vue {
  @Model('change', { type: Boolean }) readonly checked!: boolean;

  @Prop({ default: false })
  public disabled!: boolean;
}
