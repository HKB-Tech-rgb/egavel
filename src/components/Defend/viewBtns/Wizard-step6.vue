<template>
  
  <v-layout row>

    <v-flex xs12 sm6 md8 offset-md2>
      <v-card>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
        >
        </v-img>
        <v-card-title primary-title>
          <div>
            <div class="headline">Click Save to edit later or submit to complete claimant motion</div>
            <span class="grey--text">{{displayMsg}}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn text @click="saveClaim">Save</v-btn>
          <v-btn text color="purple" @click="fileClaim">Submit Motion</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default { 
    data(){
      return {
        claimant:{},
        defendant:{},
        msg: {},
        displayMsg : ''
      }
    },
    async created() {
        if (this.$store.getters.isClaimantCaseValid){
           this.displayMsg =  'Fields captured are valid';
        }else{
           this.displayMsg =  'Case is not complete - only save permitted';
        }
    },//
    async beforeDestroy() {
        
    },
    methods:{
      async saveClaim(){
          if (this.$store.getters.isDefendantValid){
            await this.saveCase();
            await this.saveClaimant();//can only save claimant when claimant and defendant valid 
            await this.saveDefendant();
          } 

          if (this.$store.getters.isLociStandiValid){
              if (this.$store.getters.isNewLoci){
                try{
                    await this.$store.dispatch('createLoci', this.$store.getters.getLoci);
                    await this.$store.dispatch('doNewLoci', false);

                    this.displayMsg = 'New Loci inserted successfully'; 
                }catch(err){
                    console.log('New Loci not inserted '+ err);
                }
              }else {
                if (this.$store.getters.isLociUpdated){
                  try{
                    await this.$store.dispatch('updateLoci', this.$store.getters.getLoci);
                    await this.$store.dispatch('doLociUpdated', false);

                    this.displayMsg = 'Loci updated successfully'; 
                  }catch(err){
                     console.log('Loci not updated '+ err);
                  }
                }
              }
              if (this.$store.getters.getLociFiles != null){
                 
                try{
                    const filteredFiles = this.$store.getters.getLociFiles.filter(file => !file.id);
                    await this.$store.dispatch('doLociFiles', null);
                    var retArr = [];
                    filteredFiles.forEach( file => {
                        retArr.push({"filename":  file.filename, 
                                    "diskname": file.diskname,
                                    "LocusStandiId": this.$store.getters.getLociId
                        });
                    });
                    if (retArr.length > 0){
                        this.$store.dispatch('createLociFiles', retArr).then(() => {
                          this.displayMsg = 'loci files inserted'; 
                        });
                    }
                                      
                }catch(err){
                  console.log('Unable to insert locus Standi file names '+ err);
                }
              }
          }
          if (this.$store.getters.isCoaValid){
              if (this.$store.getters.isNewCoa){
                try{
                    await this.$store.dispatch('createCoa', this.$store.getters.getCoa);
                    await this.$store.dispatch('doNewCoa', false);

                    this.displayMsg = 'New Coa inserted successfully'; 
                }catch(err){
                    this.displayMsg = 'New Coa not inserted ' + err; 
                    console.log('New Coa not inserted '+ err);
                }
              }else {
                if (this.$store.getters.isCoaUpdated){
                  try{
                     await this.$store.dispatch('updateCoa', this.$store.getters.getCoa);
                     await this.$store.dispatch('doCoaUpdated', false);
                   
                     this.displayMsg = 'Coa updated successfully'; 
                  }catch(err){
                    console.log('Coa not updated '+ err);
                    this.displayMsg = 'Error updating Coa ' + err; 
                  }
                }
              }
              if (this.$store.getters.getCoaFiles != null){
                try{
                    const filteredFiles = this.$store.getters.getCoaFiles.filter(file => !file.id);
                    await this.$store.dispatch('doCoaFiles', null);
                    retArr = [];
                    filteredFiles.forEach( file => {
                        retArr.push({"filename":  file.filename, 
                                    "diskname": file.diskname,
                                    "CoaId": this.$store.getters.getCoaId
                        });
                    });
                    if (retArr.length > 0){
                        this.$store.dispatch('createCoaFiles', retArr).then(() => {
                          this.displayMsg = 'Coa files inserted'; 
                        });
                    }
                                     
                }catch(err){
                  console.log('Unable to insert Cause of action file names '+ err);
                }
              }
          }
          if (this.$store.getters.isMeritsValid){
              if (this.$store.getters.isNewMerit){
                try{
                    await this.$store.dispatch('createMerit', this.$store.getters.getMerit);
                    await this.$store.dispatch('doNewMerit', false);

                    this.displayMsg = 'Merit inserted successfully'; 
                }catch(err){
                    console.log('New Merit not inserted '+ err);
                    this.displayMsg = 'Error inserting new Merit '+ err;
                }
              }else {
                if (this.$store.getters.isMeritUpdated){
                  try{
                     await this.$store.dispatch('updateMerit', this.$store.getters.getMerit);
                     await this.$store.dispatch('doMeritUpdated', false);
                     
                     this.displayMsg = 'Merit updated successfully'; 
                  }catch(err){
                     console.log('Merit not updated '+ err);
                     this.displayMsg = 'Error updating Merit '+ err;
                  }
                }
              }
              if (this.$store.getters.getMeritFiles != null){
                try{
                    const filteredFiles = this.$store.getters.getMeritFiles.filter(file => !file.id);
                    await this.$store.dispatch('doMeritFiles', null);
                    retArr = [];
                    filteredFiles.forEach( file => {
                        retArr.push({"filename":  file.filename, 
                                    "diskname": file.diskname,
                                    "MeritId": this.$store.getters.getMeritId
                        });
                    });
                    if (retArr.length > 0){
                        this.$store.dispatch('createMeritFiles', retArr).then(() => {
                          this.displayMsg = 'Merit files inserted'; 
                        });
                    }
                                      
                }catch(err){
                  console.log('Unable to insert Merits file names '+ err);
                }
              }
            }
            if (this.$store.getters.isReliefSoughtValid){
              if (this.$store.getters.isNewRelief){
                try{
                    await this.$store.dispatch('createReliefSought', this.$store.getters.getReliefSought);
                    await this.$store.dispatch('doNewRelief', false);
                }catch(err){
                    console.log('New Relief sought not inserted '+ err);
                }
              }else {
                if (this.$store.getters.isReliefUpdated){
                  try{
                     await this.$store.dispatch('updateReliefSought', this.$store.getters.getReliefSought);
                     await this.$store.dispatch('doReliefUpdated', false);
                    
                  }catch(err){
                     console.log('Relief sought not updated '+ err);
                  }
                }
              }
              if (this.$store.getters.getReliefSoughtFiles != null){
                try{
                    const filteredFiles = this.$store.getters.getReliefSoughtFiles.filter(file => !file.id);
                    await this.$store.dispatch('doReliefSoughtFiles', null);
                    retArr = [];
                    filteredFiles.forEach( file => {
                        retArr.push({"filename":  file.filename, 
                                    "diskname": file.diskname,
                                    "ReliefSoughtId": this.$store.getters.getReliefSoughtId
                        });
                    });
                    if (retArr.length > 0){
                        await this.$store.dispatch('createReliefSoughtFiles', retArr);
                        this.displayMsg = 'ReliefSought files inserted';
                    }
                   
                }catch(err){
                  console.log('Unable to insert ReliefSought file names '+ err);
                }
              }
          }
          if (this.$store.getters.isQuantaValid){
            if (this.$store.getters.isNewQuanta){
                try{
                    await this.$store.dispatch('createQuanta', this.$store.getters.getQuanta);
                    await this.$store.dispatch('doNewQuanta', false);
                }catch(err){
                    console.log('New Quanta not inserted '+ err);
                }
              }else {
                if (this.$store.getters.isQuantaUpdated){
                  try{
                     await this.$store.dispatch('updateQuanta', this.$store.getters.getQuanta);
                     await this.$store.dispatch('doQuantaUpdated', false);
                     
                  }catch(err){
                     console.log('Quanta not updated '+ err);
                  }
                }
              }
              if (this.$store.getters.getQuantaFiles != null){
                try{
                    const filteredFiles = this.$store.getters.getQuantaFiles.filter(file => !file.id);
                    await this.$store.dispatch('doQuantaFiles', null);
                    retArr = [];
                    filteredFiles.forEach( file => {
                        retArr.push({"filename":  file.filename, 
                                    "diskname": file.diskname,
                                    "QuantumId": this.$store.getters.getQuantaId
                        });
                    });
                    if (retArr.length > 0){
                        await this.$store.dispatch('createQuantaFiles', retArr);
                        this.displayMsg = 'Quanta files inserted';
                    }
                   
                }catch(err){
                  console.log('Unable to insert Quanta file names '+ err);
                }
              }
          }
          
      },
      async saveClaimant(){
        if (this.$store.getters.isNewClaimant){
            try{
              await this.$store.dispatch('createClaimant', this.$store.getters.getClaimant);
              await this.$store.dispatch('doNewClaimant', false);
              this.displayMsg = 'New Claimant inserted'; 

              }catch(err){
                  console.log('Error creating claimant ' + err);
              }
        }else{
             if (this.$store.getters.isClaimantUpdated){
                try{
                   await this.$store.dispatch('updateClaimant',this.$store.getters.getClaimant);
                   await this.$store.dispatch('doClaimantUpdated', false);
                   await this.$store.dispatch('findClaimant',this.$store.getters.getClaimantId);

                   this.displayMsg = 'Claimant updated';
                  
                }catch(err){
                      console.log('Error updating claimant ' + err)
                  }
            }
        }
        //console.log('Is claimant valid '+this.$store.getters.isClaimantValid);
      },
      async saveDefendant(){
            if (this.$store.getters.isNewDefendant){
                try{
                    console.log('Defendant about to be created ');
                    this.$store.dispatch('createDefendant', this.$store.getters.getDefendant) .then( () =>{
                        this.displayMsg = 'Defendant created';
                        var claimDefend = {
                            ClaimantId: this.$store.getters.getClaimantId,
                            DefendantId: this.$store.getters.getDefendantId,
                            ArbitCaseId: this.$store.getters.getCase.id,
                            status:0
                        };
                        this.$store.dispatch('createClaimDefend', claimDefend).then ( async () => {
                            this.displayMsg = "claimdefend created ";
                            await this.$store.dispatch('doNewDefendant', false);
                            this.displayMsg = 'New Defendant inserted';

                        }).catch(err => {
                             console.log('error creating claimdefend ' + err);
                        });
                    }).catch(err => {
                         console.log('error creating defendant ' + err);
                    });
                              
                }catch(err){
                    console.log('Error creating defendant ' + err);
                }
            }else{
                  if (this.$store.getters.isDefendantUpdated){
                    try{
                        await this.$store.dispatch('updateDefendant',this.$store.getters.getDefendant);
                        await this.$store.dispatch('doDefendantUpdated', false);

                        await this.$store.dispatch('findDefendant',this.$store.getters.getDefendantId);
                        this.displayMsg = 'Defendant updated'; 
                      }catch(err){
                         console.log('Error updating arbit Defendant ' + err)
                      }
                  }    
            }
      },
      async saveClaimDefend(){
        // 
        //if (this.$store.getters.isNewDefendant){
            console.log('about to write claim defend');
            var claimDefend = {};
            claimDefend.ClaimantId = this.$store.getters.getClaimantId;
            claimDefend.DefendantId = this.$store.getters.getDefendantId;
            claimDefend.ArbitCaseId = this.$store.getters.getCase.id;
            claimDefend.status = 0;

            try{
                await this.$store.dispatch('createClaimDefend', claimDefend);
                await this.$store.dispatch('doNewDefendant', false);

            }catch(err){
                console.log('error creating claimDefend '+ err);
            }
        //}
      },
      async saveCase(){
            if (this.$store.getters.isNewCase){
              try{
                    await this.$store.dispatch('createCase', this.$store.getters.getCase);
                    await this.$store.dispatch('doNewCase', false);
                    this.displayMsg = 'New Case inserted successfully'; 
              }catch(err){
                    console.log('New Case not inserted '+ err);
              }
            }else {
                if (this.$store.getters.isCaseUpdated){
                  try{
                     await this.$store.dispatch('updateCase', this.$store.getters.getCase);
                     await this.$store.dispatch('doCaseUpdated', false);
                     await this.$store.dispatch('findCaseByPk', this.$store.getters.getCase.Id);
                     this.displayMsg = 'Case updated successfully';
                  }catch(err){
                     console.log('Case not updated '+ err);
                  }
                }
            }
      },
      async fileClaim(){
          await this.saveClaim();
          if (this.$store.getters.getDefendant != null){
              this.defendant = this.$store.getters.getDefendant;
              this.$store.commit("setDefendant", this.defendant);

              if (this.defendant.status < 1){
                  console.log(' registering defendant for pword');
                  this.register();
              }
                             
              //console.log(' case is ' + this.$store.getters.getDefendant);
              
          }
          
      }
      
    }
}
</script>
