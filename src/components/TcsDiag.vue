<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" scrollable max-width="500px">
      <v-card>
        <v-card-title>Terms and Conditions</v-card-title>
        <v-divider></v-divider>
        <v-flex text-lg-center>
          <v-card-subtitle
            ><strong
              >eGavel Digital Dispute Resolution Platform</strong
            ></v-card-subtitle
          >
        </v-flex>
        <v-divider></v-divider>
        <v-flex text-lg-center>
          <v-card-subtitle
            >RULES OF DISPUTE RESOLUTION FOR MOTOR VEHICLE COLLISION INSURANCE
            RECOVERY AND LIABIITY CLAIMS (1 JUNE 2020)</v-card-subtitle
          >
        </v-flex>
        <v-card-text style="height: 300px;">
          <p>
            The Standard Procedure Rules are closely based on the UNCITRAL
            Dispute resolution Rules (2010) and shall apply to the conduct of a
            dispute resolution under the Platform’s Rules.
          </p>
          <p>
            These Rules provide for ad hoc dispute resolution based on the
            UNCITRAL Dispute resolution Rules (2010), with the eGavel platform
            assuming the role of the parties’ chosen appointing authority.
            Certain changes and additions have been made to facilitate the
            application of the Rules in the context of current dispute
            resolution legislation in Southern Africa. These changes and
            additions have been deliberately kept to a minimum.
          </p>
          <p>
            By electing to use and apply these Rules of the eGavel platform and
            the parties agree to submit to the authority of the platform for the
            purposes of the platform exercising its functions in terms of the
            Rules and the parties agree to pay on demand any fees and
            disbursements as may be levied by the platform in its sole
            discretion.
          </p>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="returnDecision(false)"
            >I Disagree</v-btn
          >
          <v-btn color="blue darken-1" text @click="returnDecision(true)"
            >I Agree</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      dialogm1: ""
    };
  },
  props: {
    dialog: {
      type: Boolean
    }
  },
  methods: {
    returnDecision(yesNo) {
      this.$emit("descision", yesNo);
    }
  }
};
</script>
