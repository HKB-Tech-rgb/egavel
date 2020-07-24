<template>
  <div>
    <h3 class="heading black--text">Cases Dashboard</h3>
    <v-container class="my-0" fluid>
      <div v-if="!handleView">
        <v-layout row justify-center>
          <v-flex xs12 md6 lg3>
            <v-btn @click="newCase" class="primary">New Case</v-btn>
          </v-flex>
        </v-layout>
        <br />
        <transition name="slide-fade" mode="out-in">
          <v-layout row justify-center v-if="displayMsg">
            <v-flex xs12 md6 lg3>
              <v-card style="color:black" flat>{{ displayMsg }}</v-card>
            </v-flex>
          </v-layout>
        </transition>
        <v-layout row wrap>
          <v-flex xs12 md6 lg6>
            <v-btn class="success" block>{{ colHeadCases }}</v-btn>
          </v-flex>
          <v-flex xs12 md6 lg6>
            <v-btn class="primary" block>{{ colHeadDefCases }}</v-btn>
          </v-flex>
        </v-layout>
        <div v-for="Case in cases" :key="Case.id">
          <v-layout row wrap>
            <v-flex xs12 md6 lg6>
              <v-card
                style="background-color:#FFF5cd; padding-bottom: 3px"
                v-if="Case.ArbitCase">
                <div @click="show" style="padding-bottom: 3px">
                  <div>
                      Reference#: {{ Case.id }}
                      <span>({{ Case.claimStatus }})</span>
                  </div>
                  <div>{{ Case.poc }}</div>
                  <div v-if="Case.multipleDefs>1">3rd Party Companies:
                    <span v-for="def in Case.Defendants" :key="def.id" >
                      <span class="font-italic" 
                        style="color:green">{{def.Company.name}}
                      </span>
                    </span>
                  </div>
                  <div v-else>3rd Party Company:
                    <span v-for="def in Case.Defendants" :key="def.id" >
                      <span 
                        class="font-italic"
                         style="color:green">
                          {{def.Company.name}}
                      </span>
                    </span>
                  </div>
                </div>
                <v-btn
                  style="font-size: 12px;color:black"
                  small
                  @click="displayAction(Case, 1)"
                  >view/edit/action
                </v-btn>
              </v-card>
            </v-flex>
            <v-flex xs12 md6 lg6>
              <v-card
                style="background-color:#BFEFFF; padding-bottom: 3px"
                v-if="Case.cd">
                <div  @click="show" style="padding-bottom: 3px">
                  <div>
                      Reference#: {{ Case.ArbitCaseId }}
                      <span>({{ Case.defendStatus }})</span>
                  </div>
                  <div>{{ Case.defendPoc }}</div>
                  <div>{{ insured }} <span class="font-italic" style="color:green">{{ Case.claimName }}</span>
                  </div>
                </div>  
                <v-btn
                  style="font-size: 12px;color:black;"
                  small
                  @click="displayAction(Case.cd, 0)"
                  >view/edit/action</v-btn
                >
              </v-card>
            </v-flex>
          </v-layout>
        </div>
        <div v-if="cases.length<1 && doLoad">
          <v-layout row wrap>
            <v-flex xs12 md6 lg6 >
              <v-card block style="height:80px;background-color:#FFF5cd"
                @click="show">
                    <v-card-subtitle class="headline font-italic">No Data Found</v-card-subtitle>
              </v-card>
            </v-flex>
            <v-flex xs12 md6 lg6 >
              <v-card block style="height:80px;background-color:#BFEFFF"  
                @click="show">
                  <v-card-subtitle class="headline font-italic">No Data Found</v-card-subtitle>
              </v-card>
            </v-flex>
          </v-layout>
        </div>
      </div>
      <div v-else>
        <v-layout row justify-center>
          <v-flex xs10 md8>
            <v-btn class="success" block>{{viewHeading}}</v-btn>
          </v-flex>
        </v-layout>
        <div v-if="!liabView">
          <div v-for="Case in cases" :key="Case.id" >
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-card
                  style="background-color:#FFF5cd; padding-bottom: 3px"
                  v-if="Case.ArbitCase">
                  <div @click="show" style="padding-bottom: 3px">
                    <div>
                        Reference#: {{ Case.id }}
                        <span>({{ Case.claimStatus }})</span>
                    </div>
                    <div>{{ Case.poc }}</div>
                    <div v-if="Case.multipleDefs>1">3rd Party Companies:
                      <span v-for="def in Case.Defendants" :key="def.id" >
                        <span class="font-italic" 
                          style="color:green">{{def.Company.name}}
                        </span>
                      </span>
                    </div>
                    <div v-else>3rd Party Company:
                      <span v-for="def in Case.Defendants" :key="def.id" >
                        <span 
                          class="font-italic"
                          style="color:green">
                            {{def.Company.name}}
                        </span>
                      </span>
                    </div>
                  </div>
                  <v-btn
                    style="font-size: 12px;color:black"
                    small
                    @click="displayAction(Case, 1)"
                    >view/edit/action
                  </v-btn>
                </v-card>
              </v-flex>
            </v-layout>
          </div>
        </div>
        <div v-else>
            <div v-for="Case in cases" :key="Case.id" >
              <v-layout row justify-center>
                <v-flex xs10 md8 lg6>
                  <v-card style="background-color:#BFEFFF;padding-bottom: 3px"
                     v-if="Case.cd">
                    <div  @click="show" style="padding-bottom: 3px">
                      <div>
                        Reference#: {{ Case.ArbitCaseId }}
                        <span>({{ Case.defendStatus }})</span>
                      </div>
                      <div>{{ Case.defendPoc }}</div>
                      <div>{{ insured }} <span class="font-italic" 
                         style="color:green">{{ Case.claimName }}</span>
                      </div>
                    </div>
                    <v-btn
                      style="font-size: 12px;color:black;"
                      small
                      @click="displayAction(Case.cd, 0)"
                      >view/edit/action
                    </v-btn>
                  </v-card>
                </v-flex>
              </v-layout>
            </div>
        </div>
        <div v-if="cases.length<1 && doLoad">
          <v-layout row justify-center>
            <v-flex xs10 md6>
              <v-card block style="height:80px;background-color:#FFF5cd"
                @click="show">
                    <v-card-subtitle class="headline font-italic">No Data Found</v-card-subtitle>
              </v-card>
            </v-flex>
          </v-layout>
        </div>  
      </div>
      <v-menu
        v-model="showMenu"
        :position-x="x"
        :position-y="y"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="fetch(item)">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.title"
                  name="lists"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-container>
  </div>
</template>
<script>
import caseStatus from "@/status-enums/caseStatus";
import poc from "@/status-enums/poc";

export default {
  methods: {
    async displayAction(Case, insured) {
      this.displayMsg = null;
      if (insured) {
        await this.loadCase(Case.id);
        await this.$store.dispatch("doClaimant", Case.Claimant);
        await this.$store.dispatch("doDefendant", Case.Defendants[0]);
        //console.log('claimant '+ JSON.stringify(this.$store.getters.getClaimant));
        if (Case.PocId===poc.MULTIPLE) {
          await this.loadCoDefendants(Case);
        }else{
             if (Case.claimStatusId > caseStatus.PENDINGTHIRD){
               //await this.initResoltion(Case.claimStatusId);
               await this.$store.dispatch('initDefendObjs', {
                                          "Claimant": Case.Claimant,
                                          "Defendant": Case.Defendants[0]
                                          })
             } 
            
        }
        await this.initCase();
      } else {
        this.loadCase(Case.ArbitCase.id);
        await this.loadDefendant(Case);
        await this.$store.dispatch("doClaimant", Case.ArbitCase.Claimant);
        await this.$store.dispatch('initDefendObjs', {
                                          "Claimant": Case.ArbitCase.Claimant,
                                          "Defendant": this.$store.getters.getDefendant
                                          })
        //console.log('done init claimant '+ JSON.stringify(this.$store.getters.getClaimant));
      }
      var path = insured ? "cases-create" : "def-create";

      var resolved = false;
      var claimant = await this.$store.getters.getClaimant;
      var arbitCase = this.$store.getters.getCase;
      await this.$store.dispatch('initClaimObjs', {"Case": arbitCase,
                                                     "Claimant": claimant
                                                        })

      if(arbitCase.StatusId===caseStatus.RESOLVED){
        await this.initResolution(claimant.id);
      }
      if (arbitCase.StatusId > caseStatus.PENDINGTHIRD) {
        resolved = true;
      }
      if (resolved) {
        this.$router.push({
          name: "resolve-claim"
        });
      } else {
        this.$router.push({
          name: `${path}`
        });
      }
    },
    async initResolution(claimantId) {
      var url = `/resolutions/arbitor/${claimantId}`;
      await this.$store.dispatch('findResolutions', url);

      if (await this.$store.getters.getResolutions.length > 0){
          await this.$store.dispatch('doResolution', this.$store.getters.getResolutions[0]);
          await this.$store.dispatch('doResolutionValid', true);
      }
    },
    async loadCase(caseId) {
      await this.$store.dispatch("findCase", caseId);
      await this.$store.dispatch("doClaimantValid", true);
      await this.$store.dispatch("doDefendantValid", true);
    },
    async loadDefendant(cd) {
      var defendant = {};
      defendant.id = cd.id;
      defendant.fullName = cd.fullName;
      defendant.contactPerson = cd.contactPerson;
      defendant.address = cd.address;
      defendant.telephone = cd.telephone;
      defendant.email = cd.email;
      defendant.policyNumber = cd.policyNumber;
      defendant.noticeEmailSent = cd.noticeEmailSent;
      defendant.createdAt = cd.createdAt;
      defendant.updatedAt = cd.updatedAt;
      defendant.ArbitCaseId = cd.ArbitCaseId;
      defendant.ArbitUserId = cd.ArbitUserId;
      defendant.CompanyId = cd.CompanyId;
      defendant.StatusId = cd.StatusId;

      await this.$store.dispatch("doDefendant", defendant);
    },
    async initCase(){
        await this.$store.dispatch('doLoci', null);
        await this.$store.dispatch('doCoa', null);
        await this.$store.dispatch('doMerit', null);

        await this.$store.dispatch('doQuanta', null);
        await this.$store.dispatch('doReliefSought', null);
        
        var emptyArr = [];
        await this.$store.dispatch('doLociFiles', emptyArr);
        await this.$store.dispatch('doMeritFiles', emptyArr);
        await this.$store.dispatch('doCoaFiles', emptyArr);
        await this.$store.dispatch('doQuantaFiles', emptyArr);
        await this.$store.dispatch('doReliefSoughtFiles', emptyArr);

        //valid flags
        await this.$store.dispatch('doLociStandiValid', false);
        await this.$store.dispatch('doMeritValid', false);
        await this.$store.dispatch('doCoaValid', false);
        await this.$store.dispatch('doQuantaValid', false);
        await this.$store.dispatch('doReliefSoughtValid', false);
        await this.$store.dispatch('doClaimantCaseValid', false);
    },
    async loadCoDefendants(Case) {
      var coDefendants = [];
      await Case.Defendants.forEach(defendant => {
        coDefendants.push({
          coDefendant: defendant
        });
      });
      await coDefendants.sort((a, b) => (a.id > b.id ? 1 : -1));
      await this.$store.dispatch("doCoDefendants", coDefendants);
    },
    async CreateComObjArr() {
      var cases = await this.$store.getters.getCases;
      var cDs = await this.$store.getters.getDefendCases;

      var i = 0;
      var mergedObjList = [];

      while ((cases.length > 0 ? cases[i] : null) || cDs[i]) {
        await this.mergeObjects(cases[i], cDs[i]).then(mergedObj => {
          mergedObjList.push(mergedObj);
          i++;
        });
      }
      return mergedObjList;
    },
    mergeObjects(Case, cd) {
      return new Promise((resolve, reject) => {
        resolve({
          id: Case ? Case.id : null,
          poc: Case ? Case.Poc.Description : null,
          ArbitCase: Case ? Case : null,
          coyName: Case ? Case.Defendants?Case.Defendants[0]?Case.Defendants[0].Company.name:null:null:null,
          Defendants: Case ? Case.Defendants : null,
          Claimant: Case ? Case.Claimant : null,
          claimStatus: Case
            ? Case.Claimant.Status.StatusDescription.toLowerCase()
            : null,
          PocId: Case ? Case.PocId : null,
          multipleDefs: Case ? Case.defendants?Case.Defendants.length:null: null,
          claimStatusId: Case ? Case.Claimant.StatusId : null,
          claimName: cd ? cd.ArbitCase.Claimant.Company.name : null,
          ArbitCaseId: cd ? cd.ArbitCase.id : null,
          defendName: cd ? cd.contactPerson : null,
          defendStatus: cd ? cd.Status.StatusDescription.toLowerCase() : null,
          defendPoc: cd ? cd.ArbitCase.Poc.Description : null,
          defendStatusId: cd ? cd.StatusId : null,
          cd: cd ? cd : null
        });
        if (!Case && !cd) {
          reject("Problem");
        }
      });
    },
    async listWithComment() {
      var caseList = [];
      //console.log('listWithComment '+ JSON.stringify(this.$store.getters.getCases));
      var cases = await this.$store.getters.getCases;
      await this.writeEachCase(cases, async Case => {
        //console.log('poc ' + Case.particularsOfClaim + ' id ' + Case.id);
        await this.$store.dispatch("getCoy", Case.ArbitCase.CompanyId);
        let claimantCoy = await this.$store.getters.getInsCoy.name;

        caseList.push({
          id: Case.ArbitCase.id,
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
    async newCase() {
      await this.$store.dispatch("initCase", null);
      await this.$store.dispatch("doClaimant", null);
      await this.$store.dispatch("doDefendant", null);

      this.$router.push({
        name: "arbitcases",
        params: {
          isNew: 1
        }
      });
    },
    async initvars(caseId, claimantId) {
      await this.$store.dispatch("findPocs");
      await this.$store.dispatch('doCaseValid', false);

      await this.$store.dispatch("initCaseId", caseId);
      await this.$store.dispatch("initClaimantId", claimantId);
      await this.$store.dispatch('doClaimantCaseValid', true);

      var url = `/locistatements/claimant/${claimantId}`;
      await this.$store.dispatch("findLoci", url);

      if ((await this.$store.getters.getLocis.length) > 0) {
        await this.$store.dispatch("doLoci", this.$store.getters.getLocis[0]);
        await this.$store.dispatch("doLociStandiValid", true);
        await this.$store.dispatch("doLociFiles", null);
      }

      url = `/coastatements/claimant/${claimantId}`;
      await this.$store.dispatch("findCoa", url);

      if ((await this.$store.getters.getCoas.length) > 0) {
        await this.$store.dispatch("doCoa", this.$store.getters.getCoas[0]);
        await this.$store.dispatch("doCoaValid", true);
        await this.$store.dispatch("doCoaFiles", null);
      }

      url = `/meritstatements/claimant/${claimantId}`;
      await this.$store.dispatch("findMerits", url);

      if ((await this.$store.getters.getMerits.length) > 0) {
        await this.$store.dispatch("doMerit", this.$store.getters.getMerits[0]);
        await this.$store.dispatch("doMeritValid", true);
        await this.$store.dispatch("doMeritFiles", null);
      }

      url = `/quantumstatements/claimant/${claimantId}`;
      await this.$store.dispatch("findQuantas", url);

      if ((await this.$store.getters.getQuantas.length) > 0) {
        await this.$store.dispatch(
          "doQuanta",
          this.$store.getters.getQuantas[0]
        );
        await this.$store.dispatch("doQuantaValid", true);
        await this.$store.dispatch("doQuantaFiles", null);
      }

      url = `/reliefstatements/claimant/${claimantId}`;
      await this.$store.dispatch("findReliefSought", url);

      if ((await this.$store.getters.getReliefSoughts.length) > 0) {
        await this.$store.dispatch(
          "doReliefSought",
          this.$store.getters.getReliefSoughts[0]
        );
        await this.$store.dispatch("doReliefSoughtValid", true);
        await this.$store.dispatch("doReliefSoughtFiles", null);
      }
    },
    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;

      this.$nextTick(() => {
        this.showMenu = true;
      });
    },
    async fetch(item) {
      this.items=[];
      this.$store.dispatch('doViewStatus', item.val) 
      //console.log('ViewStat '+ item.val);
      if (item.val > 0) {
        var url = `claimcases/${this.arbitUser.id}/${item.val}`;
        await this.$store.dispatch("getUserCases", url);

        url = `defendants/allcases/${this.arbitUser.id}/${item.val}`;
        await this.$store.dispatch("findDefendCases", url);
        await this.searchOnStatus(item.val);
      } else {
        url = `claimcases/${this.arbitUser.id}`;
        await this.$store.dispatch("getUserCases", url);

        url = `defendants/allcases/${this.arbitUser.id}`;
        await this.$store.dispatch("findDefendCases", url);
        await this.defaultCurrent();
      }
      this.cases = await this.CreateComObjArr();
      for(var j=0;j<this.cases.length;j++){
        if (this.cases[j].cd) {
           this.insured = "Insured Company: ";
           this.tp = "Third Party contact:";
           break
        }
      }
    },
    searchOnStatus(statusId) {
      switch (statusId) {
        case caseStatus.OFFERTOSETTLE:
          this.items.push({
            val: 0,
            title: " Process Current Actions ",
            icon: "mdi-view-list"
          });
          this.items.push({
            val: caseStatus.RESOLVED,
            title: " View Resolved Actions ",
            icon: "mdi-view-list"
          });
          break;
        case caseStatus.RESOLVED:
          this.items.push({
            val: 0,
            title: " Process Current Actions ",
            icon: "mdi-view-list"
          });
          this.items.push({
            val: caseStatus.OFFERTOSETTLE,
            title: " View Offers to Settle ",
            icon: "mdi-view-list"
          });
          break;
      }
    },
    defaultCurrent() {
      this.items.push({
        val: caseStatus.RESOLVED,
        title: " View Resolved Actions ",
        icon: "mdi-view-list"
      });
      this.items.push({
        val: caseStatus.OFFERTOSETTLE,
        title: " View Offers to Settle ",
        icon: "mdi-view-list"
      });
    }
  },
  data() {
    return {
      cases: [],
      arbitUser: {},
      colHeadCases: "",
      colHeadDefCases: "",
      insured: "",
      tp: "",
      displayMsg: null,
      resolved: false,
      showMenu: false,
      x: 0,
      y: 0,
      items: [],
      item: 1,
      doLoad: null,
      isMobileDevice: false,
      mobileHead: this.liabView?'Liabilities':'Recoveries'
    };
  },
  computed:{
    handleView(){
      return this.$store.getters.isMobileDevice
    },
    viewHeading(){
      return this.liabView?'Liabilities':'Recoveries'
    }
  },
  props: {
    liabView: {
      type: Boolean,
      value: false
    }
  },
  async mounted() {
    try {
      this.arbitUser = await this.$store.getters.getArbitUser;
      await this.$store.dispatch("getAllCoys");
      var statusId = this.$store.getters.getViewStatus
      
      if (statusId > 0) {
        var url = `claimcases/${this.arbitUser.id}/${statusId}`;
        await this.$store.dispatch("getUserCases", url);

        url = `defendants/allcases/${this.arbitUser.id}/${statusId}`;
        await this.$store.dispatch("findDefendCases", url);
        await this.searchOnStatus(statusId);
      } else {
        url = `claimcases/${this.arbitUser.id}`;
        await this.$store.dispatch("getUserCases", url);

        url = `defendants/allcases/${this.arbitUser.id}`;
        await this.$store.dispatch("findDefendCases", url);
        await this.defaultCurrent();
      }
      this.doLoad=true;
      this.cases = await this.CreateComObjArr();
      this.colHeadCases = "Recoveries";
      this.colHeadDefCases = "Liabilities";

      if (this.cases.length < 1) {
        this.colHeadCases = "Create Case click above";
      } else {
        for(var j=0;j<this.cases.length;j++){
          if (this.cases[j].cd) {
             this.insured = "Insured Company: ";
             this.tp = "Third Party contact:";
             break
          }
        }
      }
      this.displayMsg = this.$route.params.mailMsg;
      this.isMobileDevice = this.$store.getters.isMobileDevice

    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style scoped>
.case {
  padding: 20px;
  height: 200px;
  overflow: hidden;
  text-align: center;
}
.case-particulars {
  font-size: 20px;
}
.case-coys {
  font-size: 16px;
}
.case-amount {
  font-size: 14px;
}
.al-img {
  width: 70%;
  margin: 0 auto;
}

.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}
</style>
