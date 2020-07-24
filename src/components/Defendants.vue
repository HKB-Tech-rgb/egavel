<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="Search for Defendants">
            <v-text-field label="Defendant Reference - Search not implemented"></v-text-field>
        </panel>
        <panel title="Defendants">
            <v-btn route to="/defendants/create" slot="action" class="wheat accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="defendant" v-for="defendant in defendantList" :key="defendant.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="applicant-title">
                            {{defendant.defendantName}}
                        </div>
                        <div class="applicant-council">
                            {{defendant.councilName}}
                        </div>
                        <div class="council-email">
                            {{defendant.councilEmail}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'defendants-view',
                            params:{
                                defendantId: defendant.id
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
        getDefendantByCaseId(id){
            try {
                 this.$store.dispatch("getCaseDefendant", id).then(() => {
                    this.defendant = this.$store.getters.getDefendant;
                 
                }, error => {
                    console.log('Got Nowt Data '+ error);
                });
            
            } catch (error) {
                console.log(error);
            }
        },
         getAllDefendants(){
            try {
                this.$store.dispatch("getAllDefendants").then(response => {
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
            defendants: null
        }
    },
    computed : {
        defendantList(){
            return this.$store.getters.getDefendants;
        }
    },
    async mounted() {
         if (this.$route.params.arbitCaseId){
            this.getDefendantByCaseId(this.$route.params.arbitCaseId);
        }else{
            this.getAllDefendants();
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



