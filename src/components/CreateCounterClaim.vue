<template>
 <v-layout>
    <v-flex xs8 >
      <Panel title="Counter Claim">
        <v-card-text>
        <v-form ref="form">
          <h3 v-if="caseId > 0" >{{caseId}}</h3>
          <v-text-field
            v-model="counterClaim.particularsOfClaim"
            :counter="40"
            :readonly=true
            label="Description of action"
            required
          ></v-text-field>
          <v-btn
            :disabled="!valid"
            color="success"
            class="mr-4"
            @click="submit()"
          >
            Continue with Claim
          </v-btn>
          <v-btn
            color="error"
            class="mr-4"
            @click="reset"
          >
            Exit Form
          </v-btn>

        </v-form>
        </v-card-text>
      </Panel>
    </v-flex>
 </v-layout>   
</template>
<script>
  import Panel from '@/components/Panel'
  import status from '@/status-enums/caseStatus.js'
  import userRoles from '@/status-enums/roletypes.js'
  export default {
    components:{
        Panel
    },
    data: () => ({
      valid: true,
      required: [(v) => !!v || 'This field is required'],
      nameRules: [
        v => !!v || 'Particulars of action is required',
        v => (v && v.length <= 40) || 'Particulars of action must be less than 40 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      selectClaimCoy: null,
      insCoys: [],
      isNew: false,
      caseId: 0,
      counterClaim:{
        id:0,
        particularsOfClaim:'',
        ArbitCaseId:0,
        ClaimantId:0,
        DefendantId:0,
        status:0
      },
      claimantCoy: '',
      currentCase: {},
      poc: '',
      formFieldsChanged: false,
      arbitUser:{}
    }),
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbar = true
        }
      },
      async createCase(){
        try{
           //console.log('creating case ' + JSON.stringify(this.arbitCase));
           await this.$store.dispatch('createCase', this.arbitCase);

        }catch(err){
          console.log('error creating case '+ err);
        }
      },
      async updateCase(){
        try{
           //console.log('arbit case ' + JSON.stringify(this.arbitCase));
           await this.$store.dispatch('updateCase', this.arbitCase);
           
        }catch(err){
          console.log('error updating case '+ err);
        }
      },
      checkForChanges(){
        if (this.currentCase.particularsOfClaim != this.counterClaim.particularsOfClaim){
            this.formFieldsChanged = true;
        }
      },
      async submit () {
          if (this.$refs.form.validate()){
              await this.initCase();
              if (!this.$store.getters.getCounterClaim){
                  this.$router.push({
                    name: 'cClaim'
                  });
              }else{
                //console.log('counterclaim status ' + this.counterClaim.status);
                //console.log('counterclaim status opened ' + status.OPENED)
                    if (this.counterClaim.id > 0){
                          await this.loadData(this.counterClaim.id);
                          this.$router.push({
                            name: 'cClaim',
                            params:{
                                    arbitId: await this.$store.getters.getCaseId,
                                    claimId: await this.$store.getters.getClaimantId,
                                    defendId: await this.$store.getters.getDefendant.id
                            }
                          });
                    }  
              }
          }
                     
      },
      async viewEdit(counterClaim){
        await this.$store.dispatch('doProcessCounterClaim', true);
        this.counterClaim.id = counterClaim.id;
        this.counterClaim.particularsOfClaim = counterClaim.particularsOfClaim;
        this.counterClaim.DefendantId = counterClaim.DefendantId;
        this.counterClaim.ClaimantId = counterClaim.ClaimantId;
        this.counterClaim.CounterClaimId = counterClaim.id;
        this.currentCase.particularsOfClaim = this.counterClaim.particularsOfClaim;

        await this.$store.dispatch('initCounterClaimId', counterClaim.id);
                         
                          //console.log('claimantCoy ' + JSON.stringify(this.arbitCase.claimantCoy));
      },
      async initCase(){
        await this.$store.dispatch('doProcessCounterClaim', false);
        await this.$store.dispatch('doLoci', null);
        await this.$store.dispatch('doCoa', null);
        await this.$store.dispatch('doMerit', null);

        await this.$store.dispatch('doQuanta', null);
        await this.$store.dispatch('doReliefSought', null);
        
        var emptyArr = [];
        await this.$store.dispatch('doLociFiles', emptyArr);
        await this.$store.dispatch('doMeritFiles', emptyArr);
        await this.$store.dispatch('doCoaFiles', emptyArr);
        await this.$store.dispatch('doQuantaFiles', emptyArr);
        await this.$store.dispatch('doReliefSoughtFiles', emptyArr);

        //valid flags
        await this.$store.dispatch('doLociStandiValid', false);
        await this.$store.dispatch('doMeritValid', false);
        await this.$store.dispatch('doCoaValid', false);
        await this.$store.dispatch('doQuantaValid', false);
        await this.$store.dispatch('doReliefSoughtValid', false);
        await this.$store.dispatch('doClaimantCaseValid', false);
      },
      async findCounterClaim(){
          var arbitId = await this.$store.getters.getCaseId;
          var claimId = await this.$store.getters.getClaimantId;
          var defendId = await this.$store.getters.getDefendantId;

          var url = `/counterclaims/case/${arbitId}/${defendId}/${claimId}`
          //console.log('counterc url '+ url);
          await this.$store.dispatch('findCounterClaim', url          
          ).then( () => {
              if (this.$store.getters.getCounterClaim){
                  this.counterClaim = this.$store.getters.getCounterClaim;
                  this.$store.dispatch('initCounterClaimId', this.counterClaim.id);
              }
          }).catch((err) => {
              console.log('Error finding Counter Claim '+ err)
          });
      },
      async loadData(ccId){
        var url = `locistatementsCC/defend/${ccId}`;
        await this.$store.dispatch('findLoci', url);
                    
        if (await this.$store.getters.getLocis.length > 0){
            await this.$store.dispatch('doLoci', this.$store.getters.getLocis[0]);
            await this.$store.dispatch("doLociStandiValid", true);
        }
        //console.log('findCounterClaim loci  '+ JSON.stringify(this.$store.getters.getLoci))
        url = `coastatementsCC/defend/${ccId}`;
        await this.$store.dispatch('findCoa', url);

        if (await this.$store.getters.getCoas.length > 0){
            await this.$store.dispatch('doCoa', this.$store.getters.getCoas[0]);
            await this.$store.dispatch("doCoaValid", true);
        }

        url = `/meritstatementsCC/defend/${ccId}`;
        await this.$store.dispatch('findMerits', url);

        if (await this.$store.getters.getMerits.length > 0){
            await this.$store.dispatch('doMerit', this.$store.getters.getMerits[0]);
            await this.$store.dispatch("doMeritValid", true);
        }

        url = `/quantumstatementsCC/defend/${ccId}`;
        await this.$store.dispatch('findQuantas', url);

        if (await this.$store.getters.getQuantas.length > 0){
            await this.$store.dispatch('doQuanta', this.$store.getters.getQuantas[0]);
            await this.$store.dispatch("doQuantaValid", true);
        }
        url = `/reliefstatementsCC/defend/${ccId}`;
        await this.$store.dispatch('findReliefSought', url);

        if (await this.$store.getters.getReliefSoughts.length > 0){
            await this.$store.dispatch('doReliefSought', this.$store.getters.getReliefSoughts[0]);
            await this.$store.dispatch("doReliefSoughtValid", true);
        }
      },
      populateCoyDDs(){
         this.$store.getters.getInsCoys.forEach( coy => {
            this.insCoys.push({name:coy.name, val:coy.id});
         });
      },
      setClaimantCoy(coyId){
        for (var i = 0; i < this.insCoys.length; i++){
            if (this.insCoys[i].val===coyId){
                this.claimantCoy = this.insCoys[i].name; 
            }
        } 
      },
      reset () {
        //this.$refs.form.reset()
        var Case = this.$store.getters.getCase
        if (this.$store.getters.getArbitUser.UserRoleId===userRoles.PARTICIPANT && 
            Case.StatusId<status.PENDINGARBIT){
                this.$router.push({
                name: 'def-create',
                    params: {
                        claimId:this.$store.getters.getClaimantId,
                        defendId: this.$store.getters.getDefendantId
                    }
                });
            }else{
                this.$router.push({
                    name: 'com-view-def'
                });
            }        
      },
      async getParams(){
            if(this.$route.params.arbitId){
                this.caseId = await this.$route.params.arbitId;
                await this.$store.dispatch('initCaseId', this.$route.params.arbitId); 
                await this.$store.dispatch('findCase', this.$route.params.arbitId);

                this.counterClaim.ArbitCaseId = await this.$route.params.arbitId;  
            }else{
                throw "Param Case Id not found";
            }
            if(this.$route.params.claimId){
                await this.$store.dispatch('initClaimantId', this.$route.params.claimId);    
                this.counterClaim.ClaimantId = await this.$route.params.claimId;
            }else{
                throw "Param Claimant Id not found";
            }
            if(this.$route.params.defendId){
                await this.$store.dispatch('initDefendantId', this.$route.params.defendId);
                await this.$store.dispatch('findDefendant', this.$route.params.defendId);
                this.counterClaim.DefendantId = await this.$route.params.defendId;
            }else{
                throw "Param Defendant Id not found";
            }
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      }
    },
    async created(){
        await this.populateCoyDDs();
        try{
          await this.getParams();
        }catch(e){
               console.error(e);
        }
        await this.$store.dispatch('findPocs');
        var Case = this.$store.getters.getCase;

        this.$store.getters.getPocs.forEach((poc)=>{
            if (poc.id===Case.PocId){
                this.counterClaim.particularsOfClaim = poc.Description;
            }
        });
        await this.findCounterClaim();
        //console.log('Counter claim initialized ' + JSON.stringify(this.$store.getters.getCounterClaim))
        var counterClaim = await this.$store.getters.getCounterClaim;
        if (counterClaim){
            await this.viewEdit(counterClaim);
        }else{
            if (this.$store.getters.getCase.StatusId>status.PENDINGTHIRD
              && this.counterClaim.id===0){
                this.valid=false
            }
        } 
    },
    async beforeDestroy() {
        var counterClaim = this.$store.getters.getCounterClaim;
        await this.$store.dispatch('doDefendantValid', true);
        if (!counterClaim){
            try{
              await this.$store.dispatch('doDefendantValid', true);
              await this.$store.dispatch('doNewCounterClaim', true);
              await this.$store.dispatch('doCounterClaim', this.counterClaim);
              //console.log('Counter claim initialized ' + JSON.stringify(this.$store.getters.getCounterClaim))
                            
            }catch(err){
              console.log('Error initiating counter claim ' + err)
            }
        }else{
            if (counterClaim.id > 0 && counterClaim.status===status.OPENED){
                await this.checkForChanges();
                try{
                  if (this.formFieldsChanged){
                    await this.$store.dispatch('doCounterClaimUpdated', true);

                    await this.$store.dispatch('initCounterClaim', counterClaim.id); 
                    await this.$store.dispatch('doCounterClaim', this.counterClaim);
                  }
                }catch(err){
                  console.log('Error updating counter claim to mem ' + err)
                }
            }
        }
    },
  }
</script>
