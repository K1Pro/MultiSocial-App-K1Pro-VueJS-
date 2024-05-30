<template>
  <div class="login">
    <div class="login-title">
      <i style="font-size: 30px" class="ba-icons ba-k1pro-regular"></i>
      <span style="font-size: 18px">Pro - {{ appName }}</span>
    </div>

    <div class="login-body">
      <div class="login-username">
        <i class="fa-solid fa-user"></i>
        <input
          type="text"
          name="username"
          placeholder="Username"
          autocomplete="username"
          v-model="username"
          :class="{
            invalid: isUsernameValid,
          }"
          @keyup="removeInvalidLoginFn"
          @keyup.enter="loginFn"
        />
      </div>

      <div class="login-password">
        <i class="fa-solid fa-key"></i>
        <input
          :type="loginPasswordInputType"
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
        <button @click="passwordReveal" style="color: grey">
          <span
            v-if="loginPasswordInputType == 'password'"
            class="fa-solid fa-eye"
          ></span>
          <span
            v-if="loginPasswordInputType == 'text'"
            class="fa-solid fa-eye-slash"
          ></span>
        </button>
      </div>

      <button :disabled="spinLogin" @click.prevent="loginFn">
        <i v-if="spinLogin" class="spin fa-sharp fa-solid fa-circle-notch"></i>
        <span v-else>Log In</span>
      </button>

      <form :action="endPts.accountResetURL" method="post">
        <input type="hidden" name="appName" :value="appName" />
        <input type="hidden" name="referer" :value="endPts.url" />
        <input type="submit" value="Reset" />
        <!-- <button @click="goToURL" type="button">Reset</button>-->
      </form>

      <div class="login-remember">
        <input type="checkbox" name="remember" />Remember me?
      </div>

      <div
        class="validation-message"
        :style="{
          'margin-bottom': msg.login ? '0px' : '35px',
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
      username: '',
      password: '',
      spinLogin: false,
      allInputsError: 'Username and password required',
      loginUsernameErr: 'Username cannot be blank',
      loginPasswordErr: 'Password cannot be blank',
      loginUsernamePasswordErr: 'Username or password is incorrect',
      loginPasswordInputType: 'password',
    };
  },

  computed: {
    ...Pinia.mapWritableState(useUserStore, [
      'accessToken',
      'sessionID',
      'msg',
      'endPts',
      'appName',
    ]),
    isUsernameValid() {
      return (
        this.msg.login.toLowerCase().includes('incorrect') ||
        (this.username.length < 1 &&
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
        this.username != '' &&
        this.password != '' &&
        this.password.length < 20
      ) {
        this.msg.login = '';
        this.spinLogin = true;
        this.postLogin();
      } else {
        if (this.username == '' && this.password == '') {
          this.msg.snackBar = this.allInputsError;
          this.msg.login = this.allInputsError;
        } else if (this.username == '') {
          this.msg.snackBar = this.loginUsernameErr;
          this.msg.login = this.loginUsernameErr;
        } else if (this.password == '') {
          this.msg.snackBar = this.loginPasswordErr;
          this.msg.login = this.loginPasswordErr;
        } else if (this.password.length >= 20) {
          this.username = '';
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
            Username: this.username,
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
            this.username = '';
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

    passwordReveal() {
      this.loginPasswordInputType == 'password'
        ? (this.loginPasswordInputType = 'text')
        : (this.loginPasswordInputType = 'password');
    },
  },
};
</script>

<style>
.login {
  width: 290px;
}
.login-title {
  padding: 20px;
}
.login-body {
  padding: 10px 20px 20px 20px;
  text-align: center;
}
.login-body button,
.login-body input[type='submit'] {
  width: 100%;
  padding: 5px;
  margin-bottom: 10px;
}
.login-username {
  position: relative;
}
.login-password {
  position: relative;
}
.login-username i,
.login-password i {
  position: absolute;
  top: 7px;
  left: 7px;
  color: grey;
}
.login-password button {
  width: 30px;
  position: absolute;
  top: 2px;
  right: 0px;
  background: none;
  border: none;
}
.login-body input[type='text'],
.login-body input[type='password'] {
  width: 100%;
  padding: 5px 0px 5px 30px;
  margin-bottom: 10px;
}
.login-remember {
  white-space: nowrap;
  overflow: hidden;
  padding: 6px;
  text-align: left;
  font-size: 12px;
  border-width: 1px;
  border-radius: 2px;
  border-style: solid;
  border-color: light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
  background-color: white;
  margin-bottom: 10px;
}
.login-remember input {
  margin: 0px 5px 0px 0px;
}
.login-copyright {
  font-size: 12px;
  padding: 15px 0px 0px 0px;
}
</style>
