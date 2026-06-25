vue
<template>
  <div class="dashboard">
    <h1>Panel de Control</h1>
    <div class="cards">
      <div class="card">
        <h3>👤 Tu Rol</h3>
        <p class="rol">{{ auth.usuario?.rol }}</p>
      </div>
      <div class="card">
        <h3>🔑 Permisos ({{ auth.permisos.length }})</h3>
        <ul>
          <li v-for="p in auth.permisos" :key="p">✅ {{ p }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
const auth = useAuthStore();
</script>

<style scoped>
.dashboard { padding: 2rem; }
.dashboard h1 { color: var(--texto-principal); }
.cards { display: flex; gap: 2rem; margin-top: 2rem; flex-wrap: wrap; }
.card {
  background: var(--bg-tarjeta);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--sombra);
  min-width: 250px;
  transition: background 0.3s;
}
.card h3 { color: var(--texto-principal); }
.card .rol { font-size: 1.5rem; color: #3498db; text-transform: capitalize; margin-top: 0.5rem; }
.card ul { list-style: none; margin-top: 1rem; }
.card li { padding: 0.3rem 0; color: var(--texto-principal); }
</style>