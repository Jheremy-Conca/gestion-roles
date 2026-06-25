import { ref, watch } from 'vue';

// Estado global del tema (se carga desde localStorage)
const tema = ref(localStorage.getItem('tema') || 'claro');

// Aplicar el tema al cargar
const aplicarTema = (nuevoTema) => {
  document.documentElement.setAttribute('data-tema', nuevoTema);
  localStorage.setItem('tema', nuevoTema);
};

// Aplicar inmediatamente
aplicarTema(tema.value);

// Observar cambios y aplicarlos
watch(tema, (nuevoTema) => {
  aplicarTema(nuevoTema);
});

export function useTheme() {
  const toggleTema = () => {
    tema.value = tema.value === 'claro' ? 'oscuro' : 'claro';
  };

  return {
    tema,
    toggleTema,
    esOscuro: () => tema.value === 'oscuro'
  };
}