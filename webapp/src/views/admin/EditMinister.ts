import { Component, Vue, Ref, Watch } from 'vue-property-decorator';
import { logService } from '@jdbernard/logging';
import moment from 'moment';
import { take } from 'rxjs/operators';
import {
  Minister,
  deepClone,
  exactEquals,
  newMinister
} from '@/data/minister.model';
import CheckboxComponent from '@/components/admin/Checkbox.vue';
import MinisterBiographyComponent from '@/components/MinisterBiography.vue';
import MinisterPhotoComponent from '@/components/MinisterPhoto.vue';
import ministersStore from '@/data/ministers.store';
import TooltipComponent from '@/components/admin/Tooltip.vue';
import { slugify } from '@/filters/slugify.filter';
import { nameDisplay } from '@/filters/name-display.filter';
import toastService from '@/components/admin/toast.service';

const DATE_FORMAT = 'YYYY-MM-DD';

const logger = logService.getLogger('/admin/edit-minister');

@Component({
  components: {
    CheckboxComponent,
    MinisterBiographyComponent,
    MinisterPhotoComponent,
    TooltipComponent
  }
})
export default class EditMinisterView extends Vue {
  public minister: Minister | null = null;
  public ootfChecked = false;
  public bioChecked = false;
  public autoGenSlug = true;
  public isModified = false;
  public saving = false;

  @Ref('bio-editor') private bioEditor!: HTMLElement;
  private origMinister: Minister | null = null;
  private preview = false;

  public mounted() {
    if (this.$route.path.indexOf('edit-minister') > 0) {
      ministersStore.ministers$.pipe(take(1)).subscribe(list => {
        this.origMinister =
          list.find(m => m.slug === this.$route.params.slug) || null;
        if (this.origMinister) {
          this.minister = deepClone(this.origMinister);
          this.bioChecked = !!this.origMinister.details;
          this.ootfChecked = !!this.origMinister.ootfYearInducted;
          this.autoGenSlug =
            slugify(this.origMinister.name) === this.origMinister.slug;
          this.$watch('minister.name', this.onNameChange, { deep: true });
        } else {
          logger.error({
            function: 'mounted',
            ministerNotFound: { slug: this.$route.params.slug }
          });
        }

        logger.trace({
          function: 'mounted',
          ministerLoadedAt: performance.now()
        });
      });
    } else if (this.$route.path.indexOf('add-minister') > 0) {
      this.minister = newMinister();
      this.$watch('minister.name', this.onNameChange, { deep: true });
    } else {
      logger.fatal({ function: 'mounted', unrecognizedPath: this.$route.path });
      this.$router.push({ name: 'AminAllMinistersTable' });
      return;
    }

    logger.trace({ function: 'mounted', mountedAt: performance.now() });
  }

  public setOotF(val: boolean) {
    if (!this.minister) return;

    this.ootfChecked = val;
    if (val) {
      this.setHasBio(true);
      if (!this.minister.ootfYearInducted) {
        Vue.set(this.minister, 'ootfYearInducted', moment().year());
      }
    }
  }

  public setHasBio(val: boolean) {
    if (val && this.minister) {
      if (!this.minister.details) {
        Vue.set(this.minister, 'details', {
          photo: {},
          biography: '<p>Add biography here...</p>'
        });
      }

      this.bioChecked = true;
    } else if (!this.ootfChecked) {
      this.bioChecked = false;
    }
  }

  public setDateOfBirth(val: InputEvent) {
    if (this.minister) {
      Vue.set(
        this.minister,
        'dateOfBirth',
        moment((val.target as HTMLInputElement).value)
      );
    }
  }

  public setDateOfDeath(val: InputEvent) {
    if (this.minister) {
      const newVal = moment((val.target as HTMLInputElement).value);
      if (newVal.isValid()) {
        Vue.set(this.minister, 'dateOfDeath', moment(newVal));
        this.minister.isDeceased = true;
      } else {
        this.minister.isDeceased = false;
      }
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

  public setSlug(val: InputEvent) {
    if (!this.minister) return;
    this.minister.slug = (val.target as HTMLInputElement).value;
    this.autoGenSlug = false;
  }

  public bioChanged(evt: InputEvent) {
    const newBio = (evt.target as HTMLElement).innerHTML;

    // We want to detect when there is no text but doing a simple check of the
    // contents of newBio will not be enough because there may be HTML tags in
    // the content but still no displayed content. So we parse this as HTML and
    // pull out just the text content using HTMLElement.innerText and do our
    // comparison on that.
    const shadowEl = document.createElement('div');
    shadowEl.innerHTML = newBio;
    const text = shadowEl.innerText.trim();

    if (text.length === 0) {
      this.bioEditor.classList.add('invalid');
    } else {
      this.bioEditor.classList.remove('invalid');
    }

    if (this.minister?.details) {
      this.minister.details.biography = newBio;
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

  public get formattedDateOfBirth(): string | undefined {
    return this.minister?.dateOfBirth?.format(DATE_FORMAT);
  }

  public get formattedDateOfDeath(): string | undefined {
    return this.minister?.dateOfDeath?.format(DATE_FORMAT);
  }

  public save() {
    if (this.minister) {
      logger.trace({ function: 'save' });
      this.origMinister = deepClone(this.minister);
      this.saving = true;
      ministersStore
        .persistMinister(this.minister)
        .then(() => {
          toastService.makeToast({
            type: 'success',
            duration: 5000,
            message:
              (this.minister ? nameDisplay(this.minister) : 'Minster') +
              ' saved.'
          });
          this.isModified = false;
          this.saving = false;
          this.$router.go(-1); // TODO: rethink this approach
        })
        .catch(() => {
          this.saving = false;
          toastService.makeToast({
            type: 'error',
            duration: 10000,
            message:
              'Unable to save ' +
              (this.minister ? nameDisplay(this.minister) : 'minister.')
          });
        });
    }
  }

  public cancel() {
    if (this.origMinister) {
      this.minister = deepClone(this.origMinister);
      this.bioChecked = !!this.origMinister.details;
      this.ootfChecked = !!this.origMinister.ootfYearInducted;
    }
  }

  @Watch('minister', { deep: true })
  public onMinisterChangeDeep() {
    if (!this.minister) return;

    const formIsValid =
      this.$el.querySelectorAll(':invalid, .invalid').length === 0;

    this.isModified =
      formIsValid && !exactEquals(this.minister, this.origMinister);
  }

  public onNameChange() {
    if (!this.minister) return;

    if (this.autoGenSlug) {
      this.minister.slug = slugify(this.minister.name);
    }
  }
}
