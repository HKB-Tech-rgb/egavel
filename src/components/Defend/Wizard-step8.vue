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
              Click Save to edit later or submit to complete third party's
              defense
            </div>
            <span class="grey--text">{{ displayMsg }}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn text @click="saveClaim">Save</v-btn>
          <v-btn
            text
            color="purple"
            @click="teesAndCees = true"
            :disabled="submitDisabled"
            >Submit response
          </v-btn>
        </v-card-actions>
        <TandCDiag :dialog="teesAndCees" @descision="delegateCheck"></TandCDiag>
        <Delegate
          :dialog="delegate"
          :heading="heading"
          :btn1Txt="btn1Txt"
          :btn2Txt="btn2Txt"
          :msg="diagMsg"
          @descision="teesAndCeesMethod"
        ></Delegate>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import caseStatus from "@/status-enums/caseStatus";
import poc from "@/status-enums/poc";
import YesNoDiag from "@/components/YesNoDiag.vue";
import caseModels from "@/status-enums/tables.js";
import TandCDiag from "@/components/TcsDiag.vue";
import Delegate from "@/components/YesNoDiag.vue";
export default {
  components: {
    YesNoDiag,
    TandCDiag,
    Delegate
  },
  data() {
    return {
      claimant: {},
      defendant: {},
      msg: {},
      settleOffer: false,
      displayMsg: "",
      dialog: false,
      teesAndCees: false,
      submitDisabled: false,
      heading: "Submit Response",
      btn1Txt: "No",
      btn2Txt: "Yes",
      delegate: false,
      diagMsg: "",
      link: process.env.VUE_APP_URL,
      inbox: process.env.VUE_APP_INBOX
    };
  },
  async created() {
    this.submitDisabled = false;
    var defLoci = await this.$store.getters.getLociStandiDef;
    if (defLoci) {
      if (this.$store.getters.getLociStandiDefFiles.length > 0) {
        this.displayMsg = "Fields captured are valid";
      } else {
        this.displayMsg =
          "Vehicle Registration and Insurance docs must be uploaded";
        this.submitDisabled = true;
      }
    } else {
      this.submitDisabled = true;
      this.displayMsg =
        "Case is not complete - Third Party Locus Standi required";
    }
  },
  methods: {
    fileClaimCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        this.fileClaim();
      }
    },
    delegateCheck(yesNo) {
      this.teesAndCees = false;
      if (yesNo) {
        this.delegate = true;
        this.heading = "Delegation of Authority";
        this.diagMsg =
          "The user hereby warrants that she/he has the necessary authority to enter into and perform the obligations under this Dispute Resolution Agreement and all activities contemplated herein, and all corporate and other actions required to authorise her/him to enter into and perform this Dispute Resolution Agreement were properly taken";
      }
    },
    teesAndCeesMethod(yesNo) {
      this.delegate = false;
      if (yesNo) {
        this.dialog = true;
        this.heading = "Submit Response?";
      }
    },
    setIdees(obj) {
      obj.ClaimantId = this.$store.getters.getClaimantId;
      obj.DefendantId = this.$store.getters.getDefendant.id;
      return obj;
    },
    async saveClaim() {
      if (this.$store.getters.isDefendantValid) {
        await this.saveDefendant();
      }
      if (this.$store.getters.isDefenseValid) {
        await this.saveDefense();
        await this.saveDefenseFiles();
      }
      if (this.$store.getters.isSettleValid) {
        this.settleOffer = true;
        await this.saveSettle();
        await this.saveSettleFiles();
      }
      if (this.$store.getters.isLociStandiDefValid) {
        await this.saveLociDef();
        await this.saveLociDefFiles();
      }
    },
    async saveDefense() {
      if (this.$store.getters.isNewDefense) {
        try {
          var defenseObj = {
            url: `defensestatements`,
            writeObj: await this.$store.getters.getDefense,
            id: caseModels.DEFENSE
          };
          await this.$store.dispatch("createObj", defenseObj);
          await this.$store.dispatch("doNewDefense", false);
          this.displayMsg = "New Defense inserted successfully";
        } catch (err) {
          console.log("New Defense not inserted " + err);
        }
      } else {
        if (this.$store.getters.isDefenseUpdated) {
          try {
            defenseObj = {
              url: `defensestatements/${await this.$store.getters
                .getDefenseId}`,
              obj: this.$store.getters.getDefense,
              id: caseModels.DEFENSE
            };
            await this.$store.dispatch("updateObj", defenseObj);
            await this.$store.dispatch("doDefenseUpdated", false);

            var findObj = {
              url: `defensestatements/${this.$store.getters.getDefenseId}`,
              id: caseModels.DEFENSE
            };
            await this.$store.dispatch("findObjByPk", findObj);

            this.displayMsg = "Defense updated successfully";
          } catch (err) {
            console.log("Defense not updated " + err);
          }
        }
      }
    },
    async saveDefenseFiles() {
      if (this.$store.getters.getDefenseFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getDefenseFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doDefenseFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              DefenseId: this.$store.getters.getDefense.id
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `defensefiles/${this.$store.getters.getDefenseId}`,
              id: caseModels.DEFENSE
            };
            await this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Defense files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert defense file names " + err);
        }
      }
    },
    async saveSettle() {
      if (this.$store.getters.isNewSettle) {
        try {
          var settleObj = {
            url: `settlestatements`,
            writeObj: await this.$store.getters.getSettle,
            id: caseModels.SETTLE
          };
          await this.$store.dispatch("createObj", settleObj);
          await this.$store.dispatch("doNewSettle", false);

          this.displayMsg = "New Settlement inserted successfully";
        } catch (err) {
          this.displayMsg = "New Settlement not inserted " + err;
          console.log("New Settlement not inserted " + err);
        }
      } else {
        if (this.$store.getters.isSettleUpdated) {
          try {
            var settle = this.$store.getters.getSettle;
            settleObj = {
              url: `settlestatements/${await this.$store.getters.getSettleId}`,
              obj: settle,
              id: caseModels.SETTLE
            };
            await this.$store.dispatch("updateObj", settleObj);
            await this.$store.dispatch("doSettleUpdated", false);
            var findObj = {
              url: `settlestatements/${this.$store.getters.getSettleId}`,
              id: caseModels.SETTLE
            };
            await this.$store.dispatch("findObjByPk", findObj);

            this.displayMsg = "Settlement updated successfully";
          } catch (err) {
            console.log("Settlement not updated " + err);
            this.displayMsg = "Error updating Settlement " + err;
          }
        }
      }
    },
    async saveSettleFiles() {
      if (this.$store.getters.getSettleFiles != null) {
        try {
          const filteredFiles = this.$store.getters.getSettleFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doSettleFiles", null);
          var retArr = [];
          filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              SettleId: this.$store.getters.getSettleId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `settlefiles/${this.$store.getters.getSettleId}`,
              id: caseModels.SETTLE
            };
            await this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Settlement files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert Settlement file names " + err);
        }
      }
    },
    async saveLociDef() {
      if (this.$store.getters.isNewLociStandiDef) {
        try {
          var lociObj = {
            url: `locistatementsDef`,
            writeObj: await this.$store.getters.getLociStandiDef,
            id: caseModels.LOCIDEF
          };
          await this.$store.dispatch("createObj", lociObj);
          await this.$store.dispatch("doNewLociStandiDef", false);
          this.displayMsg =
            "New Locus Standi Third Party inserted successfully";
        } catch (err) {
          this.displayMsg = "New Locus Standi third party not inserted " + err;
          console.log("New Loci Defense not inserted " + err);
        }
      } else {
        if (this.$store.getters.isLociStandiDefUpdated) {
          try {
            var lociDefObj = {
              url: `locistatementsDef/${await this.$store.getters.getSettleId}`,
              obj: this.$store.getters.getLociStandiDef,
              id: caseModels.LOCIDEF
            };
            await this.$store.dispatch("updateObj", lociDefObj);
            await this.$store.dispatch("doLociStandiDefUpdated", false);
            var findObj = {
              url: `locistatementsDef/${this.$store.getters.getSettleId}`,
              id: caseModels.LOCIDEF
            };
            await this.$store.dispatch("findObjByPk", findObj);

            this.displayMsg = "Loci third Party updated successfully";
          } catch (err) {
            console.log("Loci Defense not updated " + err);
            this.displayMsg = "Error updating Loci Defense " + err;
          }
        }
      }
    },
    async saveLociDefFiles() {
      if (this.$store.getters.getLociStandiDefFiles != null) {
        try {
          const filteredFiles = this.$store.getters.getLociStandiDefFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doLociStandiDefFiles", []);
          var retArr = [];
          filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              DefLocusStandiId: this.$store.getters.getLociStandiDefId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `locifilesDef/${this.$store.getters.getLociStandiDefId}`,
              id: caseModels.LOCIDEF
            };
            await this.$store.dispatch("createFiles", fileObj).then(() => {
              this.displayMsg = "Loci Defense files inserted";
            });
          }
        } catch (err) {
          console.log("Unable to insert Loci Defense file names " + err);
        }
      }
    },
    async saveDefendant() {
      if (this.$store.getters.isNewDefendant) {
        try {
          await this.$store
            .dispatch("createDefendant", this.$store.getters.getDefendant)
            .then(() => {
              this.displayMsg = "Third party created";
            });
        } catch (err) {
          this.displayMsg = "Error creating third party " + err;
          console.log("Error creating defendant " + err);
        }
      } else {
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
            this.displayMsg = "Third Party updated";
          } catch (err) {
            console.log("Error updating Third Party " + err);
          }
        }
      }
    },
    async processEachDefend(defends, callback) {
      for (var i = 0; i < defends.length; i++) {
        await callback(defends[i]);
      }
    },
    async validateClaim() {
      var counterClaim = await this.$store.getters.getCcCoa;
      var claimant = await this.$store.getters.getClaimant;
      var defendant = await this.$store.getters.getDefendant;

      var merits = await this.$store.getters.getCcMerit;
      var quanta = await this.$store.getters.getCcQuanta;
      var relief = await this.$store.getters.getCcRelief;

      var defense = await this.$store.getters.getDefense;
      var settle = await this.$store.getters.getSettle;
      var defLoci = await this.$store.getters.getLociStandiDef;

      var cClaim = false;
      if (counterClaim && claimant && defendant && merits && quanta && relief) {
        cClaim = true;
      }
      if ((defense || settle || cClaim) && defLoci) {
        return true;
      }
    },
    async findDefendants() {
      var url = `defendants/coy/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants wiz 7 " + err);
      }
    },
    async findSettle(defendant) {
      var findObj = {
        url: `/settlestatements/defend/${defendant.id}`,
        id: caseModels.SETTLE
      };
      var settle = await this.$store.dispatch("findObj", findObj);
      return settle;
    },
    async fileClaim() {
      if (await this.validateClaim()) {
        await this.saveClaim();
        await this.$store.dispatch("doViewStatus", 0);
        var claim = await this.$store.getters.getClaimant;
        var defend = await this.$store.getters.getDefendant;
        var Case = await this.$store.getters.getCase;

        var statusId = caseStatus.PENDINGARBIT;

        var settle = await this.$store.getters.getSettle; //light motor vehicle
        if (settle && settle.description.trim().length > 0) {
          statusId = caseStatus.OFFERTOSETTLE;
        }
        if (!(await this.updateDefendant(statusId))) {
          this.displayMsg =
            "Error updating third party - contact administrator";
          return;
        }
        var defsProcessed = true;
        await this.findDefendants();
        var defendants = await this.$store.getters.getDefendants;

        if (Case.PocId === poc.MULTIPLE) {
          var processedDefs = await defendants.filter(defend => {
            return (
              defend.StatusId === caseStatus.PENDINGARBIT ||
              defend.StatusId === caseStatus.OFFERTOSETTLE
            );
          });
          if (processedDefs.length < defendants.length) {
            defsProcessed = false;
            this.displayMsg = `Multiple Third Parties - ${processedDefs.length} of ${defendants.length} filed`;
          } else {
            defsProcessed = true;
            defend = this.$store.getters.getDefendants;
            statusId = caseStatus.PENDINGARBIT;
          }
        }
        if (defsProcessed) {
          try {
            await this.processEachDefend(defendants, async thirdParty => {
              var msg = await this.createDefMsg(claim, thirdParty, Case);
              await this.sendEmail(await this.createMsg(thirdParty, msg));
              settle = (await (defendants.length > 1)) ? null : settle;
            });
            var msg = await this.createMsgParts(claim, defend, Case);
            //console.log('msg '+ JSON.stringify(msg))
            await this.sendEmail(await this.createMsg(claim, msg));
            await this.updateClaimant(statusId);
            await this.updateCase(statusId);

            this.$router.push({
              name: "case-filed",
              params: {
                mailMsg: "Defense Filed and all parties notified"
              }
            });
          } catch (err) {
            console.log(
              "problem updating claimant and Case in multi wiz 8 " + err
            );
            await this.updateDefendant(caseStatus.PENDINGTHIRD);
          }
        }
        //console.log(' case is ' + this.$store.getters.getDefendant);
      } else {
        this.displayMsg = "Case capture is not complete!";
      }
    },
    async createDefMsg(claim, defend, Case) {
      var settle = null;
      var subjectArbit = `Third Parties pending Case Ruling - case # ${Case.id}`;
      var txtArbit = `Commissioner will adjudicate - Third party: ${defend.fullName} Insured:${claim.fullName}`;
      var subjectSettle = `Offer of settlement - case # ${Case.id}`;
      var txtSettle = `Acceptance or rejection of settlement offer concludes offline - Third party: ${defend.fullName} Insured:${claim.fullName}\n`;

      if (defend.StatusId === caseStatus.OFFERTOSETTLE) {
        settle = await this.findSettle(defend);
        txtSettle += `Settlement Offer as follows:\n${settle.description}`;
      }
      if (settle) {
        return {
          subject: subjectSettle,
          txt: txtSettle
        };
      } else {
        return {
          subject: subjectArbit,
          txt: txtArbit
        };
      }
    },
    async createMsgParts(claim, defend, Case) {
      var settle = null;
      var subjectArbit = `Parties pending Case Ruling - case # ${Case.id}`;
      var txtArbit = `Commissioner will adjudicate - Third party: ${defend.fullName} Insured:${claim.fullName}`;
      var subjectSettle = `Offer of settlement - case # ${Case.id}`;
      var txtSettle = `Acceptance or rejection of settlement offer concludes offline - Third party: ${defend.fullName} Insured:${claim.fullName}\n`;
      if (defend.StatusId === caseStatus.OFFERTOSETTLE) {
        settle = await this.findSettle(defend);
        txtSettle += `Settlement Offer as follows:\n${settle.description}`;
      }
      if (Array.isArray(defend)) {
        if (defend.length > 1) {
          subjectArbit = `Third Parties in Case Ruling - case # ${Case.id}`;
          txtArbit =
            "This Case has multiple Third Parties.\nThird Parties are;\n";
        }
        await this.processEachDefend(defend, async defendant => {
          var defDesc = "";
          if (defendant.StatusId === caseStatus.OFFERTOSETTLE) {
            settle = await this.findSettle(defendant);
            defDesc =
              "Acceptance or rejection of settlement offer concludes offline.\n";
            defDesc += `Third Party ${defendant.fullName} made an offer of settlement as follows:\n${settle.description}\n`;
          } else {
            defDesc = `Third Party: ${defendant.fullName}\n`;
          }
          txtArbit += `${defDesc} - Company: ${defendant.Company.name} - Status: ${defendant.Status.StatusDescription}\n`;
        });
        return {
          subject: subjectArbit,
          txt: txtArbit
        };
      }
      if (settle) {
        return {
          subject: subjectSettle,
          txt: txtSettle
        };
      } else {
        return {
          subject: subjectArbit,
          txt: txtArbit
        };
      }
    },
    createMsg(claim, defMsg) {
      const msg = {
        to: claim.email,
        from: this.inbox,
        subject: defMsg.subject,
        text: `${defMsg.txt}\n${this.link}`
      };
      return msg;
    },
    async updateCase(statusId) {
      try {
        var Case = this.$store.getters.getCase;
        Case.StatusId = statusId;
        await this.$store.dispatch("updateCase", Case);
        //await this.$store.dispatch('doCaseUpdated', false);
        await this.$store.dispatch("findCase", this.$store.getters.getCase.id);

        this.displayMsg = "Case updated successfully";
      } catch (err) {
        console.log("Case not updated " + err);
      }
    },
    async updateDefendant(statusId) {
      try {
        await this.$store.dispatch("doNewDefendant", false);
        await this.$store.dispatch("doDefendantUpdated", true);

        var defendant = this.$store.getters.getDefendant;
        defendant.StatusId = statusId;

        await this.$store.dispatch("doDefendant", defendant);
        if (!defendant) {
          throw "Insured cannot be null when updating Claimant status wiz 8";
        }

        await this.$store.dispatch(
          "updateDefendant",
          this.$store.getters.getDefendant
        );
        await this.$store.dispatch("doDefendantUpdated", false);
        await this.$store.dispatch(
          "findDefendant",
          this.$store.getters.getDefendantId
        );
        return true;
      } catch (err) {
        this.displayMsg = err;
        return false;
      }
    },
    async updateClaimant(statusId) {
      try {
        var claimant = this.$store.getters.getClaimant;
        claimant.StatusId = statusId;
        await this.$store.dispatch("doClaimant", claimant);
        if (!claimant) {
          throw "Insured cannot be null when updating Claimant status wiz 8";
        }

        await this.$store.dispatch(
          "updateClaimant",
          this.$store.getters.getClaimant
        );
        await this.$store.dispatch("findClaimant", claimant.id);

        return true;
      } catch (err) {
        this.displayMsg = err;
        return false;
      }
    },
    async sendEmail(msg) {
      this.$store.dispatch("sendEmail", msg).then(
        () => {
          //console.log('msg sent to '+ msg.to);
        },
        error => {
          console.log("Message not sent " + error);
          this.$router.push({
            name: "case-filed",
            params: {
              mailMsg: "Email not sent - error - " + error
            }
          });
        }
      );
    }
  }
};
</script>
