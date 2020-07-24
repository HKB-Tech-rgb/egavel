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
              Click Save to edit later or submit to file from 3rd party wizard
            </div>
            <span class="grey--text">{{ displayMsg }}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn primary @click="saveClaim">Save Counter Claim</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import caseModels from "@/status-enums/tables.js";
export default {
  data() {
    return {
      claimant: {},
      defendant: {},
      msg: {},
      displayMsg: ""
    };
  },
  async created() {
    if (this.$store.getters.isClaimantCaseValid) {
      this.displayMsg = "Fields captured are valid";
    } else {
      this.displayMsg = "Case is not complete - only save permitted";
    }
  },
  methods: {
    setIdees(obj) {
      obj.DefendantId = this.$store.getters.getDefendantId;
      return obj;
    },
    async saveClaim() {
      try {
        if (this.$store.getters.isDefendantValid) {
          await this.saveDefendant();
        }
        if (this.$store.getters.isCcCoaValid) {
          await this.saveCoa();
          await this.saveCoaFiles();
        }
        if (this.$store.getters.isCcMeritValid) {
          await this.saveMerits();
          await this.saveMeritFiles();
        }
        if (this.$store.getters.isCcReliefValid) {
          await this.saveReliefSought();
          await this.saveReliefFiles();
        }
        if (this.$store.getters.isCcQuantaValid) {
          await this.saveQuanta();
          await this.saveQuantaFiles();
          this.$store.dispatch("doProcessCounterClaim", true);
        }
      } catch (err) {
        console.log(err);
      }
      //console.log('create loci def id '+ JSON.stringify(this.$store.getters.getDefendantId));
    },

    async saveCoa() {
      if (await this.$store.getters.isNewccCoa) {
        try {
          var coa = await this.setIdees(this.$store.getters.getCcCoa);
          if (!coa) {
            throw "Jurisdiction cannot be null in insert wiz 5";
          }
          var coaObj = {
            url: `coastatementsCC`,
            writeObj: coa,
            id: caseModels.COUNTERCOA
          };
          //console.log('saveCoa before idees ' + JSON.stringify(coa));

          await this.$store.dispatch("createObj", coaObj);
          await this.$store.dispatch("doNewccCoa", false);

          this.displayMsg = "New Counter Jurisdiction inserted successfully";
        } catch (err) {
          this.displayMsg = "New Counter Jurisdiction not inserted " + err;
          console.log("New Coa not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isCcCoaUpdated) {
          try {
            coa = await this.$store.getters.getCcCoa;
            if (!coa) {
              throw "Counter Claim Juridiction cannot be null in update wiz 5";
            }
            coaObj = {
              url: `coastatementsCC/${await this.$store.getters.getCcCoaId}`,
              writeObj: coa,
              id: caseModels.COUNTERCOA
            };
            await this.$store.dispatch("updateObj", coaObj);
            await this.$store.dispatch("doCcCoaUpdated", false);

            var findObj = {
              url: `coastatementsCC/${this.$store.getters.getCcCoaId}`,
              id: caseModels.COA
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "Counter Claim Jurisdiction updated successfully";
          } catch (err) {
            console.log("Counter Claim Jurisdiction not updated " + err);
            this.displayMsg = "Error updating Counter Claim Juridiction " + err;
          }
        }
      }
    },
    async saveCoaFiles() {
      if (this.$store.getters.getCcCoaFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getCcCoaFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doCcCoaFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ccCoaId: this.$store.getters.getCcCoaId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `coafilesCC/${await this.$store.getters.getCcCoaId}`,
              id: caseModels.COA
            };
            this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Counter Jurisdiction files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert Cause of action file names " + err);
        }
      }
    },
    async saveMerits() {
      if (await this.$store.getters.isNewccMerit) {
        try {
          var merit = await this.setIdees(await this.$store.getters.getCcMerit);
          if (!merit) {
            throw "Counter Merits cannot be null in insert wiz 5";
          }
          var meritObj = {
            url: `meritstatementsCC`,
            writeObj: merit,
            id: caseModels.COUNTERMERIT
          };
          await this.$store.dispatch("createObj", meritObj);
          await this.$store.dispatch("doNewccMerit", false);

          this.displayMsg = "Counter Merit inserted successfully";
        } catch (err) {
          this.displayMsg = "Error inserting new Counter Merit " + err;
        }
      } else {
        if (await this.$store.getters.isCcMeritUpdated) {
          try {
            merit = await this.$store.getters.getCcMerit;
            if (!merit) {
              throw "Merits cannot be null in update wiz 8";
            }
            meritObj = {
              url: `meritstatementsCC/${await this.$store.getters
                .getCcMeritId}`,
              obj: merit,
              id: caseModels.COUNTERMERIT
            };
            await this.$store.dispatch("updateObj", meritObj);
            await this.$store.dispatch("doCcMeritUpdated", false);
            var findObj = {
              url: `meritstatementsCC/${this.$store.getters.getCcMeritId}`,
              id: caseModels.COUNTERMERIT
            };
            await this.$store.dispatch("findObjByPk", findObj);

            this.displayMsg = "Merits updated successfully";
          } catch (err) {
            this.displayMsg = "Error updating Merit " + err;
          }
        }
      }
    },
    async saveMeritFiles() {
      if (this.$store.getters.getCcMeritFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getCcMeritFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doCcMeritFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ccMeritId: this.$store.getters.getCcMeritId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `meritfilesCC/${await this.$store.getters.getCcMeritId}`,
              id: caseModels.COUNTERMERIT
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "Counter Merit files inserted";
          }
        } catch (err) {
          console.log("Unable to insert Counter Merits file names " + err);
        }
      }
    },
    async saveReliefSought() {
      if (this.$store.getters.isNewccRelief) {
        try {
          var reliefSought = await this.setIdees(
            await this.$store.getters.getCcRelief
          );
          if (!reliefSought) {
            throw "Relief Sought cannot be null in insert wiz 8";
          }
          var reliefObj = {
            url: `reliefstatementsCC`,
            writeObj: reliefSought,
            id: caseModels.COUNTERRELIEF
          };
          await this.$store.dispatch("createObj", reliefObj);
          await this.$store.dispatch("doNewccRelief", false);

          this.displayMsg = "Counter Claim Relief Sought inserted successfully";
        } catch (err) {
          console.log("Counter Claim Relief sought not inserted " + err);
        }
      } else {
        if (this.$store.getters.isCcReliefUpdated) {
          try {
            var relief = await this.$store.getters.getCcRelief;
            if (!relief) {
              throw "Counter Relief cannot be null in update wiz 5";
            }
            reliefObj = {
              url: `/reliefstatementsCC/${await this.$store.getters
                .getCcReliefId}`,
              obj: relief,
              id: caseModels.COUNTERRELIEF
            };
            await this.$store.dispatch("updateObj", reliefObj);
            await this.$store.dispatch("doCcReliefUpdated", false);
            var findObj = {
              url: `reliefstatementsCC/${await this.$store.getters
                .getCcReliefId}`,
              id: caseModels.COUNTERRELIEF
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "Counter Claim Relief updated successfully";
          } catch (err) {
            console.log("Counter Relief not updated " + err);
          }
        }
      }
    },
    async saveReliefFiles() {
      if (this.$store.getters.getCcReliefFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getCcReliefFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doCcReliefFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ccReliefSoughtId: this.$store.getters.getCcReliefId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `relieffilesCC/${await this.$store.getters.getCcReliefId}`,
              id: caseModels.COUNTERRELIEF
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "Counter Relief files inserted";
          }
        } catch (err) {
          console.log("Unable to insert Counter Relief file names " + err);
        }
      }
    },
    async saveQuanta() {
      if (await this.$store.getters.isNewccQuanta) {
        try {
          var quanta = await this.setIdees(
            await this.$store.getters.getCcQuanta
          );
          if (!quanta) {
            throw "Counter Quantum cannot be null in insert wiz 5";
          }
          var quantaObj = {
            url: `quantumstatementsCC`,
            writeObj: quanta,
            id: caseModels.COUNTERQUANTA
          };
          await this.$store.dispatch("createObj", quantaObj);
          await this.$store.dispatch("doNewccQuanta", false);

          this.displayMsg = "Counter Quantum inserted successfully";
        } catch (err) {
          console.log("New Counter Quanta not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isCcQuantaUpdated) {
          try {
            quanta = await this.$store.getters.getCcQuanta;
            if (!quanta) {
              throw "Quantum cannot be null in update wiz 8";
            }
            quantaObj = {
              url: `/quantumstatementsCC/${await this.$store.getters
                .getCcQuantaId}`,
              obj: quanta,
              id: caseModels.COUNTERQUANTA
            };
            await this.$store.dispatch("updateObj", quantaObj);
            await this.$store.dispatch("doCcQuantaUpdated", false);
            var findObj = {
              url: `quantumstatementsCC/${await this.$store.getters
                .getCcQuantaId}`,
              id: caseModels.COUNTERQUANTA
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "Counter Quanta updated successfully";
          } catch (err) {
            console.log("Quanta not updated " + err);
          }
        }
      }
    },
    async saveQuantaFiles() {
      if (this.$store.getters.getCcQuantaFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getCcQuantaFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doCcQuantaFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ccQuantumId: this.$store.getters.getCcQuantaId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `quantumfilesCC/${await this.$store.getters.getCcQuantaId}`,
              id: caseModels.COUNTERQUANTA
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "Counter Quanta files inserted";
          }
        } catch (err) {
          console.log("Unable to insert Counter Quanta file names " + err);
        }
      }
    },
    async saveDefendant() {
      if (this.$store.getters.isDefendantUpdated) {
        try {
          await this.$store.dispatch(
            "updateDefendant",
            this.$store.getters.getDefendant
          );
          await this.$store.dispatch("doDefendantUpdated", false);
          await this.$store.dispatch(
            "findDefendant",
            this.$store.getters.getDefendantId
          );
          this.displayMsg = "Third party updated";
        } catch (err) {
          console.log("Error updating third party " + err);
        }
      }
    }
  }
};
</script>
