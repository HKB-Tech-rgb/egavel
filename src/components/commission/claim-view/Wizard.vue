<template>
 <div>
    <v-container fluid grid-list-xl>

      <component :is="stepComponent"/>
      <v-layout justify-space-between>
          <WizardTracker @change-form="changeForm"/>
      </v-layout>
    </v-container>
 </div>
</template>

<script>
import WizardTracker from '@/components/commission/claim-view/WizardTracker.vue'

export default {
  components:{
      WizardTracker
  },
  data: () => (
    { 
      step: 1,
     
  }),
  computed: {
    stepComponent() {
      var step = this.step; 
      this.$store.commit("setStep", step);
      //console.log('in wizard step ' + this.step)
      return () => import(`./Wizard-step${step}.vue`);
    }
  },
  created(){

    this.$store.commit("setNotInWizard", false);
  },
  methods: {
    changeForm(e){
      this.step = e;
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