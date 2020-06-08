import { Component, Prop, Vue } from 'vue-property-decorator';
import { logService } from '@/services/logging';
import MinisterNameplate from '@/components/MinisterNameplate.vue';

const logger = logService.getLogger('/order-of-the-faith');

@Component({
  components: {
    MinisterNameplate
  }
})
export default class OotfEntryComponent extends Vue {
}
