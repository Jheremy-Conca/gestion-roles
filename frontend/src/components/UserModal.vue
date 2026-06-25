vue
<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ esEdicion ? '✏️ Editar Usuario' : '➕ Nuevo Usuario' }}</h3>
        <button class="btn-close" @click="cerrar">✕</button>
      </div>

      <div class="modal-body">
        <!-- Nombre -->
        <div class="form-group">
          <label>Nombre *</label>
          <input
            v-model="form.nombre"
            type="text"
            placeholder="Nombre completo"
            :class="{ 'input-error': errores.nombre }"
          />
          <span v-if="errores.nombre" class="error-text">{{ errores.nombre }}</span>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label>Email *</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="correo@ejemplo.com"
            :class="{ 'input-error': errores.email }"
          />
          <span v-if="errores.email" class="error-text">{{ errores.email }}</span>
        </div>

        <!-- Contraseña (solo al crear) -->
        <div class="form-group" v-if="!esEdicion">
          <label>Contraseña *</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            :class="{ 'input-error': errores.password }"
          />
          <span v-if="errores.password" class="error-text">{{ errores.password }}</span>
        </div>

        <!-- Rol -->
        <div class="form-group">
          <label>Rol *</label>
          <select v-model="form.role_id" :class="{ 'input-error': errores.role_id }">
            <option value="">-- Selecciona un rol --</option>
            <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.nombre }}</option>
          </select>
          <span v-if="errores.role_id" class="error-text">{{ errores.role_id }}</span>
        </div>

        <!-- Estado (solo al editar) ⭐ -->
        <div class="form-group" v-if="esEdicion">
          <label>Estado de la cuenta</label>
          <div class="toggle-container">
            <label class="toggle">
              <input type="checkbox" v-model="form.activo" />
              <span class="slider"></span>
            </label>
            <span :class="form.activo ? 'estado-activo' : 'estado-inactivo'">
              {{ form.activo ? '🟢 Activo (puede iniciar sesión)' : '🔴 Inactivo (acceso bloqueado)' }}
            </span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="cerrar">Cancelar</button>
        <button class="btn-save" @click="guardar" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  usuario: { type: Object, default: null },
  roles: { type: Array, default: () => [] }
});

const emit = defineEmits(['guardar', 'cerrar']);

const cargando = ref(false);
const errores = ref({});
const form = ref({
  nombre: '',
  email: '',
  password: '',
  role_id: '',
  activo: true
});

const esEdicion = computed(() => props.usuario !== null);

// Llenar el formulario en modo edición
watch(() => props.usuario, (nuevoUsuario) => {
  if (nuevoUsuario) {
    form.value = {
      nombre: nuevoUsuario.nombre,
      email: nuevoUsuario.email,
      password: '',
      role_id: nuevoUsuario.role_id,
      activo: nuevoUsuario.activo
    };
  } else {
    form.value = { nombre: '', email: '', password: '', role_id: '', activo: true };
  }
  errores.value = {};
}, { immediate: true });

// VALIDACIÓN EN EL FRONTEND ⭐
const validar = () => {
  errores.value = {};
  let valido = true;

  // Nombre
  if (!form.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es obligatorio';
    valido = false;
  } else if (form.value.nombre.trim().length < 3) {
    errores.value.nombre = 'Mínimo 3 caracteres';
    valido = false;
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errores.value.email = 'El email es obligatorio';
    valido = false;
  } else if (!emailRegex.test(form.value.email)) {
    errores.value.email = 'Email inválido';
    valido = false;
  }

  // Contraseña (solo al crear)
  if (!esEdicion.value) {
    if (!form.value.password) {
      errores.value.password = 'La contraseña es obligatoria';
      valido = false;
    } else if (form.value.password.length < 6) {
      errores.value.password = 'Mínimo 6 caracteres';
      valido = false;
    }
  }

  // Rol
  if (!form.value.role_id) {
    errores.value.role_id = 'Debes seleccionar un rol';
    valido = false;
  }

  return valido;
};

const guardar = () => {
  if (!validar()) return;
  cargando.value = true;
  emit('guardar', { ...form.value, id: props.usuario?.id });
  cargando.value = false;
};

const cerrar = () => emit('cerrar');
</script>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: var(--bg-tarjeta); border-radius: 12px; width: 450px; max-width: 90%; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.2rem 1.5rem; border-bottom: 1px solid var(--borde-suave); }
.modal-header h3 { color: var(--texto-principal); }
.btn-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--texto-secundario); }
.modal-body { padding: 1.5rem; }
.form-group { margin-bottom: 1.2rem; }
.form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--texto-principal); }
.form-group input, .form-group select { width: 100%; padding: 0.7rem; border: 1px solid var(--borde); border-radius: 6px; font-size: 0.95rem; background: var(--input-bg); color: var(--input-texto); }
.form-group input:focus, .form-group select:focus { outline: none; border-color: #3498db; }
.input-error { border-color: #e74c3c !important; }
.error-text { color: #e74c3c; font-size: 0.8rem; margin-top: 0.3rem; display: block; }
.toggle-container { display: flex; align-items: center; gap: 1rem; }
.toggle { position: relative; display: inline-block; width: 50px; height: 26px; }
.toggle input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #ccc; border-radius: 26px; transition: 0.3s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.3s; }
.toggle input:checked + .slider { background: #27ae60; }
.toggle input:checked + .slider:before { transform: translateX(24px); }
.estado-activo { color: #27ae60; font-weight: 600; font-size: 0.9rem; }
.estado-inactivo { color: #e74c3c; font-weight: 600; font-size: 0.9rem; }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.8rem; padding: 1.2rem 1.5rem; border-top: 1px solid var(--borde-suave); }
.btn-cancel { background: var(--borde-suave); color: var(--texto-principal); border: none; padding: 0.7rem 1.5rem; border-radius: 6px; cursor: pointer; }
.btn-save { background: #27ae60; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 6px; cursor: pointer; }
.btn-save:disabled { background: #95a5a6; cursor: not-allowed; }
</style>