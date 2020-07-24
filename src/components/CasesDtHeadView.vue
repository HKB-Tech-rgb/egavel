<template>
  <div>
    <v-layout row justify-center>
      <v-flex xs12 md6 lg3>
        <v-btn @click="newCase">New Case</v-btn>
      </v-flex>
    </v-layout>
    <br />
    <transition name="slide-fade" mode="out-in">
      <v-layout row justify-center v-if="displayMsg">
        <v-flex xs12 md6 lg3>
          <v-card
            style="color:black;font-weight:300;background-color:transparent !important"
            flat
            >{{ displayMsg }}</v-card
          >
        </v-flex>
      </v-layout>
    </transition>
    <v-layout row wrap>
      <v-flex xs12 md6 lg6>
        <v-btn
          class="grey lighten-1"
          block
          style="color:black !important;font-weight:700 !important"
          >{{ colHeadCases }}</v-btn
        >
      </v-flex>
      <v-flex xs12 md6 lg6>
        <v-btn
          class="blue-grey lighten-1"
          block
          style="color:black !important;font-weight:700 !important"
          >{{ colHeadDefCases }}</v-btn
        >
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
export default {
  props: {
    displayMsg: null,
    colHeadCases: null,
    colHeadDefCases: null
  },
  methods: {
    newCase(e) {
      this.$emit("new-case", e);
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}
</style>
