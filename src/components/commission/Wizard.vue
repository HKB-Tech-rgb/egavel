<template>
 <div>
    <v-container fluid>
      <div v-if="!isMobile">
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
      </div>
      <div v-if="isMobile"><CommNav @change-form="changeForm"/></div>
      <div :class="{'open':showNav,'content':isMobile }">
        <div id="navigation-icon" v-if="isMobile"
          @click="showNav = !showNav">
          <font-awesome-icon icon="bars" class="icon"/>
          <component :is="stepComponent"/>
        </div>
      </div>
    </v-container>
 </div>
</template>

<script>
import WizardTracker from '@/components/commission/WizardTracker.vue'
import CommNav from '@/components/commission/CommNav.vue'
import ModalDiag from '@/components/ModalDiag.vue'

export default {
  components:{
        WizardTracker,
        ModalDiag,
        CommNav
  },
  data: () => (
    { 
      step: 1,
      isModalVisible: false,
      modalHeader:'',
      modalBody1:'',
      modalBody2:'',
      modalBody3:'',
      showNav: false
  }),
  computed: {
    stepComponent() {
      var step = this.step; 
      this.$store.dispatch("fixStep", step);
      //console.log('in wizard step ' + this.step)
      return () => import(`./Wizard-step${this.$store.getters.getStep}.vue`);
    },
    isMobile(){
      return this.$store.getters.isMobileDevice
    },
  },
  async created(){
    if (this.$route.params.claimId && this.$route.params.defendId){
       try{
         //console.log('this.$route.params '+ JSON.stringify(this.$route.params));
         await this.$store.dispatch('findClaimant', this.$route.params.claimId);
         await this.$store.dispatch('findDefendant', this.$route.params.defendId);
         await this.$store.dispatch('getArbitCase', this.$route.params.arbitId);
         
       }catch(err){
         //console.log('problem finding insured or 3rd party '+ err);
       }
       
    }
    
  },
  methods: {
    adjustStepUp(){
      var c_ase = this.$store.getters.getCase;
      switch (c_ase.status) {
        case c_ase.OPEN:
          if (this.step > 5)
            this.step = 8;
          break;  
      }
    },
    adjustStepDown(){
      var c_ase = this.$store.getters.getCase;
      switch (c_ase.status) {
        case c_ase.OPEN:
          if (this.step > 5)
            this.step = 5;
          break;  
      }
    },
    showModal() {
        this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    changeForm(e){
      this.showNav = false 
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
            //console.log('kuk has happened in DDUserMenu ' + this.step);   
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
body {
  width: 100%;
  height: 0;
  margin:0;
  padding:0;
  font-family:'Segoe UI', Tahoma;
  background-color: #fff;
}
.content {
  position: absolute;
  top: 0;
  width: calc(100% - 60px);
  height: calc(100vh - 60px);
  padding: 0;
  background-color: #fff;
  transition: 1s transform cubic-bezier(0, .12,.14, 1)
}
#navigation-icon {
    padding: 10px;
    margin-right: 10px;
    text-align: left;
    cursor: pointer;
}
.icon{
  font-size: 2rem
}  
.open {
  transform: translateX(300px)
}
footer {
  position: absolute;
  bottom: 0;
}
