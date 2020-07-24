<template>
  <v-btn class="exitBtn" text small @click="navigateTo">
    exit wizard
  </v-btn>
</template>
<script>
export default {
  methods: {
    navigateTo() {
      var path = this.$routerHistory.previous().path;
      if (path.indexOf("/filed") > 0) {
        path = path.substring(0, path.indexOf("/filed"));
      }
      this.$router.push({
        path: path
      });
    },
    getStep() {
      return "#3E2723";
    },
    getColor() {
      return "black";
    }
  }
};
</script>
<style scoped>
.exitBtn {
  background-color: #bcaaa4 !important;
  color: #fff !important;
}
</style>
