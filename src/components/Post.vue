<template>
  <div class="Post">
    <h2>
      {{ this.userStore.userData.Organization ? this.userStore.userData.Organization + ' # ' : ''
      }}{{ this.userStore.userData.FirstName }}
    </h2>
    <!-- <h2>Rapid Marketing AI</h2> -->

    <b>Title</b>
    <input v-model="postTitle" type="text" name="postTitle" placeholder="Title..." /><br /><br />

    <b>Body text</b>
    <textarea v-model="postBody" rows="2" name="postBody" placeholder="Body text..."></textarea><br /><br />

    <b>Link</b>
    <input v-model="postLink" type="text" name="postLink" placeholder="Link..." /><br /><br />

    <b>Link description</b>
    <input v-model="postLinkDesc" type="text" name="postLinkDesc" placeholder="Link description..." /><br /><br />

    <b>Hashtags</b>
    <input v-model="postHashtags" type="text" name="postHashtags" placeholder="Hashtags..." /><br />

    <img v-if="this.userStore.imagePath" :src="this.userStore.imagePath" alt="random-image" /><br />

    <input type="file" name="filename" @change="previewFiles" /><br /><br />

    <button type="button" @click.prevent="socialMediaPost()">Post</button><br /><br />
  </div>
</template>

<script>
export default {
  name: 'Post',

  data() {
    return {
      postTitle: '',
      postLink: '',
      postLinkDesc: '',
      postHashtags: '',
      postBody: '',
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    async socialMediaPost() {
      let confirmPostText = 'Are you sure you would like to post?\nClick OK or Cancel.';
      if (confirm(confirmPostText) == true) {
        try {
          const response = await fetch(servrURL + this.userStore.endPts.post, {
            method: 'POST',
            headers: {
              Authorization: this.userStore.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Title: this.postTitle,
              Link: this.postLink,
              LinkDesc: this.postLinkDesc,
              Hashtags: this.postHashtags,
              Body: this.postBody,
              ImagePath: this.userStore.imagePath,
            }),
          });
          const socialMediaPostJSON = await response.json();
          // if (socialMediaPostJSON.success) {
          console.log(socialMediaPostJSON);
          this.userStore.message = socialMediaPostJSON.messages[0];
          this.userStore.newPostTimestamp = Date.now();
          // }
        } catch (error) {
          this.userStore.message = error.toString();
        }
      }
    },

    previewFiles(event) {
      console.log(event.target.files);
    },
  },

  created() {
    this.postTitle = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`RapidMarketingAI-mostRecentSearch`).slice(1)
      : '';
    this.postBody = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`RapidMarketingAI-mostRecentSearch`).slice(1)
      : '';
    this.postLink = this.userStore.userData ? this.userStore.userData.Website : '';
    this.postLinkDesc = this.userStore.userData ? 'This is a link to ' + this.userStore.userData.Organization : '';
    this.postHashtags = this.userStore.userData
      ? `#${this.userStore.userData.Tag1} #${this.userStore.userData.Tag2} #${this.userStore.userData.Tag3}`
      : '';
  },
};
</script>

<style>
.Post {
  /* padding: 0px 0px; */
}

.Post textarea {
  width: 100%;
  padding-left: 5px;
  background: #f1f1f1;
  border: 1px solid black;
  padding: 6px;
}

.Post input[type='text'] {
  width: 100%;
  padding-left: 5px;
  background: #f1f1f1;
  border: 1px solid black;
  padding: 6px;
  /* border-radius: 4px; */
  /* border: none; */
}

.Post input[type='file'] {
  width: 100%;
  background: #f1f1f1;
  padding: 6px;
  border: 1px solid black;
}

/* .centerSpan {
  margin-left: 38%;
} */

.Post button {
  width: 100%;
  padding: 6px;
  border: 1px solid black;
}

.Post img {
  width: 100%;
}

@media only screen and (min-width: 768px) {
  .Post img {
    outline: 8px solid white;
    outline-offset: -8px;
  }

  .Post {
    /* padding: 0px 10px; */
  }
}
</style>
