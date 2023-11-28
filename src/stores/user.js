const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: null,
      userData: [],
      message: null,
      imagePath: localStorage.getItem(`RapidMarketingAI-mostRecentImagePath`)
        ? localStorage.getItem(`RapidMarketingAI-mostRecentImagePath`) +
          '?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
        : '',
      imgSrchArr: [],
      xDB_galleryOnLoad: '',
      endPts: {
        userData: 'users',
        login: 'sessions',
        logout: 'sessions/',
        socialMedia: 'socialmedia',
        socialMediaParams: 'smparams',
        post: 'post',
        posted: 'posted',
        uploadImage: 'imageupload',
        generatedText: 'generatedtext',
        searchedPhotos: 'searchedphotos',
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
  getters: {
    imgSrchArr1stPart: (state) =>
      state.userData.SearchedPhotos[state.userData.MostRecentSearch].photos.slice(
        0,
        state.userData.SearchedPhotos[state.userData.MostRecentSearch].photos.length / 2
      ),
    imgSrchArr2ndPart: (state) =>
      state.userData.SearchedPhotos[state.userData.MostRecentSearch].photos.slice(
        state.userData.SearchedPhotos[state.userData.MostRecentSearch].photos.length / 2,
        state.userData.SearchedPhotos[state.userData.MostRecentSearch].photos.length
      ),
    // imgSrchArr1stPart: (state) => state.imgSrchArr.slice(0, state.imgSrchArr.length / 2),
    // imgSrchArr2ndPart: (state) => state.imgSrchArr.slice(state.imgSrchArr.length / 2, state.imgSrchArr.length),
  },
});
