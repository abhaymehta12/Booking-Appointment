<template>
  <v-container class="admin">
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
      timeout="700"
      >{{ message }}</v-snackbar
    >
    <v-btn @click="openForm" class="text-none" color="teal" dark
      >Add Teacher</v-btn
    >

    <v-data-table
      :items-per-page="5"
      :loading="tableLoader"
      :headers="headerT"
      :items="teachers"
      class="mt-3"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="editTeacher(item)"> mdi-pencil </v-icon>
        <v-icon class="ml-8" @click="deleteTeacher(item.id)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>

    <v-data-table
      :items-per-page="5"
      :loading="tableLoader"
      :headers="headerS"
      :items="students"
      class="mt-3"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon @click="acceptRegister(item)"> mdi-account-check </v-icon>
      </template>
    </v-data-table>

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
            v-model="teacher.contact"
            label="Contact"
            hide-details="auto"
            type="number"
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
import { mapActions, mapState } from "vuex";

export default {
  created() {
    this.fetchStudents();
    this.fetchTeachers();
  },

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
      contact: null,
    },
    snackbar: false,
    message: "",
    loading: false,
    tableLoader: false,
    headerS: [
      { text: "Roll No", value: "rollN" },
      { text: "Name", value: "name" },
      { text: "Father's Name", value: "father" },
      { text: "Contact", value: "number", sortable: false },
      { text: "Actions", value: "actions" },
    ],
    headerT: [
      { text: "Id", value: "idN" },
      { text: "Name", value: "name" },
      { text: "department", value: "department" },
      { text: "Actions", value: "actions" },
    ],
  }),

  methods: {
    ...mapActions({
      registration: "dataModule/registration",
      fetchStudents: "appointmentModule/getNRStudents",
      acceptStudent: "appointmentModule/acceptRegistration",
      fetchTeachers: "appointmentModule/getTeachers",
    }),
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
      const resp = await this.registration(this.teacher);
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
        contact: null,
      };
    },
    async acceptRegister(data) {
      this.tableLoader = true;
      let obj = {
        id: data.id,
        val: true,
      };
      await this.acceptStudent(obj);
      this.message = "Registration Accepted !!";
      this.snackbar = true;
      this.tableLoader = false;
    },

    async editTeacher(item) {
      console.log(item);
    },

    async deleteTeacher(id) {
      console.log(id);
    },
  },
  computed: {
    ...mapState({
      students: (state) => state.appointmentModule.nonregistered_student,
      teachers: (state) => state.appointmentModule.teachers,
    }),
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  justify-content: flex-end;
  padding-right: 0px;
}

::v-deep .v-data-table__wrapper {
  max-height: 288px;
  overflow: auto;
  scrollbar-width: thin;
}

::v-deep .v-data-table-header {
  background: #3f51b5;
  span {
    color: white;
    font-size: medium;
  }
}

::v-deep .v-data-footer__select {
  display: none;
}

::v-deep .v-data-footer {
  justify-content: end;
}
</style>