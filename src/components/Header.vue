<template>
  <v-app-bar :elevation="2" app color="indigo" dark>
    <div class="mx-auto text-h5 font-weight-medium">Appointment Schedule</div>
    <v-btn v-if="user" @click="signout" class="text-none px-3 px-sm-4" color="teal" dark>Log Out</v-btn>
  </v-app-bar>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  data: () => ({
    //
  }),
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