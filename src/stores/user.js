const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return { accessTokenPinia: '', sessionID: '', userDataPinia: '', isOpen: false };
  },
});
