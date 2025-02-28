import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        allappointments: [],
        appointments: [],
        studentTable: []
    },
    getters: {
    },
    actions: {
        async getAllAppointments({ commit }) {
            try {
                let array = []
                const data = await firebase.firestore().collection('appointments').get();
                data.docs.forEach((doc) => {
                    array.push(doc.data())
                })
                commit("set_allappointments", array)
            } catch (error) {
                console.log(error)
            }
        },
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
                if (payload.scheduledWith = "all") {
                    dispatch('getAppointments')
                } else {
                    dispatch('fetchStudentData')
                }
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
                let arr1 = [], arr2 = [], arr3 = [];
                const id = localStorage.getItem("loggedIn");
                const teachers = await firebase.firestore().collection('users').where('role', '==', 'teacher').get();
                const myappointments = await firebase.firestore().collection('appointments').where('scheduledBy', '==', id).get();
                const teacherappointments = await firebase.firestore().collection('appointments').where('scheduledWith', '==', "all").get();
                myappointments.docs.forEach((doc) => {
                    arr1.push(doc.data())
                })
                teacherappointments.docs.forEach((doc) => {
                    arr2.push(doc.data())
                })
                teachers.docs.forEach((doc) => {
                    arr3.push(doc.data())
                })
                arr3.forEach((ele) => {
                    const index = arr1.findIndex((item) => item.scheduledWith === ele.id)
                    if (index >= 0) {
                        ele.singleapp = arr1[index].date
                        ele.title = arr1[index].title
                    }
                    const result = arr2.filter((item) => item.scheduledBy === ele.id)
                    if (result.length) {
                        let arr = []
                        result.forEach((el) => {
                            let obj = {
                                date: el.date,
                                title: el.title
                            }
                            arr.push(obj)
                        })
                        ele.multipleapp = arr
                    }
                })
                commit("set_studentappointments", arr3)
            } catch (error) {
                console.log(error)
            }
        },
    },
    mutations: {
        set_appointments: (state, data) => {
            state.appointments = data
        },
        set_allappointments: (state, data) => {
            state.allappointments = data
        },
        set_studentappointments: (state, data) => {
            state.studentTable = data
        },
        clear_data: (state) => {
            state.allappointments = []
            state.appointments = []
            state.studentTable = []
        }
    }
}