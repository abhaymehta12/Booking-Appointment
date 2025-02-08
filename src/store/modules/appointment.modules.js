import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        appointments: [],
        studentTable: []
    },
    getters: {
    },
    actions: {
        async getAppointments({ commit }) {
            try {
                const id = localStorage.getItem("loggedIn");
                const data1 = await firebase.firestore().collection('appointments').where('scheduledBy', '==', id).get();
                const data2 = await firebase.firestore().collection('appointments').where('scheduledWith', '==', id).get();
                const combinedAppointments = [...data1.docs.map(doc => doc.data()), ...data2.docs.map(doc => doc.data())];
                commit("set_appointments", combinedAppointments)
            } catch (error) {
                console.log(error)
            }
        },
        async scheduleAppointment({ commit, dispatch }, payload) {
            try {
                const resp = await firebase.firestore().collection("appointments").add(payload);
                await firebase.firestore().collection("appointments").doc(resp.id).set({ id: resp.id }, { merge: true })
                dispatch('getAppointments')
            } catch (error) {
                console.log(error)
            }
        },
        async approveAppointment({ commit, dispatch }, payload) {
            try {
                await firebase.firestore().collection("appointments").doc(payload.id).set(payload, { merge: true })
                dispatch('getAppointments')
            } catch (error) {
                console.log(error)
            }
        },
        async cancelAppointment({ commit, dispatch }, payload) {
            try {
                await firebase.firestore().collection("appointments").doc(payload).delete()
                dispatch('getAppointments')
            } catch (error) {
                console.log(error)
            }
        },
        async fetchStudentData({ commit }) {
            try {
                const id = localStorage.getItem("loggedIn");
                const teachers = await firebase.firestore().collection('users').where('role', '==', 'teacher').get();
                const myappointments = await firebase.firestore().collection('appointments').where('scheduledBy', '==', id).get();
                const teacherappointments = await firebase.firestore().collection('appointments').where('scheduledWidth', '==', "all").get();
                myappointments.docs.forEach((doc) => {
                    console.log(doc.data())
                })
                teacherappointments.docs.forEach((doc) => {
                    console.log(doc.data())
                })
                teachers.docs.forEach((doc) => {
                    console.log(doc.data())
                })
            } catch (error) {
                console.log(error)
            }
        },
    },
    mutations: {
        set_appointments: (state, data) => {
            state.appointments = data
        },
        clear_data: (state,) => {
            state.appointments = []
        }
    }
}