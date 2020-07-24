<template>
  <v-btn class="exitBtn" text small @click="navigateTo">
    exit multi defendant wizard
  </v-btn>
</template>
<script>
export default {
  methods: {
    navigateTo() {
      var defs = [];
      defs = this.$store.getters.getDefendants;
      if (defs.length > 0) {
        this.$store.dispatch("doDefendantValid", true);
      } else {
        this.$store.dispatch("doDefendantValid", false);
      }
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    getStep() {
      return "grey";
    },
    getColor() {
      return "black";
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
