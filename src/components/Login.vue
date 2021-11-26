<template>
 <div>
<section class="uza-contact-area section-padding-80">
    <div class="container">          
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <form onsubmit="event.preventDefault()" class="box">
                        <h1>Войдите в систему</h1>                    
                        <input type="text" placeholder="Username" v-model="username" :rules="nameRules" label="name" required> 
                        <input type="password"  placeholder="Password" v-model="password" label="password" required> 
                        <input type="submit"  value="Login" @click="sendTest()">
                    </form>
                </div>
            </div>
        </div> 
        <div>
            <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                color="error"
            >
                {{ err }}
            </v-snackbar>
        </div>
    </div>
</section>
 </div>
</template>
<script>
  export default {
    data(){
      return {
            snackbar: false,            
            timeout: 4000,
            status:null,
            err:null,
            valid: false,
            username:'',
            password:'',
            nameRules: [
                            v => !!v || 'Name is required',
                            v => v.length <= 10 || 'Name must be less than 10 characters',
                        ],
        }
    },
    methods: {        
        async sendTest(){ 
            this.status=null
            this.err=null
            try{
                this.status = await this.$store.dispatch('login',
                    {                    
                        username: this.username,
                        password: this.password,                    
                    }
                )
                this.$store.state.userStat=this.username
                console.log(this.$store.state.userStat)
                this.$router.push('/')
                
            }catch(e){
                this.$store.state.userStat=null
                this.err='Ошибка авторизации' 
                //console.log(this.err) 
                this.snackbar=true   
                           
            }   
        }
    }
  }
</script>