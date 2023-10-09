//<script> <li v-for="(value, key) in userDataNoLoginActivity">{{ key }}: {{ value }}</li>   <span v-if="key !== 'LoginActivity'">{{ key }}: {{ value }}</span>
export default {
  name: 'AccountInfo',

  template: /*html*/ `
    <div class="accountinfo">
      <h2>Account Info</h2>
      <ul>
          <li v-for="value in Object.keys(userData).filter(e => {return (e !== 'LoginActivity')})">{{ value }}: {{ userData[value] }}</li>
      </ul>
      <p></p>
    </div>
  `,

  props: ['userData'],

  data() {
    return {};
  },
};
// </script>
