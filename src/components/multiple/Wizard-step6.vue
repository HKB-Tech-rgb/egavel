<template>
  <v-layout row>
    <v-flex xs12 sm6 md8 offset-md2>
      <v-card>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
        >
        </v-img>
        <v-card-title primary-title>
          <div>
            <div class="headline">
              Click Save to edit later - Motion submitted in Insured wizard
            </div>
            <span class="grey--text">{{ displayMsg }}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn text @click="saveClaim">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      claimant: {},
      defendant: {},
      msg: {},
      displayMsg: "",
      claimValid: false,
      link: process.env.VUE_APP_URL
    };
  },
  async created() {
    if ((await this.$store.getters.getCoDefendants.length) > 0) {
      this.displayMsg = "Fields captured are valid";
    } else {
      this.displayMsg = "No 3rd Party actors captured - nothing to save";
    }
  },
  methods: {
    async saveClaim() {
      if ((await this.$store.getters.getCoDefendants.length) > 0) {
        await this.saveClaimant();
        await this.saveCase();
        await this.setUpAndSave();
        await this.findDefendants();
        await this.loadCoDefendants(this.$store.getters.getDefendants);
      }
    },
    async setUpAndSave() {
      var creates = [];
      var updates = [];

      var defendantObjs = Object.assign(
        [],
        await this.$store.getters.getCoDefendants
      );
      var caseId = this.$store.getters.getCase.id;
      await defendantObjs.forEach(defendantObj => {
        //console.log("defendantObj--- " + JSON.stringify(defendantObj.coDefendant));
        if (defendantObj.create) {
          defendantObj.coDefendant.ArbitCaseId = caseId;
          creates.push(defendantObj.coDefendant);
        }
        if (defendantObj.update) {
          updates.push(defendantObj.coDefendant);
        }
      });
      await this.$store.dispatch("doCoDefendants", defendantObjs);

      if (creates.length > 0) {
        await this.createDefendant(creates);
      }

      if (updates.length > 0) {
        await this.updateEachDefend(updates, async defend => {
          await this.updateDefendants(defend);
        });
      }
    },
    async updateEachDefend(updates, callback) {
      for (var i = 0; i < updates.length; i++) {
        callback(updates[i]);
      }
    },
    async saveClaimant() {
      //console.log('this.$store.getters.getClaimant ' + JSON.stringify(this.$store.getters.getClaimant));
      if (await this.$store.getters.isNewClaimant) {
        try {
          await this.$store.dispatch(
            "createClaimant",
            this.$store.getters.getClaimant
          );
          await this.$store.dispatch("doNewClaimant", false);
          this.displayMsg = "New Claimant inserted";
        } catch (err) {
          console.log("Error creating claimant - multiple" + err);
        }
      } else {
        if (await this.$store.getters.isClaimantUpdated) {
          try {
            var claimant = this.$store.getters.getClaimant;
            if (!claimant) {
              throw "Insured cannot be null in update wiz 6 - multiple";
            }

            await this.$store.dispatch(
              "updateClaimant",
              this.$store.getters.getClaimant
            );
            await this.$store.dispatch("doClaimantUpdated", false);
            await this.$store.dispatch(
              "findClaimant",
              this.$store.getters.getClaimantId
            );

            this.displayMsg = "Claimant updated multiple";
          } catch (err) {
            console.log("Error updating claimant multiple " + err);
          }
        }
      }
      //console.log('Is claimant valid '+this.$store.getters.isClaimantValid);
    },
    async createDefendant(defendWrites) {
      try {
        var defendObj = {
          defends: defendWrites,
          url: `defendants/${await this.$store.getters.getCase.id}`
        };
        //console.log('saveDefendant '+ JSON.stringify(defendObj));
        await this.$store.dispatch("createDefendants", defendObj);

        this.displayMsg = "3rd party created - multi";
      } catch (err) {
        console.log("error creating third party multi " + err);
      }
    },
    async updateDefendants(defend) {
      try {
        await this.$store.dispatch("updateDefendant", defend);
        this.displayMsg = "Defendants updated";
      } catch (err) {
        this.displayMsg = err;
      }
    },
    async saveCase() {
      if (await this.$store.getters.isNewCase) {
        try {
          var Case = await this.$store.getters.getCase;

          Case.ClaimantId = await this.$store.getters.getClaimant.id;
          Case.ArbitUserId = await this.$store.getters.getArbitUser.id;

          await this.$store.dispatch("createCase", Case);
          await this.$store.dispatch("doNewCase", false);

          Case = await this.$store.getters.getCase;
          this.displayMsg = "New Case inserted successfully";
        } catch (err) {
          console.log("New Case not inserted " + err);
        }
      } else {
        if (this.$store.getters.isCaseUpdated) {
          try {
            await this.$store.dispatch(
              "updateCase",
              this.$store.getters.getCase
            );
            await this.$store.dispatch("doCaseUpdated", false);
            await this.$store.dispatch(
              "showCase",
              this.$store.getters.getCase.id
            );
            this.displayMsg = "Case updated successfully";
          } catch (err) {
            console.log("Case not updated " + err);
          }
        }
      }
    },
    async findDefendants() {
      var url = `defendants/case/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants wiz 6 " + err);
      }
    },
    async loadCoDefendants(defendants) {
      var coDefendants = [];
      await defendants.forEach(defendant => {
        coDefendants.push({
          coDefendant: defendant
        });
      });
      await this.$store.dispatch("doCoDefendants", coDefendants);
    }
  }
};
</script>
