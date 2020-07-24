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
              Click Save to edit later or submit to complete Resolution of case
            </div>
            <span class="grey--text">{{ displayMsg }}</span>
          </div>
        </v-card-title>

        <v-card-actions>
          <v-btn text @click="saveResolved">Save</v-btn>
          <v-btn text color="purple" @click="dialog = true">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import caseStatus from "@/status-enums/caseStatus";
import caseModels from "@/status-enums/tables.js";
import poc from "@/status-enums/poc";
import YesNoDiag from "@/components/YesNoDiag.vue";

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
      resolvedSaved: false,
      dialog: false,
      heading: "Submit ruling",
      btn1Txt: "No",
      btn2Txt: "Yes",
      link: process.env.VUE_APP_URL,
      inbox: process.env.VUE_APP_INBOX
    };
  },
  async created() {
    if (this.$store.getters.isResolutionValid) {
      this.displayMsg = "Fields captured are valid";
    } else {
      this.displayMsg = "Case is not complete - only save permitted";
    }
  },
  async beforeDestroy() {
    //console.log('wiz 6 getR '+ JSON.stringify(this.$store.getters.getResolution));
  },
  methods: {
    fileClaimCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        this.fileResolution();
      }
    },
    setIdees(obj) {
      obj.ArbitCaseId = this.$store.getters.getCase
        ? this.$store.getters.getCase.id
        : this.$store.getters.getCase;
      return obj;
    },
    async saveResolved() {
      //await this.findDefendants();
      await this.$store.getters.getDefendant;
      if (this.$store.getters.isResolutionValid) {
        try {
          await this.saveResolution();
          await this.saveResolutionFiles();
        } catch (err) {
          this.displayMsg = `Resolution not created! ${err}`;
        }
      }
      return true;
    },
    async saveResolution() {
      if (this.$store.getters.isNewResolution) {
        try {
          var resolution = await this.setIdees(
            this.$store.getters.getResolution
          );
          //console.log("resolution " + JSON.stringify(resolution));
          var resolutionObj = {
            url: `resolutions`,
            writeObj: resolution,
            id: caseModels.RESOLUTION
          };
          await this.$store.dispatch("createObj", resolutionObj);
          await this.$store.dispatch("doNewResolution", false);
          this.displayMsg = "New Resolution created successfully";
        } catch (err) {
          throw "error creating resolution";
        }
      } else {
        if (this.$store.getters.isResolutionUpdated) {
          try {
            resolutionObj = {
              url: `resolutions/${await this.$store.getters.getResolutionId}`,
              obj: await this.$store.getters.getResolution,
              id: caseModels.RESOLUTION
            };
            await this.$store.dispatch("updateObj", resolutionObj);
            await this.$store.dispatch("doResolutionUpdated", false);
            var findObj = {
              url: `resolutions/${this.$store.getters.getResolutionId}`,
              id: caseModels.RESOLUTION
            };
            await this.$store.dispatch("findObjByPk", findObj);
            this.displayMsg = "Resolution updated successfully";
          } catch (err) {
            this.displayMsg =
              "Resolution files not updated! - contact the administrator";
          }
        }
      }
    },
    async saveResolutionFiles() {
      if (this.$store.getters.getResolutionFiles != null) {
        try {
          const filteredFiles = await this.$store.getters.getResolutionFiles.filter(
            file => !file.id
          );
          await this.$store.dispatch("doResolutionFiles", null);
          var retArr = [];
          await filteredFiles.forEach(file => {
            retArr.push({
              filename: file.filename,
              diskname: file.diskname,
              ResolutionId: this.$store.getters.getResolutionId
            });
          });
          if (retArr.length > 0) {
            var fileObj = {
              files: retArr,
              url: `resolvefiles/${this.$store.getters.getResolutionId}`,
              id: caseModels.RESOLUTION
            };
            await this.$store.dispatch("createFiles", fileObj);
          }
          this.resolvedSaved = true;
          this.displayMsg = "Resolution Files created successfully";
        } catch (err) {
          this.displayMsg =
            "Resolution files not inserted - contact the administrator!";
          console.log("Unable to insert Resolution file names " + err);
          this.resolvedSaved = false;
        }
      }
    },
    async findDefendants() {
      var url = `defendants/case/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
        var defendants = await this.$store.getters.getDefendants.filter(
          defendant => {
            return defendant.StatusId === caseStatus.PENDINGARBIT;
          }
        );
        await this.$store.dispatch("doDefendants", defendants);
      } catch (err) {
        console.log("Problem finding defendants wiz 6 Resolve " + err);
      }
    },
    createMsg(claim, defend, Case, sendToClaim) {
      var parts =
        Case.PocId === poc.MULTIPLE
          ? `${this.$store.getters.getDefendants.length} Third Parties - `
          : `Third Party: ${defend.fullName}`;
      var txt = sendToClaim
        ? `${parts} - Insured:${claim.fullName}\n`
        : `Third Party: ${defend.fullName} Insured:${claim.fullName}\n`;
      txt += `Resolution as follows: ${this.$store.getters.getResolution.description}\n`;
      const msg = {
        to: sendToClaim ? claim.email : defend.email,
        from: this.inbox,
        subject: `Resolution of arbitration Case # ${Case.id}`,
        text: `${txt}\n${this.link}`
      };
      return msg;
    },
    async fileResolution() {
      await this.saveResolved();
      var claim = await this.$store.getters.getClaimant;
      var defend = "";
      var Case = await this.$store.getters.getCase;

      var defendants = [];
      var mailMsg = null;

      //await this.findDefendants();
      defendants = await this.$store.getters.getDefendants;

      await this.processEachDefend(defendants, async defend => {
        await this.$store.dispatch("doDefendant", defend);
        var msg = await this.createMsg(claim, defend, Case, false);
        if (await this.updateDefendant(defend)) {
          await this.sendEmail(msg);
        }
      });
      if ((await this.updateClaimant(claim)) && (await this.updateCase(Case))) {
        var msg = await this.createMsg(claim, defend, Case, true);
        await this.sendEmail(msg);
        mailMsg = await "Resolution Filed and Parties notified";
      } else {
        mailMsg = await "Problem Completeing filing of Resolution - contact Admin!";
      }
      this.$router.push({
        name: "case-resolved",
        params: {
          mailMsg: mailMsg
        }
      });
    },
    async processEachDefend(defends, callback) {
      for (var i = 0; i < defends.length; i++) {
        await callback(defends[i]);
      }
    },
    async updateClaimant(claimant) {
      try {
        claimant.StatusId = caseStatus.RESOLVED;
        await this.$store.dispatch("doClaimant", claimant);
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
    async updateDefendant(defendant) {
      try {
        defendant.StatusId = caseStatus.RESOLVED;
        await this.$store.dispatch("doDefendant", defendant);
        await this.$store.dispatch(
          "updateDefendant",
          this.$store.getters.getDefendant
        );

        await this.$store.dispatch("findDefendant", defendant.id);
        return true;
      } catch (err) {
        this.displayMsg = err;
        return false;
      }
    },
    async updateCase(Case) {
      try {
        Case.StatusId = caseStatus.RESOLVED;
        await this.$store.dispatch("updateCase", Case);
        await this.$store.dispatch("findCase", this.$store.getters.getCase.id);

        this.displayMsg = "Case updated successfully";
        return true;
      } catch (err) {
        this.displayMsg = err;
        return false;
      }
    },
    async sendEmail(msg) {
      this.$store.dispatch("sendEmail", msg).then(
        response => {
          console.log(`Message sent ${response.data}`);
        },
        error => {
          console.log(`Message not sent ${error}`);
        }
      );
    }
  }
};
</script>
