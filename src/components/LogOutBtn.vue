<template>
  <button :style="logoutBtn" type="button" @click="logoutFunc(logoutEndPt)">Log Out</button>
</template>

<script>
export default {
  name: 'LogOutBtn',

  computed: {
    ...Pinia.mapWritableState(useUserStore, ['accessTokenPinia', 'sessionIDPinia', 'loggedInPinia', 'messagePinia']),
  },

  methods: {
    async logoutFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt + this.sessionIDPinia, {
          method: 'DELETE',
          headers: {
            Authorization: this.accessTokenPinia,
            'Cache-Control': 'no-store',
          },
        });
        const logOutResJSON = await response.json();
        if (logOutResJSON.success) {
          this.accessTokenPinia = undefined;
          this.sessionIDPinia = undefined;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        }
        this.messagePinia = logOutResJSON.messages[0];
      } catch (error) {
        this.error = error.toString();
        this.messagePinia = this.error;
      }
    },
  },

  created() {
    this.logoutEndPt = 'controller/sessions.php?sessionid=';

    // <style scoped>
    this.logoutBtn = {
      // position: 'absolute',
      // top: '5px',
      // right: '15px',
    };
    // </style>
  },
};
</script>
