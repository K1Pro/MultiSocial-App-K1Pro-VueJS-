<template>
  <div class="posted">
    <a
      v-for="value in userData.SMPosts"
      :class="['postlinks fab fa-'] + value.website"
      :href="value.link"
      target="_blank"
    >
      <span
        >{{ value.date.slice(5, 7) }}/{{ value.date.slice(8, 10) }}/{{ value.date.slice(2, 4) }}
        {{ value.date.slice(10, 16) }}</span
      >
    </a>
  </div>
</template>

<script>
export default {
  name: 'Posted',

  computed: {
    ...Pinia.mapWritableState(useUserStore, ['userData']),
  },
};
</script>

<style scoped>
.posted {
  text-align: center;
}
a {
  outline: 1px solid black;
  outline-offset: -1px;
  text-decoration: none;
}
span {
  font-size: 18px;
  padding-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  vertical-align: middle;
}

.postlinks {
  white-space: nowrap;
  overflow: hidden;
  padding: 15px;
  font-size: 30px;
  width: 90%;
  margin-top: 12px;
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

@media only screen and (min-width: 768px) {
  .postlinks {
    width: 80%;
  }
}
</style>
