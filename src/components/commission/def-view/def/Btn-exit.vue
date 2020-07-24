<template>
    <v-btn  :style="{backgroundColor: getStep, color: getColor}" text small 
    @click="navigateTo">
        exit view Third party defense
      </v-btn>
</template>
<script>
export default {
    methods:{
        navigateTo(){
            console.log('btn-exit def '+ this.$store.getters.isMultiAccident);
            if (this.$store.getters.isMultiAccident){
                this.$router.push({
                    name: 'comm-multi-defs'
                });
                return;
            }else{
                this.$router.push({
                    name: 'com-view-def'
                });
                return;
            }
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
