import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class TooltipComponent extends Vue {
  @Prop({ default: 'info' }) type!: 'info' | 'error';
  @Prop({ default: false }) alwaysVisible!: boolean;

  public focusMe() {
    (this.$el as HTMLElement).focus();
  }
}
