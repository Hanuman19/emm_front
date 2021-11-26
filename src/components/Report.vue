<template>
<div>       
    <section>
        <div class="container bord">
                <div class="row justify-content-between">                
                    <div class="col-12 report">
                        <v-row>
                            <div class="col-12 col-md-3 col-lg-2 bord-right">
                                <template>                        
                                    <v-card elevation="12" class="report-card">
                                        <v-navigation-drawer floating permanent>
                                            <v-list dense rounded>
                                                <div v-for = "item in menu" :key="item.id">
                                                    <div v-if="item.element_type == 'left_menu'">
                                                        <v-list-item link @change="onChange(item.id)">                                     
                                                            <v-list-item-content>
                                                                {{item.name}}                 
                                                            </v-list-item-content>                                                                        
                                                        </v-list-item>
                                                    </div>
                                                </div>                                                
                                            </v-list>
                                        </v-navigation-drawer>                                
                                    </v-card>                             
                                </template>                    
                            </div>
                            <div class="col-12 col-md-9 col-lg-10">
                                <v-container fluid>
                                     <div v-for = "item in menu" :key="item.id">
                                        <div v-if="item.element_type == 'left_menu'">
                                            <div v-if="id == item.id">
                                                <component v-bind:is="item.link"></component>
                                            </div>                                          
                                        </div>
                                     </div>                           
                                </v-container>
                            </div>
                        </v-row>                    
                    </div>
                </div>
        </div>
    </section>
</div>
</template>
<script>
import Journal from './Journal.vue';
import Driver from './ReportDriver.vue';
import Loko from './ReportLoko.vue';
import AvailabilitySheet from './AvailabilitySheet.vue';
import Area from './ReportArea.vue';
import Routesheet from './Routesheet.vue';
import TimeWork from './TimeWork.vue';


export default {
    components: {
      Driver,
      AvailabilitySheet,
      Loko,
      Area,
      Routesheet,
      TimeWork,
      Journal
    },
    data(){
        return{
            id:1,
            menu: this.$store.getters.getMenu,
        }
    },
    methods:{
        onChange:function(val){
            this.id=val;
        },        
    }
    
}
</script>
