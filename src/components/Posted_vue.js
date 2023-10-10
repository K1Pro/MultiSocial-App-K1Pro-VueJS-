//<script>
export default {
  name: 'Posted',

  template: /*html*/ `
    <h2>Posted</h2>
  `,

  props: ['accessToken'],

  data() {
    return {};
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

  created() {
    this.getPosted();
  },
};
// </script>
