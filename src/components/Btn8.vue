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
    async sendEvent() {
      this.validates = this.loadValidates();
      await this.validateRelief();
      await this.checkInconsistency();
    },
    loadValidates() {
      var validates = [];
      validates[0] = true; //hack
      validates[1] = this.$store.getters.isClaimantValid;
      validates[2] = this.$store.getters.isDefendantValid;
      validates[3] = this.$store.getters.isLociStandiValid;
      validates[4] = this.$store.getters.isCoaValid;
      validates[5] = this.$store.getters.isMeritsValid;
      validates[6] = this.$store.getters.isQuantaValid;
      validates[7] = this.$store.getters.isReliefSoughtValid;
      return validates;
    },
    validateRelief() {
      for (var i = 1; i < 8; i++) {
        if (!this.validates[i]) {
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
    },
    async checkInconsistency() {
      var allValid = true;
      var incon = false;
      var len = this.desc.length;
      var obj = { arrLen: len, validates: this.loadValidates() };
      //console.log(`obj inv ${obj.arrLen} `)
      await this.$store
        .dispatch("checkForInconsistency", obj)
        .then(async inconObj => {
          //console.log(`obj inv ${inconObj.inValidPos} val ${inconObj.validPos} `)
          if (inconObj.validPos > inconObj.inValidPos) {
            inconObj.validPos = this.desc[inconObj.validPos];
            inconObj.inValidPos = this.desc[inconObj.inValidPos];
            await this.$store
              .dispatch("inconsistencyDialog", inconObj)
              .then(dialogData => {
                incon = true;
                this.$emit("show-dialog", dialogData);
                return;
              });
          }
        });
      for (var j = 1; j < this.loadValidates().length; j++) {
        if (!this.loadValidates()[j]) {
          allValid = false;
          break;
        }
      }
      if (allValid) {
        await this.$store.dispatch("doCaseValid", true);
        await this.$store.dispatch("doClaimantCaseValid", true);
        this.$emit("change-form", 8);
        return;
      } else {
        if (incon) {
          return;
        } else {
          if (this.$store.getters.isClaimantCaseValid) {
            this.$emit("change-form", 8);
            return;
          }
        }
      }
    }
  }
};
</script>
