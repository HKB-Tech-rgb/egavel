<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      Locus Standi
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
      "Locus Standi of Claim",
      "Jurisdiction",
      "Merits of claim",
      "Quantum of Claim",
      "Relief Sought"
    ]
  }),
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 4) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 4) {
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
      this.$emit("change-form", 4);
    }
  }
};
</script>
