<template>
  <v-card
    max-width="425"
    height="100%"
    class="mx-auto pa-5 pa-sm-15"
    elevation="3"
  >
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
    >
      {{message}}</v-snackbar
    >
    <v-form ref="form" class="mt-5">
      <v-text-field
        outlined
        v-model="username"
        :rules="nameRules"
        label="Username"
        prepend-inner-icon="mdi-account"
        required
      ></v-text-field>
      <v-text-field
        outlined
        v-model="password"
        :rules="passRules"
        label="Password"
        prepend-inner-icon="mdi-lock"
        type="password"
        required
      ></v-text-field>
    </v-form>
    <v-card-actions class="justify-space-between mt-8">
      <v-btn
        :disabled="loading"
        @click="goToRegister"
        class="px-3"
        color="teal"
        :dark="!loading"
      >
        Register
      </v-btn>
      <v-btn :loading="loading" class="px-6" @click="submit"> Login </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  data: () => ({
    username: "",
    password: "",
    valid: false,
    nameRules: [(v) => !!v || "Name is required"],
    passRules: [(v) => !!v || "Password is required"],
    snackbar: false,
    message: "",
    loading: false,
  }),

  methods: {
    ...mapActions("dataModule", ["login"]),
    async submit() {
      const valid = this.$refs.form.validate();
      this.loading = true;
      if (valid) {
        let obj = {
          username: this.username,
          password: this.password,
        };
        const resp = await this.login(obj);
        if (!resp) {
          this.message = "Please provide valid details."
          this.snackbar = true;
        } else if (this.user && this.user.role === "admin") {
          this.$router.push("/adminpage");
        } else if (this.user){
          this.$router.push("/home");
        } else {
          this.message = resp
          this.snackbar = true
        }
      }
      this.loading = false;
    },
    goToRegister() {
      this.$router.push("/registration");
    },
  },
  computed: {
    ...mapState("dataModule", { user: (state) => state.user }),
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-icon {
  bottom: 3px;
}
</style>