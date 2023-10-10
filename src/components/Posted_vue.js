//<script>
export default {
  name: 'Posted',

  template: /*html*/ `
    <table>
    <tr>
      <th>Post Date</th>
      <th>Post Link</th>
    </tr>
    <tr v-for="value in posted">
      <td v-for="(value, key) in Object.entries(value).filter(([key, val]) => {return (key === 'date')})">{{value[1].slice(0,16)}}</td>
      <td v-for="(value, key) in Object.entries(value).filter(([key, val]) => {return (key === 'link')})"><a :href="value[1]" target="_blank">{{ value[1].split('.')[1].charAt(0).toUpperCase() }}{{ value[1].split('.')[1].slice(1) }} Post</a></td>
    </tr>
    </table>
  `,

  props: ['accessToken', 'newPostTimestamp'],

  data() {
    return { posted: '' };
  },

  methods: {
    async getPosted() {
      try {
        const response = await fetch(servrURL + 'controller/posted.php', {
          method: 'GET',
          headers: {
            Authorization: this.accessToken,
            'Cache-Control': 'no-store',
          },
        });
        const getPostedJSON = await response.json();
        if (getPostedJSON.success) {
          this.posted = getPostedJSON.data.posted;
          console.log(getPostedJSON);
        } else {
          console.log('no posts retrieved');
        }
      } catch (error) {
        this.error = error.toString();
        console.log(error.toString());
      }
    },
  },

  watch: {
    newPostTimestamp(newTS, oldTS) {
      console.log(newTS);
      this.getPosted();
    },
  },

  created() {
    this.getPosted();
  },
};
// </script>
