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

const store = Vuex.createStore({
  state() {
    return {
      counter: 0,
    };
  },
});

const vm = Vue.createApp({
  components: {
    app: Vue.defineAsyncComponent(() => loadModule('./src/App.vue', options)),
  },
  template: '<app></app>',
});

vm.use(store);

vm.mount('#app');
