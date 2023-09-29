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
      <button type="button" @click.prevent="getActiveSMGroup()">Post</button><br>
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

    async getActiveSMGroup() {
      try {
        const response = await fetch(servrURL + 'controller/socialmedia.php?active=true', {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
          },
        });
        const ActiveSMGroupJSON = await response.json();
        if (ActiveSMGroupJSON.success) {
          ActiveSMGroupJSON.data.sm_group.forEach((sm_website) => {
            if (sm_website.website == 'LinkedIn') this.LinkedIn(sm_website);
            if (sm_website.website == 'Twitter') this.Twitter(sm_website);
          });
          this.$emit('post-msg', 'Posting to social media websites...');
        }
      } catch (error) {
        this.$emit('post-msg', error.toString());
      }
    },

    async LinkedIn(sm_webData) {
      try {
        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sm_webData.accesstoken}`,
            'X-Restli-Protocol-Version': '2.0.0',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': 'https://multisocial.k1pro.net/',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            author: `urn:li:person:${sm_webData.urn}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: this.postTitle,
                },
                shareMediaCategory: 'ARTICLE',
                media: [
                  {
                    status: 'READY',
                    description: {
                      text: this.postBody,
                    },
                    originalUrl: this.postLink,
                    title: {
                      text: this.postLinkDesc,
                    },
                    thumbnails: [
                      {
                        url: this.randomImagePath,
                      },
                    ],
                  },
                ],
              },
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
          }),
        });
        const LinkedInJSON = await response.json();
        if (LinkedInJSON) {
          console.log(LinkedInJSON);
        }
      } catch (error) {
        console.log(error.toString());
      }
    },

    async Twitter(sm_webData) {
      try {
        const response = await fetch('', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sm_webData.accesstoken}`,
          },
          body: JSON.stringify({}),
        });
        const TwitterJSON = await response.json();
        if (TwitterJSON) {
          console.log(TwitterJSON);
        }
      } catch (error) {
        console.log(error.toString());
      }
    },
  },
};
// </script>
