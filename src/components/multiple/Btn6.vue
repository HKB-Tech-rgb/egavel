<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Save/Submit
  </v-btn>
</template>
<script>
export default {
  data: () => ({
    dialogData: {
      modalHeader: "",
      modalBody1: "",
      modalBody2: "",
      modalBody3: ""
    },
    desc: [
      "Kool",
      "Claimant",
      "Dependent",
      "Locus Standi of Claim",
      "cause of action",
      "Merits of claim",
      "Quantum and relief sought"
    ]
  }),
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 5) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 5) {
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
      if (this.$store.getters.getCoDefendants.length > 0) {
        this.$emit("change-form", 6);
        return;
      } else {
        this.dialogData.modalHeader = `Error! codef array ${this.$store.getters.getCoDefendants.length}`;
        this.dialogData.modalBody1 = "No 3rd Parties to process!";
        this.dialogData.modalBody2 = "Capture at least one 3rd Party";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
    }
  }
};
</script>
