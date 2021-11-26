<template>
  <div>
    <section>
      <div class="container">      
        <div class="data">
          <div class="row justify-content-between">
            
            <div class="col-12">
              <div class="row">
                <div class="loko col-12">
                  <h4>Форма внесения данных</h4>
                </div>   
              </div> 
              <div class="row">
                
                <div class="col-md-9">
                  <div class="row justify-content-between">
                    <div class="loko-form col-12">
                      <v-form> 
                             <div class="row">
                              <div class="col-md-3 col-lg-3 offset-lg-2">
                                <div class="form-group">
                                  <v-switch
                                    v-model="bort"
                                    :label="`Борт не работает`"
                                  ></v-switch>
                                </div>
                              </div>
                              <div class="col-md-3 col-lg-3 ">
                                <div class="form-group">
                                  <v-switch
                                    v-model="smena_driver"
                                    :label="`Смена машиниста`"
                                  ></v-switch>
                                </div>
                              </div>                                
                             </div>
                             <div class ="row" v-if="bort == true">
                               <div class="col-md-4 col-lg-4 offset-lg-2">
                                <v-text-field
                                  counter="4"
                                  label="ДТ на начало смены"
                                  v-model="bortDTStart"
                                ></v-text-field>
                              </div>
                              <div class="col-md-4 col-lg-4">
                                <v-text-field
                                  counter="4"
                                  label="ДТ на конец смены"
                                  v-model="bortDTEnd"
                                ></v-text-field>
                              </div>
                             </div>                              
                            <div class="row">
                              <div
                                class="col-md-6 col-lg-4 offset-lg-2 rout-multi-top"
                                v-for="item in form"
                                :key="item.Index"
                                v-if="item.type == 'selectArea'"
                              >
                                <multiselect 
                                  v-model="modelItem[item.vModel]" 
                                  :options="res(item.items)" 
                                  :placeholder="item.label"                      
                                  label="name"
                                  @input="onChangeSelected">
                                </multiselect>
                              </div>                            
                              <div class="col-md-6 col-lg-4 rout-multi-top">
                                <div class="form-group">
                                  <multiselect 
                                    v-model="vDriver" 
                                    :options="driver" 
                                    placeholder="Машинисты"                      
                                    label="name">
                                  </multiselect>                                  
                                </div>
                              </div>
                            </div>
                            <div class="row">                             
                              <div
                                class="col-md-6 col-lg-4 offset-lg-2"
                                v-for="item in form"
                                :key="item.Index"
                                v-if="item.vModel == 'section'"
                              >
                                <div class="form-group">
                                  <multiselect 
                                    v-model="modelItem[item.vModel]" 
                                    :options="res(item.items)" 
                                    :placeholder="item.label"                      
                                    label="name">
                                  </multiselect>                                  
                                </div>
                              </div>
                               <div class="col-md-6 col-lg-4">
                                <v-radio-group row v-model="radioSmena">
                                  <v-radio label="1 Смена" value="1"></v-radio>
                                  <v-radio label="2 Смена" value="2"></v-radio>
                                </v-radio-group>
                              </div>
                            </div> 
                             <div class="row">
                              <div class="col-md-6 col-lg-4 offset-lg-2">
                                <div class="form-group">
                                  <v-menu
                                    ref="menu1"
                                    :close-on-content-click="false"
                                    :return-value.sync="date"
                                    transition="scale-transition"
                                    offset-y
                                    min-width="auto"
                                  >
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-text-field
                                        v-model="dateStart"
                                        label="Выберите дату начала"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      locale="ru-ru"
                                      v-model="dateStart"
                                      no-title
                                      scrollable
                                    >
                                      <v-spacer></v-spacer>
                                      <v-btn text color="primary" @click="menu1 = false">
                                        Cancel
                                      </v-btn>
                                      <v-btn
                                        text
                                        color="primary"
                                        @click="$refs.menu1.save(date)"
                                      >
                                        OK
                                      </v-btn>
                                    </v-date-picker>
                                  </v-menu>
                                </div>
                              </div>
                              <div class="col-md-6 col-lg-4">
                                <v-text-field
                                  counter="4"
                                  label="Ведите время начала работы"
                                  v-model="timeStart"
                                ></v-text-field>
                              </div>
                            </div>  
                             <div class="row">
                              <div class="col-md-6 col-lg-4 offset-lg-2 rout-multi-bottom">
                                <div class="form-group">
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
                                        v-model="dateEnd"
                                        label="Выберите дату окончания"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                      ></v-text-field>
                                    </template>
                                    <v-date-picker
                                      locale="ru-ru"
                                      v-model="dateEnd"
                                      no-title
                                      scrollable
                                    >
                                      <v-spacer></v-spacer>
                                      <v-btn text color="primary" @click="menu = false">
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
                                </div>
                              </div>
                              <div class="col-md-6 col-lg-4 rout-multi-bottom">
                                <v-text-field
                                  counter="4"
                                  label="Ведите время окончание работы"
                                  v-model="timeEnd"
                                ></v-text-field>
                              </div>
                            </div>      
                      </v-form>
                    </div>
                  </div>
                    <div id="data-v" class="mb-80">
                      <v-card>
                        <v-toolbar color="#1583e9" dark flat>
                          <template>
                            <v-tabs v-model="tab" align-with-title>
                              <v-tabs-slider color="yellow"></v-tabs-slider>
                              <v-tab :key="1">Вывозная работа</v-tab>
                              <v-tab :key="2">Маневровая</v-tab>
                            </v-tabs>
                          </template>
                        </v-toolbar>
                        <v-tabs-items v-model="tab">
                          <v-tab-item :key="1">
                            <v-form>
                              <div class="row mx-auto">
                                <div class="col-md-6 col-lg-4 offset-lg-2 rout-multi-top">
                                  <div class="form-group">
                                    <multiselect 
                                      v-model="stationDep" 
                                      :options="station"                                 
                                      placeholder="Станция отправления"                      
                                      label="name">
                                    </multiselect>                                    
                                  </div>
                                </div>
                                <div class="col-md-6 col-lg-4 rout-multi-top">
                                  <div class="form-group">
                                    <multiselect 
                                      v-model="stationArr" 
                                      :options="station"                                
                                      placeholder="Станция прибытия"                      
                                      label="name">
                                    </multiselect>                                   
                                  </div>
                                </div>
                              </div>
                              <div class="row mx-auto">
                                <div
                                  class="col-md-6 col-lg-3 offset-lg-2 "
                                  v-for="item in form"
                                  :key="item.Index"
                                  v-if="item.type == 'textDT'"
                                >
                                  <v-text-field
                                    v-model="modelItem[item.vModel]"
                                    :counter="item.counter"
                                    :label="item.label"
                                  ></v-text-field>
                                </div>
                              </div>
                              <div class="row mx-auto">
                                <div
                                  class="col-md-6  col-lg-3 offset-lg-2 "
                                  v-for="item in form"
                                  :key="item.Index"
                                  v-if="item.type == 'textVG'"
                                >
                                  <v-text-field
                                    :counter="item.counter"
                                    :label="item.label"
                                    v-model="modelItem[item.vModel]"
                                  ></v-text-field>
                                </div>
                              </div>
                              
                              <div class="row mx-auto">
                                <div class="col-md-3 col-lg-2">
                                  <div class="form-group">
                                    <div class="col-md-5 col-lg-5">
                                      <v-switch
                                        v-model="doublePull"
                                        :label="`Двойная тяга`"
                                      ></v-switch>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  class="col-md-4"
                                  v-for="item in form"
                                  :key="item.Index"
                                  v-if="item.vModel == 'sectionDouble'"
                                >
                                  <div class="form-group">                                    
                                    <v-select
                                      :items="res(item.items)"
                                      :item-text="item.itemText"
                                      :item-value="item.itemValue"
                                      :label="item.label"
                                      :disabled="diss"
                                      v-model="modelItem[item.vModel]"
                                    >
                                    </v-select>
                                  </div>
                                </div>
                                <div
                                  class="col-md-4"
                                  style="margin-top:6px"
                                  v-for="item in form"
                                  :key="item.Index"
                                  v-if="item.vModel == 'doubleNumber'"
                                >
                                  <div class="form-group">
                                    <multiselect 
                                      v-model="modelItem[item.vModel]" 
                                      :options="res(item.items)" 
                                      :placeholder="item.label" 
                                      :disabled="diss"                     
                                      label="name">
                                    </multiselect>                                    
                                  </div>
                                </div>
                                <div class="col-12 button-logo">
                                  <v-btn
                                    class="mx-2"
                                    fab
                                    dark
                                    large
                                    color="#1583e9"
                                    @click="save"
                                  >
                                    <v-icon dark> mdi-pencil </v-icon>
                                  </v-btn>
                                </div>
                              </div>
                            </v-form>
                          </v-tab-item>
                          <v-tab-item :key="2">
                            <v-form>
                              <div class="row mx-auto">
                                <div class="col-lg-4">
                                  <multiselect 
                                      v-model="stationManevr" 
                                      :options="station" 
                                      placeholder="Станция"                                                   
                                      label="name">
                                  </multiselect>                                  
                                </div>
                                <div class="col-lg-4">
                                  <v-text-field
                                    v-model="dtStartManevr"
                                    :counter="10"
                                    label="ДТ на начало операции"
                                  ></v-text-field>
                                </div>
                                <div class="col-lg-4">
                                  <v-text-field
                                    v-model="dtEndManevr"
                                    :counter="10"
                                    label="Дт на конец операции"
                                  ></v-text-field>
                                </div>
                                <v-row>
                                  <div class="col-12">
                                    <div class="form-group">
                                      <v-row>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="prostoy"
                                            :label="`Простой`"
                                          ></v-switch>
                                        </div>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="thrust"
                                            :label="`Вытяжка`"
                                          ></v-switch>
                                        </div>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="obrabotka"
                                            :label="`Обработка вагонов`"
                                          ></v-switch>
                                        </div>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="obduv"
                                            :label="`Обдув вагонов`"
                                          ></v-switch>
                                        </div>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="xx"
                                            :label="`Холодный простой`"
                                          ></v-switch>
                                        </div>
                                        <div class="col-md-3">
                                          <v-switch
                                            v-model="burning"
                                            :label="`Прожиг`"
                                          ></v-switch>
                                        </div>
                                      </v-row>
                                      <v-row>
                                        <div class="col-lg-4">
                                          <v-text-field
                                            v-model="equipment"
                                            :counter="10"
                                            label="Экипировка"
                                            :disabled="equ"
                                          ></v-text-field>
                                        </div>
                                        <div class="col-lg-4">
                                          <v-text-field
                                            v-model="gp"
                                            :counter="10"
                                            label="Груженные вагоны"
                                            :disabled="thru"
                                          ></v-text-field>
                                        </div>
                                        <div class="col-lg-4">
                                          <v-text-field
                                            v-model="pv"
                                            :counter="10"
                                            label="Порожные вагоны"
                                            :disabled="thru"
                                          ></v-text-field>
                                        </div>
                                      </v-row>
                                    </div>
                                  </div>
                                </v-row>
                                <div class="col-12 button-logo">
                                  <v-btn
                                    class="mx-2"
                                    fab
                                    dark
                                    large
                                    color="#1583e9"
                                    @click="saveManevr"
                                  >
                                    <v-icon dark> mdi-pencil </v-icon>
                                  </v-btn>
                                </div>
                              </div>
                            </v-form>
                          </v-tab-item>
                        </v-tabs-items>
                      </v-card>
                    </div>
                </div>
                <div class="col-md-3 test">
                  <div class="text-centr">
                    <h3>Маршруты</h3> 
                  </div>                  
                    <div v-for="item in report" :key="item.Index">
                      <v-simple-table>
                        <template v-slot:default>                          
                          <tbody>
                            <tr>
                              <td class="test">
                                <div :key="EditKey">
                                <v-dialog
                                  v-model="dialog"
                                  fullscreen
                                  hide-overlay
                                  transition="dialog-bottom-transition"
                                  :retain-focus="false"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      class="text-btn" 
                                      text
                                      color="indigo"
                                      v-bind="attrs"
                                      v-on="on"
                                      @click="reportDriver(item)"
                                    >
                                    {{item.driver}}
                                    </v-btn>  
                                  </template>
                                  <v-card>
                                    <v-toolbar
                                      dark
                                      color="primary"
                                    >
                                      <v-btn
                                        icon
                                        dark
                                        @click="closeDialog()"
                                      >
                                        <v-icon>mdi-close</v-icon>
                                      </v-btn>
                                      <v-toolbar-title>Маршрутный лист</v-toolbar-title>
                                      <v-spacer></v-spacer>                              
                                    </v-toolbar>
                                    <v-card-text>
                                        <EditRoutesheet :key="EditKey" />
                                    </v-card-text>                 
                                  </v-card>
                                </v-dialog>
                                </div>
                              </td>
                              <td class="text-td">{{item.date}}</td>
                              <td class="text-td">{{item.lokoNumber}}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>                      
                                        
                    </div>  
                                                      
                </div>
              </div>
              
              <div class="row">
                <div></div>
                <v-alert
                  outlined
                  dense
                  text
                  type="success"
                  v-if="message == 'true'"
                >
                  Данные внесены успешно
                </v-alert>
                <v-alert
                  outlined
                  dense
                  text
                  type="error"
                  v-else-if="message != ''"
                >
                  {{ this.message }}
                </v-alert>
                
                  
                    <v-data-table
                      :headers="headers"
                      :items="resultTrail"
                      class="elevation-1 text-h5"
                      v-if="tab == '0'"
                    >
                      <template v-slot:item.saving="{ item }">
                        <v-chip :color="getColor(item.saving)" dark>
                          {{ item.saving }}
                        </v-chip>
                      </template>
                    </v-data-table>                 
               
                    <v-data-table
                      :headers="headersManevr"
                      :items="resultManevr"
                      class="elevation-1 text-h5"
                      v-else
                    >
                      <template v-slot:item.saving_manevr="{ item }">
                        <v-chip :color="getColor(item.saving_manevr)" dark>
                          {{item.saving_manevr}}
                        </v-chip>
                      </template>
                    </v-data-table>                  
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import EditRoutesheet from '../components/Sheet/EditRoutesheet.vue';
import Multiselect from 'vue-multiselect'
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
  name: "Data",  
  data() {
    return {
      smena_driver:false,
      smena_loko:false,
      bortDTStart:null,
      bortDTEnd:null, 
      bort:false,
      EditKey: 0,
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,           
      message: "",
      resultTrail: [],
      resultManevr: [],
      report: [],
      reportOne:[],      
      modelItem: {
        area: null,
        gp: null,
        pv: null,
        section: null,
        dt_start: null,
        dt_end: null,
        sectionDouble: null,
        doubleNumber: null,
      },
      dateOld:{
        date:null,
        smena: null,
        driver: null,
        lokoNumber: null,
        dateStart: null,
        dateEnd: null
      },
      stationDep: "",
      stationArr: "",
      radioSmena: "",
      message: "",
      vDriver: null,
      tab: null,
      diss: true,
      driver: [],      
      lokoNumber: [],
      lokoType: [],
      station: [],
      stationOld: [],
      form: [],
      doublePull: false,
      prostoy: false,
      thrust: false,
      obrabotka: false,
      obduv: false,
      xx: false,
      burning: false,
      date: null,
      timeStart: null,
      timeEnd: null,
      dateStart: null,
      dateEnd: null,
      headers: [],
      headersManevr: [],
      area: [],
      equipment: null,
      equ: true,
      thru: true,
      dtStartManevr: null,
      dtEndManevr: null,
      stationManevr: "",
      pv: null,
      gp: null,
      datatest: null
    };
  },
  async mounted() {
      
    await this.loadSelect();
    await this.loadSetting();
    await this.loadSettings();
    await this.dateFormat(this.resultTrail);
    await this.dateFormat(this.resultManevr);
    await this.reportDriverList();
  },
  watch: {
    doublePull() {
      if (this.doublePull == false) {
        this.diss = true;
      } else {
        this.diss = false;
      }
    },
    prostoy() {
      if (this.prostoy == false) {
        this.equ = true;
      } else {
        this.equ = false;
      }
    },
    thrust() {
      if (this.thrust == false) {
        this.thru = true;
      } else {
        this.thru = false;
      }
    },
  },
  components: {
    EditRoutesheet,
    Multiselect
  },
  created() {},
  methods: {
    async reportDriverList(){
      this.datatest = Date.now()/1000 + (7*3600);
      console.log(this.datatest)
      await this.reportNow(this.datatest);      
      for(var i =0; i < this.report.length; i++){
        this.report[i]['date']=this.timeConverter(this.report[i]['date'], true);
      }; 

    },
    closeDialog(){
      this.dialog = false
      this.EditKey += 1;
      this.reportDriverList();
    },
    forceRerender() {
      this.EditKey += 1;  
    },
    reportDriver(item){      
      this.$store.state.reportID = item['id']      
    },    
    async reportNow(date){
      let data = {
        dateStart: date
      };
        console.log(data)
        this.report = await this.$http       
       .post(`${this.$store.getters.getServerUrl}/report/dateNow/`, data)
       .then((response) => response.data);
        return this.report;
    },
    dateFormat(item){      
      for (var i = 0; i < item.length; i++) {
        item[i]['dateStart']=this.timeConverter( item[i]['dateStart']);
        item[i]['dateEnd']=this.timeConverter( item[i]['dateEnd']);
      }
      return item;
    },
    timeConverter(UNIX_timestamp, d){
      var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");
      if(d==true){var time = dt.toLocaleString()}
      else{var time = dt.toLocaleString(DateTime.DATETIME_SHORT)} 
      return time;
    },    
    getColor(saving) {
      if (saving < 0) return "red";
      else return "green";
    },
    onChangeSelected: function () { 
      console.log(this.modelItem.area)     
      if (this.modelItem.area != null) {
        let area = this.area;       
        for (let i = 0; i <= area.length - 1; i++) {
          if (area[i].id == this.modelItem.area['id']) {
            console.log(this.modelItem.area['id'])
            this.station = this.stationOld.filter(function (el) {
              if (el.section == area[i].name) {
                return el;
              }
            });
          }
        }
      }
    },
    res(val) {
      return this[val];
    },

    async loadSettings() {
      this.settings = await this.$http
        .get(`${this.$store.getters.getServerUrl}/settings`)
        .then((response) => response.data);
      this.settings = JSON.parse(this.settings);
      this.headers = this.settings["header_data"];
      this.headersManevr = this.settings["header_data_manevr"];
    },
    async loadSetting() {
      this.settings = await this.$http
        .get(`${this.$store.getters.getServerUrl}/settings`)
        .then((response) => response.data);
      this.settings = JSON.parse(this.settings);
      this.form = this.settings["form_data"];
    },
    async loadSelect() {
      this.resultManevr = await this.$http
        .get(`${this.$store.getters.getServerUrl}/result-oper/manevr`)
        .then((response) => response.data);
      this.resultTrail = await this.$http
        .get(`${this.$store.getters.getServerUrl}/result-oper/trail`)
        .then((response) => response.data);
      this.driver = await this.$http
        .get(`${this.$store.getters.getServerUrl}/driver/select`)
        .then((response) => response.data);
      this.lokoNumber = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select-number`)
        .then((response) => response.data);
      this.lokoType = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select`)
        .then((response) => response.data);
      this.stationOld = await this.$http
        .get(`${this.$store.getters.getServerUrl}/station`)
        .then((response) => response.data);
      this.station = this.stationOld;
      this.area = await this.$http
        .get(`${this.$store.getters.getServerUrl}/area`)
        .then((response) => response.data);
    },
    async save() {     
      let tMS = this.timeStart % 100;
      let tME = this.timeEnd % 100;
      let tHS = parseInt(this.timeStart / 100);
      let tHE = parseInt(this.timeEnd / 100);
      let tS = tHS * 3600 + tMS * 60;
      let tE = tHE * 3600 + tME * 60; 
      let dateNow = Math.round(new Date().getTime()/1000.0);      
      let date = Math.round(new Date(this.dateStart).getTime() / 1000.0)
      let dataStart = Math.round(new Date(this.dateStart).getTime() / 1000.0) + tS;
      let dataEnd = Math.round(new Date(this.dateEnd).getTime() / 1000.0) + tE;
      if (this.dateOld.date != date && this.dateOld.smena==Number(this.radioSmena) &&
          this.dateOld.driver == this.vDriver['id'] && this.dateOld.lokoNumber == this.modelItem.section['id']){
          if(Number(this.radioSmena)==1){
            var secureSmena=false
          }else if((dataStart - this.dateOld.dateEnd) > 35000){
            this.dateOld.dateStart = dataStart
            this.dateOld.dateEnd = dataEnd
            this.dateOld.date=date 
          }else{
            secureSmena=true
            date -= 86400
            this.dateOld.date=date
            this.dateOld.dateStart = dataStart
            this.dateOld.dateEnd = dataEnd
          }             
      }else{
        this.dateOld.dateStart = dataStart
        this.dateOld.dateEnd = dataEnd
        this.dateOld.date=date 
        this.dateOld.smena=Number(this.radioSmena) 
        this.dateOld.driver = this.vDriver['id'] 
        this.dateOld.lokoNumber = this.modelItem.section['id']
      }
      let workTime = (dataEnd - dataStart) / 60;
      var dt_fact = this.modelItem.dt_start - this.modelItem.dt_end;
      var weight = null;
      let doubleNumber;
       if (this.dtStartManevr==null){
        this.dtStartManevr=0
      }
      if (this.modelItem.dt_end==null){
        this.modelItem.dt_end=0
      }
      if (this.doublePull == true){
         doubleNumber = this.modelItem.doubleNumber['id']
      }else{
         doubleNumber = this.modelItem.doubleNumber
      }
      if (dataStart>=dataEnd){
        this.message="Не правильно введено время работы"         
      }else if(this.modelItem.area == null){
         this.message="Выберите участок работ"
      }else if(this.modelItem.section == null){
        this.message="Выберите секцию"          
      }else if(this.radioSmena==''){
        this.message="Выберите смену"        
      }else if(this.stationArr['name'] == this.stationDep['name']){
        this.message="Проверьте правильное заполнение станций"
      }else if((this.modelItem.dt_start == null || this.modelItem.dt_end == null) && this.bort==false){
        this.message="Проверьте правильное заполнение ДТ"
      }else if(this.vDriver == null){
        this.message="Выберите машиниста"
      }else if (tHS > 23 || tMS > 59) {
        this.message="Не правильно задано время начала работ"
      }else if((dataEnd - dataStart) > 46800){
        this.message = "Не правильно введено время работы";
      }else if(tHE > 23 || tME > 59){
        this.message="Не правильно задано время окончания работ"
      }else if(secureSmena==false){
        this.message="Не правильно задана смена"
      }else if((dataStart > (dateNow + 25000))||(dataEnd > (dateNow + 25000))){
        this.message = "Проверьте правильность заполнения даты и время операции"
      }else{
          let data = {
          date: date,
          dateStart: dataStart,
          dateEnd: dataEnd,
          driver: this.vDriver['id'],
          smena: Number(this.radioSmena),
          gp: Number(this.modelItem.gp),
          pv: Number(this.modelItem.pv),
          stationDep: this.stationDep['id'],
          stationArr: this.stationArr['id'],
          lokoNumber: this.modelItem.section['id'],
          dt_start: Number(this.modelItem.dt_start),
          dt_end: Number(this.modelItem.dt_end),
          double: this.doublePull,
          sectionDouble: this.modelItem.sectionDouble,
          doubleNumber: doubleNumber,
          fact: dt_fact,
          work_time: workTime,
          saving: null,
          norm: null,
          area: this.modelItem.area['id'],
          weight: weight,
          bort:this.bort,
          dtBortStart: this.bortDTStart,
          dtBortEnd: this.bortDTEnd
          
        };   
        console.log(data)       
          this.message = await this.$http
          .post(`${this.$store.getters.getServerUrl}/result/`, data)
          .then((response) => response.data);
          this.resultTrail = await this.$http
          .get(`${this.$store.getters.getServerUrl}/result-oper/trail`)
          .then((response) => response.data);
          this.reportOne = await this.$http         
          .post(`${this.$store.getters.getServerUrl}/report/date/`, data)
          .then((response) => response.data);
          this.report.push(this.reportOne); 
          await this.dateFormat(this.resultTrail);
          //await this.dateFormat(this.resultManevr);
          this.reportDriverList();       
          if (this.message=='true'){
            this.modelItem.gp=null;
            this.modelItem.pv=null;        
            this.modelItem.dt_start=this.modelItem.dt_end;
            this.dtStartManevr=this.modelItem.dt_end;        
            this.modelItem.dt_end=null;
            this.modelItem.sectionDouble=null;
            this.modelItem.doubleNumber=null;
            this.stationDep=this.stationArr;
            this.stationManevr=this.stationArr
            this.stationArr=null;
            this.doublePull=false;
            this.dataStart = this.dataEnd;
            this.dataEnd = null;
            this.timeStart = this.timeEnd;
            this.timeEnd = null;
          }else if(this.message==""){
            this.message ='ошибка на сервере'
          }     
        }         
        setTimeout(() => this.message='', 5000);
    },
    async saveManevr() {
      var secureSmenaDriver=true;
      let tMS = this.timeStart % 100;
      let tME = this.timeEnd % 100;
      let tHS = parseInt(this.timeStart / 100);
      let tHE = parseInt(this.timeEnd / 100);
      let tS = tHS * 3600 + tMS * 60;
      let tE = tHE * 3600 + tME * 60;
      let dateNow = Math.round(new Date().getTime()/1000.0);      
      let date = Math.round(new Date(this.dateStart).getTime() / 1000.0)
      let dataStart = Math.round(new Date(this.dateStart).getTime() / 1000.0) + tS;
      let dataEnd = Math.round(new Date(this.dateEnd).getTime() / 1000.0) + tE;
      if (this.dateOld.date != date && this.dateOld.smena==Number(this.radioSmena) &&
          this.dateOld.driver == this.vDriver['id'] && this.dateOld.lokoNumber == this.modelItem.section['id']){
          if(Number(this.radioSmena)==1){
            var secureSmena=false
          }else if((dataStart - this.dateOld.dateEnd) > 35000){
            this.dateOld.dateStart = dataStart
            this.dateOld.dateEnd = dataEnd
            this.dateOld.date=date 
            this.dateOld.driver = this.vDriver['id']
          }else{
            secureSmena=true
            date -= 86400
            this.dateOld.date=date
            this.dateOld.dateStart = dataStart
            this.dateOld.dateEnd = dataEnd
            this.dateOld.driver = this.vDriver['id']
          }             
      }else if(this.dateOld.date != date && this.dateOld.smena==Number(this.radioSmena) &&
               this.dateOld.driver == this.vDriver['id'] && this.dateOld.lokoNumber != this.modelItem.section['id']){
              if(Number(this.radioSmena)==1){
                var secureSmena=false
              }else if(dataStart != this.dateOld.dateEnd){
                // console.log('tut-1')
                // console.log('dataStart', dataStart)
                // console.log('dateOld.dateEnd', this.dateOld.dateEnd )
                this.dateOld.dateStart = dataStart
                this.dateOld.dateEnd = dataEnd
                this.dateOld.date=date 
                this.dateOld.driver = this.vDriver['id']
              }else{
                console.log('tut-2')
                secureSmena=true
                date -= 86400
                this.dateOld.date=date
                this.dateOld.lokoNumber = this.modelItem.section['id']
                this.dateOld.dateStart = dataStart
                this.dateOld.dateEnd = dataEnd
                this.dateOld.driver = this.vDriver['id']
              }       
      }else if(this.dateOld.date !== date && this.dateOld.smena==Number(this.radioSmena) &&
               this.dateOld.driver !== this.vDriver['id'] && this.dateOld.lokoNumber == this.modelItem.section['id']){
                 //console.log('tut-7')
                 if(this.smena_driver == true){
                    //console.log('tut-8')
                    secureSmena=true
                    date = this.dateOld.date                    
                    this.dateOld.lokoNumber = this.modelItem.section['id']
                    this.dateOld.dateStart = dataStart
                    this.dateOld.dateEnd = dataEnd
                    this.dateOld.driver = this.vDriver['id']
                 }else{
                    secureSmena=false
                    secureSmenaDriver=false
                 }
      }else if(this.dateOld.date == date && this.dateOld.smena==Number(this.radioSmena) &&
               this.dateOld.driver !== this.vDriver['id'] && this.dateOld.lokoNumber == this.modelItem.section['id']){
                 if(this.smena_driver == true){
                    //console.log('tut-8')
                    secureSmena=true
                    date = this.dateOld.date                    
                    this.dateOld.lokoNumber = this.modelItem.section['id']
                    this.dateOld.dateStart = dataStart
                    this.dateOld.dateEnd = dataEnd
                    this.dateOld.driver = this.vDriver['id']
                 }else{
                    secureSmena=false
                    secureSmenaDriver=false
                 }
      }else{
        this.dateOld.dateStart = dataStart
        this.dateOld.dateEnd = dataEnd
        this.dateOld.date=date 
        this.dateOld.smena=Number(this.radioSmena) 
        this.dateOld.driver = this.vDriver['id'] 
        this.dateOld.lokoNumber = this.modelItem.section['id']
      }    
      let workTime = (dataEnd - dataStart) / 60;
      var dt_fact =
        Number(this.dtStartManevr) +
        Number(this.equipment) -
        Number(this.dtEndManevr);
      var weight = this.gp * 90 + this.pv * 24;
      if (this.dtStartManevr==null){
        this.dtStartManevr=0
      }
      if (this.dtEndManevr==null){
        this.dtEndManevr=0
      }
      let data = {
        date: date,
        gp: Number(this.gp),
        pv: Number(this.pv),
        dateStart: dataStart,
        dateEnd: dataEnd,
        driver: this.vDriver['id'],
        smena: this.radioSmena,
        fact_manevr: dt_fact,
        work_time_manevr: workTime,
        saving_manevr: null,
        norm_manevr: null,
        area: this.modelItem.area['id'],
        prostoy: this.prostoy,
        thrust: this.thrust,
        obrabotka: this.obrabotka,
        obduv: this.obduv,
        xx: this.xx,
        station: this.stationManevr['id'],
        lokoNumber: this.modelItem.section['id'],
        equipment: Number(this.equipment),
        manevr: true,
        dtStartManevr: this.dtStartManevr,
        dtEndManevr: this.dtEndManevr,
        weight: weight,
        burning: this.burning,
        bort:this.bort,
        smena_loko:this.smena_loko,
        smena_driver: this.smena_driver,
        dtBortStart: this.bortDTStart,
        dtBortEnd: this.bortDTEnd
      };
      //console.log(data);
      if (dataStart > dataEnd) {
        this.message = "Не правильно введено время работы";
      } else if (this.modelItem.section == null) {
        this.message = "Выберите секцию";
      } else if (this.radioSmena == "") {
        this.message = "Выберите смену";
      } else if (this.stationManevr == null) {
        this.message = "Выберите станцию";
      } else if ((this.dtStartManevr == null || this.dtEndManevr == null) && this.bort==false) {
        this.message = "Проверьте правильное заполнение ДТ!!!!";
      } else if (this.vDriver == null) {
        this.message = "Выберите машиниста";
      } else if (
        (this.dtStartManevr < this.dtEndManevr) &&
        (this.equipment == null) 
      ) {
        this.message = "Проверьте правильность заполнения ДТ или укажите экипировку";
      }else if (tHS > 23 || tMS > 59) {
        this.message="Не правильно задано время начала работ"
      }else if(tHE > 23 || tME > 59){
        this.message="Не правильно задано время окончания работ"
      }else if((dataEnd - dataStart) > 46800){
        this.message = "Не правильно введено время работы";
      }else if(secureSmena==false){
        if(secureSmenaDriver==false){
          this.message="Если была смена машиниста в течении смены, укажите это"
        }else{
          this.message="Не правильно задана смена"
        }  
      }else if((dataStart > (dateNow + 25000))||(dataEnd > (dateNow + 25000))){
        this.message = "Проверьте правильность заполнения даты и время операции"
      }else {
        this.message = await this.$http
          .post(`${this.$store.getters.getServerUrl}/result/`, data)
          .then((response) => response.data);
        this.resultManevr = await this.$http
        .get(`${this.$store.getters.getServerUrl}/result-oper/manevr`)
        .then((response) => response.data);
        this.reportOne = await this.$http         
        .post(`${this.$store.getters.getServerUrl}/report/date/`, data)
        .then((response) => response.data);
        this.report.push(this.reportOne); 
        //await this.dateFormat(this.resultTrail);
        await this.dateFormat(this.resultManevr);
        this.reportDriverList();       
        if (this.message == "true") {
          this.dtStartManevr = this.dtEndManevr;
          this.modelItem.dt_start = this.dtEndManevr;
          this.stationDep = this.stationManevr;
          this.dtEndManevr = null;
          this.dataStart = this.dataEnd;
          this.dataEnd = "";
          this.prostoy = false;
          this.thrust = false;
          this.obrabotka = false;
          this.obduv = false;
          this.gp = null;
          this.pv = null;
          this.timeStart = this.timeEnd;
          this.timeEnd = null;
          this.equipment = null;
          this.xx = false;
          this.burning = false;
        }else if(this.message=="") {
          this.message='ошибка на сервере'
        }
      }
      setTimeout(() => (this.message = ""), 5000);
    },
  },
};
</script>
<style scoped>
.text-btn{
  font-size: 11px !important;
}
.text-centr{
  text-align: center !important;
}
.text-td{
  font-size: 12px !important;
  text-align: right !important;
}
.test{ 
  padding: 0 !important;
}
.data .v-data-table {
    padding-top: 0 !important;
} 
</style>