<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      {{ btnLabel }}
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
      modalBody3: "",
      btnLabel: ""
    },
    multiValid: false
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
      //this.validateForMulti();
      if (this.multiValid) {
        this.$router.push({
          name: "comm-multi-defs"
        });
        return;
      }

      if (this.$store.getters.isClaimantCaseValid) {
        this.$emit("change-form", 2);
        return;
      }
      if (
        this.$store.getters.getStep == 1 &&
        this.$store.getters.isClaimantValid &&
        !this.$store.getters.getIsFormValid
      ) {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Insured is not valid";
        this.dialogData.modalBody2 = "Complete the insured form";
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
        this.dialogData.modalBody1 = "The Insured is not valid";
        this.dialogData.modalBody2 = "Complete the Insured form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
      }
    },
    pocDesc() {
      var pocId = this.$store.getters.getCase.PocId;
      var desc = "3rd Party";
      this.$store.getters.getPocs.forEach(poc => {
        if (poc.id == pocId) {
          desc = poc.Description;
        }
      });
      return desc;
    },
    validateForMulti() {
      if (!this.$store.getters.isClaimantValid) {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Insured is not valid";
        this.dialogData.modalBody2 = "Complete the insured form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        this.multiValid = false;
        return;
      }
    }
  },
  created() {
    var desc = this.pocDesc();
    if (desc == "Multiple vehicle collision") {
      this.btnLabel = "Multi 3rd";
      this.multiValid = true;
      this.$store.dispatch("doMultiAccident", true);
    } else {
      this.btnLabel = "3rd Party";
    }
  }
};
</script>
