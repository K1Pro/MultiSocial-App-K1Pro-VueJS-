<template>
  <button type="button" @click="logoutFunc(this.endPts.logout)">Log Out</button>
</template>

<script>
export default {
  name: 'Logout',

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'endPts',
    ]),
  },

  methods: {
    async logoutFunc(endPt) {
      try {
        const response = await fetch(loginURL + endPt + this.sessionID, {
          method: 'DELETE',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const logOutResJSON = await response.json();
        if (logOutResJSON.success) {
          this.accessToken = undefined;
          this.sessionID = undefined;
          this.loggedIn = false;
          document.cookie = `_a_t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
          document.cookie = `_s_i=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${cookiePath};`;
        }
        this.msg.snackBar = logOutResJSON.messages[0];
      } catch (error) {
        this.msg.snackBar = error.toString();
      }
    },
  },
};
</script>

<style></style>
