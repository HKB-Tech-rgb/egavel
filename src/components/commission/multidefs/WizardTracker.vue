<template>
  <div>
    <div class="footer">
      <v-card height="80px">
        <v-layout align-start justify-center>
          <Btnexit small />
        </v-layout>
        <v-layout align-end justify-space-around>
          <Btn1 small @change-form="changeForm" />
          <Btn2 @change-form="changeForm" :disabled="btnDisabled2" />
          <Btn3 @change-form="changeForm" :disabled="btnDisabled3" />
          <Btn4 @change-form="changeForm" :disabled="btnDisabled4" />
          <Btn5 @change-form="changeForm" :disabled="btnDisabled5" />
        </v-layout>
      </v-card>
    </div>
  </div>
</template>
<script>
import Btn1 from "@/components/commission/multidefs/Btn1.vue";
import Btn2 from "@/components/commission/multidefs/Btn2.vue";
import Btn3 from "@/components/commission/multidefs/Btn3.vue";
import Btn4 from "@/components/commission/multidefs/Btn4.vue";
import Btn5 from "@/components/commission/multidefs/Btn5.vue";
import Btnexit from "@/components/commission/multidefs/Btn-exit.vue";

import caseStatus from "@/status-enums/caseStatus";

export default {
  data() {
    return {
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
    Btnexit
  },
  methods: {
    changeForm(e) {
      this.$emit("change-form", e);
    },
    async findDefendants() {
      var url = `defendants/coy/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants wiz 7 " + err);
      }
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
      await this.findDefendants();

      var defList = [];
      await this.$store.getters.getCoDefendants.forEach(def => {
        defList.push(def);
      });
      defList.sort((a, b) => (a.id > b.id ? 1 : -1));
      var coDefs = await this.$store.getters.getDefendants;
      for (var i = coDefs.length; i < 5; i++) {
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
