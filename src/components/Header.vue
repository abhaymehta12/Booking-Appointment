<template>
  <v-app-bar :elevation="2" app color="indigo" dark>
    <div class="mx-auto text-h5 font-weight-medium">Appointment Schedule</div>
    <v-menu v-if="user" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar color="teal" v-bind="attrs" v-on="on">
          <v-icon dark>mdi-account-circle</v-icon>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title style="font-weight:500;">{{ user.name }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item @click="signout">
          <v-list-item-title style="font-weight:500;">Log Out</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  methods: {
    ...mapActions("dataModule", ["logout"]),
    async signout() {
      await this.logout();
      this.$router.push("/login");
    },
  },
  computed: {
    ...mapState("dataModule", { user: (state) => state.user }),
  },
};
</script>