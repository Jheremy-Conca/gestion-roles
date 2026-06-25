vue
<template>
  <nav class="navbar">
    <div class="nav-brand">🔐 Gestión de Roles</div>
    <div class="nav-links">
      <router-link to="/">Dashboard</router-link>
      <router-link to="/usuarios" v-if="auth.tienePermiso('leer')">Usuarios</router-link>
      <router-link to="/roles" v-if="auth.tienePermiso('gestionar_roles')">Roles</router-link>
    </div>
    <div class="nav-user">
      <!-- Botón de tema ⭐ -->
      <button @click="toggleTema" class="btn-tema" :title="tema === 'claro' ? 'Modo oscuro' : 'Modo claro'">
        {{ tema === 'claro' ? '🌙' : '☀️' }}
      </button>
      <span>{{ auth.usuario?.nombre }} ({{ auth.usuario?.rol }})</span>
      <button @click="logout" class="btn-salir">Salir</button>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { useTheme } from '../composables/useTheme';

const auth = useAuthStore();
const router = useRouter();
const { tema, toggleTema } = useTheme();

const logout = () => { auth.logout(); router.push('/login'); };
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-navbar);
  padding: 1rem 2rem;
  color: white;
  transition: background 0.3s;
}
.nav-brand { font-size: 1.3rem; font-weight: bold; }
.nav-links a { color: white; text-decoration: none; margin: 0 1rem; padding: 0.5rem; }
.nav-links a.router-link-active { color: #3498db; }
.nav-user { display: flex; align-items: center; gap: 1rem; }
.btn-tema {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  font-size: 1.2rem;
  padding: 0.5rem 0.8rem;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-tema:hover { background: rgba(255, 255, 255, 0.2); }
.btn-salir {
  background: #e74c3c;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>