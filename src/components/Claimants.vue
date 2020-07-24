<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="search for Claimants">
            <v-text-field label="Claimant Reference - Search not implemented"></v-text-field>
        </panel>
        <panel title="Claimants">
            <v-btn route to="/claimants/create" slot="action" class="indigo accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="claimant" v-for="claimant in claimantList" :key="claimant.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="claimant-title">
                            {{claimant.organization}}
                        </div>
                        <div class="claimant-name">
                            {{claimant.contactPerson}}
                        </div>
                        <div class="council-email">
                            {{claimant.email}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'claimants-view',
                            params:{
                                claimantId: claimant.id
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
        getClaimantsByCaseId(caseId){
            try {
                 this.$store.dispatch("getCaseClaimant", caseId).then(() => {
                    console.log('Case claimant '+ JSON.stringify(this.claimant));
                                    
                    }, error => {
                         console.log('Got Nowt Data '+ error);
                    });
            
            } catch (error) {
                console.log(error);
            }
        },
        getAllClaimants(){
            try {
                this.$store.dispatch("getAllClaimants").then(response => {
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
            claimants: null
        }
    },
    computed : {
        claimantList(){
            return this.$store.getters.getClaimants;
        }
    },
    async created() {
         if (this.$route.params.caseId != null){
            this.getClaimantByCaseId(this.$route.params.caseId);
        }else{
            this.getAllClaimants();
        }
    }
}
</script>

<style scoped>
    .claimant{
        padding: 20px;
        height: 200px;
        overflow: hidden;
        text-align: center;
    }
    .claimant-title{
        font-size: 30px;
    }
    .claimant-name{
        font-size: 24px;
    }
    .claimant-email{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>



