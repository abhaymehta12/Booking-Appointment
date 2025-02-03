import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
        user: null
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
                    user.docs.forEach((doc) => {
                        commit("set_user", doc.data())
                        if (doc.data().role === 'admin') {
                            localStorage.setItem('loggedUser', 'Admin')
                        }
                        localStorage.setItem('loggedIn', doc.data().id)
                    })
                    return true;
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
        async acceptRegistration({ commit }, payload) {
            try {
                await firebase.firestore().collection("users").doc(payload.id).set({ registered: payload.val }, { merge: true })
            } catch (error) {
                console.log(error)
            }
        },
        async updateTeacher({ commit }, payload) {
            try {
                const queryPass = await firebase.firestore().collection('users').where('id', '!=', payload.id).where('password', '==', payload.password).get();
                const queryUname = await firebase.firestore().collection('users').where('id', '!=', payload.id).where('username', '==', payload.username).get();
                if (!queryUname.empty) {
                    return "Username Already Exist"
                } else if (!queryPass.empty) {
                    return "Password Already Exist."
                } else {
                    await firebase.firestore().collection("users").doc(payload.id).set(payload, { merge: true })
                }
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
        clear_data: (state) => {
            state.user = null;
        }
    }
}