<template>
  <div class="dashboard">
    <h3 class="heading black--text">Allocate Commissioner</h3>
    <v-container fluid>
      <v-layout row class="my-2" justify-center>
        <v-flex xs12 md6 lg6>
          <v-btn class="primary" block>Allocations</v-btn>
        </v-flex>
      </v-layout>
      <div v-for="Case in cases" :key="Case.id">
        <v-layout row justify-center>
          <v-flex xs12 md6 lg6>
            <v-card class="justify-center" style="background-color:#BFEFFF">
              <div>
                Reference#: {{ Case.id }}
                <span>({{ Case.claimStatus }})</span>
              </div>
              <div>
                {{ Case.poc }}
              </div>
              <div>Insured: {{ Case.claimName }}</div>
              <v-btn
                style="font-size: 12px"
                small
                @click="allocCase(Case.fullRec)"
                >allocate</v-btn
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
import poc from "@/status-enums/poc";
export default {
  methods: {
    exitView() {
      this.$router.push("/home");
    },
    async allocCase(Case) {
      await this.$store.dispatch("getAllCoys");
      await this.$store.dispatch("initCase", Case);
      await this.$store.dispatch("findPocs");

      var url = "arbitrators";
      await this.$store.dispatch("findCoyUsers", url);
      await this.$store.dispatch("doClaimant", Case.Claimant);
      var claimant = this.$store.getters.getClaimant;
      await this.findDefendants();

      if (Case.PocId < poc.MULTIPLE) {
        var defend = this.$store.getters.getDefendants[0];
        await this.$store.dispatch("doDefendant", defend);
        await this.initDefense(defend);
      }
      await this.initvars(Case.id, claimant.id);

      this.$router.push({
        name: "arbit-case",
        params: {
          isNew: 0,
          caseId: Case.id
        }
      });
    },
    async findDefendants() {
      var url = `defendants/coy/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants createArbitCase " + err);
      }
    },
    async initDefense(defend) {
      await this.$store.dispatch("getAllCoys");

      await this.$store.dispatch("doSettle", null);
      await this.$store.dispatch("doDefense", null);
      await this.$store.dispatch("doSettleFiles", []);
      await this.$store.dispatch("doDefenseFiles", []);

      await this.$store.dispatch("initDefendObjs", {
        Defendant: defend
      });
    },
    async initvars(caseId, claimantId) {
      await this.$store.dispatch("findPocs");

      await this.$store.dispatch("initCaseId", caseId);
      await this.$store.dispatch("initClaimantId", claimantId);

      await this.$store.dispatch("initClaimObjs", {
        Case: this.$store.getters.getCase,
        Claimant: this.$store.getters.getClaimant
      });
    },
    async listCurrentActions() {
      var caseList = [];

      var cases = await this.$store.getters.getClaimDefends;
      //console.log('cases '+ JSON.stringify(cases));
      await this.writeEachCase(cases, async Case => {
        caseList.push({
          id: Case.id,
          claimName: Case.Claimant.fullName,
          poc: Case.Poc.Description,
          claimStatus: Case.Status.StatusDescription.toLowerCase(),
          claimStatusId: Case.Claimant.StatusId,
          fullRec: Case
        });
      });
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
    var url = "pendingarbit";
    await this.$store.dispatch("findPendArbit", url);

    this.cases = await this.listCurrentActions();
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
</style>
