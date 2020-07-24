<template>
  <v-app id="inspire">
    <v-card width="400" class="mx-auto mt-5">
      <v-card-title class="pb-0">
        <h1>User Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form class="mt-1">
          <v-text-field class="pt-4"
            v-model='creds.email'
            label="Username" 
            prepend-icon="mdi-account-circle"
          />
          <v-text-field 
            v-model='creds.pword'
            :type="showPassword ? 'text' : 'password'" 
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
        <v-alert :value = validationerror color='error' v-html="error"></v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="red"  
          text  href="/"  
          style="color:blue; font-size: 10px">
          forgot password?
        </v-btn>
         <v-spacer/> 
        <v-btn color="info">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
  //import AuthService from '@/services/AuthService'  
  export default {
    data(){
      return{
        email: '',
        pword: '',
        error: null,
        validationerror: false,
        showPassword: false,
        creds: {
          email: '',
          pword:''
        }
      }
    },
    methods:{
      async login(){
        try {
          /*
         const response = await AuthService.login({
              email: this.email,
              pword: this.pword
            });
            this.validationerror = false;

            this.$store.dispatch('setToken', response.data.token);
            this.$store.dispatch('setUser', response.data.user);*/
            this.$router.push('/start');
            
        }catch (error) {
            this.error = error.response.data.error;
            this.validationerror = true;
        }
      }
    },
    props: {
      source: String
    }
  }
</script>


