<template>
    <div  class="footer">
    
      <v-card height="80px"> 
        
        <v-layout align-start justify-center>
          <Btnexit/>
        </v-layout>
        <v-layout align-end justify-space-around>
          <Btn1 @change-form="changeForm"/>
          <Btn2 @change-form="changeForm"
                @show-dialog="showDialog"/>
                     
        </v-layout>             
    </v-card>
 
  </div>
</template>
<script>
import Btn1 from '@/components/defense/Btn1.vue';
import Btn2 from '@/components/defense/Btn2.vue';
import Btnexit from '@/components/commission/def-view/def/Btn-exit.vue';

export default {
   data(){
    return{
      caseStatus: 0
    }
  },
  components:{
        Btn1,
        Btn2,
        Btnexit
  },
  methods:{
    changeForm(e){
      this.$emit('change-form', e);
    },
    showDialog(e){
      this.$emit('show-dialog', e);

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

