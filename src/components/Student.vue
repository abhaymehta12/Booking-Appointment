<template>
  <v-container class="pt-0" fluid>
    <v-data-table
      :headers="header"
      :items="studentTable"
      :search="search"
      :hide-default-footer="true"
    >
      <template v-slot:top>
        <v-text-field
          class="searchBox mb-3"
          dense
          outlined
          v-model="search"
          label="Search"
          hide-details="auto"
        ></v-text-field>
      </template>
      <template v-slot:[`item.teacherappointment`]="{ item }">
        <span v-for="(el, index) in item.multipleapp" :key="index">
          <div>{{ el.title }}</div>
          <div>{{ el.date }}</div>
        </span>
      </template>
      <template v-slot:[`item.myappointment`]="{ item }">
        <span>
          <div>{{ item.title }}</div>
          <div>{{ item.singleapp }}</div>
        </span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon v-if="item" @click="bookingAppointment(item)" class="mr-8">
          mdi-calendar-clock
        </v-icon>
      </template>
    </v-data-table>

    <BookAppointment ref="booking" :user="user" />
  </v-container>
</template>
<script>
import { mapActions, mapState } from "vuex";
import BookAppointment from "../components/Book-appointment.vue";

export default {
  props: {
    user: Object,
  },
  components: {
    BookAppointment,
  },
  data: () => ({
    header: [
      { text: "Name", value: "name" },
      { text: "Subject", value: "subject" },
      {
        text: "Teacher’s Appointments",
        value: "teacherappointment",
        sortable: false,
      },
      { text: "My Appointments", value: "myappointment", sortable: false },
      { text: "Schedule Appointment", value: "actions", sortable: false },
    ],
    search: "",
  }),

  async created() {
    await this.fetchStudentData();
  },

  methods: {
    ...mapActions({
      fetchStudentData: "appointmentModule/fetchStudentData",
    }),

    bookingAppointment(data) {
      this.$refs.booking.openForm(data.id);
    },
  },

  computed: {
    ...mapState({
      studentTable: (state) => state.appointmentModule.studentTable,
    }),
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-data-table-header {
  background: #d39f26fc;
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
::v-deep .v-data-table__wrapper {
  max-height: 488px;
  overflow: auto;
  scrollbar-width: thin;
}
.searchBox {
  max-width: 300px;
}
</style>