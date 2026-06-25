vue
<template>
  <div class="users">
    <div class="header">
      <h1>Gestión de Usuarios</h1>
      <button v-if="auth.tienePermiso('crear')" @click="abrirCrear" class="btn-add">+ Nuevo Usuario</button>
    </div>

    <!-- BÚSQUEDA -->
    <div class="search-bar">
      <input
        v-model="busqueda"
        @input="buscar"
        type="text"
        placeholder="🔍 Buscar por nombre o email..."
      />
    </div>

    <table>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.nombre }}</td>
          <td>{{ u.email }}</td>
          <td><span class="badge">{{ u.rol_nombre }}</span></td>
          <td>
            <span :class="u.activo ? 'estado-activo' : 'estado-inactivo'">
              {{ u.activo ? '🟢 Activo' : '🔴 Inactivo' }}
            </span>
          </td>
          <td class="acciones">
            <button v-if="auth.tienePermiso('actualizar')" @click="abrirEditar(u)" class="btn-edit">✏️ Editar</button>
            <button v-if="auth.tienePermiso('eliminar')" @click="eliminar(u.id)" class="btn-del">🗑️</button>
          </td>
        </tr>
        <tr v-if="usuarios.length === 0">
          <td colspan="6" class="sin-datos">No se encontraron usuarios</td>
        </tr>
      </tbody>
    </table>

    <!-- PAGINACIÓN -->
    <Pagination
      :paginaActual="paginacion.page"
      :totalPaginas="paginacion.totalPaginas"
      @cambiar="cambiarPagina"
    />

    <!-- MODAL (crear/editar) -->
    <UserModal
      v-if="showModal"
      :usuario="usuarioSeleccionado"
      :roles="roles"
      @guardar="handleGuardar"
      @cerrar="cerrarModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../store/auth';
import { useToast } from '../composables/useToast';
import Pagination from '../components/Pagination.vue';
import UserModal from '../components/UserModal.vue';

const auth = useAuthStore();
const toast = useToast();
const usuarios = ref([]);
const roles = ref([]);
const showModal = ref(false);
const usuarioSeleccionado = ref(null);
const busqueda = ref('');
const paginacion = ref({ page: 1, limit: 5, totalPaginas: 1, total: 0 });

let timeoutBusqueda = null;

const cargarUsuarios = async () => {
  const { data } = await api.get('/users', {
    params: {
      page: paginacion.value.page,
      limit: paginacion.value.limit,
      search: busqueda.value
    }
  });
  usuarios.value = data.usuarios;
  paginacion.value = { ...paginacion.value, ...data.paginacion };
};

const buscar = () => {
  clearTimeout(timeoutBusqueda);
  timeoutBusqueda = setTimeout(() => {
    paginacion.value.page = 1;
    cargarUsuarios();
  }, 400);
};

const cambiarPagina = (pagina) => {
  paginacion.value.page = pagina;
  cargarUsuarios();
};

const cargarRoles = async () => {
  const { data } = await api.get('/roles');
  roles.value = data;
};

// Abrir modal CREAR
const abrirCrear = () => {
  usuarioSeleccionado.value = null;
  showModal.value = true;
};

// Abrir modal EDITAR ⭐
const abrirEditar = (usuario) => {
  usuarioSeleccionado.value = usuario;
  showModal.value = true;
};

const cerrarModal = () => {
  showModal.value = false;
  usuarioSeleccionado.value = null;
};

// Guardar (crear o editar)
const handleGuardar = async (datos) => {
  try {
    if (datos.id) {
      // EDITAR (incluye activar/desactivar)
      await api.put(`/users/${datos.id}`, {
        nombre: datos.nombre,
        email: datos.email,
        role_id: datos.role_id,
        activo: datos.activo
      });
      toast.success('Usuario actualizado correctamente');
    } else {
      // CREAR
      await api.post('/users', {
        nombre: datos.nombre,
        email: datos.email,
        password: datos.password,
        role_id: datos.role_id
      });
      toast.success('Usuario creado correctamente');
    }
    cerrarModal();
    cargarUsuarios();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Error al guardar');
  }
};

const eliminar = async (id) => {
  if (confirm('¿Eliminar este usuario?')) {
    try {
      await api.delete(`/users/${id}`);
      toast.success('Usuario eliminado');
      cargarUsuarios();
    } catch (err) {
      toast.error('Error al eliminar');
    }
  }
};

onMounted(() => { cargarUsuarios(); cargarRoles(); });
</script>

<style scoped>
.users { padding: 2rem; }
.users h1 { color: var(--texto-principal); }
.header { display: flex; justify-content: space-between; margin-bottom: 1.5rem; }
.search-bar { margin-bottom: 1.5rem; }
.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 0.7rem 1rem;
  border: 1px solid var(--borde);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-bg);
  color: var(--input-texto);
}
table {
  width: 100%;
  background: var(--bg-tarjeta);
  border-collapse: collapse;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px var(--sombra);
}
th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--borde-suave);
  color: var(--texto-principal);
}
th { background: var(--bg-tabla-header); color: white; }
tbody tr:hover { background: var(--hover-fila); }
.sin-datos { text-align: center; color: var(--texto-secundario); padding: 2rem; }
.badge { background: #3498db; color: white; padding: 0.3rem 0.7rem; border-radius: 15px; font-size: 0.85rem; }
.estado-activo { color: #27ae60; font-weight: 600; }
.estado-inactivo { color: #e74c3c; font-weight: 600; }
.acciones { display: flex; gap: 0.5rem; }
.btn-add { background: #27ae60; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 5px; cursor: pointer; }
.btn-edit { background: #f39c12; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; }
.btn-del { background: #e74c3c; color: white; border: none; padding: 0.5rem 0.8rem; border-radius: 5px; cursor: pointer; }
</style>