<template>
  <v-dialog v-model="form" width="500" persistent>
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
      timeout="1000"
      >{{ errormessage }}</v-snackbar
    >
    <v-card>
      <v-toolbar color="teal" dark dense flat>
        <v-btn
          :disabled="loading"
          @click="bookAppointment"
          plain
          class="text-none"
          title="Add Appointment"
        >
          <v-icon large>mdi-floppy</v-icon>
        </v-btn>
        <v-btn title="Close" @click="closeForm" plain class="text-none">
          <v-icon large>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="px-sm-12">
        <v-text-field
          outlined
          label="Title *"
          v-model="app_details.title"
          hide-details="auto"
          class="mt-5"
          :style="{ fontSize: '28px' }"
        ></v-text-field>
        <v-text-field
          v-if="user && user.role === 'student'"
          outlined
          label="Message"
          v-model="message"
          hide-details="auto"
          class="mt-5"
          :style="{ fontSize: '28px' }"
        ></v-text-field>
        <v-menu
          v-if="user && user.role === 'student'"
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="date"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Select Date"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              hide-details="auto"
              class="mt-5"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            :min="new Date().toISOString().slice(0, 10)"
            no-title
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(date)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <div class="d-flex justify-space-between">
          <input
            class="timeInput"
            v-model="app_details.startTime"
            type="time"
            title="Start Time"
          />
          <input class="timeInput" v-model="app_details.endTime" type="time" title="End Time" />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  props: {
    user: Object,
  },
  data: () => ({
    form: false,
    menu: false,
    date: "",
    message: "",
    app_details: {
      title: "",
      startTime: null,
      endTime: null,
    },
    bookingdetail: "",
    loading: false,
    snackbar: false,
    errormessage: "",
  }),

  created() {
    this.getAllAppointments();
  },

  methods: {
    ...mapActions({
      scheduleAppointment: "appointmentModule/scheduleAppointment",
      getAllAppointments: "appointmentModule/getAllAppointments",
    }),

    openForm(data) {
      if (data.date) {
        this.bookingdetail = data.date;
      } else {
        this.bookingdetail = data;
      }
      this.form = true;
    },
    closeForm() {
      this.clearForm();
      this.form = false;
    },
    async bookAppointment() {
      if (
        !this.app_details.title ||
        !this.app_details.startTime ||
        !this.app_details.endTime
      ) {
        this.snackbar = true;
        this.errormessage = "Please provide all details !!";
        return;
      }
      let index;
      if (this.user && this.user.role === "student") {
        index = this.allappointments.findIndex(
          (ele) =>
            ele.date === this.date &&
            ((this.user.id === ele.scheduledBy &&
              ele.scheduledWith === this.bookingdetail) ||
              ele.scheduledWith === "all")
        );
      } else {
        index = this.allappointments.findIndex(
          (ele) =>
            ele.date === this.bookingdetail &&
            (this.user.id === ele.scheduledBy ||
              ele.scheduledWith === this.user.id)
        );
      }
      if (index >= 0) {
        this.snackbar = true;
        this.errormessage = "Please select a diffferent date. !!";
        return;
      }
      this.loading = true;
      let obj = this.app_details;
      obj.scheduledBy = this.user.id;
      if (this.user && this.user.role === "student") {
        obj.message = this.message;
        obj.color = "#ed910aed";
        obj.scheduledWith = this.bookingdetail;
        obj.date = this.date;
      } else {
        obj.color = "#37a543";
        obj.date = this.bookingdetail;
        obj.scheduledWith = "all";
      }
      await this.scheduleAppointment(obj);
      this.snackbar = true;
      this.errormessage = "Appointment scheduled !!";
      this.closeForm();
    },
    clearForm() {
      this.app_details = {
        title: "",
        startTime: null,
        endTime: null,
      };
      this.date = "";
      this.bookingdetail = "";
      this.message = "";
      this.loading = false;
    },
  },

  computed: {
    ...mapState({
      allappointments: (state) => state.appointmentModule.allappointments,
    }),
  },
};
</script>
<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  justify-content: space-between;
  padding-right: 0px;
}
.timeInput {
  font-size: 28px;
  width: 48%;
  height: 56px;
  padding: 12px 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline: none;
  margin-top: 25px;
}
.timeInput:hover {
  border-color: black;
}
.timeInput:focus {
  border-color: #1976d2; /* Vuetify primary color */
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.3);
}
</style>