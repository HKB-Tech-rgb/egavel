<template>
    <v-layout>
        <v-flex xs4>
            <Panel title="Edit Case">
                <v-card-text>
                    <v-form v-model="valid" lazy-validation ref="form">
                        <v-text-field
                            v-model="c_ase.claimNumber"
                            label="Claim Number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="c_ase.policyNumber"
                            label="Policy Number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="c_ase.policeCaseNumber"
                            label="Police Case Number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="c_ase.claimAmount"
                            label="Claim Amount" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="c_ase.statementOfClaim"
                            label="Statement of Claim" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="c_ase.caseDescription"
                            label="Case description" required :rules="required">
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
           c_ase:{
                claimNumber: null,
                policyNumber: null,
                policeCaseNumber: null,
                claimAmount: null,
                statementOfClaim: null
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
                this.$store.dispatch("updateCase", this.c_ase).then(() => {
                    this.$router.push('/cases');
                }, error => {
                    console.log('Got Nowt Data '+ error);
                });
               
            } catch (error) {
                console.log(error);
            }
        }
    },
    async mounted () {
        const caseId = this.$route.params.caseId;
        try {
            this.$store.dispatch("showCase", caseId).then(() => {
                this.c_ase = this.$store.getters.getCase;
                 
            }, error => {
                console.log('Got Nowt Data '+ error);
            });
            console.log('Got Data from store ' + JSON.stringify( this.$store.getters.getApplicants))

        } catch (error) {
            console.log(error);
        }
    
    }
}
</script>
<style scoped>

</style>



