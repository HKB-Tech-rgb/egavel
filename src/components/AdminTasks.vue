<template>
    <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md6>
            <v-card class="elevation-20">
                <v-spacer></v-spacer>
                <v-card-text>
                    <Label class='card-lbl'>E-ARBITRATE</Label>
                    <hr/>
               </v-card-text>
               <v-card-actions>
                <div class='btnProps one-line'> 
                    <v-btn light  @click="navigateTo('arbit')">Allocate Arbitrator</v-btn>
                    <v-btn light @click="navigateTo('users')" style='margin-left: 5rem'>Maintain Users</v-btn>
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

export default {
    data () {
        return{
            arbitUser:{}
        }
    },
    methods:{
        existingCase(){
           
        },
        async populateCoyDDs(){
           this.$store.dispatch("getAllCoys").then(() => {
            //console.log('Got Data in template ' + JSON.stringify(response.data));

            this.$store.getters.getInsCoys.forEach( coy => {
                this.insCoys.push({name:coy.name, val:coy.id});
            }) ;
            this.select = this.insCoys[0];
                                    
            }, error => {
              console.log('Got Nowt Data '+ error);
            });
      },
      async navigateTo(route){
                            
          if (route=='arbit'){
              this.$router.push('/cases');
          }else{
            //console.log('route is ' + JSON.stringify(route));
              this.$router.push('/home');
          }
        },
        async initClaimantCase(){
            await this.$store.dispatch('initCase', null);
            await this.$store.dispatch('doClaimant', null);
            await this.$store.dispatch('initClaimantId', null);
            
            await this.$store.dispatch('doDefendant', null);
            await this.$store.dispatch('initDefendantId', null);

            await this.$store.dispatch('doLoci', null);
            await this.$store.dispatch('doCoa', null);
            await this.$store.dispatch('doMerit', null);

            await this.$store.dispatch('doQuanta', null);
            await this.$store.dispatch('doReliefSought', null);
            await this.$store.dispatch('doProcessCounterClaim', false);
          },
    },
    async created(){
        await this.$store.dispatch('doClaimantValid', true);
        await this.$store.getters.isClaimantCaseValid
        await this.$store.dispatch("getAllCoys"); // for drop downs
        this.arbitUser = this.$store.getters.getArbitUser;
        /*
        if (!this.$store.getters.isLoggedOn){
            var user = JSON.parse(sessionStorage.getItem('user'));
            console.log('Arbit user loggedOn ' + JSON.stringify(user));
            if (user){
                await this.$store.dispatch('findArbitUser', `/arbitusers/${user.id}`).then(() => {
                  this.arbitUser = this.$store.getters.getArbitUser;
                  this.$store.dispatch('setUpArbitToken', JSON.parse(sessionStorage.getItem('token')));
                }).catch( err => {
                    console.log('Arbit user not found ' + err);
                });
            }
        }*/
         console.log('Arbit user loggedOn ' + this.$store.getters.getArbitToken);
    }   
}
 
</script>
   
<style scoped>
.card-entry{
   background-color: black
}
.card-lbl{
    font-family: 'Calibri';
    font-size: 4rem
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

