<template>
  <div class="socialmedia">
    <div class="tab">
      <a :class="{ active: chosenSocialMedia == 'home' }" class="tablinks fa fa-home" @click="openTab"></a>
      <a
        :class="['tablinks fab fa-'] + smParam.website.toLowerCase()"
        v-for="smParam in socialMediaParams"
        @click="openTab"
      ></a>
      <a :class="{ active: chosenSocialMedia == 'logout' }" class="tablinks fa fa-sign-out" @click="openTab"></a>
    </div>

    <div class="tabcontent" v-if="chosenSocialMedia == 'home'">
      <post :accessToken="accessToken" @post-msg="updateSnackbar" @posted="updatePosted"></post>
    </div>

    <div class="tabcontent" v-if="chosenSocialMedia == 'sign-out'">
      <accountinfo></accountinfo>
      <logoutbtn
        :accessToken="accessToken"
        :sessionID="sessionID"
        @logout="updateAccessToken"
        @logout-msg="updateSnackbar"
        >></logoutbtn
      >
    </div>

    <div class="tabcontent" v-if="chosenSocialMedia != 'home' && chosenSocialMedia != 'sign-out'">
      <h2>
        <input type="checkbox" id="active" v-model="active" @click="patchSocialMedia" />{{
          chosenSocialMedia.charAt(0).toUpperCase()
        }}{{ chosenSocialMedia.slice(1) }}
      </h2>

      <div
        v-for="selectedWebsite in Object.values(socialMediaParams).filter((smParam) => {
          return smParam.website == chosenSocialMedia;
        })"
      >
        <div
          v-for="smKey in Object.values(selectedWebsite).filter((smValue) => {
            return smValue != chosenSocialMedia;
          })"
        >
          <b>{{ smKey.replaceAll('_', ' ') }}</b>
          <input
            :type="smKey.includes('Expiry') ? 'datetime-local' : 'text'"
            :id="smKey"
            v-model="smSchema[smKey]"
            @change="patchSocialMedia"
          /><br /><br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from './Post.vue';
import Accountinfo from './AccountInfo.vue';
import Logoutbtn from './LogOutBtn.vue';

export default {
  name: 'SocialMedia',

  components: { Post, Accountinfo, Logoutbtn },

  props: ['accessToken', 'sessionID'],

  emits: ['socialmedia-msg', 'logout', 'posted'],

  data() {
    return {
      socialMediaParams: '',
      chosenSocialMedia: 'home',
      active: false,
      smSchema: {
        Access_Token: '',
        Access_Token_Expiry: '',
        Access_Token_Secret: '',
        App_ID: '',
        App_Secret: '',
        API_Key: '',
        API_Key_Secret: '',
        Bearer_Token: '',
        Client_ID: '',
        Client_Secret: '',
        IG_User_ID: '',
        Page_ID: '',
        URN: '',
      },
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    openTab(event) {
      console.log(this.userStore.userDataPinia.AccountType);
      this.userStore.isOpen = !this.userStore.isOpen;
      console.log(this.userStore.isOpen);
      const selectedTab = event.target.classList.value.substring(event.target.classList.value.indexOf('fa-') + 3);
      this.chosenSocialMedia = selectedTab;
      if (selectedTab != 'home' && selectedTab != 'sign-out') {
        this.getSocialMedia(selectedTab);
      }
    },

    async patchSocialMedia(event) {
      const inputValue = event.target.type == 'checkbox' ? `${event.target.checked}` : event.target.value;
      try {
        const response = await fetch(servrURL + 'controller/socialmedia.php', {
          method: 'PATCH',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            website: this.chosenSocialMedia,
            [event.target.id]: inputValue,
          }),
        });
        const patchSocialMediaJSON = await response.json();
        if (patchSocialMediaJSON.success) {
          this.$emit('socialmedia-msg', patchSocialMediaJSON.messages[0]);
        }
      } catch (error) {
        this.error = error.toString();
        this.$emit('socialmedia-msg', this.error);
      }
    },

    async getSocialMedia(endPt) {
      try {
        const response = await fetch(servrURL + 'controller/socialmedia.php?smwebsite=' + endPt, {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        });
        const getSocialMediaJSON = await response.json();
        if (getSocialMediaJSON.success) {
          const SMData = getSocialMediaJSON.data.sm_group;
          this.active = SMData.active;
          this.smSchema.Access_Token = SMData.Access_Token;
          this.smSchema.Access_Token_Expiry = SMData.Access_Token_Expiry;
          this.smSchema.Access_Token_Secret = SMData.Access_Token_Secret;
          this.smSchema.App_ID = SMData.App_ID;
          this.smSchema.App_Secret = SMData.App_Secret;
          this.smSchema.API_Key = SMData.API_Key;
          this.smSchema.API_Key_Secret = SMData.API_Key_Secret;
          this.smSchema.Bearer_Token = SMData.Bearer_Token;
          this.smSchema.Client_ID = SMData.Client_ID;
          this.smSchema.Client_Secret = SMData.Client_Secret;
          this.smSchema.IG_User_ID = SMData.IG_User_ID;
          this.smSchema.Page_ID = SMData.Page_ID;
          this.smSchema.URN = SMData.URN;
        } else {
          this.active = false;
          this.smSchema.Access_Token = '';
          this.smSchema.Access_Token_Expiry = '';
          this.smSchema.Access_Token_Secret = '';
          this.smSchema.App_ID = '';
          this.smSchema.App_Secret = '';
          this.smSchema.API_Key = '';
          this.smSchema.API_Key_Secret = '';
          this.smSchema.Bearer_Token = '';
          this.smSchema.Client_ID = '';
          this.smSchema.Client_Secret = '';
          this.smSchema.IG_User_ID = '';
          this.smSchema.Page_ID = '';
          this.smSchema.URN = '';
        }
      } catch (error) {
        this.error = error.toString();
      }
    },

    async getSocialMediaParams() {
      try {
        const response = await fetch(servrURL + 'controller/smparams.php', {
          method: 'GET',
        });
        const SocialMediaParamsJSON = await response.json();
        if (SocialMediaParamsJSON.success) this.socialMediaParams = SocialMediaParamsJSON.data.sm_params;
      } catch (error) {
        this.error = error.toString();
      }
    },

    updateSnackbar(message) {
      this.$emit('socialmedia-msg', message);
    },

    updatePosted(timestamp) {
      this.$emit('posted', timestamp);
    },

    updateAccessToken(accessToken, sessionID) {
      this.$emit('logout', accessToken, sessionID);
    },
  },

  created() {
    this.getSocialMediaParams();
    // this.getSocialMedia(this.chosenSocialMedia);
  },
};
</script>

<style>
.fa {
  color: black;
  /* padding: 20px; */
  /* padding: 15px 70% 15px 30%;
  font-size: 30px;
  width: 100%;
  text-align: center;
  text-decoration: none; */
  /* margin: 5px 2px; */
}

.fa:hover {
  opacity: 0.7;
}

.fab {
  color: black;
  /* padding: 20px; */
  /* padding: 15px 70% 15px 30%;
  font-size: 30px;
  width: 100%;
  text-align: center;
  text-decoration: none; */
  /* margin: 5px 2px; */
}

.fab:hover {
  opacity: 0.7;
}

.fa-pexels:before {
  content: 'P';
}

/* .fa-sign-out {
  background: #8400ff;
  color: white;
} */

/* Style the tab */
.socialmedia * {
  box-sizing: border-box;
}

.socialmedia > .tab {
  float: left;
  /* border: 1px solid #ccc; */
  background-color: #f1f1f1;
  width: 20%;
  /* height: 100%; */
}

/* Style the tab content */
.socialmedia > .tabcontent {
  float: left;
  padding: 0px 12px;
  /* border: 1px solid #ccc; */
  width: 80%;
  border-left: none;
  /* height: 100%; */
}

.socialmedia input[type='text'] {
  width: 100%;
}

.tablinks {
  padding: 15px 70% 15px 30%;
  font-size: 30px;
  width: 100%;
  text-align: center;
  text-decoration: none;
}

.socialmedia input[type='datetime-local'] {
  width: 100%;
}

@media only screen and (min-width: 768px) {
  .socialmedia > .tab {
    width: 10%;
  }

  .socialmedia > .tabcontent {
    width: 90%;
  }
}
</style>
