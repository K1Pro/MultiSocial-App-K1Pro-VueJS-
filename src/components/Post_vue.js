//<script>
export default {
  name: 'Post',

  template: /*html*/ `
      <b>Post</b><br>
      <input v-model="postTitle" type="text" name="postTitle" placeholder="Post title"><br>
      <input v-model="postLink" type="text" name="postLink" placeholder="Post link"><br>
      <input v-model="postLinkDesc" type="text" name="postLinkDesc" placeholder="Post link description"><br>
      <textarea v-model="postBody" rows="3" name="postBody" placeholder="Post body text"></textarea><br>
      <input type="search" v-model="imageSearchInput" name="image-search" placeholder="Search for an image…" @keyup.enter="imageSearch()"/><br>
      <button type="button" @click.prevent="imageSearch()">Search</button>
      <button type="button">Upload</button>
      <button type="button" @click.prevent="socialMediaPost()">Post</button><br>
      <img v-if="randomImagePath" :src="randomImagePath" alt="random-image">
    `,

  props: ['accessToken'],

  emits: ['post-msg'],

  data() {
    return {
      imageSearchInput: '',
      randomImagePath: '',
      postTitle: '',
      postLink: '',
      postLinkDesc: '',
      postBody: '',
    };
  },

  methods: {
    async imageSearch() {
      const prevSrchTtlRslts = localStorage.getItem(`Multisocial-${this.imageSearchInput.toLowerCase()}`);
      const prevSrchTtlRsltsMax = prevSrchTtlRslts ? Math.floor(prevSrchTtlRslts / 80) : 1;
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
        if (imageSearchJSON) {
          localStorage.setItem(`Multisocial-${this.imageSearchInput.toLowerCase()}`, imageSearchJSON.total_results);
          const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
          const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
          this.randomImagePath = imageSearchJSON.photos[randomImage].src['landscape'];
        }
      } catch (error) {
        console.log(error.toString());
      }
    },

    async socialMediaPost() {
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
            Body: this.postBody,
            ImagePath: this.randomImagePath,
          }),
        });
        const socialMediaPostJSON = await response.json();
        // if (socialMediaPostJSON.success) {
        console.log(socialMediaPostJSON);
        this.$emit('post-msg', socialMediaPostJSON.messages[0]);
        // }
      } catch (error) {
        this.$emit('post-msg', error.toString());
      }
    },
  },
};
// </script>
