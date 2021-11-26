<template>
<div class="container">
  <v-card color="basil">
    <div class="login">       
        <span v-if="isLoggedIn"> | <a @click="logout">Выйти</a></span>
    </div>
    <v-card-title class="text-center justify-center py-6">
      <h1 class="basil--text">Электронный маршрутный лист</h1>
    </v-card-title>
    <v-col md=12>
    <v-tabs  v-model="tab" background-color="transparent" color="basil" grow>        
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>
    </v-col> 
  </v-card>  
<v-tabs-items v-model="tab">
      <v-tab-item>
        <v-card  flat>
          <Content />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card  flat>
          <v-card-text><Data /></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card  flat>
          <v-card-text><Norms /></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card  flat>
          <v-card-text><Loko /></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card  flat>
          <v-card-text><Driver /></v-card-text>
        </v-card>
      </v-tab-item> 
      <v-tab-item>
        <v-card  flat>
          <v-card-text><Report /></v-card-text>
        </v-card>
      </v-tab-item>       
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
  name: "Nav",
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
  data() {
    return {
      tab: null,
      items: ["Главная", "Внести данные", "Нормы", "Локомотивы", "Машинисты", "Отчеты"],      
    };
  },
  methods: {
      logout: function () {
        this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/login')
        })
      }
    },
}
</script>
<style scoped>

</style>