<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    Jurisdiction
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
      if (this.$store.getters.getStep == 1) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "#3E2723";
      }
      return "rgb(212,210,215)";
    },
    getColor() {
      if (this.$store.getters.getStep == 1) {
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
      this.$emit("change-form", 1);
      return;
    }
  }
};
</script>
