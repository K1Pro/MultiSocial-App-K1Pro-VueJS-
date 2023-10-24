<template>
  <div class="Gallery">
    <h2>Choose an image</h2>

    <div>
      <img v-for="value in this.imgSrchArr" :src="value.src.medium" @click="clickImg(value.src.landscape)" />
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
    ...Pinia.mapWritableState(useUserStore, ['imagePath', 'imgSrchArr']),
  },

  methods: {
    clickImg(srchdImgPath) {
      this.imagePath = srchdImgPath;
    },
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
