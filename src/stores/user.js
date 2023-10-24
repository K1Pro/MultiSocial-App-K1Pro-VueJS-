const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: null,
      userData: '',
      message: null,
      newPostTimestamp: '',
    };
  },
  actions: {
    getCookie(accessToken, sessionID) {
      this.accessToken = document.cookie.match(new RegExp(`(^| )${accessToken}=([^;]+)`))?.at(2);
      this.sessionID = document.cookie.match(new RegExp(`(^| )${sessionID}=([^;]+)`))?.at(2);
    },
  },
});
