vue
<template>
  <div id="app">
    <Navbar v-if="auth.isAuthenticated" />
    <router-view />

    <!-- Notificaciones -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.tipo">
        {{ t.mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './store/auth';
import { useToast } from './composables/useToast';
import Navbar from './components/Navbar.vue';

const auth = useAuthStore();
const { toasts } = useToast();
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

/* === VARIABLES TEMA CLARO (por defecto) === */
:root,
[data-tema="claro"] {
  --bg-principal: #f0f2f5;
  --bg-tarjeta: #ffffff;
  --bg-navbar: #2c3e50;
  --bg-tabla-header: #34495e;
  --texto-principal: #2c3e50;
  --texto-secundario: #777777;
  --borde: #dddddd;
  --borde-suave: #eeeeee;
  --input-bg: #ffffff;
  --input-texto: #333333;
  --sombra: rgba(0, 0, 0, 0.1);
  --hover-fila: #f8f9fa;
}

/* === VARIABLES TEMA OSCURO === */
[data-tema="oscuro"] {
  --bg-principal: #1a1d24;
  --bg-tarjeta: #252932;
  --bg-navbar: #0f1115;
  --bg-tabla-header: #1a1d24;
  --texto-principal: #e4e6eb;
  --texto-secundario: #a0a0a0;
  --borde: #3a3f4b;
  --borde-suave: #2d3139;
  --input-bg: #1a1d24;
  --input-texto: #e4e6eb;
  --sombra: rgba(0, 0, 0, 0.4);
  --hover-fila: #2d3139;
}

body {
  font-family: 'Segoe UI', sans-serif;
  background: var(--bg-principal);
  color: var(--texto-principal);
  transition: background 0.3s, color 0.3s;
}

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.toast {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
  box-shadow: 0 4px 12px var(--sombra);
  animation: slideIn 0.3s ease;
  min-width: 250px;
}
.toast.success { background: #27ae60; }
.toast.error { background: #e74c3c; }
.toast.info { background: #3498db; }
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>