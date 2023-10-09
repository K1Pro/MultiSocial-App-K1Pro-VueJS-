//<script>
import Post from './Post_vue.js';
import Accountinfo from './AccountInfo_vue.js';
import Logoutbtn from './LogOutBtn_vue.js';

export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="socialmedia">
      <div class="tab">
        <a :class="{active: chosenSocialMedia == 'home'}" class="tablinks fa fa-home" @click="openTab"></a>
        <a :class="['tablinks fab fa-'] + smParam.website.toLowerCase()" v-for="smParam in socialMediaParams" @click="openTab"></a>
        <a :class="{active: chosenSocialMedia == 'logout'}" class="tablinks fa fa-sign-out" @click="openTab"></a>
      </div>

      <div class="tabcontent" v-if="chosenSocialMedia == 'home'">
        <post :accessToken="accessToken" :userData="userData" @post-msg="updateSnackbar"></post>
      </div>

      <div class="tabcontent" v-if="chosenSocialMedia == 'sign-out'">
        <accountinfo :userData="userData"></accountinfo>
        <logoutbtn :accessToken="accessToken" :sessionID="sessionID" @logout="updateAccessToken" @logout-msg="updateSnackbar">></logoutbtn>
      </div>

      <div class="tabcontent" v-if="chosenSocialMedia != 'home' && chosenSocialMedia != 'sign-out'">
        <h2><input type="checkbox" id="active" v-model="active" @click="patchSocialMedia"/>{{ chosenSocialMedia.charAt(0).toUpperCase() }}{{ chosenSocialMedia.slice(1) }}</h2>
        
        <div v-for="selectedWebsite in Object.values(socialMediaParams).filter(smParam => {return smParam.website == chosenSocialMedia})">
          <div v-for="smKey in Object.values(selectedWebsite).filter(smValue => {return smValue != chosenSocialMedia})">
            <b>{{smKey.replaceAll('_', ' ')}}</b>
            <input :type="smKey.includes('Expiry') ? 'datetime-local' : 'text'" :id="smKey" v-model="smSchema[smKey]" @change="patchSocialMedia"><br><br>
          </div>
        </div>
        
      </div>
    </div>
  `,

  components: { Post, Accountinfo, Logoutbtn },

  props: ['accessToken', 'sessionID', 'userData'],

  emits: ['socialmedia-msg', 'logout'],

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
        API_Key: '',
        API_Key_Secret: '',
        Bearer_Token: '',
        Client_ID: '',
        Client_Secret: '',
        Page_ID: '',
        URN: '',
      },
    };
  },

  methods: {
    openTab(event) {
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
          this.smSchema.API_Key = SMData.API_Key;
          this.smSchema.API_Key_Secret = SMData.API_Key_Secret;
          this.smSchema.Bearer_Token = SMData.Bearer_Token;
          this.smSchema.Client_ID = SMData.Client_ID;
          this.smSchema.Client_Secret = SMData.Client_Secret;
          this.smSchema.Page_ID = SMData.Page_ID;
          this.smSchema.URN = SMData.URN;
        } else {
          this.active = false;
          this.smSchema.Access_Token = '';
          this.smSchema.Access_Token_Expiry = '';
          this.smSchema.Access_Token_Secret = '';
          this.smSchema.App_ID = '';
          this.smSchema.API_Key = '';
          this.smSchema.API_Key_Secret = '';
          this.smSchema.Bearer_Token = '';
          this.smSchema.Client_ID = '';
          this.smSchema.Client_Secret = '';
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

    updateAccessToken(accessToken, sessionID) {
      this.$emit('logout', accessToken, sessionID);
    },
  },

  created() {
    this.getSocialMediaParams();
    // this.getSocialMedia(this.chosenSocialMedia);
  },
};
// </script>
