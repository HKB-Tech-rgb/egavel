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
  }
};
</script>
