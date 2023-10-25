<template>
  <div class="Gallery">
    <!-- <h2>{{ this.totalImages }} images:</h2> -->

    <input
      type="search"
      v-model="imageSearchInput"
      name="image-search"
      placeholder="Search for an image…"
      @keyup.enter="imageSearch()"
    />
    <button type="button" @click.prevent="imageSearch()">Search</button><br />

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
    return { imageSearchInput: '' };
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'imagePath',
      'imgSrchArr',
      'imgSrchArr1stPart',
      'imgSrchArr2ndPart',
      'vars',
      'message',
    ]),
  },

  methods: {
    async imageSearch() {
      if (this.imageSearchInput) {
        localStorage.setItem(`RapidMarketingAI-mostRecentSearch`, this.imageSearchInput.toLowerCase());
        const prevSrchTtlRslts = localStorage.getItem(`RapidMarketingAI-${this.imageSearchInput.toLowerCase()}`);
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
            console.log(imageSearchJSON.photos);
            this.imgSrchArr = imageSearchJSON.photos;
            const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
            const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
            localStorage.setItem(
              `RapidMarketingAI-${this.imageSearchInput.toLowerCase()}`,
              imageSearchJSON.total_results
            );
            let rep = 0;
            imageSearchJSON.photos.forEach((element) => {
              rep++;
              localStorage.setItem(
                `RapidMarketingAI-${this.imageSearchInput.toLowerCase()}-imgPath-${rep}`,
                element.src.original
              );
            });
          }
        } catch (error) {
          console.log(error.toString());
          this.message = error.toString();
        }
      } else {
        this.message = 'Image search cannot be blank';
      }
    },

    selectImg(selectedImgPath) {
      this.imagePath = selectedImgPath + this.vars.landscape;
      localStorage.setItem(`RapidMarketingAI-mostRecentImagePath`, selectedImgPath);
    },
  },
  created() {
    this.imageSearchInput = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)
      : '';
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
  padding: 20px 20px;
  box-sizing: border-box;
  /* text-align: center; */
}

.Gallery input[type='search'] {
  width: 48.5%;
  background: #f1f1f1;
  border: 1px solid black;
  padding: 6px;
  font-weight: bold;
  margin-left: 8px;
}

.Gallery button {
  width: 20%;
  padding: 6px;
  border: 1px solid black;
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
