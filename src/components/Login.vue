<template>
  <div class="login">
    <div class="spinning-logo"></div>

    <input
      type="text"
      name="username"
      placeholder="Username"
      autocomplete="email"
      v-model="email"
      :class="{
        invalid: isUsernameValid,
      }"
      @keyup="removeInvalidLoginFn"
      @keyup.enter="loginFn"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      autocomplete="current-password"
      minlength="8"
      v-model="password"
      :class="{
        invalid: isPasswordValid,
      }"
      @keyup="removeInvalidLoginFn"
      @keyup.enter="loginFn"
    />
    <button :disabled="spinLogin" @click.prevent="loginFn">
      <i v-if="spinLogin" class="spin fa-sharp fa-solid fa-circle-notch"></i>
      <span v-else>Log In</span>
    </button>
    <button @click="goToURL" type="button" :disabled="loggedIn">Reset</button>
    <div v-if="msg.login" class="validation-message">{{ msg.login }}</div>
  </div>
</template>

<script>
export default {
  name: 'Login',

  data() {
    return {
      email: '',
      password: '',
      spinLogin: false,
      allInputsError: 'All inputs required',
      loginUsernameErr: 'Username cannot be blank',
      loginPasswordErr: 'Password cannot be blank',
      loginUsernamePasswordErr: 'Username or password is incorrect',
    };
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'accessToken',
      'sessionID',
      'loggedIn',
      'msg',
      'endPts',
    ]),
    isUsernameValid() {
      return (
        this.msg.login.toLowerCase().includes('incorrect') ||
        (this.email.length < 1 &&
          (this.msg.login == this.allInputsError ||
            this.msg.login == this.loginUsernameErr))
      );
    },
    isPasswordValid() {
      return (
        this.msg.login.toLowerCase().includes('incorrect') ||
        (this.password.length < 1 &&
          (this.msg.login == this.allInputsError ||
            this.msg.login == this.loginPasswordErr))
      );
    },
  },

  methods: {
    async loginFn() {
      if (
        this.email != '' &&
        this.password != '' &&
        this.password.length < 20
      ) {
        this.msg.login = '';
        this.spinLogin = true;
        this.postLogin();
      } else {
        if (this.email == '' && this.password == '') {
          this.msg.snackBar = this.allInputsError;
          this.msg.login = this.allInputsError;
        } else if (this.email == '') {
          this.msg.snackBar = this.loginUsernameErr;
          this.msg.login = this.loginUsernameErr;
        } else if (this.password == '') {
          this.msg.snackBar = this.loginPasswordErr;
          this.msg.login = this.loginPasswordErr;
        } else if (this.password.length >= 20) {
          this.email = '';
          this.password = '';
          this.msg.snackBar = this.loginUsernamePasswordErr;
          this.msg.login = this.loginUsernamePasswordErr;
        }
      }
    },

    async postLogin() {
      this.spinLogin = true;
      try {
        const response = await fetch(loginURL + this.endPts.login, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
          body: JSON.stringify({
            Email: this.email.toLowerCase(),
            Password: this.password,
            Referer: url,
            AppName: app_name,
          }),
        });
        const logInResJSON = await response.json();
        if (logInResJSON.success) {
          this.accessToken = logInResJSON.data.accesstoken;
          this.sessionID = logInResJSON.data.session_id;
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          document.cookie = `_a_t=${
            logInResJSON.data.accesstoken
          }; expires=${tomorrow.toString()};`;
          document.cookie = `_s_i=${
            logInResJSON.data.session_id
          }; expires=${tomorrow.toString()};`;
          this.msg.login = '';
          this.msg.snackBar = 'Logged in';
        } else {
          this.msg.login = logInResJSON.messages[0];
          this.msg.snackBar = logInResJSON.messages[0];
        }
        this.spinLogin = false;
      } catch (error) {
        this.msg.snackBar = error.toString();
        this.spinLogin = false;
      }
    },

    removeInvalidLoginFn(event) {
      if (this.msg.login.toLowerCase().includes(event.target.name)) {
        if (event.target.value.length < 1) {
          event.target.classList.add('invalid');
        } else {
          event.target.classList.remove('invalid');
        }
      }
    },

    goToURL() {
      window.location.href = resetpassword_url;
    },
  },
};
</script>

<style>
.login {
  width: 250px;
  height: 500px;
}

.login button {
  width: 100%;
  padding: 3px;
  margin-bottom: 10px;
}

.login input[type='text'],
.login input[type='password'] {
  width: calc(100% - 14px);
  padding: 5px;
  margin-bottom: 10px;
}

.spinning-logo {
  width: 250px;
  height: 250px;
  background-image: url('./src/assets/images/K1logoBlack.png');
  background-repeat: no-repeat;
  background-size: 250px 250px;
  transform: rotateY(45deg);
  animation: rotateAnimation 8s linear infinite;
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
