import { Component, Prop, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';
import MinisterNameplate from '@/components/MinisterNameplate.vue';
import MinisterPhoto from '@/components/MinisterPhoto.vue';

@Component({
  components: {
    MinisterNameplate,
    MinisterPhoto
  }
})
export default class OotFEntryComponent extends Vue {
  @Prop() minister!: Minister;
}
