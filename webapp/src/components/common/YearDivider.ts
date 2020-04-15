import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class YearDividerComponent extends Vue {
  @Prop() year!: number;
  @Prop() observer?: IntersectionObserver;

  public mounted() {
    if (this.observer) {
      this.observer.observe(this.$el);
    }
  }
}
