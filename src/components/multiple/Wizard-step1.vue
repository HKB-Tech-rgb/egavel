<template>
  <div>
    <AddCoDefendant1
      @form-valid="checkFormValid"
      :readOnly="readOnly"
    ></AddCoDefendant1>
  </div>
</template>
<script>
import AddCoDefendant1 from "@/components/AddCoDefendant.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    AddCoDefendant1
  },
  data() {
    return {
      readOnly: false
    };
  },
  methods: {
    checkFormValid(coDefendant) {
      if (coDefendant) {
        this.$store.dispatch("doCoDefendant1Valid", true);
        this.$store.dispatch("doIsFormValid", true);
      } else {
        this.$store.dispatch("doCoDefendant1Valid", false);
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
      await this.$store.dispatch("doCoDefStep", 0);
    }
  },
  async beforeDestroy() {
    if (this.$store.getters.isFormValid) {
      await this.$store.dispatch("doCoDefendant1Valid", true);
    }
  }
};
</script>
