<template>
  <div class="areaReport">
    <div class="loko">
      <h4>Отчет по участкам</h4>
    </div>
    <v-row>
      <v-col cols="12" sm="6" md="4">
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
      <v-col cols="12" md="4">
        <v-select
          v-model="lokoTypeValue"
          :items="lokoType"
          item-value="id"
          item-text="name"
          label="Тип локомотива"
          clearable
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="areaValue"
          :items="area"
          item-value="id"
          item-text="name"
          label="Участок"
          clearable
          @change="onChangeSelected"
        ></v-select>
      </v-col>
    </v-row>
    <v-radio-group row v-model="radioWork">
      <v-radio label="Вывозная работа" value="1"></v-radio>
      <v-radio label="Маневровая работа" value="2"></v-radio>
    </v-radio-group>

    <v-row v-if="radioWork == 1">
      <v-col cols="12" md="4">
        <v-select
          :items="station"
          item-text="name"
          label="Станция отправления"
          item-value="id"
          v-model="stationDep"
        >
          ></v-select
        >
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          :items="station"
          item-text="name"
          label="Станция прибытия"
          item-value="id"
          v-model="stationArr"
        ></v-select>
      </v-col>
    </v-row>
    <v-row v-if="radioWork == 2">
      <v-col cols="12" md="4">
        <v-select
          :items="station"
          item-text="name"
          label="Станция прибытия"
          item-value="id"
          v-model="stationManevr"
        ></v-select>
      </v-col>
    </v-row>

    <v-row>
      <v-btn class="ma-2" outlined color="indigo" @click="shape">
        Сформировать
      </v-btn>
      <v-btn class="ma-2" outlined color="indigo" @click="shapeALL">
        Все участки
      </v-btn>
    </v-row>
    <div class="text-center" v-if="loading == true">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <div v-if="message != ''">
      <v-row>
        <v-col cols="12">
          <v-alert type="error">
            {{ message }}
          </v-alert>
        </v-col>
      </v-row>
    </div>
    <div
      v-if="
        report_res != 0 && typeLoko_tab == 0 && message == '' && radioWork == 1
      "
    >
      <v-data-table :headers="headers" :items="report_res" class="elevation-1">
        <template v-slot:item.saving="{ item }">
          <v-chip :color="getColor(item.saving)" dark>
            {{ item.saving }}
          </v-chip>
        </template>
      </v-data-table>
      <div
        class="loko"
        v-if="
          report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 1
        "
      >
        <h4>Подробно:</h4>
      </div>
      <v-data-table
        :headers="headersTrailAll"
        :items="report"
        class="elevation-1"
      >
        <template v-slot:item.driver="{ item }">
          <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                  ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  {{ item.driver }}
                </v-toolbar>
                <v-card-text>
                  <v-row class="report-table">
                    <Routesheet />
                  </v-row>
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </template>
        <template v-slot:item.saving="{ item }">
          <v-chip :color="getColor(item.saving)" dark>
            {{ item.saving }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <div v-if="radioWork == 1 && typeLoko_tab != 0 && message == ''">
      <div id="data-v" class="col-12">
        <v-card>
          <v-toolbar color="#1583e9" dark flat>
            <template>
              <v-tabs v-model="tab" align-with-title>
                <v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab v-for="item in typeLoko_tab" :key="item.index">{{
                  item
                }}</v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
        </v-card>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="val in typeLoko_tab" :key="val.index">
            <v-col cols="12">
              <v-data-table
                :headers="headers"
                :items="rep(val)"
                class="elevation-1"
              >
                <template v-slot:item.saving="{ item }">
                  <v-chip :color="getColor(item.saving)" dark>
                    {{ item.saving }}
                  </v-chip>
                </template>
                <template v-slot:item.id="{ item }">
                  <v-btn text color="indigo" @click="razborTrail(val, item.id)">
                    {{ item.id }}
                  </v-btn>
                </template>
              </v-data-table>
            </v-col>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <div
      v-if="
        radioWork == 2 &&
        message == '' &&
        typeLoko_tab == 0 &&
        report_res_manevr != 0
      "
    >
      <div class="loko">
        <h4>Маневровая работа:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, false, false, false, false, false, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="
            repOneManevr(report, false, false, false, false, false, false)
          "
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div class="loko">
        <h4>Простой:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, true, false, false, false, false, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="repOneManevr(report, true, false)"
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div class="loko">
        <h4>Холодный простой:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, false, true, false, false, false, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="repOneManevr(report, false, true, false, false, false, false)"
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div class="loko">
        <h4>Обработка состава:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, false, false, true, false, false, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="repOneManevr(report, false, false, true, false, false, false)"
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div class="loko">
        <h4>Прожиг:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, false, false, false, true, false, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="repOneManevr(report, false, false, false, true, false, false)"
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div class="loko">
        <h4>Обдув вагонов:</h4>
      </div>
      <div class="loko">
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevr"
          hide-default-footer
          :items="repOneManevr(report, false, false, false, false, true, true)"
          class="elevation-1"
        >
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
      <div>
        <v-data-table
          v-if="
            report != 0 && typeLoko_tab == 0 && message == '' && radioWork == 2
          "
          :headers="headersManevrAll"
          :items="repOneManevr(report, false, false, false, false, true, false)"
          class="elevation-1"
        >
          <template v-slot:item.driver="{ item }">
            <v-dialog transition="dialog-bottom-transition" max-width="1400">
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
                    ><v-btn text @click="dialog.value = false">Закрыть</v-btn>
                    {{ item.driver }}
                  </v-toolbar>
                  <v-card-text>
                    <v-row class="report-table">
                      <Routesheet />
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn text @click="dialog.value = false">Закрыть</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
          <template v-slot:item.saving_manevr="{ item }">
            <v-chip :color="getColor(item.saving_manevr)" dark>
              {{ item.saving_manevr }}
            </v-chip>
          </template>
        </v-data-table>
      </div>
    </div>
    <div
      v-if="
        radioWork == 2 &&
        message == '' &&
        typeLoko_tab != 0 &&
        report_res_manevr != 0
      "
    >
      <div id="data-v" class="col-12">
        <v-card>
          <v-toolbar color="#1583e9" dark flat>
            <template>
              <v-tabs v-model="tab" align-with-title>
                <v-tabs-slider color="yellow"></v-tabs-slider>
                <v-tab v-for="item in typeLoko_tab" :key="item.index">{{
                  item
                }}</v-tab>
              </v-tabs>
            </template>
          </v-toolbar>
        </v-card>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="val in typeLoko_tab" :key="val.index">
            <v-row>
              <v-col cols="12">
                <div class="loko">
                  <h4>Маневровая работа:</h4>
                </div>
                <v-data-table
                  :headers="headersManevr"
                  :items="repManevr(val, false)"
                  class="elevation-1"
                >
                  <template v-slot:item.saving_manevr="{ item }">
                    <v-chip :color="getColor(item.saving_manevr)" dark>
                      {{ item.saving_manevr }}
                    </v-chip>
                  </template>
                  <template v-slot:item.station="{ item }">
                    <v-btn
                      text
                      color="indigo"
                      @click="razbor(val, item.station)"
                    >
                      {{ item.station }}
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <div class="loko">
                  <h4>Простой:</h4>
                </div>
                <v-data-table
                  :headers="headersManevr"
                  :items="repManevr(val, true)"
                  class="elevation-1"
                >
                  <template v-slot:item.saving_manevr="{ item }">
                    <v-chip :color="getColor(item.saving_manevr)" dark>
                      {{ item.saving_manevr }}
                    </v-chip>
                  </template>
                  <template v-slot:item.station="{ item }">
                    <v-btn
                      text
                      color="indigo"
                      @click="razbor(val, item.station)"
                    >
                      {{ item.station }}
                    </v-btn>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
  </div>
</template>
<script>
import Routesheet from '../components/Sheet/TDRoutesheet.vue';
import { DateTime, Duration, Info, Interval, Settings } from "luxon";
export default {
  data() {
    return {
      loading: false,
      dates: [],
      tab: null,
      radioWork: "",
      lokoTypeValue: null,
      lokoType: [],
      typeLoko_tab: [],
      areaValue: null,
      area: [],
      stationDep: null,
      stationArr: null,
      stationManevr: null,
      station: [],
      stationOld: [],
      message: "",
      report: [],
      report_res: [],
      report_res_manevr: [],
      headers: [
        { text: "Подробно", value: "id" },
        { text: "Станция отправления", value: "stationDep" },
        { text: "Станция прибытия", value: "stationArr" },
        { text: "Время работы", value: "work_time" },
        { text: "Груженные вагоны", value: "gp" },
        { text: "Парожные вагоны", value: "pv" },
        { text: "Факт", value: "fact" },
        { text: "Норма", value: "norm" },
        { text: "+Э/-П", value: "saving" },
      ],
      headersTrailAll: [
        { text: "Дата", align: "start", value: "dateStart" },
        { text: "Станция отправления", value: "stationDep" },
        { text: "Станция прибытия", value: "stationArr" },
        { text: "Машинист", value: "driver" },
        { text: "№ Локомотива", value: "lokoNumber" },
        { text: "Время работы", value: "work_time" },
        { text: "Груженные вагоны", value: "gp" },
        { text: "Парожные вагоны", value: "pv" },
        { text: "Факт", value: "fact" },
        { text: "Норма", value: "norm" },
        { text: "+Э/-П", value: "saving" },
      ],
      headersManevrAll: [
        { text: "Дата", align: "start", value: "dateStart" },
        { text: "Станция", value: "station" },
        { text: "Машинист", value: "driver" },
        { text: "№ Локомотива", value: "lokoNumber" },
        { text: "Время работы", value: "work_time_manevr" },
        { text: "Груженные вагоны", value: "gp" },
        { text: "Парожные вагоны", value: "pv" },
        { text: "Факт", value: "fact_manevr" },
        { text: "Норма", value: "norm_manevr" },
        { text: "+Э/-П", value: "saving_manevr" },
      ],
      headersManevr: [
        {
          text: "Станция",
          align: "start",
          sortable: false,
          value: "station",
        },
        { text: "Время работы", value: "work_time_manevr" },
        { text: "Груженные вагоны", value: "gp" },
        { text: "Парожные вагоны", value: "pv" },
        { text: "Факт", value: "fact_manevr" },
        { text: "Норма", value: "norm_manevr" },
        { text: "+Э/-П", value: "saving_manevr" },
      ],
    };
  },
  components: {
    Routesheet     
  },
  async mounted() {
    await this.loadTypeLoko();
    await this.loadArea();
  },
  methods: {
    
    async routesheetDriver(driver, id){      
      this.$store.state.arrDataRouteSheet = []
      this.$store.state.reportID = id
      this.$store.state.driver = driver
     
      const clonedRoutesheet = this.report.map(a => ({...a}));
      for (var i=0; clonedRoutesheet.length > i; i++){
        //clonedRoutesheet[i]['dateStart'] = clonedRoutesheet[i]['dateStart'].startOf('day')
        var parts = clonedRoutesheet[i]['dateStart'].split(',')[0];
        parts = parts.split('.');
        var mydate = Math.round(new Date(parts[2], parts[1]-1, parts[0]).getTime() / 1000.0) + 7*3600
        if(clonedRoutesheet[i]['smena'] == 2){
          clonedRoutesheet[i]['date']=mydate-86400
        }else{
          clonedRoutesheet[i]['date']=mydate
        }
        
        //console.log(new Date(parts[2], parts[1]-1, parts[0]));
      }
      this.$store.state.arrDataRouteSheet = clonedRoutesheet
      
    },
    razborTrail(lokoType, id) {
      if (lokoType != "ВСЕ") {
        for (var i = 0; i < this.lokoType.length; i++) {
          if (this.lokoType[i]["name"] == lokoType) {
            this.lokoTypeValue = this.lokoType[i]["id"];
          }
        }
        for (var i = 0; i < this.report_res.length; i++) {
          if (this.report_res[i]["id"] == id) {
            for (var j = 0; j < this.station.length; j++) {
              if (this.station[j]["name"] == this.report_res[i]["stationDep"]) {
                this.stationDep = this.station[j]["id"];
              } else if (
                this.station[j]["name"] == this.report_res[i]["stationArr"]
              ) {
                this.stationArr = this.station[j]["id"];
              }
            }
          }
        }
        this.shape();
      }
    },
    razbor(lokoType, station) {
      if (lokoType != "ВСЕ") {
        for (var i = 0; i < this.lokoType.length; i++) {
          if (this.lokoType[i]["name"] == lokoType) {
            this.lokoTypeValue = this.lokoType[i]["id"];
          }
        }
        for (var i = 0; i < this.station.length; i++) {
          if (this.station[i]["name"] == station) {
            this.stationManevr = this.station[i]["id"];
          }
        }
        try {
          this.shape();
        } catch {
          this.message = "Что то пошло не так";
        }
      }
    },
    dateFormat(item) {
      for (var i = 0; i < item.length; i++) {
        item[i]["dateStart"] = this.timeConverter(item[i]["dateStart"]);
        item[i]["dateEnd"] = this.timeConverter(item[i]["dateEnd"]);
      }
      return item;
    },
    timeConverter(UNIX_timestamp, d) {
      var dt = DateTime.fromSeconds(UNIX_timestamp).setZone("utc");
      if (d == true) {
        var time = dt.toLocaleString();
      } else {
        var time = dt.toLocaleString(DateTime.DATETIME_SHORT);
      }
      return time;
    },
    resultTrailNoTabs(report, report_res, param) {
      var flag = false;
      for (var i = 0; i < report.length; i++) {
        flag = false;
        if (report_res.length == 0) {
          report_res.push(report[i]);
        } else {
          for (var j = 0; j < report_res.length; j++) {
            if (report[i][param] == report_res[j][param]) {
              report_res[j]["fact"] += report[i]["fact"];
              report_res[j]["gp"] += report[i]["gp"];
              report_res[j]["pv"] += report[i]["pv"];
              report_res[j]["norm"] =
                Number(report_res[j]["norm"]) + Number(report[i]["norm"]);
              report_res[j]["saving"] =
                Number(report_res[j]["saving"]) + Number(report[i]["saving"]);
              report_res[j]["work_time"] =
                report_res[j]["work_time"] + report[i]["work_time"];
              report_res[j]["norm"] = Math.round(report_res[j]["norm"]);
              report_res[j]["saving"] = Math.round(report_res[j]["saving"]);
              flag = true;
            }
          }
          if (flag == false) {
            report_res.push(report[i]);
          }
        }
      }
      //console.log('report: ', report_res)
      return report_res;
    },
    resultTrail(report, report_res, param) {
      var flag = false;
      if (report_res.length == 0) {
        for (var i = 0; i < report.length; i++) {
          flag = false;
          if (report_res.length == 0) {
            report_res.push(report[i]);
            this.typeLoko_tab.push(report[i]["type_loko"]);
          } else {
            for (var j = 0; j < report_res.length; j++) {
              if (report[i][param] == report_res[j][param]) {
                if (
                  report[i]["stationArr"] == report_res[j]["stationArr"] &&
                  report[i]["stationDep"] == report_res[j]["stationDep"]
                ) {
                  report_res[j]["fact"] += report[i]["fact"];
                  report_res[j]["gp"] += report[i]["gp"];
                  report_res[j]["pv"] += report[i]["pv"];
                  report_res[j]["norm"] =
                    Number(report_res[j]["norm"]) + Number(report[i]["norm"]);
                  report_res[j]["saving"] =
                    Number(report_res[j]["saving"]) +
                    Number(report[i]["saving"]);
                  report_res[j]["work_time"] =
                    report_res[j]["work_time"] + report[i]["work_time"];
                  report_res[j]["norm"] = Math.round(report_res[j]["norm"]);
                  report_res[j]["saving"] = Math.round(report_res[j]["saving"]);
                  flag = true;
                }
              }
            }
            if (flag == false) {
              report_res.push(report[i]);
              this.typeLoko_tab.push(report[i]["type_loko"]);
            }
          }
        }
        this.typeLoko_tab = Array.from(new Set(this.typeLoko_tab));
        this.typeLoko_tab.push("ВСЕ");
      }
    },
    getColor(saving) {
      if (saving < 0) return "red";
      else return "green";
    },
    repOneManevr(val, bool, xx, obrabotka, burning, ov, podrob) {
      let result = val.filter(function (item) {
        if (bool == true) {
          if (item["prostoy"] == bool) {
            return item;
          }
        } else if (burning == true) {
          if (item["burning"] == burning) {
            return item;
          }
        } else if (ov == true) {
          if (item["obduv"] == ov) {
            return item;
          }
        } else {
          if (
            item["prostoy"] === false &&
            item["obrabotka"] === obrabotka &&
            item["xx"] === xx
          ) {
            return item;
          }
        }
      });

      var positiveArr = [];
      const clonedReport = result.map((a) => ({ ...a }));
      for (var i = 0; i < clonedReport.length; i++) {
        if (positiveArr.length == 0) {
          positiveArr.push(clonedReport[i]);
        } else {
          for (var j = 0; j < positiveArr.length; j++) {
            positiveArr[j]["fact_manevr"] += clonedReport[i]["fact_manevr"];
            positiveArr[j]["gp"] += clonedReport[i]["gp"];
            positiveArr[j]["pv"] += clonedReport[i]["pv"];
            positiveArr[j]["norm_manevr"] =
              Number(positiveArr[j]["norm_manevr"]) +
              Number(clonedReport[i]["norm_manevr"]);
            positiveArr[j]["saving_manevr"] =
              Number(positiveArr[j]["saving_manevr"]) +
              Number(clonedReport[i]["saving_manevr"]);
            positiveArr[j]["work_time_manevr"] +=
              clonedReport[i]["work_time_manevr"];
            positiveArr[j]["norm_manevr"] =
              Math.round(positiveArr[j]["norm_manevr"] * 10) / 10;
            positiveArr[j]["saving_manevr"] =
              Math.round(positiveArr[j]["saving_manevr"] * 10) / 10;
          }
        }
      }
      if (podrob == true) {
        return positiveArr;
      } else {
        return result;
      }
    },
    repManevr(val, bool) {
      if (val == "ВСЕ") {
        //console.log('1')
        var flag = false;
        var positiveArr = [];
        const clonedReport = this.report_res_manevr.map((a) => ({ ...a }));
        //console.log(clonedReport)
        for (var i = 0; i < clonedReport.length; i++) {
          //   console.log(positiveArr)
          flag = false;
          if (positiveArr.length == 0) {
            positiveArr.push(clonedReport[i]);
          } else {
            for (var j = 0; j < positiveArr.length; j++) {
              if (
                clonedReport[i]["station"] == positiveArr[j]["station"] &&
                clonedReport[i]["prostoy"] == positiveArr[j]["prostoy"]
              ) {
                //console.log('test: ',i)
                positiveArr[j]["fact_manevr"] += clonedReport[i]["fact_manevr"];
                positiveArr[j]["gp"] += clonedReport[i]["gp"];
                positiveArr[j]["pv"] += clonedReport[i]["pv"];
                positiveArr[j]["norm_manevr"] =
                  Number(positiveArr[j]["norm_manevr"]) +
                  Number(clonedReport[i]["norm_manevr"]);
                positiveArr[j]["saving_manevr"] =
                  Number(positiveArr[j]["saving_manevr"]) +
                  Number(clonedReport[i]["saving_manevr"]);
                positiveArr[j]["work_time_manevr"] +=
                  clonedReport[i]["work_time_manevr"];
                positiveArr[j]["norm_manevr"] =
                  Math.round(positiveArr[j]["norm_manevr"] * 10) / 10;
                positiveArr[j]["saving_manevr"] =
                  Math.round(positiveArr[j]["saving_manevr"] * 10) / 10;
                flag = true;
              }
            }
            if (flag == false) {
              positiveArr.push(clonedReport[i]);
            }
          }
        }
        positiveArr = positiveArr.filter(function (item) {
          if (item["prostoy"] === bool) {
            return item;
          }
        });
      } else {
        var positiveArr = this.report_res_manevr.filter(function (item) {
          if (item["type_loko"] == val && item["prostoy"] == bool) {
            return item;
          }
        });
      }
      return positiveArr;
    },
    rep(val) {
      //console.log(val)
      if (val == "ВСЕ") {
        var flag = false;
        var positiveArr = [];
        const clonedReport = this.report_res.map((a) => ({ ...a }));
        //console.log(clonedReport)
        for (var i = 0; i < clonedReport.length; i++) {
          flag = false;
          if (positiveArr.length == 0) {
            positiveArr.push(clonedReport[i]);
          } else {
            for (var j = 0; j < positiveArr.length; j++) {
              if (
                clonedReport[i]["stationArr"] == positiveArr[j]["stationArr"] &&
                clonedReport[i]["stationDep"] == positiveArr[j]["stationDep"]
              ) {
                positiveArr[j]["fact"] += clonedReport[i]["fact"];
                positiveArr[j]["gp"] += clonedReport[i]["gp"];
                positiveArr[j]["pv"] += clonedReport[i]["pv"];
                positiveArr[j]["norm"] =
                  Number(positiveArr[j]["norm"]) +
                  Number(clonedReport[i]["norm"]);
                positiveArr[j]["saving"] =
                  Number(positiveArr[j]["saving"]) +
                  Number(clonedReport[i]["saving"]);
                positiveArr[j]["work_time"] += clonedReport[i]["work_time"];
                positiveArr[j]["norm"] =
                  Math.round(positiveArr[j]["norm"] * 10) / 10;
                positiveArr[j]["saving"] =
                  Math.round(positiveArr[j]["saving"] * 10) / 10;
                flag = true;
              }
            }
            if (flag == false) {
              positiveArr.push(clonedReport[i]);
            }
          }
        }
        //console.log('Positive_1: ', positiveArr)
        return positiveArr;
      }
      var positiveArr = this.report_res.filter(function (item) {
        if (item["type_loko"] == val) {
          return item;
        }
      });
      //console.log('Positive: ', positiveArr)
      //console.log(this.report_res)
      return positiveArr;
    },
    async loadArea() {
      this.area = await this.$http
        .get(`${this.$store.getters.getServerUrl}/area`)
        .then((response) => response.data);
    },
    async loadTypeLoko() {
      this.lokoType = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko/select`)
        .then((response) => response.data);
      this.stationOld = await this.$http
        .get(`${this.$store.getters.getServerUrl}/station`)
        .then((response) => response.data);
      this.station = this.stationOld;
    },
    async shapeALL() {
      this.loading = true;
      this.typeLoko_tab = [];
      this.report = [];
      this.report_res_manevr = [];
      this.report_res = [];
      this.message = "";
      this.dates.sort();
      let flag = false;
      let dateStart = Math.round(new Date(this.dates[0]).getTime() / 1000.0);
      let dateEnd =
        Math.round(new Date(this.dates[1]).getTime() / 1000.0) + 86400;
      let data = {};
      if (this.radioWork == 1) {
        data = {
          dateStart: dateStart,
          dateEnd: dateEnd,
          area: this.areaValue,
          text: "Vyvoz",
        };
      } else if (this.radioWork == 2) {
        data = {
          dateStart: dateStart,
          dateEnd: dateEnd,
          area: this.areaValue,
          text: "Manevr",
        };
      } else {
        this.message = "Что то пошло не так";
      }
      if (this.dates == 0) {
        this.message = "Выберите период";
      } else if (dateStart > dateEnd) {
        this.message = "Не правильно задан период";
      } else if (this.radioWork == "") {
        this.message = "Выберите тип работы";
      } else if (this.areaValue == null) {
        this.message = "Выберите участок работ";
      } else {
        this.report = await this.$http
          .post(`${this.$store.getters.getServerUrl}/report/area/`, data)
          .then((response) => response.data);
      }
      if (this.radioWork == 1) {
        const clonedReport = this.report.map((a) => ({ ...a }));
        //console.log(clonedReport)
        this.resultTrail(clonedReport, this.report_res, "type_loko");
        //console.log(this.report_res)
      } else {
        const clonedReport = this.report.map((a) => ({ ...a }));
        if (clonedReport[0] == false) {
          this.message = clonedReport[1];
        } else if (this.report_res_manevr.length == 0) {
          //Формируем маневровую работу и простой
          for (var i = 0; i < clonedReport.length; i++) {
            flag = false;
            if (this.report_res_manevr == 0) {
              this.report_res_manevr.push(clonedReport[i]);
              this.typeLoko_tab.push(clonedReport[i]["type_loko"]);
            } else {
              for (var j = 0; j < this.report_res_manevr.length; j++) {
                if (
                  clonedReport[i]["type_loko"] ==
                  this.report_res_manevr[j]["type_loko"]
                ) {
                  if (
                    clonedReport[i]["prostoy"] ==
                    this.report_res_manevr[j]["prostoy"]
                  ) {
                    if (
                      clonedReport[i]["station"] ==
                      this.report_res_manevr[j]["station"]
                    ) {
                      this.report_res_manevr[j]["fact_manevr"] =
                        this.report_res_manevr[j]["fact_manevr"] +
                        clonedReport[i]["fact_manevr"];
                      this.report_res_manevr[j]["norm_manevr"] =
                        Number(this.report_res_manevr[j]["norm_manevr"]) +
                        Number(clonedReport[i]["norm_manevr"]);
                      this.report_res_manevr[j]["saving_manevr"] =
                        Number(this.report_res_manevr[j]["saving_manevr"]) +
                        Number(clonedReport[i]["saving_manevr"]);
                      this.report_res_manevr[j]["work_time_manevr"] =
                        this.report_res_manevr[j]["work_time_manevr"] +
                        clonedReport[i]["work_time_manevr"];
                      this.report_res_manevr[j]["norm_manevr"] =
                        Math.round(
                          this.report_res_manevr[j]["norm_manevr"] * 10
                        ) / 10;
                      this.report_res_manevr[j]["saving_manevr"] =
                        Math.round(
                          this.report_res_manevr[j]["saving_manevr"] * 10
                        ) / 10;
                      flag = true;
                    }
                  }
                }
              }
              if (flag == false) {
                this.report_res_manevr.push(clonedReport[i]);
                this.typeLoko_tab.push(clonedReport[i]["type_loko"]);
              }
            }
          }
          this.typeLoko_tab = Array.from(new Set(this.typeLoko_tab));
          this.typeLoko_tab.push("ВСЕ");
          //console.log('tubs: ', this.typeLoko_tab)
        }
      }
      setTimeout(() => (this.message = ""), 5000);
      this.loading = false;
    },
    async shape() {
      this.loading = true;
      this.typeLoko_tab = [];
      this.report = [];
      this.report_res_manevr = [];
      this.report_res = [];
      this.message = "";
      this.dates.sort();
      var flag = false;
      let dateStart = Math.round(new Date(this.dates[0]).getTime() / 1000.0);
      let dateEnd =
        Math.round(new Date(this.dates[1]).getTime() / 1000.0) + 86400;
      let data = {};
      if (this.radioWork == 1) {
        data = {
          dateStart: dateStart,
          dateEnd: dateEnd,
          lokoType: this.lokoTypeValue,
          area: this.areaValue,
          stationDep: this.stationDep,
          stationArr: this.stationArr,
          text: "Vyvoz",
        };
      } else if (this.radioWork == 2) {
        data = {
          dateStart: dateStart,
          dateEnd: dateEnd,
          lokoType: this.lokoTypeValue,
          area: this.areaValue,
          station: this.stationManevr,
          text: "Manevr",
        };
        //console.log(data)
      } else {
        this.message = "Что то пошло не так";
      }
      if (dateStart > dateEnd) {
        this.message = "Не правильно задан период";
      } else if (this.radioWork == "") {
        this.message = "Выберите тип работы";
      } else if (this.lokoTypeValue == null) {
        this.message = "Выберите тип локомотива";
      } else if (this.radioWork == 1 && this.stationArr == this.stationDep) {
        this.message = "Проверьте правильное заполнение станций";
      } else if (this.radioWork == 2 && this.stationManevr == null) {
        this.message = "Выберите станцию";
      } else if (this.report == 0) {
        this.report = await this.$http
          .post(`${this.$store.getters.getServerUrl}/report/area/`, data)
          .then((response) => response.data);
      }
      this.report.sort((a, b) => (a.dateStart > b.dateStart ? 1 : -1));
      console.log(this.report);
      this.report = this.dateFormat(this.report);
      if (this.radioWork == 1) {
        //console.log(this.report)
        if (this.report[0] == false) {
          this.message = this.report[1];
        } else if (this.report_res == 0) {
          const clonedReport = this.report.map((a) => ({ ...a }));
          this.resultTrailNoTabs(clonedReport, this.report_res, "type_loko");
        }
      } else {
        const clonedReport = this.report.map((a) => ({ ...a }));
        if (clonedReport[0] == false) {
          this.message = clonedReport[1];
        } else if (this.report_res_manevr.length == 0) {
          //Формируем маневровую работу и простой
          for (var i = 0; i < clonedReport.length; i++) {
            flag = false;
            if (this.report_res_manevr == 0) {
              this.report_res_manevr.push(clonedReport[i]);
            } else {
              for (var j = 0; j < this.report_res_manevr.length; j++) {
                if (
                  clonedReport[i]["prostoy"] ==
                  this.report_res_manevr[j]["prostoy"]
                ) {
                  this.report_res_manevr[j]["fact_manevr"] +=
                    clonedReport[i]["fact_manevr"];
                  this.report_res_manevr[j]["norm_manevr"] =
                    Number(this.report_res_manevr[j]["norm_manevr"]) +
                    Number(clonedReport[i]["norm_manevr"]);
                  this.report_res_manevr[j]["saving_manevr"] =
                    Number(this.report_res_manevr[j]["saving_manevr"]) +
                    Number(clonedReport[i]["saving_manevr"]);
                  this.report_res_manevr[j]["work_time_manevr"] +=
                    clonedReport[i]["work_time_manevr"];
                  this.report_res_manevr[j]["norm_manevr"] =
                    Math.round(this.report_res_manevr[j]["norm_manevr"] * 10) /
                    10;
                  this.report_res_manevr[j]["saving_manevr"] =
                    Math.round(
                      this.report_res_manevr[j]["saving_manevr"] * 10
                    ) / 10;
                  flag = true;
                }
              }
              if (flag == false) {
                this.report_res_manevr.push(clonedReport[i]);
              }
            }
          }
        }
      }
      setTimeout(() => (this.message = ""), 5000);
      this.loading = false;
    },
    onChangeSelected: function () {
      if (this.areaValue != null) {
        let area = this.area;
        for (let i = 0; i <= area.length - 1; i++) {
          if (area[i].id == this.areaValue) {
            this.station = this.stationOld.filter(function (el) {
              if (el.section == area[i].name) {
                return el;
              }
            });
          }
        }
      }
    },
  },
};
</script>