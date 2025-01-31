<template>
  <v-container class="admin">
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
      >{{ message }}</v-snackbar
    >
    <v-btn @click="openForm" class="text-none" color="teal" dark
      >Add Teacher</v-btn
    >
    <v-dialog v-model="form" width="500" persistent>
      <v-card>
        <v-toolbar color="teal" dark dense flat>
          <v-btn :loading="loading" @click="saveForm" plain class="text-none">
            <v-icon large>mdi-floppy</v-icon>
          </v-btn>
          <v-btn @click="closeForm" plain class="text-none">
            <v-icon large>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-sm-12">
          <v-text-field
            outlined
            v-model="teacher.name"
            label="Name *"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.idN"
            label="Id"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.department"
            label="Department"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.subject"
            label="Subject"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.username"
            label="Username *"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.password"
            label="Password *"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";

export default {
  data: () => ({
    form: false,
    teacher: {
      name: "",
      idN: "",
      department: "",
      subject: "",
      username: "",
      password: "",
      role: "teacher",
    },
    snackbar: true,
    message: "",
    loading: false,
  }),

  methods: {
    ...mapActions("dataModule", ["registeration"]),
    openForm() {
      this.form = true;
    },
    closeForm() {
      this.form = false;
    },
    async saveForm() {
      if (
        !this.teacher.name ||
        !this.teacher.username ||
        !this.teacher.password
      ) {
        this.message = "Please provide necessary details.";
        this.snackbar = true;
        return;
      }
      this.loading = true;
      const resp = await this.registeration(this.teacher);
      if (resp) {
        this.message = resp;
        this.snackbar = true;
      } else {
        this.message = "Registered successfully !!";
        this.snackbar = true;
        this.clearForm();
      }
      this.loading = false;
    },
    clearForm() {
      this.teacher = {
        name: "",
        idN: "",
        department: "",
        subject: "",
        username: "",
        password: "",
      };
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  justify-content: flex-end;
  padding-right: 0px;
}
</style>