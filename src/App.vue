<template>
  <snackbar> </snackbar>

  <template v-if="loggedIn === true">
    <div class="grid-container">
      <div class="item1">
        <socialmedia> </socialmedia>
      </div>
      <div class="item2">
        <posted> </posted>
      </div>
    </div>
  </template>

  <template v-else-if="loggedIn === false">
    <login> </login>
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

  computed: {
    ...Pinia.mapStores(useUserStore),
    ...Pinia.mapWritableState(useUserStore, ['accessToken', 'sessionID', 'loggedIn', 'userData', 'endPts']),
  },

  methods: {
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
          this.loggedIn = true;
          this.userData = userDataResJSON.data.user;
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
      // this.loggedIn = false;
      if (newToken != undefined) this.getUserData(this.endPts.userData);
    },
  },

  created() {
    this.userStore.getCookie('_a_t', '_s_i');
    if (this.accessToken) {
      this.getUserData(this.endPts.userData);
    } else {
      this.loggedIn = false;
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
