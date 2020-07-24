<template>
    <v-layout>
        <v-flex xs4>
            <Panel title="Edit Applicant">
                <v-card-text>
                    <v-form v-model="valid" lazy-validation ref="form">
                        <v-text-field
                            v-model="applicant.applicantName"
                            label="Applicant Name" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.address"
                            label="Applicant Address" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.idNumber"
                            label="Applicant ID Number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.councilName"
                            label="Applicant council name" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.councilCellNo"
                            label="Applicant council cell number">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.councilLLine"
                            label="Applicant council land line number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="applicant.councilEmail"
                            label="Applicant council Email" required :rules="required">
                        </v-text-field>
                        <v-card-actions>
                            <v-btn color="indigo" dark @click="create">Save</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-card-text>    
            </Panel>
        </v-flex>
    </v-layout>
</template>
<script>
import Panel from '@/components/Panel'
export default {
    data(){
        return{
           applicant:{
                applicantName: null,
                address: null,
                caseId: null,
                createdByArbitUserId: null,
                idNumber: null,
                councilName: null,
                councilCellNo: null,
                councilLLine: null,
                councilEmail: null
           },
           required: [(v) => !!v || 'This field is required'] 
        }
    },
    components:{
        Panel
    },
    methods:{
        async create () {
            try {
                this.$store.dispatch("updateApplicant", this.applicant).then(() => {
                    this.$router.push('/applicants');
                }, error => {
                    console.log('Got Nowt Data '+ error);
                });
               
            } catch (error) {
                console.log(error);
            }
        }
    },
    async mounted () {
        const applicantId = this.$route.params.applicantId;
        try {
            this.$store.dispatch("showApplicant", applicantId).then(() => {
                this.applicant = this.$store.getters.getApplicant;
                 
            }, error => {
                console.log('Got Nowt Data '+ error);
            });
            //console.log('Got Data from store ' + JSON.stringify( this.$store.getters.getApplicant))

        } catch (error) {
            console.log(error);
        }
    
    }
}
</script>
<style scoped>

</style>



