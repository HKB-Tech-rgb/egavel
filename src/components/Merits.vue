<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>
            Case Merits -
            {{ meritHead }}
          </h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="merits"
            filled
            :label="lbl"
            ref="merits"
            v-model="merits.description"
            auto-grow
            :rules="nameRules"
          >
          </v-textarea>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>
<script>
import caseModels from "@/status-enums/tables.js";
export default {
  data() {
    return {
      merits: {
        id: 0,
        description: "",
        ClaimantId: this.$store.getters.getClaimantId
          ? this.$store.getters.getClaimantId
          : 0,
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendant.id
          : 0,
        totalUploads: 0
      },
      currentMerit: {},
      newMerit: false,
      meritHead: "Insured",
      cClaim: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      demoUser: process.env.VUE_APP_DEMO_USER,
      lbl: "",
      arbitUser: this.$store.getters.getArbitUser
    };
  },
  props: {
    readOnly: {
      type: Boolean
    }
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    }
  },
  methods: {
    async findMeritAndSetup() {
      if (this.$store.getters.getMerit) {
        var merit = this.$store.getters.getMerit;
        this.currentMerit.description = merit.description;
        this.merits.id = merit.id;
        this.merits.description = merit.description;
        //console.log('merits desc ' + JSON.stringify(this.merits.id));
        this.newMerit = false;
        this.$store.dispatch("initMeritId", this.merits.id);

        this.merits.DefendantId = this.$store.getters.getDefendant.id;
        this.merits.ClaimantId = this.$store.getters.getClaimantId;

        var meritFiles = this.$store.getters.getMeritFiles;
        if (!meritFiles || meritFiles.length < 1) {
          if (this.merits.id > 0) {
            this.findMeritFiles();
          }
        }
      } else {
        this.newMerit = true;
      }
    },
    findMeritFiles() {
      var findObj = {
        url: `/meritfiles/claimant/${this.merits.id}`,
        id: caseModels.MERITS
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(meritFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", meritFiles);
          //console.log('Coa files found ' + files.length);
        })
        .catch(err => {
          console.log("Problem Merits find files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentMerit.description != this.merits.description) {
        this.formFieldsChanged = true;
      }
    },
    toggleMarker() {
      this.marker = !this.marker;
    },
    sendMessage() {
      this.resetIcon();
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    },
    resetIcon() {
      this.iconIndex = 0;
    },
    changeIcon() {
      this.iconIndex === this.icons.length - 1
        ? (this.iconIndex = 0)
        : this.iconIndex++;
    }
  },
  async beforeDestroy() {
    if (this.$refs.merits.validate()) {
      this.$store.dispatch("doMeritValid", true);
      if (this.newMerit) {
        try {
          await this.$store.dispatch("doMerit", this.merits);
          await this.$store.dispatch("doNewMerit", true);
        } catch (err) {
          console.log(
            "error creating Merits statement " + JSON.stringify(this.merits)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doMerit", this.merits);
            await this.$store.dispatch("doMeritUpdated", true);
          }
        } catch (err) {
          console.log("error updating merit statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doMeritValid", false);
      if (this.merits.description.trim().length > 0) {
        this.$store.dispatch("doMerit", this.merits); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findMeritAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.merits.id < 1
    ) {
      this.merits.description = `Case Merits - ${this.$store.getters.getClaimant.fullName}`;
    }

    this.lbl = `required - Insert material facts and contentions with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Merits submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.merits.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.merits.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch("doTextLength", this.merits.description.length);

    if (this.$refs.merits.validate()) {
      this.$store.dispatch("doMeritValid", true);
    } else {
      this.$store.dispatch("doMeritValid", false);
    }
  }
};
</script>
