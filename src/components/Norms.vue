<template>   
    <section>
      <div class="container">
        <div class="norms">
        <div class="row">
          <div class="col-12"> 
            <div class="loko">
                <h4>Нормы</h4>
            </div>            
              <v-row>               
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="lokoTypeValue"
                    :items="lokoType"
                    item-text="name"
                    label="Тип локомотива"
                    clearable                    
                  >
                  </v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-select
                    v-model="areaValue"
                    :items="area"
                    item-text="name"
                    label="Участок"
                    clearable
                  >
                  </v-select>
                </v-col>
              </v-row>
              <div id="data-v">
                <v-card>
                  <v-toolbar color="#1583e9" dark flat>
                    <template>
                      <v-tabs v-model="tab" align-with-title>
                        <v-tabs-slider color="yellow"></v-tabs-slider>
                        <v-tab :key="1">Вывозная работа</v-tab>
                        <v-tab :key="2">Маневровая работа</v-tab>                        
                      </v-tabs>
                    </template>
                  </v-toolbar>
                  <v-tabs-items v-model="tab">
                    <!-- Вывозная работа -->
                    <v-tab-item :key="1">
                      <!-- Диалоговое окно -->
                      <v-dialog v-model="dialog_export" max-width="800px">
                        <template v-slot:activator="{ on, attrs }">                          
                          <div class="m-3">
                            <v-btn
                              class="mx-2"
                              fab
                              dark
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon dark> mdi-plus </v-icon>
                            </v-btn>
                          </div>
                        </template>
                        <v-alert type="success" v-if="message == 'true'">
                          Данные внесены успешно
                        </v-alert>
                        <v-alert type="error" v-else-if="message != ''">
                          {{this.message}}
                        </v-alert>
                        
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ formTitle_export }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="6"
                                  v-for="item in inputs_export_select"
                                  :key="item.index"                                  
                                >
                                  <v-select
                                    :label="item.label"
                                    :items="res(item.items)"
                                    :item-text="item.itemText"
                                    :item-value="item.itemValue"
                                    v-model="editedItem[item.vModel]"
                                    @change="onChangeSelected"
                                  ></v-select>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="4"
                                  v-for="item in inputs_export_input"
                                  :key="item.index"
                                >
                                  <v-text-field
                                    :label="item.label"
                                    v-model="editedItem[item.vModel]"
                                  ></v-text-field>
                                </v-col>
                              </v-row>                                                                                     
                              <v-row>
                                <div>
                                  <ul>                                    
                                    <li dense outlined type="error" v-if="$v.editedItem.area.$invalid"><font color="red">Выберите участок</font></li>
                                    <li dense outlined type="error" v-if="$v.editedItem.type_loko.$invalid"><font color="red">Выберите тип секции</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_dep.$invalid"><font color="red">Выберите станцию отправления</font></li> 
                                    <li dense outlined type="error" v-if="$v.editedItem.station_arr.$invalid"><font color="red">Выберите станцию прибытия</font></li>                                  
                                  </ul>
                                </div>    
                              </v-row> 
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                              Отменить
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save" :disabled="$v.$invalid">
                              Сохранить
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <div v-if="norms_vivoz.length != 0">
                        <v-data-table
                          :headers="headers_export"
                          :items="norms_vivoz"
                          item-key="name"
                          class="elevation-1"                          
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-icon
                              small
                              class="mr-2"
                              @click="editItem_export(item)"
                            >
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
                    </v-tab-item>
                    <!-- Маневровая работа -->
                    <v-tab-item :key="2">
                      <v-dialog class="norms-dialog" v-model="dialog_manevr" max-width="800px">
                        <template v-slot:activator="{ on, attrs }">
                          <div class="m-3">
                            <v-btn
                              class="mx-2"
                              fab
                              dark
                              color="primary"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon dark> mdi-plus </v-icon>
                            </v-btn>
                          </div>
                        </template>
                        <v-alert type="success" v-if="message == 'true'">
                          Данные внесены успешно
                        </v-alert>
                        <v-alert type="error" v-else-if="message == 'false'">
                          Произошла ошибка
                        </v-alert>
                        <v-card>
                          <v-card-title>
                            <span class="headline">{{ formTitle_manevr }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="6"
                                  md="6"
                                  v-for="item in inputs_manevr_select"
                                  :key="item.index"
                                >
                                  <v-select
                                    :label="item.label"
                                    :items="res(item.items)"
                                    :item-text="item.itemText"
                                    :item-value="item.itemValue"
                                    v-model="editedItem[item.vModel]"
                                  ></v-select>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col
                                  cols="12"
                                  sm="4"
                                  md="4"
                                  v-for="item in inputs_manevr_input"
                                  :key="item.index"
                                >
                                  <v-text-field
                                    :label="item.label"
                                    v-model="editedItem[item.vModel]"
                                  >
                                  </v-text-field>
                                </v-col>
                              </v-row>                              
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                              Отменить
                            </v-btn>
                            <v-btn color="blue darken-1" text @click="save">
                              Сохранить
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                      <v-data-table
                        :headers="headers_manevr"
                        :items="norms_manevr"
                        sort-by="type_loko"
                        class="elevation-1"
                      >
                        <template v-slot:item.actions="{ item }">
                          <v-icon
                            small
                            class="mr-2"
                            @click="editItem_manevr(item)"
                          >
                            mdi-pencil
                          </v-icon>
                        </template>
                      </v-data-table>
                    </v-tab-item>                   
                  </v-tabs-items>
                </v-card>
              </div>            
          </div>
        </div>
        </div>
      </div>
    </section>
</template>
<script>
import { required, maxLength } from 'vuelidate/lib/validators';
export default {
  data() {
    return {
      message: "",
      type_work:'',
      lokoTypeValue: null,
      areaValue: null,
      dialog_export: false,
      dialog_manevr: false,
      dialog_fix: false,
      search: null,
      tab: null,
      region: [],
      area: [],
      station: [],
      stationSelect: [],
      norms: [],
      norms_manevr: [],
      norms_vivoz: [],
      norms_fix: [],
      lokoType: [],
      type_loko: [],
      headers_export: [],
      settings: [],
      inputs_export: [],
      inputs_export_select: [],
      inputs_export_input: [],
      inputs_manevr: [],
      inputs_manevr_select: [],
      inputs_manevr_input: [],      
      headers_manevr: [],      
      editedIndex: -1,
      editedItem: {
        id:null,
        type_loko: "",
        station_arr: null,
        station_dep: null,
        area: null,
        norma_reserv: null,
        distance: null,
        coeff: null,
        norma_fix: null,
        norm_manevr:null,
        norm_plain:null,
        ov:null,
      },
      defaultItem: {
        id:null,
        type_loko: "",
        station_arr: null,
        station_dep: null,
        area: null,
        norma_reserv: null,
        distance: null,
        coeff: null,
        norma_fix: null,
        norm_manevr:null,
        norm_plain:null,
        ov:null,
      },
    };    
  },
  
  validations: {
    // Название поля должно совпадать с полем в data
      editedItem: {        
        area:{required},
        type_loko: {required},
        station_arr: {required},
        station_dep: {required},     
    },    
  },

  computed: {
    formTitle_export() {
      return this.editedIndex === -1
        ? "Добавить норму для вывозной работы"
        : "Изменить норму для вывозной работы";
    },
    formTitle_manevr() {
      return this.editedIndex === -1
        ? "Добавить норму для маневровой работы"
        : "Изменить норму для маневровой работы";
    },
  },
  watch: {
    dialog_export(val) {
      val || this.close();
    },
    dialog_manevr(val) {
      val || this.close();
    },
    
    areaValue(currentArea, oldArea){
      let norms = this.norms;      
      if (currentArea !== null) {
        this.norms_vivoz = norms.filter(function (el) {
          if (
            (el.area === currentArea) &
            (el.station_arr !== "") &
            (el.station_arr !== null) &
            (el.station_arr !== 0)           
          ) {
            return el;
          }
        });
        this.norms_manevr = norms.filter(function (el) {
          if (
            (el.area === currentArea) &
            (el.norm_manevr !== "") &
            (el.norm_manevr !== null) &
            (el.norm_manevr !== 0)    
          ) {
            return el;
          }
        });        
      }else if ((oldArea !== null) & (currentArea === null)) {
        this.norms_vivoz = norms.filter(function (el) {
          if (
            (el.area !== "") &
            (el.station_arr !== "") &
            (el.station_arr !== null) &
            (el.station_arr !== 0)    
          ) {
            return el;
          }
        });
        this.norms_manevr = norms.filter(function (el) {
          if (
            (el.area !== "") &
            (el.norm_manevr !== "") &
            (el.norm_manevr !== null) &
            (el.norm_manevr !== 0)    
          ) {
            return el;
          }
        });        
      }
    },    
    lokoTypeValue(current, old) {      
      let norms = this.norms;      
      if (current !== null) {
        this.norms_vivoz = norms.filter(function (el) {
          if (
            (el.type_loko === current) &
            (el.station_arr !== "") &
            (el.station_arr !== null) &
            (el.station_arr !== 0)
          ) {
            return el;
          }
        });
        this.norms_manevr = norms.filter(function (el) {
          if (
            (el.type_loko === current) &
            (el.norm_manevr !== "") &
            (el.norm_manevr !== null) &
            (el.norm_manevr !== 0)
          ) {
            return el;
          }
        });        
      } else if ((old !== null) & (current === null)) {
        this.norms_vivoz = norms.filter(function (el) {
          if (
            (el.station_arr !== "") &
            (el.station_arr !== null) &
            (el.station_arr !== 0)
          ) {
            return el;
          }
        });
        this.norms_manevr = norms.filter(function (el) {
          if (
            (el.norm_manevr !== "") &
            (el.norm_manevr !== null) &
            (el.norm_manevr !== 0)
          ) {
            return el;
          }
        });        
      }
    },
  },

  async mounted() {
    await this.loadRegion();
    await this.loadTypeLoko();
    await this.loadNorms();
    await this.loadSettings();
  },
  methods: {
    onChangeSelected:function(){
      if (this.editedItem.area != null){
        let area = this.area;        
        for (let i=0; i<=area.length-1; i++) {
          if (area[i].id==this.editedItem.area){
            let test = area[i].name            
            this.stationSelect=this.station.filter(function(el){
              if(
                el.section == area[i].name
              ){
                return el
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
      this.headers_export = this.settings["header_export"];
      this.headers_manevr = this.settings["header_manevr"];      
      this.inputs_export = this.settings["dialog_export"];
      this.inputs_manevr = this.settings["dialog_manevr"];     
      let inputs_export = this.inputs_export;
      let inputs_manevr = this.inputs_manevr;  
      this.inputs_export_select = inputs_export.filter(function (el) {
        if (el.type == "selected") {
          return el;
        }
      });    
      this.inputs_export_input = inputs_export.filter(function (el) {
        if (el.type == "text") {
          return el;
        }
      });
      this.inputs_manevr_select = inputs_manevr.filter(function (el) {
        if (el.type == "selected") {
          return el;
        }
      });
      this.inputs_manevr_input = inputs_manevr.filter(function (el) {
        if (el.type == "text") {
          return el;
        }
      });
    },

    async loadRegion() {
      this.region = await this.$http
        .get(`${this.$store.getters.getServerUrl}/region`)
        .then((response) => response.data);
      this.area = await this.$http
        .get(`${this.$store.getters.getServerUrl}/area`)
        .then((response) => response.data);      
      this.station = await this.$http
        .get(`${this.$store.getters.getServerUrl}/station`)
        .then((response) => response.data);
      this.stationSelect=this.station;        
    },
    async loadTypeLoko() {
      this.lokoType = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select`)
        .then((response) => response.data);
    },
    async loadNorms() {
      let norms = await this.$http
        .get(`${this.$store.getters.getServerUrl}/norms`)
        .then((response) => response.data);
      this.norms = norms;
      this.norms_vivoz = norms.filter(function (el) {
        if (
          (el.station_arr !== "") &
          (el.station_arr !== null) &
          (el.station_arr !== 0)
        ) {
          return el;
        }
      });
      this.norms_manevr = norms.filter(function (el) {
        if (
          (el.norm_manevr !== "") &
          (el.norm_manevr !== null) &
          (el.norm_manevr !== 0)
        ) {
          return el;
        }
      });
      this.norms_fix = norms.filter(function (el) {
        if (
          (el.norma_fix !== "") &
          (el.norma_fix !== null) &
          (el.norma_fix !== 0)
        ) {
          return el;
        }
      });
    },
    close() {
      this.dialog_export = false; 
      this.dialog_manevr = false;     
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.message = "";
      });
    },
    async save() {
      if(this.editedItem.station_arr != null & this.editedItem.station_dep != null){
        this.type_work='vyvoz'
      }else{
        this.type_work='manevr'
      }
      let data = {
        type_loko: this.editedItem.type_loko,
        station_arr: this.editedItem.station_arr,
        station_dep: this.editedItem.station_dep,
        area: this.editedItem.area,
        norma_reserv: this.editedItem.norma_reserv,
        distance: this.editedItem.distance,
        coeff: this.editedItem.coeff,
        type_work: this.type_work,
        region: this.region[0].id,
        norma_fix: this.editedItem.norma_fix,
        ov: this.editedItem.ov,
        norm_manevr: this.editedItem.norm_manevr,
        norm_plain: this.editedItem.norm_plain,
        id: this.editedItem.id
      };      
      this.message = await this.$http
        .post(`${this.$store.getters.getServerUrl}/norms/`, data)
        .then((response) => response.data);      
      this.editedItem.norma_reserv=null,
      this.editedItem.distance=null,
      this.editedItem.coeff=null,        
      this.editedItem.norma_fix=null,
      this.editedItem.norm_manevr=null,        
      this.editedItem.norm_plain=null,
      this.loadNorms();      
      setTimeout(() => this.message='', 5000);
    },
    editItem_export(item) {
      this.defaultItem = Object.assign({}, item);
      for (var i=0; i<this.station.length; i++){
        if(this.station[i]['name'] == item['station_arr']){          
          item['station_arr']=this.station[i]['id']          
        }else if(this.station[i]['name'] == item['station_dep']){
          item['station_dep']=this.station[i]['id'] 
        }
      }
      for (var i=0; i<this.area.length; i++){
        if(this.area[i]['name'] == item['area']){          
          item['area']=this.area[i]['id']          
        }       
      }
      for (var i=0; i<this.lokoType.length; i++){
        if(this.lokoType[i]['name'] == item['type_loko']){          
          item['type_loko']=this.lokoType[i]['id']          
        }       
      }
      this.editedIndex = this.norms.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog_export = true;
      
      
    },
    editItem_manevr(item) {
      for (var i=0; i<this.lokoType.length; i++){
        if(this.lokoType[i]['name'] == item['type_loko']){          
          item['type_loko']=this.lokoType[i]['id']          
        }       
      }
      let norms = this.norms_manevr      
      this.editedIndex = norms.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog_manevr = true;
      
    },
  },
};
</script>