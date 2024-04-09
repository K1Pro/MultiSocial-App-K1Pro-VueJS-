import Post from './Post_vue.js';
import Accountinfo from './AccountInfo_vue.js';
import Logoutbtn from './LogOutBtn_vue.js';

export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="side-panel">
      <div class="tab-title-container">
        <div class="tab-title"></div>
      </div>

      <div class="tab-body-container">
        <div class="tab">
          <button
            title="Home"
            :class="{ 'tab-active': activeTab == 'home' }"
            class="fa fa-home"
            @click="openTab"
          ></button>
          <button
            v-for="smParam in socialMediaParams"
            :title="
              smParam.website.charAt(0).toUpperCase() + smParam.website.slice(1)
            "
            :class="[
              {'tab-active': activeTab == smParam.website.toLowerCase(),},
              ['fab fa-'] + smParam.website.toLowerCase(),
            ]"
            @click="openTab"
            ${
              /* 
              style="background: #f1f1f1"
              @mouseover="hoverOverTab" 
              @mouseout="hoverOutTab" */ ''
            }
          ></button>
          <button
            title="Log out"
            :class="{ 'tab-active': activeTab == 'logout' }"
            class="fa fa-sign-out"
            @click="openTab"
          ></button>
        </div>

        <div class="tab-content" v-if="activeTab == 'home'">
          <post></post>
        </div>

        <div class="tab-content" v-if="activeTab == 'sign-out'">
          <accountinfo></accountinfo>
          <logoutbtn>></logoutbtn>
        </div>

        <div
          class="tab-content"
          v-if="activeTab != 'home' && activeTab != 'sign-out'"
        >
          <h2>
            <input
              type="checkbox"
              id="active"
              :checked="
                this.userStore.userData.SMParams?.[activeTab]?.['active'] ==
                  '1' ||
                this.userStore.userData.SMParams?.[activeTab]?.['active'] === true
                  ? true
                  : null
              "
              @click="patchSocialMedia"
            />
            {{ activeTab.charAt(0).toUpperCase() }}{{ activeTab.slice(1) }}
          </h2>

          <div
            v-for="selectedWebsite in Object.values(socialMediaParams).filter(
              (smParam) => {
                return smParam.website == activeTab;
              }
            )"
          >
            <div
              v-for="smKey in Object.values(selectedWebsite).filter((smValue) => {
                return smValue != activeTab;
              })"
            >
              <b>{{ smKey.replaceAll('_', ' ') }}</b>
              <input
                :type="smKey.includes('Expiry') ? 'datetime-local' : 'text'"
                :id="smKey"
                :value="this.userStore.userData.SMParams?.[activeTab]?.[smKey]"
                @change="patchSocialMedia"
              /><br /><br />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  components: { Post, Accountinfo, Logoutbtn },

  data() {
    return {
      socialMediaParams: '',
      activeTab: 'home',
      active: false,
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    openTab(event) {
      if (event.target.className.split('fa-')[1] != this.activeTab) {
        // event.target.style.backgroundColor = '#bbbbbb';
        const selectedTab = event.target.className.split('fa-')[1];
        if (!this.userStore.userData.SMParams?.[selectedTab]) {
          const mergedObj = Object.assign(
            { [selectedTab]: '' },
            this.userStore.userData.SMParams
          );
          this.userStore.userData.SMParams = mergedObj;
        }
        this.activeTab = selectedTab;
      }
    },

    hoverOverTab(event) {
      if (event.target.className.split('fa-')[1] != this.activeTab) {
        event.target.style.backgroundColor = '#ddd';
      } else {
        event.target.style.backgroundColor = '#bbbbbb';
      }
    },

    hoverOutTab(event) {
      if (event.target.className.split('fa-')[1] != this.activeTab) {
        event.target.style.backgroundColor = '#f1f1f1';
      } else {
        event.target.style.backgroundColor = '#bbbbbb';
      }
    },

    async patchSocialMedia(event) {
      // This checks if the social media groups properties exists already, if not it is created, ex: SMParams.facebook.App_ID; otherise key is modified
      if (!this.userStore.userData.SMParams[this.activeTab]) {
        // key is created
        event.target.type == 'checkbox'
          ? (this.userStore.userData.SMParams[this.activeTab] = {
              [event.target.id]: event.target.checked,
            })
          : (this.userStore.userData.SMParams[this.activeTab] = {
              [event.target.id]: event.target.value,
            });
      } else {
        // key is modified
        event.target.type == 'checkbox'
          ? (this.userStore.userData.SMParams[this.activeTab][event.target.id] =
              event.target.checked)
          : (this.userStore.userData.SMParams[this.activeTab][event.target.id] =
              event.target.value);
      }
      const inputValue =
        event.target.type == 'checkbox'
          ? event.target.checked
          : event.target.value;
      try {
        const response = await fetch(
          servrURL + this.userStore.endPts.socialMedia,
          {
            method: 'PATCH',
            headers: {
              Authorization: this.userStore.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              website: this.activeTab,
              [event.target.id]: inputValue,
            }),
          }
        );
        const patchSocialMediaJSON = await response.json();
        if (patchSocialMediaJSON.success) {
          this.userStore.msg.snackBar = patchSocialMediaJSON.messages[0];
        }
        console.log(patchSocialMediaJSON);
      } catch (error) {
        this.userStore.msg.snackBar = error.toString();
      }
    },

    async getSocialMediaParams() {
      try {
        const response = await fetch(
          servrURL + this.userStore.endPts.socialMediaParams,
          {
            method: 'GET',
          }
        );
        const SocialMediaParamsJSON = await response.json();
        if (SocialMediaParamsJSON.success)
          this.socialMediaParams = SocialMediaParamsJSON.data.sm_params;
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
  },

  created() {
    this.getSocialMediaParams();
  },

  mounted() {
    style(
      'SocialMedia',
      /*css*/ `
.tab-title-container {
}
.tab-title {
}
.tab-body-container {
  display: flex;
  height: 100%;
}
.tab {
  float: left;
  width: 50px;
  height: 100%;
  background-color: #f1f1f1;
  border-right: 1px solid darkgrey;
}
.tab button {
  display: block;
  color: black;
  padding: 22px 13px;
  width: 100%;
  border: none;
  outline: none;
  text-align: left;
  cursor: default;
  transition: 0.3s;
  font-size: 20px;
  border-bottom: 1px solid darkgrey;
}
.tab button:hover:not(.tab-active) {
  background-color: #ddd;
  cursor: pointer;
}
.tab-active {
  background-color: #bbbbbb;
}
.tab-content {
  flex-grow: 1;
  float: left;
  height: 100%;
  width: 100%;
  padding: 0px 30px 0px 30px;
}
.side-panel input[type='text'] {
  background: white;
  width: 100%;
  padding: 6px;
  border: 0px;
}
.side-panel input[type='datetime-local'] {
  background: white;
  width: 100%;
  border: 0px;
  padding: 6px;
}
.side-panel input[type='checkbox'] {
  border: 0px;
  width: 16px;
  height: 16px;
}
.fa-pexels:before {
  content: 'P';
}
@media only screen and (min-width: 768px) {
  .tab-content {
    height: 100vh;
    padding: 0px 30px 0px 30px;
  }
  .tab {
    height: 100vh;
  }
}
      `
    );
  },
};
