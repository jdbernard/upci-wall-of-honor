import { Component, Vue, Watch } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';
import moment from 'moment';
import { Minister } from '@/data/minister.model';
import Checkbox from '@/components/admin/Checkbox.vue';
import MinistersStore from '@/data/ministers.store';
import MinisterPhotoComponent from '@/components/MinisterPhoto.vue';

const DATE_FORMAT = 'YYYY-MM-DD';

const logger = logService.getLogger('/admin/edit-minister');

@Component({
  components: {
    Checkbox,
    MinisterPhotoComponent
  }
})
export default class EditMinisterView extends Vue {
  public minister: Minister | null = null;
  public ootfChecked = false;
  public bioChecked = false;

  public async mounted() {
    this.minister =
      (await MinistersStore.ministers).find(
        m => m.slug === this.$route.params.slug
      ) || null;
  }

  public setHasBio(val: boolean): void {
    if (val && this.minister) {
      if (!this.minister.details) {
        this.minister.details = {
          photo: {},
          biography: 'Add biography here...'
        };
      }

      this.bioChecked = true;
    } else if (!this.ootfChecked) {
      this.bioChecked = false;
    }
  }

  public setDateOfBirth(val: string) {
    if (this.minister) {
      this.minister.dateOfBirth = moment(val);
    }
  }

  public additionalNameChanged(evt: InputEvent, idx: number) {
    if (!this.minister) return;

    const value = (evt.target as HTMLInputElement).value;
    const additionalNames = this.minister.name?.additional?.slice(0) || [];

    logger.trace({ function: 'additionalNameChange', value, idx });

    if (additionalNames[idx] !== undefined) {
      additionalNames[idx] = value;
    } else {
      additionalNames.push(value);
    }
    this.minister.name.additional = additionalNames;
  }

  public cleanupAdditionalNames() {
    if (!this.minister) return;

    this.minister.name.additional = this.minister.name.additional?.filter(
      x => !!x
    );
  }

  public setDateOfDeath(val: string) {
    if (this.minister) {
      this.minister.dateOfDeath = moment(val);
      this.minister.isDeceased = true;
    }
  }

  public setLiving(val: boolean) {
    if (this.minister) {
      this.minister.isDeceased = !val;
      if (!this.minister.isDeceased && this.minister.dateOfDeath) {
        delete this.minister.dateOfDeath;
      }
    }
  }

  public get formattedDateOfBirth(): string | undefined {
    logger.trace({
      function: 'get formattedDateOfBirth',
      value: this.minister?.dateOfBirth?.format(DATE_FORMAT)
    });
    return this.minister?.dateOfBirth?.format(DATE_FORMAT);
  }

  public get formattedDateOfDeath(): string | undefined {
    return this.minister?.dateOfDeath?.format(DATE_FORMAT);
  }

  @Watch('minister') public onMinisterChange(val: Minister) {
    this.bioChecked = !!val.details;
    this.ootfChecked = !!val.ootfYearInducted;
  }

  @Watch('ootfChecked') public ootfCheckedChange(val: boolean) {
    if (val) {
      this.setHasBio(true);
    }
  }
}
