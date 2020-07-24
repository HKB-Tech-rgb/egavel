<template>
  <div>
    <AddClaimant :readOnly="readOnly"></AddClaimant>
  </div>
</template>

<script>
import AddClaimant from "@/components/AddClaimant.vue";

export default {
  components: {
    AddClaimant
  },
  data() {
    return {
      readOnly: true
    };
  }
};
</script>
