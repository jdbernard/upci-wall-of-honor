import { Component, Prop, Vue } from 'vue-property-decorator';
import { Minister } from '@/data/minister.model';

@Component({})
export default class MinisterPhotoComponent extends Vue {
  @Prop() minister!: Minister;

  public get imgStyle(): object {
    if (!this.minister.details) {
      return {};
    }

    const styleObj: any = {};
    const photo = this.minister.details.photo;
    if (photo.xOffsetInPx || photo.yOffsetInPx) {
      styleObj.position = 'relative';
    }

    if (photo.xOffsetInPx) {
      styleObj.left = (photo.xOffsetInPx / 32).toFixed(4) + 'rem';
    }

    if (photo.yOffsetInPx) {
      styleObj.top = (photo.yOffsetInPx / 32).toFixed(4) + 'rem';
    }

    if (photo.widthInPx || photo.heightInPx) {
      styleObj.width = styleObj.height = 'auto';
    }

    if (photo.widthInPx) {
      styleObj.width = (photo.widthInPx / 32).toFixed(4) + 'rem';
    }

    if (photo.heightInPx) {
      styleObj.height = (photo.heightInPx / 32).toFixed(4) + 'rem';
    }

    return styleObj;
  }
}
