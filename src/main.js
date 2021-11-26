import Vue from 'vue'
import App from './App.vue'
import router from './router'
import LoadScript from 'vue-plugin-load-script'
import vuetify from './plugins/vuetify';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU'
import store from "./store"
import Axios from 'axios'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vuelidate from 'vuelidate'
import DatetimePicker from 'vuetify-datetime-picker'
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = "Bearer " + token
}




Vue.config.productionTip = false

Vue.use(ElementUI, { locale } );
Vue.use(Vuelidate)
Vue.use(DatetimePicker)

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
