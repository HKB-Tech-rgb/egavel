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
                    <v-btn light  @click="navigateTo()">New Case</v-btn>
                    <v-btn light @click="navigateTo('exist')" style='margin-left: 9rem'>Existing Case</v-btn>
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
                            
          if (route=='exist'){
            console.log('we passing id in route store value '+ JSON.stringify(this.$store.getters.getArbitUser));
            this.$router.push({name: 'cases-coy',
                              params: {
                                coyId: this.arbitUser.CompanyId
                              }
                            });

          }else{
            //console.log('route is ' + JSON.stringify(route));
            await this.initClaimantCase();
            this.$router.push({
                name:'arbitcases',
                    params:{
                    isNew: 1
                }
            });
            
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
        this.$store.dispatch('findArbitUser', 6).then(() => {
            this.arbitUser = this.$store.getters.getArbitUser;
        }).catch( err => {
            console.log('Arbit user not found ' + err);
        });*/
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

