<template>
  <v-btn class="exitBtn" text small @click="navigateTo">
    exit Counter Claim wizard
  </v-btn>
</template>
<script>
//import caseStatus from "@/status-enums/caseStatus.js";
export default {
  methods: {
    navigateTo() {
      this.$store.dispatch("fixStep", 6);
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    getStep() {
      return "grey";
    },
    getColor() {
      return "black";
    },
    async initVars() {
      var claimant = await this.$store.getters.getClaimant;
      var defendant = await this.$store.getters.getDefendant;
      var arbitCase = await this.$store.getters.getCase;

      var claimantId = claimant.id;
      var defendantId = defendant.id;

      await this.$store.dispatch("initCaseId", arbitCase.id);
      await this.$store.dispatch("initClaimantId", claimantId);
      await this.$store.dispatch("initDefendantId", defendantId);
    }
  },
  async beforeDestroy() {
    //console.log('beforeDestroy '+ JSON.stringify(this.$store.getters.getCounterClaim));
    await this.initVars();
  }
};
</script>
<style scoped>
.exitBtn {
  background-color: #bcaaa4 !important;
  color: #fff !important;
}
</style>
