<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
      :disabled="disabled"
    >
      3rd Party-2
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
        this.$store.getters.getStep < 2 &&
        !this.$store.getters.isCoDefendant1Valid
      ) {
        this.dialogData.modalHeader = "Error!";
        this.dialogData.modalBody1 = `${this.desc[1]} form not valid`;
        this.dialogData.modalBody2 = `Complete ${this.desc[1]} form`;
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
      if (this.$store.getters.isCoDefendant1Valid) {
        this.$emit("change-form", 2);
        return;
      } else {
        this.dialogData.modalHeader = "Can't Do";
        this.dialogData.modalBody1 = "${this.desc[1]} form not valid";
        this.dialogData.modalBody2 = `Complete ${this.desc[1]} form`;
        this.dialogData.modalBody3 = "And, Kool is the rool";

        this.$emit("show-dialog", this.dialogData);
        return;
      }
    }
  }
};
</script>
