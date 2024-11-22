<template>
  <div class="Post">
    <h2>{{ userData.Organization ? userData.Organization + ' # ' : '' }}{{ userData.FirstName }}</h2>

    <!-- <b>Title | Body text</b> -->
    <input type="text" name="postTitle" placeholder="Title..." v-model="userData.PostTitle" @change="patchUserData" />
    <textarea name="PostBody" placeholder="Body text..." v-model="userData.PostBody" @change="patchUserData"></textarea>
    <button type="button" @click.prevent="generateText()">Generate Text</button><br /><br />

    <!-- <b>Link | Description | Tags</b> -->
    <input type="text" name="Website" placeholder="Link..." v-model="userData.Website" @change="patchUserData" />
    <input
      type="text"
      name="WebsiteDesc"
      placeholder="Link description..."
      v-model="userData.WebsiteDesc"
      @change="patchUserData"
    />
    <input type="text" name="Tags" placeholder="Hashtags..." v-model="userData.Tags" @change="patchUserData" />

    <img v-if="userData.MostRecentPhoto" alt="random-image" :src="userData.MostRecentPhoto" />

    <input type="file" name="filename" @change="uploadImage" /><br /><br />

    <button type="button" @click.prevent="socialMediaPost()">Post</button><br /><br />
  </div>
</template>

<script>
export default {
  name: 'Post',

  inject: ['userData', 'patchUserData', 'showMsg'],

  methods: {
    async generateText() {
      const keyWordsArray = this.generateText.userData.PostTitle.split(/[\s-_]+|(?=[A-Z])/);
      const uniqueKeyWords = [...new Set(keyWordsArray)];

      // Create an array of previously generated text
      const prevGeneratedTextArray = [];
      Object.keys(this.userData.GeneratedText).forEach((prevGeneratedText) => {
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
          if (this.userData.GeneratedText[uniqueKeyWord.toLowerCase()]) {
            prevGeneratedTextFinalArray.push(
              this.userData.GeneratedText[uniqueKeyWord.toLowerCase()].meanings[0].definitions[0].definition
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
          const generatedTextResponse = await fetch(app_api_url + this.endPts.generatedText, {
            method: 'POST',
            headers: {
              Authorization: access_token,
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
              this.userData.GeneratedText[generatedText.word] = generatedText;
            });
          }
          this.showMsg(postGenerateTextJSON.messages[0]);
        } catch (error) {
          this.showMsg(error.toString());
        }
      } else {
        // In the future we can add randomness when generating text without changing keywords
        this.showMsg('No new generated text - Algorithm here');
      }
      this.userData.PostBody = generatedBodyText.join(' ').trim();
      this.patchUserData(null, 'PostBody', this.userData.PostBody);
    },

    async socialMediaPost() {
      let confirmPostText = 'Are you sure you would like to post?\nClick OK or Cancel.';
      if (confirm(confirmPostText) == true) {
        try {
          const response = await fetch(app_api_url + this.endPts.post, {
            method: 'POST',
            headers: {
              Authorization: access_token,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Title: this.userData.PostTitle,
              Link: this.userData.Website,
              LinkDesc: this.userData.WebsiteDesc,
              Hashtags: this.userData.Tags,
              Body: this.userData.PostBody,
              ImagePath: this.userData.MostRecentPhoto,
            }),
          });
          const socialMediaPostJSON = await response.json();
          console.log(socialMediaPostJSON);
          this.showMsg(socialMediaPostJSON.messages[0]);
          if (socialMediaPostJSON.data.sm_responses) {
            socialMediaPostJSON.data.sm_responses.forEach((sm_response) => {
              this.userData.SMPosts.unshift(sm_response);
            });
          }
        } catch (error) {
          this.showMsg(error.toString());
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
      //   this.userData.MostRecentPhoto = e.target.result;
      // };

      try {
        const response = await fetch(app_api_url + this.endPts.uploadImage, {
          method: 'POST',
          headers: {
            Authorization: access_token,
            'Cache-Control': 'no-store',
          },
          body: formData,
        });
        const uploadImageJSON = await response.json();
        if (uploadImageJSON.success) {
          this.showMsg(uploadImageJSON.messages[0]);
          this.userData.MostRecentPhoto = app_api_url + 'images/upload.jpg';
        }
      } catch (error) {
        this.showMsg(error.toString());
      }
    },
  },
};
</script>

<style>
.Post textarea {
  background: white;
  width: 100%;
  padding: 6px;
  border: 0px;
  margin-bottom: -4px;
  resize: none;
  height: 45vw;
}
.Post input[type='file'] {
  background: white;
  width: 100%;
  padding: 6px;
}
.Post button {
  background-color: #f1f1f1;
  color: black;
  width: 100%;
  padding: 6px;
  border: 0px;
  font-size: 16px;
  font-weight: bold;
}
.Post img {
  width: 100%;
  margin-bottom: -4px;
}
@media only screen and (min-width: 350px) {
  .Post textarea {
    height: 35vw;
  }
}
@media only screen and (min-width: 576px) {
  .Post textarea {
    height: 20vw;
  }
}
@media only screen and (min-width: 768px) {
  /* .Post img {
    outline: 1px solid black;
    outline-offset: -1px;
  } */
  .Post textarea {
    height: 35vw;
  }
}
@media only screen and (min-width: 992px) {
  .Post textarea {
    height: 25vw;
  }
}
@media only screen and (min-width: 1200px) {
  .Post textarea {
    height: 7vw;
  }
}
@media only screen and (min-width: 1600px) {
  .Post textarea {
    height: 10vw;
  }
}
</style>
