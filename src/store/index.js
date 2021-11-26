import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        backendUrl: "http://emm.promtrans.ru:9010/api/v1",
        loginUrl: "http://emm.promtrans.ru:9010/auth/token", 
        status: '',
        token: localStorage.getItem('token') || '',
        user : {},
        menu : [],
        reportID: {},
        userStat:{},
        routesheetPermission: null,
        routesheetRes: [],
        routesheetResManevr: [],
        dataSheet: {},
        arrDataRouteSheet:[],
        driver: null,     
    },
    data:{
      user:'',
    },
    mutations: {
          auth_request(state){
            state.status = 'loading'
          },
          auth_success(state, token){
            state.status = 'success'
            state.token = token
          },
          auth_error(state){
            state.status = 'error'
          },
          logout(state){
            state.status = ''
            state.token = ''
          },
        
    },
    actions: {  
        login({commit}, user){            
            return new Promise((resolve, reject) => {
              commit('auth_request')
              axios({url: 'http://emm.promtrans.ru:9010/auth/jwt/create', data: user, method: 'POST' })
              .then(resp => {
                const token = resp.data.access               
                localStorage.setItem('token', token)
                axios.defaults.headers.common['Authorization'] = "Bearer " + token
                commit('auth_success', token)
                resolve(resp)
              })
              .catch(err => {                
                commit('auth_error')
                localStorage.removeItem('token')
                reject(err)
              })
            })
        },
        logout({commit}){
            return new Promise((resolve, reject) => {
              commit('logout')
              localStorage.removeItem('token')
              delete axios.defaults.headers.common['Authorization']
              resolve()
            })
          }
    },
    modules: {},
    getters: {
        getDriver: state => {
          return state.driver
        },
        getArrDataRouteSheet: state => {
          return state.arrDataRouteSheet
        },
        getServerUrl: state =>{
          return state.backendUrl
        },
        getDataSheet: state =>{
          return state.dataSheet
        },
        getReportID: state => {
          return state.reportID
        },
        getRoutesheetPermission: state => {
          return state.routesheetPermission
        },

        getRoutesheetResManevr: state => {
          return state.routesheetResManevr
        },
        getRoutesheetRes: state => {
          return state.routesheetRes
        },

        getuserStat: state => {
          return state.userStat
        },
        getMenu: state => {
          return state.menu
        },
        loginServerUrl: state =>{
          return state.loginUrl
        },
        isLoggedIn: state => !!state.token,
        authStatus: state => state.status,

    },
})

export default store