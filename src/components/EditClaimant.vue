<template>
    <v-layout>
        <v-flex xs4>
            <Panel title="Edit Claimant">
                <v-card-text>
                    <v-form v-model="valid" lazy-validation ref="form">
                        <v-text-field
                            v-model="claimant.organization"
                            label="Claimant organization" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="claimant.contactPerson"
                            label="Claimant contact person" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="claimant.address"
                            label="claimant address" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="claimant.telephone"
                            label="Claimant contact number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="claimant.email"
                            label="claimant Email" required :rules="required">
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
          claimant:{
                organization: '',
                contactPerson: '',
                caseId: '',
                createdByArbitUserId: '',
                address: '',
                telephone: '',
                email: ''
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
                this.$store.dispatch("updateClaimant", this.claimant).then(() => {
                    this.$router.push('/claimants');
                }, error => {
                    console.log('Got Nowt Data '+ error);
                });
               
            } catch (error) {
                console.log(error);
            }
        }
    },
    async created () {
        const claimantId = this.$route.params.claimantId;
        try {
            this.$store.dispatch("showClaimant", claimantId).then(() => {
                this.claimant = this.$store.getters.getClaimant;
                 
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



