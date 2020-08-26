import { Component, Vue, Watch } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';
import moment from 'moment';
import { take } from 'rxjs/operators';
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
  public isModified = false;

  public mounted() {
    MinistersStore.ministers$
      .pipe(take(1))
      .subscribe(
        list =>
          (this.minister =
            list.find(m => m.slug === this.$route.params.slug) || null)
      );
  }

  public setOotF(val: boolean) {
    if (this.minister) {
      this.ootfChecked = val;
      if (val) {
        this.setHasBio(true);
        if (!this.minister.ootfYearInducted) {
          this.minister.ootfYearInducted = moment().year();
        }
      }
    }
  }
  public setHasBio(val: boolean) {
    if (val && this.minister) {
      if (!this.minister.details) {
        this.minister.details = {
          photo: {},
          biography: '<p>Add biography here...</p>'
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

  public bioChanged(evt: InputEvent) {
    if (this.minister?.details) {
      this.minister.details.biography = (evt.target as HTMLElement).innerHTML;
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
    return this.minister?.dateOfBirth?.format(DATE_FORMAT);
  }

  public get formattedDateOfDeath(): string | undefined {
    return this.minister?.dateOfDeath?.format(DATE_FORMAT);
  }

  @Watch('minister') public onMinisterChange(val: Minister) {
    this.bioChecked = !!val.details;
    this.ootfChecked = !!val.ootfYearInducted;
  }
}
