<template>
  <snackbar> </snackbar>

  <template v-if="loggedIn === true">
    <div class="grid-container">
      <div class="item1">
        <socialmedia> </socialmedia>
      </div>
      <div class="item2">
        <gallery> </gallery>
      </div>
      <div class="item3">
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
import Gallery from './components/Gallery.vue';
import Socialmedia from './components/SocialMedia.vue';

export default {
  name: 'App',

  components: {
    Snackbar,
    Login,
    Posted,
    Gallery,
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
          console.log(userDataResJSON.data.user);
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
  background: -webkit-linear-gradient(left, #f1f1f1 50px, #999999 50px);
  background: -moz-linear-gradient(left, #f1f1f1 50px, #999999 50px);
  background: -ms-linear-gradient(left, #f1f1f1 50px, #999999 50px);
  background: linear-gradient(left, #f1f1f1 50px, #999999 50px);
  /* padding-right: 5px; */
  scrollbar-width: thin;
  overflow-y: hidden;
}

.item2,
.item3 {
  background-color: #999999;
  scrollbar-width: thin;
  overflow-y: hidden;
}

.item3 {
  padding: 5px;
}

@media only screen and (min-width: 768px) {
  body {
    overflow-y: hidden;
  }

  .grid-container {
    grid-template-columns: 42vw 42vw 16vw;
    grid-template-rows: 100vh;
  }

  .item1 {
    overflow-y: scroll;
    background: -webkit-linear-gradient(left, #f1f1f1 50px, #999999 50px);
    background: -moz-linear-gradient(left, #f1f1f1 50px, #999999 50px);
    background: -ms-linear-gradient(left, #f1f1f1 50px, #999999 50px);
    background: linear-gradient(left, #f1f1f1 50px, #999999 50px);
  }

  .item2,
  .item3 {
    overflow-y: scroll;
  }
}
</style>
