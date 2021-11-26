<template>
<div class="report-driver">
  <div class="loko">
      <h4>Отчет по машинистам</h4>
    </div>  
    <v-row>   
    <v-col
      cols="12"
      sm="6"
    >
      <v-menu
        ref="menu"        
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="dates"
            multiple
            chips
            small-chips
            label="Выберите период"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker v-model="dates" range locale="ru-ru">
          <v-spacer></v-spacer>          
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(dates)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-col>
  </v-row>
<v-row>  
  <v-btn
    class="ma-2"
    outlined
    color="indigo"
    @click="shape"
  >
    Сформировать
  </v-btn>  
</v-row>
<v-row>
  <v-col cols="12" sm="6"  md="6" lg="4" xl="3" class="card-driver" v-for="item in driverTest" :key="item.index">
    <v-card
      class="mx-auto"    
    >
      <v-card-text>       
        <h4 class="text--primary">
          {{item.driver}}
        </h4>        
        <v-col>
          <table style="color:#000" width="100%">
            <tr>
              <td></td> 
              <td><p class="td-driver">Вывозная работа</p></td> 
              <td><p class="td-driver">меневровая работа</p></td>    
            </tr> 
            <tr>
              <td>Норма</td>               
              <td><p class="td-driver">{{item.norm_trail}}</p></td> 
              <td><p class="td-driver">{{item.norm_manevr}}</p></td>  
            </tr> 
            <tr>
              <td>Факт</td> 
              <td><p class="td-driver">{{item.fact_trail}}</p></td> 
              <td><p class="td-driver">{{item.fact_manevr}}</p></td>                 
            </tr> 
            <tr>
              <td>+Э/-П</td> 
              <td><p class="td-driver">{{item.saving_trail}}</p></td> 
              <td><p class="td-driver">{{item.saving_manevr}}</p></td>                 
            </tr> 
            <tr>
              <td>Итого:</td>
              <td><p class="td-driver">{{item.saving_trail+item.saving_manevr}}</p></td> 
              <td></td>                 
            </tr>            
          </table>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-dialog
                transition="dialog-bottom-transition"
                max-width="1400"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn 
                    v-bind="attrs"
                    v-on="on"
                    text
                    color="indigo"                
                    @click="razbor(item.driver)"
                  >
                    Подробно
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar
                      color="primary"
                      dark
                    ><v-btn
                        text
                        @click="dialog.value = false"
                      >Закрыть</v-btn>
                      {{item.driver}}
                    </v-toolbar>
                    <v-card-text>
                        <v-simple-table>                          
                          <tbody>
                            <tr> 
                              <td rowspan="2">Дата</td>           
                              <td rowspan="2">Смена</td>
                              <td colspan="3">Вывозная работа</td>
                              <td colspan="3">Маневровая работа</td>                              
                              <td colspan="3">Итого:</td>
                              
                            </tr>
                            <tr>                  
                              <td>Норма</td>
                              <td>Факт</td>
                              <td>+Э/-П</td>
                              <td>Норма</td>
                              <td>Факт</td>
                              <td>+Э/-П</td>
                              <td>Норма</td>
                              <td>Факт</td>
                              <td>+Э/-П</td>                              
                            </tr>
                            <tr v-for="val in driver_razbor" :key="val.index">
                              <td> 
                                <v-dialog
                                  transition="dialog-bottom-transition"
                                  max-width="1400"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn 
                                      v-bind="attrs"
                                      v-on="on"
                                      text
                                      color="indigo"                
                                      @click="routesheetDriver(item.driver,val.id)"
                                    >
                                     {{val.date}}
                                    </v-btn>
                                  </template>
                                  <template v-slot:default="dialog">
                                    <v-card>
                                      <v-toolbar
                                        color="primary"
                                        dark
                                      ><v-btn
                                          text
                                          @click="dialog.value = false"
                                        >Закрыть</v-btn>
                                        {{item.driver}}
                                      </v-toolbar>
                                      <v-card-text>                                        
                                              <v-row class="report-table">
                                                  <Routesheet/>
                                              </v-row>                                           
                                      </v-card-text>
                                      <v-card-actions class="justify-end">
                                        <v-btn
                                          text
                                          @click="dialog.value = false"
                                        >Закрыть</v-btn>
                                      </v-card-actions>
                                    </v-card>
                                  </template>
                                </v-dialog>
                              </td>
                              <td>{{val.smena}}</td>
                              <td>{{val.norm_trail}}</td>
                              <td>{{val.fact_trail}}</td>                              
                              <td v-if="val.saving_trail<0"  v-bind:style="styleObjectRed">{{val.saving_trail}}</td>
                              <td v-if="val.saving_trail>0"  v-bind:style="styleObjectGreen">{{val.saving_trail}}</td>
                              <td>{{val.norm_manevr}}</td>
                              <td>{{val.fact_manevr}}</td>
                              <td v-if="val.saving_manevr<0"  v-bind:style="styleObjectRed">{{val.saving_manevr}}</td>
                              <td v-if="val.saving_manevr>0"  v-bind:style="styleObjectGreen">{{val.saving_manevr}}</td>                             
                              <td>{{val.norm_result}}</td>
                              <td>{{val.fact_result}}</td>
                              <td v-if="val.saving_result<0"  v-bind:style="styleObjectRed">{{val.saving_result}}</td>
                              <td v-if="val.saving_result>0"  v-bind:style="styleObjectGreen">{{val.saving_result}}</td>
                              
                            </tr>
                          </tbody>
                        </v-simple-table>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn
                        text
                        @click="dialog.value = false"
                      >Закрыть</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
        </v-dialog> 
      </v-card-actions>
    </v-card>
  </v-col>
</v-row>
<v-pagination
    v-if="driverTest.length != 0"
    v-model="page"
    :length="countPage"
    :total-visible="7"
></v-pagination>
</div>
</template>
<script>
import Routesheet from '../components/Sheet/TDRoutesheet.vue';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
  data(){
    return{
      driver_razbor:[],
      page: 1,
      count:8,
      countPage:null,
      dates: [],
      driver:[],
      driverRes:[],
      driverTest:[],
      load_component:false,
      styleObjectRed: {
        color: 'red',
        fontSize: '14px'
      },
      styleObjectGreen: {
        color: 'green',
        fontSize: '14px'
      }      
    }
  },
  components: {
    Routesheet     
  },
  watch:{
    page(val){
      var test = val*this.count
      if(test == this.count){
        this.driverTest=this.driverRes.slice(0,this.count)
      }else{
        this.driverTest=this.driverRes.slice(test-this.count,test)
      }
      //console.log(this.driverTest)
    }
  },
  methods: {    
    async routesheetDriver(driver, id){
      //console.log(driver, id)
      this.$store.state.arrDataRouteSheet = []
      this.$store.state.reportID = id
      this.$store.state.driver = driver
      const clonedRoutesheet = this.driver.map(a => ({...a}));
      this.$store.state.arrDataRouteSheet = clonedRoutesheet
    },
    dateFormat(item, d) { 
      item = this.timeConverter(item, d);         
      return item;
    },
    timeConverter(UNIX_timestamp, d) {     
      var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");      
      if(d==true){var time = dt.toLocaleString()}
      else{var time = dt.toLocaleString(DateTime.TIME_24_SIMPLE)} 
      return time;         
    },
    razbor(item){
      this.driver_razbor=[];
      const clonedDriver = this.driver.map(a => ({...a}));
      for (var i = 0; i<clonedDriver.length;i++){
        if (clonedDriver[i]['driver']==item){
          clonedDriver[i]['date']=this.dateFormat(clonedDriver[i]['date'], true)
          this.driver_razbor.push(clonedDriver[i])
        }
      }
      this.driver_razbor.sort((a, b) => a.smena > b.smena ? -1 : 1);
      this.driver_razbor.sort((a, b) => a.date > b.date ? 1 : -1);
      //console.log(this.driver_razbor)
    },
    async shape(){
      this.driver=[]
      this.driverRes=[]
      let flag = false;
      let dateStart = Math.round(new Date(this.dates[0]).getTime()/1000.0)
      let dateEnd = Math.round(new Date(this.dates[1]).getTime()/1000.0) + 86400
      let data = { 
        dateStart:dateStart,        
        dateEnd:dateEnd,
        report: 'reportDriver'
      };
      //console.log(data)
      if (this.driver.length == 0){
        this.driver = await this.$http
              .post(`${this.$store.getters.getServerUrl}/report/`, data)
              .then((response) => response.data);  
      }
      //console.log(this.driver) 
      const clonedDriver = this.driver.map(a => ({...a})); 
      if (this.driverRes.length == 0){ 
        for (var i = 0; i < clonedDriver.length; i++) {
          flag = false;
          if(this.driverRes.length == 0){
            clonedDriver[i]["norm_trail"]=Number(clonedDriver[i]["norm_trail"])
            clonedDriver[i]["norm_result"]=Number(clonedDriver[i]["norm_result"])           
            clonedDriver[i]["norm_manevr"]=Number(clonedDriver[i]["norm_manevr"])
            clonedDriver[i]["fact_trail"]=Number(clonedDriver[i]["fact_trail"])
            clonedDriver[i]["fact_result"]=Number(clonedDriver[i]["fact_result"])           
            clonedDriver[i]["fact_manevr"]=Number(clonedDriver[i]["fact_manevr"])
            clonedDriver[i]["saving_trail"]=Number(clonedDriver[i]["saving_trail"])
            clonedDriver[i]["saving_result"]=Number(clonedDriver[i]["saving_result"])           
            clonedDriver[i]["saving_manevr"]=Number(clonedDriver[i]["saving_manevr"]) 
            clonedDriver[i]["saving_manevr"]=Math.round(clonedDriver[i]["saving_manevr"]) 
            clonedDriver[i]["saving_trail"]=Math.round(clonedDriver[i]["saving_trail"])         
            this.driverRes.push(clonedDriver[i] ) 
            //console.log(clonedDriver[i])
          }else{
            for (var j = 0; j < this.driverRes.length; j++) {
              if (clonedDriver[i]["driver"] == this.driverRes[j]["driver"]) {

                this.driverRes[j]["norm_trail"] =
                  Number(this.driverRes[j]["norm_trail"]) +
                  Number(clonedDriver[i]["norm_trail"]);
                this.driverRes[j]["norm_trail"] = Math.round(this.driverRes[j]["norm_trail"])
                this.driverRes[j]["fact_trail"] += clonedDriver[i]["fact_trail"];
                this.driverRes[j]["saving_trail"] =
                  Number(this.driverRes[j]["saving_trail"]) +
                  Number(clonedDriver[i]["saving_trail"]);
                this.driverRes[j]["saving_trail"] = Math.round(this.driverRes[j]["saving_trail"])
                this.driverRes[j]["norm_manevr"] =
                  Number(this.driverRes[j]["norm_manevr"]) +
                  Number(clonedDriver[i]["norm_manevr"]);
                this.driverRes[j]["norm_manevr"] = Math.round(this.driverRes[j]["norm_manevr"])
                this.driverRes[j]["fact_manevr"] += clonedDriver[i]["fact_manevr"];
                this.driverRes[j]["fact_manevr"] = Math.round(this.driverRes[j]["fact_manevr"])
                this.driverRes[j]["saving_manevr"] = Number(this.driverRes[j]["saving_manevr"]) + Number(clonedDriver[i]["saving_manevr"]);
                this.driverRes[j]["saving_manevr"] = Math.round(this.driverRes[j]["saving_manevr"])
                flag = true;
              }              
            }
            if (flag == false) {
                clonedDriver[i]["norm_trail"]=Number(clonedDriver[i]["norm_trail"])
                clonedDriver[i]["norm_result"]=Number(clonedDriver[i]["norm_result"])           
                clonedDriver[i]["norm_manevr"]=Number(clonedDriver[i]["norm_manevr"])
                clonedDriver[i]["fact_trail"]=Number(clonedDriver[i]["fact_trail"])
                clonedDriver[i]["fact_result"]=Number(clonedDriver[i]["fact_result"])           
                clonedDriver[i]["fact_manevr"]=Number(clonedDriver[i]["fact_manevr"])
                clonedDriver[i]["saving_trail"]=Number(clonedDriver[i]["saving_trail"])
                clonedDriver[i]["saving_result"]=Number(clonedDriver[i]["saving_result"])           
                clonedDriver[i]["saving_manevr"]=Number(clonedDriver[i]["saving_manevr"])
                clonedDriver[i]["saving_manevr"]=Math.round(clonedDriver[i]["saving_manevr"])
                clonedDriver[i]["saving_trail"]=Math.round(clonedDriver[i]["saving_trail"])
                this.driverRes.push(clonedDriver[i]);
            } 
          }
        }
        //console.log(this.driverRes)
        this.countPage=parseInt(this.driverRes.length/this.count)
        if(this.driverRes.length % this.count > 0) {
          this.countPage++;
        }
        this.driverTest=this.driverRes.slice(0,this.count)
      }
    }
  }
}  

</script>
<style scoped>
.td-driver{
  margin-left: 3% !important;
}
.text--primary{
  padding-top: 3% !important;
  text-align: center !important;
}
</style>