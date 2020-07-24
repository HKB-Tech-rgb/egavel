<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Relief Sought
  </v-btn>
</template>
<script>
export default {
  data: () => ({
    validates: [],
    desc: [
      "Kool",
      "Insured",
      "Third Party",
      "Locus Standi",
      "Juridisction",
      "Merits of claim",
      "Quantum",
      "Relief Sought"
    ]
  }),
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 7) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 7) {
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
      var valid = true;
      this.loadValidates();
      for (var i = 1; i < 7; i++) {
        if (!this.validates[i]) {
          valid = false;
          this.$store.dispatch("textLenErr").then(txtLenErr => {
            if (txtLenErr) {
              this.$store
                .dispatch("loadDialogTxtLen", { pos: i, tab: this.desc[i] })
                .then(dialogData => {
                  this.$emit("show-dialog", dialogData);
                  return;
                });
            } else {
              this.$store
                .dispatch("loadDialogData", { pos: i, tab: this.desc[i] })
                .then(dialogData => {
                  this.$emit("show-dialog", dialogData);
                  return;
                });
            }
          });
          break;
        }
      }
      if (valid) {
        this.$emit("change-form", 7);
        return;
      }
    },
    loadValidates() {
      this.validates[0] = true;
      this.validates[1] = this.$store.getters.isClaimantValid;
      this.validates[2] = this.$store.getters.isDefendantValid;
      this.validates[3] = this.$store.getters.isLociStandiValid;
      this.validates[4] = this.$store.getters.isCoaValid;
      this.validates[5] = this.$store.getters.isMeritsValid;
      this.validates[6] = this.$store.getters.isQuantaValid;
      this.validates[7] = this.$store.getters.isReliefSoughtValid;
      return;
    }
  }
};
</script>
