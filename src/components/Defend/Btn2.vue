<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      Third Party
    </v-btn>
  </div>
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
      if (this.$store.getters.getStep == 2) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 2) {
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
      if (
        this.$store.getters.getStep == 1 &&
        this.$store.getters.isClaimantValid &&
        !this.$store.getters.getIsFormValid
      ) {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Claimant is not valid";
        this.dialogData.modalBody2 = "Complete claimant form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
      if (
        this.$store.getters.getStep == 1 &&
        this.$store.getters.getIsFormValid
      ) {
        this.$emit("change-form", 2);
        return;
      }
      if (this.$store.getters.isClaimantValid) {
        this.$emit("change-form", 2);
      } else {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Claimant is not valid";
        this.dialogData.modalBody2 = "Complete claimant form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
      }
    }
  }
};
</script>
