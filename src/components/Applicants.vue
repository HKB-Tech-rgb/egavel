<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="search for Applicants">
            <v-text-field label="Applicant Reference - Search not implemented"></v-text-field>
        </panel>
        <panel title="Applicants">
            <v-btn route to="/applicants/create" slot="action" class="indigo accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="applicant" v-for="applicant in applicantList" :key="applicant.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="applicant-title">
                            {{applicant.applicantName}}
                        </div>
                        <div class="applicant-council">
                            {{applicant.councilName}}
                        </div>
                        <div class="council-email">
                            {{applicant.councilEmail}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'applicants-view',
                            params:{
                                applicantId: applicant.id
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
        getApplicantByCaseId(caseId){
            try {
                 this.$store.dispatch("getCaseApplicant", caseId).then(() => {
                    console.log('Case applicant '+ JSON.stringify(this.applicant));
                                    
                    }, error => {
                         console.log('Got Nowt Data '+ error);
                    });
            
            } catch (error) {
                console.log(error);
            }
        },
        getAllApplicants(){
            try {
                this.$store.dispatch("getAllApplicants").then(response => {
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
            applicants: null
        }
    },
    computed : {
        applicantList(){
            return this.$store.getters.getApplicants;
        }
    },
    async mounted() {
         if (this.$route.params.caseId != null){
            this.getApplicantByCaseId(this.$route.params.caseId);
        }else{
            this.getAllApplicants();
        }
    }
}
</script>

<style scoped>
    .applicant{
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



