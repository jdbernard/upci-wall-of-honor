import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { List } from 'immutable';
import SearchBarComponent from '@/components/SearchBar.vue';
import { Minister } from '@/data/minister.model';
import { SearchState, toQuery } from '@/data/search.model';
import { logService } from '@/services/logging';

const logger = logService.getLogger('/order-of-the-faith');

@Component({
  components: {
    SearchBarComponent
  }
})
export default class OrderOfTheFaithView extends Vue {
  public oofMinisters = List<Minister>();

  @Prop({
    default: () => ({
      type: 'none'
    })
  })
  public searchState!: SearchState;

  public doSearch(search: SearchState) {
    logger.trace({ function: 'doSearch', search });
    const query = toQuery(search);
    this.$router.push({ path: '/deceased-ministers', query });
  }
}
