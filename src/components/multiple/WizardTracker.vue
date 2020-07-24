<template>
  <div class="footer">
    <v-card height="80px">
      <v-layout align-start justify-center>
        <Btnexit small />
      </v-layout>
      <v-layout align-end justify-space-around>
        <Btn1 small @change-form="changeForm" />
        <Btn2
          @change-form="changeForm"
          @show-dialog="showDialog"
          :disabled="btnDisabled2"
        />
        <Btn3
          @change-form="changeForm"
          @show-dialog="showDialog"
          :disabled="btnDisabled3"
        />
        <Btn4
          @change-form="changeForm"
          @show-dialog="showDialog"
          :disabled="btnDisabled4"
        />
        <Btn5
          @change-form="changeForm"
          @show-dialog="showDialog"
          :disabled="btnDisabled5"
        />
        <Btn6
          @change-form="changeForm"
          @show-dialog="showDialog"
          v-if="isVisible"
        />
      </v-layout>
    </v-card>
  </div>
</template>
<script>
import Btn1 from "@/components/multiple/Btn1.vue";
import Btn2 from "@/components/multiple/Btn2.vue";
import Btn3 from "@/components/multiple/Btn3.vue";
import Btn4 from "@/components/multiple/Btn4.vue";
import Btn5 from "@/components/multiple/Btn5.vue";
import Btn6 from "@/components/multiple/Btn6.vue";
import Btnexit from "@/components/multiple/Btn-exit.vue";

import caseStatus from "@/status-enums/caseStatus";

export default {
  data() {
    return {
      caseStatus: this.$store.getters.getCase
        ? this.$store.getters.getCase.status
        : 0,
      isVisible: true,
      btnDisabled2: false,
      btnDisabled3: false,
      btnDisabled4: false,
      btnDisabled5: false
    };
  },
  components: {
    Btn1,
    Btn2,
    Btn3,
    Btn4,
    Btn5,
    Btn6,
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
        this.isVisible = await false;
      }
      await this.$store.dispatch("findPoc", claimCase.PocId);

      var coDefList = this.$store.getters.getCoDefendants;
      coDefList.sort((a, b) => (a.id > b.id ? 1 : -1));
      this.$store.dispatch("doCoDefendants", coDefList);
      if (claim.StatusId > caseStatus.OPENED) {
        //var coDefs = await this.$store.getters.getDefendants
        for (var i = coDefList.length; i < 5; i++) {
          switch (i + 1) {
            case 2:
              this.btnDisabled2 = true;
              break;
            case 3:
              this.btnDisabled3 = true;
              break;
            case 4:
              this.btnDisabled4 = true;
              break;
            case 5:
              this.btnDisabled5 = true;
              break;
          }
        }
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
