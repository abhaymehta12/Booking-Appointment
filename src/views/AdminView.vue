<template>
  <v-container class="admin">
    <v-btn @click="openForm" class="text-none" color="teal" dark
      >Add Teacher</v-btn
    >
    <v-dialog v-model="form" width="500" persistent>
      <v-card>
        <v-toolbar color="teal" dark dense flat>
          <v-btn @click="saveForm" plain class="text-none">
            <v-icon large>mdi-floppy</v-icon>
          </v-btn>
          <v-btn @click="closeForm" plain class="text-none">
            <v-icon large>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="px-5">
          <v-text-field
            outlined
            v-model="teacher.name"
            label="Name *"
            hide-details="auto"
            class="mt-3"
          ></v-text-field>
          <v-text-field
            outlined
            v-model="teacher.id"
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
export default {
  data: () => ({
    form: false,
    teacher: {
      name: "",
      id:"",
      department: "",
      subject: "",
      username: "",
      password: "",
    },
  }),

  methods: {
    openForm() {
      this.form = true;
    },
    closeForm() {
      this.form = false;
    },
    saveForm() {
      this.closeForm();
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