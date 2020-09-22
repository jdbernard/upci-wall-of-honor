import { Component, Emit, Model, Prop, Vue } from 'vue-property-decorator';
import throttle from 'lodash.throttle';
import {
  default as ministerPhotoUploadService,
  SUPPORTED_EXTENSIONS
} from '@/data/minister-photo-upload.service';
import toastService from '@/components/admin/toast.service';
import { Photo } from '@/data/minister.model';
import { isTouchEvent, isMouseEvent, pxToNumber } from '@/util';

interface PhotoPositioningCss {
  position?: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  width?: string;
  height?: string;
}

@Component({})
export default class MinisterPhotoComponent extends Vue {
  @Model('change') readonly photo!: Photo;
  @Prop() allowEdit!: boolean;

  $refs!: { image: HTMLImageElement };

  public supportedImageExtensions = SUPPORTED_EXTENSIONS;
  public uploading = false;
  public uploadProgress = 0;

  private moveData = {
    moving: false,
    originX: 0,
    originY: 0,
    imgX: 0,
    imgY: 0,
    deltaX: 0,
    deltaY: 0
  };

  public get imgStyle(): object {
    if (!this.photo) {
      return {};
    }

    const styleObj: PhotoPositioningCss = {};
    styleObj.position = 'relative';

    if (this.photo.xOffsetInPx) {
      styleObj.left = (this.photo.xOffsetInPx / 32).toFixed(4) + 'em';
    } else {
      styleObj.left = '0px';
    }

    if (this.photo.yOffsetInPx) {
      styleObj.top = (this.photo.yOffsetInPx / 32).toFixed(4) + 'em';
    } else {
      styleObj.top = '0px';
    }

    if (this.photo.widthInPx || this.photo.heightInPx) {
      styleObj.width = styleObj.height = 'auto';
    }

    if (this.photo.widthInPx) {
      styleObj.width = (this.photo.widthInPx / 32).toFixed(4) + 'em';
    }

    if (this.photo.heightInPx) {
      styleObj.height = (this.photo.heightInPx / 32).toFixed(4) + 'em';
    }

    return styleObj;
  }

  public moveStart(e: TouchEvent | MouseEvent) {
    if (!this.allowEdit) return;

    const style = window.getComputedStyle(this.$refs.image);

    this.moveData.imgX = style.left === 'auto' ? 0 : pxToNumber(style.left);
    this.moveData.imgY = style.top === 'auto' ? 0 : pxToNumber(style.top);
    this.moveData.moving = true;

    if (isTouchEvent(e)) {
      this.moveData.originX = e.touches[0].clientX;
      this.moveData.originY = e.touches[0].clientY;
    } else if (isMouseEvent(e)) {
      this.moveData.originX = e.clientX;
      this.moveData.originY = e.clientY;
    }
  }

  public move(e: TouchEvent | MouseEvent) {
    if (!this.moveData.moving) return;

    if (isTouchEvent(e)) {
      this.moveData.deltaX = e.touches[0].clientX - this.moveData.originX;
      this.moveData.deltaY = e.touches[0].clientY - this.moveData.originY;
    } else if (isMouseEvent(e)) {
      this.moveData.deltaX = e.clientX - this.moveData.originX;
      this.moveData.deltaY = e.clientY - this.moveData.originY;
    }

    this.$refs.image.style.left =
      this.moveData.imgX + this.moveData.deltaX + 'px';
    this.$refs.image.style.top =
      this.moveData.imgY + this.moveData.deltaY + 'px';
  }

  public moveEnd() {
    this.moveData.moving = false;
    this.emitChange();
  }

  public fitWidth() {
    if (!this.allowEdit) return;

    this.$refs.image.style.width = Math.ceil(364 * this.scaleFactor) + 'px';
    this.$refs.image.style.height = 'auto';
    this.$refs.image.style.top = '0px';
    this.$refs.image.style.left = '0px';

    this.emitChange();
  }

  public fitHeight() {
    if (!this.allowEdit) return;

    this.$refs.image.style.height = Math.ceil(490 * this.scaleFactor) + 'px';
    this.$refs.image.style.width = 'auto';
    this.$refs.image.style.top = '0px';
    this.$refs.image.style.left = '0px';

    this.emitChange();
  }

  public changeWidth(amount: number) {
    const curWidth = pxToNumber(
      window.getComputedStyle(this.$refs.image).width
    );

    this.$refs.image.style.height = 'auto';
    this.$refs.image.style.width = curWidth + amount + 'px';

    this.emitChange();
  }

  public uploadPhoto(event: InputEvent) {
    const fileInput = event?.target as HTMLInputElement;
    const file: File | null = (fileInput?.files || [])[0];
    if (!file) return;

    this.uploading = true;
    this.uploadProgress = 0;
    ministerPhotoUploadService
      .uploadPhoto(file, throttle(this.onUploadProgress, 100))
      .then(photo => {
        toastService.makeToast({
          type: 'success',
          duration: 5000,
          message: 'Photo upload finished.'
        });
        this.$emit('change', photo);
        this.uploading = false;
      })
      .catch(err => {
        toastService.makeToast({
          type: 'error',
          duration: 10000,
          message: 'Photo upload failed.'
        });
        this.uploading = false;
      });
  }

  public onUploadProgress(evt: ProgressEvent) {
    this.uploadProgress = (evt.loaded / evt.total) * 100;
  }

  @Emit('change')
  public emitChange(): Photo {
    const img = this.$refs.image;
    const style = window.getComputedStyle(img);
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const scaleFactor =
      32 / pxToNumber((style['font-size' as any] as string) || '32px');

    return {
      uri: this.$refs.image.attributes.getNamedItem('src')?.textContent || '',
      widthInPx: pxToNumber(style.width) * scaleFactor,
      xOffsetInPx:
        style.left === 'auto' ? 0 : pxToNumber(style.left) * scaleFactor,
      yOffsetInPx:
        style.top === 'auto' ? 0 : pxToNumber(style.top) * scaleFactor
    };
  }

  private get scaleFactor(): number {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
      32 /
      pxToNumber(
        (window.getComputedStyle(this.$refs.image)[
          'font-size' as any
        ] as string) || '32px'
      )
    );
  }
}
