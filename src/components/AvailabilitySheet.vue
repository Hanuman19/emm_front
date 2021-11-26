<template>
    <div class="report-table">
        <div class="loko">
            <h4>Отчет о наличаии маршрутов</h4>
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
                <v-date-picker
                v-model="dates"
                range
                locale="ru-ru"
                >
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
            <v-simple-table v-if="result.length != 0">        
                <tbody> 
                    <tr>
                        <td></td>                        
                        <td v-for="(val, key) in datesTD" :key="key">{{val}}</td>                        
                    </tr>
                    <tr>
                        <td></td>                        
                        <td v-for="(val, key) in smenaRes" :key="key">
                            <b>1 -</b> {{val.smena1}}
                            <b>2 -</b> {{val.smena2}}
                        </td>                        
                    </tr>    
                    <tr v-for="(val, key) in result" :key="key">
                        <td>{{val.loko}}</td>                        
                        <td v-for="(res, key) in val.result" :key="key">
                            <div v-for="(date, key) in datesRes" :key="key">
                                <div v-if="date == res.dates">
                                    <div v-if="res.smena1 == 1">
                                       <b>1:</b><v-icon color="green darken-2"> mdi-check </v-icon>
                                    </div>
                                    <div v-else>
                                        <b>1:</b><v-icon color="red">mdi-close</v-icon>
                                    </div>
                                    <div v-if="res.smena2 == 1">
                                       <b>2:</b><v-icon color="green darken-2"> mdi-check </v-icon>
                                    </div>
                                    <div v-else>
                                        <b>2:</b><v-icon color="red">mdi-close</v-icon>
                                    </div>                                    
                                </div>
                            </div>
                        </td>                                                                
                    </tr>                                                                   
                </tbody>
            </v-simple-table>        
        <div v-else-if="start==true">
          <v-data-table                          
            loading
            loading-text="Загружаем данные"
          >                          
          </v-data-table>
        </div>
        </v-row>
    </div>
</template>
<script>
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
    data(){
    return{
      smenaRes:[],      
      start:false,
      datesTD:[],
      dates: [],
      loko:[],
      datesRes:[],
      result:[],
      loko:[]     
    }
  },
  methods: {
      dateFormat(item, d) {
        let b = 1;
        for (var i = 0; i < item.length; i++) {        
            if ( d==true ){
            item[i] = this.timeConverter(item[i], d);
            }else{
            item[i]["dateStartOld"] = this.timeConverter(item[i]["dateStart"],0,b);
            item[i]["dateEndOld"] = this.timeConverter(item[i]["dateEnd"], 0, b);
            item[i]["dateStart"] = this.timeConverter(item[i]["dateStart"]);
            item[i]["dateEnd"] = this.timeConverter(item[i]["dateEnd"]);
            }        
            
        }
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
      async shape(){
        this.smenaRes=[]
        this.start=true;
        let dateRes = {date:null,
                        smena1:0,
                        smena2:0}
        let test ={dates:null,
                    smena1:0,
                    smena2:0}
        let res = {loko:null,
                    result:[]
                    } 
        this.result=[]
        this.datesTD=[]
        let loadData=[]        
        this.dates.sort();
        let loko = [];
        this.loko = [];
        let flag = false;
        let datesRes = [];
        this.datesRes = [];         
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
        //console.log('Ответ от сервера',clonedData)
        if (datesRes.length == 0){ 
            for (var i = 0; i < clonedData.length; i++) {           
                datesRes.push(clonedData[i]['date'])
                this.datesRes.push(clonedData[i]['date'])
            }
            //this.datesTD=this.datesRes
        }
        if (loko.length == 0){ 
            for (var i = 0; i < clonedData.length; i++) {           
                loko.push(clonedData[i]['lokoNumber'])
                this.loko.push(clonedData[i]['lokoNumber'])
            }
        }        
        loko = Array.from(new Set(loko));
        this.loko = Array.from(new Set(this.loko));        
        //console.log('копия локомотивов',this.loko)        
        datesRes = Array.from(new Set(datesRes));
        this.datesRes = Array.from(new Set(this.datesRes));
        const clonedDate = this.datesRes.slice().sort();
        //console.log(clonedDate)  
        //console.log(this.datesRes)
        this.datesTD = this.dateFormat(clonedDate,true)              
        //console.log('Локомотивы',loko)
        //console.log('Даты',datesRes)
        if (this.result.length == 0){
            for(var l = 0;l < loko.length; l++ ){
                res['loko']=loko[l]
                for (var r = 0; r < datesRes.length; r++){
                    test['dates'] = datesRes[r]
                    res['result'].push(test)
                    test ={dates:null,
                            smena1:0,
                            smena2:0}
                }
                this.result.push(res)
                res = {loko:null,
                        result:[]
                        } 
            }
        }
        for (var i = 0; i < clonedData.length; i++) {
            flag = false;                
            for (var j = 0; j < this.result.length; j++) {
                if(clonedData[i]['lokoNumber'] == this.result[j]['loko']){
                    for(var r = 0;r < this.result[j]['result'].length; r++){
                        if(clonedData[i]['date']==this.result[j]['result'][r]['dates']){
                            if(clonedData[i]['smena']==1){
                                this.result[j]['result'][r]['smena1']=1
                            }
                            if(clonedData[i]['smena']==2){                                        
                                this.result[j]['result'][r]['smena2']=1
                            }
                        }
                    }               
                    flag = true;
                }
            }
        }
        if (this.smenaRes.length == 0){
            for(var i = 0;i < datesRes.length; i++ ){
                dateRes['date']=datesRes[i]                
                this.smenaRes.push(dateRes)
                dateRes = {date:null,
                           smena1:0,
                           smena2:0} 
            }
        }
        for (var i = 0; i < clonedData.length; i++){
            for (var j = 0; j < this.smenaRes.length; j++) {
                if(clonedData[i]['date'] == this.smenaRes[j]['date']){
                    if(clonedData[i]['smena']==1){
                        this.smenaRes[j]['smena1'] +=1
                    }
                    if(clonedData[i]['smena']==2){                                        
                        this.smenaRes[j]['smena2'] +=1
                    }
                }
            }
        }
        console.log(this.smenaRes)
        this.start=false;        
      }
  }
}
</script>
