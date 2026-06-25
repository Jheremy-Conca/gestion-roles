vue
<template>
  <div class="login-container">
    <div class="login-box">
      <h2>🔐 Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
      <router-link to="/forgot-password" class="forgot-link">
        ¿Olvidaste tu contraseña?
      </router-link>
      <small>Demo: admin@admin.com / admin123</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { useToast } from '../composables/useToast';

const email = ref('');
const password = ref('');
const cargando = ref(false);
const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const handleLogin = async () => {
  cargando.value = true;
  try {
    await auth.login(email.value, password.value);
    toast.success('¡Bienvenido!');
    router.push('/');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al iniciar sesión');
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
.login-box { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); width: 350px; text-align: center; }
.login-box h2 { margin-bottom: 1.5rem; }
input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; }
button { width: 100%; padding: 0.8rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem; }
button:disabled { background: #95a5a6; cursor: not-allowed; }
.forgot-link { display: block; margin-top: 1rem; color: #3498db; text-decoration: none; font-size: 0.9rem; }
small { color: #999; display: block; margin-top: 1rem; }
</style>