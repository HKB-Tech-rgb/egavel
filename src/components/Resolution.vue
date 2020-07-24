<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Resolution of Case</h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="resolution"
            filled
            :label="lbl"
            ref="resolution"
            v-model="resolution.description"
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
      resolution: {
        id: 0,
        description: "",
        ArbitCaseId: this.$store.getters.getCase
          ? this.$store.getters.getCase.id
          : 0,
        totalUploads: 0
      },
      currentResolution: {},
      arbitUser: this.$store.getters.getArbitUser,
      newResolution: false,
      formFieldsChanged: false,
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      nameRules: [],
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
    findResolutionAndSetup() {
      if (this.$store.getters.getResolution) {
        var resolution = this.$store.getters.getResolution;
        this.currentResolution.description = resolution.description;
        this.resolution.id = resolution.id;
        this.resolution.description = resolution.description;
        this.newResolution = false;

        this.$store.dispatch("doResolutionId", this.resolution.id);

        if (
          this.$store.getters.getResolutionFiles === null ||
          this.$store.getters.getResolutionFiles.length < 1
        ) {
          if (this.resolution.id > 0) {
            this.findResolutionFiles();
          }
        }
      } else {
        this.newResolution = true;
      }
    },
    findResolutionFiles() {
      var findObj = {
        url: `/resolvefiles/arbitor/${this.resolution.id}`,
        id: caseModels.RESOLUTION
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(resolutionFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", resolutionFiles);
          //console.log('loci files kool is the rool '+ JSON.stringify(files));
        })
        .catch(err => {
          console.log("resolution files not found " + err);
        });
    },
    checkForChanges() {
      if (this.currentResolution.description != this.resolution.description) {
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
    if (this.$refs.resolution.validate()) {
      this.$store.dispatch("doResolutionValid", true);
      if (this.newResolution) {
        try {
          await this.$store.dispatch("doResolution", this.resolution);
          await this.$store.dispatch("doNewResolution", true);
        } catch (err) {
          console.log("error creating resolution statement " + err);
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doResolution", this.resolution);
            await this.$store.dispatch("doResolutionUpdated", true);
          }
        } catch (err) {
          console.log("error updating resolution statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doResolutionValid", false);
      if (this.resolution.description.trim().length > 0) {
        this.$store.dispatch("doResolution", this.resolution); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findResolutionAndSetup();

    this.lbl = `Resolution. Add supporting docs *required to submit valid - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Resolution submission or summary is required to submit",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.resolution.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.resolution.description.length}`
    ];
  },
  async updated() {
    if (this.$refs.resolution.validate()) {
      this.$store.dispatch("doResolutionValid", true);
    } else {
      this.$store.dispatch("doResolutionValid", false);
    }
  }
};
</script>
