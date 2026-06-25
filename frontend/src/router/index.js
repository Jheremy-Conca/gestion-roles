import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Users from '../views/Users.vue';
import Roles from '../views/Roles.vue';
import ForgotPassword from '../views/ForgotPassword.vue'; // ⭐ NUEVO
import ResetPassword from '../views/ResetPassword.vue';   // ⭐ NUEVO

const routes = [
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },        // ⭐ NUEVO
  { path: '/reset-password/:token', component: ResetPassword },   // ⭐ NUEVO
  { path: '/', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/usuarios', component: Users, meta: { requiresAuth: true } },
  { path: '/roles', component: Roles, meta: { requiresAuth: true, permiso: 'gestionar_roles' } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else if (to.meta.permiso && !auth.tienePermiso(to.meta.permiso)) {
    next('/');
  } else {
    next();
  }
});

export default router;