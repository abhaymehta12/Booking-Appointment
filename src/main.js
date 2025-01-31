import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firebase from 'firebase/compat/app';

Vue.config.productionTip = false

//Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQJ1AxI7KglHFFMn-Hx09_mO7FxnGH8hM",
  authDomain: "booking-appointment-a2a89.firebaseapp.com",
  projectId: "booking-appointment-a2a89",
  storageBucket: "booking-appointment-a2a89.firebasestorage.app",
  messagingSenderId: "873979012989",
  appId: "1:873979012989:web:2b90a2b179ad465bb3ce14",
  measurementId: "G-KHWGHE024T"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
