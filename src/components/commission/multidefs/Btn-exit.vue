<template>
    <v-btn  :style="{backgroundColor: getStep, color: getColor}" text small 
    @click="navigateTo">
        exit wizard
      </v-btn>
</template>
<script>
export default {
    methods:{
        navigateTo(){
            this.$store.dispatch("doDefendantValid", true);
            
            this.$router.push({
                //name: 'com-view-def'
                path: this.$routerHistory.previous().path
            });
        },
        getStep() {
            return 'grey';
        },
        getColor(){
            return 'black';
        }
         
    }, 
     
}
</script>
