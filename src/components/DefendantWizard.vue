<template>
 <div>
    <v-container fluid grid-list-xl>

      <component :is="stepComponent"/>
      <v-layout justify-space-between>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="back" flat v-on="on" ref="back">
                <v-icon>arrow_back_ios</v-icon>
              </v-btn>
            </template>
            <span>back one page in wizard</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="next" flat v-on="on" ref="fwd">
                <v-icon>arrow_forward_ios</v-icon>
              </v-btn>
            </template>
            <span>next page in wizard</span>
          </v-tooltip>
        <WizardTracker @change-form="changeForm"
                       @show-dialog="showDialog"/>
        <modalDiag
          v-show="isModalVisible"
          @close="closeModal">
         <h3 slot="header">{{modalHeader}} requires valid fields.</h3>
         <h5 slot="body">{{modalBody}}<br/>{{modalBody2}}<br/>{{modalBody3}}</h5>
       </modalDiag>
      </v-layout>
    </v-container>
 </div>
</template>

<script>
import WizardTracker from '@/components/WizardTracker.vue'
import ModalDiag from '@/components/ModalDiag.vue'

export default {
  components:{
        WizardTracker,
        ModalDiag
  },
  data: () => (
    { 
      step: 1,
      isModalVisible: false,
      modalHeader:'',
      modalBody1:'',
      modalBody2:'',
      modalBody3:'',
  }),
  computed: {
    stepComponent() {
      var step = this.step; 
      this.$store.commit("setStep", step);
      return () => import(`./Wizard-step${step}.vue`);
    }
  },
  created(){

    this.$store.commit("setNotInWizard", false);
    
  },
  methods: {
    next() {
      if(!this.$store.getters.getIsFormValid){
          this.setModalMessage();
          this.$store.commit('setBtnColorInvalid', true);   
          this.showModal();
          return;
        }else{
            this.$store.commit('setBtnColorInvalid', false);
      } 
           
      this.$store.commit("setIsFormValid", false);

      this.step++;
      if (this.step > 6){
         this.step = 6;
      }
    },
    back() {
      this.step--;
      this.$store.commit('setBtnColorInvalid', false);
      this.$store.commit("setIsFormValid", false);

      if (this.step < 1){
         this.step = 1;
      }
    },
    showModal() {
        this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    changeForm(e){
      this.step = e;
    },
    setModalMessage(){
       switch (this.step){
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
            this.modalBody2 = "Or files uploaded that contain Particulars of claim";
            this.modalBody3 = "Kool is the rool";
             break;   
          default:
            console.log('kuk has happened in DDUserMenu ' + this.step);   
        }
    },
    showDialog(e){
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