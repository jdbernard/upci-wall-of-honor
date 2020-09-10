export interface ToastMessage {
  message: string;
  type: 'info' | 'error' | 'success';
  icon?: string;
  duration?: number;
}

export default ToastMessage;
