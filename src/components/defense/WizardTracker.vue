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
          <Btn3 @change-form="changeForm"
                @show-dialog="showDialog" v-if="isVisible"></Btn3>
                
        </v-layout>             
    </v-card>
 
  </div>
</template>
<script>
import Btn1 from '@/components/defense/Btn1.vue';
import Btn2 from '@/components/defense/Btn2.vue';
import Btn3 from '@/components/defense/Btn3.vue';
import Btnexit from '@/components/defense/Btn-exit.vue';

export default {
   data(){
    return{
      caseStatus: this.$store.getters.getCase?this.$store.getters.getCase.status:0,
      isVisible: true
    }
  },
  components:{
        Btn1,
        Btn2,
        Btn3,
        Btnexit
  },
  methods:{
    changeForm(e){
      this.$emit('change-form', e);
    },
    showDialog(e){
      this.$emit('show-dialog', e);

    }
  },
  async created(){
      var defend = this.$store.getters.getDefendant;
      var user = this.$store.getters.getArbitUser;

      if(defend && user){
          if ( defend.CompanyId === user.CompanyId) {
               this.isVisible = await true;
          }else{
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

