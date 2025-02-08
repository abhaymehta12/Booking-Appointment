<template>
  <v-container>
    <Teacher v-if="user && user.role === 'teacher'" :user='user' />
    <Student v-if="user && user.role === 'student'" :user='user' />
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

  computed: {
    ...mapState("dataModule", { user: (state) => state.user }),
  },
};
</script>