const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessTokenPinia: '',
      sessionIDPinia: '',
      loggedInPinia: null,
      userDataPinia: '',
      messagePinia: null,
      chosenSocialMediaPinia: '',
      newPostTimestampPinia: '',
    };
  },
  actions: {
    getCookiePinia(name) {
      this.accessTokenPinia = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);
    },
  },
});
