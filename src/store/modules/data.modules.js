import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        teachers: [],
        nonregistered_student: [],
        user: null
    },
    getters: {
    },
    actions: {
        async registeration({ commit }, payload) {
            try {
                const queryPass = await firebase.firestore().collection('users').where('password', '==', payload.password).get();
                const queryUname = await firebase.firestore().collection('users').where('username', '==', payload.username).get();
                if (!queryUname.empty) {
                    return "Username Already Exist"
                } else if (!queryPass.empty) {
                    return "Password Already Exist."
                } else {
                    const resp = await firebase.firestore().collection("users").add(payload);
                    await firebase.firestore().collection("users").doc(resp.id).set({ id: resp.id }, { merge: true })
                }
            } catch (error) {
                console.log(error)
            }
        },
        async login({ commit }, payload) {
            try {
                const user = await firebase.firestore().collection('users').where('password', '==', payload.password).get();
                if (user.empty) {
                    return false;
                } else {
                    user.docs.forEach((doc) => {
                        commit("set_user", doc.data())
                    })
                    return true;
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getTeachers({ commit }) {
            try {
                const data = await firebase.firestore().collection('users').where('role', '==', 'teacher').get();
                data.docs.forEach((doc) => {
                    commit("set_teachers", doc.data())
                })
            } catch (error) {
                console.log(error)
            }
        },
        async getNRStudents({ commit }) {
            try {
                const data = await firebase.firestore().collection('users').where('registered', '==', false).get();
                data.docs.forEach((doc) => {
                    commit("nonregistered_student", doc.data())
                })
            } catch (error) {
                console.log(error)
            }
        },
        deleteUser({ commit }, payload) {
            firebase.firestore().collection("users").doc(payload).delete()
        }
    },
    mutations: {
        set_user: (state, data) => {
            state.user = data;
        },
        set_teachers: (state, data) => {
            state.teachers.push(data);
        },
        nonregistered_student: (state, data) => {
            state.nonregistered_student.push(data)
        }
    }
}