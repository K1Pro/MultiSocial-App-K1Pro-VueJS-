//<script>
export default {
  name: 'SocialMedia',

  template: /*html*/ `
    <div class="tab" :style="[chosenSocialMedia ? {'width': '30%'} : {'width': '100%'}]">
      <button v-for="(smParam, key) in socialMediaParams" class="tablinks" :class="{active: chosenSocialMedia == smParam.website}" @click="openSocialMedia">{{ smParam.website }}</button>
    </div>

    <div class="tabcontent" :style="[chosenSocialMedia ? {'width': '70%'} : {'width': '0%'}]">
      <h2>{{ chosenSocialMedia }}<input type="checkbox" id="active" v-if="chosenSocialMedia" v-model="active" @click="patchSocialMedia"/></h2>
      
      <div v-for="selectedWebsite in Object.values(socialMediaParams).filter(smParam => {return smParam.website == chosenSocialMedia})">
        <div v-for="smKey in Object.values(selectedWebsite).filter(smValue => {return smValue != chosenSocialMedia})">
          <b>{{smKey}}</b>
          <input type="text" :id="smKey" v-model="smSchema[smKey]" @change="patchSocialMedia"><br><br>
        </div>
      </div>
    </div>
  `,

  props: ['accessToken'],

  emits: ['socialmedia-msg', 'chosen-social-media'],

  data() {
    return {
      socialMediaParams: '',
      chosenSocialMedia: '',
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
    openSocialMedia(event) {
      this.chosenSocialMedia = event.target.innerHTML;
      this.getSocialMedia(event.target.innerHTML);
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
          this.$emit('chosen-social-media', this.chosenSocialMedia);
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
          this.$emit('chosen-social-media', this.chosenSocialMedia);
        }
      } catch (error) {
        this.error = error.toString();
        this.$emit('chosen-social-media', this.chosenSocialMedia);
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
