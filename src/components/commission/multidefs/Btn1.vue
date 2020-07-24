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
      caption: "3rd Party-1"
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
    async sendEvent() {
      await this.initDefense();

      this.$router.push({
        name: "com-view-def"
      });
    },
    async initDefense() {
      var defendant = await this.$store.getters.getDefendants[0];
      await this.$store.dispatch("doDefendant", defendant);
      await this.$store.dispatch("initDefendObjs", {
        Defendant: defendant
      });
    }
  }
};
</script>
