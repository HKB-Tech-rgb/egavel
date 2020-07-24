<template>
  <v-btn
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
      caption: "Locus Standi"
    };
  },
  computed: {
    getStep() {
      if (this.$store.getters.getStep == 1) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "red";
        }
        return "blue";
      }

      return "yellow";
    },
    getColor() {
      if (this.$store.getters.getStep == 1) {
        if (this.$store.getters.isBtnColorInvalid) {
          return "yellow";
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
