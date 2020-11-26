import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class AdminLoadingPlaceholder extends Vue {
  @Prop({ default: 'ministers' }) resourceName!: string;
}
