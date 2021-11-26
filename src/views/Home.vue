<template>
<div class="container">
  <v-card color="basil">
    <div class="login">       
        <span v-if="isLoggedIn">
          {{user}}
          <a @click="logout">Выйти</a>
        </span>
    </div>
    <v-card-title class="text-center justify-center py-6">
      <h1 class="basil--text">Электронный маршрутный лист</h1>
    </v-card-title>
    <v-col md=12>
    <v-tabs  v-model="tab" background-color="transparent" color="basil" grow next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline">        
      <v-tab v-for="item in items" :key="item" >        
          {{ item }}
        
      </v-tab>
    </v-tabs>
    </v-col> 
  </v-card>  
  <v-tabs-items v-model="tab">
    <div class="tab-menu">
      <v-tab-item v-for="item in menu" :key="item.id">        
         <v-card  flat>
          <v-card-text>
            <div v-if="item.element_type == 'main_menu'">
              <component v-bind:is="item.link"></component>
            </div>
          </v-card-text>
        </v-card>
      </v-tab-item>  
    </div>        
  </v-tabs-items>
</div>
</template>
<script>
import Content from '../components/Content.vue';
import Norms from '../components/Norms.vue';
import Loko from '../components/Loko.vue';
import Driver from '../components/Driver.vue';
import Data from '../components/Data.vue';
import Report from '../components/Report.vue';
export default {
  name: "Home",
  components: { 
    Content,
    Norms,
    Loko,
    Driver,
    Data,
    Report   
  },
  computed : {
      isLoggedIn : function(){ return this.$store.getters.isLoggedIn}      
    },
  async mounted() {
    await this.test();
    await this.loadMenu();
    await this.loadUser();
  },
  data() {
    return {
      tab: null,
      items: [],
      menu : [],
      user: null      
    };
  },   
  methods: {
    async loadUser(){
      let {data} = await this.$http
      .get(`${this.$store.getters.getServerUrl}/user`)
      this.user=data
    },
      test (){
        if(this.$store.state.token == '' || this.$store.state.token == null){
          this.$router.push('/login')
        }
      },
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      },
      async loadMenu(){
        this.menu = await this.$http
        .get(`${this.$store.getters.getServerUrl}/menu`)
        .then((response) => response.data);
        this.$store.state.menu = this.menu
        for(var i=0;i<this.menu.length;i++){
          if (this.menu[i]['element_type'] == 'main_menu'){           
            this.items.push(this.menu[i]['name'])
          }            
        }
      }
    },
}
</script>
<style scoped>

</style>