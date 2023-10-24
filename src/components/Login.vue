<template>
  <div class="content">
    <div class="loginform">
      <div class="square"></div>
      <div class="inputs">
        <form>
          <label for="email">E-mail: </label>
          <input
            type="text"
            v-model="email"
            id="email"
            autocomplete="email"
            @keyup.enter="loginFunc(this.userStore.endPts.login)"
          /><br /><br />
          <label for="password">Password: </label>
          <input
            type="password"
            v-model="password"
            id="password"
            @keyup.enter="loginFunc(this.userStore.endPts.login)"
          /><br /><br />
          <button type="button" @click.prevent="loginFunc(this.userStore.endPts.login)">Log In</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
    };
  },

  computed: {
    ...Pinia.mapStores(useUserStore),
  },

  methods: {
    async loginFunc(endPt) {
      try {
        const response = await fetch(servrURL + endPt, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Email: this.email.toLowerCase(),
            Password: this.password,
            IP_Address: userIP,
          }),
        });
        const logInResJSON = await response.json();
        if (logInResJSON.success) {
          this.userStore.accessToken = logInResJSON.data.accesstoken;
          this.userStore.sessionID = logInResJSON.data.session_id;
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          document.cookie = `_a_t=${logInResJSON.data.accesstoken}; expires=${tomorrow.toString()};`;
          document.cookie = `_s_i=${logInResJSON.data.session_id}; expires=${tomorrow.toString()};`;
        }
        this.userStore.message = logInResJSON.messages[0];
      } catch (error) {
        this.error = error.toString();
        this.userStore.message = this.error;
      }
    },
  },
};
</script>

<style>
/* div {
  perspective: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
} */

.content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90vh;
}

.loginform {
  text-align: center;
  margin: auto;
}

.square {
  width: 300px;
  height: 300px;
  /* background: black; */
  background-image: url('./src/assets/images/K1logoBlack.png');
  background-repeat: no-repeat;
  background-size: 300px 300px;
  transform: rotateY(45deg);
  animation: rotateAnimation 8s linear infinite;
}

.inputs {
  /* background: white; */
  padding: 10px;
}

@keyframes rotateAnimation {
  from {
    transform: rotateY(45deg);
  }
  to {
    transform: rotateY(405deg);
  }
}
</style>
