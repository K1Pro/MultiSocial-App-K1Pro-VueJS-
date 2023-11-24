<template>
  <div class="accountinfo">
    <h2>Account Info</h2>

    <ul>
      <li
        v-for="value in Object.keys(this.userStore.userData).filter((e) => {
          return e !== 'SMParams' && e !== 'SMPosts';
        })"
      >
        {{ value }}: {{ this.userStore.userData[value] }}
      </li>
    </ul>

    <p></p>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo',

  data() {
    return {};
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },
};
</script>

<style>
.accountinfo ul {
  /* list-style-type: none;
  padding: 0;
  margin: 0; */
}
</style>
