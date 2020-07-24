<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
            <h2>Miscellaneous Docs</h2>
            <br/>
           <v-textarea
                name="other-docs"
                box
                label="other docs"
                v-model="dOtherDocs.otherDocs"
                auto-grow
                value=""
                >
            </v-textarea>
         </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
  export default {
    data: () => ({
      dOtherDocs:{
        otherDocs: ''
      },
    }),
    props:{ 
        propOtherDocsSummary: {
            type: String
        }
     },  
    computed: {
      icon () {
        return this.icons[this.iconIndex]
      }
    },
    methods: {
      toggleMarker () {
        this.marker = !this.marker
      },
      sendMessage () {
        this.resetIcon()
        this.clearMessage()
      },
      clearMessage () {
        this.message = ''
      },
      resetIcon () {
        this.iconIndex = 0
      },
      changeIcon () {
        this.iconIndex === this.icons.length - 1
          ? this.iconIndex = 0
          : this.iconIndex++
      }
    },
    beforeDestroy() {
      this.$emit('update-other', this.dOtherDocs); 
    },
    created(){
      console.log('OtherDocs props ' + this.propOtherDocsSummary);
      if (this.propOtherDocsSummary != null) this.dOtherDocs.otherDocs = this.propOtherDocsSummary;
    }
  }
</script>