export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

class ToastStore {
  #toasts = $state<Toast[]>([]);

  get toasts() {
    return this.#toasts;
  }

  add(toast: Omit<Toast, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, ...toast };

    this.#toasts.push(newToast);

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  dismiss(id: string) {
    this.#toasts = this.#toasts.filter((t) => t.id !== id);
  }

  success(message: string, title?: string, duration?: number) {
    this.add({ message, title, type: 'success', duration });
  }

  error(message: string, title?: string, duration?: number) {
    this.add({ message, title, type: 'error', duration });
  }

  warning(message: string, title?: string, duration?: number) {
    this.add({ message, title, type: 'warning', duration });
  }

  info(message: string, title?: string, duration?: number) {
    this.add({ message, title, type: 'info', duration });
  }
}

export const toast = new ToastStore();
