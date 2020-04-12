import { Component, Vue } from 'vue-property-decorator';
import SearchBarComponent from '@/components/SearchBar.vue';

@Component({
  components: { SearchBarComponent }
})
export default class DeceasedMinistersView extends Vue {}
