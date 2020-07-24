<template>    
    <div class="dashboard">
        <h3 class="heading black--text" >Cases Dashboard</h3>
        <v-container class="my-0" fluid>
            <v-layout row wrap>
                <v-flex xs12 md6 lg6>
                    <v-btn @click="newCase" class="success" block>{{colHeadCases}}</v-btn>
                </v-flex> 
                <v-flex xs12 md6 lg6>
                    <v-btn class="primary" block @click="goHome">{{colHeadDefCases}}</v-btn>
                </v-flex> 
            </v-layout>
            <div v-for="Case in cases" :key="Case.id">
                <v-layout row wrap>
                    <v-flex xs12 md6 lg6>
                        <v-card style="background-color:#FFF5cd">
                            <div>{{Case.id}}</div>
                            <div>{{Case.poc}}</div>
                            <div>{{Case.coyName}}</div>
                            <v-btn style="font-size: 12px" small @click="existingCase(Case.id)">view/edit/action</v-btn>
                        </v-card>
                    </v-flex>
                    <v-flex xs12 md6 lg6>
                        <v-card style="background-color:#BFEFFF" v-if="Case.ArbitCaseId">
                            <div>{{Case.ArbitCaseId}}</div>
                            <div>{{insured}} {{Case.claimName}}
                                 <span v-if="Case.defendStatusId > 1">(Defense {{Case.defendStatus}})</span>
                            </div>
                            <div>{{tp}} {{Case.defendName}}</div>
                            <v-btn style="font-size: 12px" small @click="thirdParty(Case)" >view/edit/action</v-btn>
                        </v-card>
                    </v-flex>
                </v-layout>
            </div>
        </v-container>
    </div>
</template>

<script>
import userRoles from '@/status-enums/roletypes';
import caseStatus from '@/status-enums/caseStatus'

export default {
    methods:{
        async navigateTo (c_ase){
            if (c_ase == 'new'){
                await this.$store.dispatch('initCase', null).then(() => {
                    this.$router.push({
                        name: 'arbitcases',
                        params:{
                            isNew: 1
                        }
                    });
              });
            }else{
                if (this.arbitUser.UserRoleId==userRoles.ARBITOR){
                        var url = `claimdefs/caseid/${c_ase}`;
                        await this.$store.dispatch("findPartsByCaseId", url);
                        await this.$store.dispatch('doParticipantAction', 'arbit');
                        await this.$store.dispatch('initCaseId', c_ase);
                        await this.$store.dispatch("getArbitCase", c_ase);
                        this.$router.push({
                            name:'claimdefend'
                        });
                     
                }else{
                     this.$router.push({name: 'arbit-case',
                                 params:{
                                     isNew: 0,
                                     caseId: c_ase
                                }
                             });
                 }
            }
            
        },
        async thirdParty(Case){
            await this.$store.dispatch('initCase', Case.Case);
            await this.$store.dispatch('doClaimant', Case.Claimant);
            await this.$store.dispatch('doDefendant', Case.Defendant);

            var claimant = await this.$store.getters.getClaimant;
            var defendant = await this.$store.getters.getDefendant;
            var resolved = false;
            await this.initvars(Case);
            if (claimant.StatusId===caseStatus.RESOLVED &&  defendant.StatusId===caseStatus.RESOLVED){
                resolved = await true;
            }
            if (resolved){
                this.$router.push({
                        name: 'resolve-claim',
                });
            }else{
                this.$router.push({
                        name: 'def-create'
                        });
            }
                        
        },
        async CreateComObjArr(){
            var cases = await this.$store.getters.getCases;
            var cDs =  await this.$store.getters.getClaimDefends;
            
            var i = 0;
            var mergedObjList = [];

            while (cases[i] || cDs[i]){
                await this.mergeObjects(cases[i], cDs[i]).then((mergedObj) => {
                    mergedObjList.push(mergedObj);
                    i++;
                });
            }
            return mergedObjList;
        },
        mergeObjects(Case, cd) {
            return new Promise((resolve, reject) => {
                resolve({
                        id: (Case) ? Case.id:null,
                        poc:(Case) ? Case.particularsOfClaim: null,
                        Case: (Case) ? Case: null,
                        coyName:(Case) ? Case.Company.name:null,
                        ArbitCaseId: (cd) ? cd.ArbitCaseId: null,
                        defendName:(cd) ? cd.Defendant.fullName: null,
                        claimName:(cd) ? cd.Claimant.fullName: null,
                        Defendant: (cd) ? cd.Defendant: null,
                        Claimant: (cd) ? cd.Claimant: null,
                        defendStatus: (cd) ? cd.Defendant.Status.StatusDescription.toLowerCase():null,
                        defendStatusId: (cd) ? cd.Defendant.StatusId:null
                       
                });
                if (!Case && !cd){ reject('Problem')}        

            });
            
        },
        goHome(){
            this.$router.push('/home');
        },
        async listCases(cases){
            var caseList = [];
            await this.writeEachCase( cases, async Case => {
                //console.log('poc ' + Case.particularsOfClaim + ' id ' + Case.id);
                await this.$store.dispatch('getCoy', Case.caseObj.coyId);
                let coyName = await this.$store.getters.getInsCoy.name;

                await this.$store.dispatch('getCoy', Case.cdObj.coyId);
                coyName = await this.$store.getters.getInsCoy.name;
                //await this.$store.dispatch('getCoy', Case.defendantCoy);
                //let defendantCoy = this.$store.getters.getInsCoy.name;

                caseList.push({caseId: Case.caseObj.id, 
                               poc: Case.caseObj.particularsOfClaim,
                               coyName: coyName,
                               thirdCoy: 'foo'
                              });
            });
            return caseList;

        },
        async listWithComment(){
            var caseList = [];
            //console.log('listWithComment '+ JSON.stringify(this.$store.getters.getCases));
            var cases =  await this.$store.getters.getCases;
            await this.writeEachCase( cases, async Case => {
                //console.log('poc ' + Case.particularsOfClaim + ' id ' + Case.id);
                await this.$store.dispatch('getCoy', Case.ArbitCase.CompanyId);
                let claimantCoy = await this.$store.getters.getInsCoy.name;
               
                caseList.push({id: Case.ArbitCase.id, 
                               poc: Case.ArbitCase.particularsOfClaim,
                               claimantCoy: claimantCoy,
                               comment: Case.comments
                              });
            });
            return caseList;
        },
        async writeEachCase(cases, callback) {
            for (var index = 0; index < cases.length; index++) {
                await callback(cases[index]);
            }
        },
        newCase(){
            this.$router.push({
                name:'arbitcases',
                    params:{
                    isNew: 1
                }
                
            });  
        },
        async existingCase(caseId){
            try{
                this.$router.push({
                    name:'case-view',
                    params: {
                        caseId: caseId 
                    }
                });
            }catch(err){
                console.log('Cases component - existingCase '+ err);
            }
        },
        async initvars(Case){
            var claimantId = Case.Claimant.id;
            var defendantId = Case.Defendant.id;

            await this.$store.dispatch('initCaseId', Case.Case.id); 
            await this.$store.dispatch('initClaimantId', claimantId); 
            await this.$store.dispatch('initDefendantId', defendantId);
                                   
            var url = `/locistatements/claimant/${claimantId}/${defendantId}`
            await this.$store.dispatch('findLoci', url);
            
            if (await this.$store.getters.getLocis.length > 0){
                await this.$store.dispatch('doLoci', this.$store.getters.getLocis[0]);
            }

            url = `/coastatements/claimant/${claimantId}/${defendantId}`;
            await this.$store.dispatch('findCoa', url);

            if (await this.$store.getters.getCoas.length > 0){
                await this.$store.dispatch('doCoa', this.$store.getters.getCoas[0]);
            }

            url = `/meritstatements/claimant/${claimantId}/${defendantId}`;
            await this.$store.dispatch('findMerits', url);

            if (await this.$store.getters.getMerits.length > 0){
                await this.$store.dispatch('doMerit', this.$store.getters.getMerits[0]);
            }

            url = `/quantumstatements/claimant/${claimantId}/${defendantId}`;
            await this.$store.dispatch('findQuantas', url);

            if (await this.$store.getters.getQuantas.length > 0){
                await this.$store.dispatch('doQuanta', this.$store.getters.getQuantas[0]);
            }

            url = `/reliefstatements/claimant/${claimantId}/${defendantId}`;
            await this.$store.dispatch('findReliefSought', url);

            if (await this.$store.getters.getReliefSoughts.length > 0){
                await this.$store.dispatch('doReliefSought', this.$store.getters.getReliefSoughts[0]);
            }
        }
    },
    data() {
        return {
            cases: [],
            arbitUser:{},
            colHeadCases:'',
            colHeadDefCases:'',
            insured:'',
            tp:''
        }
    },
    
    async mounted() {
        try {
            //const coyId = this.$route.params.coyId;
            this.arbitUser = await this.$store.getters.getArbitUser;
            await this.$store.dispatch("getAllCoys");
            
            switch(this.arbitUser.UserRoleId){
                case 1: //userRoles.PARTICIPANT:
                    var url = '/cases';
                    await this.$store.dispatch('getUserCases', url);
            
                    url = `claimdefs/defendant/${this.arbitUser.CompanyId}`
                    await this.$store.dispatch("findPartsByCaseId", url);
                    //url = `cases/${coyId}`;
                     break;
                case 2://userRoles.ARBITOR
                     url = `arbitallocs/${this.arbitUser.id}`;
                     await this.$store.dispatch("getUserCases", url);
                     break;  
                case 3://userRoles.ADMIN
                     url = 'opencases';
                     await this.$store.dispatch("getUserCases", url);
                     break;          
            }
            

            if (this.arbitUser.UserRoleId===userRoles.ARBITOR){
                this.cases = await this.listWithComment();     
            }else{
                //this.cases = await this.listWithCoyDesc();
                this.cases = await this.CreateComObjArr();
            }
            this.colHeadCases = 'Cases list - click to create new';
            this.colHeadDefCases = 'No Third party actions for your company-click to exit';

            if (this.cases.length < 1){
                this.colHeadCases = 'Click to create new Case';
            }else{
                if (!this.cases[0].ArbitCaseId==''){
                    this.colHeadDefCases = `${this.arbitUser.Company.name} third party actions-click to exit`;
                    this.insured = 'Insured:';
                    this.tp = 'Third Party:';
                }
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
        font-size: 20px;
    }
    .case-coys{
        font-size: 16px;
    }
    .case-amount{
        font-size: 14px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>



