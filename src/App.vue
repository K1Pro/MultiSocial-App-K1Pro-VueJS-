<template>
  <snackbar> </snackbar>

  <template v-if="this.userStore.loggedInPinia === true">
    <div class="grid-container">
      <div class="item1">
        <socialmedia @socialmedia-msg="updateSnackbar" @logout="updateAccessToken" @posted="updatePosted">
        </socialmedia>
      </div>
      <div class="item2">
        <posted> </posted>
      </div>
    </div>
  </template>

  <template v-else-if="this.userStore.loggedInPinia === false">
    <login @login="updateAccessToken" @login-msg="updateSnackbar"> </login>
  </template>

  <template v-else>
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  </template>
</template>

<script>
import Snackbar from './components/Snackbar.vue';
import Login from './components/Login.vue';
import Posted from './components/Posted.vue';
import Email from './components/Email.vue';
import Socialmedia from './components/SocialMedia.vue';

export default {
  name: 'App',

  components: {
    Snackbar,
    Login,
    Posted,
    Email,
    Socialmedia,
  },

  data() {
    return {
      // accessToken: this.getCookie('_a_t'),
      // sessionID: this.getCookie('_s_i'),
      // userData: '',
      // message: null,
      // chosenSocialMedia: '',
      // loggedIn: null,
      // newPostTimestamp: '',
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    getCookie(name) {
      return document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))?.at(2);
    },

    updateSnackbar(message) {
      this.message = message;
    },

    updatePosted(timestamp) {
      this.newPostTimestamp = timestamp;
    },

    updateAccessToken(accessToken, sessionID) {
      this.accessToken = accessToken;
      this.sessionID = sessionID;
    },

    async getUserData(endPt) {
      try {
        const response = await fetch(servrURL + endPt, {
          method: 'GET',
          headers: {
            Authorization: this.userStore.accessTokenPinia,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          // this.userData = userDataResJSON.data.user;
          // this.loggedIn = true;

          this.userStore.userDataPinia = userDataResJSON.data.user;
          this.userStore.loggedInPinia = true;
        } else {
          // this.loggedIn = false;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          // this.accessToken = undefined;
          // this.sessionID = undefined;

          this.userStore.loggedInPinia = false;

          this.userStore.accessTokenPinia = undefined;
          this.userStore.sessionIDPinia = undefined;
        }
      } catch (error) {
        this.error = error.toString();
        this.message = this.error;
      }
    },
  },

  watch: {
    accessToken(newToken, oldToken) {
      this.userData = '';
      this.userStore.userDataPinia = '';
      // this.loggedIn = false;
      if (newToken != undefined) this.getUserData(this.userDataEndPt);
    },
    message() {
      setTimeout(() => {
        this.message = null;
      }, 3000);
    },
  },

  created() {
    this.userDataEndPt = 'controller/users.php?userid=';
    this.userStore.getCookiePinia('_a_t');
    if (this.userStore.accessTokenPinia) {
      this.getUserData(this.userDataEndPt);
    } else {
      // this.loggedIn = false;

      this.userStore.loggedInPinia = false;
    }
  },
};
</script>

<style>
.grid-container {
  display: grid;
  grid-template-columns: 98.5vw;
  grid-template-rows: auto;
  grid-row-gap: 10px;
  background-color: #c6c6c6;
  word-break: break-all;
}

.item1 {
  background-color: #999999;
  background: -webkit-linear-gradient(left, #f1f1f1 20%, #999999 20%);
  background: -moz-linear-gradient(left, #f1f1f1 20%, #999999 20%);
  background: -ms-linear-gradient(left, #f1f1f1 20%, #999999 20%);
  background: linear-gradient(left, #f1f1f1 20%, #999999 20%);
  padding-right: 5px;
  scrollbar-width: thin;
  overflow-y: hidden;
}

.item2 {
  background-color: #999999;
  padding: 5px;
  scrollbar-width: thin;
  overflow-y: hidden;
}

@media only screen and (min-width: 768px) {
  body {
    overflow-y: hidden;
  }

  .grid-container {
    grid-template-columns: 75vw 25vw;
    grid-template-rows: 100vh;
  }

  .item1 {
    overflow-y: scroll;
    background: -webkit-linear-gradient(left, #f1f1f1 10%, #999999 10%);
    background: -moz-linear-gradient(left, #f1f1f1 10%, #999999 10%);
    background: -ms-linear-gradient(left, #f1f1f1 10%, #999999 10%);
    background: linear-gradient(left, #f1f1f1 10%, #999999 10%);
  }

  .item2 {
    overflow-y: scroll;
  }
}
</style>
