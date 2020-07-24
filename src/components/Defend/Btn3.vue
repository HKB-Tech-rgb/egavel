<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      View Case
    </v-btn>
  </div>
</template>
<script>
export default {
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 3) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 3) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "white";
      }
      return "black";
    }
  },
  methods: {
    async sendEvent() {
      if (!this.$store.getters.getLoci) {
        await this.$store.dispatch("initClaimObjs", {
          Case: await this.$store.getters.getCase,
          Claimant: await this.$store.getters.getClaimant
        });
      }
      this.$router.push({
        name: "def-view"
      });
    }
  }
};
</script>
