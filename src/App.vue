<template>
  <snackbar :message="message"> </snackbar>

  <template v-if="loggedIn === true">
    <div class="grid-container">
      <div class="item1">
        <socialmedia
          :accessToken="accessToken"
          :sessionID="sessionID"
          :userData="userData"
          @socialmedia-msg="updateSnackbar"
          @logout="updateAccessToken"
          @posted="updatePosted"
        >
        </socialmedia>
      </div>
      <div class="item2">
        <posted :accessToken="accessToken" :newPostTimestamp="newPostTimestamp"> </posted>
      </div>
    </div>
  </template>

  <template v-else-if="loggedIn === false">
    <login @login="updateAccessToken" @login-msg="updateSnackbar"> </login>
  </template>

  <template v-else>
    <div class="loader-container">
      <div class="loader"></div>
    </div>
  </template>
</template>
<!-- script -->
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
      accessToken: this.getCookie('_a_t'),
      sessionID: this.getCookie('_s_i'),
      userData: '',
      message: null,
      chosenSocialMedia: '',
      loggedIn: null,
      newPostTimestamp: '',
    };
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
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const userDataResJSON = await response.json();
        if (userDataResJSON.success) {
          this.userData = userDataResJSON.data.user;
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          this.accessToken = undefined;
          this.sessionID = undefined;
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
      this.loggedIn = false;
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
    if (this.accessToken) {
      this.getUserData(this.userDataEndPt);
    } else {
      this.loggedIn = false;
    }
  },
};
</script>

<style scoped>
.example {
  color: v-bind('color');
}
</style>
