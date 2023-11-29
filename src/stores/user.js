const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      loggedIn: null,
      message: null,
      sessionID: '',
      userData: [],
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
    };
  },
  actions: {
    getCookie(accessToken, sessionID) {
      this.accessToken = document.cookie.match(new RegExp(`(^| )${accessToken}=([^;]+)`))?.at(2);
      this.sessionID = document.cookie.match(new RegExp(`(^| )${sessionID}=([^;]+)`))?.at(2);
    },
    async patchUserData(event) {
      const inputValue = event.target.value ? event.target.value : event.target.src ? event.target.src : '';
      try {
        const response = await fetch(servrURL + this.endPts.userData, {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            [event.target.name]: inputValue,
          }),
        });
        const patchUserDataResJSON = await response.json();
        if (patchUserDataResJSON.success) {
          console.log(patchUserDataResJSON);
        }
        this.message = patchUserDataResJSON.messages[0];
      } catch (error) {
        this.error = error.toString();
        this.message = this.error;
      }
    },
  },
  getters: {
    imgSrchArr1stPart: (state) =>
      state.userData.SearchedPhotos[state.userData.MostRecentSearch]?.photos.slice(
        0,
        state.userData.SearchedPhotos[state.userData.MostRecentSearch]?.photos.length / 2
      ),
    imgSrchArr2ndPart: (state) =>
      state.userData.SearchedPhotos[state.userData.MostRecentSearch]?.photos.slice(
        state.userData.SearchedPhotos[state.userData.MostRecentSearch]?.photos.length / 2,
        state.userData.SearchedPhotos[state.userData.MostRecentSearch]?.photos.length
      ),
  },
});
