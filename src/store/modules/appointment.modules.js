//import firebase from 'firebase/compat/app'
//import 'firebase/compat/firestore'

export default {
    namespaced: true,
    state: {
    },
    getters: {
    },
    /*actions: {
        async getGroups({ commit }) {
            try {
                const data = await firebase.firestore().collection("groups").get()
                data.docs.forEach((doc) => {
                    commit("set_group", doc.data())
                })
            } catch (error) {
                console.log(error);
            }
        },
        deleteMember({ commit }, payload) {
            firebase.firestore().collection("members").doc(payload).delete()
        }
        async setRoles({ commit }, payload) {
            try {
                console.log(payload)
            } catch (error) {
                console.log(error);
            }
        },
    },
    mutations: {
        set_group: (state, data) => {
            state.groups = data;
        },
    }*/
}