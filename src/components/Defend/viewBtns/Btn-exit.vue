<template>
  <v-btn
    :style="{ backgroundColor: getStep, color: getColor }"
    class="exitBtn"
    text
    small
    @click="navigateTo"
  >
    exit view case wizard
  </v-btn>
</template>
<script>
//import caseStatus from "@/status-enums/caseStatus";
//import userRoles from "@/status-enums/roletypes";

export default {
  methods: {
    navigateTo() {
      this.$store.dispatch("fixStep", 6);
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
      /*
            var path =  '';
            if (this.$store.getters.getArbitUser.UserRoleId===userRoles.PARTICIPANT){
                var Case = this.$store.getters.getCase;
                if (Case.StatusId>caseStatus.PENDINGTHIRD){
                    path = 'resolve-claim'
                }else{
                     path = 'def-create'
                }
            }else{
                 path = 'resolve-claim';
                
            }
            this.$router.push({
                    name: `${path}`
                });
            */
    },
    getStep() {
      return "grey";
    },
    getColor() {
      return "black";
    }
  },
  async beforeDestroy() {
    await this.$store.dispatch("doLociFiles", []);
    await this.$store.dispatch("doCoaFiles", []);
    await this.$store.dispatch("doMeritFiles", []);
    await this.$store.dispatch("doQuantaFiles", []);
    await this.$store.dispatch("doReliefSoughtFiles", []);
  }
};
</script>
<style scoped>
.exitBtn {
  background-color: #bcaaa4 !important;
  color: #fff !important;
}
</style>
