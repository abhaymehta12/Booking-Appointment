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
    <div class="topRow">
      <v-btn @click="openForm" class="text-none" color="teal" dark
        >Add Teacher</v-btn
      >
      <input v-model="search" class="searchBox" />
    </div>
    <v-data-table
      :loading="tableLoader"
      :headers="header"
      :items="data"
      :search="search"
      group-by="role"
      class="mt-3"
      :hide-default-footer="true"
    >
      <template v-slot:[`group.header`]="{ group, headers, toggle, isOpen }">
        <td :colspan="headers.length">
          <v-btn @click="toggle" x-small icon :ref="group">
            <v-icon v-if="isOpen">mdi-minus</v-icon>
            <v-icon v-else>mdi-plus</v-icon>
          </v-btn>
          <span class="mx-5 font-weight-bold text-capitalize">{{ group }}</span>
        </td>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon v-if="item.role === 'teacher'" @click="editTeacher(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="item.role === 'teacher'"
          class="ml-8"
          @click="deleteTeacher(item.id)"
        >
          mdi-trash-can-outline
        </v-icon>
        <v-icon v-else @click="acceptRegister(item)">
          mdi-account-check
        </v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="form" width="500" persistent>
      <v-card>
        <v-toolbar color="teal" dark dense flat>
          <v-btn :loading="loading" @click="saveForm" plain class="text-none">
            <v-icon large>mdi-floppy</v-icon>
          </v-btn>
          <v-btn @click="clearForm" plain class="text-none">
            <v-icon large>mdi-refresh</v-icon>
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
            v-model="teacher.rollN"
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
  data: () => ({
    form: false,
    teacher: {
      name: "",
      rollN: "",
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
    header: [
      { text: "Roll No", value: "rollN" },
      { text: "Name", value: "name" },
      { text: "Contact", value: "contact", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editFlag: false,
    search: "",
  }),

  created() {
    this.fetchStudents();
    this.fetchTeachers();
  },

  methods: {
    ...mapActions({
      registration: "dataModule/registration",
      fetchStudents: "dataModule/getNRStudents",
      acceptStudent: "dataModule/acceptRegistration",
      fetchTeachers: "dataModule/getTeachers",
      deleteUser: "dataModule/deleteUser",
      updateTeacher: "dataModule/updateTeacher",
    }),

    openForm() {
      this.form = true;
    },
    closeForm() {
      this.fetchStudents();
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
      let resp;
      if (this.editFlag) {
        resp = await this.updateTeacher(this.teacher);
      } else {
        resp = await this.registration(this.teacher);
      }
      if (resp) {
        this.message = resp;
        this.snackbar = true;
        this.loading = false;
        return;
      }
      if (this.editFlag) {
        this.message = "Updated successfully !!";
      } else {
        this.message = "Registered successfully !!";
      }
      this.fetchTeachers();
      this.clearForm();
      this.snackbar = true;
      this.loading = false;
    },
    clearForm() {
      this.teacher = {
        name: "",
        rollN: "",
        department: "",
        subject: "",
        username: "",
        password: "",
        role: "teacher",
        contact: null,
      };
      this.search = "";
      this.editFlag = false;
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
      this.teacher = item;
      this.editFlag = true;
      this.openForm();
    },

    async deleteTeacher(id) {
      this.tableLoader = true;
      await this.deleteUser(id);
      this.message = "User Deleted !!";
      this.snackbar = true;
      this.tableLoader = false;
    },
  },
  computed: {
    ...mapState({
      students: (state) => state.dataModule.nonregistered_student,
      teachers: (state) => state.dataModule.teachers,
    }),

    data() {
      return this.students.concat(this.teachers);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  justify-content: flex-end;
  padding-right: 0px;
}
::v-deep .v-data-table__wrapper {
  max-height: 500px;
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
::v-deep .v-data-table-header__icon {
  opacity: 1;
  margin-left: 5px;
  color: white !important;
}
.topRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.searchBox {
  height: 36px;
  outline: auto;
  text-indent: 10px;
}
</style>