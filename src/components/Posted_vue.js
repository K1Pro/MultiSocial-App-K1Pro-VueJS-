export default {
  name: 'Posted',

  template: /*html*/ `
    <div class="posted">
      <a
        v-for="value in userData.SMPosts"
        :class="['postlinks fab background-'] + value.website + [' fa-'] + value.website"
        :href="value.link"
        target="_blank"
      >
        <span>
          {{ value.date.slice(5, 7) }}/
          {{ value.date.slice(8, 10) }}/
          {{ value.date.slice(2, 4)}}
          {{ value.date.slice(10, 16) }}
        </span>
      </a>
    </div>
  `,

  computed: {
    ...Pinia.mapWritableState(useUserStore, ['userData']),
  },

  mounted() {
    style(
      'Posted',
      /*css*/ `
.posted {
  text-align: center;
  padding: 30px 30px;
}
.posted a {
  outline: 1px solid black;
  outline-offset: -1px;
  text-decoration: none;
}
.posted span {
  font-size: 14px;
  padding-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  vertical-align: middle;
}
.postlinks {
  white-space: nowrap;
  overflow: hidden;
  padding: 7px;
  font-size: 18px;
  width: 100%;
  margin-bottom: 5px;
}
.fab {
  color: white;
}
.background-facebook {
  background: #3b5998;
}
.background-twitter {
  background: #55acee;
}
.background-google {
  background: #dd4b39;
}
.background-linkedin {
  background: #007bb5;
}
.background-youtube {
  background: #bb0000;
}
.background-instagram {
  background: #fffc00;
  background: -webkit-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: -moz-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: -ms-linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  background: linear-gradient(top, #fc01d6 0%, #ffc001 100%);
  /* text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  background: #125688; */
}
.background-pinterest {
  background: #cb2027;
}
.background-snapchat-ghost {
  background: #fffc00;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
.background-skype {
  background: #00aff0;
}
.background-android {
  background: #a4c639;
}
.background-dribbble {
  background: #ea4c89;
}
.background-vimeo {
  background: #45bbff;
}
.background-tumblr {
  background: #2c4762;
}
.background-vine {
  background: #00b489;
}
.background-foursquare {
  background: #45bbff;
}
.background-stumbleupon {
  background: #eb4924;
}
.background-flickr {
  background: #f40083;
}
.background-yahoo {
  background: #430297;
}
.background-soundcloud {
  background: #ff5500;
}
.background-reddit {
  background: #ff5700;
}
.background-rss {
  background: #ff6600;
}
.background-tiktok {
  background: #fe2c55;
}
.background-pexels {
  background: #07a081;
}
      `
    );
  },
};
