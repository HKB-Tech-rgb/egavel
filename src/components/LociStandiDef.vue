<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Locus Standi - {{ lociHead }}</h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="lociStandiDef"
            filled
            :label="lbl"
            ref="lociStandiDef"
            v-model="lociStandiDef.description"
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
      lociStandiDef: {
        id: 0,
        description:
          "Upload vehicle ownership document and vehicle insurance policy",
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendant.id
          : 0,
        totalUploads: 0
      },
      currentLoci: {},
      arbitUser: this.$store.getters.getArbitUser,
      newLoci: false,
      lociHead: "Third Party Insured",
      cClaim: false,
      formFieldsChanged: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      demoUser: process.env.VUE_APP_DEMO_DEFEND,
      lbl: ""
    };
  },
  computed: {
    icon() {
      return this.icons[this.iconIndex];
    }
  },
  props: {
    readOnly: {
      type: Boolean
    }
  },
  methods: {
    async findLociAndSetup() {
      var loci = await this.$store.getters.getLociStandiDef;
      if (loci) {
        this.currentLoci.description = loci.description;
        this.lociStandiDef.id = loci.id;
        this.lociStandiDef.description = loci.description;
        this.newLoci = false;
        this.$store.dispatch("doLociStandiDefId", this.lociStandiDef.id);

        var lociFiles = this.$store.getters.getLociStandiDefFiles;

        if (!lociFiles || lociFiles.length < 1) {
          if (this.lociStandiDef.id > 0) {
            this.findLociFiles();
          }
        }
      } else {
        this.newLoci = true;
      }
    },
    findLociFiles() {
      var findObj = {
        url: `locifilesDef/defend/${this.lociStandiDef.id}`,
        id: caseModels.LOCIDEF
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
      if (this.currentLoci.description != this.lociStandiDef.description) {
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
    if (this.$refs.lociStandiDef.validate()) {
      await this.$store.dispatch("doLociStandiDefValid", true);
      if (this.newLoci) {
        try {
          await this.$store.dispatch("doLociStandiDef", this.lociStandiDef);
          await this.$store.dispatch("doNewLociStandiDef", true);
        } catch (err) {
          console.log("error creating loci statement " + err);
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doLociStandiDef", this.loci);
            await this.$store.dispatch("doLociStandiDefUpdated", true);
          }
        } catch (err) {
          console.log("error updating loci statement " + err);
        }
      }
    } else {
      await this.$store.dispatch("doLociStandiDefValid", false);
      console.log();
      if (this.lociStandiDef.description.trim().length > 0) {
        this.$store.dispatch("doLociStandiDef", this.lociStandiDef); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findLociAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.lociStandiDef.id < 1
    ) {
      this.lociStandiDef.description = `Uploaded proof of ownership and proof of insurance Docs - ${this.$store.getters.getDefendant.fullName}`;
    }

    this.lbl = `required - Capture text - between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Locus standi submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.lociStandiDef.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.lociStandiDef.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch(
      "doTextLength",
      this.lociStandiDef.description.length
    );
    if (this.$refs.lociStandiDef.validate()) {
      this.$store.dispatch("doLociStandiDefValid", true);
    } else {
      this.$store.dispatch("doLociStandiDefValid", false);
    }
  }
};
</script>
