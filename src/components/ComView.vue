<template>
  <div class="dashboard">
    <h3 class="heading black--text">Commissioner Dashboard</h3>
    <v-container fluid>
      <transition name="slide-fade" mode="out-in">
        <v-layout row justify-center v-if="displayMsg">
          <v-flex xs12 md6 lg3>
            <v-card style="color:black" flat>{{ displayMsg }}</v-card>
          </v-flex>
        </v-layout>
      </transition>
      <v-layout row class="my-2" justify-center>
        <v-flex xs12 md8 lg8>
          <v-app-bar>
            <v-toolbar-title
              class="ml-2"
              dark
              style="font-size: 16px;flex-basis: 70%"
            >
              <v-btn style="color: blue" block>Resolutions </v-btn>
            </v-toolbar-title>
            <v-toolbar-title class="ml-5 pl-3">
              <router-link to="/sign" style="color:blue; font-size: 16px"
                >create signature</router-link
              >
            </v-toolbar-title>
          </v-app-bar>
        </v-flex>
      </v-layout>
      <div v-for="Case in cases" :key="Case.id">
        <v-layout row justify-center>
          <v-flex xs12 md8 lg8>
            <v-card class="justify-center" style="background-color:#BFEFFF">
              <div>
                Reference#: {{ Case.id }}
                <span>-- ({{ Case.status }})</span>
              </div>
              <div>{{ Case.poc }}</div>
              <div>Insured policy holder: {{ Case.holder }}</div>
              <div>Comments: {{ Case.comments }}</div>
              <v-btn
                style="font-size: 12px"
                small
                @click="resolveCase(Case.arbitCase)"
                >view/resolve</v-btn
              >
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
  </div>
</template>
<script>
import caseStatus from "@/status-enums/caseStatus";
import caseModels from "@/status-enums/tables.js";
export default {
  methods: {
    exitView() {
      this.$router.push("/home");
    },
    async resolveCase(Rec) {
      this.displayMsg = null;
      await this.$store.dispatch("getAllCoys");
      await this.$store.dispatch("initCase", Rec.ArbitCase);

      var url = `/defendants/case/${Rec.ArbitCaseId}`;
      await this.$store.dispatch("findDefendants", url);
      var defendants = this.$store.getters.getDefendants;

      await this.$store.dispatch("doClaimant", Rec.ArbitCase.Claimant);
      await this.$store.dispatch("doDefendant", defendants[0]);
      await this.$store.dispatch("findPocs");
      await this.$store.dispatch("findJurisdictions");

      await this.$store.dispatch("initClaimObjs", {
        Case: this.$store.getters.getCase,
        Claimant: this.$store.getters.getClaimant
      });
      await this.$store.dispatch("initDefendObjs", {
        Defendant: this.$store.getters.getDefendant
      });
      await this.initResolution(this.$store.getters.getCase.id);
      this.$router.push({ name: "resolve-claim" });
    },
    async initResolution(arbitCaseId) {
      var findObj = {
        url: `/resolutions/arbitor/${arbitCaseId}`,
        id: caseModels.RESOLUTION
      };
      await this.$store.dispatch("findObj", findObj);

      if ((await this.$store.getters.getResolutions.length) > 0) {
        await this.$store.dispatch(
          "doResolution",
          this.$store.getters.getResolutions[0]
        );
        await this.$store.dispatch("doResolutionValid", true);
      }
    },
    async listCurrentActions() {
      var caseList = [];

      var cases = await this.$store.getters.getCases;

      await this.writeEachCase(cases, async Case => {
        //console.log('poc ' + Case.particularsOfClaim + ' id ' + Case.id);
        caseList.push({
          id: Case.ArbitCaseId,
          poc: Case.ArbitCase.Poc.Description,
          status: Case.ArbitCase.Status.StatusDescription,
          holder: Case.ArbitCase.Claimant.fullName,
          comments: Case.comments,
          arbitCase: Case
        });
      });
      //console.log('listCurrentActions '+ JSON.stringify(caseList));
      return caseList;
    },
    async writeEachCase(cases, callback) {
      for (var index = 0; index < cases.length; index++) {
        await callback(cases[index]);
      }
    }
  },
  data() {
    return {
      cases: null,
      poc: "",
      caseId: 0,
      originCoy: "",
      arbitCase: null,
      displayMsg: null,
      thirdPartyHead: "Third Party Actions -- ",
      updTitle: "Click to update",
      status: caseStatus.OPENED
    };
  },
  computed: {
    arbitUser() {
      return this.$store.getters.getArbitUser;
    }
  },
  async created() {
    var url = `arbitallocs/${this.arbitUser.id}`;
    await this.$store.dispatch("getUserCases", url);

    this.cases = await this.listCurrentActions();
    this.displayMsg = this.$route.params.mailMsg;
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
  font-size: 30px;
}
.case-coys {
  font-size: 24px;
}
.case-amount {
  font-size: 18px;
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
