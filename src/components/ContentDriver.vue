<template>
  <v-row class="test">
    <v-col md="6" sm="6" cols="12" lg="6" xl="4" class="card_driver">
      <v-card class="mx-auto" max-width="500" outlined v-if="otvet != null">                  
        <div cols="12" class="header-text">
          <h3>Общий</h3>
        </div>       
        <v-row>
          <v-col cols="6" class="eco_proc">
            {{ Math.round(otvet["data"]["eco_proc"]) }}
          </v-col>
          <v-col cols="6" class="bur_proc">
            {{ Math.round(otvet["data"]["bur_proc"]) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.economy" :key="item.index">
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.saving }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.burnout" :key="item.index">
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.saving }}
              </v-col>
            </v-row>
          </v-col>
          <v-col> </v-col>
        </v-row>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
    <v-col md="6" sm="6" cols="12" lg="6" xl="4" class="card_driver">
      <v-card class="mx-auto" max-width="500" outlined v-if="otvet != null">
        <div cols="12" class="header-text">
          <h3>Вывозная работа</h3>
        </div>   
        <v-row>
          <v-col cols="6" class="eco_proc">
            {{ Math.round(otvet["data"]["eco_vyvoz"]) }}
          </v-col>
          <v-col cols="6" class="bur_proc">
            {{ Math.round(otvet["data"]["bur_vyvoz"]) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.economy_v" :key="item.index">
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.trail }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.burnout_v" :key="item.index">
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.trail }}
              </v-col>
            </v-row>
          </v-col>
          <v-col> </v-col>
        </v-row>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
    <v-col md="6" sm="6" cols="12" lg="6" xl="4" class="card_driver">
      <v-card class="mx-auto" max-width="500" outlined v-if="otvet != null">
        <div cols="12" class="header-text">
          <h3>Маневровая работа</h3>
        </div>   
        <v-row>
          <v-col cols="6" class="eco_proc">
            {{ Math.round(otvet["data"]["eco_manevr"]) }}
          </v-col>
          <v-col cols="6" class="bur_proc">
            {{ Math.round(otvet["data"]["bur_manevr"]) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.economy_m" :key="item.index">
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="eco_proc content-driver" cols="6">
                {{ item.manevr }}
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row v-for="item in otvet.data.burnout_m" :key="item.index">
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.driver }}
              </v-col>
              <v-col class="bur_proc content-driver" cols="6">
                {{ item.manevr }}
              </v-col>
            </v-row>
          </v-col>
          <v-col> </v-col>
        </v-row>
        <v-card-actions> </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      otvet: null,
    };
  },
  async mounted() {
    await this.Driver();
  },
  methods: {
    async Driver() {
      let date = Date.now() / 1000 + 7 * 3600;
      //console.log(date)
      await this.reportNow(date);
    },
    async reportNow(date) {
      let dateEnd = date - 860000;
      let dat = {
        dateStart: date,
        dateEnd: dateEnd,
      };
      let { data } = await this.$http.post(
        `${this.$store.getters.getServerUrl}/content/driver/`,
        dat
      );
      this.otvet = { data };
      console.log('otvet:', this.otvet)
      this.otvet.data.economy = this.otvet.data.economy
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);
      this.otvet.data.burnout = this.otvet.data.burnout
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);
      this.otvet.data.economy_v = this.otvet.data.economy_v
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);
      this.otvet.data.burnout_v = this.otvet.data.burnout_v
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);
      this.otvet.data.economy_m = this.otvet.data.economy_m
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);
      this.otvet.data.burnout_m = this.otvet.data.burnout_m
        .sort((a, b) => (a.saving < b.saving ? 1 : -1))
        .slice(0, 5);     
      return { data };
    },
  },
};
</script>
<style scoped>
.header{    
    margin-top: 3% !important;
}
.header-text{
    margin-bottom: 10px !important;
    margin-top: 10px !important;
    text-align: center !important;    
}
.card_driver {
  margin-left: 0% !important;
}
.test {
  margin: 0px !important;
}
.eco_proc {
  color: green !important;
  font-size: 24px !important;
  text-align: center !important;
}
.bur_proc {
  color: rgb(245, 0, 0) !important;
  font-size: 24px !important;
  text-align: center !important;
}
.content-driver {
  margin-top: 0 !important;
  margin-bottom: 15px !important;
  font-size: 16px !important;
}
@media only screen and (max-width: 1250px) {
  .content-driver {
    margin-right: 0px !important;
    font-size: 14px !important;
  }
}
@media only screen and (max-width: 960px) {
  .content-driver {
    margin-right: -5px !important;
  }
}
@media only screen and (max-width: 870px) {
  .content-driver {
    margin-right: -10px !important;
  }
}
@media only screen and (max-width: 825px) {
  .content-driver {
    margin-right: -15px !important;
  }
}
@media only screen and (max-width: 781px) {
  .content-driver {
    margin-right: -20px !important;
    font-size: 13px !important;
  }
}
@media only screen and (max-width: 690px) {
}
</style>