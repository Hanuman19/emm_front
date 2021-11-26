<template>
  <div class="report-table">
    <div class="loko">
      <h4>Отчет по локомотивам</h4>
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
            <v-btn text color="primary" @click="$refs.menu.save(dates)">
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
    <div class="text-center" v-if="loading == true">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-row v-if="loko_res.length != 0">
      <v-simple-table>
        <thead>
          <tr class="bg-info">
            <th scope="col" colspan="13" style="text-align: center">
              Итог расхода ДТ по видам работ
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="td-1">
            <td colspan="2" rowspan="2"></td>
            <td colspan="3">Вывозная работа</td>
            <td colspan="3">Маневровая работа</td>
            <td colspan="3">Итого:</td>
            <td colspan="2" rowspan="2">Экипировка</td>
          </tr>
          <tr class="td-1">
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
          <tr>
            <td colspan="13" class="td-centre">Тэм 7(А)</td>
          </tr>
          <tr
            v-for="(val, key) in loko_res"
            :key="key"
            v-if="val.typeLoko == 'ТЭМ7(А)' && val.area == 3"
          >
            <td colspan="2" class="td-1">
              <v-dialog transition="dialog-bottom-transition" max-width="1400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    text
                    color="indigo"
                    @click="razbor(val.lokoNumber)"
                  >
                    {{ val.lokoNumber }}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark
                      ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                      {{ val.lokoNumber }}
                    </v-toolbar>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="loko_razbor"
                        class="elevation-1"
                      >
                        <template v-slot:item.driver="{ item }">
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
                                @click="routesheetDriver(item.driver, item.id)"
                              >
                                {{ item.driver }}
                              </v-btn>
                            </template>
                            <template v-slot:default="dialog">
                              <v-card>
                                <v-toolbar color="primary" dark
                                  ><v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                  {{ item.driver }}
                                </v-toolbar>
                                <v-card-text>
                                  <v-row class="report-table">
                                    <Routesheet />
                                  </v-row>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
                        </template>
                        <template v-slot:item.saving_result="{ item }">
                          <v-chip :color="getColor(item.saving_result)" dark>
                            {{ item.saving_result }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="td-2">{{ val.norm_trail }}</td>
            <td class="td-2">{{ val.fact_trail }}</td>
            <td class="td-2">
              <div v-if="val.saving_trail < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_trail }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_trail }}
                </div>
              </div>
            </td>
            <!--вывозная работа-->
            <td class="td-2">{{ val.norm_manevr }}</td>
            <td class="td-2">{{ val.fact_manevr }}</td>
            <td class="td-2">
              <div v-if="val.saving_manevr < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_manevr }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_manevr }}
                </div>
              </div>
              <!--маневровая-->
            </td>
            <td class="td-2">{{ val.norm_result }}</td>
            <td class="td-2">{{ val.fact_result }}</td>
            <td class="td-2">
              <div v-if="val.saving_result < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_result }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_result }}
                </div>
              </div>
              <!--общее-->
            </td>
            <td colspan="2" class="td-2"></td>
          </tr>
          <tr>
            <td colspan="13" class="td-centre">Тэм 7</td>
          </tr>
          <tr
            v-for="(val, key) in loko_res"
            :key="key"
            v-if="val.typeLoko == 'ТЭМ7' && val.area == 3"
          >
            <td colspan="2" class="td-1">
              <v-dialog transition="dialog-bottom-transition" max-width="1400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    text
                    color="indigo"
                    @click="razbor(val.lokoNumber)"
                  >
                    {{ val.lokoNumber }}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark
                      ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                      {{ val.lokoNumber }}
                    </v-toolbar>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="loko_razbor"
                        class="elevation-1"
                      >
                        <template v-slot:item.driver="{ item }">
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
                                @click="routesheetDriver(item.driver, item.id)"
                              >
                                {{ item.driver }}
                              </v-btn>
                            </template>
                            <template v-slot:default="dialog">
                              <v-card>
                                <v-toolbar color="primary" dark
                                  ><v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                  {{ item.driver }}
                                </v-toolbar>
                                <v-card-text>
                                  <v-row class="report-table">
                                    <Routesheet />
                                  </v-row>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
                        </template>
                        <template v-slot:item.saving_result="{ item }">
                          <v-chip :color="getColor(item.saving_result)" dark>
                            {{ item.saving_result }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="td-2">{{ val.norm_trail }}</td>
            <td class="td-2">{{ val.fact_trail }}</td>
            <td class="td-2">
              <div v-if="val.saving_trail < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_trail }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_trail }}
                </div>
              </div>
            </td>
            <!--вывозная работа-->
            <td class="td-2">{{ val.norm_manevr }}</td>
            <td class="td-2">{{ val.fact_manevr }}</td>
            <td class="td-2">
              <div v-if="val.saving_manevr < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_manevr }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_manevr }}
                </div>
              </div>
              <!--маневровая-->
            </td>
            <td class="td-2">{{ val.norm_result }}</td>
            <td class="td-2">{{ val.fact_result }}</td>
            <td class="td-2">
              <div v-if="val.saving_result < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_result }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_result }}
                </div>
              </div>
              <!--общее-->
            </td>
            <td colspan="2" class="td-2"></td>
          </tr>
          <tr>
            <td colspan="13" class="td-centre">Тэм 2(18)</td>
          </tr>
          <tr
            v-for="(val, key) in loko_res"
            :key="key"
            v-if="val.typeLoko == 'ТЭМ2(18)' && val.area == 3"
          >
            <td colspan="2" class="td-1">
              <v-dialog transition="dialog-bottom-transition" max-width="1400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    text
                    color="indigo"
                    @click="razbor(val.lokoNumber)"
                  >
                    {{ val.lokoNumber }}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark
                      ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                      {{ val.lokoNumber }}
                    </v-toolbar>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="loko_razbor"
                        class="elevation-1"
                      >
                        <template v-slot:item.driver="{ item }">
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
                                @click="routesheetDriver(item.driver, item.id)"
                              >
                                {{ item.driver }}
                              </v-btn>
                            </template>
                            <template v-slot:default="dialog">
                              <v-card>
                                <v-toolbar color="primary" dark
                                  ><v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                  {{ item.driver }}
                                </v-toolbar>
                                <v-card-text>
                                  <v-row class="report-table">
                                    <Routesheet />
                                  </v-row>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
                        </template>
                        <template v-slot:item.saving_result="{ item }">
                          <v-chip :color="getColor(item.saving_result)" dark>
                            {{ item.saving_result }}
                          </v-chip>
                        </template>
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="td-2">{{ val.norm_trail }}</td>
            <td class="td-2">{{ val.fact_trail }}</td>
            <td class="td-2">
              <div v-if="val.saving_trail < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_trail }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_trail }}
                </div>
              </div>
            </td>
            <!--вывозная работа-->
            <td class="td-2">{{ val.norm_manevr }}</td>
            <td class="td-2">{{ val.fact_manevr }}</td>
            <td class="td-2">
              <div v-if="val.saving_manevr < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_manevr }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_manevr }}
                </div>
              </div>
              <!--маневровая-->
            </td>
            <td class="td-2">{{ val.norm_result }}</td>
            <td class="td-2">{{ val.fact_result }}</td>
            <td class="td-2">
              <div v-if="val.saving_result < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_result }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_result }}
                </div>
              </div>
              <!--общее-->
            </td>
            <td colspan="2" class="td-2"></td>
          </tr>
          <tr class="td-3">
            <td colspan="2">Итого уч. Черногорский</td>
            <td></td>
            <td></td>
            <td></td>
            <!--вывозная работа-->
            <td></td>
            <td></td>
            <td></td>
            <!--маневровая-->
            <td></td>
            <td></td>
            <td></td>
            <!--общее-->
            <td colspan="2"></td>
          </tr>
          <tr>
            <td colspan="13" class="td-centre">Участок Изыхский</td>
          </tr>
          <tr v-for="(val, key) in loko_res" :key="key" v-if="val.area == 4">
            <td colspan="2" class="td-1">
              <v-dialog transition="dialog-bottom-transition" max-width="1400">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    text
                    color="indigo"
                    @click="razbor(val.lokoNumber)"
                  >
                    {{ val.lokoNumber }}
                  </v-btn>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark
                      ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                      {{ val.lokoNumber }}
                    </v-toolbar>
                    <v-card-text>
                      <v-data-table
                        :headers="headers"
                        :items="loko_razbor"
                        class="elevation-1"
                      >
                        <template v-slot:item.driver="{ item }">
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
                                @click="routesheetDriver(item.driver, item.id)"
                              >
                                {{ item.driver }}
                              </v-btn>
                            </template>
                            <template v-slot:default="dialog">
                              <v-card>
                                <v-toolbar color="primary" dark
                                  ><v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                  {{ item.driver }}
                                </v-toolbar>
                                <v-card-text>
                                  <v-row class="report-table">
                                    <Routesheet />
                                  </v-row>
                                </v-card-text>
                                <v-card-actions class="justify-end">
                                  <v-btn text @click="dialog.value = false"
                                    >Закрыть</v-btn
                                  >
                                </v-card-actions>
                              </v-card>
                            </template>
                          </v-dialog>
                        </template>

                        <template v-slot:item.saving_result="{ item }">
                          <v-chip :color="getColor(item.saving_result)" dark>
                            {{ item.saving_result }}
                          </v-chip>
                        </template>
                        
                      </v-data-table>
                    </v-card-text>
                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </td>
            <td class="td-2">{{ val.norm_trail }}</td>
            <td class="td-2">{{ val.fact_trail }}</td>
            <td class="td-2">
              <div v-if="val.saving_trail < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_trail }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_trail }}
                </div>
              </div>
            </td>
            <!--вывозная работа-->
            <td class="td-2">{{ val.norm_manevr }}</td>
            <td class="td-2">{{ val.fact_manevr }}</td>
            <td class="td-2">
              <div v-if="val.saving_manevr < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_manevr }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_manevr }}
                </div>
              </div>
              <!--маневровая-->
            </td>
            <td class="td-2">{{ val.norm_result }}</td>
            <td class="td-2">{{ val.fact_result }}</td>
            <td class="td-2">
              <div v-if="val.saving_result < 0">
                <div v-bind:style="styleObjectRed">{{ val.saving_result }}</div>
              </div>
              <div v-else>
                <div v-bind:style="styleObjectGreen">
                  {{ val.saving_result }}
                </div>
              </div>
              <!--общее-->
            </td>
            <td colspan="2" class="td-2"></td>
          </tr>
          <tr class="td-3">
            <td colspan="2">Итого уч. Изыхский</td>
            <td></td>
            <td></td>
            <td></td>
            <!--вывозная работа-->
            <td></td>
            <td></td>
            <td></td>
            <!--маневровая-->
            <td></td>
            <td></td>
            <td></td>
            <!--общее-->
            <td colspan="2"></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row>
    <!-- <v-row v-if="loko_razbor.length !=0">
      <v-simple-table>
        <tbody>
          <tr>
            <td>Дата</td>
            <td>Машинист</td>
            <td>Смена</td>
            <td>Факт</td>
            <td>Норма</td>
            <td>Экономия</td>
          </tr>
          <tr v-for="(val, key) in loko_razbor" :key="key">
            <td>{{val.date}}</td>
            <td>{{val.driver}}</td>
            <td>{{val.smena}}</td>
            <td>{{val.fact_result}}</td>
            <td>{{val.norm_result}}</td>
            <td>{{val.saving_result}}</td>
            <td>{{val.dtStart}}</td>
            <td>{{val.dtEnd}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row> -->
  </div>
</template>
<script>
import { DateTime, Duration, Info, Interval, Settings } from "luxon";
import Routesheet from '../components/Sheet/TDRoutesheet.vue';
export default {
  data() {
    return {
      headers: [
        { text: "Дата", value: "date" },
        { text: "ФИО", value: "driver" },
        { text: "Смена", value: "smena" },
        { text: "Фактический расход", value: "fact_result" },
        { text: "Нормированный расход", value: "norm_result" },
        { text: "+Э/-П", value: "saving_result" },
        { text: "ДТ на начало работы", value: "dtStart" },
        { text: "ДТ на конец работы", value: "dtEnd" },
      ],
      loading: false,
      dates: [],
      loko: [],
      loko_res: [],
      loko_razbor: [],
      styleObjectRed: {
        color: "red",
        fontSize: "12px",
      },
      styleObjectGreen: {
        color: "green",
        fontSize: "12px",
      },
    };
  },
  components: {
    Routesheet     
  },
  methods: {
    async routesheetDriver(driver, id){
      this.$store.state.arrDataRouteSheet = []
      this.$store.state.reportID = id
      this.$store.state.driver = driver
      const clonedRoutesheet = this.loko.map(a => ({...a}));
      this.$store.state.arrDataRouteSheet = clonedRoutesheet
    },
    getColor(saving) {
      if (saving < 0) return "red";
      else return "green";
    },
    dateFormat(item, d) {
      let b = 1;
      item = this.timeConverter(item, true);
      return item;
    },
    timeConverter(UNIX_timestamp, d, b) {
      var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");
      if (b == 1) {
        var a = new Date((UNIX_timestamp - 25200) * 1000);
        //console.log(a);
        return a;
      } else {
        if (d == true) {
          var time = dt.toLocaleString();
        } else {
          var time = dt.toLocaleString(DateTime.DATETIME_SHORT);
        }
        return time;
      }
    },
    razbor(loko) {
      this.loko_razbor = [];
      const clonedLoko = this.loko.map(a => ({...a}));
      //console.log(this.loko)
      for (var i = 0; i < clonedLoko.length; i++) {
        if (clonedLoko[i]["lokoNumber"] == loko) {
          this.loko_razbor.push(clonedLoko[i]);
        }
      }
      for (var i = 0; i < this.loko_razbor.length; i++) {
        this.loko_razbor[i]["date"] = this.dateFormat(this.loko_razbor[i]["date"]);
      }
      this.loko_razbor.sort((a, b) => (a.date > b.date ? 1 : -1));
      //console.log(this.loko_razbor)
    },
    async shape() {
      this.loading = true;
      this.loko_res = [];
      this.loko = [];
      this.dates.sort();
      let dateStart = Math.round(new Date(this.dates[0]).getTime() / 1000.0);
      let dateEnd = Math.round(new Date(this.dates[1]).getTime() / 1000.0);
      let data = {
        dateStart: dateStart,
        dateEnd: dateEnd,
      };
      //console.log(data)
      if (this.loko.length == 0) {
        this.loko = await this.$http
          .post(`${this.$store.getters.getServerUrl}/report/`, data)
          .then((response) => response.data);
      }      
      this.sbor(this.loko_res);
      this.loading = false;
    },
    sbor(loko) {
      console.log(this.loko);
      const clonedReport = this.loko.map((a) => ({ ...a }));
      if (loko.length == 0) {
        for (var i = 0; i < clonedReport.length; i++) {
          var flag = false;
          if (loko.length == 0) {
            loko.push(clonedReport[i]);
          } else {
            for (var j = 0; j < loko.length; j++) {
              if (clonedReport[i]["lokoNumber"] == loko[j]["lokoNumber"]) {
                loko[j]["norm_trail"] =
                  Number(loko[j]["norm_trail"]) +
                  Number(clonedReport[i]["norm_trail"]);
                loko[j]["norm_trail"] = Math.round(loko[j]["norm_trail"]);
                loko[j]["fact_trail"] += clonedReport[i]["fact_trail"];
                loko[j]["saving_trail"] =
                  Number(loko[j]["saving_trail"]) +
                  Number(clonedReport[i]["saving_trail"]);
                loko[j]["saving_trail"] = Math.round(loko[j]["saving_trail"]);
                loko[j]["norm_manevr"] =
                  Number(loko[j]["norm_manevr"]) +
                  Number(clonedReport[i]["norm_manevr"]);
                loko[j]["norm_manevr"] = Math.round(loko[j]["norm_manevr"]);
                loko[j]["fact_manevr"] += clonedReport[i]["fact_manevr"];
                loko[j]["saving_manevr"] =
                  Number(loko[j]["saving_manevr"]) +
                  Number(clonedReport[i]["saving_manevr"]);
                loko[j]["saving_manevr"] = Math.round(loko[j]["saving_manevr"]);
                loko[j]["norm_result"] =
                  Number(loko[j]["norm_result"]) +
                  Number(clonedReport[i]["norm_result"]);
                loko[j]["norm_result"] = Math.round(loko[j]["norm_result"]);
                loko[j]["fact_result"] += clonedReport[i]["fact_result"];
                loko[j]["saving_result"] =
                  Number(loko[j]["saving_result"]) +
                  Number(clonedReport[i]["saving_result"]);
                loko[j]["saving_result"] = Math.round(loko[j]["saving_result"]);
                flag = true;
              }
            }
            if (flag == false) {
              loko.push(clonedReport[i]);
            }
          }
        }
      }
    },
  },
};
</script>
<style scoped>
</style>