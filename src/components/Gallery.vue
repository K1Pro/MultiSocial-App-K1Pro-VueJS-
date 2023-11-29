<template>
  <div class="Gallery">
    <button type="button" @click.prevent="imageSearch()">Search</button>
    <input
      type="search"
      v-model="imageSearchInput"
      name="image-search"
      placeholder="Search for an image…"
      @keyup.enter="imageSearch()"
    />
    <select name="images-searched" @change="selectSearch">
      <option v-for="searched in Object.keys(this.userData.SearchedPhotos)" :value="searched">
        {{ searched.replaceAll('_', ' ') }}
      </option>
    </select>
    <br />

    <div class="Gallery-Row">
      <div class="Gallery-Column">
        <img
          v-for="images in imgSrchArr1stPart"
          :src="images.src.medium"
          @click="selectImg($event, images.src.landscape)"
          name="MostRecentPhoto"
        />
      </div>
      <div class="Gallery-Column">
        <img
          v-for="images in imgSrchArr2ndPart"
          :src="images.src.medium"
          @click="selectImg($event, images.src.landscape)"
          name="MostRecentPhoto"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Gallery',

  data() {
    return { imageSearchInput: '', imageSearchInputs: [] };
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'accessToken',
      'userData',
      'imgSrchArr1stPart',
      'imgSrchArr2ndPart',
      'message',
      'endPts',
      'patchUserData',
    ]),
  },

  methods: {
    async imageSearch() {
      this.userData.MostRecentSearch = this.imageSearchInput.replaceAll(' ', '_').toLowerCase().trim();
      if (this.imageSearchInput) {
        const prevSrchTtlRslts = localStorage.getItem(`RapidMarketingAI-${this.imageSearchInput.toLowerCase()}`);
        // const prevSrchTtlRsltsMax =
        //   prevSrchTtlRslts && prevSrchTtlRslts != 'undefined' ? Math.floor(prevSrchTtlRslts / 80) : 1;
        // const randomPage = Math.floor(Math.random() * (prevSrchTtlRsltsMax - 1 + 1) + 1);

        try {
          const response = await fetch(servrURL + this.endPts.searchedPhotos, {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              PhotoSearch: this.imageSearchInput.toLowerCase().replaceAll('_', ' '),
            }),
          });
          const imageSearchJSON = await response.json();
          if (imageSearchJSON.success) {
            console.log(imageSearchJSON);
            console.log(imageSearchJSON.data.keyword);
            this.userData.SearchedPhotos[imageSearchJSON.data.keyword] = imageSearchJSON.data.Pexels_Response;
          }
          this.message = imageSearchJSON.messages[0];
        } catch (error) {
          this.message = error.toString();
        }
        // try {
        //   const response = await fetch(
        //     'https://api.pexels.com/v1/search?query=' +
        //       this.imageSearchInput.toLowerCase() +
        //       `&page=${randomPage}&per_page=80`,
        //     {
        //       method: 'GET',
        //       headers: {
        //         Authorization: this.userData.Pexels,
        //       },
        //     }
        //   );
        //   const imageSearchJSON = await response.json();
        //   if (imageSearchJSON && Number.isInteger(+imageSearchJSON.total_results)) {
        //     if (!this.imagePath) {
        //       this.imagePath = imageSearchJSON.photos[0].src.landscape;
        //       localStorage.setItem(`RapidMarketingAI-mostRecentImagePath`, imageSearchJSON.photos[0].src.original);
        //     }
        //     // console.log(imageSearchJSON.photos);
        //     this.imgSrchArr = imageSearchJSON.photos;
        //     const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
        //     const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
        //     localStorage.setItem(
        //       `RapidMarketingAI-${this.imageSearchInput.toLowerCase()}`,
        //       imageSearchJSON.total_results
        //     );
        //     const transaction = this.xDB_galleryOnLoad.transaction(['galleryOnLoad_tb'], 'readwrite');
        //     const objectStore = transaction.objectStore('galleryOnLoad_tb');
        //     objectStore.put(imageSearchJSON.photos, this.imageSearchInput.replaceAll(' ', '_').toLowerCase());
        //     objectStore.getAllKeys().onsuccess = (event) => {
        //       this.imageSearchInputs = event.srcElement.result;
        //     };
        //   }
        // } catch (error) {
        //   this.message = error.toString();
        // }
      } else {
        this.message = 'Image search cannot be blank';
      }
    },

    selectImg(event, selectedImgPath) {
      this.patchUserData(event);
      this.userData.MostRecentPhoto = selectedImgPath;
    },

    selectSearch(event) {
      this.imageSearchInput = event.srcElement.selectedOptions[0]._value.replaceAll('_', ' ');
      this.userData.MostRecentSearch = event.srcElement.selectedOptions[0]._value.replaceAll(' ', '_');
    },
  },
  created() {
    this.imageSearchInput = this.userData.MostRecentSearch
      ? this.userData.MostRecentSearch.replaceAll('_', ' ')
      : this.userData.Tag1.replace(/([A-Z])/g, ' $1').trim();

    if (!this.userData.MostRecentSearch) {
      console.log('no most recent search');
      this.imageSearch();
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
  position: relative;
  width: 65%;
  background: white;
  border: 0px;
  padding: 7px;
  margin-right: -65%;
  z-index: 2;
  /* font-weight: bold; */
}

.Gallery select {
  position: relative;
  width: 70%;
  background: white;
  border: 0px;
  padding: 7px;
  z-index: 1;
  /* font-weight: bold; */
}

.Gallery button {
  margin-left: 8px;
  width: 27%;
  padding: 6px;
  border: 0px;
  background-color: #f1f1f1;
  color: black;
  font-size: 16px;
  font-weight: bold;
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
  outline: 1px solid black;
  outline-offset: -1px;
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

  /* .Gallery input[type='search'] {
    width: 33.5%;
  }

  .Gallery button {
    width: 15%;
  } */
}
</style>
