import { Component, Vue } from 'vue-property-decorator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import toastService from './toast.service';
import ToastMessage from './toast-message.model';

interface ToastMessageWithId extends ToastMessage {
  id: number;
}

@Component({})
export default class ToasterComponent extends Vue {
  public messages: ToastMessageWithId[] = [];
  private lastId = 0;
  private destroyed$ = new Subject<void>();

  public iconForMsg(msg: ToastMessage): string {
    if (msg.icon) return msg.icon;
    switch (msg.type) {
      case 'info':
        return 'info-circle';
      case 'error':
        return 'exclamation-triangle';
      case 'success':
        return 'check-circle';
    }
  }

  public mounted() {
    toastService.messages$.pipe(takeUntil(this.destroyed$)).subscribe(msg => {
      const msgWithId = { ...msg, id: this.lastId++ };
      this.messages.push(msgWithId);
      if (msg.duration) {
        setTimeout(() => {
          this.dismissMessage(msgWithId.id);
        }, msg.duration);
      }
    });
  }

  public dismissMessage(msgId: number) {
    this.messages = this.messages.filter(m => m.id !== msgId);
  }

  public destroyed() {
    this.destroyed$.next();
  }
}
