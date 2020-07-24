<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      Counter Claim
    </v-btn>
  </div>
</template>
<script>
import caseModels from "@/status-enums/tables.js";
export default {
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 4) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 4) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "white";
      }
      return "black";
    }
  },
  methods: {
    sendEvent() {
      this.$router.push({
        name: "counterClaim"
      });
    },
    async loadCounterClaim(defendId) {
      var findObj = {
        url: `coastatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERCOA
      };
      await this.$store.dispatch("findObj", findObj);

      if ((await this.$store.getters.getCcCoas.length) > 0) {
        await this.$store.dispatch("doCcCoa", this.$store.getters.getCcCoas[0]);
        await this.$store.dispatch("doCcCoaValid", true);
      }
      findObj = {
        url: `meritstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERMERIT
      };
      await this.$store.dispatch("findObj", findObj);

      if ((await this.$store.getters.getCcMerits.length) > 0) {
        await this.$store.dispatch(
          "doCcMerit",
          this.$store.getters.getCcMerits[0]
        );
        await this.$store.dispatch("doCcMeritValid", true);
      }
      findObj = {
        url: `quantumstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERQUANTA
      };
      await this.$store.dispatch("findObj", findObj);

      if ((await this.$store.getters.getCcQuantas.length) > 0) {
        await this.$store.dispatch(
          "doCcQuanta",
          this.$store.getters.getCcQuantas[0]
        );
        await this.$store.dispatch("doCcQuantaValid", true);
      }
      findObj = {
        url: `reliefstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERRELIEF
      };
      await this.$store.dispatch("findObj", findObj);

      if ((await this.$store.getters.getCcReliefs.length) > 0) {
        await this.$store.dispatch(
          "doCcRelief",
          this.$store.getters.getCcReliefs[0]
        );
        await this.$store.dispatch("doCcReliefValid", true);
      }
    }
  },
  async created() {
    await this.$store.dispatch(
      "initDefendantId",
      await this.$store.getters.getDefendant.id
    );
    await this.loadCounterClaim(this.$store.getters.getDefendantId);
  }
};
</script>
