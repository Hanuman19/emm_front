<template>
  <div>
    <section>
      <div class="container">
        <div class="data">
          <div class="row">
            <div class="loko col-12">
              <h4>Итоговые данные за смену:</h4>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-lg-4 rout-multi-top">
              <div class="form-group">
                <multiselect 
                  v-model="vDriver" 
                  :options="driver" 
                  placeholder="Машинист"                      
                  label="name">
                </multiselect>
              </div>
            </div>
             <div class="col-md-4 col-lg-4 rout-multi-top">
               <v-btn color="blue darken-1" text @click="edit_driver">
                  Изменить
               </v-btn>
            </div>
            <div class="col-md-4 col-lg-4 rout-multi-top">
              <v-dialog
                v-model="dialogDelete"
                persistent
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="blue darken-1" 
                    text
                    v-bind="attrs"
                    v-on="on"
                  >
                    Удалить ММ
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="text-h5">
                    Вы уверены?
                  </v-card-title>                  
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="dialogDelete = false"
                    >
                      Отменить
                    </v-btn>
                    <v-btn
                      color="green darken-1"
                      text
                      @click="deleteAll"
                    >
                      Удалить
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>               
            </div>
          </div>
          <div class="row">
            <div
              class="col-md-4"
              style="margin-top: 6px"
              v-for="item in form"
              :key="item.Index"
              v-if="item.vModel == 'doubleNumber'"
            >
            <div class="form-group">
              <multiselect
                v-model="editedItem[item.vModel]"
                :options="res(item.items)"
                :placeholder="item.label"                       
                label="name"
              >
              </multiselect>
            </div>
            </div>
            <div class="col-md-2 col-lg-2 rout-multi-top">
               <v-btn color="blue darken-1" text @click="edit_driver">
                  Изменить
               </v-btn>
            </div>
            <div
              class="col-md-4"
              style="margin-top: 6px"
            >
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
            </div>
            </div>
            <div class="col-md-2 col-lg-2 rout-multi-top">
               <v-btn color="blue darken-1" text @click="edit_driver">
                  Изменить
               </v-btn>
            </div>
          </div>
          <div class="row justify-content-between">
            <div class="col-12">
              <div v-if="report.length != 0">
                <v-data-table
                  :headers="headersReport"
                  :items="report"
                  hide-default-footer
                  class="elevation-1 text-h5"
                >
                </v-data-table>
              </div>
              <div v-else>
                <v-data-table                          
                  loading
                  loading-text="Загружаем данные"
                >                          
                </v-data-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="row" style="padding-bottom:25px;">
          <div class="loko col-12">
            <h4>Вывозная работа:</h4>
          </div>
        </div>
        <v-dialog v-model="dialog_export" max-width="1000px">
          <v-alert type="success" v-if="message == 'true'">
            Данные внесены успешно
          </v-alert>
          <v-alert type="error" v-else-if="message != ''">
            {{ this.message }}
          </v-alert>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle_export }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="row">
                  <div class="col-md-6 col-lg-4 offset-lg-2">
                    <v-datetime-picker
                      v-model="editedItem.dateStartOld"
                      time-format="HH:mm:ss"
                    ></v-datetime-picker>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <div class="form-group">
                      <v-datetime-picker
                        v-model="editedItem.dateEndOld"
                        time-format="HH:mm:ss"
                      ></v-datetime-picker>
                    </div>
                  </div>
                </div>
                <div class="row mx-auto">
                  <div class="col-md-6 col-lg-4 offset-lg-2 rout-multi-top">
                    <div class="form-group">
                      <multiselect
                        v-model="editedItem.stationDep"
                        :options="station"
                        placeholder="Станция отправления"
                        label="name"
                      >
                      </multiselect>
                    </div>
                  </div>
                  <div class="col-md-6 col-lg-4 rout-multi-top">
                    <div class="form-group">
                      <multiselect
                        v-model="editedItem.stationArr"
                        :options="station"
                        placeholder="Станция прибытия"
                        label="name"
                      >
                      </multiselect>
                    </div>
                  </div>
                </div>
                <div class="row mx-auto">
                  <div
                    class="col-md-6 col-lg-3 offset-lg-2"
                    v-for="item in form"
                    :key="item.Index"
                    v-if="item.type == 'textVG'"
                  >
                    <v-text-field
                      :counter="item.counter"
                      :label="item.label"
                      v-model="editedItem[item.vModel]"
                    ></v-text-field>
                  </div>
                </div>
                <div class="row mx-auto">
                  <div
                    class="col-md-6 col-lg-3 offset-lg-2"
                    v-for="item in form"
                    :key="item.Index"
                    v-if="item.type == 'textDT'"
                  >
                    <v-text-field
                      v-model="editedItem[item.vModel]"
                      :counter="item.counter"
                      :label="item.label"
                    ></v-text-field>
                  </div>
                </div>
                <div class="row mx-auto">
                  <div class="col-md-3 col-lg-2">
                    <div class="form-group">
                      <div class="col-md-5 col-lg-5">
                        <v-switch
                          v-model="editedItem.double"
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
                        v-model="editedItem[item.vModel]"
                      >
                      </v-select>
                    </div>
                  </div>
                  <div
                    class="col-md-4"
                    style="margin-top: 6px"
                    v-for="item in form"
                    :key="item.Index"
                    v-if="item.vModel == 'doubleNumber'"
                  >
                    <div class="form-group">
                      <multiselect
                        v-model="editedItem[item.vModel]"
                        :options="res(item.items)"
                        :placeholder="item.label"                       
                        label="name"
                      >
                      </multiselect>
                    </div>
                  </div>
                </div>
                <div class="row mx-auto">
                 <div class="col-md-3 col-lg-2">
                    <div class="form-group">
                      <div class="col-md-5 col-lg-5">
                        <v-switch
                          v-model="editedItem.bort"
                          :label="`Борт не работает`"
                        ></v-switch>
                      </div>
                    </div>
                  </div>
                </div>
                <v-row>
                  <!--<div>
                                  <ul>                                    
                                    <li dense outlined type="error" v-if="$v.editedItem.area.$invalid"><font color="red">Выберите участок</font></li>
                                    <li dense outlined type="error" v-if="$v.editedItem.type_loko.$invalid"><font color="red">Выберите тип секции</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_dep.$invalid"><font color="red">Выберите станцию отправления</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_arr.$invalid"><font color="red">Выберите станцию прибытия</font></li>                                  
                                  </ul>
                                </div>-->
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-dialog
                  v-model="dialogDelete"
                  persistent
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue darken-1" 
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      Удалить
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">
                      Вы уверены?
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="dialogDelete = false"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="delete_operation"
                      >
                        Удалить
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>   
              <v-btn color="blue darken-1" text @click="close">
                Отменить
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div v-if="resultTrail.length != 0">
          <v-data-table
            :headers="headresTrail"
            :items="resultTrail"         
            class="elevation-1 text-h5"
          >
            <template v-slot:item.double="{ item }">
              <div v-if="item.double == true">
                <v-icon color="green darken-2"> mdi-check </v-icon>
              </div>
              <div v-else>
                <v-icon color="red">mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem_export(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </div>
        <div v-else>
          <v-data-table                          
            loading
            loading-text="Загружаем данные"
          >                          
          </v-data-table>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <div class="row" style="padding-bottom:25px;">
          <div class="loko col-12">
            <h4>Маневровая работа:</h4>
          </div>
        </div>
        <v-dialog v-model="dialog_manevr" max-width="1000px">
          <v-alert type="success" v-if="message == 'true'">
            Данные внесены успешно
          </v-alert>
          <v-alert type="error" v-else-if="message != ''">
            {{ this.message }}
          </v-alert>

          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle_manevr }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <div class="row">
                  <div class="col-md-6 col-lg-4 offset-lg-2">
                    <v-datetime-picker
                      v-model="editedItem.dateStartOld"
                      time-format="HH:mm:ss"
                    ></v-datetime-picker>
                  </div>
                  <div class="col-md-6 col-lg-4">
                    <div class="form-group">
                      <v-datetime-picker
                        v-model="editedItem.dateEndOld"
                        time-format="HH:mm:ss"
                      ></v-datetime-picker>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 col-lg-4 offset-lg-2">
                    <multiselect
                      v-model="editedItem.station"
                      :options="station"
                      placeholder="Станция"
                      label="name"
                    >
                    </multiselect>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 col-lg-4 offset-lg-2">
                    <v-text-field
                      v-model="editedItem.dtStartManevr"
                      :counter="10"
                      label="ДТ на начало операции"
                    ></v-text-field>
                  </div>
                  <div class="col-md-6 col-lg-4 offset-lg-2">
                    <v-text-field
                      v-model="editedItem.dtEndManevr"
                      :counter="10"
                      label="Дт на конец операции"
                    ></v-text-field>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <v-switch v-model="editedItem.prostoy" :label="`Простой`"></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch v-model="editedItem.thrust" :label="`Вытяжка`"></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch
                      v-model="editedItem.obrabotka"
                      :label="`Обработка вагонов`"
                    ></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch
                      v-model="editedItem.obduv"
                      :label="`Обдув вагонов`"
                    ></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch
                      v-model="editedItem.xx"
                      :label="`Холодный простой`"
                    ></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch
                      v-model="editedItem.burning"
                      :label="`Прожиг`"
                    ></v-switch>
                  </div>
                  <div class="col-md-3">
                    <v-switch
                      v-model="editedItem.bort"
                      :label="`Борт не работает`"
                    ></v-switch>
                  </div>
                </div>                
                <v-row>
                <v-row>
                  <div class="col-lg-4" v-if="editedItem.prostoy==true">
                      <v-text-field
                        v-model="editedItem.equipment"
                        :counter="10"
                        label="Экипировка"                        
                      ></v-text-field>
                    </div>
                  <div class="col-lg-4" v-if="editedItem.thrust==true">
                    <v-text-field
                      v-model="editedItem.gp"
                      :counter="10"
                      label="Груженные вагоны"
                      
                    ></v-text-field>
                  </div>
                  <div class="col-lg-4" v-if="editedItem.thrust==true">
                    <v-text-field
                      v-model="editedItem.pv"
                      :counter="10"
                      label="Порожные вагоны"
                      
                    ></v-text-field>
                  </div>
                </v-row>
                  <!--<div>
                                  <ul>                                    
                                    <li dense outlined type="error" v-if="$v.editedItem.area.$invalid"><font color="red">Выберите участок</font></li>
                                    <li dense outlined type="error" v-if="$v.editedItem.type_loko.$invalid"><font color="red">Выберите тип секции</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_dep.$invalid"><font color="red">Выберите станцию отправления</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_arr.$invalid"><font color="red">Выберите станцию прибытия</font></li>                                  
                                  </ul>
                                </div>-->
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
                <v-dialog
                  v-model="dialogDelete"
                  persistent
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue darken-1" 
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      Удалить
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title class="text-h5">
                      Вы уверены?
                    </v-card-title>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="dialogDelete = false"
                      >
                        Отменить
                      </v-btn>
                      <v-btn
                        color="green darken-1"
                        text
                        @click="delete_operation"
                      >
                        Удалить
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>    
              <v-btn color="blue darken-1" text @click="close_manevr">
                Отменить
              </v-btn>
              <v-btn color="blue darken-1" text @click="save_manevr">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <div v-if="resultManevr.length != 0">
          <v-data-table
            :headers="headersManevr"
            :items="resultManevr"          
            class="elevation-1 text-h5"
          >   
            <template v-slot:item.thrust="{ item }">
              <div v-if="item.thrust == true">
                <v-icon color="green darken-2"> mdi-check </v-icon>
              </div>
              <div v-else>
                <v-icon color="red">mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:item.obrabotka="{ item }">
              <div v-if="item.obrabotka == true">
                <v-icon color="green darken-2"> mdi-check </v-icon>
              </div>
              <div v-else>
                <v-icon color="red">mdi-close</v-icon>
              </div>
            </template>       
            <template v-slot:item.obduv="{ item }">
              <div v-if="item.obduv == true">
                <v-icon color="green darken-2"> mdi-check </v-icon>
              </div>
              <div v-else>
                <v-icon color="red">mdi-close</v-icon>
              </div>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem_manevr(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </div>
        <div v-else>
          <v-data-table                          
            loading
            loading-text="Загружаем данные"
          >                          
          </v-data-table>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Multiselect from "vue-multiselect";
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
export default {
  data() {
    return {
      date:null,
      dialogDelete: false,
      vDriver: null,
      driver: [],
      lokoNumber: [],
      lokoType: [],
      diss: true,
      doublePull: null,
      editedIndex: -1,
      editedItem: {
        bort:null,
        equipment:null,
        thrust:null,
        obduv:null,
        obrabotka: null,
        prostoy: null,
        station: null,
        gp: null,
        pv: null,
        dt_start: null,
        dt_end: null,
        dtStartManevr: null,
        dtEndManevr: null,
        stationDep: null,
        stationArr: null,
        dateStartOld: null,
        dateEndOld: null,
        sectionDouble: null,
        doubleNumber: null,
        double: null,
        xx: null,
        burning: null,
      },
      defaultItem: {
        bort:null,
        equipment:null,
        thrust:null,
        obduv:null,
        obrabotka: null,
        prostoy: null,
        station: null,
        gp: null,
        pv: null,
        dt_start: null,
        dt_end: null,
        dtStartManevr: null,
        dtEndManevr: null,
        stationDep: null,
        stationArr: null,
        dateStartOld: null,
        dateEndOld: null,
        sectionDouble: null,
        doubleNumber: null,
        double: null,
        xx: null,
        burning: null,
      },
      doublePull: false,
      snack: false,
      form: [],
      message: "",
      dialog_export: false,
      dialog_manevr: false,
      station: [],
      snackColor: "",
      snackText: "",
      id: null,
      reportID: null,
      report: [],
      dateOld:{
        date:null,
        smena: null,
        driver: null,
        lokoNumber: null
      },
      thru: true,
      equ: true,
      reportRes: {},
      settings: [],
      dataResult: [],
      resultData: [],
      resultEdit: [],
      resultTrail: [],      
      resultManevr: [],
      headers: [],
      headresTrail: [],
      headersReport: [],
      headersManevr: [
        { text: "Время начала", value: "dateStart", sortable: false },
        { text: "Время окончания", value: "dateEnd", sortable: false },
        { text: "Станция", value: "station", sortable: false },
        { text: "Время работы", value: "work_time_manevr", sortable: false },
        { text: "Простой", value: "prostoy", sortable: false },
        { text: "Груженные вагоны", value: "gp", sortable: false },
        { text: "Порожные вагоны", value: "pv", sortable: false },
        {
          text: "Дт на начало операции",
          value: "dtStartManevr",
          sortable: false,
        },
        { text: "ДТ на конец операции", value: "dtEndManevr", sortable: false },
        { text: "Факт расхода ДТ", value: "fact_manevr", sortable: false },
        { text: "Норма расхода ДТ", value: "norm_manevr", sortable: false },
        { text: "+Э/-П", value: "saving_manevr", sortable: false },
        { text: "Экипировка", value: "equipment", sortable: false },
        { text: "Обдув", value: "obduv", sortable: false },
        { text: "Обработка", value: "obrabotka", sortable: false },
        { text: "Вытяжка", value: "thrust", sortable: false },
        {
          text: "Редактировать",
          value: "actions",
          sortable: false,
          groupable: false,
        },
      ],
    };
  },
  async mounted() {
    await this.loadSettings();
    await this.loadSelect();
    await this.loadData();
    let d = 1;
    await this.dateFormat(this.report, d);
    await this.dateFormat(this.resultTrail);
    await this.dateFormat(this.resultManevr);
  },
  methods: {    
    async edit_driver() {
      let resultTrailId = []
      let resultManevrId = []
      let loko
      let driver
      let date
      if (this.vDriver == undefined){
        driver = null
      }else{
        driver = this.vDriver['id']
      }
      if (this.editedItem.doubleNumber == undefined){
        loko = null
      }else{
        loko = this.editedItem.doubleNumber['id']
      }
      if (this.date == undefined){
        date = null
      }else{
        date = Math.round(new Date(this.date).getTime()/1000.0)
      }
      for (var i = 0; i<this.resultManevr.length;i++){
        resultManevrId[i] = this.resultManevr[i]['id'];
      }
      for (var i = 0; i<this.resultTrail.length;i++){
        resultTrailId[i] = this.resultTrail[i]['id'];
      }
      let data ={
        driver: driver,
        loko: loko,
        date: date,
        id:this.id,
        trail:resultTrailId,
        manevr:resultManevrId
      }
      console.log(data)
      let resultEdit = await this.$http
        .post(
          `${this.$store.getters.getServerUrl}/driver-edit/`,
          data
        )
        //.then((response) => response.data);
      this.resultEdit = resultEdit.data
      await this.loadData();
      let d = 1;
      console.log(this.resultTrail)
      await this.dateFormat(this.report, d);
      await this.dateFormat(this.resultTrail);
      await this.dateFormat(this.resultManevr);
    },
    async loadData() {
      this.report=[]
      this.resultTrail=[]
      this.resultManevr=[]
      this.resultData=[]
      this.id = await this.$store.state.reportID;
      let {data} = await this.$http
        .get(`${this.$store.getters.getServerUrl}/report/${this.id}`)
        //.then((response) => response.data);
      this.reportID=data
      //console.log('ответ от сервера', data)
      this.report.push(data);
      //console.log(this.report)
      for (var i = 0; i < this.report.length; i++) {
        this.reportRes["date"] = this.report[i]["date"];
        this.reportRes["driver"] = this.report[i]["driver"];
        this.reportRes["smena"] = this.report[i]["smena"];
        this.reportRes["lokoNumber"] = this.report[i]["lokoNumber"];
      }
      //console.log(this.reportRes)
      this.resultData = await this.$http
        .post(
          `${this.$store.getters.getServerUrl}/result/date-now/`,
          this.reportRes
        )
        //.then((response) => response.data);
      console.log('Trail:',this.resultData)     
      this.resultTrail = this.resultData.data["vyvoz"];
      this.resultManevr = this.resultData.data["manevr"];
      //console.log(this.resultTrail);
    },
    res(val) {
      return this[val];
    },
    async loadSelect() {
      this.stationOld = await this.$http
        .get(`${this.$store.getters.getServerUrl}/station`)
        //.then((response) => response.data);
      this.station = this.stationOld.data;
      let {data} = await this.$http
        .get(`${this.$store.getters.getServerUrl}/area`)
        //.then((response) => response.data);
        this.area=data
       let lokoNumber = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select-number`)
        //.then((response) => response.data);
      this.lokoNumber=lokoNumber.data
      let lokoType = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select`)
        //.then((response) => response.data);
        this.lokoType = lokoType.data
       let driver= await this.$http
        .get(`${this.$store.getters.getServerUrl}/driver/select`)
        //.then((response) => response.data);
      this.driver=driver.data
    },
    async loadSettings() {
      this.settings = await this.$http
        .get(`${this.$store.getters.getServerUrl}/settings`)
        //.then((response) => response.data);
      this.settings.data = JSON.parse(this.settings.data);
      this.form = this.settings.data["form_data"];
      this.headresTrail = this.settings.data["headresTrail"];
      this.headersReport = this.settings.data["headersReport"];
    },

    dateFormat(item, d) {
      let b = 1;
      for (var i = 0; i < item.length; i++) {        
        if ( d==true ){
          item[i]["date"] = this.timeConverter(item[i]["date"], d);
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
    getColor(saving) {
      if (saving < 0) return "red";
      else return "green";
    },
    async delete_operation(){
      let manevr
      let date = this.reportRes["date"]
      let fact = this.editedItem.station
      if (fact == undefined){
        manevr = false
      }else{
        manevr = true
      }
      let data ={
        date: date,
        id: this.editedItem.id,
        manevr_rabota: manevr,
        id_report: this.id
      }
      //console.log(data)
      this.message = await this.$http
          .post(`${this.$store.getters.getServerUrl}/delete-operation/`, data)
          .then((response) => response.data);
      await this.loadData();
      let d = 1;
      //console.log(this.resultTrail)
      await this.dateFormat(this.report, d);
      await this.dateFormat(this.resultTrail);
      await this.dateFormat(this.resultManevr);
      this.dialogDelete = false;
    },
    async deleteAll(){
      let resultTrailId = []
      let resultManevrId = []
      for (var i = 0; i<this.resultManevr.length;i++){
        resultManevrId[i] = this.resultManevr[i]['id'];
      }
      for (var i = 0; i<this.resultTrail.length;i++){
        resultTrailId[i] = this.resultTrail[i]['id'];
      }
      let data ={ 
        id:this.id,
        trail:resultTrailId,
        manevr:resultManevrId,
        dellAll: true
      }
      let message = await this.$http
          .post(`${this.$store.getters.getServerUrl}/delete-operation/`, data)
          //.then((response) => response.data);
      this.message = message.data
      await this.loadData();
      let d = 1;
      await this.dateFormat(this.report, d);
      await this.dateFormat(this.resultTrail);
      await this.dateFormat(this.resultManevr);
      this.dialogDelete = false;
    },   
    async save_manevr() {
      let dataStart = Math.round(
        new Date(this.editedItem.dateStartOld).getTime() / 1000.0
      ) + 25200;
      let dataEnd = Math.round(
        new Date(this.editedItem.dateEndOld).getTime() / 1000.0
      ) + 25200;     
      let date = this.reportRes["date"]      
      let workTime = (dataEnd - dataStart) / 60;
      var dt_fact = Number(this.editedItem.dtStartManevr) + Number(this.editedItem.equipment) - Number(this.editedItem.dtEndManevr);
      var weight = Number(this.editedItem.gp) * 90 + Number(this.editedItem.pv) * 24;
      if (dataStart>=dataEnd){
        this.message="Не правильно введено время работы"         
      }else if(this.editedItem.area == null){
         this.message="Выберите участок работ"
      }else if(this.editedItem.dtStartManevr == null || this.editedItem.dtStartManevr == null || dt_fact < 0){
        this.message="Проверьте правильное заполнение ДТ"
      }else{
        let data = {
          date: date,
          driver: this.editedItem.driver,
          id: this.editedItem.id,
          lokoNumber: this.editedItem.lokoNumber,
          area: this.editedItem.area,
          smena: this.editedItem.smena,
          user: this.editedItem.user,
          dateStart: dataStart,
          dateEnd: dataEnd,
          work_time_manevr: workTime,
          gp: Number(this.editedItem.gp),
          pv: Number(this.editedItem.pv),
          dtStartManevr: Number(this.editedItem.dtStartManevr),
          dtEndManevr: Number(this.editedItem.dtEndManevr),
          fact_manevr: dt_fact,        
          station: this.editedItem.station["id"],        
          report: this.report[0]["id"],
          thrust: this.editedItem.thrust,
          prostoy: this.editedItem.prostoy,
          obrabotka: this.editedItem.obrabotka,
          obduv: this.editedItem.obduv,
          equipment: this.editedItem.equipment,
          xx: this.editedItem.xx, 
          weight: weight,
          burning: this.editedItem.burning,
          bort: this.editedItem.bort     
        };
        //console.log(this.editedItem.xx)
        console.log(data);
        let message = await this.$http
          .post(`${this.$store.getters.getServerUrl}/result-edit/trail/`, data)
          //.then((response) => response.data);
        this.message=message.data
        await this.loadData();
        let d = 1;
        await this.dateFormat(this.report, d);
        await this.dateFormat(this.resultTrail);
        await this.dateFormat(this.resultManevr);
      }
      setTimeout(() => (this.message = ""), 5000);
    },
    async save() {
      let dataStart = Math.round(
        new Date(this.editedItem.dateStartOld).getTime() / 1000.0
      ) + 25200;
      let dataEnd = Math.round(
        new Date(this.editedItem.dateEndOld).getTime() / 1000.0
      ) + 25200;
      let date = this.reportRes["date"]  
      let workTime = (dataEnd - dataStart) / 60;
      var dt_fact = this.editedItem.dt_start - this.editedItem.dt_end;
      var weight = null;
      let data = {
        date: date,
        driver: this.editedItem.driver,
        id: this.editedItem.id,
        lokoNumber: this.editedItem.lokoNumber,
        area: this.editedItem.area,
        smena: this.editedItem.smena,
        user: this.editedItem.user,
        dateStart: dataStart,
        dateEnd: dataEnd,
        work_time: workTime,
        gp: Number(this.editedItem.gp),
        pv: Number(this.editedItem.pv),
        dt_start: Number(this.editedItem.dt_start),
        dt_end: Number(this.editedItem.dt_end),
        fact: dt_fact,
        weight: Number(weight),
        stationDep: this.editedItem.stationDep["id"],
        stationArr: this.editedItem.stationArr["id"],
        report: this.report[0]["id"],
        double: this.editedItem.double,
        sectionDouble: this.editedItem.sectionDouble,
        bort: this.editedItem.bort
      };
      //console.log(data);
      let message = await this.$http
        .post(`${this.$store.getters.getServerUrl}/result-edit/trail/`, data)
        //.then((response) => response.data);
      this.message = message.data
      await this.loadData();
      let d = 1;
      await this.dateFormat(this.report, d);
      await this.dateFormat(this.resultTrail);
      await this.dateFormat(this.resultManevr);
      setTimeout(() => (this.message = ""), 5000);
    },
    close_manevr() {
      this.dialog_manevr = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.message = "";
      });
    },
    close() {
      this.dialog_export = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.message = "";
      });
      //console.log('Dialog closed')
      //console.log(this.resultTrail)
    },
    editItem_manevr(item) {
      let copyItem = Object.assign({}, item);
      for (var i = 0; i < this.station.length; i++) {
        if (this.station[i]["name"] == copyItem["station"]) {
          copyItem["station"] = this.station[i];
        }
      }
      this.editedIndex = this.resultManevr.indexOf(copyItem);
      this.editedItem = Object.assign({}, copyItem);
      //console.log(this.editedItem);
      this.dialog_manevr = true;
    },
    editItem_export(item) {
      let copyItem = Object.assign({}, item);
      for (var i = 0; i < this.station.length; i++) {
        if (this.station[i]["name"] == copyItem["stationArr"]) {
          copyItem["stationArr"] = this.station[i];
        } else if (this.station[i]["name"] == copyItem["stationDep"]) {
          copyItem["stationDep"] = this.station[i];
        }
      }
      this.editedIndex = this.resultTrail.indexOf(copyItem);
      this.editedItem = Object.assign({}, copyItem);
      //console.log(this.editedItem);
      this.dialog_export = true;
    },
  },
  components: {
    Multiselect,
  },
  computed: {
    formTitle_export() {
      return this.editedIndex === -1
        ? "Изменить вывозную работу"
        : "Изменить норму для вывозной работы";
    },
    formTitle_manevr() {
      return this.editedIndex === -1
        ? "Изменить маневровую работы"
        : "Изменить норму для маневровой работы";
    },
  },
  watch: {
    prostoy() {
      if (this.prostoy == false) {
        this.equ = true;
      } else {
        this.equ = false;
      }
    },
    thrust() {
      if (this.editedItem.thrust == false) {
        this.thru = true;
      } else {
        this.thru = false;
      }
    },    
    dialog_export(val) {
      val || this.close();
    },
  },
};
</script>