const useUserStore = Pinia.defineStore('user', {
  state: () => {
    return {
      accessToken: '',
      sessionID: '',
      loggedIn: null,
      message: null,
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
    async patchUserData(event, key, value) {
      const patchKey = key ? key : event.target.name ? event.target.name : event.target.id ? event.target.id : '';
      const patchValue = value ? value : event?.target.nodeName == 'IMG' ? event?.target.src : event?.target.value;
      if (patchKey && patchValue) {
        try {
          const response = await fetch(servrURL + this.endPts.userData, {
            method: 'PATCH',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              [patchKey]: patchValue,
            }),
          });
          const patchUserDataResJSON = await response.json();
          // if (patchUserDataResJSON.success) {
          //   console.log(patchUserDataResJSON);
          // }
          // this.message = patchUserDataResJSON.messages[0];
          console.log(patchUserDataResJSON.messages[0]);
        } catch (error) {
          this.error = error.toString();
          this.message = this.error;
        }
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
