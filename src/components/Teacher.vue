<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      color="red accent-2"
      top
      right
      class="mt-14"
      timeout="700"
      >{{ message }}</v-snackbar
    >

    <div class="d-flex justify-space-between">
      <v-btn
        @click="goToPreviousMonth"
        class="text-none d-none d-sm-flex"
        color="primary"
        >Previous Month</v-btn
      >
      <v-btn
        @click="goToNextMonth"
        class="text-none d-none d-sm-flex"
        color="primary"
        >Next Month</v-btn
      >
      <div class="d-flex d-sm-none justify-space-between">
        <v-icon @click="goToPreviousMonth">mdi-arrow-collapse-left</v-icon>
        <v-icon @click="goToNextMonth">mdi-arrow-collapse-right</v-icon>
      </div>
    </div>

    <v-calendar
      v-model="selectedDate"
      :events="events"
      color="primary"
      class="calender mt-5"
      @input="openForm"
      @click:more="viewEvents"
    >
      <template v-slot:event="{ event }">
        <div class="event-title" @click="viewEvents({ date: event.date })">
          {{ event.title }}
          <div>
            {{ formatEventTime(event.start) }} -
            {{ formatEventTime(event.end) }}
          </div>
        </div>
      </template>
    </v-calendar>

    <div class="d-flex mt-2">
      <span><span class="scheduled px-6 px-sm-10 mr-3"></span>Scheduled</span>
      <span class="ml-10"
        ><span class="pending px-6 px-sm-10 mr-3"></span>Pending</span
      >
    </div>

    <BookAppointment ref="booking" :user="user" />

    <v-dialog v-model="viewAllDialog" max-width="600">
      <v-card>
        <v-card-title
          >All Events for {{ formatDate(selectedDate) }}</v-card-title
        >
        <v-card-text>
          <v-list>
            <v-list-item-group>
              <v-list-item v-for="(event, index) in allDayEvents" :key="index">
                <v-list-item-content>
                  <v-list-item-title
                    class="d-sm-flex justify-space-between align-center"
                  >
                    <div class="d-flex align-center">
                      <span
                        :style="{ backgroundColor: event.color }"
                        class="dot mr-3"
                      ></span>
                      {{ event.title }}
                    </div>
                    <span
                      >{{ formatEventTime(event.start) }} -
                      {{ formatEventTime(event.end) }}</span
                    >
                    <div class="text-right">
                      <v-btn
                        :disabled="loading"
                        v-if="event.color === '#ed910aed'"
                        plain
                        @click="appointmentApprove(event)"
                        title="Accept"
                        ><v-icon>mdi-check-circle-outline</v-icon></v-btn
                      >
                      <v-btn
                        :disabled="loading"
                        plain
                        @click="appointmentCancelled(event)"
                        title="Cancel"
                        ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                      >
                    </div>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{
                    event.message ? event.message : "No Message"
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-btn class="px-5" @click="viewAllDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    selectedDate: new Date(), // Current date or selected date
    events: [],
    allDayEvents: [],
    viewAllDialog: false,
    snackbar: false,
    message: "",
    loading: false,
  }),

  async created() {
    await this.getAppointments();
  },

  methods: {
    ...mapActions({
      getAppointments: "appointmentModule/getAppointments",
      scheduleAppointment: "appointmentModule/scheduleAppointment",
      approveAppointment: "appointmentModule/approveAppointment",
      cancelAppointment: "appointmentModule/cancelAppointment",
    }),

    openForm() {
      this.$refs.booking.openForm({ date: this.selectedDate });
    },
    appointmentCancelled(event) {
      this.loading = true;
      const filteredEvents = this.events.filter(
        (ele) => ele.date === this.selectedDate && ele.id !== event.id
      );
      if (!filteredEvents.length) {
        this.viewAllDialog = false;
      }
      this.allDayEvents = filteredEvents;
      this.snackbar = true;
      this.message = "Appointment cancelled !!";
      this.cancelAppointment(event.id);
      this.loading = false;
    },
    appointmentApprove(event) {
      this.loading = true;
      let obj = {
        id: event.id,
        color: "#37a543",
      };
      this.approveAppointment(obj);
      this.snackbar = true;
      this.message = "Appointment approved !!";
      this.allDayEvents.forEach((ele) => {
        if (ele.id === event.id) {
          ele.color = "#37a543";
        }
      });
      this.loading = false;
    },
    viewEvents({ date }) {
      this.selectedDate = date;
      const filteredEvents = this.events.filter((event) => event.date === date);
      if (filteredEvents.length > 0) {
        this.allDayEvents = filteredEvents;
        this.viewAllDialog = true;
      }
    },

    goToPreviousMonth() {
      const prevMonth = new Date(this.selectedDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      this.selectedDate = prevMonth; // Update the selectedDate to previous month
    },
    goToNextMonth() {
      const nextMonth = new Date(this.selectedDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.selectedDate = nextMonth; // Update the selectedDate to next month
    },
    formatEventTime(dateString) {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; // Convert 24-hour to 12-hour format
      const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${day}th ${month}, ${year}`;
    },
  },

  computed: {
    ...mapState({
      appointments: (state) => state.appointmentModule.appointments,
    }),
  },

  watch: {
    appointments(val) {
      let data = [];
      if (val.length) {
        val.forEach((ele) => {
          if (
            ele.scheduledWith === this.user.id ||
            ele.scheduledBy === this.user.id
          ) {
            ele.start = ele.date + "T" + ele.startTime;
            ele.end = ele.date + "T" + ele.endTime;
            if (!ele.color) {
              ele.color = "#ed910aed";
            }
            data.push(ele);
          }
        });
      }
      this.events = data;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .v-toolbar__content {
  justify-content: space-between;
  padding-right: 0px;
}
.calender {
  height: 440px;
}
div {
  width: 100%;
}
.scheduled {
  background: #37a543;
  border-radius: 10px;
}
.pending {
  background: #ed910aed;
  border-radius: 10px;
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
::v-deep .v-event {
  min-height: 38px;
  text-align: center;
}
::v-deep .v-event-more {
  text-align: center;
  margin-left: 1px;
}
::v-deep .dot {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>