<template>
  <div class="Gallery">
    <!-- <h2>{{ this.totalImages }} images:</h2> -->

    <button type="button" @click.prevent="imageSearch()">Search</button>
    <input
      type="search"
      v-model="imageSearchInput"
      name="image-search"
      placeholder="Search for an image…"
      @keyup.enter="imageSearch()"
    />
    <select name="images-searched" @change="selectSearch">
      <option v-for="searched in imageSearchInputs" :value="searched">
        {{ searched.replaceAll('_', ' ') }}
      </option>
    </select>
    <br />

    <div class="Gallery-Row">
      <div class="Gallery-Column">
        <img v-for="images in imgSrchArr1stPart" :src="images.src.medium" @click="selectImg(images.src.original)" />
      </div>
      <div class="Gallery-Column">
        <img v-for="images in imgSrchArr2ndPart" :src="images.src.medium" @click="selectImg(images.src.original)" />
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
      'userData',
      'imagePath',
      'imgSrchArr',
      'xDB_galleryOnLoad',
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
                Authorization: this.userData.Pexels,
              },
            }
          );
          const imageSearchJSON = await response.json();
          if (imageSearchJSON && Number.isInteger(+imageSearchJSON.total_results)) {
            if (!this.imagePath) {
              this.imagePath = imageSearchJSON.photos[0].src.landscape;
              localStorage.setItem(`RapidMarketingAI-mostRecentImagePath`, imageSearchJSON.photos[0].src.original);
            }

            // console.log(imageSearchJSON.photos);
            this.imgSrchArr = imageSearchJSON.photos;
            const max = imageSearchJSON.total_results > 80 ? 80 : imageSearchJSON.total_results;
            const randomImage = Math.floor(Math.random() * (max - 1 + 1) + 1);
            localStorage.setItem(
              `RapidMarketingAI-${this.imageSearchInput.toLowerCase()}`,
              imageSearchJSON.total_results
            );

            const transaction = this.xDB_galleryOnLoad.transaction(['galleryOnLoad_tb'], 'readwrite');
            const objectStore = transaction.objectStore('galleryOnLoad_tb');
            objectStore.put(imageSearchJSON.photos, this.imageSearchInput.replaceAll(' ', '_').toLowerCase());

            objectStore.getAllKeys().onsuccess = (event) => {
              this.imageSearchInputs = event.srcElement.result;
            };
          }
        } catch (error) {
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

    selectSearch(event) {
      this.imageSearchInput = event.srcElement.selectedOptions[0]._value.replaceAll('_', ' ');
      console.log(event);
      localStorage.setItem(`RapidMarketingAI-mostRecentSearch`, event.srcElement.selectedOptions[0]._value);
      const transaction = this.xDB_galleryOnLoad.transaction(['galleryOnLoad_tb'], 'readwrite');
      const objectStore = transaction.objectStore('galleryOnLoad_tb');
      objectStore.get(event.srcElement.selectedOptions[0]._value).onsuccess = (event) => {
        this.imgSrchArr = event.target.result;
      };
    },
  },
  created() {
    if (!('indexedDB' in window)) this.message = "This browser doesn't support IndexedDB";

    this.imageSearchInput = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)
      ? localStorage.getItem(`RapidMarketingAI-mostRecentSearch`).replaceAll('_', ' ').toLowerCase()
      : this.userData.Tag1.replace(/([A-Z])/g, ' $1').trim();
    let mostRecentSearch = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`);

    if (!mostRecentSearch) {
      console.log('no most recent search');
      this.imageSearch();
      mostRecentSearch = localStorage.getItem(`RapidMarketingAI-mostRecentSearch`);
    }

    if (localStorage.getItem(`RapidMarketingAI-mostRecentSearch`)) {
      let db;
      const openOrCreateDB = window.indexedDB.open('rapid-marketing-ai_db', 1);

      openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

      openOrCreateDB.addEventListener('success', () => {
        console.log('Successfully opened DB');
        db = openOrCreateDB.result;
        this.xDB_galleryOnLoad = db;

        const transaction = db.transaction(['galleryOnLoad_tb'], 'readwrite');
        const objectStore = transaction.objectStore('galleryOnLoad_tb');

        objectStore.get(this.imageSearchInput.replaceAll(' ', '_').toLowerCase()).onsuccess = (event) => {
          this.imgSrchArr = event.target.result;
        };
        objectStore.getAllKeys().onsuccess = (event) => {
          this.imageSearchInputs = event.srcElement.result;
        };
      });

      openOrCreateDB.addEventListener('upgradeneeded', (init) => {
        db = init.target.result;
        db.onerror = () => {
          console.error('Error loading database.');
        };
        db.createObjectStore('galleryOnLoad_tb', { autoIncrement: false });
      });
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
