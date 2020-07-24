<template>
    <div>
        <v-btn  :style="{backgroundColor: getStep, color: getColor}" @click="sendEvent" depressed large>
            Save/Submit
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
            if (this.$store.getters.getStep == 2 && this.$store.getters.isApportionValid && 
                (!this.$store.getters.getIsFormValid)) {
                    this.dialogData.modalHeader = "Can't Do";
                    this.dialogData.modalBody1 = "Apportionment is not valid";
                    this.dialogData.modalBody2 = "Complete apportionment form";
                    this.dialogData.modalBody3 = "And, Kool is the rool";

                    this.$emit('show-dialog', this.dialogData); 
                    return;
            }
            if(this.$store.getters.getStep == 2 && this.$store.getters.getIsFormValid){
                this.$emit('change-form', 3);
                return;
            }
            if(this.$store.getters.isApportionmentValid){
              this.$emit('change-form', 3);
            }else{
                this.dialogData.modalHeader = "Can't Do";
                this.dialogData.modalBody1 = "Apportionment is not valid";
                this.dialogData.modalBody2 = "Complete Apportionment form";
                this.dialogData.modalBody3 = "And, Kool is the rool";

                this.$emit('show-dialog', this.dialogData);
            }
        }
    }

}
</script>