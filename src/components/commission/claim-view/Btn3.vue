<template>
    <div>
        <v-btn  :style="{backgroundColor: getStep, color: getColor}" @click="sendEvent" depressed large>
            Merits of claimant case
        </v-btn>
    </div>
</template>
<script>
export default {
    computed: {
        getStep() {
            if (this.$store.getters.getStep == 3) {
               if(this.$store.getters.isBtnColorInvalid){
                    return 'red';
                } 
                return 'blue';
            } 
            return 'yellow';
        },
        getColor(){
            if (this.$store.getters.getStep == 3) {
                if(this.$store.getters.isBtnColorInvalid){
                    return 'yellow';
                }
                return 'white';
            } 
            return 'black';
        }
    },
    methods:{
        sendEvent(){
            this.$emit('change-form', 3);
                       
        },
    }   
}
</script>