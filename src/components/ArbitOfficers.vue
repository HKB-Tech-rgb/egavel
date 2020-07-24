<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="search for Arbit Officers">
            <v-text-field label="Arbit Officers Reference - Search not implemented"></v-text-field>
        </panel>
        <panel title="Arbit Officers">
            <v-btn route to="/arbitOfficers/create" slot="action" class="indigo accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="arbitOfficer" v-for="arbitOfficer in arbitOfficerList" :key="arbitOfficer.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="applicant-title">
                            {{arbitOfficer.officerName}}
                        </div>
                        <div class="applicant-council">
                            {{arbitOfficer.profession}}
                        </div>
                        <div class="council-email">
                            {{arbitOfficer.email}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'arbitOfficers-view',
                            params:{
                                arbitOfficerId: arbitOfficer.id
                            }
                        })">View</v-btn>
                    </v-flex>
                </v-layout>
            </div>
        </panel>
      </v-flex>   
    </v-layout>
</template>

<script>
import Panel from './Panel.vue'

export default {
    components:{
        Panel
    },
    methods:{
        navigateTo (route){
            this.$router.push(route);
        },
        getArbitOfficerByCaseId(caseId){
            try {
                 this.$store.dispatch("getCaseArbitOfficer", caseId).then(() => {
                    console.log('Case arbit Officer '+ JSON.stringify(this.arbitOfficers));
                                    
                    }, error => {
                         console.log('Got Nowt Data '+ error);
                    });
            
            } catch (error) {
                console.log(error);
            }
        },
        getAllArbitOfficers(){
            try {
                this.$store.dispatch("getAllArbitOfficers").then(response => {
                console.log('Got Data ' + response);
                                    
                    }, error => {
                         console.log('Got Nowt Data '+ error);
                    });
            
            } catch (error) {
                console.log(error);
            }
        }
    },
    data() {
        return {
            arbitOfficers: null
        }
    },
    computed : {
        arbitOfficerList(){
            return this.$store.getters.getArbitOfficers;
        }
    },
    async mounted() {
         if (this.$route.params.caseId != null){
            this.getArbitOfficerByCaseId(this.$route.params.caseId);
        }else{
            this.getAllArbitOfficers();
        }
    }
}
</script>

<style scoped>
    .arbitOfficer{
        padding: 20px;
        height: 200px;
        overflow: hidden;
        text-align: center;
    }
    .applicant-title{
        font-size: 30px;
    }
    .applicant-council{
        font-size: 24px;
    }
    .council-email{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>



