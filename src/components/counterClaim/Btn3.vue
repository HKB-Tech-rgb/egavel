<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Quantum Damages
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
      if (this.$store.getters.getStep == 3) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 3) {
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
      this.loadValidates();
      var valid = true;
      for (var i = 1; i < 3; i++) {
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
        this.$emit("change-form", 3);
        return;
      }
    },
    loadValidates() {
      this.validates[0] = true;
      this.validates[1] = this.$store.getters.isCcCoaValid;
      this.validates[2] = this.$store.getters.isCcMeritValid;
      this.validates[3] = this.$store.getters.isCcQuantaValid;
      this.validates[4] = this.$store.getters.isCcReliefValid;
      return;
    }
  }
};
</script>
