<template>
    <div>
        <v-btn  :style="{backgroundColor: getStep, color: getColor}" @click="sendEvent" depressed large>
            Apportionment
        </v-btn>
    </div>
</template>
<script>
export default {
    data: () => ({
        dialogData:{
          modalHeader:'',
          modalBody1:'',
          modalBody2:'',
          modalBody3:'',
        }
    }),
    computed: {
        getStep() {
            if (this.$store.getters.getStep == 2) {
                if(this.$store.getters.isBtnColorInvalid){
                    return 'red';
                }
                return 'blue';
            } 
            return 'yellow';
        },
        getColor(){
            if (this.$store.getters.getStep == 2) {
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
            if (this.$store.getters.getStep == 1 && this.$store.getters.isDefenseValid && 
                (!this.$store.getters.getIsFormValid)) {
                    this.dialogData.modalHeader = "Can't Do";
                    this.dialogData.modalBody1 = "Defense is not valid";
                    this.dialogData.modalBody2 = "Complete defense form";
                    this.dialogData.modalBody3 = "And, Kool is the rool";

                    this.$emit('show-dialog', this.dialogData); 
                    return;
            }
            if(this.$store.getters.getStep == 1 && this.$store.getters.getIsFormValid){
                this.$emit('change-form', 2);
                return;
            }
            if(this.$store.getters.isDefenseValid){
              this.$emit('change-form', 2);
            }else{
                this.dialogData.modalHeader = "Can't Do";
                this.dialogData.modalBody1 = "Defense is not valid";
                this.dialogData.modalBody2 = "Complete Defense form";
                this.dialogData.modalBody3 = "And, Kool is the rool";

                this.$emit('show-dialog', this.dialogData);
            }
        }
    }

}
</script>