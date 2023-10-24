const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: null,
      userData: '',
      message: null,
      newPostTimestamp: '',
      imagePath: localStorage.getItem(`Multisocial-mostRecentImagePath`)
        ? localStorage.getItem(`Multisocial-mostRecentImagePath`)
        : '',
      imgSrchArr: '',
      endPts: {
        userData: 'controller/users.php?userid=',
        login: 'controller/sessions.php',
        logout: 'controller/sessions.php?sessionid=',
        socialMedia: 'controller/socialmedia.php',
        socialMediaParams: 'controller/smparams.php',
        posted: 'controller/posted.php',
      },
    };
  },
  actions: {
    getCookie(accessToken, sessionID) {
      this.accessToken = document.cookie.match(new RegExp(`(^| )${accessToken}=([^;]+)`))?.at(2);
      this.sessionID = document.cookie.match(new RegExp(`(^| )${sessionID}=([^;]+)`))?.at(2);
    },
  },
});
