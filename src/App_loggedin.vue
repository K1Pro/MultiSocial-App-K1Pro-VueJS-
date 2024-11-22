<template>
  <snackbar :msg @deleteMsg="msg = null"></snackbar>

  <div class="app-grid-container" v-if="Object.keys(userData).length !== 0">
    <div class="app-grid-item1">
      <socialmedia> </socialmedia>
    </div>
    <div class="app-grid-item2">
      <gallery> </gallery>
    </div>
    <div class="app-grid-item3">
      <posted> </posted>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',

  mixins: [snackbarMixin, wndwWdthHghtMixin],

  data() {
    return {
      userData: {},
      endPts: {
        url: url,
        userData: '/users',
        login: 'sessions',
        logout: 'sessions/',
        socialMedia: 'socialmedia',
        socialMediaParams: '/smparams',
        post: 'post',
        posted: 'posted',
        uploadImage: 'imageupload',
        generatedText: 'generatedtext',
        searchedPhotos: 'searchedphotos',
      },
    };
  },

  provide() {
    return {
      // computed
      userData: Vue.computed(() => this.userData),
      // static
      endPts: this.endPts,
      // methods
      patchUserData: this.patchUserData,
    };
  },

  methods: {
    async getUserData(endPt) {
      try {
        const response = await fetch(app_api_url + endPt, {
          method: 'GET',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          document.getElementById('loader-container').remove();
          this.userData = userDataResJSON.data.user;
          console.log(userDataResJSON.data.user);
        } else {
          location.reload();
        }
      } catch (error) {
        this.showMsg(error.toString());
      }
    },
    async patchUserData(event, key, value) {
      const patchKey = key ? key : event.target.name ? event.target.name : event.target.id ? event.target.id : '';
      const patchValue = value ? value : event?.target.nodeName == 'IMG' ? event?.target.src : event?.target.value;
      if (patchKey && patchValue) {
        try {
          const response = await fetch(app_api_url + this.endPts.userData, {
            method: 'PATCH',
            headers: {
              Authorization: access_token,
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
          // this.showMsg(patchUserDataResJSON.messages[0]);
          console.log(patchUserDataResJSON.messages[0]);
        } catch (error) {
          this.showMsg(error.toString());
        }
      }
    },
  },

  created() {
    this.getUserData(this.endPts.userData);
  },
};
</script>

<style>
.app-grid-container {
  display: grid;
  grid-template-columns: 100vw;
  grid-template-rows: auto;
  grid-row-gap: 10px;
  background-color: #c6c6c6;
  /* word-break: break-all; */
}
.app-grid-item1 {
  height: 100%;
  border-right: none;
  overflow-y: hidden;
  overflow-x: hidden;
  background: -webkit-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -moz-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -ms-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: linear-gradient(left, #f1f1f1 49px, #999999 49px);
}
.app-grid-item2 {
  border-right: none;
}
.app-grid-item2,
.app-grid-item3 {
  background-color: #999999;
  overflow-y: hidden;
}
@media only screen and (min-width: 768px) {
  body {
    overflow-y: hidden;
  }
  .app-grid-container {
    grid-template-columns: 42vw 42vw 16vw;
    grid-template-rows: 100vh;
  }
  .app-grid-item1 {
    background: #999999;
  }
  .app-grid-item1,
  .app-grid-item2,
  .app-grid-item3 {
    overflow-y: scroll;
  }
}
</style>
