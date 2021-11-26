<template> 
<div>
<div class="text-center" style="text-align: center" v-if="load_component == false">
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
</div>   
<div v-else>
 
 <v-row>
      <v-col cols="12">
        <v-simple-table> 
          <thead>  
            <tr class="td-centre td-1">
              <td>
                <div v-if="routesheetPermission==true">
                  <div :key="EditKey">
                    <v-dialog
                    fullscreen
                            hide-overlay
                            transition="dialog-bottom-transition"
                            :retain-focus="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                          v-bind="attrs"
                          v-on="on"
                          text
                          color="indigo"
                        >
                          Редактировать
                        </v-btn>
                      </template>
                      <template v-slot:default="dialog">
                        <v-card>
                          <v-toolbar
                            color="primary"
                            dark
                          ><v-btn
                              text
                              @click="closeDialog()"
                            ><v-icon>mdi-close</v-icon></v-btn>                      
                          </v-toolbar>
                          <v-card-text>
                            <EditRoutesheet :key="EditKey" />
                          </v-card-text>
                          <v-card-actions class="justify-end">
                            <v-btn
                              text
                              @click="closeDialog()"
                            >Закрыть</v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </div>
                </div>
              </td>
              <td colspan="5">Маршрутный лист машиниста ЛД Промтранс</td>    
            </tr>
          </thead>
          <tbody> 
            <tr class="td-1">
              <td colspan="5" class="td-centre">{{dataSheet['date']}}</td><td>{{dataSheet['smena']}} cмена</td>   
            </tr> 
            <tr>
              <td colspan="2" class="td-1">Серия</td><td class="td-2">Дт на начало смены</td><td class="td-2"></td><td class="td-2">Дт на конец смены</td><td class="td-2"></td>
            </tr>
            <tr>
              <td colspan="2" class="td-1">{{dataSheet['lokoNumber']}}</td><td class="td-2">Расход ДТ по факту:</td><td class="td-2">{{dataSheet['dtTrailFact']+dataSheet['dtManevrFact']}}</td>
              <td class="td-2">Расход ДТ по норме:</td><td class="td-2">{{dataSheet['dtTrailNorm']+dataSheet['dtManevrNorm']}}</td>
            </tr>
            <tr>
              <td colspan="2" class="td-1">{{dataSheet['vDriver']}}</td><td colspan="2" class="td-2 text-align: right">Экипировка:</td><td class="td-2">{{dataSheet['equipment']}}</td>
              <td rowspan="5" class="td-2">
                <div v-if="dataSheet['savingTrailFact'] + dataSheet['savingManevrFact'] < 0">
                  <div v-bind:style="styleObjectRed">{{dataSheet['savingTrailFact'] + dataSheet['savingManevrFact']}}
                  </div>
                </div>
                <div v-else>
                  <div v-bind:style="styleObjectGreen">{{dataSheet['savingTrailFact'] + dataSheet['savingManevrFact']}}
                  </div>
                </div>                
              </td>
            </tr>
            <tr>
              <td colspan="2" rowspan="2" class="td-1">Расход ДТ по видам работ</td><td class="td-2">Вывозная работа</td>
              <td class="td-2">Маневровая работа</td><td class="td-2">Простой</td>
            </tr>
            <tr>
              <td class="td-2">{{dataSheet['dtTrailFact']}}</td><td class="td-2">{{dataSheet['dtManevrFact']}}</td><td class="td-2"></td>
            </tr> 
            <tr>
              <td colspan="2" rowspan="2" class="td-1">Время работы по видам работ</td><td class="td-2">Вывозная работа</td>
              <td class="td-2">Маневровая работа</td><td class="td-2">Простой</td>
            </tr>
            <tr>
              <td class="td-2">{{dataSheet['timeTrailFact']}}</td><td class="td-2">{{dataSheet['timeManevrFact']}}</td><td class="td-2"></td>
            </tr> 
          </tbody>                  
        </v-simple-table>        
      </v-col> 
    </v-row>
   <v-row style="padding-bottom:10px">
      <v-col cols="12">
        <v-simple-table>
          <thead>
            <tr>
              <td colspan="10" class="td-centre td-1">Вывозная работа</td>    
            </tr>
          </thead>
          <tbody> 
            <tr class="td-1">
              <td >Станция отправления</td><td  class="td-1">Станция прибытия</td><td>Время начала операции</td><td>Время окончания операции</td><td>Время работы, мин.</td><td>Гр. вагоны</td><td>Пор. вагоны</td><td>Факт. расход ДТ, л.</td><td>Норма, л.</td><td>+Э/-П</td>
            </tr> 
            <tr v-for="val in routesheetRes" :key="val.Index">
              <td class="td-1">{{val.stationDep}}</td><td class="td-1">{{val.stationArr}}</td><td class="td-2">{{val.dateStart}}</td><td class="td-2">{{val.dateEnd}}</td>
              <td class="td-2">{{val.work_time}}</td><td class="td-2">{{val.gp}}</td><td class="td-2">{{val.pv}}</td><td class="td-2">{{val.fact}}</td>
              <td class="td-2">{{val.norm}}</td>
              <td class="td-2">
                <div v-if="val.saving < 0">
                  <div v-bind:style="styleObjectRed">{{val.saving}}
                  </div>
                </div>
                <div v-else>
                  <div v-bind:style="styleObjectGreen">{{val.saving}}
                  </div>
                </div>
              </td>
            </tr>
            <tr class="td-3">
              <td colspan="4">Итого:</td><td>{{dataSheet['timeTrailFact']}}</td><td>{{dataSheet['gvTrail']}}</td><td>{{dataSheet['pvTrail']}}</td><td>{{dataSheet['dtTrailFact']}}</td><td>{{dataSheet['dtTrailNorm']}}</td><td>
                <div v-if="dataSheet['savingTrailFact'] < 0">
                  <div v-bind:style="styleObjectRed">{{dataSheet['savingTrailFact']}}
                  </div>
                </div>
                <div v-else>
                  <div v-bind:style="styleObjectGreen">{{dataSheet['savingTrailFact']}}
                  </div>
                </div>
              </td>
            </tr> 
            <tr>
              <td colspan="10" class="td-centre td-1">Маневровая работа</td>    
            </tr> 
            <tr class="td-1">
              <td colspan="2">Станция </td><td>Время начала операции</td><td>Время окончания операции</td><td>Время работы, мин.</td><td>Гр. вагоны</td><td>Пор. вагоны</td><td>Факт. расход ДТ, л.</td><td>Норма, л.</td><td>+Э/-П</td>
            </tr> 
            <tr v-for="(val, key1) in routesheetResManevr" :key="key1">
              <td  class="td-1">{{val.station}}</td> 
              <td v-if="val.prostoy == true" class="td-2">Простой</td><td v-else-if="val.thrust == true" class="td-2">Вытяжка</td><td v-else-if="val.obduv == true" class="td-2">Обдув</td>
              <td v-else-if="val.obrabotka == true" class="td-2">Обработка вагонов</td><td v-else-if="val.burning == true" class="td-2">Прожиг</td><td v-else class="td-2"></td> 
              <td class="td-2">{{val.dateStart}}</td><td class="td-2">{{val.dateEnd}}</td>
              <td class="td-2">{{val.work_time_manevr}}</td><td class="td-2">{{val.gp}}</td><td class="td-2">{{val.pv}}</td><td class="td-2">{{val.fact_manevr}}</td>
              <td class="td-2">{{val.norm_manevr}}</td>
              <td class="td-2">
                <div v-if="val.saving_manevr < 0">
                  <div v-bind:style="styleObjectRed">{{val.saving_manevr}}
                  </div>
                </div>
                <div v-else>
                  <div v-bind:style="styleObjectGreen">{{val.saving_manevr}}
                  </div>
                </div>               
              </td>
            </tr>
            <tr class="td-3">
              <td colspan="4">Итого:</td><td>{{dataSheet['timeManevrFact']}}</td><td></td><td></td><td>{{dataSheet['dtManevrFact']}}</td><td>{{dataSheet['dtManevrNorm']}}</td>
              <td>
                <div v-if="dataSheet['savingManevrFact'] < 0">
                  <div v-bind:style="styleObjectRed">{{dataSheet['savingManevrFact']}}
                  </div>
                </div>
                <div v-else>
                  <div v-bind:style="styleObjectGreen">{{dataSheet['savingManevrFact']}}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>        
        </v-simple-table>       
      </v-col> 
    </v-row>
</div>  
</div>
</template>
<script>
import EditRoutesheet from './EditRoutesheet.vue';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default ({
  data(){
    return {
      load_component:false,
      edit_permission:null,
      id:null,
      EditKey: 0,
      routesheetPermission: null,
      routesheetRes: [],
      routesheetResManevr: [],
      dataSheet: {},
      styleObjectRed: {
        color: 'red',
        fontSize: '11px'
      },
      styleObjectGreen: {
        color: 'green',
        fontSize: '11px'
      }
    }
  },
  async mounted() {    
    await this.loadRouteSheet(); 
  },
  components: {
    EditRoutesheet     
  },
   methods: {
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
     closeDialog(){
      this.dialog = false
      this.EditKey += 1;      
    },
    forceRerender() {
      this.EditKey += 1;  
    },
     async loadRouteSheet(){     
      const id = await this.$store.state.reportID;
      const driver = await this.$store.state.driver;
      const clonedRoutesheet = await this.$store.state.arrDataRouteSheet;
      this.load_component=false
      //console.log(clonedRoutesheet)
      let smena = null
      let lokoNumber = null     
      let vDriver=driver
      let reportRes=[]      
      let resultData=[]
      
      
      for (var i = 0; i < clonedRoutesheet.length; i++) {
        if(clonedRoutesheet[i]['driver']==driver && clonedRoutesheet[i]['id']==id){
          reportRes.push(clonedRoutesheet[i]);
         smena=clonedRoutesheet[i]['smena'];
         lokoNumber=clonedRoutesheet[i]['lokoNumber'];              
        }
      }
       console.log('tut -> ', reportRes[0])
      let {data} = await this.$http
        .get(`${this.$store.getters.getServerUrl}/perm/routesheet`)          
        this.routesheetPermission=data       
        resultData = await this.$http
        .post(`${this.$store.getters.getServerUrl}/result/date-now/`,
          reportRes[0]
        )
        .then((response) => response.data);
        console.log('tut ->', resultData)
        let equipment = null        
        let dtManevrFact = null
        let timeManevrFact = null
        let savingManevrFact = null
        let dtManevrNorm = null       
        let driverReport = null        
        let timeTrailFact  = null
        let dtTrailFact = null
        let dtTrailNorm  = null
        let savingTrailFact = null
        let gvTrail = null
        let pvTrail = null
        const clonedReport = resultData['vyvoz'].map(a => ({...a}));
        const clonedManevr = resultData['manevr'].map(a => ({...a}));
        //console.log('manevr',clonedManevr)
        if (driverReport == null){
          driverReport = driver
          for (let i=0;i<clonedReport.length;i++){          
            if (clonedReport[i]['driver'] == driver){            
              this.routesheetRes.push(clonedReport[i])
              timeTrailFact= await timeTrailFact+clonedReport[i]['work_time']            
              dtTrailFact=dtTrailFact+clonedReport[i]['fact']
              dtTrailNorm=dtTrailNorm+Number(clonedReport[i]['norm'])        
              savingTrailFact=savingTrailFact+Number(clonedReport[i]['saving'])            
              gvTrail += clonedReport[i]['gp'] 
              pvTrail += clonedReport[i]['pv']
            }
          }
          
          for (let i=0;i<clonedManevr.length;i++){          
            if (clonedManevr[i]['driver'] == driver){            
              this.routesheetResManevr.push(clonedManevr[i])
              timeManevrFact += clonedManevr[i]['work_time_manevr']            
              dtManevrFact += clonedManevr[i]['fact_manevr']
              dtManevrNorm += Number(clonedManevr[i]['norm_manevr'])        
              savingManevrFact += Number(clonedManevr[i]['saving_manevr'])            
              equipment += Number(clonedManevr[i]['equipment'])
            }
          }
          savingTrailFact=Math.round(savingTrailFact)
          dtTrailNorm=Math.round(dtTrailNorm)
          savingManevrFact=Math.round(savingManevrFact)
          dtManevrNorm=Math.round(dtManevrNorm)  
        }

        this.dataSheet['timeTrailFact']=timeTrailFact;
        this.dataSheet['dtTrailFact']=dtTrailFact;
        this.dataSheet['dtTrailNorm']=dtTrailNorm;        
        this.dataSheet['savingTrailFact']=savingTrailFact;            
        this.dataSheet['gvTrail']=gvTrail;
        this.dataSheet['pvTrail']=pvTrail;
        this.dataSheet['timeManevrFact']=timeManevrFact;           
        this.dataSheet['dtManevrFact']=dtManevrFact;
        this.dataSheet['dtManevrNorm']=dtManevrNorm;      
        this.dataSheet['savingManevrFact']=savingManevrFact;            
        this.dataSheet['equipment']=equipment;
        this.dataSheet['smena']=smena;
        this.dataSheet['date']=this.dateFormat(reportRes[0]['date'], true)
        this.dataSheet['lokoNumber']=lokoNumber;
        this.dataSheet['vDriver']= vDriver; 
        console.log(this.dataSheet)
        

        for(var i = 0; i < this.routesheetResManevr.length; i++){
          this.routesheetResManevr[i]['dateStart']=this.dateFormat(this.routesheetResManevr[i]['dateStart'])
          this.routesheetResManevr[i]['dateEnd']=this.dateFormat(this.routesheetResManevr[i]['dateEnd'])          
        }
        for(var i = 0; i < this.routesheetRes.length; i++){
          this.routesheetRes[i]['dateStart']=this.dateFormat(this.routesheetRes[i]['dateStart'])
          this.routesheetRes[i]['dateEnd']=this.dateFormat(this.routesheetRes[i]['dateEnd'])          
        }        
         console.log('Итог Маневров',this.$store.state.routesheetRes)
        if(this.routesheetResManevr.length !==0 || this.routesheetRes.length !==0 ||  driverReport !==null){
          this.load_component = true;
        }

     }
   }
})
</script>
