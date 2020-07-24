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
    }
  }),
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 8) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 8) {
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
      var oneValid = false;
      for (var i = 0; i < this.loadValidates().length; i++) {
        if (this.loadValidates()[i]) {
          oneValid = true;
        }
      }
      if (oneValid) {
        this.$emit("change-form", 8);
      } else {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Either Defense, Settle or Counter Claim";
        this.dialogData.modalBody2 = "must be valid - Complete one to submit";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
    },
    loadValidates() {
      var validates = [];
      validates[0] = this.$store.getters.isDefenseValid;
      validates[1] = this.$store.getters.isSettleValid;
      validates[2] = this.$store.getters.isProcessCounterClaim;
      return validates;
    }
  }
};
</script>
