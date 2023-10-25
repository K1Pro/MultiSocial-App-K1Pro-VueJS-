<template>
  <div class="Gallery">
    <h2>Choose an image</h2>

    <div>
      <img v-for="value in this.imgSrchArr" :src="value.src.medium" @click="selectImg(value.src.original)" />
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
    ...Pinia.mapWritableState(useUserStore, ['imagePath', 'imgSrchArr', 'vars']),
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
      console.log(mostRcntSrchArr);
    }
  },
};
</script>

<style>
.Gallery {
  padding: 0px 0px;
}

.Gallery img {
  width: 50%;
  /* height: 60%; */
  display: inline;
  margin: auto;
  cursor: pointer;
  /* outline: 4px solid white;
  outline-offset: -4px; */
}

@media only screen and (min-width: 768px) {
  .Gallery {
    padding: 0px 20px;
  }
  .Gallery img {
    /* outline: 8px solid white;
    outline-offset: -8px; */
  }
}
</style>
