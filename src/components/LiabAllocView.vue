<template>
  <div class="dashboard">
    <h3 class="heading black--text">Liabilities Allocation Dashboard</h3>
    <v-container class="my-0" fluid>
      <br />
      <transition name="slide-fade" mode="out-in">
        <v-layout row justify-center v-if="displayMsg">
          <v-flex xs12 md6 lg3>
            <v-card style="color:black" flat>{{ displayMsg }}</v-card>
          </v-flex>
        </v-layout>
      </transition>
      <v-layout row justify-center>
        <v-flex xs12 md6 lg6>
          <v-btn class="success" block>{{ colHeadCases }}</v-btn>
        </v-flex>
      </v-layout>
      <div v-for="Case in cases" :key="Case.id">
        <v-layout row justify-center>
          <v-flex xs12 md6 lg6>
            <v-card style="background-color:#BFEFFF" v-if="Case.cd">
              <div>
                Case#: {{ Case.ArbitCaseId }}
                <span>({{ Case.defendStatus }})</span>
              </div>
              <div>{{ Case.defendPoc }}</div>
              <div>{{ insured }} {{ Case.claimName }}</div>
              <v-btn
                style="font-size: 12px"
                small
                @click="displayAction(Case.cd)"
                >Allocate</v-btn
              >
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <v-btn style="font-size: 12px" small @click="viewCase(Case.cd)"
                  >View Case</v-btn
                >
              </span>
            </v-card>
          </v-flex>
        </v-layout>
      </div>
    </v-container>
  </div>
</template>
<script>
import userRoles from "@/status-enums/roletypes";
import poc from "@/status-enums/poc";

export default {
  methods: {
    async displayAction(Case) {
      this.displayMsg = "";
      await this.loadDefendant(Case);
      await this.$store.dispatch("initCase", Case.ArbitCase);

      var path = "allocuser";
      this.$router.push({
        name: `${path}`
      });
    },
    async viewCase(Case) {
      this.displayMsg = "";
      await this.loadDefendant(Case);
      await this.$store.dispatch("initCase", Case.ArbitCase);

      var claimantId = Case.ArbitCase.ClaimantId;
      await this.$store.dispatch("findClaimant", claimantId);

      await this.$store.dispatch("initClaimObjs", {
        Case: await this.$store.getters.getCase,
        Claimant: await this.$store.getters.getClaimant
      });
      var arbitCase = await this.$store.getters.getCase;
      if (arbitCase.PocId === poc.MULTIPLE) {
        var url = `defendants/case/${this.$store.getters.getCase.id}`;
        var defends = await this.$store.dispatch("findDefendants", url);
        await this.loadCoDefendants(defends);
      }
      this.$router.push({
        name: "cases-create"
      });
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
    async loadCoDefendants(defends) {
      var coDefendants = [];

      await defends.forEach(defendant => {
        coDefendants.push({
          coDefendant: defendant
        });
      });
      await coDefendants.sort((a, b) => (a.id > b.id ? 1 : -1));
      await this.$store.dispatch("doCoDefendants", coDefendants);
      await this.$store.dispatch("doDefendants", coDefendants);
    },
    async CreateComObjArr() {
      var cDs = await this.$store.getters.getDefendCases;

      var i = 0;
      var mergedObjList = [];

      while (cDs[i]) {
        await this.mergeObjects(cDs[i]).then(mergedObj => {
          mergedObjList.push(mergedObj);
          i++;
        });
      }
      return mergedObjList;
    },
    mergeObjects(cd) {
      return new Promise((resolve, reject) => {
        resolve({
          claimName: cd ? cd.ArbitCase.Claimant.contactPerson : null,
          ArbitCaseId: cd ? cd.ArbitCase.id : null,
          defendName: cd ? cd.contactPerson : null,
          defendStatus: cd ? cd.Status.StatusDescription.toLowerCase() : null,
          defendPoc: cd ? cd.ArbitCase.Poc.Description : null,
          defendStatusId: cd ? cd.StatusId : null,
          cd: cd ? cd : null
        });
        if (!cd) {
          reject("Problem");
        }
      });
    },
    goHome() {
      this.$router.push("/home");
    }
  },
  data() {
    return {
      cases: [],
      arbitUser: {},
      colHeadCases: "",
      colHeadDefCases: "",
      insured: "",
      displayMsg: "",
      tp: ""
    };
  },
  async mounted() {
    try {
      this.arbitUser = await this.$store.getters.getArbitUser;
      switch (this.arbitUser.role.id) {
        case userRoles.COYADMIN: //userRoles.Company ADMIN
          var url = `defendants/liab/${this.arbitUser.CompanyId}`;
          await this.$store.dispatch("findDefendCases", url);
          break;
      }
      this.cases = await this.CreateComObjArr();
      this.colHeadCases = "Liabilities";
      this.insured = "Insured contact: ";

      this.displayMsg = this.$route.params.mailMsg;
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
