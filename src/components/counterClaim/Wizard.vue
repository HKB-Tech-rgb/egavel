<template>
 <div>
    <v-container fluid grid-list-xl>

      <component :is="stepComponent"/>
      <v-layout justify-space-between>
          <WizardTracker @change-form="changeForm"
                       @show-dialog="showDialog"/>
          <modalDiag
            v-show="isModalVisible"
            @close="closeModal">
          <h3 slot="header">{{modalHeader}} requires valid fields.</h3>
          <h5 slot="body">{{modalBody1}}<br/>{{modalBody2}}<br/>{{modalBody3}}</h5>
        </modalDiag>
      </v-layout>
    </v-container>
 </div>
</template>

<script>
import WizardTracker from '@/components/counterClaim/WizardTracker.vue'
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
      counterClaim: null,
      defendId: 0
  }),
  computed: {
    stepComponent() {
      var step = this.step; 
      this.$store.commit("setStep", step);
      //console.log('in wizard step ' + this.step)
      return () => import(`./Wizard-step${step}.vue`);
    }
  },
  async created(){
    if (this.$route.params.claimId && this.$route.params.defendId){
       try{
          //await this.$store.dispatch('findClaimant', this.$route.params.claimId);
          //await this.$store.dispatch('findDefendant', this.$route.params.defendId);
          //await this.$store.dispatch('initCaseId', this.$route.params.arbitId);
          this.defendId = this.$route.params.defendId          
          //await this.initCase();
                    
       }catch(err){
         console.log('problem finding insured or 3rd party '+ err);
       }
    }
  },
  methods: {
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
            this.modalHeader = "Locus Standi Form ";
            this.modalBody1 = "Locus standi of action can be input";
            this.modalBody2 = "Or files uploaded that contain Locus standi";
            this.modalBody3 = "Kool is the rool";
            break;
          case 4:
            this.modalHeader = "Cause of action Form ";
            this.modalBody1 = "Cause of action can be input";
            this.modalBody2 = "Or files uploaded that contain cause";
            this.modalBody3 = "Kool is the rool";
            break;
          case 5:
            this.modalHeader = "Merits Form ";
            this.modalBody1 = "Merits can be input";
            this.modalBody2 = "Or files uploaded that contain merits of case";
            this.modalBody3 = "Kool is the rool";
            break;
           case 6:
            this.modalHeader = "Quantam of claim form";
            this.modalBody1 = "Quantium of claim needs file or data";
            this.modalBody2 = "Or files uploaded that contain quantum of claim";
            this.modalBody3 = "Kool is the rool";
             break;       
          case 7:
            this.modalHeader = "Relief Sought Form ";
            this.modalBody1 = "Relief sought needs file or data";
            this.modalBody2 = "Or files uploaded that contain Relief sought";
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
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}

footer {
  position: absolute;
  bottom: 0;
}
