<template>
  <div>
    <AddClaimant :readOnly="readOnly"></AddClaimant>
  </div>
</template>

<script>
import AddClaimant from "@/components/AddClaimant.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    AddClaimant
  },
  data() {
    return {
      readOnly: false
    };
  },
  async created() {
    var claimCase = this.$store.getters.getCase;
    var claim = this.$store.getters.getClaimant;
    var user = this.$store.getters.getArbitUser;

    if (claimCase && user && claim) {
      if (claimCase.ArbitUserId === user.id) {
        this.readOnly = await false;
      } else {
        this.readOnly = await true;
      }
      if (claim.StatusId > caseStatus.OPENED) {
        this.readOnly = await true;
      }
    }
  }
};
</script>
<style>
div {
  opacity: 0.98;
}
</style>
