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
      /*
            if (this.$store.getters.getStep < 7 && this.$store.getters.isReliefSoughtValid && 
                (!this.$store.getters.getIsFormValid)) {
                    this.dialogData.modalHeader = "Can't Do";
                    this.dialogData.modalBody1 = `${this.desc[this.$store.getters.getStep]} form not valid`;
                    this.dialogData.modalBody2 = `Complete ${this.desc[this.$store.getters.getStep]} form`;
                    this.dialogData.modalBody3 = "And, Kool is the rool";

                    this.$emit('show-dialog', this.dialogData); 
                    return;
            }
            if(this.$store.getters.getStep == 6 && this.$store.getters.getIsFormValid){
                this.$emit('change-form', 7);
                return;
            }*/
      if (this.$store.getters.isReliefSoughtValid) {
        this.$store.dispatch("doClaimantCaseValid", true);
      }
      this.$emit("change-form", 6);
      /*else{
                this.dialogData.modalHeader = "Can't Do";
                this.dialogData.modalBody1 = "Relief sought not valid";
                this.dialogData.modalBody2 = "Complete Relief sought form";
                this.dialogData.modalBody3 = "And, Kool is the rool";

                this.$emit('show-dialog', this.dialogData);
                return;
            }*/
    }
  }
};
</script>
