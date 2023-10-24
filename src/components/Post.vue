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
    <textarea v-model="postBody" rows="3" name="postBody" placeholder="Body text..."></textarea><br /><br />

    <b>Link</b>
    <input v-model="postLink" type="text" name="postLink" placeholder="Link..." /><br /><br />

    <b>Link description</b>
    <input v-model="postLinkDesc" type="text" name="postLinkDesc" placeholder="Link description..." /><br /><br />

    <b>Hashtags</b>
    <input v-model="postHashtags" type="text" name="postHashtags" placeholder="Hashtags..." /><br /><br />

    <button type="button" @click.prevent="imageSearch()">Search</button>
    <input
      type="search"
      v-model="imageSearchInput"
      name="image-search"
      placeholder="Search for an image…"
      @keyup.enter="imageSearch()"
    /><br />

    <img v-if="this.userStore.imagePath" :src="this.userStore.imagePath" alt="random-image" /><br />

    <input type="file" name="filename" @change="previewFiles" /><br /><br />

    <button class="centerSpan" type="button" @click.prevent="socialMediaPost()">Post</button><br /><br />
  </div>
</template>

<script>
export default {
  name: 'Post',

  data() {
    return {
      imageSearchInput: '',
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
    async imageSearch() {
      if (this.imageSearchInput) {
        localStorage.setItem(`Multisocial-mostRecentSearch`, this.imageSearchInput.toLowerCase());
        const prevSrchTtlRslts = localStorage.getItem(`Multisocial-${this.imageSearchInput.toLowerCase()}`);
        const prevSrchTtlRsltsMax =
          prevSrchTtlRslts && prevSrchTtlRslts != 'undefined' ? Math.floor(prevSrchTtlRslts / 80) : 1;
        const randomPage = Math.floor(Math.random() * (prevSrchTtlRsltsMax - 1 + 1) + 1);
        try {
          const response = await fetch(
            'https://api.pexels.com/v1/search?query=' +
              this.imageSearchInput.toLowerCase() +
              `&page=${randomPage}&per_page=80`,
            {
              method: 'GET',
              headers: {
                Authorization: pexelsKey,
              },
            }
          );
          const imageSearchJSON = await response.json();
          if (imageSearchJSON && Number.isInteger(+imageSearchJSON.total_results)) {
            // console.log(imageSearchJSON.photos);
            this.userStore.imgSrchArr = imageSearchJSON.photos;
            const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
            const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
            localStorage.setItem(`Multisocial-${this.imageSearchInput.toLowerCase()}`, imageSearchJSON.total_results);
            localStorage.setItem(
              `Multisocial-mostRecentImagePath`,
              imageSearchJSON.photos[randomImage].src['landscape']
            );
            this.userStore.imagePath = imageSearchJSON.photos[randomImage].src['landscape'];
          }
        } catch (error) {
          console.log(error.toString());
          this.userStore.message = error.toString();
        }
      } else {
        this.userStore.message = 'Image search cannot be blank';
      }
    },

    async socialMediaPost() {
      let confirmPostText = 'Are you sure you would like to post?\nClick OK or Cancel.';
      if (confirm(confirmPostText) == true) {
        try {
          const response = await fetch(servrURL + this.userStore.endPts.posted, {
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
    this.imageSearchInput = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`)
      : '';
    this.postTitle = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`Multisocial-mostRecentSearch`).slice(1)
      : '';
    this.postBody = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`Multisocial-mostRecentSearch`).slice(1)
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
  padding: 0px 0px;
}

.Post textarea {
  width: 100%;
  padding-left: 5px;
}

.Post input[type='search'] {
  width: 77%;
}

.Post input[type='text'] {
  width: 100%;
  padding-left: 5px;
}

.Post input[type='file'] {
  width: 100%;
  background: #ffffff;
}

.centerSpan {
  margin-left: 38%;
}

.Post button {
  width: 23%;
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
    padding: 0px 10px;
  }
}
</style>
