<template>
  <section>
    <div class="container bord">
      <v-row class="content-card">
        <Driver></Driver>
      </v-row>
      <!--<v-row class="content-card m1">
        <v-row class="w100">
          <v-col cols="12" class="content-header">
            <h3>Локомотивы</h3>
          </v-col>
        </v-row>
        <v-row class="w100">
          <v-col cols="12" class="content-text">
            <p>Пережигающие локомотивы</p>
          </v-col>
        </v-row>
      </v-row>
      <v-row class="content-card m1">
        <v-row class="content-text w100">
          <v-col cols="12" class="content-header">
            <h3>Участки</h3>
          </v-col>
        </v-row>
        <v-row class="w100">
          <v-col cols="12" md="6" class="content-text bl">
            <v-row>
              <v-col cols="12" class="content-text bb">
                <h4>Черногорский</h4>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="content-text">
                <p>Черногорский</p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" class="content-text">
            <v-row>
              <v-col cols="12" class="content-text bb">
                <h4>Изыхский</h4>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="content-text">
                <p>Изыхский</p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-row>-->
    </div>
  </section>
</template>
<script>
import Driver from './ContentDriver.vue';
export default {
    components: {
      Driver      
    },
}
</script>
<style scoped>
.test{
    margin-top: 0px !important;
}
.content-vcard{
    padding-bottom: 25px;
}
</style>