<template>
  <table>
    <tr>
      <th>Post Date</th>
      <th>Post Link</th>
    </tr>
    <tr v-for="value in posted">
      <td
        v-for="(value, key) in Object.entries(value).filter(([key, val]) => {
          return key === 'date';
        })"
      >
        {{ value[1].slice(0, 16) }}
      </td>
      <td
        v-for="(value, key) in Object.entries(value).filter(([key, val]) => {
          return key === 'link';
        })"
      >
        <a :href="value[1]" :class="['postlinks fab fa-'] + value[1].split('.')[1]" target="_blank"></a>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'Posted',

  props: ['accessToken', 'newPostTimestamp'],

  data() {
    return { posted: '' };
  },

  methods: {
    async getPosted() {
      try {
        const response = await fetch(servrURL + 'controller/posted.php', {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const getPostedJSON = await response.json();
        if (getPostedJSON.success) {
          this.posted = getPostedJSON.data.posted;
          console.log(getPostedJSON);
        } else {
          console.log('no posts retrieved');
        }
      } catch (error) {
        this.error = error.toString();
        console.log(error.toString());
      }
    },
  },

  watch: {
    newPostTimestamp(newTS, oldTS) {
      console.log(newTS);
      this.getPosted();
    },
  },

  created() {
    this.getPosted();
  },
};
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  table-layout: auto;
  width: 100%;
}

td,
th {
  /* border: 1px solid #dddddd; */
  text-align: center;
  padding: 5px;
}

th {
  background-color: #f1f1f1;
}

.postlinks {
  padding: 5px 0px;
  height: 100%;
  font-size: 30px;
  width: 100%;
  text-align: center;
  text-decoration: none;
}

.fab {
  color: white;
}
.fa-facebook {
  background: #3b5998;
}
.fa-twitter {
  background: #55acee;
}
.fa-google {
  background: #dd4b39;
}
.fa-linkedin {
  background: #007bb5;
}
.fa-youtube {
  background: #bb0000;
}
.fa-instagram {
  background: #fffc00;
  background: -webkit-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: -moz-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: -ms-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  /* text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  background: #125688; */
}
.fa-pinterest {
  background: #cb2027;
}
.fa-snapchat-ghost {
  background: #fffc00;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
.fa-skype {
  background: #00aff0;
}
.fa-android {
  background: #a4c639;
}
.fa-dribbble {
  background: #ea4c89;
}
.fa-vimeo {
  background: #45bbff;
}
.fa-tumblr {
  background: #2c4762;
}
.fa-vine {
  background: #00b489;
}
.fa-foursquare {
  background: #45bbff;
}
.fa-stumbleupon {
  background: #eb4924;
}
.fa-flickr {
  background: #f40083;
}
.fa-yahoo {
  background: #430297;
}
.fa-soundcloud {
  background: #ff5500;
}
.fa-reddit {
  background: #ff5700;
}
.fa-rss {
  background: #ff6600;
}
.fa-tiktok {
  background: #fe2c55;
}
.fa-pexels {
  background: #07a081;
}
</style>
