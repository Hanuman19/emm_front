<template>
  <v-app>
    <v-main>      
        <router-view/> 
      <span v-if="isLoggedIn"><Footer /></span>   
     
    </v-main>
  </v-app>
</template>
<style> 
  @import "assets/css/font-awesome.min.css";
  @import "assets/css/style.css"; 
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;700&display=swap'); 
  @import "assets/css/vue-multiselect.min.css";  
</style>
<script>
import Footer from './components/Footer';
import Multiselect from 'vue-multiselect'

export default {
  name: 'App',

  components: {   
    Footer,
    Multiselect
  },
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
    },
  data: () => ({
    //
  }),
  /*created: function () {
    this.$http.interceptors.response.use( 
      function(error){      
      return Promise.reject(error);
    });
  }*/
};
</script>