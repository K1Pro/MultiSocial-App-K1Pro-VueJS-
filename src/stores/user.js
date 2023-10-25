const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: null,
      userData: '',
      message: null,
      newPostTimestamp: '',
      imagePath: localStorage.getItem(`RapidMarketingAI-mostRecentImagePath`)
        ? localStorage.getItem(`RapidMarketingAI-mostRecentImagePath`) +
          '?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
        : '',
      imgSrchArr: '',
      endPts: {
        userData: 'controller/users.php?userid=',
        login: 'controller/sessions.php',
        logout: 'controller/sessions.php?sessionid=',
        socialMedia: 'controller/socialmedia.php',
        socialMediaParams: 'controller/smparams.php',
        post: 'controller/post.php',
        posted: 'controller/posted.php',
      },
      vars: {
        medium: '?auto=compress&cs=tinysrgb&h=350',
        landscape: '?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
        appName: 'RapidMarketingAI',
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
