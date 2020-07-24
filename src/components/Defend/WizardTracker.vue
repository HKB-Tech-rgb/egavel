<template>
  <div class="footer">
    <v-card height="80px">
      <v-layout align-start justify-center>
        <Btnexit />
      </v-layout>
      <v-layout align-end justify-space-around>
        <Btn1 @change-form="changeForm" />
        <Btn2 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn3 @change-form="changeForm" />
        <Btn4 @change-form="changeForm" />
        <Btn5 @change-form="changeForm" @show-dialog="showDialog" />
        <Btn6 @change-form="changeForm" />
        <Btn7 @change-form="changeForm" @show-dialog="showDialog"></Btn7>
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
import Btn1 from "@/components/Defend/Btn1.vue";
import Btn2 from "@/components/Defend/Btn2.vue";
import Btn3 from "@/components/Defend/Btn3.vue";
import Btn4 from "@/components/Defend/Btn4.vue";
import Btn5 from "@/components/Defend/Btn5.vue";
import Btn6 from "@/components/Defend/Btn6.vue";
import Btn7 from "@/components/Defend/Btn7.vue";
import Btn8 from "@/components/Defend/Btn8.vue";

import Btnexit from "@/components/Defend/Btn-exit.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  data() {
    return {
      caseStatus: this.$store.getters.getCase.status,
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
    var defend = this.$store.getters.getDefendant;
    var user = this.$store.getters.getArbitUser;
    if (defend && user) {
      if (defend.CompanyId === user.CompanyId) {
        this.isVisible = await true;
      } else {
        this.isVisible = await false;
      }
      if (defend.StatusId > caseStatus.PENDINGTHIRD) {
        this.isVisible = await false;
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
