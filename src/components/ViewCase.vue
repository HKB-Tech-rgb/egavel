<template>
    <div class="dashboard">
        <h1 class="subheading black--text" >Dashboard</h1>
        <v-container class="my-0">
            <v-layout row wrap>
                <v-flex xs12 md6 lg6>
                    <v-btn @click="combine" class="success" block>Merge</v-btn>
                </v-flex> 
                <v-flex xs12 md6 lg6>
                    <v-btn @click="combine" class="primary" block>Merge as well</v-btn>
                </v-flex> 
            </v-layout>
            <div v-for="Case in cases" :key="Case.id">
                <v-layout row wrap>
                    <v-flex xs12 md6 lg6>
                        <v-card>
                            <div> {{Case.text}}</div>
                            <div> {{ Case.like }}</div>
                        </v-card>
                        <v-btn text small color="light blue">view/edit</v-btn>
                    </v-flex>
                    <v-flex xs12 md6 lg6>
                        <v-card>
                            <div>{{Case.sport}}</div> 
                            <div>{{Case.play}}</div>
                        </v-card>
                        <v-btn text small v-if=Case.sport>view/edit</v-btn>
                    </v-flex>
                </v-layout>
            </div>
        </v-container>
    </div>
</template>
<script>
//import Panel from './Panel'
 
export default {
    data () {
        return{
            arr1:[{ text:"Learn JavaScript",like:'kool'},
                  { text:"Learn Vue",like:"Rool"},
                  { text:"Play around in JSFiddle",like:"Fool"},
                  { text:"Build something awesome",like:"Tool"} 
                ],
            arr2:[{sport:"Soccer",play:"No play"},{sport:"squash",play:'Yes Play'}],
            cases: []
        }
    },
    
    components:{
        //Panel
    },
    methods: {
        async CreateComObjArr(){
            var cases = await this.arr1;
            var cDs =  await this.arr2;
            
            var i = 0;
            var mergedObjList = [];
            
            while (cases[i] || cDs[i]){
                
                await this.mergeObjects(cases[i], cDs[i], i).then((mergedObj) => {
                    mergedObjList.push(mergedObj);
                    i++;
                });
            }
            mergedObjList.sort((a, b) => {return (a.id > b.id) ? 1 : -1});
            //console.log('mergelist '+ JSON.stringify(mergedObjList));
            return mergedObjList;
        },
        mergeObjects(Case, cd, i) {
            return new Promise((resolve, reject) => {
                resolve(
                        {
                            id: i,
                            text: (Case) ?  Case.text : null,
                            like: (Case) ? Case.like : null,
                            sport: (cd) ? cd.sport : null,
                            play: (cd) ? cd.play : null 
                        });
                if (!Case && !cd){ reject('Problem')}        

            });
            
        },
        async listCases(cases){
            var caseList = [];
            await this.writeEachCase( cases, async Case => {
                
                caseList.push({
                                caseObj:Case.caseObj, 
                                cdObj: Case.cdObj
                            });
            });
            return caseList;

        },
        async writeEachCase(cases, callback) {
            for (var index = 0; index < cases.length; index++) {
                await callback(cases[index]);
            }
        },
        async combine(){
            this.cases = await this.CreateComObjArr();
            //console.log('caseslist '+ JSON.stringify(this.cases));
        }
    },
    
}
</script>
<style scoped>
    .case{
        padding: 20px;
        height: 200px;
        overflow: hidden;
        text-align: center;
    }
    .case-claimNumber{
        font-size: 16px;
    }
    .case-policyNumber{
        font-size: 24px;
    }
    .song-genre{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>

