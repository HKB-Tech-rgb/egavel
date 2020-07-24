<template>
    <v-layout column>
      <v-flex xs8>
        <panel :title="head">
            
            <v-text-field label="Participant Reference - Search not implemented"></v-text-field>
        </panel>
        <panel :title="head">
            <v-btn @click="initParts('/claimwiz/create')" slot="action" class="wheat accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="case" v-for="cd in cds" :key="cd.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="case-particulars" v-if="cd.arbitCaseId">
                            Case Number: {{cd.arbitCaseId}} {{cd.filed}}
                        </div>
                        <div class="case-particulars">
                            {{cd.claimId}} {{cd.claim}}: {{cd.claimantName}} {{cd.claimantContact}} 
                        </div>
                        <div class="case-coys">
                            {{cd.defendId}} {{cd.defend}}: {{cd.defendantName}} {{cd.defendantContact}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo(cd)">View/Use</v-btn>
                    </v-flex>
                </v-layout>
            </div>
        </panel>
      </v-flex>   
    </v-layout>
</template>

<script>
import Panel from './Panel.vue';
import caseStatus from '@/status-enums/caseStatus.js';

export default {
    components:{
        Panel
    },
    methods:{
        async navigateTo(cd){
            switch(this.actions){
                case "insured":
                    await this.initVars(cd);
                    if (cd.statusId===caseStatus.FILED){
                        this.$store.dispatch('doWidgetActive', false);
                    }
                    this.$router.push({
                        name: 'case-exist',
                        params: {
                            claimId: cd.claimId,
                            defendId: cd.defendId
                        }    
                    });
                    break;
                case "third":
                    //this.initVars(cd);
                    this.$router.push({
                        name: 'def-create',
                        params: {
                            arbitId: cd.arbitCaseId,
                            claimId: cd.claimId,
                            defendId: cd.defendId
                        }    
                    });
                    break; 
                case "arbit":
                    this.$router.push({
                        name: 'resolve-wiz',
                        params: {
                            arbitId: cd.arbitCaseId,
                            claimId: cd.claimId,
                            defendId: cd.defendId
                        }    
                    });
                    break;
                default:
                    console.log('Where is this action? '+ this.actions);                 
            }
                      
        },
        async initVars(cd){
            await this.$store.dispatch('initCaseId', cd.arbitCaseId); 
            await this.$store.dispatch('getArbitCase', cd.arbitCaseId); 

            await this.$store.dispatch('initClaimantId', cd.claimId); 
            await this.$store.dispatch('findClaimant', cd.claimId);

            await this.$store.dispatch('initDefendantId', cd.defendId);
            await this.$store.dispatch('findDefendant', cd.defendId);
            
            var url = `/locistatements/claimant/${cd.claimId}/${cd.defendId}`
            await this.$store.dispatch('findLoci', url);
            
            if (await this.$store.getters.getLocis.length > 0){
                await this.$store.dispatch('doLoci', this.$store.getters.getLocis[0]);
                
                url = `/locifiles/claimant/${await this.$store.getters.getLoci.id}`;
                await this.$store.dispatch('findLociFiles', url); 
                //console.log(`loci files are ${JSON.stringify(this.$store.getters.getLociFiles)}`);
            }

            url = `/coastatements/claimant/${cd.claimId}/${cd.defendId}`;
            await this.$store.dispatch('findCoa', url);
            if (await this.$store.getters.getCoas.length > 0){
                await this.$store.dispatch('doCoa', this.$store.getters.getCoas[0]);
                url = `/coafiles/claimant/${await this.$store.getters.getCoa.id}`;
                await this.$store.dispatch('findCoaFiles', url); 
            }

            url = `/meritstatements/claimant/${cd.claimId}/${cd.defendId}`;
            await this.$store.dispatch('findMerits', url);
            if (await this.$store.getters.getMerits.length > 0){
                await this.$store.dispatch('doMerit', this.$store.getters.getMerits[0]);
                url = `/meritfiles/claimant/${await this.$store.getters.getMerit.id}`;
                await this.$store.dispatch('findMeritFiles', url); 
            }

            url = `/quantumstatements/claimant/${cd.claimId}/${cd.defendId}`;
            await this.$store.dispatch('findQuantas', url);
            if (await this.$store.getters.getQuantas.length > 0){
                await this.$store.dispatch('doQuanta', this.$store.getters.getQuantas[0]);
                url = `/quantumfiles/claimant/${await this.$store.getters.getQuanta.id}`;
                await this.$store.dispatch('findQuantaFiles', url); 
            }

            url = `/reliefstatements/claimant/${cd.claimId}/${cd.defendId}`;
            await this.$store.dispatch('findReliefSought', url);
            if (await this.$store.getters.getReliefSoughts.length > 0){
                await this.$store.dispatch('doReliefSought', this.$store.getters.getReliefSoughts[0]);
                url = `/relieffiles/claimant/${await this.$store.getters.getReliefSought.id}`;
                await this.$store.dispatch('findReliefSoughtFiles', url); 
                await this.$store.dispatch('doClaimantCaseValid', true);
            }
            
        },
        initParts(route){
            this.$store.dispatch('doClaimants', null);
            this.$store.dispatch('doClaimant', null);
            this.$store.dispatch('doDefendants', null);
            this.$store.dispatch('doDefendant', null);
            

            this.$router.push(route);
        },
        async listClaimDefend(){
            var cdList = [];
            var parts = await this.$store.getters.getClaimDefends;
            await this.writeEachPart(parts, async part => {
                await this.$store.dispatch('findClaimant', part.ClaimantId);
                await this.$store.dispatch('findDefendant', part.DefendantId); 
                await this.$store.dispatch('getArbitCase', part.ArbitCaseId);

                var claimant = await this.$store.getters.getClaimant;
                var defendant = await this.$store.getters.getDefendant;
                var arbitCase = await this.$store.getters.getCase;
                
                //var listObj = {};
                var listObj = {
                            arbitCaseId: arbitCase.id,
                            claimId: claimant.id, 
                            statusId: part.StatusId,
                            status: part.status,
                            defendId: defendant.id,
                            claim:'Insured', 
                            claimantName: claimant.fullName,
                            claimContact: claimant.contactPerson,
                            defend:'Third Party',
                            defendantName: defendant.fullName,
                            defendContact: defendant.contactPerson
                            }
                            if (listObj.statusId===caseStatus.FILED){
                                listObj.filed = '(Filed)';
                            }
                cdList.push(listObj);
            });
            return cdList;
        },
        async writeEachPart(parts, callback) {
            for (var index = 0; index < parts.length; index++) {
                await callback(parts[index]);
            }
        }    
    },
    data() {
        return {
            cds: null,
            count: 0,
            head: '',
            actions: '',
            arbitUser:'',
        }
    },
    async created() {
        try {
            this.cds = await this.listClaimDefend(); 
            this.actions = this.$store.getters.getParticipantAction;
            this.arbitUser = await this.$store.getters.getArbitUser;
            
            switch(this.actions){
                case "insured":
                    this.head = 'Insured Party Action'; 
                    break;
                case "third":
                    this.head = 'Third Party Action'; 
                    break;
                 case "arbit":
                    this.head = 'Arbitrator Actions'; 
                    break;          

            }
           
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
        font-size: 18px;
    }
    .case-coys{
        font-size: 15px;
    }
    .case-amount{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>








