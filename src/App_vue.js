import Snackbar from './components/Snackbar_vue.js';
import Login from './components/Login_vue.js';
import Posted from './components/Posted_vue.js';
import Gallery from './components/Gallery_vue.js';
import Socialmedia from './components/SocialMedia_vue.js';

export default {
  name: 'App',

  template: /*html*/ `
    <snackbar> </snackbar>

    <template v-if="loggedIn === true">
      <div class="app-grid-container">
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

    <template v-if="loggedIn === false">
      <div id="login-container">
        <login> </login>
      </div>
    </template>

    <template v-else></template>
  `,

  components: {
    Snackbar,
    Login,
    Posted,
    Gallery,
    Socialmedia,
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
    ...Pinia.mapWritableState(useUserStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'windowWidth',
      'userData',
      'endPts',
    ]),
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
        this.msg.snackBar = error.toString();
      }
    },

    updateScreenWidth() {
      this.windowWidth = window.innerWidth;
    },
    onScreenResize() {
      window.addEventListener('resize', () => {
        this.updateScreenWidth();
      });
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

  mounted() {
    this.updateScreenWidth();
    this.onScreenResize();
    style(
      'App',
      /*css*/ `
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
  background-color: #999999;
  border-right: none;
  overflow-y: hidden;
  overflow-x: hidden;
  ${
    /* background: -webkit-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -moz-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: -ms-linear-gradient(left, #f1f1f1 49px, #999999 49px);
  background: linear-gradient(left, #f1f1f1 49px, #999999 49px); */ ''
  }
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

  .app-grid-item1,
  .app-grid-item2,
  .app-grid-item3 {
    overflow-y: scroll;
  }
}
      `
    );
  },
};
