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
            <div class="headline">Click Save to edit later or submit to file from 3rd party wizard</div>
            <span class="grey--text">{{displayMsg}}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn text @click="saveClaim">Save</v-btn>
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
        if (this.$store.getters.isDefenseValid){
           this.displayMsg =  'Fields captured are valid';
        }
    },
    methods:{
      setIdees(obj){
          obj.ClaimantId = this.$store.getters.getClaimantId;
          obj.DefendantId = this.$store.getters.getDefendantId;
          return obj;
      },
      async saveClaim(){
          if (this.$store.getters.isDefendantValid){
              await this.saveDefendant();
          }  
          if (this.$store.getters.isDefenseValid){
              await this.saveDefense();
              await this.saveDefenseFiles();
          }
          if (this.$store.getters.isApportionmentValid){
              await this.saveApportionment();
              await this.saveApportionFiles();
          }
      },
      async saveDefense(){
          if (this.$store.getters.isNewDefense){
              try{
                var defense = await this.setIdees(this.$store.getters.getDefense); 
                await this.$store.dispatch('createDefense', defense);

                await this.$store.dispatch('doNewDefense', false);
                this.displayMsg = 'New Defense inserted successfully'; 
              }catch(err){
                    console.log('New Defense not inserted '+ err);
              }
          }else{
                if (this.$store.getters.isDefenseUpdated){
                  try{
                    await this.$store.dispatch('updateDefense', this.$store.getters.getDefense);
                    await this.$store.dispatch('doDefeneseUpdated', false);

                    this.displayMsg = 'Defense updated successfully'; 
                  }catch(err){
                     console.log('Defense not updated '+ err);
                  }
                }
          }
      },
      async saveDefenseFiles(){
          if (this.$store.getters.getDefenseFiles != null){
            try{
                const filteredFiles = await this.$store.getters.getDefenseFiles.filter(file => !file.id);
                await this.$store.dispatch('doDefenseFiles', null);
                var retArr = [];
                await filteredFiles.forEach( file => {
                    retArr.push({"filename":  file.filename, 
                                "diskname": file.diskname,
                                "DefenseId": this.$store.getters.getDefenseId
                    });
                });
                if (retArr.length > 0){
                    await this.$store.dispatch('createDefenseFiles', retArr).then(() => {
                    this.displayMsg = 'defense files inserted'; 
                  });
                }
            }catch(err){
                  console.log('Unable to insert defense file names '+ err);
            }
          }
      },    
      async saveApportionment() {
          if (this.$store.getters.isNewApportionment){
              try{
                  var apportion = await this.setIdees(await this.$store.getters.getApportionment); 
                  await this.$store.dispatch('createApportionment', apportion);
                  await this.$store.dispatch('doNewApportionment', false);

                  this.displayMsg = 'New Apportionment inserted successfully'; 
              }catch(err){
                  this.displayMsg = 'New Apportionment not inserted ' + err; 
                  console.log('New Apportionment not inserted '+ err);
              }
          }else{
              if (this.$store.getters.isApportionmentUpdated){
                try{
                  await this.$store.dispatch('updateApportionment', this.$store.getters.getApportionment);
                  await this.$store.dispatch('doApportionmentUpdated', false);
                 
                  this.displayMsg = 'Apportionment updated successfully'; 
                }catch(err){
                  console.log('Apportionment not updated '+ err);
                  this.displayMsg = 'Error updating Apportionment ' + err; 
                }
              }
          }
      },
      async saveApportionFiles(){
          if (this.$store.getters.getApportionFiles != null){
              try{
                  const filteredFiles = this.$store.getters.getApportionFiles.filter(file => !file.id);
                  await this.$store.dispatch('doApportionFiles', null);
                  var retArr = [];
                  filteredFiles.forEach( file => {
                      retArr.push({"filename":  file.filename, 
                                  "diskname": file.diskname,
                                  "ApportionmentId": this.$store.getters.getApportionmentId
                      });
                  });
                  if (retArr.length > 0){
                      this.$store.dispatch('createApportionFiles', retArr).then(() => {
                          this.displayMsg = 'Apportion files inserted'; 
                      });
                  }
              }catch(err){
                  console.log('Unable to insert Apportionment file names '+ err);
              }
          }
      },
      async saveDefendant(){
          if (this.$store.getters.isNewDefendant){
              try{
                  await this.$store.dispatch('createDefendant', this.$store.getters.getDefendant) .then( () =>{
                      this.displayMsg = 'Third party created';
                  });
              }catch(err){
                  this.displayMsg = 'Error creating third party '+ err;
                  console.log('Error creating defendant ' + err);
              }
          }else{
                if (this.$store.getters.isDefendantUpdated){
                  try{
                      await this.$store.dispatch('updateDefendant',this.$store.getters.getDefendant);
                      await this.$store.dispatch('doDefendantUpdated', false);
                      await this.$store.dispatch('findDefendant',this.$store.getters.getDefendantId);
                      this.displayMsg = 'Third Party updated'; 
                  }catch(err){
                       console.log('Error updating Third Party ' + err)
                  }
                }    
          }
      },
      async fileClaim(){
          await this.saveClaim();
          if (this.$store.getters.getDefendant != null){
              this.defendant = this.$store.getters.getDefendant;
              this.$store.commit("setDefendant", this.defendant);
          }
      },
    }  
}
</script>
