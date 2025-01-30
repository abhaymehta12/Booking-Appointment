<template>
  <v-card
    max-width="425"
    height="100%"
    class="mx-auto pa-5 pa-sm-10"
    elevation="3"
  >
    <v-snackbar v-model="snackbar" color="red accent-2" top right class="mt-14"
      >Please provide all details.</v-snackbar
    >
    <v-tabs v-model="tab">
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab>Form</v-tab>
      <v-tab>Sign Up</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-text-field
          outlined
          v-model="details.name"
          label="Name"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="details.rollN"
          label="Roll No"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="details.father"
          label="Father's Name"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="details.number"
          label="Mobile"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-select
          :items="items"
          v-model="details.gender"
          label="Gender"
          class="mt-3"
          outlined
        ></v-select>
      </v-tab-item>
      <v-tab-item>
        <v-text-field
          outlined
          v-model="details.username"
          label="Username"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-text-field
          outlined
          v-model="details.password"
          label="Password"
          type="password"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
      </v-tab-item>
    </v-tabs-items>
    <v-card-actions v-if="tab" class="justify-space-between mt-8">
      <v-btn class="px-3" @click="submit"> Submit </v-btn>
      <v-btn @click="goToRegister" class="px-3" color="teal" dark>
        SignIn
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    details: {
      name: "",
      rollN: "",
      father: "",
      number: "",
      gender: "",
      username: "",
      password: "",
    },
    tab: null,
    items: ["female", "male"],
    snackbar: false,
  }),

  methods: {
    submit() {
      if (
        !this.details.name ||
        !this.details.rollN ||
        !this.details.father ||
        !this.details.username ||
        !this.details.password
      ) {
        this.snackbar = true;
      }
      console.log(this.details);
    },
    goToRegister() {
      this.$router.push("/login");
    },
  },
};
</script>
<style>
.v-icon {
  bottom: 3px;
}
</style>