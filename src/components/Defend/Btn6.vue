<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Counter Claim
  </v-btn>
</template>
<script>
import caseModels from "@/status-enums/tables.js";
export default {
  data: () => ({
    dialogData: {
      modalHeader: "",
      modalBody1: "",
      modalBody2: "",
      modalBody3: ""
    },
    desc: ["Kool", "Jurisdiction", "Merits", "Quantum", "Relief Sought"]
  }),
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 6) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 6) {
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
      if (!this.$store.getters.getCcCoa) {
        var ccCoa = await this.$store.dispatch("findObj", findObj);
        if (ccCoa) {
          await this.$store.dispatch("doCcCoaValid", true);
        }
      }
      findObj = {
        url: `meritstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERMERIT
      };
      if (!this.$store.getters.getCcMerit) {
        var ccMerit = await this.$store.dispatch("findObj", findObj);
        if (ccMerit) {
          await this.$store.dispatch("doCcMeritValid", true);
        }
      }
      findObj = {
        url: `quantumstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERQUANTA
      };
      if (!this.$store.getters.getCcQuanta) {
        var ccQuanta = await this.$store.dispatch("findObj", findObj);
        if (ccQuanta) {
          await this.$store.dispatch("doCcQuantaValid", true);
        }
      }
      findObj = {
        url: `reliefstatementsCC/defend/${defendId}`,
        id: caseModels.COUNTERRELIEF
      };
      if (!this.$store.getters.getCcRelief) {
        var ccRelief = await this.$store.dispatch("findObj", findObj);
        if (ccRelief) {
          await this.$store.dispatch("doCcReliefValid", true);
        }
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
