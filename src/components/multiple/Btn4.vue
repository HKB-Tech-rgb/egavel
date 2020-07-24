<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
    :disabled="disabled"
  >
    3rd Party-4
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
      "3rd-Party-1",
      "3rd-Party-2",
      "3rd-Party-3",
      "3rd-Party-4",
      "3rd-Party-5"
    ]
  }),
  props: {
    disabled: {
      type: Boolean
    }
  },
  computed: {
    getStep() {
      if (this.$store.getters.getStep === 4) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep === 4) {
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
        this.$store.getters.getStep < 4 &&
        !this.$store.getters.isCoDefendant3Valid
      ) {
        this.dialogData.modalHeader = "Error!";
        this.dialogData.modalBody1 = `${this.desc[3]} form not valid`;
        this.dialogData.modalBody2 = `Complete ${this.desc[3]} form`;
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
      if (this.$store.getters.isCoDefendant3Valid) {
        this.$emit("change-form", 4);
        return;
      } else {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "Third Party 3 form not valid";
        this.dialogData.modalBody2 = "Complete form";
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
    }
  }
};
</script>
