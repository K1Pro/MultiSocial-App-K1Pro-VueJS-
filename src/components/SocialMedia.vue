<template>
  <div class="side-panel">
    <div class="tab-title-container">
      <div class="tab-title"></div>
    </div>

    <div class="tab-body-container">
      <div class="tab">
        <button
          title="Home"
          class="fa fa-home"
          :class="{ 'tab-active': chosenSocialMedia == 'home' }"
          @click="openTab"
        ></button>
        <button
          v-for="smParam in socialMediaParams"
          :title="
            smParam.website.charAt(0).toUpperCase() + smParam.website.slice(1)
          "
          :class="[
            ['fab fa-'] + smParam.website.toLowerCase(),
            {
              'tab-active': chosenSocialMedia == smParam.website.toLowerCase(),
            },
          ]"
          @click="openTab"
        ></button>
        <button
          title="Log out"
          class="fa fa-sign-out"
          :class="{ 'tab-active': chosenSocialMedia == 'logout' }"
          @click="openTab"
        ></button>
      </div>

      <div class="tab-content" v-if="chosenSocialMedia == 'home'">
        <post></post>
      </div>

      <div class="tab-content" v-if="chosenSocialMedia == 'sign-out'">
        <accountinfo></accountinfo>
        <logoutbtn>></logoutbtn>
      </div>

      <div
        class="tab-content"
        v-if="chosenSocialMedia != 'home' && chosenSocialMedia != 'sign-out'"
      >
        <h2>
          <input
            type="checkbox"
            id="active"
            :checked="
              this.userStore.userData.SMParams?.[chosenSocialMedia]?.[
                'active'
              ] == '1' ||
              this.userStore.userData.SMParams?.[chosenSocialMedia]?.[
                'active'
              ] === true
                ? true
                : null
            "
            @click="patchSocialMedia"
          />
          {{ chosenSocialMedia.charAt(0).toUpperCase()
          }}{{ chosenSocialMedia.slice(1) }}
        </h2>

        <div
          v-for="selectedWebsite in Object.values(socialMediaParams).filter(
            (smParam) => {
              return smParam.website == chosenSocialMedia;
            }
          )"
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
              :value="
                this.userStore.userData.SMParams?.[chosenSocialMedia]?.[smKey]
              "
              @change="patchSocialMedia"
            /><br /><br />
          </div>
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

  data() {
    return {
      socialMediaParams: '',
      chosenSocialMedia: 'home',
      active: false,
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    openTab(event) {
      const selectedTab = event.target.classList.value.substring(
        event.target.classList.value.indexOf('fa-') + 3
      );
      if (!this.userStore.userData.SMParams?.[selectedTab]) {
        const mergedObj = Object.assign(
          { [selectedTab]: '' },
          this.userStore.userData.SMParams
        );
        this.userStore.userData.SMParams = mergedObj;
      }
      this.chosenSocialMedia = selectedTab;
    },

    async patchSocialMedia(event) {
      // This checks if the social media groups properties exists already, if not it is created, ex: SMParams.facebook.App_ID; otherise key is modified
      if (!this.userStore.userData.SMParams[this.chosenSocialMedia]) {
        // key is created
        event.target.type == 'checkbox'
          ? (this.userStore.userData.SMParams[this.chosenSocialMedia] = {
              [event.target.id]: event.target.checked,
            })
          : (this.userStore.userData.SMParams[this.chosenSocialMedia] = {
              [event.target.id]: event.target.value,
            });
      } else {
        // key is modified
        event.target.type == 'checkbox'
          ? (this.userStore.userData.SMParams[this.chosenSocialMedia][
              event.target.id
            ] = event.target.checked)
          : (this.userStore.userData.SMParams[this.chosenSocialMedia][
              event.target.id
            ] = event.target.value);
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
              website: this.chosenSocialMedia,
              [event.target.id]: inputValue,
            }),
          }
        );
        const patchSocialMediaJSON = await response.json();
        if (patchSocialMediaJSON.success) {
          this.userStore.message = patchSocialMediaJSON.messages[0];
        }
        console.log(patchSocialMediaJSON);
      } catch (error) {
        this.error = error.toString();
        this.userStore.message = this.error;
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
        this.error = error.toString();
      }
    },
  },

  created() {
    this.getSocialMediaParams();
  },
};
</script>

<style>
.tab-body-container {
  display: flex;
  height: 100%;
}

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

/* .fa:hover {
  opacity: 0.7;
} */

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

/* .fab:hover {
  opacity: 0.7;
} */

.fa-pexels:before {
  content: 'P';
}

/* .fa-sign-out {
  background: #8400ff;
  color: white;
} */

.tab {
  box-sizing: border-box;
  float: left;
  width: 50px;
  height: 100%;
  background-color: #f1f1f1;
}

.tab button {
  display: block;
  color: black;
  padding: 22px 13px;
  width: 100%;
  border: none;
  outline: none;
  text-align: left;
  cursor: pointer;
  transition: 0.3s;
  font-size: 20px;
}

.tab button:hover {
  background-color: #ddd;
}

.tab-active {
  background-color: #bbbbbb;
}

.tab-content {
  box-sizing: border-box;
  flex-grow: 1;
  float: left;
  height: 100%;
  overflow-y: scroll;
  width: calc(100% - 50px);
  padding: 0px 30px;
}

.side-panel input[type='text'] {
  width: 100%;
  background: white;
  border: 0px;
  padding: 6px;
}

.side-panel input[type='datetime-local'] {
  width: 100%;
  background: white;
  border: 0px;
  padding: 6px;
}

.side-panel input[type='checkbox'] {
  border: 0px;
  width: 16px;
  height: 16px;
}

@media only screen and (min-width: 768px) {
  .tab-content {
    height: 100vh;
  }

  .tab {
    height: 100vh;
  }

  /* .side-panel input[type='text'] {
    width: 105%;
  }

  .side-panel input[type='datetime-local'] {
    width: 105%;
  } */
}
</style>
