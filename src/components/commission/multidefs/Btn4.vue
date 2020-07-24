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
    async sendEvent() {
      await this.initDefense();
      this.$router.push({
        name: "com-view-def"
      });
    },
    async initDefense() {
      var defendant = await this.$store.getters.getDefendants[3];
      await this.$store.dispatch("doDefendant", defendant);
      await this.$store.dispatch("initDefendObjs", {
        Defendant: defendant
      });
    }
  }
};
</script>
