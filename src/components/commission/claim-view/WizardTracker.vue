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
        </v-layout>             
    </v-card>
 
  </div>
</template>
<script>
import Btn1 from '@/components/commission/claim-view/Btn1.vue';
import Btn2 from '@/components/commission/claim-view/Btn2.vue';
import Btn3 from '@/components/commission/claim-view/Btn3.vue';
import Btn4 from '@/components/commission/claim-view/Btn4.vue';
import Btnexit from '@/components/commission/claim-view/Btn-exit.vue';

export default {
  data(){
    return{
      caseStatus: this.$store.getters.getCase.status
    }
  },
  components:{
    Btn1,
    Btn2,
    Btn3,
    Btn4,
    Btnexit
   
  },
  methods:{
    changeForm(e){
      this.$emit('change-form', e);
    },
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

