<template>
  <v-container class="pt-0">
    <v-data-table
      :headers="header"
      :items="[]"
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
      { text: "Booked Appointment", value: "booked", sortable: false },
      { text: "Schedule Appointment", value: "actions", sortable: false },
    ],
    search: "",
  }),

  async created() {
    await this.getAppointments();
    await this.fetchStudentData();
  },

  methods: {
    ...mapActions({
      fetchStudentData: "appointmentModule/fetchStudentData",
      getAppointments: "appointmentModule/getAppointments"
    }),

    bookingAppointment(data) {
      this.$refs.booking.openForm(data.id);
    },
  },

  computed: {
    ...mapState({
      appoimtments: (state) => state.appointmentModule.appointments,
      studentTable: (state) => state.appointmentModule.studentTable
    }),
  },

  watch: {
    studentTable(val) {
      console.log(this.appoimtments)
      console.log(this.studentTable)
    }
  }
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