<template>
  <v-layout row>
    <v-flex xs12 sm6 md8 offset-md2>
      <YesNoDiag
        :dialog="dialog"
        :heading="heading"
        :btn1Txt="btn1Txt"
        :btn2Txt="btn2Txt"
        @descision="fileClaimCheck"
      ></YesNoDiag>
      <v-card>
        <v-img
          src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
          height="200px"
        >
        </v-img>
        <v-card-title primary-title>
          <div>
            <div class="headline">
              Click Save to edit later or submit to complete the insured's
              motion
            </div>
            <span class="grey--text">{{ displayMsg }}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn text @click="saveClaim" :disabled="disabled">Save</v-btn>
          <v-btn text :disabled="disabled">Submit for opinion</v-btn>
          <v-btn
            text
            color="purple"
            @click="dialog = true"
            :disabled="submitDisabled"
            >Submit for Resolution</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import caseStatus from "../status-enums/caseStatus";
import poc from "@/status-enums/poc";
import YesNoDiag from "@/components/YesNoDiag.vue";
import caseModels from "@/status-enums/tables.js";

export default {
  components: {
    YesNoDiag
  },
  data() {
    return {
      claimant: {},
      defendant: {},
      msg: {},
      displayMsg: "",
      claimValid: false,
      dialog: false,
      heading: "Confirm submission",
      disabled: false,
      btn1Txt: "No",
      btn2Txt: "Yes",
      submitDisabled: false,
      link: process.env.VUE_APP_URL,
      inbox: process.env.VUE_APP_INBOX
    };
  },
  async created() {
    if (this.$store.getters.isCaseValid) {
      if (this.$store.getters.getLociFiles.length > 0) {
        this.displayMsg = "Fields captured are valid";
      } else {
        this.displayMsg =
          "Vehicle Registration and Insurance docs must be uploaded";
        this.submitDisabled = true;
      }
      return;
    } else {
      if (this.$store.getters.isClaimantCaseValid) {
        this.displayMsg = "Case is not complete - only save permitted";
        this.submitDisabled = true;
      } else {
        this.disabled = true;
        this.submitDisabled = true;
        this.displayMsg = "Case and Insured must be captured - to save!";
      }
    }
  },
  async beforeDestroy() {
    await this.$store.dispatch("doCaseValid", false);
  },
  methods: {
    fileClaimCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        this.fileClaim();
      }
    },
    setIdees(obj) {
      obj.ClaimantId = this.$store.getters.getClaimantId;
      return obj;
    },
    async findDefendants() {
      var url = `defendants/case/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants wiz 7 " + err);
      }
    },
    async saveClaim() {
      if (await this.$store.getters.isDefendantValid) {
        await this.saveClaimant(); //can only save claimant when claimant and defendant valid
        await this.saveCase();
        await this.saveDefendant();
        if (await this.$store.getters.isLociStandiValid) {
          await this.saveLoci();
          await this.saveLociFiles();
        }
        if (await this.$store.getters.isCoaValid) {
          await this.saveCoa();
          await this.saveCoaFiles();
        }
        if (this.$store.getters.isMeritsValid) {
          await this.saveMerits();
          await this.saveMeritFiles();
        }
        if (this.$store.getters.isQuantaValid) {
          await this.saveQuanta();
          await this.saveQuantaFiles();
        }
        if (this.$store.getters.isReliefSoughtValid) {
          await this.saveReliefSought();
          await this.saveReliefFiles();
        }
        if (this.$store.getters.isCaseUpdated) {
          await this.$store.dispatch("doCaseUpdated", false);
          this.$router.push("/cases");
        }
      }
      //console.log('create loci def id '+ JSON.stringify(this.$store.getters.getDefendantId));
    },
    async saveLoci() {
      if (await this.$store.getters.isNewLoci) {
        try {
          var loci = await this.setIdees(this.$store.getters.getLoci);
          if (!loci) {
            throw "LocusStandi cannot be null in insert wiz 8";
          }
          var lociObj = {
            url: `locistatements`,
            writeObj: loci,
            id: caseModels.LOCI
          };
          await this.$store.dispatch("createObj", lociObj);
          await this.$store.dispatch("doNewLoci", false);

          this.displayMsg = "New Loci inserted successfully";
        } catch (err) {
          console.log("New Loci not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isLociUpdated) {
          try {
            loci = await this.$store.getters.getLoci;
            if (!loci) {
              throw "LocusStandi cannot be null in update wiz 8";
            }
            lociObj = {
              url: `locistatements/${await this.$store.getters.getLociId}`,
              obj: loci,
              id: caseModels.LOCI
            };
            await this.$store.dispatch("updateObj", lociObj);
            await this.$store.dispatch("doLociUpdated", false);

            this.displayMsg = "Loci updated successfully";
            var findObj = {
              url: `locistatements/${this.$store.getters.getLociId}`,
              id: caseModels.LOCI
            };
            await this.$store.dispatch("findObjByPk", findObj);
          } catch (err) {
            console.log("Loci not updated " + err);
          }
        }
      }
    },
    async saveLociFiles() {
      if ((await this.$store.getters.getLociFiles) != null) {
        try {
          const filteredFiles = await this.$store.getters.getLociFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doLociFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              LocusStandiId: this.$store.getters.getLociId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `locifiles/${this.$store.getters.getLociId}`,
              id: caseModels.LOCI
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "loci files inserted";
          }
        } catch (err) {
          console.log("Unable to insert locus Standi file names " + err);
        }
      }
    },
    async saveCoa() {
      if (await this.$store.getters.isNewCoa) {
        try {
          //console.log('saveCoa before idees ' + JSON.stringify(this.$store.getters.getCoa));
          var coa = await this.setIdees(this.$store.getters.getCoa);
          if (!coa) {
            throw "Jurisdiction cannot be null in insert wiz 8";
          }
          var coaObj = {
            url: `coastatements`,
            writeObj: coa,
            id: caseModels.COA
          };
          //console.log('saveCoa before idees ' + JSON.stringify(coa));
          await this.$store.dispatch("createObj", coaObj);
          await this.$store.dispatch("doNewCoa", false);
          this.displayMsg = "New Jurisdiction inserted successfully";
        } catch (err) {
          this.displayMsg = "New Jurisdiction not inserted " + err;
          console.log("New Coa not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isCoaUpdated) {
          try {
            coa = await this.$store.getters.getCoa;
            //console.log('coa in wiz 8 '+ JSON.stringify(coa))
            if (!coa) {
              throw "Jurisdiction cannot be null in update wiz 8";
            }
            coaObj = {
              url: `coastatements/${await this.$store.getters.getCoaId}`,
              obj: coa,
              id: caseStatus.COA
            };
            await this.$store.dispatch("updateObj", coaObj);
            await this.$store.dispatch("doCoaUpdated", false);

            var findObj = {
              url: `coastatements/${await this.$store.getters.getCoaId}`,
              id: caseModels.COA
            };
            await this.$store.dispatch("findObjByPk", findObj);

            this.displayMsg = "Jurisdiction updated successfully";
          } catch (err) {
            console.log("Coa not updated " + err);
            this.displayMsg = "Error updating Jurisdiction " + err;
          }
        }
      }
    },
    async saveCoaFiles() {
      if ((await this.$store.getters.getCoaFiles) != null) {
        try {
          const filteredFiles = await this.$store.getters.getCoaFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doCoaFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              CoaId: this.$store.getters.getCoaId
            });
          });
          if (retArr.length > 0) {
            console.log("coaid " + this.$store.getters.getCoaId);
            var fileObj = {
              files: retArr,
              url: `coafiles/${this.$store.getters.getCoaId}`,
              id: caseModels.COA
            };
            this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Jurisdiction files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert Jurisdiction file names " + err);
        }
      }
    },
    async saveMerits() {
      if (await this.$store.getters.isNewMerit) {
        try {
          var merit = await this.setIdees(await this.$store.getters.getMerit);
          if (!merit) {
            throw "Merits cannot be null in insert wiz 8";
          }
          var meritObj = {
            url: `meritstatements`,
            writeObj: merit,
            id: caseModels.MERITS
          };
          await this.$store.dispatch("createObj", meritObj);
          await this.$store.dispatch("doNewMerit", false);
          this.displayMsg = "Merit inserted successfully";
        } catch (err) {
          this.displayMsg = "Error inserting new Merit " + err;
        }
      } else {
        if (await this.$store.getters.isMeritUpdated) {
          try {
            merit = await this.$store.getters.getMerit;
            if (!merit) {
              throw "Merits cannot be null in update wiz 8";
            }
            meritObj = {
              url: `meritstatements/${this.$store.getters.getMeritId}`,
              obj: merit,
              id: caseModels.MERITS
            };
            await this.$store.dispatch("updateObj", meritObj);
            await this.$store.dispatch("doMeritUpdated", false);

            this.displayMsg = "Merit updated successfully";
            var findObj = {
              url: `meritstatements/${this.$store.getters.getMeritId}`,
              id: caseModels.MERITS
            };
            await this.$store.dispatch("findObjByPk", findObj);
          } catch (err) {
            this.displayMsg = "Error updating Merit " + err;
          }
        }
      }
    },
    async saveMeritFiles() {
      if ((await this.$store.getters.getMeritFiles) != null) {
        try {
          const filteredFiles = await this.$store.getters.getMeritFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doMeritFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              MeritId: this.$store.getters.getMeritId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `meritfiles/${this.$store.getters.getMeritId}`,
              id: caseModels.MERITS
            };
            this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Merit files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert Merits file names " + err);
        }
      }
    },
    async saveReliefSought() {
      if (await this.$store.getters.isNewRelief) {
        try {
          var reliefSought = await this.setIdees(
            await this.$store.getters.getReliefSought
          );
          if (!reliefSought) {
            throw "Relief Sought cannot be null in insert wiz 8";
          }
          var reliefObj = {
            url: `reliefstatements`,
            writeObj: reliefSought,
            id: caseModels.RELIEF
          };
          await this.$store.dispatch("createObj", reliefObj);
          await this.$store.dispatch("doNewRelief", false);

          this.displayMsg = "Relief Sought inserted successfully";
        } catch (err) {
          console.log("New Relief sought not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isReliefUpdated) {
          try {
            var relief = await this.$store.getters.getReliefSought;
            if (!relief) {
              throw "Relief Sought cannot be null in update wiz 8";
            }
            reliefObj = {
              url: `/reliefstatements/${await this.$store.getters
                .getReliefSoughtId}`,
              obj: relief,
              id: caseModels.RELIEF
            };
            await this.$store.dispatch("updateObj", reliefObj);
            await this.$store.dispatch("doReliefUpdated", false);
            var findObj = {
              url: `reliefstatements/${await this.$store.getters
                .getReliefSoughtId}`,
              id: caseModels.RELIEF
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "ReliefSought updated successfully";
          } catch (err) {
            console.log("Relief sought not updated " + err);
          }
        }
      }
    },
    async saveReliefFiles() {
      if ((await this.$store.getters.getReliefSoughtFiles) != null) {
        try {
          const filteredFiles = await this.$store.getters.getReliefSoughtFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doReliefSoughtFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ReliefSoughtId: this.$store.getters.getReliefSoughtId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `relieffiles/${await this.$store.getters.getReliefSoughtId}`,
              id: caseModels.RELIEF
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "ReliefSought files inserted";
          }
        } catch (err) {
          console.log("Unable to insert ReliefSought file names " + err);
        }
      }
    },
    async saveQuanta() {
      if (await this.$store.getters.isNewQuanta) {
        try {
          var quanta = await this.setIdees(await this.$store.getters.getQuanta);
          if (!quanta) {
            throw "Quantum cannot be null in insert wiz 8";
          }
          var quantaObj = {
            url: `quantumstatements`,
            writeObj: quanta,
            id: caseModels.QUANTUM
          };
          await this.$store.dispatch("createObj", quantaObj);
          await this.$store.dispatch("doNewQuanta", false);

          this.displayMsg = "Quantum inserted successfully";
        } catch (err) {
          console.log("New Quanta not inserted " + err);
        }
      } else {
        if (await this.$store.getters.isQuantaUpdated) {
          try {
            quanta = await this.$store.getters.getQuanta;
            if (!quanta) {
              throw "Quantum cannot be null in update wiz 8";
            }
            quantaObj = {
              url: `/quantumstatements/upd/${await this.$store.getters
                .getQuantaId}`,
              obj: quanta,
              id: caseModels.QUANTUM
            };
            await this.$store.dispatch("updateObj", quantaObj);
            await this.$store.dispatch("doQuantaUpdated", false);

            var findObj = {
              url: `quantumstatements/${await this.$store.getters.getQuantaId}`,
              id: caseModels.QUANTUM
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "Quantum updated successfully";
          } catch (err) {
            console.log("Quanta not updated " + err);
          }
        }
      }
    },
    async saveQuantaFiles() {
      if ((await this.$store.getters.getQuantaFiles) != null) {
        try {
          const filteredFiles = await this.$store.getters.getQuantaFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doQuantaFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              QuantumId: this.$store.getters.getQuantaId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `quantumfiles/${await this.$store.getters.getQuantaId}`,
              id: caseModels.QUANTUM
            };
            await this.$store.dispatch("createFiles", fileObj);
            this.displayMsg = "Quanta files inserted";
          }
        } catch (err) {
          console.log("Unable to insert Quanta file names " + err);
        }
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
          console.log("Error creating claimant " + err);
        }
      } else {
        if (await this.$store.getters.isClaimantUpdated) {
          try {
            var claimant = this.$store.getters.getClaimant;
            if (!claimant) {
              throw "Insured cannot be null in update wiz 8";
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

            this.displayMsg = "Claimant updated";
          } catch (err) {
            console.log("Error updating claimant " + err);
          }
        }
      }
      //console.log('Is claimant valid '+this.$store.getters.isClaimantValid);
    },
    async saveDefendant() {
      if (await this.$store.getters.isNewDefendant) {
        try {
          var defend = await this.$store.getters.getDefendant;
          defend.ArbitUserId = null; //important will not write without this -- sequelize bug??
          defend.ArbitCaseId = this.$store.getters.getCase.id;
          await this.$store.dispatch("createDefendant", defend);

          this.displayMsg = "3rd party created";
          await this.$store.dispatch("doNewDefendant", false);
        } catch (err) {
          console.log("error creating third party " + err);
        }
      } else {
        if (await this.$store.getters.isDefendantUpdated) {
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
    },
    async updateClaimant() {
      try {
        await this.$store.dispatch("doNewClaimant", false);
        await this.$store.dispatch("doClaimantUpdated", true);

        var claimant = await this.$store.getters.getClaimant;
        claimant.StatusId = caseStatus.PENDINGTHIRD;

        await this.$store.dispatch("doClaimant", claimant);
        if (!claimant) {
          throw "Insured cannot be null when updating Claimant status wiz 8";
        }

        await this.saveClaimant();
      } catch (err) {
        this.displayMsg = err;
      }
    },
    async updateDefendant(defend) {
      try {
        await this.$store.dispatch("doNewDefendant", false);
        await this.$store.dispatch("doDefendantUpdated", true);

        var defendant = {};
        defendant.id = defend.id;
        defendant.StatusId = caseStatus.PENDINGTHIRD;

        await this.$store.dispatch("doDefendant", defendant);
        await this.$store.dispatch("initDefendantId", defendant.id);

        if (!defendant) {
          throw "Insured cannot be null when updating Defendant status wiz 8";
        }

        await this.saveDefendant();
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
            this.$store.dispatch("doDefendantValid", false);
            this.displayMsg = "Case updated successfully";
          } catch (err) {
            console.log("Case not updated " + err);
          }
        }
      }
    },
    async updateEachDefendant(multi, callback) {
      for (var index = 0; index < multi.length; index++) {
        await callback(multi[index]);
      }
    },
    async fileClaim() {
      if (await this.$store.getters.isCaseValid) {
        await this.saveClaim();
        await this.findDefendants();
        var defendants = await this.$store.getters.getDefendants;
        console.log("defs " + (await this.$store.getters.getDefendants.length));
        await this.$store.dispatch("doViewStatus", 0);
        var msgs = [];
        var msg = "";

        if (defendants && defendants.length > 0) {
          await this.updateEachDefendant(defendants, async defend => {
            msgs = await this.sendDefMsg(defend);
            if (msgs.length < 1) {
              await this.updateDefendant(defend);
              msg = "Insured action filed - ";
              msg +=
                defendants.length === 1
                  ? "Third Party notified"
                  : "Third Parties notified";
            } else {
              msg = "Error sending msg - ";
              msgs.forEach(errMsg => {
                msg += errMsg.msgTo;
              });
              msg += "- contact admin";
            }
          });
        } else {
          this.displayMsg =
            "Click button Multi and click Save/Submit to save Third Parties";
          return;
        }
        if (msgs.length < 1) {
          await this.updateClaimant();
        }
        this.$router.push({
          name: "case-filed",
          params: {
            mailMsg: msg
          }
        });
        //console.log(' case is ' + this.$store.getters.getDefendant);
      } else {
        this.displayMsg = "Case capture is not complete!";
      }
    },
    async setClaimMsg(defend) {
      var Case = this.$store.getters.getCase;
      var particulars =
        Case.PocId === poc.MULTIPLE
          ? "Multiple vehicle collision"
          : "light vehicle collision";
      const msg = {
        to: defend.email,
        from: this.inbox,
        subject: `Reference # ${Case.id} pending Third party response`,
        text: `${particulars} -- Third Party: ${defend.fullName} \nLog into Dispute Resolution system to view Action\n${this.link}`
      };
      return msg;
    },
    async sendDefMsg(defend) {
      var msgs = [];
      var dispMsg = {};
      var msg = null;
      try {
        msg = await this.setClaimMsg(defend);
        await this.sendEmail(msg);
        dispMsg = {
          desc: "Insured Filed and Third Party notified",
          err: null
        };
        msgs.push(dispMsg);
      } catch (err) {
        dispMsg = {
          desc: `Error email To: ${msg.to} - ${err}`,
          msgTo: msg.to,
          err: err
        };
        msgs.push(dispMsg);
        console.log(`Error email To: ${msg.to} - ${err}`);
      }
      var retMsgs = await msgs.filter(msg => {
        return msg.err != null;
      });
      return retMsgs;
    },
    async sendEmail(msg) {
      this.$store
        .dispatch("sendEmail", msg)
        .then(response => {
          console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
          //throw new Error()
        });
    }
  }
};
</script>
