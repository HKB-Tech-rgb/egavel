<template>
  <div>
    <v-container fluid grid-list-xl>
      <component :is="stepComponent" />
      <v-layout justify-space-between>
        <WizardTracker @change-form="changeForm" @show-dialog="showDialog" />
        <modalDiag v-show="isModalVisible" @close="closeModal">
          <h3 slot="header">{{ modalHeader }} requires valid fields.</h3>
          <h5 slot="body">
            {{ modalBody1 }}<br />{{ modalBody2 }}<br />{{ modalBody3 }}
          </h5>
        </modalDiag>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import WizardTracker from "@/components/Defend/WizardTracker.vue";
import ModalDiag from "@/components/ModalDiag.vue";

export default {
  components: {
    WizardTracker,
    ModalDiag
  },
  data: () => ({
    step: 1,
    isModalVisible: false,
    modalHeader: "",
    modalBody1: "",
    modalBody2: "",
    modalBody3: ""
  }),
  computed: {
    stepComponent() {
      var step = this.step;
      this.$store.dispatch("fixStep", step);
      return () => import(`./Wizard-step${this.$store.getters.getStep}.vue`);
    }
  },
  async created() {
    await this.$store.commit("setNotInWizard", false);
    /*
    try{
        await this.getParams();
    }catch(e){
        console.error(e);
    }*/
  },
  methods: {
    async getParams() {
      if (this.$route.params.arbitId) {
        await this.$store.dispatch("initCaseId", this.$route.params.arbitId);
        await this.$store.dispatch("getCase", this.$route.params.arbitId);
        //console.log('case wiz ' + JSON.stringify(this.$store.getters.getCase));
      } else {
        throw "Param Case Id not found";
      }
      if (this.$route.params.claimId) {
        await this.$store.dispatch(
          "initClaimantId",
          this.$route.params.claimId
        );
        await this.$store.dispatch("findClaimant", this.$route.params.claimId);
      } else {
        throw "Param Claimant Id not found";
      }
      if (this.$route.params.defendId) {
        await this.$store.dispatch(
          "initDefendantId",
          this.$route.params.defendId
        );
        await this.$store.dispatch(
          "findDefendant",
          this.$route.params.defendId
        );
      } else {
        throw "Param Defendant Id not found";
      }
    },
    adjustStepUp() {
      var c_ase = this.$store.getters.getCase;
      switch (c_ase.status) {
        case c_ase.OPEN:
          if (this.step > 5) this.step = 8;
          break;
      }
    },
    adjustStepDown() {
      var c_ase = this.$store.getters.getCase;
      switch (c_ase.status) {
        case c_ase.OPEN:
          if (this.step > 5) this.step = 5;
          break;
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    changeForm(e) {
      this.step = e;
    },
    setModalMessage() {
      switch (this.step) {
        case 1:
          this.modalHeader = "Claimant Form ";
          this.modalBody1 = "All fields require data";
          this.modalBody2 = "Check email field";
          this.modalBody3 = "Text fields require 4 chars or more";
          break;
        case 2:
          this.modalHeader = "Dependant Form ";
          this.modalBody1 = "All fields require data";
          this.modalBody2 = "Check email field";
          this.modalBody3 = "Text fields require 4 chars or more";
          break;
        case 3:
          this.modalHeader = "Cause of action Form ";
          this.modalBody1 = "Cause of action can be input";
          this.modalBody2 = "Or files uploaded that contain cause";
          this.modalBody3 = "Kool is the rool";
          break;
        case 4:
          this.modalHeader = "Relief Sought Form ";
          this.modalBody1 = "Relief sought needs file or data";
          this.modalBody2 = "Or files uploaded that contain Relief sought";
          this.modalBody3 = "Kool is the rool";
          break;
        case 5:
          this.modalHeader = "Particulars of claim Form";
          this.modalBody1 = "Particulars of claim needs file or data";
          this.modalBody2 =
            "Or files uploaded that contain Particulars of claim";
          this.modalBody3 = "Kool is the rool";
          break;
        default:
          console.log("kuk has happened in DDUserMenu " + this.step);
      }
    },
    showDialog(e) {
      this.modalHeader = e.modalHeader;

      this.modalBody1 = e.modalBody1;
      this.modalBody2 = e.modalBody2;
      this.modalBody3 = e.modalBody3;

      this.showModal();
      return;
    }
  }
};
</script>
.slide-fade-enter-active { transition: all 2s ease; } .slide-fade-leave-active {
transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0); } .slide-fade-enter,
.slide-fade-leave-to /* .slide-fade-leave-active below version 2.1.8 */ {
transform: translateY(30px); opacity: 0; } footer { position: absolute; bottom:
0; }
