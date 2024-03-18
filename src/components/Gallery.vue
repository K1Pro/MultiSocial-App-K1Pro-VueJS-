<template>
  <div class="Gallery">
    <button type="button" @click.prevent="imageSearch">Search</button>
    <input
      name="MostRecentSearch"
      type="search"
      placeholder="Search for an image…"
      v-model="imageSearchInput"
      @keyup.enter="imageSearch"
    />
    <select name="images-searched" @change="selectSearch">
      <option
        v-for="searched in Object.keys(this.userData.SearchedPhotos)"
        :value="searched"
      >
        {{ searched.charAt(0).toUpperCase()
        }}{{ searched.slice(1).replaceAll('_', ' ') }}
      </option>
    </select>
    <br />

    <div class="Gallery-Row">
      <div class="Gallery-Column">
        <img
          v-for="images in imgSrchArr1stPart"
          name="MostRecentPhoto"
          :src="images.src.medium"
          @click="selectImg($event, images.src.landscape)"
        />
      </div>
      <div class="Gallery-Column">
        <img
          v-for="images in imgSrchArr2ndPart"
          name="MostRecentPhoto"
          :src="images.src.medium"
          @click="selectImg($event, images.src.landscape)"
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
      'msg',
      'endPts',
      'patchUserData',
    ]),
  },

  methods: {
    async imageSearch() {
      const imageSearched = this.imageSearchInput
        .replaceAll(' ', '_')
        .toLowerCase()
        .trim();
      this.userData.MostRecentSearch = imageSearched;

      if (
        this.imageSearchInput &&
        (this.userData.SearchedPhotos[imageSearched]?.total_results ==
          undefined ||
          this.userData.SearchedPhotos[imageSearched]?.total_results > 80)
      ) {
        try {
          const response = await fetch(servrURL + this.endPts.searchedPhotos, {
            method: 'POST',
            headers: {
              Authorization: this.accessToken,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store',
            },
            body: JSON.stringify({
              PhotoSearch: this.imageSearchInput
                .replaceAll('_', ' ')
                .toLowerCase()
                .trim(),
            }),
          });
          const imageSearchJSON = await response.json();
          if (imageSearchJSON.success) {
            console.log(imageSearchJSON);
            console.log(imageSearchJSON.data.keyword);
            this.userData.SearchedPhotos[imageSearchJSON.data.keyword] =
              imageSearchJSON.data.Pexels_Response;
          }
          this.msg.snackBar = imageSearchJSON.messages[0];
        } catch (error) {
          this.msg.snackBar = error.toString();
        }
      } else {
        this.msg.snackBar = 'No additional search results';
        this.patchUserData(null, 'MostRecentSearch', imageSearched);
      }
    },

    selectImg(event, selectedImgPath) {
      console.log(selectedImgPath);
      this.userData.MostRecentPhoto = selectedImgPath;
      this.patchUserData(null, 'MostRecentPhoto', selectedImgPath);
      // this.patchUserData(event); // Use this if you want the original to be saved not the landscape
    },

    selectSearch(event) {
      this.imageSearchInput =
        event.srcElement.selectedOptions[0]._value.charAt(0).toUpperCase() +
        event.srcElement.selectedOptions[0]._value
          .slice(1)
          .toLowerCase()
          .replaceAll('_', ' ');
      this.userData.MostRecentSearch =
        event.srcElement.selectedOptions[0]._value
          .replaceAll(' ', '_')
          .toLowerCase()
          .trim();
      this.patchUserData(
        null,
        'MostRecentSearch',
        this.imageSearchInput.replaceAll(' ', '_').toLowerCase().trim()
      );
    },
  },
  created() {
    this.imageSearchInput = this.userData.MostRecentSearch
      ? this.userData.MostRecentSearch.charAt(0).toUpperCase() +
        this.userData.MostRecentSearch.slice(1)
          .toLowerCase()
          .replaceAll('_', ' ')
      : '';
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
