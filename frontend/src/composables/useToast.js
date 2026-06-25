import { ref } from 'vue';

const toasts = ref([]);
let id = 0;

export function useToast() {
  const mostrar = (mensaje, tipo = 'info') => {
    const toastId = id++;
    toasts.value.push({ id: toastId, mensaje, tipo });
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== toastId);
    }, 3000);
  };

  return {
    toasts,
    success: (msg) => mostrar(msg, 'success'),
    error: (msg) => mostrar(msg, 'error'),
    info: (msg) => mostrar(msg, 'info')
  };
}