vue
<template>
  <div class="pagination" v-if="totalPaginas > 1">
    <button
      @click="cambiar(paginaActual - 1)"
      :disabled="paginaActual === 1"
      class="page-btn"
    >
      ← Anterior
    </button>

    <button
      v-for="p in paginas"
      :key="p"
      @click="cambiar(p)"
      class="page-btn"
      :class="{ activo: p === paginaActual }"
    >
      {{ p }}
    </button>

    <button
      @click="cambiar(paginaActual + 1)"
      :disabled="paginaActual === totalPaginas"
      class="page-btn"
    >
      Siguiente →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  paginaActual: { type: Number, required: true },
  totalPaginas: { type: Number, required: true }
});

const emit = defineEmits(['cambiar']);

// Genera el array de números de página [1, 2, 3...]
const paginas = computed(() => {
  const arr = [];
  for (let i = 1; i <= props.totalPaginas; i++) {
    arr.push(i);
  }
  return arr;
});

const cambiar = (pagina) => {
  if (pagina >= 1 && pagina <= props.totalPaginas) {
    emit('cambiar', pagina);
  }
};
</script>
<style scoped>
.pagination { display: flex; justify-content: center; gap: 0.5rem; margin-top: 1.5rem; }
.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--borde);
  background: var(--bg-tarjeta);
  color: var(--texto-principal);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}
.page-btn:hover:not(:disabled) { background: #3498db; color: white; border-color: #3498db; }
.page-btn.activo { background: #3498db; color: white; border-color: #3498db; font-weight: bold; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
</style>