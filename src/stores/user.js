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
    getCookiePinia(accessToken, sessionID) {
      this.accessTokenPinia = document.cookie.match(new RegExp(`(^| )${accessToken}=([^;]+)`))?.at(2);
      this.sessionIDPinia = document.cookie.match(new RegExp(`(^| )${sessionID}=([^;]+)`))?.at(2);
    },
  },
});
