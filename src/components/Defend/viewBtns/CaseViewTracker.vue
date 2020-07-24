<template>
    <div  class="footer">
    
      <v-card height="80px"> 
        
        <v-layout align-start justify-center>
          <Btnexit/>
        </v-layout>
        <v-layout align-end justify-space-around>
          <Btn1 @change-form="changeForm"/>
          <Btn2 @change-form="changeForm"/>
          <Btn3 @change-form="changeForm"/>
          <Btn4 @change-form="changeForm"/>
          <Btn5 @change-form="changeForm"/>
        </v-layout>             
    </v-card>
 
  </div>
</template>
<script>
import Btn1 from '@/components/Defend/viewBtns/Btn1.vue';
import Btn2 from '@/components/Defend/viewBtns/Btn2.vue';
import Btn3 from '@/components/Defend/viewBtns/Btn3.vue';
import Btn4 from '@/components/Defend/viewBtns/Btn4.vue';
import Btn5 from '@/components/Defend/viewBtns/Btn5.vue';

import Btnexit from '@/components/Defend/viewBtns/Btn-exit.vue';
import caseStatus from '@/status-enums/caseStatus';

export default {
  data(){
    return{
      isVisible: true

    }
  },
  components:{
    Btn1,
    Btn2,
    Btn3,
    Btn4,
    Btn5,
    Btnexit
   
  },
  methods:{
    changeForm(e){
      this.$emit('change-form', e);
    },
  },
  async created(){
      var defend = this.$store.getters.getDefendant;
      var Case = this.$store.getters.getCase
      await this.$store.dispatch('findCase',Case.id);
      
      var user = this.$store.getters.getArbitUser;

      if(defend && user){
          if ( defend.CompanyId === user.CompanyId) {
               this.isVisible = await true;
          }else{
               this.isVisible = await false;
          }
          if (defend.StatusId>caseStatus.OPENED){
              this.isVisible = await false;
          }
      }
  }
}
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

