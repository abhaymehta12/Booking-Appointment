import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Registration from '../views/Registration.vue'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/adminpage',
    name: 'admin',
    component: AdminView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem("loggedUser");
  const isAuthenticated = localStorage.getItem("loggedIn");

  // If the user is not authenticated and trying to access a restricted route
  if (!isAuthenticated && (to.name === 'home' || to.name === 'admin')) {
    return next('/login'); // Redirect to login if not authenticated
  }

  // If the user is authenticated
  if (isAuthenticated) {
    if (user && to.name !== 'admin') {
      return next('/adminpage'); // Redirect to admin if not going to admin
    } else if (!user && to.name !== 'home') {
      return next('/home'); // Redirect to home if not going to home
    }
  }

  // If no redirects are needed, proceed with navigation
  next();
});

