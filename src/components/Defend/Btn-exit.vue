<template>
  <v-btn class="exitBtn" text small @click="navigateTo">
    exit third party wizard
  </v-btn>
</template>
<script>
export default {
  methods: {
    async navigateTo() {
      await this.clearCounterClaim();
      await this.$store.dispatch("fixStep", 1);

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
    async clearCounterClaim() {
      await this.$store.dispatch("doCcCoaFiles", []);
      await this.$store.dispatch("doCcQuantaFiles", []);
      await this.$store.dispatch("doCcMeritFiles", []);
      await this.$store.dispatch("doCcReliefFiles", []);

      await this.$store.dispatch("doCcCoa", null);
      await this.$store.dispatch("doCcQuanta", null);
      await this.$store.dispatch("doCcMerit", null);
      await this.$store.dispatch("doCcRelief", null);

      await this.$store.dispatch("doCcCoas", []);
      await this.$store.dispatch("doCcQuantas", []);
      await this.$store.dispatch("doCcMerits", []);
      await this.$store.dispatch("doCcReliefs", []);

      await this.$store.dispatch("doCcCoaValid", false);
      await this.$store.dispatch("doCcQuantaValid", false);
      await this.$store.dispatch("doCcMeritValid", false);
      await this.$store.dispatch("doCcReliefValid", false);
    }
  }
};
</script>
<style scoped>
.exitBtn {
  background-color: #bcaaa4 !important;
  color: #fff !important;
}
</style>
