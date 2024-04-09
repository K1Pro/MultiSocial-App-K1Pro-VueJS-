import App from './App_vue.js';
const vm = Vue.createApp(App);
const pinia = Pinia.createPinia();
vm.use(pinia);
vm.mount('#app');
