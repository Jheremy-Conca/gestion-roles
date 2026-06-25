vue
<template>
  <div class="modal-overlay" @click.self="cerrar">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ esEdicion ? '✏️ Editar Rol' : '➕ Nuevo Rol' }}</h3>
        <button class="btn-close" @click="cerrar">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Nombre del Rol</label>
          <input v-model="form.nombre" type="text" placeholder="Ej: supervisor" />
          <span v-if="errores.nombre" class="error-text">{{ errores.nombre }}</span>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <input v-model="form.descripcion" type="text" placeholder="Descripción del rol" />
        </div>
        <div class="form-group">
          <label>Permisos</label>
          <div class="permisos-grid">
            <label v-for="p in permisosDisponibles" :key="p.valor" class="permiso-item" :class="{ activo: form.permisos.includes(p.valor) }">
              <input type="checkbox" :value="p.valor" v-model="form.permisos" />
              <span>{{ p.icono }} {{ p.label }}</span>
            </label>
          </div>
          <span v-if="errores.permisos" class="error-text">{{ errores.permisos }}</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="cerrar">Cancelar</button>
        <button class="btn-save" @click="guardar">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
const props = defineProps({ rol: { type: Object, default: null } });
const emit = defineEmits(['guardar', 'cerrar']);
const permisosDisponibles = [
  { valor: 'crear', label: 'Crear', icono: '➕' },
  { valor: 'leer', label: 'Leer', icono: '👁️' },
  { valor: 'actualizar', label: 'Actualizar', icono: '✏️' },
  { valor: 'eliminar', label: 'Eliminar', icono: '🗑️' },
  { valor: 'gestionar_roles', label: 'Gestionar Roles', icono: '🔐' }
];
const errores = ref({});
const form = ref({ nombre: '', descripcion: '', permisos: [] });
const esEdicion = computed(() => props.rol !== null);
watch(() => props.rol, (nuevoRol) => {
  if (nuevoRol) {
    form.value = { nombre: nuevoRol.nombre, descripcion: nuevoRol.descripcion || '', permisos: [...(nuevoRol.permisos || [])] };
  } else {
    form.value = { nombre: '', descripcion: '', permisos: [] };
  }
}, { immediate: true });
const validar = () => {
  errores.value = {};
  let valido = true;
  if (!form.value.nombre.trim()) { errores.value.nombre = 'El nombre es obligatorio'; valido = false; }
  if (form.value.permisos.length === 0) { errores.value.permisos = 'Selecciona al menos un permiso'; valido = false; }
  return valido;
};
const guardar = () => {
  if (!validar()) return;
  emit('guardar', { ...form.value, id: props.rol?.id });
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
.form-group input[type="text"] { width: 100%; padding: 0.7rem; border: 1px solid var(--borde); border-radius: 6px; background: var(--input-bg); color: var(--input-texto); }
.error-text { color: #e74c3c; font-size: 0.8rem; margin-top: 0.3rem; display: block; }
.permisos-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.7rem; }
.permiso-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem; border: 2px solid var(--borde); border-radius: 8px; cursor: pointer; font-weight: normal; color: var(--texto-principal); }
.permiso-item.activo { border-color: #27ae60; background: rgba(39, 174, 96, 0.1); }
.modal-footer { display: flex; justify-content: flex-end; gap: 0.8rem; padding: 1.2rem 1.5rem; border-top: 1px solid var(--borde-suave); }
.btn-cancel { background: var(--borde-suave); color: var(--texto-principal); border: none; padding: 0.7rem 1.5rem; border-radius: 6px; cursor: pointer; }
.btn-save { background: #27ae60; color: white; border: none; padding: 0.7rem 1.5rem; border-radius: 6px; cursor: pointer; }
</style>