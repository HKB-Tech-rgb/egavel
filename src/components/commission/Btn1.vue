<template>
  <v-btn
    text
    :style="{ backgroundColor: getStep, color: getColor }"
    @click="sendEvent"
    depressed
    large
  >
    {{ caption }}
  </v-btn>
</template>
<script>
export default {
  data() {
    return {
      caption: "Insured"
    };
  },
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
    }
  }
};
</script>
