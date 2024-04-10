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

      <i v-if="sidePanelOpen" class="fa-solid fa-chevron-left" @click="toggleSidePanel" style="left: 239px" ></i>
      <i v-else class="fa-solid fa-chevron-right" @click="toggleSidePanel" style="left: 39px" ></i>
      <div class="tab-body-container">
        <div class="tab" 
          :style="{
            width: sidePanelOpen ? '250px' : '50px', 
            'margin-right': sidePanelOpen ? '-200px' : '0px', 
          }">
          <button
            title="Home"
            :class="{ 'tab-active': activeTab == 'home' }"
            class="fa fa-home"
            @click="openTab">
            <span v-if="sidePanelOpen">
              Home
            </span>
          </button>
          <button
            v-for="smParam in socialMediaParams"
            :title="
              smParam.website?.charAt(0).toUpperCase() + smParam.website?.slice(1)
            "
            :class="[
              {'tab-active': activeTab == smParam.website.toLowerCase(),},
              ['fab fa-'] + smParam.website.toLowerCase(),
            ]"
            @click="openTab">
              <span v-if="sidePanelOpen">
                {{ smParam.website?.charAt(0).toUpperCase() + smParam.website?.slice(1) }}
              </span>
            </button>
          <button
            title="Log out"
            :class="{ 'tab-active': activeTab == 'logout' }"
            class="fa fa-sign-out"
            @click="openTab">
            <span v-if="sidePanelOpen">
              Log out
            </span>
          </button>
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
            {{ activeTab?.charAt(0).toUpperCase() }}{{ activeTab?.slice(1) }}
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
      sidePanelOpen: false,
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    openTab(event) {
      const selectedTab =
        event.srcElement.localName == 'button'
          ? event.target.className.split('fa-')[1].trim()
          : event.target.innerHTML.toLowerCase().trim();
      if (selectedTab != this.activeTab) {
        console.log(selectedTab);
        this.sidePanelOpen = false;
        // event.target.style.backgroundColor = '#bbbbbb';
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

    toggleSidePanel() {
      this.sidePanelOpen = !this.sidePanelOpen;
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

  watch: {
    windowWidth() {
      this.sidePanelOpen = false;
    },
  },

  created() {
    this.getSocialMediaParams();
  },

  mounted() {
    style(
      'SocialMedia',
      /*css*/ `
.side-panel i {
  position: absolute;
  z-index: 4;
  top: 54px;
  font-size: 10px;
  padding: 6px 8px 6px 8px;
  border-radius: 50%;
  color: white;
  background-color: black;
  cursor: pointer;
  z-index: 4;
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
.tab-title-container {
}
.tab-title {
}
.tab-body-container {
  height: 100%;
}
.tab {
  position: relative;
  z-index: 3;
  float: left;
  height: 100%;
  background-color: #f1f1f1;
  border-right: 1px solid darkgrey;
}
.tab button {
  display: block;
  color: black;
  padding: 22px 13px;
  border: none;
  outline: none;
  text-align: left;
  cursor: default;
  transition: 0.3s;
  font-size: 20px;
  width: 100%;
  // border-bottom: 1px solid darkgrey;
}
.tab span {
  font-size: 16px;
  font-weight: normal;
  font-family: 'Helvetica', sans-serif;
  padding-left: 10px;
}
.tab button:hover:not(.tab-active) {
  background-color: #ddd;
  cursor: pointer;
}
.tab-active {
  background-color: #bbbbbb;
}
.tab-content {
  position: relative;
  float: left;
  height: 100%;
  width: calc(100% - 50px);
  padding: 0px 30px 0px 30px;
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
