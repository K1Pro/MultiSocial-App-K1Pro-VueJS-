const useModalStore = Pinia.defineStore('modal', {
  state: () => {
    return { userDataPinia: '', isOpen: false };
  },
});
