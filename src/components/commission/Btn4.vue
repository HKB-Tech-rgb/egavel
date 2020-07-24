<template>
  <div>
    <v-btn
      :style="{ backgroundColor: getStep, color: getColor }"
      @click="sendEvent"
      depressed
      large
    >
      View Third Party's Evidence
    </v-btn>
  </div>
</template>
<script>
export default {
  data: () => ({
    multiValid: false
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
      if (this.multiValid) {
        this.$router.push({
          name: "comm-multi-defs"
        });
      } else {
        this.$router.push({
          name: "com-view-def"
        });
      }
      return;
    },
    pocDesc() {
      var pocId = this.$store.getters.getCase.PocId;
      //console.log('pocs '+ JSON.stringify(this.$store.getters.getPocs));
      var desc = "3rd Party";
      this.$store.getters.getPocs.forEach(poc => {
        if (poc.id == pocId) {
          desc = poc.Description;
        }
      });
      return desc;
    }
  },
  created() {
    var desc = this.pocDesc();
    if (desc == "Multiple vehicle collision") {
      this.btnLabel = "Multi 3rd evidence";
      this.multiValid = true;
    } else {
      this.btnLabel = "View Third Party Evidence";
    }
  }
};
</script>
