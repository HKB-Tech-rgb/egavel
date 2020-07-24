<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Submit Claim
  </v-btn>
</template>
<script>
export default {
  data: () => ({
    validates: [],
    desc: [
      "Kool",
      "Juridisction",
      "Merits of claim",
      "Quantum",
      "Relief Sought"
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
    loadValidates() {
      var validates = [];
      validates[0] = true;
      validates[1] = this.$store.getters.isCcCoaValid;
      validates[2] = this.$store.getters.isCcMeritValid;
      validates[3] = this.$store.getters.isCcQuantaValid;
      validates[4] = this.$store.getters.isCcReliefValid;
      return validates;
    },
    async sendEvent() {
      this.validates = this.loadValidates();
      await this.validateRelief();
      await this.checkInconsistency();
    },
    validateRelief() {
      for (var i = 1; i < 5; i++) {
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
      var len = this.desc.length;
      var incon = false;
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
      if (await incon) {
        return;
      } else {
        this.$emit("change-form", 5);
        return;
      }
    }
  }
};
</script>
