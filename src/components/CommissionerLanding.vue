<template>
    <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md6>
            <v-card class="elevation-20">
                <v-spacer></v-spacer>
                <v-card-text>
                    <Label class='card-lbl'>Commissioner - Actions</Label>
                    <hr/>
               </v-card-text>
               <v-card-actions>
                <div class='btnProps one-line'> 
                    <v-btn light  @click="navigateTo('judge')">View cases/Submit Judgement</v-btn>
                    <v-btn light @click="navigateTo('home')" 
                                                style='margin-left: 6rem'>Exit</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
//import caseStatus from '../status-enums/caseStatus';
export default {
    data () {
        return{
            arbitUserId:''
        }
    },
    methods:{
        async navigateTo(route){
          switch(route) {
              case "judge":
                this.$router.push('/cases');
                break;
              case "home":
                this.$router.push('/home');
                break;
              default:
                console.log(`I have never heard of that Route...${route}`);
            } 
          /*       
          if (route=='exist'){
            console.log('we passing id in route store value '+ this.$store.getters.getArbitUser.id);
            this.$router.push({name: 'cases-user',
                              params: {
                                userId: this.$store.getters.getArbitUser.id
                              }
                            });
          }else{
              var c_ase = {};
              if (this.$store.getters.getCase===null){
                   c_ase.status=caseStatus.OPENED;
                   this.$store.commit('setCase', c_ase);
              }
              this.$router.push(route);
          }*/
        }
    },
    async created(){
    }   
}
 
</script>
   
<style scoped>
.card-entry{
   background-color: black
}
.card-lbl{
    font-family: 'Calibri';
    font-size: 2rem
}
.one-line {
  margin-left: 5em;  
  overflow: hidden; 
  text-overflow: ellipsis;
  white-space: nowrap;
}
.btnProps{
    font-family: Cambria;
    font-size: 1.3em;
    font-weight: 400;
}
</style>

