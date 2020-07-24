<template>
    <v-btn  :style="{backgroundColor: getStep, color: getColor}" text small 
    @click="navigateTo">
        exit defense wizard
      </v-btn>
</template>
<script>
export default {
    methods:{
        navigateTo(){
            this.$store.commit("setNotInWizard", true);
            this.$store.dispatch('fixStep', 6);
            this.$router.push({
                name: 'def-create',
                params: {
                    claimId:this.$store.getters.getClaimantId,
                    defendId: this.$store.getters.getDefendantId
                }
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
