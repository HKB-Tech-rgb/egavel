<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="320">
      <v-card>
        <v-card-title class="headline">{{ heading }}</v-card-title>
        <v-card-text>
          {{ msg }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="returnDecision(false)">
            {{ btn1Txt }}
          </v-btn>
          <v-btn color="green darken-1" text @click="returnDecision(true)">
            {{ btn2Txt }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean
    },
    heading: {
      type: String
    },
    msg: {
      type: String
    },
    btn1Txt: {
      type: String
    },
    btn2Txt: {
      type: String
    }
  },
  methods: {
    returnDecision(yesNo) {
      this.$emit("descision", yesNo);
    }
  }
};
</script>
