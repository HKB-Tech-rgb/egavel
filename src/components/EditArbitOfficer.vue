<template>
    <v-layout>
        <v-flex xs4>
            <Panel title="Edit Applicant">
                <v-card-text>
                    <v-form v-model="valid" lazy-validation ref="form">
                        <v-text-field
                            v-model="arbitOfficer.officerName"
                            label="Officer Name" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="arbitOfficer.profession"
                            label="Officer Profession" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="arbitOfficer.idNumber"
                            label="Officer ID Number" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="arbitOfficer.email"
                            label="Officer email" required :rules="required">
                        </v-text-field>
                        <v-text-field
                            v-model="arbitOfficer.contactNumber"
                            label="Officer contact number">
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
           arbitOfficer:{
                caseId: null,
                officerName: null,
                profession: null,
                createdByArbitUserId: null,
                idNumber: null,
                email: null,
                contactNumber: null
                
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
                this.$store.dispatch("updateArbitOfficer", this.arbitOfficer).then(() => {
                    this.$router.push('/arbitOfficers');
                }, error => {
                    console.log('Got Nowt Data '+ error);
                });
               
            } catch (error) {
                console.log(error);
            }
        }
    },
    async mounted () {
        const arbitOfficerId = this.$route.params.arbitOfficerId;
        try {
            this.$store.dispatch("showArbitOfficer", arbitOfficerId).then(() => {
                this.arbitOfficer = this.$store.getters.getArbitOfficer;
                 
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



