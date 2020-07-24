<template>
  <div>
    <AddDefendant :readOnly="readOnly"></AddDefendant>
  </div>
</template>
<script>
import AddDefendant from "@/components/AddDefendant.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    AddDefendant
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
