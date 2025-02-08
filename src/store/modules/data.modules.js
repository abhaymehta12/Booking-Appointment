import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        user: null,
        teachers: [],
        nonregistered_student: [],
    },
    getters: {
    },
    actions: {
        async registration({ commit }, payload) {
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
                    let msg
                    user.docs.forEach((doc) => {
                        if (doc.data().role === 'student' && !doc.data().registered) {
                            msg = "Not Registered. Contact Admin office.";
                            return
                        }
                        commit("set_user", doc.data())
                        if (doc.data().role === 'admin') {
                            localStorage.setItem('loggedUser', 'Admin')
                        }
                        localStorage.setItem('loggedIn', doc.data().id)
                    })
                    return msg ? msg : true
                }
            } catch (error) {
                console.log(error)
            }
        },
        logout({ commit }) {
            try {
                localStorage.removeItem('loggedIn')
                localStorage.removeItem('loggedUser')
                commit("clear_data")
                commit("appointmentModule/clear_data", null, { root: true })
            } catch (error) {
                console.log(error)
            }
        },
        async getUserDetails({ commit }, payload) {
            const user = await firebase.firestore().collection('users').where('id', '==', payload).get();
            user.docs.forEach((doc) => {
                commit("set_user", doc.data())
            })
        },
        async acceptRegistration({ commit, dispatch }, payload) {
            try {
                await firebase.firestore().collection("users").doc(payload.id).set({ registered: payload.val }, { merge: true })
                dispatch('getNRStudents')
            } catch (error) {
                console.log(error)
            }
        },
        async updateTeacher({ commit, dispatch }, payload) {
            try {
                const queryPass = await firebase.firestore().collection('users').where('id', '!=', payload.id).where('password', '==', payload.password).get();
                const queryUname = await firebase.firestore().collection('users').where('id', '!=', payload.id).where('username', '==', payload.username).get();
                if (!queryUname.empty) {
                    return "Username Already Exist"
                } else if (!queryPass.empty) {
                    return "Password Already Exist."
                } else {
                    await firebase.firestore().collection("users").doc(payload.id).set(payload, { merge: true })
                    dispatch('getTeachers')
                }
            } catch (error) {
                console.log(error)
            }
        },
        async deleteUser({ commit, dispatch }, payload) {
            await firebase.firestore().collection("users").doc(payload).delete()
            dispatch('getTeachers')
        },
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
    },
    mutations: {
        set_user: (state, data) => {
            state.user = data;
        },
        clear_data: (state) => {
            state.user = null;
            state.teachers = [];
            state.nonregistered_student = [];
        },
        set_teachers: (state, data) => {
            state.teachers = data;
        },
        nonregistered_student: (state, data) => {
            state.nonregistered_student = data;
        }
    }
}