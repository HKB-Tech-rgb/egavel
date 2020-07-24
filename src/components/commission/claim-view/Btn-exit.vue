<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    text
    small
    @click="navigateTo"
  >
    exit view claimant wizard
  </v-btn>
</template>
<script>
export default {
  methods: {
    navigateTo() {
      this.$store.commit("setStep", 4);
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
      /*
            this.$router.push({
                name: 'resolve-claim'});*/
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
