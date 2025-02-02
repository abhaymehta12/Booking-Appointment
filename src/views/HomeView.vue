<template>
  <v-container>
    <Teacher v-if="user && user.role === 'teacher'" />
    <Student v-else />
  </v-container>
</template>
<script>
import Teacher from "../components/Teacher.vue";
import Student from "../components/Student.vue";
import { mapState } from "vuex";

export default {
  components: {
    Teacher,
    Student,
  },

  data: () => ({
    //
  }),

  computed: {
    ...mapState("dataModule", { user: (state) => state.user }),
  },
};
</script>