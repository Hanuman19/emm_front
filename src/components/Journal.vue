<template>
  <div class="report-table">
    <div class="loko">
      <h4>Журнал</h4>
    </div>
    <v-row>
      <v-col cols="12" sm="6"  lg="4">
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
            <v-btn text color="primary" @click="$refs.menu.save(dates)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row class="row-btn-report" >
      <v-btn class="ma-2" outlined color="indigo" @click="shape">
        Сформировать
      </v-btn>
    </v-row>
    <!--<v-row>
      <v-simple-table>
        <tbody>
          <tr>
            <td class ="journal-td"></td>
            <td class="journal-col" v-for="(val, key) in datesTD" :key="key">{{val}}</td>
            <td></td>
          </tr>
          <tr v-for="(val, key) in result" :key="key">
            <td class ="journal-td">{{val.loko}}</td>
            <td v-for="(res, key) in val.result" :key="key" class ="journal-td">
                    <v-col cols="12" md="12" lg="12" xl="12">
                        <v-row>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> Н </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> К </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> Ф </v-col>
                            <v-col class="journal-col" cols="12" md="12" lg="12" xl="12"> <h3>1-я смена</h3> </v-col>
                        </v-row>
                        <v-row>                  
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena1.dtStart}} </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena1.dtEnd}} </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena1.fact}} </v-col>                  
                        </v-row>
                        <v-row>
                            <v-col class="journal-col" cols="12" md="12" lg="12" xl="12"> <h3>2-я смена</h3> </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena2.dtStart}} </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena2.dtEnd}} </v-col>
                            <v-col class="journal-col" cols="4" md="4" lg="4" xl="4"> {{res.smena2.fact}} </v-col>
                        </v-row>
                    </v-col>
            </td>
            <td class ="journal-td">{{val.loko}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row>
    <v-row>-->
      <v-expansion-panels focusable>
        <!--Цикл сюда-->
        <v-expansion-panel
          v-for="(val, key) in result" :key="key"
        >
          <v-expansion-panel-header>{{val.loko}}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th>
                    Дата
                  </th>
                  <th>                    
                  </th>
                  <th>
                    Начало смены                    
                  </th>
                  <th>
                    Окончание смены                    
                  </th>
                  <th>
                    Фактический расход                    
                  </th>
                  <th>                    
                  </th>
                  <th>
                    Начало смены                    
                  </th>
                  <th>
                    Окончание смены                    
                  </th>
                  <th>
                    Фактический расход                    
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(res, key) in val.result" :key="key">
                  <td>
                    {{res.dates}}
                  </td>
                  <td> 1-я Смена:</td>
                  <td>{{res.smena1.dtStart}}</td>
                  <td>{{res.smena1.dtEnd}}</td>
                  <td>{{res.smena1.fact}}</td>
                  <td> 2-я Смена:</td>
                  <td>{{res.smena2.dtStart}}</td>
                  <td>{{res.smena2.dtEnd}}</td>
                  <td>{{res.smena2.fact}}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>
  </div>
</template>
<script>
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
  data() {
    return {
      dates: [],
      result:[],      
      datesTD:[],
      datesRes:[]
    };
  },
  methods: {
      dateFormat(item, d) {
        let b = 1;        
          item = this.timeConverter(item, true);         
        return item;
        },
        timeConverter(UNIX_timestamp, d, b) {     
        var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");
        if (b == 1) {
            var a = new Date((UNIX_timestamp-25200) * 1000);
            //console.log(a);
            return a
        } else {
            if(d==true){var time = dt.toLocaleString()}
            else{var time = dt.toLocaleString(DateTime.DATETIME_SHORT)} 
            return time;
            }
        },
    async shape() {
        this.datesTD=[];        
        this.dates.sort();
        let loko = [];
        let loadData=[]; 
        let datesRes = [];
        let res = {loko:null,
                    result:[]
                    }
        let res2 ={dates:null,
                    smena1:{dtStart:0,
                            dtEnd:0,
                            fact:0},
                    smena2:{dtStart:0,
                            dtEnd:0,
                            fact:0}
                   }
        let dateStart = Math.round(new Date(this.dates[0]).getTime() / 1000.0);
        let dateEnd =
            Math.round(new Date(this.dates[1]).getTime() / 1000.0) + 86400;
        let data = {
            dateStart: dateStart,
            dateEnd: dateEnd,
        };
        loadData = await this.$http
          .post(`${this.$store.getters.getServerUrl}/report/`, data)        
        const clonedData = loadData.data.map(a => ({...a})); 
              
        if (datesRes.length == 0){ 
            for (var i = 0; i < clonedData.length; i++) {           
                datesRes.push(clonedData[i]['date'])                
            }
        } 
        if (loko.length == 0){ 
            for (var i = 0; i < clonedData.length; i++) {           
                loko.push(clonedData[i]['lokoNumber'])                
            }
        }  
        loko = Array.from(new Set(loko));
        datesRes = Array.from(new Set(datesRes)).sort();
        console.log(datesRes) 
        if (this.result.length == 0){
            for(var l = 0;l < loko.length; l++ ){
                res['loko']=loko[l]
                for (var r = 0; r < datesRes.length; r++){
                    res2['dates'] = datesRes[r]
                    res['result'].push(res2)
                    res2 = {dates:null,
                            smena1:{dtStart:0,
                                    dtEnd:0,
                                    fact:0},
                            smena2:{dtStart:0,
                                    dtEnd:0,
                                    fact:0}
                        }
                    //console.log('res2',res2)
                }
                this.result.push(res)
                res = {loko:null,
                        result:[]
                        } 
            }
        }
         
        for (var i = 0; i < clonedData.length; i++) {
            for (var j = 0; j < this.result.length; j++) {
                if(clonedData[i]['lokoNumber'] == this.result[j]['loko']){
                    for(var r = 0;r < this.result[j]['result'].length; r++){
                        if(clonedData[i]['date']==this.result[j]['result'][r]['dates']){
                            if(clonedData[i]['smena']==1){
                                this.result[j]['result'][r]['smena1']['dtStart']=clonedData[i]['dtStart']
                                this.result[j]['result'][r]['smena1']['dtEnd']=clonedData[i]['dtEnd']
                                this.result[j]['result'][r]['smena1']['fact']=clonedData[i]['fact_result']
                            }
                            if(clonedData[i]['smena']==2){           
                                this.result[j]['result'][r]['smena2']['dtStart']=clonedData[i]['dtStart']
                                this.result[j]['result'][r]['smena2']['dtEnd']=clonedData[i]['dtEnd']
                                this.result[j]['result'][r]['smena2']['fact']=clonedData[i]['fact_result']
                            }
                            
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.result.length; i++){
          for (var j = 0; j < this.result[i]['result'].length; j++){
            this.result[i]['result'][j]['dates'] = this.dateFormat(this.result[i]['result'][j]['dates'])
          }         
        }
        //console.log('результат', this.result)     
    },
  },
};
</script>
<style scoped>
    .journal-col{
        padding-right: 0 !important;
        padding-left: 5px !important;
        padding-bottom: 0 !important;
        padding-top: 5px !important;
        text-align: center !important;
    }
    .journal-td{
        min-width: 150px !important;
    }
</style>