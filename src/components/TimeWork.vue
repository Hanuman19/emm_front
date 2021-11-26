<template>
  <div>
    <div class="loko">
      <h4>Отчет по времени работы</h4>
    </div>
    <v-row>
      <v-col cols="12" sm="6">
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
      <v-btn class="ma-2" outlined color="indigo" @click="shape">
        Сформировать
      </v-btn>
    </v-row>
    <v-row>
      <div>
        <v-data-table
          :headers="headers"
          :items="reportRes"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:item.saving="{ item }">
            <v-chip :color="getColor(item.saving)" dark>
              {{ item.saving }}
            </v-chip>
          </template>
          <template v-slot:item.lokoNumber="{ item }">
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
                    @click="razbor(item.lokoNumber)"
                  >
                    {{ item.lokoNumber }}
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
                      {{ item.lokoNumber }}
                    </v-toolbar>
                    <v-card-text>
                      <v-data-table
                      :headers="headersDialog"
                      :items="loko_razbor"                      
                      class="elevation-1"
                      >                      
                      </v-data-table>
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
          </template>
        </v-data-table>
      </div>
    </v-row>
  </div>
</template>
<script>
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
  data() {
    return {
      loko_razbor: [],
      dates: [],
      report: [],
      reportRes: [],
      reportArea: [],
      reportType: [],
      types: [],
      flag: false,
      headers: [
        {
          text: "",
          align: "start",
          sortable: false,
          value: "typeLoko",
        },
        { text: "№ локомотива", value: "lokoNumber" },
        { text: "Вывозная работа", value: "work_time_trail" },
        { text: "Маневровая работа", value: "work_time_manevr" },
        { text: "Простой", value: "work_time_prostoy" },
      ],
      headersDialog: [
        {
          text: "Дата",
          align: "start",
          sortable: false,
          value: "date",
        },    
        { text: "Смена", value: "smena" },    
        { text: "Вывозная работа", value: "work_time_trail" },
        { text: "Маневровая работа", value: "work_time_manevr" },
        { text: "Простой", value: "work_time_prostoy" },
        { text: "Итого", value: "result" },
      ],
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
    razbor(item){
      let result=null;
      this.loko_razbor=[];
      console.log(this.report)
      const clonedReport = this.report.map(a => ({...a}));
      for(var i=0; i<clonedReport.length;i++){
        if(clonedReport[i]['lokoNumber'] == item){
          result = clonedReport[i]['work_time_trail']+clonedReport[i]['work_time_manevr']+clonedReport[i]['work_time_prostoy']
          clonedReport[i]['result'] = result
          clonedReport[i]['date']=this.dateFormat(clonedReport[i]['date'])
          this.loko_razbor.push(clonedReport[i]);          
        }
      } 
      this.loko_razbor.sort((a, b) => a.smena > b.smena ? -1 : 1);     
      this.loko_razbor.sort((a, b) => a.date > b.date ? 1 : -1);      
    },
    test(rep, report_res, param) { 
      let flag = false;
      for (var i = 0; i < rep.length; i++) {
        flag = false;                
        if (report_res.length == 0) {
          report_res.push(rep[i]); 
        } else{
          for (var j = 0; j < report_res.length; j++) {
            if (
              rep[i][param] === report_res[j][param]
            ) {
              report_res[j]["work_time_trail"] = report_res[j]["work_time_trail"] + rep[i][
                "work_time_trail"
              ];
              report_res[j]["work_time_manevr"] = report_res[j]["work_time_manevr"] +  rep[i][
                "work_time_manevr"
              ];
              report_res[j]["work_time_prostoy"] = report_res[j]["work_time_prostoy"] + rep[i][
                "work_time_prostoy"
              ];
              flag = true;
            }            
          }
          if (flag == false) {
            report_res.push(rep[i]);
          } 
        } 
      }
      return report_res
    },
    async shape() {
      this.dates.sort();
      this.report = [];
      this.reportRes = new Array();
      this.reportArea = [];
      this.reportType = [];
      let flag = false;
      let t1 = [];
      let t2;
      let flagType = false;     
      let dateStart = Math.round(new Date(this.dates[0]).getTime() / 1000.0);
      let dateEnd =
        Math.round(new Date(this.dates[1]).getTime() / 1000.0) + 86400;
      let data = {
        dateStart: dateStart,
        dateEnd: dateEnd,
        report: "reportTW",
      };
      this.report = await this.$http
          .post(`${this.$store.getters.getServerUrl}/report/`, data)
          .then((response) => response.data);
      //console.log(this.report)
      const clonedReport = this.report.map(a => ({...a}));        
      await this.test(clonedReport, this.reportRes,'lokoNumber') 
      const clonedReportRes = this.reportRes.map(a => ({...a}));
      const clonedReportType = this.reportRes.map(a => ({...a})); 
      await this.test(clonedReportRes, this.reportArea,'area');
      await this.test(clonedReportType, this.reportType,'typeLoko');
      for (var i=0; i<this.reportArea.length; i++){
        this.reportArea[i]['typeLoko']='Итого';
        this.reportArea[i]['lokoNumber']=this.reportArea[i]['area'];
        this.reportRes.push(this.reportArea[i]);
      }
      for (var i=0; i<this.reportType.length; i++){
        this.reportType[i]['lokoNumber']='';                
        this.reportRes.push(this.reportType[i]);
      } 
    },    
  },
};
</script> 