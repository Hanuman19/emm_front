<template>
  <div>   
    <div class="container">
      <div class="loko">
        <h4>Список машинистов:</h4>
      </div>
      <div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Добавить машиниста
            </v-btn>
          </template>
          <v-alert type="success" v-if="message == 'true'">
            Данные внесены успешно
          </v-alert>
          <v-alert type="error" v-else-if="message == 'false'">
            Произошла ошибка
          </v-alert>
           <v-alert type="error" v-else-if="message != ''">
            {{message}}
          </v-alert> 
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.name"
                      label="ФИО машиниста"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">                    
                    <v-select 
                      :items="listArea" 
                      item-text="name"
                      item-value ="id"
                      v-model="editedItem.area"
                      label="Участок">
                    </v-select>
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
          :headers="headers"
          :items="listDriver"
          item-key="name"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listArea:[],
      listDriver: [],
      message:'',
      dialog: false,
      headers: [
        {
          text: "ФИО Машинистов",
          align: "start",
          sortable: true,
          value: "name",
        },
        {text: "Табельный номер", value: "tabel" },
        { text: "Регион", value: "region" },
        { text: "Участок", value: "area" }, 
        { text: "Активен", value: "active" },
        { text: "Action", value: "actions", sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        name: "",
        area:'',
        id: null
      },
      defaultItem: {
        name: "",
        area: '',
        id: null
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Добавить машиниста"
        : "Изменить машиниста";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  components: {},
  async mounted() {
    await this.loadListDriver();
    await this.loadListArea();
  },
  methods: {
    async loadListDriver() {
      this.listDriver = await this.$http
        .get(`${this.$store.getters.getServerUrl}/driver`)
        .then((response) => response.data);
    },
    async loadListArea() {
      this.listArea = await this.$http
        .get(`${this.$store.getters.getServerUrl}/area/`)
        .then((response) => response.data);        
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    async save() {
      let data = {
        name: this.editedItem.name,
        area: this.editedItem.area,
        id: this.editedItem.id
      }     
      this.message = await this.$http
        .post(`${this.$store.getters.getServerUrl}/driver/`, data)
        .then((response) => response.data);
      await this.loadListDriver()
      setTimeout(() => this.message='', 5000);
    },
    editItem(item) {
      for (var i=0; i<this.listArea.length; i++){
        if(this.listArea[i]['name'] == item['area']){          
          item['area']=this.listArea[i]['id']          
        }       
      }
      this.editedIndex = this.listDriver.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
  },
};
</script>