<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Sign up form</v-toolbar-title>
                <v-spacer></v-spacer>
                
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon large href="https://codepen.io/johnjleider/pen/wyYVVj" target="_blank" v-on="on">
                      <v-icon large>mdi-codepen</v-icon>
                    </v-btn>
                  </template>
                  <span>Codepen</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" v-model="email" label="Email" type="text"></v-text-field>
                  <v-text-field v-model="pword" prepend-icon="lock" name="pword" label="Password" type="password"></v-text-field>
                </v-form>
                <v-alert :value = validationerror color='error' v-html="error"></v-alert>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="indigo" dark @click="register">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import AuthService from '@/services/AuthService'  
  export default {
    data(){
        return{
          email: '',
          pword: '',
          error: null,
          validationerror: false
        }
    },
    methods: {
        async register(){
            try{
                await AuthService.register({
                    email: this.email,
                    pword: this.pword
                });
                this.validationerror = false;
            }catch(error){
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





