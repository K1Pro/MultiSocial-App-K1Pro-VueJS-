//<script>
// <post :accessToken="accessToken" @post-msg="updateSnackbar"></post>
// <button class="btn tablinks" :class="{active: chosenSocialMedia == 'Home'}" @click="openTab"><i class="fa fa-home"></i></button>
// {{ smParam.website }}
// <a :class="{active: chosenSocialMedia == smParam.website}"
import Post from './Post_vue.js';

export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="socialmedia">
      <div class="tab">
        
        <a :class="{active: chosenSocialMedia == 'home'}" class="btn tablinks fa fa-home" @click="openTab"></a>
        <a :class="['btn tablinks fab fa-'] + smParam.website.toLowerCase()" v-for="smParam in socialMediaParams" @click="openTab"></a>
        <a :class="{active: chosenSocialMedia == 'logout'}" class="btn tablinks fa fa-sign-out" @click="openTab"></a>
      </div>

      <div class="tabcontent" v-if="chosenSocialMedia == 'home'">
        <post :accessToken="accessToken"></post>
      </div>

      <div class="tabcontent" v-if="chosenSocialMedia != 'home'">
        <h2><input type="checkbox" id="active" v-model="active" @click="patchSocialMedia"/>{{ chosenSocialMedia.charAt(0).toUpperCase() }}{{ chosenSocialMedia.slice(1) }}</h2>
        
        <div v-for="selectedWebsite in Object.values(socialMediaParams).filter(smParam => {return smParam.website == chosenSocialMedia})">
          <div v-for="smKey in Object.values(selectedWebsite).filter(smValue => {return smValue != chosenSocialMedia})">
            <b>{{smKey}}</b>
            <input type="text" :id="smKey" v-model="smSchema[smKey]" @change="patchSocialMedia"><br><br>
          </div>
        </div>
      </div>
    </div>
  `,

  components: { Post },

  props: ['accessToken'],

  emits: ['socialmedia-msg'],

  data() {
    return {
      socialMediaParams: '',
      chosenSocialMedia: 'home',
      active: false,
      smSchema: {
        accesstoken: '',
        accesstokenexpiry: '',
        accesstokensecret: '',
        appid: '',
        apikey: '',
        apikeysecret: '',
        bearertoken: '',
        clientid: '',
        clientsecret: '',
        urn: '',
      },
    };
  },

  methods: {
    openTab(event) {
      const selectedTab = event.target.classList.value.substring(event.target.classList.value.indexOf('fa-') + 3);
      // const firstLetter = selectedTab.charAt(0);
      // const firstLetterCap = firstLetter.toUpperCase();
      // const remainingLetters = selectedTab.slice(1);
      // const selectedTabCap = firstLetterCap + remainingLetters;

      console.log(selectedTab);
      this.chosenSocialMedia = selectedTab;
      if (selectedTab != 'home') {
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
          this.smSchema.accesstoken = SMData.accesstoken;
          this.smSchema.accesstokenexpiry = SMData.accesstokenexpiry;
          this.smSchema.accesstokensecret = SMData.accesstokensecret;
          this.smSchema.appid = SMData.appid;
          this.smSchema.apikey = SMData.apikey;
          this.smSchema.apikeysecret = SMData.apikeysecret;
          this.smSchema.bearertoken = SMData.bearertoken;
          this.smSchema.clientid = SMData.clientid;
          this.smSchema.clientsecret = SMData.clientsecret;
          this.smSchema.urn = SMData.urn;
        } else {
          this.active = false;
          this.smSchema.accesstoken = '';
          this.smSchema.accesstokenexpiry = '';
          this.smSchema.accesstokensecret = '';
          this.smSchema.appid = '';
          this.smSchema.apikey = SMData.apikey;
          this.smSchema.apikeysecret = '';
          this.smSchema.bearertoken = '';
          this.smSchema.clientid = '';
          this.smSchema.clientsecret = '';
          this.smSchema.urn = '';
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
        if (SocialMediaParamsJSON.success) {
          console.log(SocialMediaParamsJSON);
          this.socialMediaParams = SocialMediaParamsJSON.data.sm_params;
        }
      } catch (error) {
        this.error = error.toString();
      }
    },
  },

  created() {
    this.getSocialMediaParams();
    // this.getSocialMedia(this.chosenSocialMedia);
  },
};
// </script>
