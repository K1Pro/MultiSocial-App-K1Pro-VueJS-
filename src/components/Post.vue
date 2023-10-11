<template>
  <div class="Post">
    <h2>Rapid Marketing AI</h2>

    <div id="inner-grid">
      <div>
        <b>Title</b>
        <input v-model="postTitle" type="text" name="postTitle" placeholder="Title..." /><br />

        <div class="boldLabel">Body text</div>
        <textarea v-model="postBody" rows="2" name="postBody" placeholder="Body text..."></textarea><br />

        <div class="boldLabel">Link</div>
        <input v-model="postLink" type="text" name="postLink" placeholder="Link..." /><br />
      </div>

      <div>
        <div class="boldLabelResp">Link description</div>
        <input v-model="postLinkDesc" type="text" name="postLinkDesc" placeholder="Link description..." /><br />

        <div class="boldLabel">Hashtags</div>
        <input v-model="postHashtags" type="text" name="postHashtags" placeholder="Hashtags..." /><br />

        <div class="boldLabel">Choose an image</div>
        <button type="button" @click.prevent="imageSearch()">Search</button>
        <input
          type="search"
          v-model="imageSearchInput"
          name="image-search"
          placeholder="Search for an image…"
          @keyup.enter="imageSearch()"
        /><br />
        <input type="file" name="filename" @change="previewFiles" /><br /><br />
      </div>
    </div>

    <button class="centerSpan" type="button" @click.prevent="socialMediaPost()">Post</button><br /><br />
    <img v-if="imagePath" :src="imagePath" alt="random-image" /><br />
  </div>
</template>

<script>
export default {
  name: 'Post',

  props: ['accessToken', 'userData'],

  emits: ['post-msg', 'posted'],

  data() {
    return {
      imageSearchInput: '',
      imagePath: '',
      postTitle: '',
      postLink: '',
      postLinkDesc: '',
      postHashtags: '',
      postBody: '',
    };
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
            const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
            const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
            localStorage.setItem(`Multisocial-${this.imageSearchInput.toLowerCase()}`, imageSearchJSON.total_results);
            localStorage.setItem(
              `Multisocial-mostRecentImagePath`,
              imageSearchJSON.photos[randomImage].src['landscape']
            );
            this.imagePath = imageSearchJSON.photos[randomImage].src['landscape'];
          }
        } catch (error) {
          console.log(error.toString());
          this.$emit('post-msg', error.toString());
        }
      } else {
        this.$emit('post-msg', 'Image search cannot be blank');
      }
    },

    async socialMediaPost() {
      let confirmPostText = 'Are you sure you would like to post?\nClick OK or Cancel.';
      if (confirm(confirmPostText) == true) {
        try {
          const response = await fetch(servrURL + 'controller/post.php', {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              Title: this.postTitle,
              Link: this.postLink,
              LinkDesc: this.postLinkDesc,
              Hashtags: this.postHashtags,
              Body: this.postBody,
              ImagePath: this.imagePath,
            }),
          });
          const socialMediaPostJSON = await response.json();
          // if (socialMediaPostJSON.success) {
          console.log(socialMediaPostJSON);
          this.$emit('post-msg', socialMediaPostJSON.messages[0]);
          this.$emit('posted', Date.now());
          // }
        } catch (error) {
          this.$emit('post-msg', error.toString());
        }
      }
    },

    previewFiles(event) {
      console.log(event.target.files);
    },
  },

  watch: {
    userData() {
      this.postLink = this.userData ? this.userData.Website : '';
      this.postLinkDesc = this.userData ? 'This is a link to ' + this.userData.Organization : '';
      this.postHashtags = this.userData ? `#${this.userData.Tag1} #${this.userData.Tag2} #${this.userData.Tag3}` : '';
    },
  },

  created() {
    this.imageSearchInput = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`)
      : '';
    this.imagePath = localStorage.getItem(`Multisocial-mostRecentImagePath`)
      ? localStorage.getItem(`Multisocial-mostRecentImagePath`)
      : '';
    this.postTitle = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`Multisocial-mostRecentSearch`).slice(1)
      : '';
    this.postBody = localStorage.getItem(`Multisocial-mostRecentSearch`)
      ? localStorage.getItem(`Multisocial-mostRecentSearch`).charAt(0).toUpperCase() +
        localStorage.getItem(`Multisocial-mostRecentSearch`).slice(1)
      : '';
    this.postLink = this.userData ? this.userData.Website : '';
    this.postLinkDesc = this.userData ? 'This is a link to ' + this.userData.Organization : '';
    this.postHashtags = this.userData ? `#${this.userData.Tag1} #${this.userData.Tag2} #${this.userData.Tag3}` : '';
  },
};
</script>
