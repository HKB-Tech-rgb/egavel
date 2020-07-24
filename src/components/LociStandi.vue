<template>
  <v-container style="padding-top:0">
    <v-layout row wrap>
      <v-flex xs12>
        <h2>
          Locus Standi -
          {{ lociHead }}
        </h2>
        <v-textarea
          :readonly="readOnly"
          :maxlength="max"
          name="locistandi"
          filled
          :label="lbl"
          :rules="nameRules"
          ref="locistandi"
          v-model="loci.description"
          auto-grow
          required
        >
        </v-textarea>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import caseModels from "@/status-enums/tables.js";
export default {
  data() {
    return {
      loci: {
        id: 0,
        description:
          "Upload vehicle ownership document and vehicle insurance policy",
        ClaimantId: this.$store.getters.getClaimantId
          ? this.$store.getters.getClaimantId
          : 0,
        totalUploads: 0
      },
      currentLoci: {},
      arbitUser: this.$store.getters.getArbitUser,
      newLoci: false,
      lociHead: "Insured",
      cClaim: false,
      formFieldsChanged: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      demoUser: process.env.VUE_APP_DEMO_USER,
      lbl: ""
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
    async findLociAndSetup() {
      if (this.$store.getters.getLoci) {
        var loci = this.$store.getters.getLoci;
        this.currentLoci.description = loci.description;
        //if (!this.$store.getters.isLociStandiValid){return}
        this.loci.id = loci.id;

        this.loci.DefendantId = this.$store.getters.getDefendant.id;
        this.loci.ClaimantId = this.$store.getters.getClaimantId;

        this.loci.description = loci.description;
        this.newLoci = false;
        this.$store.dispatch("initLociId", this.loci.id);

        var lociFiles = this.$store.getters.getLociFiles;
        if (!lociFiles || lociFiles.length < 1) {
          if (this.loci.id > 0) {
            this.findLociFiles();
          }
        }
      } else {
        this.newLoci = true;
      }
    },
    findLociFiles() {
      var findObj = {
        url: `/locifiles/claimant/${this.loci.id}`,
        id: caseModels.LOCI
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(lociFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", lociFiles);
          //console.log('loci files kool is the rool '+ JSON.stringify(lociFiles));
        })
        .catch(err => {
          console.log("loci files not found " + err);
        });
    },
    checkForChanges() {
      if (this.currentLoci.description != this.loci.description) {
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
    if (this.$refs.locistandi.validate()) {
      await this.$store.dispatch("doLociStandiValid", true);
      if (this.newLoci) {
        try {
          await this.$store.dispatch("doLoci", this.loci);
          await this.$store.dispatch("doNewLoci", true);
        } catch (err) {
          console.log("error creating loci statement " + err);
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doLoci", this.loci);
            await this.$store.dispatch("doLociUpdated", true);
          }
        } catch (err) {
          console.log("error updating loci statement " + err);
        }
      }
    } else {
      await this.$store.dispatch("doLociStandiValid", false);
      if (this.loci.description.trim().length > 0) {
        this.$store.dispatch("doLoci", this.loci); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findLociAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.loci.id < 1
    ) {
      this.loci.description = `Uploaded proof of ownership and proof of insurance Docs - ${this.$store.getters.getClaimant.fullName}`;
    }

    this.lbl = `required - Capture text - between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Locus standi submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.loci.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.loci.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch("doTextLength", this.loci.description.length);
    if (this.$refs.locistandi.validate()) {
      await this.$store.dispatch("doLociStandiValid", true);
    } else {
      await this.$store.dispatch("doLociStandiValid", false);
    }
  }
};
</script>
