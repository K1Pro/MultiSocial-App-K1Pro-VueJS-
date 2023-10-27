<template>
  <div class="Post">
    <h2>
      {{ this.userStore.userData.Organization ? this.userStore.userData.Organization + ' # ' : ''
      }}{{ this.userStore.userData.FirstName }}
    </h2>
    <!-- <h2>Rapid Marketing AI</h2> -->

    <b>Title | Body text</b>
    <input v-model="postTitle" type="text" name="postTitle" placeholder="Title..." style="border-bottom: none" /><br />
    <textarea v-model="postBody" rows="6" name="postBody" placeholder="Body text..." style="border-top: none"></textarea
    ><br />
    <button type="button" @click.prevent="generateText()">Generate Text</button><br /><br />

    <b>Link | Description | Tags</b>
    <input v-model="postLink" type="text" name="postLink" placeholder="Link..." style="border-bottom: none" /><br />
    <input
      v-model="postLinkDesc"
      type="text"
      name="postLinkDesc"
      placeholder="Link description..."
      style="border-top: none; border-bottom: none"
    /><br />
    <input
      v-model="postHashtags"
      type="text"
      name="postHashtags"
      placeholder="Hashtags..."
      style="border-top: none"
    /><br /><br />

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
    async generateText() {
      const keyWordsArray = this.postTitle.split(/[\s-_]+|(?=[A-Z])/);
      const uniqueKeyWords = [...new Set(keyWordsArray)];
      const uniKeyWordsNoArtsPreps = uniqueKeyWords.filter((keyWords) => {
        return !artsPreps.has(keyWords.toLowerCase());
      });
      const generatedBodyText = [];

      for (const keyWords of uniKeyWordsNoArtsPreps) {
        try {
          const response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + keyWords, {
            method: 'GET',
          });
          const generateTextJSON = await response.json();
          if (generateTextJSON[0].meanings[0].definitions[0].definition) {
            generatedBodyText.push(generateTextJSON[0].meanings[0].definitions[0].definition);
          }
        } catch (error) {
          console.log(error);
          // this.userStore.message = error.toString();
        }
      }

      this.postBody = generatedBodyText.join(' ');
    },

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
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e) => {
        console.log(e.target.result);
        this.userStore.imagePath = e.target.result;
      };
    },

    savePostTitle() {
      localStorage.setItem(`RapidMarketingAI-mostRecentTitle`, this.postTitle);
    },

    savePostBody() {
      localStorage.setItem(`RapidMarketingAI-mostRecentBody`, this.postTitle);
    },
  },

  watch: {
    postTitle(newTitle) {
      localStorage.setItem(`RapidMarketingAI-mostRecentTitle`, newTitle);
    },

    postBody(newBody) {
      localStorage.setItem(`RapidMarketingAI-mostRecentBody`, newBody);
    },
  },

  created() {
    this.postTitle = localStorage.getItem(`RapidMarketingAI-mostRecentTitle`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentTitle`)
      : this.userStore.userData.Tag1;
    this.postBody = localStorage.getItem(`RapidMarketingAI-mostRecentBody`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentBody`)
      : 'This post is about the following topic: ' + this.userStore.userData.Tag1;
    this.postLink = this.userStore.userData ? this.userStore.userData.Website : '';
    this.postLinkDesc = this.userStore.userData ? 'This is a link to ' + this.userStore.userData.Organization : '';
    this.postHashtags = this.userStore.userData
      ? `#${this.userStore.userData.Tag1} #${this.userStore.userData.Tag2} #${this.userStore.userData.Tag3}`
      : '';
  },
};
</script>

<style>
.Post textarea {
  width: 100%;
  padding-left: 5px;
  background: white;
  border: 0px;
  /* border: 1px solid black; */
  padding: 6px;
  resize: none;
}

.Post input[type='file'] {
  width: 100%;
  background: white;
  padding: 6px;
  border: 1px solid black;
}

.Post button {
  width: 100%;
  padding: 6px;
  border: 0px;
  background-color: #f1f1f1;
  color: black;
  font-size: 16px;
  font-weight: bold;
}

.Post img {
  width: 100%;
}

@media only screen and (min-width: 768px) {
  .Post img {
    outline: 1px solid black;
    outline-offset: -1px;
  }

  .Post textarea {
    width: 105%;
  }

  .Post input[type='file'] {
    width: 105%;
  }

  .Post button {
    width: 105%;
  }

  .Post img {
    width: 105%;
  }
}
</style>
