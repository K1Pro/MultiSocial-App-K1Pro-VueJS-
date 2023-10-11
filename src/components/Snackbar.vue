<template>
  <div class="snackbar" :class="{ show: message }">{{ message }}</div>
</template>
<script>
export default {
  name: 'Snackbar',

  props: ['message'],
};
</script>
