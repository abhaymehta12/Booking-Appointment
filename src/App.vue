<template>
  <v-app>
    <Header />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header.vue";
import { mapActions } from "vuex";

export default {
  name: "App",

  components: {
    Header,
  },

  created() {
    const data = localStorage.getItem("loggedIn");
    if (data) {
      this.getUserDetails(data); 
    }
  },

  methods: {
    ...mapActions("dataModule", ["getUserDetails"]),
  },
};
</script>
