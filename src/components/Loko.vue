<template>
  <div> 
    <div class="container">
      <div class="loko">
        <h4>Локомотивы:</h4>
      </div>
      <form>      
      </form>
      <div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Добавить локомотив
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
                  <v-col cols="12"  md="6">
                    <v-select 
                      :items="listLoko" 
                      item-text="section"
                      v-model="editedItem.section"
                      label="Тип локомотива">
                    </v-select>	                                      
                  </v-col>
                  <v-col  cols="12"  md="6">
                    <v-text-field
                      v-model="editedItem.name"
                      label="№ локомотива"
                      @blur="$v.editedItem.name.$touch()">
                    </v-text-field>                    
                    <v-text-field
                      v-model="editedItem.id"
                      label="id" 
                      style="display: none;"                                         
                    >
                    </v-text-field>
                  </v-col>
                  <v-row>                   
                    <v-alert dense outlined type="error" v-if="$v.editedItem.section.$invalid">
                      Выберите тип секции
                    </v-alert>                   
                  </v-row>                            
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
        <div v-if="listLoko.length != 0">
          <v-data-table
            :headers="headers"
            :items="listLoko"
            item-key="name"
            sort-by="name"
            group-by="section"
            class="elevation-1"
            show-group-by
          >
            <template v-slot:item.actions="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </div>
        <div v-else>Данных нет</div>
      </div>
    </div>
  </div>
</template>
<script>
import { required, maxLength } from 'vuelidate/lib/validators';

export default {  
  data() {
    return {
      listLoko: [],      
      dialog: false,
      name:'',
      element:'element',
      region:[],
      section:'',
      message:'',      
      id:'',      
      passportData:'',           
      headers: [
        {
          text: "№ локомотива",
          align: "start",
          sortable: true,
          value: "name",
          groupable: false,
        },
        { text: "Тип локомотива", value: "section", groupable: true },
        { text: "Регион", value: "region", groupable: false },
        {
          text: "Actions",
          value: "actions",
          sortable: false,
          groupable: false,
        },
        { text: "Активен", value: "active", groupable: false},
        { text: "ID", value: "id", groupable: false, align: ' d-none'},
      ],
      editedIndex: -1,
      editedItem: {        
        name: '',
        section: '',
        id: null,        
      },
      defaultItem: {        
        name: '',
        section: '',
        id: null,        
      },
    };
  },
  validations: {
    // Название поля должно совпадать с полем в data
      editedItem: {
        name:{required},
        section:{required},          
    },    
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Добавить локомотив"
        : "Изменить локомотив";
    },      
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
  components: {},
  async mounted() {
    await this.loadListLoko();      
  },
  methods: {
    async loadListLoko() {
      this.listLoko = await this.$http
        .get(`${this.$store.getters.getServerUrl}/loko`)
        .then((response) => response.data);
        
    },
    close() {      
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.message='';
      });
    },
    async save() {     
     let data = {
        name: this.editedItem.name,                
        element_type: this.element,        
        section: this.editedItem.section,
        id: this.editedItem.id        
      }       
      this.message=await this.$http
        .post(`${this.$store.getters.getServerUrl}/loko/`, data)                
        .then((response) => response.data);        
        this.loadListLoko()      
      setTimeout(() => this.message='', 5000); 
             
    },
    editItem(item) {     
      this.editedIndex = this.listLoko.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;      
    },    
  },
  
};
</script>