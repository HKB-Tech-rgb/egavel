<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="search for Cases">
            <v-text-field label="Case Reference - Search not implemented"></v-text-field>
        </panel>
        <panel title="Allocate Cases">
            <div class="case" v-for="Case in cases" :key="Case.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="case-particulars">
                            {{Case.poc}}
                        </div>
                        <div class="case-coys">
                             {{Case.claimantCoy}}
                        </div>
                        <div class="case-coys">
                             {{Case.defendantCoy}}                        
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'alloc-commissioner',
                            params:{
                                caseId: Case.id
                            }
                        })">Allocate Commissioner</v-btn>
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
        async listWithCoyDesc(){
            
            var caseList = [];
            //console.log('listWithCoyDesc '+ JSON.stringify(this.$store.getters.getCases));
           
           this.$store.getters.getCases.map( async Case => {
                //console.log('poc ' + Case.particularsOfClaim + ' id ' + Case.id);
                await this.$store.dispatch('getCoy', Case.CompanyId);
                let claimantCoy = this.$store.getters.getInsCoy.name;
                await this.$store.dispatch('getCoy', Case.defendantCoy);
                let defendantCoy = this.$store.getters.getInsCoy.name;
                
                await this.$store.dispatch('getCaseClaimant', Case.id);

                var paramObj = {};
                paramObj.arbitId = Case.id;
                paramObj.claimId = this.$store.getters.getClaimant.id;
                await this.$store.dispatch('findCoa', paramObj);

                caseList.push({id: Case.id, 
                               poc: this.$store.getters.getCoa.description,
                               claimantCoy: claimantCoy,
                               defendantCoy:  defendantCoy
                               });
            });
            return caseList;
        }
    },
    data() {
        return {
            cases: null
        }
    },
    computed : {
        caseList(){
            return this.listWithCoyDesc();
        }
    },
    async mounted() {
        try {
            var foo = 'getAllCases';
            await this.$store.dispatch(foo);
            this.cases = await this.listWithCoyDesc();         
        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<style scoped>
    .case{
        padding: 20px;
        height: 200px;
        overflow: hidden;
        text-align: center;
    }
    .case-particulars{
        font-size: 30px;
    }
    .case-coys{
        font-size: 24px;
    }
    .case-amount{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>



