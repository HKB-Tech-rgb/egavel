<template>
  <div class="footer">
    <v-card height="80px">
      <v-layout align-start justify-center>
        <Btnexit small />
      </v-layout>
      <v-layout align-end justify-space-around>
        <Btn1 small @change-form="changeForm" />
        <Btn2 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn3 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn4 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn5 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn6 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn7 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn8
          @change-form="changeForm"
          @show-dialog="showDialog"
          v-if="isVisible"
        ></Btn8>
      </v-layout>
    </v-card>
  </div>
</template>
<script>
import Btn1 from "@/components/Btn1.vue";
import Btn2 from "@/components/Btn2.vue";
import Btn3 from "@/components/Btn3.vue";
import Btn4 from "@/components/Btn4.vue";
import Btn5 from "@/components/Btn5.vue";
import Btn6 from "@/components/Btn6.vue";
import Btn7 from "@/components/Btn7.vue";
import Btn8 from "@/components/Btn8.vue";
import Btnexit from "@/components/Btn-exit.vue";

import caseStatus from "@/status-enums/caseStatus";

export default {
  data() {
    return {
      caseStatus: this.$store.getters.getCase
        ? this.$store.getters.getCase.status
        : 0,
      isVisible: true
    };
  },
  components: {
    Btn1,
    Btn2,
    Btn3,
    Btn4,
    Btn5,
    Btn6,
    Btn7,
    Btn8,
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
    var claim = await this.$store.getters.getClaimant;
    var claimCase = await this.$store.getters.getCase;
    var user = await this.$store.getters.getArbitUser;

    if (claimCase && user && claim) {
      if (claimCase.ArbitUserId === user.id) {
        this.isVisible = await true;
      } else {
        this.isVisible = await false;
      }
      if (claim.StatusId > caseStatus.OPENED) {
        this.isVisible = false;
      }
      await this.$store.dispatch("findPoc", claimCase.PocId);
    }
    await this.$store.dispatch("getAllCoys");
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
