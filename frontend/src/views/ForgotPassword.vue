vue
<template>
  <div class="forgot-container">
    <div class="forgot-box">
      <h2>🔑 Recuperar Contraseña</h2>
      <p class="subtitle">Ingresa tu email y te enviaremos un enlace de recuperación</p>

      <form @submit.prevent="enviar" v-if="!enviado">
        <input
          v-model="email"
          type="email"
          placeholder="Tu email"
          :class="{ 'input-error': errorEmail }"
        />
        <span v-if="errorEmail" class="error-text">{{ errorEmail }}</span>
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Enviando...' : 'Enviar enlace' }}
        </button>
      </form>

      <div v-if="enviado" class="resultado">
        <p>📧 ¡Email enviado!</p>
        <small>Revisa tu bandeja de entrada (y spam). El enlace expira en 1 hora.</small>
      </div>

      <router-link to="/login" class="volver">← Volver al login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';
import { useToast } from '../composables/useToast';

const email = ref('');
const cargando = ref(false);
const enviado = ref(false);
const errorEmail = ref('');
const toast = useToast();

const enviar = async () => {
  errorEmail.value = '';

  // Validación frontend
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errorEmail.value = 'El email es obligatorio';
    return;
  }
  if (!emailRegex.test(email.value)) {
    errorEmail.value = 'Email inválido';
    return;
  }

  cargando.value = true;
  try {
    await api.post('/password/forgot', { email: email.value });
    enviado.value = true;
    toast.success('Email enviado correctamente');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al enviar');
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.forgot-container { display: flex; justify-content: center; align-items: center; height: 100vh; }
.forgot-box { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.1); width: 400px; text-align: center; }
.forgot-box h2 { margin-bottom: 0.5rem; }
.subtitle { color: #777; margin-bottom: 1.5rem; font-size: 0.9rem; }
input { width: 100%; padding: 0.8rem; margin-bottom: 0.5rem; border: 1px solid #ddd; border-radius: 5px; }
.input-error { border-color: #e74c3c; }
.error-text { color: #e74c3c; font-size: 0.85rem; display: block; margin-bottom: 1rem; text-align: left; }
button { width: 100%; padding: 0.8rem; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 0.5rem; }
button:disabled { background: #95a5a6; }
.resultado { background: #f0fdf4; padding: 1.5rem; border-radius: 8px; margin: 1rem 0; }
.resultado small { color: #777; display: block; margin-top: 0.5rem; }
.volver { display: block; margin-top: 1rem; color: #3498db; text-decoration: none; }
</style>