<template>
  <div>
    <AddDefendant :readOnly="readOnly"></AddDefendant>
  </div>
</template>
<script>
import AddDefendant from "@/components/AddDefendant.vue";

export default {
  components: {
    AddDefendant
  },
  data() {
    return {
      readOnly: true
    };
  },
  async created() {
    var defendCoy = this.$store.getters.getDefendant;
    var userCoy = this.$store.getters.getArbitUser;

    if (defendCoy && userCoy) {
      if (defendCoy.CompanyId === userCoy.CompanyId) {
        this.readOnly = await false;
      } else {
        this.readOnly = await true;
      }
    }
  }
};
</script>
