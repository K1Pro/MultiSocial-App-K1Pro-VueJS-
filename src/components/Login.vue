<template>
  <div class="login">
    <div class="login-title">
      <i style="font-size: 30px" class="ba-icons ba-k1pro-regular"></i>
      <span style="font-size: 18px">Pro - {{ appName }}</span>
    </div>

    <div class="login-body">
      <div class="login-icon">
        <i class="fa-solid fa-envelopes-bulk"></i>
      </div>

      <input
        type="text"
        name="username"
        placeholder="Username"
        autocomplete="email"
        v-model="email"
        :disabled="loggedIn"
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
        :disabled="loggedIn"
        :class="{
          invalid: isPasswordValid,
        }"
        @keyup="removeInvalidLoginFn"
        @keyup.enter="loginFn"
      />

      <button :disabled="loggedIn || spinLogin" @click.prevent="loginFn">
        <i v-if="spinLogin" class="spin fa-sharp fa-solid fa-circle-notch"></i>
        <span v-else>Log In</span>
      </button>

      <button @click="goToURL" type="button" :disabled="loggedIn">Reset</button>

      <div
        class="validation-message"
        :style="{
          'margin-bottom': msg.login ? '0px' : '25px',
          padding: msg.login ? '5px' : '0px',
        }"
      >
        {{ msg.login ? msg.login : '' }}
      </div>

      <div class="login-copyright">
        © {{ new Date().getFullYear() }} K1Pro | All Rights Reserved
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
      spinLogin: false,
      allInputsError: 'Username and password required',
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
      'appName',
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
          if (logInResJSON.messages[0].toLowerCase().includes('incorrect')) {
            this.email = '';
            this.password = '';
          }
        }
        this.spinLogin = false;
      } catch (error) {
        console.log(error);
        this.msg.snackBar = 'Login error';
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
      window.location.href = accountreset_url;
    },
  },
};
</script>

<style>
.login {
  border-radius: 5px;
  background-color: white;
  border: 1px solid grey;
}
.login-title {
  width: 270px;
  padding: 10px;
  color: rgb(0, 0, 0);
  border-bottom: 1px solid grey;
  border-radius: 5px 5px 0px 0px;
}
.login-body {
  width: 250px;
  padding: 20px;
  text-align: center;
  border-radius: 0px 0px 5px 5px;
}
.login-icon {
  font-size: 100px;
  padding-bottom: 10px;
}
.login-body button {
  width: 100%;
  padding: 3px;
  margin-bottom: 10px;
}

.login-body input[type='text'],
.login-body input[type='password'] {
  width: calc(100% - 14px);
  padding: 5px;
  margin-bottom: 10px;
}
.login-copyright {
  font-size: 12px;
  padding: 15px 0px 0px 0px;
}
</style>
