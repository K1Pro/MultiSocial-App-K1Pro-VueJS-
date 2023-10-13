<template>
  <div class="accountinfo">
    <h2>Account Info</h2>

    <ul>
      <li
        v-for="value in Object.keys(userData).filter((e) => {
          return e !== 'LoginActivity';
        })"
      >
        {{ value }}: {{ userData[value] }}
      </li>
    </ul>
    <p></p>
  </div>
</template>

<script>
export default {
  name: 'AccountInfo',

  props: ['userData'],

  data() {
    return {};
  },
};
</script>
