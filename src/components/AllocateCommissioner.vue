<template>
 <v-layout>
    <v-flex xs8 >
      <Panel title="Allocate Commissioner">
        <v-card-text>
        <v-form
        
          ref="form"
          
        >
          <v-text-field
            v-model="claimDetails"
            :counter="40"
            :readonly="true"
            label="Cause of Action"
            required
          ></v-text-field>
          <v-select
            v-model="selectCommissioner"
            :items="commissioners"
            label="Select Commissioner"
            required
          ></v-select>

          <v-btn
            color="success"
            class="mr-4"
            @click="submit"
          >
            Allocate
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
  //import status from '../status-enums/caseStatus.js'
  export default {
    components:{
        Panel
    },
    data: () => ({
      claimDetails: '',
      selectCommissioner: '',
      commissioners: [{ text: 'Billy Bright'},
                      { text: 'Horace Hammer'},
                      { text: 'Mustang Matt'}
                      ],
      commissioner:{
            name: '',
            email: '',
            contactNumber: '0834151408',
            ArbitCaseId: 0,
            status: 1
      },
     
      formFieldsChanged: false,
      
    }),
    methods: {
      reset () {
        //this.$refs.form.reset()
        this.$router.push('/start');
      },
      async submit () {
          try{
            
            await this.$store.dispatch('createCommissioner', this.commissioner);
            var arbitOfficer = this.$store.getters.getArbitOfficer;
           
            var from = 'arbiter@equalise.co.za'; 
            var link = `http://localhost:8080/commissioner/actions?arbitCaseId=${arbitOfficer.ArbitCaseId}`;
             //console.log(this.msg);
            const msg = {
                to: arbitOfficer.email,
                from: from,
                subject: `Commissioner submits resolution of  case number ${arbitOfficer.ArbitCaseId}`,
                text: `click on this link to respond to request for case resolution by Commissioner ${link}`
              }; 
            try {
                  this.$store.dispatch("sendEmail", msg).then( () => {
                    //createPdf();  
                    this.$router.push('/start');
                  }, error => {
                    console.log('Got Nowt Data '+ error);
                  });
            
              } catch (error) {
                console.log(error);
              }  

          }catch(err){
            console.log('Error creating commissioner '+ err);
          }
          //this.$router.push('/claimwiz/create');
      }
    },
    watch: { 
        'selectCommissioner': function() {
           this.commissioner.name = this.selectCommissioner; 
           this.commissioner.email = 'porkylynth@gmail.com';
           this.commissioner.status = 1; 
         
      }
    },
    created(){
       this.claimDetails = this.$store.getters.getCoa.description;
       this.commissioner.ArbitCaseId = this.$route.params.caseId;
    }   
  }
</script>