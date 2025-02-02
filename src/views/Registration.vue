<template>
  <v-card
    max-width="425"
    height="100%"
    class="mx-auto pa-5 pa-sm-10"
    elevation="3"
  >
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
      timeout="700"
      >{{ message }}</v-snackbar
    >
    <v-tabs v-model="tab">
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        color="primary accent-4"
      ></v-progress-linear>
      <v-tab>Form</v-tab>
      <v-tab>Sign Up</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <v-text-field
          outlined
          v-model="details.name"
          label="Full Name"
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
          label="Contact"
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
        <v-select
          :items="items"
          v-model="details.gender"
          label="Gender"
          class="mt-3"
          outlined
          hide-details="auto"
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
          hide-details="auto"
          class="mt-3"
        ></v-text-field>
      </v-tab-item>
    </v-tabs-items>
    <v-card-actions class="justify-space-between mt-8">
      <v-btn
        :disabled="loading"
        @click="goToSignIn"
        class="px-3"
        color="teal"
        dark
      >
        SignIn
      </v-btn>
      <v-btn v-if="tab" :disabled="loading" class="px-3" @click="submit">
        Submit
      </v-btn>
    </v-card-actions>
    <v-card-subtitle class="mt-10" v-if="tab">
      Rules for password:
      <ul>
        <li>Enter atleast 6 characters.</li>
        <li>Should contain a special character.</li>
      </ul>
    </v-card-subtitle>
  </v-card>
</template>
<script>
import { mapActions } from "vuex";

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
      registered: false
    },
    tab: null,
    items: ["female", "male"],
    snackbar: false,
    message: "",
    loading: false,
  }),

  methods: {
    ...mapActions("dataModule", ["registration"]),
    async submit() {
      this.loading = true;
      if (this.validation()) {
        const resp = await this.registration(this.details);
        if (resp) {
          this.message = resp;
          this.snackbar = true;
        } else {
          this.message = "Registered successfully !!";
          this.snackbar = true;
          this.clearForm();
          this.goToSignIn();
        }
      }
      this.loading = false;
    },
    goToSignIn() {
      this.$router.push("/login");
    },
    validation() {
      const character = /[!@#$%^&*(),.?":{}|<>~\-_+\[\]\\`]/;
      if (
        !this.details.name ||
        !this.details.rollN ||
        !this.details.father ||
        !this.details.number ||
        !this.details.gender ||
        !this.details.username ||
        !this.details.password
      ) {
        this.message = "Please provide all details.";
        this.snackbar = true;
      } else if (
        this.details.password.length < 6 ||
        !character.test(this.details.password)
      ) {
        this.message = "Please provide valid password.";
        this.snackbar = true;
      } else {
        return true;
      }
      return false;
    },
    clearForm() {
      this.details = {
        name: "",
        rollN: "",
        father: "",
        number: "",
        gender: "",
        username: "",
        password: "",
      };
    },
  },
};
</script>