<template>
  <div class="footer">
    <v-card height="80px">
      <v-layout align-start justify-center>
        <Btnexit />
      </v-layout>
      <v-layout align-end justify-space-around>
        <Btn1 @change-form="changeForm" />
        <Btn2 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn3 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn4 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn5
          @change-form="changeForm"
          @show-dialog="showDialog"
          v-if="isVisible"
        />
      </v-layout>
    </v-card>
  </div>
</template>
<script>
import Btn1 from "@/components/counterClaim/Btn1.vue";
import Btn2 from "@/components/counterClaim/Btn2.vue";
import Btn3 from "@/components/counterClaim/Btn3.vue";
import Btn4 from "@/components/counterClaim/Btn4.vue";
import Btn5 from "@/components/counterClaim/Btn5.vue";
import Btnexit from "@/components/counterClaim/Btn-exit.vue";

import caseStatus from "@/status-enums/caseStatus.js";
export default {
  data() {
    return {
      isVisible: false
    };
  },
  components: {
    Btn1,
    Btn2,
    Btn3,
    Btn4,
    Btn5,
    Btnexit
  },
  methods: {
    changeForm(e) {
      this.$emit("change-form", e);
    },
    showDialog(e) {
      this.$emit("show-dialog", e);
    }
  },
  async created() {
    var defend = await this.$store.getters.getDefendant;
    var user = await this.$store.getters.getArbitUser;

    if (user && defend) {
      if (defend.ArbitUserId === user.id) {
        this.isVisible = true;
      } else {
        this.isVisible = false;
      }
      if (defend.StatusId > caseStatus.PENDINGTHIRD) {
        this.isVisible = false;
      }
    }
  }
};
</script>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}
</style>
