<template>
<div class="report-table">   
    <div class="loko">
      <h4>Маршрутный лист машиниста</h4>
    </div>   
   <div class="row">
        <div class="col-sm-6">                                
            <v-col
              cols="12"
              sm="12"
              md="12"
            >
              <v-menu
                ref="menu"                
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="Выберите дату"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                  locale="ru-ru"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>          
        </div>
        <!--<div class="col-sm-6">
          <div class="reportDriver">
            <v-select :items="driver" item-text="name" label="Машинист" item-value="id" v-model="vDriver"></v-select>
          </div>
        </div>-->
         <v-btn
            class="ma-2"
            outlined
            color="indigo"
            @click="shape"
          >
            Сформировать
         </v-btn>  
   </div> 
   <v-row>
     <div v-if="routesheet.length == 0"><p>Маршрутов нет</p></div>
     <div v-else>
       <div class="row">
        <div v-for="d in routesheet" :key="d.Index">
          <div class="coll-3">
            <v-btn 
              color="blue darken-1" text       
              @click="routesheetDriver(d.driver, d.id)"
            >
              {{d.driver}}
            </v-btn> 
          </div>
        </div>
       </div>
     </div>
   </v-row>
  
  <v-row>
       <Routesheet :key="EditKey"/>
  </v-row> 
</div> 
</template>
<script>
import Routesheet from '../components/Sheet/TDRoutesheet.vue';

import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {  
  data(){
    return {
      load_component:false,
      edit_permission:null,
      EditKey: 0,
      smena : null,
      lokoNumber:null,
      resultData:null,
      fact:null,
      date:null,
      vDriver:null,
      driver:[],
      routesheet:[],
      routesheetRes:[],

      routesheetResManevr:[],
      dtManevrFact:null,
      timeManevrFact:null,
      savingManevrFact:null,
      dtManevrNorm:null,
      equipment:null,
      dtTrailFact:null,
      timeTrailFact:null,
      savingTrailFact:null,
      dtTrailNorm:null,
      gvTrail:null,
      pvTrail:null,
      driverReport: null,
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
                   
  },
  components: {
    Routesheet     
  },
  methods: { 
    closeDialog(){
      this.dialog = false
      this.EditKey += 1;      
    },
    forceRerender() {
      this.EditKey += 1;  
    },
    dateFormat(item) {
      item = this.timeConverter(item);         
      return item;
    },
    timeConverter(UNIX_timestamp) {     
      var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");
      var time = dt.toLocaleString(DateTime.TIME_24_SIMPLE) 
      return time;            
    },   
      async routesheetDriver(driver, id){
        console.log(driver)
        this.$store.state.arrDataRouteSheet = []
        this.$store.state.reportID = null
        this.$store.state.driver = null

        this.$store.state.reportID = id
        this.$store.state.driver = driver
        const clonedRoutesheet = this.routesheet.map(a => ({...a}));
        this.$store.state.arrDataRouteSheet = clonedRoutesheet
        this.EditKey += 1; 

        // this.load_component=false
        // this.$store.state.routesheetRes = []
        // this.$store.state.routesheetResManevr = []
        // this.$store.state.routesheetPermission = null  
        // this.$store.state.dataSheet = {}      
        // this.vDriver=driver
        // let reportRes=[]
        // let dataSheet={}
        // this.$store.state.reportID = id
        // const clonedRoutesheet = this.routesheet.map(a => ({...a}));
        // //console.log(clonedRoutesheet)
        // for (var i = 0; i < clonedRoutesheet.length; i++) {
        //     if(clonedRoutesheet[i]['driver']==driver && clonedRoutesheet[i]['id']==id){
        //       reportRes.push(clonedRoutesheet[i]);
        //       this.smena=clonedRoutesheet[i]['smena'];
        //       this.lokoNumber=clonedRoutesheet[i]['lokoNumber'];              
        //     }
        // }
        // //console.log('ffff',reportRes[0])
        // let {data} = await this.$http
        //   .get(`${this.$store.getters.getServerUrl}/perm/routesheet`)          
        // this.edit_permission=data 
        // this.$store.state.routesheetPermission = this.edit_permission
        
        // this.resultData = await this.$http
        // .post(
        //   `${this.$store.getters.getServerUrl}/result/date-now/`,
        //   reportRes[0]
        // )
        // .then((response) => response.data);
        // this.equipment = null,        
        // this.dtManevrFact = null,
        // this.timeManevrFact = null,
        // this.savingManevrFact = null,
        // this.dtManevrNorm = null,
        // this.routesheetResManevr = [],
        // this.driverReport = null
        // this.routesheetRes = []
        // this.timeTrailFact  = null
        // this.dtTrailFact = null
        // this.dtTrailNorm  = null
        // this.savingTrailFact = null
        // this.gvTrail = null
        // this.pvTrail = null
        // const clonedReport = this.resultData['vyvoz'].map(a => ({...a}));
        // const clonedManevr = this.resultData['manevr'].map(a => ({...a}));
        // //console.log(clonedManevr)
        // if (this.driverReport == null){
        //   this.driverReport = driver
        //   for (let i=0;i<clonedReport.length;i++){          
        //     if (clonedReport[i]['driver'] == driver){            
        //       this.routesheetRes.push(clonedReport[i])
        //       this.timeTrailFact= await this.timeTrailFact+clonedReport[i]['work_time']            
        //       this.dtTrailFact=this.dtTrailFact+clonedReport[i]['fact']
        //       this.dtTrailNorm=this.dtTrailNorm+Number(clonedReport[i]['norm'])        
        //       this.savingTrailFact=this.savingTrailFact+Number(clonedReport[i]['saving'])            
        //       this.gvTrail += clonedReport[i]['gp'] 
        //       this.pvTrail += clonedReport[i]['pv']
        //     }
        //   }
          
        //   for (let i=0;i<clonedManevr.length;i++){          
        //     if (clonedManevr[i]['driver'] == driver){            
        //       this.routesheetResManevr.push(clonedManevr[i])
        //       this.timeManevrFact += clonedManevr[i]['work_time_manevr']            
        //       this.dtManevrFact += clonedManevr[i]['fact_manevr']
        //       this.dtManevrNorm += Number(clonedManevr[i]['norm_manevr'])        
        //       this.savingManevrFact += Number(clonedManevr[i]['saving_manevr'])            
        //       this.equipment += Number(clonedManevr[i]['equipment'])
        //     }
        //   }
        //   this.savingTrailFact=Math.round(this.savingTrailFact)
        //   this.dtTrailNorm=Math.round(this.dtTrailNorm)
        //   this.savingManevrFact=Math.round(this.savingManevrFact)
        //   this.dtManevrNorm=Math.round(this.dtManevrNorm)  
        // }

        // dataSheet['timeTrailFact']=this.timeTrailFact;
        // dataSheet['dtTrailFact']=this.dtTrailFact;
        // dataSheet['dtTrailNorm']=this.dtTrailNorm;        
        // dataSheet['savingTrailFact']=this.savingTrailFact;            
        // dataSheet['gvTrail']=this.gvTrail;
        // dataSheet['pvTrail']=this.pvTrail;
        // dataSheet['timeManevrFact']=this.timeManevrFact;           
        // dataSheet['dtManevrFact']=this.dtManevrFact;
        // dataSheet['dtManevrNorm']=this.dtManevrNorm;      
        // dataSheet['savingManevrFact']=this.savingManevrFact;            
        // dataSheet['equipment']=this.equipment;
        // dataSheet['smena']=this.smena;
        // dataSheet['date']=this.date;
        // dataSheet['lokoNumber']=this.lokoNumber;
        // dataSheet['vDriver']= this.vDriver;       
        // this.$store.state.dataSheet = dataSheet;
        // console.log(dataSheet)

        // for(var i = 0; i < this.routesheetResManevr.length; i++){
        //   this.routesheetResManevr[i]['dateStart']=this.dateFormat(this.routesheetResManevr[i]['dateStart'])
        //   this.routesheetResManevr[i]['dateEnd']=this.dateFormat(this.routesheetResManevr[i]['dateEnd'])          
        // }
        // for(var i = 0; i < this.routesheetRes.length; i++){
        //   this.routesheetRes[i]['dateStart']=this.dateFormat(this.routesheetRes[i]['dateStart'])
        //   this.routesheetRes[i]['dateEnd']=this.dateFormat(this.routesheetRes[i]['dateEnd'])          
        // }
        // this.$store.state.routesheetRes = this.routesheetRes
        // this.$store.state.routesheetResManevr = this.routesheetResManevr
        // //console.log(this.routesheetResManevr)
        // if(this.$store.getters.getRoutesheetResManevr.length !==0 || this.$store.getters.getRoutesheetRes.length !==0 ||  this.driverReport !==null){
        //   this.load_component = true;
        // }
      },     
      async shape(){      
      let dateStart = Math.round(new Date(this.date).getTime()/1000.0)
      //console.log(dateStart)
      let dateEnd = dateStart + 86400
      let data = { 
        dateStart:dateStart,       
        dateEnd:dateEnd
      }; 
        //console.log(data)     
        this.driver = []
        this.routesheet = await this.$http
              .post(`${this.$store.getters.getServerUrl}/result/mm/`, data)
              .then((response) => response.data); 
        //console.log(this.routesheet);                         
        // for (let i=0;i<this.routesheet.length;i++){
        //   this.driver.push(this.routesheet[i]['driver'])         
        // };                 
        // this.driver = Array.from(new Set(this.driver));
        // console.log('ROUTESHEET: ',this.routesheet)
    }
  }
}
</script>