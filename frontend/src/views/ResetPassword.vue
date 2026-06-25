vue
<template>
  <div class="reset-container">
    <div class="reset-box">
      <h2>🔐 Nueva Contraseña</h2>
      <p class="subtitle">Ingresa tu nueva contraseña</p>

      <form @submit.prevent="restablecer" v-if="!completado">
        <input
          v-model="password"
          type="password"
          placeholder="Nueva contraseña (mín. 6)"
          required
        />
        <input
          v-model="confirmar"
          type="password"
          placeholder="Confirmar contraseña"
          required
        />
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </form>

      <div v-if="completado" class="exito">
        <p>✅ ¡Contraseña actualizada!</p>
        <router-link to="/login" class="btn-login">Ir al login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '../services/api';
import { useToast } from '../composables/useToast';

const route = useRoute();
const password = ref('');
const confirmar = ref('');
const cargando = ref(false);
const completado = ref(false);
const toast = useToast();

const restablecer = async () => {
  if (password.value !== confirmar.value) {
    toast.error('Las contraseñas no coinciden');
    return;
  }

  cargando.value = true;
  try {
    await api.post('/password/reset', {
      token: route.params.token, // Token de la URL
      nuevaPassword: password.value
    });
    completado.value = true;
    toast.success('Contraseña actualizada');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Token inválido o expirado');
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.reset-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
.reset-box { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); width: 400px; text-align: center; }
.reset-box h2 { margin-bottom: 0.5rem; }
.subtitle { color: #777; margin-bottom: 1.5rem; font-size: 0.9rem; }
input { width: 100%; padding: 0.8rem; margin-bottom: 1rem; border: 1px solid #ddd; border-radius: 5px; }
button { width: 100%; padding: 0.8rem; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:disabled { background: #95a5a6; }
.exito { background: #f0fdf4; padding: 1.5rem; border-radius: 8px; }
.btn-login { display: inline-block; margin-top: 1rem; padding: 0.7rem 1.5rem; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
</style>