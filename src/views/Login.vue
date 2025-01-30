<template>
  <v-card
    max-width="425"
    height="100%"
    class="mx-auto pa-5 pa-sm-15"
    elevation="3"
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
      <v-btn class="px-6" @click="submit"> Login </v-btn>
      <v-btn @click="goToRegister" class="px-3" color="teal" dark>
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    username: "",
    password: "",
    valid: false,
    nameRules: [(v) => !!v || "Name is required"],
    passRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    submit() {
      this.$refs.form.validate();
    },
    goToRegister() {
      this.$router.push("/registration");
    },
  },
};
</script>
<style lang="scss" scoped>
.v-icon {
  bottom: 3px;
}
</style>