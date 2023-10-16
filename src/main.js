// const store = Vuex.createStore({ // for Vuex
//   state() {
//     return {
//       counter: 5,
//       accessToken2: '',
//       sessionID2: '',
//       userData2: '',
//       message2: '',
//       chosenSocialMedia2: '',
//       loggedIn2: null,
//       newPostTimestamp2: '',
//     };
//   },
//   mutations: {
//     // increment(state) {
//     //   state.counter++;
//     //   // this.$store.commit('increment'); use this inside components
//     // },
//     // increase(state, payload) {
//     //   state.counter = state.counter + payload.value;
//     // },
//   },
//   actions: {
//     // increment(context) {
//     //   setTimeout(function () {
//     //     context.commit('increment');
//     //   });
//     // },
//     // async getUserData({ commit }) {
//     //   try {
//     //     const data = await axios.get('https://jsonplaceholder.typicode.com/users');
//     //     commit('SET_USERS', data.data);
//     //   } catch (error) {
//     //     alert(error);
//     //     console.log(error);
//     //   }
//     // },
//   },
//   getters: {
//     // finalCounter(state) {
//     //   return state.counter * 2;
//     // },
//     // normalizedCounter(state, getters) {
//     //   // can replace state with _ if you do not want to work with it
//     //   const finalCounter = getters.finalCounter;
//     //   if (finalCounter < 0) {
//     //     return 0;
//     //   }
//     //   if (finalCounter > 100) {
//     //     return 100;
//     //   }
//     //   return finalCounter;
//     // },
//   },
// });

const options = {
  moduleCache: {
    vue: Vue,
  },
  async getFile(url) {
    const res = await fetch(url);
    if (!res.ok) throw Object.assign(new Error(res.statusText + ' ' + url), { res });
    return {
      getContentData: (asBinary) => (asBinary ? res.arrayBuffer() : res.text()),
    };
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
};

const { loadModule } = window['vue3-sfc-loader'];

const vm = Vue.createApp({
  components: {
    app: Vue.defineAsyncComponent(() => loadModule('./src/App.vue', options)),
  },
  template: '<app></app>',
});

const pinia = Pinia.createPinia();

vm.use(pinia);

// vm.use(store); // for Vuex

vm.mount('#app');
