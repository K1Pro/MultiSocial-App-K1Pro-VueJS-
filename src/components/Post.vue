<template>
  <div class="Post">
    <h2>
      {{ this.userStore.userData.Organization ? this.userStore.userData.Organization + ' # ' : ''
      }}{{ this.userStore.userData.FirstName }}
    </h2>

    <b>Title | Body text</b>
    <input
      type="text"
      name="postTitle"
      placeholder="Title..."
      v-model="this.userStore.userData.PostTitle"
      @change="this.userStore.patchUserData"
    />
    <textarea
      id="PostBody"
      rows="6"
      name="PostBody"
      placeholder="Body text..."
      v-model="this.userStore.userData.PostBody"
      @change="this.userStore.patchUserData"
    ></textarea>
    <button type="button" @click.prevent="generateText()">Generate Text</button><br /><br />

    <b>Link | Description | Tags</b>
    <input
      type="text"
      name="Website"
      placeholder="Link..."
      v-model="this.userStore.userData.Website"
      @change="this.userStore.patchUserData"
    />
    <input v-model="postLinkDesc" type="text" name="postLinkDesc" placeholder="Link description..." />
    <input v-model="postHashtags" type="text" name="postHashtags" placeholder="Hashtags..." />

    <img
      v-if="this.userStore.userData.MostRecentPhoto"
      :src="this.userStore.userData.MostRecentPhoto"
      alt="random-image"
    />

    <input type="file" name="filename" @change="uploadImage" /><br /><br />

    <button type="button" @click.prevent="socialMediaPost()">Post</button><br /><br />
  </div>
</template>

<script>
export default {
  name: 'Post',

  data() {
    return {
      postLink: '',
      postLinkDesc: '',
      postHashtags: '',
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    async generateText() {
      const keyWordsArray = this.userStore.userData.PostTitle.split(/[\s-_]+|(?=[A-Z])/);
      const uniqueKeyWords = [...new Set(keyWordsArray)];

      // Create an array of previously generated text
      const prevGeneratedTextArray = [];
      Object.keys(this.userStore.userData.GeneratedText).forEach((prevGeneratedText) => {
        prevGeneratedTextArray.push(prevGeneratedText);
      });
      const prevGeneratedTextString = prevGeneratedTextArray.join(' ');

      // Filter out previously generated text and new text that will be generated
      const newFilteredGeneratedText = [];
      const prevGeneratedTextFinalArray = [];
      uniqueKeyWords.forEach((uniqueKeyWord) => {
        if (!prevGeneratedTextString.includes(uniqueKeyWord.toLowerCase())) {
          newFilteredGeneratedText.push(uniqueKeyWord.toLowerCase());
        } else {
          if (this.userStore.userData.GeneratedText[uniqueKeyWord.toLowerCase()]) {
            prevGeneratedTextFinalArray.push(
              this.userStore.userData.GeneratedText[uniqueKeyWord.toLowerCase()].meanings[0].definitions[0].definition
            );
          }
        }
      });
      const newFilteredGeneratedString = newFilteredGeneratedText.join(' ');
      const prevGeneratedTextFinalString = prevGeneratedTextFinalArray.join(' ');

      // insert previously generated text into body
      const generatedBodyText = [];
      generatedBodyText.push(prevGeneratedTextFinalString);

      if (newFilteredGeneratedString) {
        try {
          const generatedTextResponse = await fetch(servrURL + this.userStore.endPts.generatedText, {
            method: 'POST',
            headers: {
              Authorization: this.userStore.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Keyword: newFilteredGeneratedString,
            }),
          });
          const postGenerateTextJSON = await generatedTextResponse.json();
          if (postGenerateTextJSON.success) {
            postGenerateTextJSON.data.generated_text.forEach((generatedText) => {
              generatedBodyText.push(generatedText.meanings[0].definitions[0].definition);
              this.userStore.userData.GeneratedText[generatedText.word] = generatedText;
            });
          }
          this.userStore.message = postGenerateTextJSON.messages[0];
        } catch (error) {
          this.userStore.message = error.toString();
        }
        if (this.userStore.userData.PostBody) {
          setTimeout(() => {
            PostBody.dispatchEvent(new Event('change'));
          }, 10);
        }
      } else {
        // In the future we can add randomness when generating text without changing keywords
        this.userStore.message = 'No new generated text - Algorithm here';
      }
      this.userStore.userData.PostBody = generatedBodyText.join(' ').trim();
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
              Title: this.userStore.userData.PostTitle,
              Link: this.userStore.userData.Website,
              LinkDesc: this.postLinkDesc,
              Hashtags: this.postHashtags,
              Body: this.userStore.userData.PostBody,
              ImagePath: this.userStore.userData.MostRecentPhoto,
            }),
          });
          const socialMediaPostJSON = await response.json();
          console.log(socialMediaPostJSON);
          this.userStore.message = socialMediaPostJSON.messages[0];
          if (socialMediaPostJSON.data.sm_responses) {
            socialMediaPostJSON.data.sm_responses.forEach((sm_response) => {
              this.userStore.userData.SMPosts.unshift(sm_response);
            });
          }
        } catch (error) {
          this.userStore.message = error.toString();
        }
      }
    },

    async uploadImage(event) {
      let files = event.target.files[0];
      let formData = new FormData();
      formData.append('sample_image', files);

      // const reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]);
      // reader.onload = (e) => {
      //   this.userStore.userData.MostRecentPhoto = e.target.result;
      // };

      try {
        const response = await fetch(servrURL + this.userStore.endPts.uploadImage, {
          method: 'POST',
          headers: {
            Authorization: this.userStore.accessToken,
            'Cache-Control': 'no-store',
          },
          body: formData,
        });
        const uploadImageJSON = await response.json();
        if (uploadImageJSON.success) {
          this.userStore.message = uploadImageJSON.messages[0];
          this.userStore.userData.MostRecentPhoto = servrURL + 'images/upload.jpg';
        }
      } catch (error) {
        this.error = error.toString();
        this.userStore.message = this.error;
      }
    },
  },

  created() {
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
  margin-bottom: -4px;
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
  margin-bottom: -3px;
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
