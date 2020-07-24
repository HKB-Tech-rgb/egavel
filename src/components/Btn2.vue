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
import poc from "@/status-enums/poc";
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
      if (this.multiValid) {
        if (this.$store.getters.isClaimantValid) {
          this.$router.push({
            name: "multi-defs"
          });
        } else {
          this.dialogData.modalHeader = "Can't Do";
          this.dialogData.modalBody1 = "The Insured is not valid";
          this.dialogData.modalBody2 = "Complete the Insured form";
          this.dialogData.modalBody3 = "And, Kool is the rool";

          this.$emit("show-dialog", this.dialogData);
        }
        return;
      }
      if (this.$store.getters.isClaimantValid) {
        this.$emit("change-form", 2);
        return;
      } else {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Insured is not valid";
        this.dialogData.modalBody2 = "Complete the insured form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
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
    var pocId = this.$store.getters.getCase.PocId;
    if (pocId === poc.MULTIPLE) {
      this.btnLabel = "Multi 3rd";
      this.multiValid = true;
    } else {
      this.btnLabel = "3rd Party";
    }
  }
};
</script>
