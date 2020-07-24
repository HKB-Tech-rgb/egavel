<template>
  <v-btn class="exitBtn" text small @click="navigateTo">
    {{ btnLabel }}
  </v-btn>
</template>
<script>
import userRoles from "@/status-enums/roletypes";
export default {
  data: () => ({
    btnLabel: ""
  }),
  methods: {
    navigateTo() {
      var path = this.$routerHistory.previous().path;
      if (path.indexOf("parties") > 0) {
        this.$router.push("/cases");
      } else {
        this.$router.push({ path: this.$routerHistory.previous().path });
      }
    },
    getStep() {
      return "grey";
    },
    getColor() {
      return "black";
    }
  },
  created() {
    var user = this.$store.getters.getArbitUser;
    if (user.UserRoleId === userRoles.ARBITOR) {
      this.btnLabel = "exit Arbitrator wizard";
    } else {
      this.btnLabel = "exit Case View";
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
