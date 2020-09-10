import { ReplaySubject } from 'rxjs';
import ToastMessage from './toast-message.model';

export class ToastService {
  public messages$ = new ReplaySubject<ToastMessage>(10);

  public makeToast(m: ToastMessage) {
    this.messages$.next(m);
  }
}

export default new ToastService();
