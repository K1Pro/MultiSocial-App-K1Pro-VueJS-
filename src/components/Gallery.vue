<template>
  <div class="Gallery">
    <!-- <h2>{{ this.totalImages }} images:</h2> -->

    <div class="Gallery-Row">
      <div class="Gallery-Column">
        <img v-for="value in imgSrchArr1stPart" :src="value.src.medium" @click="selectImg(value.src.original)" />
      </div>
      <div class="Gallery-Column">
        <img v-for="value in imgSrchArr2ndPart" :src="value.src.medium" @click="selectImg(value.src.original)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Gallery',

  data() {
    return {};
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'imagePath',
      'imgSrchArr',
      'imgSrchArr1stPart',
      'imgSrchArr2ndPart',
      'vars',
    ]),
  },

  methods: {
    selectImg(selectedImgPath) {
      this.imagePath = selectedImgPath + this.vars.landscape;
      localStorage.setItem(`RapidMarketingAI-mostRecentImagePath`, selectedImgPath);
    },
  },
  created() {
    // RapidMarketingAI-hockey-imgPath-17
    let mostRecentSearch = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`);
    if (localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)) {
      let rep = 0;
      const mostRcntSrchArr = [];
      do {
        rep++;
        if (localStorage.getItem(`RapidMarketingAI-${mostRecentSearch}-imgPath-${rep}`)) {
          const obj = {
            src: {
              original: localStorage.getItem(`RapidMarketingAI-${mostRecentSearch}-imgPath-${rep}`),
              medium: localStorage.getItem(`RapidMarketingAI-${mostRecentSearch}-imgPath-${rep}`) + this.vars.medium,
              landscape:
                localStorage.getItem(`RapidMarketingAI-${mostRecentSearch}-imgPath-${rep}`) + this.vars.landscape,
            },
          };
          mostRcntSrchArr.push(obj);
        }
      } while (localStorage.getItem(`RapidMarketingAI-${mostRecentSearch}-imgPath-${rep}`));
      this.imgSrchArr = mostRcntSrchArr;
    }
  },
};
</script>

<style>
.Gallery {
  padding: 0px 20px;
  box-sizing: border-box;
}

.Gallery-Row {
  display: -ms-flexbox; /* IE10 */
  display: flex;
  -ms-flex-wrap: wrap; /* IE10 */
  flex-wrap: wrap;
  padding: 0 4px;
}
.Gallery-Column {
  -ms-flex: 48%;
  flex: 48%;
  max-width: 48%;
  padding: 0 1%;
}

.Gallery img {
  cursor: pointer;
  margin-top: 8px;
  vertical-align: middle;
  width: 100%;
  outline: 2px solid white;
  outline-offset: -2px;
  /* width: 50%;
  display: inline;
  margin: auto; */

  /* height: 60%;
  outline: 4px solid white;
  outline-offset: -4px; */
}

@media only screen and (min-width: 768px) {
  /* .Gallery {
    padding: 0px 20px;
  } */
  .Gallery img {
    /* outline: 8px solid white;
    outline-offset: -8px; */
  }
}
</style>
