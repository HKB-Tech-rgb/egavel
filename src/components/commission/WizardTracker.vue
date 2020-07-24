<template>
  <div class="footer">
    <v-card height="80px">
      <v-layout align-start justify-center>
        <Btnexit />
      </v-layout>
      <v-layout align-end justify-space-around>
        <Btn1 @change-form="changeForm" />
        <Btn2 @change-form="changeForm" v-if="isSingle" />
        <Btn3 @change-form="changeForm" />
        <Btn4 @change-form="changeForm" />
        <Btn5 @change-form="changeForm" v-if="isAlsoVisible" />
        <Btn6
          @change-form="changeForm"
          @show-dialog="showDialog"
          v-if="isVisible"
        ></Btn6>
      </v-layout>
    </v-card>
  </div>
</template>
<script>
import Btn1 from "@/components/commission/Btn1.vue";
import Btn2 from "@/components/commission/Btn2.vue";
import Btn3 from "@/components/commission/Btn3.vue";
import Btn4 from "@/components/commission/Btn4.vue";
import Btn5 from "@/components/commission/Btn5.vue";
import Btn6 from "@/components/commission/Btn6.vue";
import Btnexit from "@/components/commission/Btn-exit.vue";

import userRoles from "@/status-enums/roletypes";
import caseStatus from "@/status-enums/caseStatus";
import poc from "@/status-enums/poc";

export default {
  data() {
    return {
      caseStatus: 0,
      isVisible: true,
      isSingle: true,
      isAlsoVisible: false
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
    var Case = this.$store.getters.getCase;
    if (!Case.StatusId) {
      //this is a hack as the case from the 3rd party exit has no statusId
      await this.$store.dispatch("findCase", Case.id).then(resp => {
        Case = resp;
      });
    }
    var user = this.$store.getters.getArbitUser;
    if (user.role.id === userRoles.ARBITOR) {
      this.isVisible = true;
      this.isAlsoVisible = true;
    } else {
      this.isVisible = false;
    }
    if (Case.StatusId === caseStatus.RESOLVED) {
      this.isVisible = false;
      this.isAlsoVisible = true;
    }
    if (Case.PocId === poc.MULTIPLE) {
      this.isSingle = false;
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
