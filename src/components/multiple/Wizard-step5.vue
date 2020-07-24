<template>
  <div>
    <AddCoDefendant5
      @form-valid="checkFormValid"
      :readOnly="readOnly"
    ></AddCoDefendant5>
  </div>
</template>
<script>
import AddCoDefendant5 from "@/components/AddCoDefendant.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    AddCoDefendant5
  },
  data() {
    return {
      readOnly: false
    };
  },
  methods: {
    checkFormValid(coDefendant) {
      if (coDefendant) {
        this.$store.dispatch("doCoDefendant5Valid", true);
        this.$store.dispatch("doIsFormValid", true);
      } else {
        this.$store.dispatch("doCoDefendant5Valid", false);
        this.$store.dispatch("doIsFormValid", false);
      }
    }
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
      await this.$store.dispatch("doCoDefStep", 4);
    }
  },
  async beforeDestroy() {
    if (this.$store.getters.isFormValid) {
      await this.$store.dispatch("doCoDefendant5Valid", true);
    }
  }
};
</script>
