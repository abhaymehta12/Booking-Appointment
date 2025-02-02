import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        teachers: [],
        nonregistered_student: []
    },
    getters: {
    },
    actions: {
        async getTeachers({ commit }) {
            try {
                let array = []
                const data = await firebase.firestore().collection('users').where('role', '==', 'teacher').get();
                data.docs.forEach((doc) => {
                    array.push(doc.data())
                })
                commit("set_teachers", array)
            } catch (error) {
                console.log(error)
            }
        },
        async getNRStudents({ commit }) {
            try {
                let array = []
                const data = await firebase.firestore().collection('users').where('registered', '==', false).get();
                data.docs.forEach((doc) => {
                    array.push(doc.data())
                })
                commit("nonregistered_student", array)
            } catch (error) {
                console.log(error)
            }
        },
        async acceptRegistration({ commit, dispatch }, payload) {
            try {
                await firebase.firestore().collection("users").doc(payload.id).set({ registered: payload.val }, { merge: true })
                dispatch('getNRStudents');
            } catch (error) {
                console.log(error)
            }
        },
    },
    mutations: {
        set_teachers: (state, data) => {
            state.teachers = data;
        },
        nonregistered_student: (state, data) => {
            state.nonregistered_student = data;
        }
    }
}