const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return { userDataPinia: '', isOpen: false };
  },
});
