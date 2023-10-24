<template>
  <div class="Gallery">
    <h2>Choose an image</h2>

    <img v-if="imagePath" :src="imagePath" alt="random-image" /><br />
  </div>
</template>

<script>
export default {
  name: 'Gallery',

  data() {
    return {};
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, ['imagePath']),
  },

  methods: {},
};
</script>

<style>
.Gallery {
  padding: 0px 0px;
}

.Gallery img {
  width: 100%;
  height: 60%;
  display: block;
  margin: auto;
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
