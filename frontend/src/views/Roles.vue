vue
<template>
  <div class="roles">
    <div class="header">
      <h1>Gestión de Roles</h1>
      <button @click="abrirCrear" class="btn-add">+ Nuevo Rol</button>
    </div>
    <div class="roles-grid">
      <div v-for="r in roles" :key="r.id" class="role-card">
        <h3>{{ r.nombre }}</h3>
        <p>{{ r.descripcion }}</p>
        <div class="permisos">
          <span v-for="p in r.permisos" :key="p" class="permiso">{{ p }}</span>
        </div>
        <div class="role-actions">
          <button @click="abrirEditar(r)" class="btn-edit">✏️ Editar</button>
          <button @click="eliminar(r.id)" class="btn-del">🗑️ Eliminar</button>
        </div>
      </div>
    </div>
    <RoleModal v-if="showModal" :rol="rolSeleccionado" @guardar="handleGuardar" @cerrar="cerrarModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import RoleModal from '../components/RoleModal.vue';
import { useToast } from '../composables/useToast';

const toast = useToast();
const roles = ref([]);
const showModal = ref(false);
const rolSeleccionado = ref(null);

const cargarRoles = async () => {
  const { data } = await api.get('/roles');
  roles.value = data;
};
const abrirCrear = () => { rolSeleccionado.value = null; showModal.value = true; };
const abrirEditar = (rol) => { rolSeleccionado.value = rol; showModal.value = true; };
const cerrarModal = () => { showModal.value = false; rolSeleccionado.value = null; };
const handleGuardar = async (datos) => {
  try {
    if (datos.id) {
      await api.put(`/roles/${datos.id}`, datos);
      toast.success('Rol actualizado');
    } else {
      await api.post('/roles', datos);
      toast.success('Rol creado');
    }
    cerrarModal();
    cargarRoles();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al guardar');
  }
};
const eliminar = async (id) => {
  if (confirm('¿Eliminar este rol?')) {
    try {
      await api.delete(`/roles/${id}`);
      toast.success('Rol eliminado');
      cargarRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar');
    }
  }
};
onMounted(cargarRoles);
</script>

<style scoped>
.roles { padding: 2rem; }
.roles h1 { color: var(--texto-principal); }
.header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
.roles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
.role-card {
  background: var(--bg-tarjeta);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px var(--sombra);
  transition: background 0.3s;
}
.role-card h3 { color: var(--texto-principal); text-transform: capitalize; }
.role-card p { color: var(--texto-secundario); margin: 0.5rem 0; }
.permisos { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }
.permiso {
  background: var(--borde-suave);
  color: var(--texto-principal);
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
}
.role-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.btn-add { background: #27ae60; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 5px; cursor: pointer; }
.btn-edit { background: #f39c12; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; flex: 1; }
.btn-del { background: #e74c3c; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; flex: 1; }
</style>