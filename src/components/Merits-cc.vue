<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>
            Case Merits -
            {{ meritHead }}
          </h2>
          <br />
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="merits"
            filled
            :label="lbl"
            ref="ccMerits"
            v-model="ccMerits.description"
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
      ccMerits: {
        id: 0,
        description: "",
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendantId
          : 0,
        totalUploads: 0
      },
      currentMerit: {},
      newMerit: false,
      meritHead: "Third Party Insured",
      cClaim: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
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
      var merit = await this.$store.getters.getCcMerit;
      if (merit) {
        this.currentMerit.description = merit.description;
        this.ccMerits.id = merit.id;
        this.ccMerits.description = merit.description;
        //console.log('merits desc ' + JSON.stringify(this.merits.id));
        this.newMerit = false;
        this.$store.dispatch("doCcMeritId", this.ccMerits.id);

        var meritFiles = this.$store.getters.getCcMeritFiles;
        if (!meritFiles || meritFiles.length < 1) {
          if (this.ccMerits.id > 0) {
            this.findMeritFiles();
          }
        }
      } else {
        this.newMerit = true;
      }
    },
    findMeritFiles() {
      var findObj = {
        url: `/meritfilesCC/defend/${this.ccMerits.id}`,
        id: caseModels.COUNTERMERIT
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(meritFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", meritFiles);
          //console.log('Coa files found ' + files.length);
        })
        .catch(err => {
          console.log("Problem ccMerits find files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentMerit.description != this.ccMerits.description) {
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
    if (this.$refs.ccMerits.validate()) {
      this.$store.dispatch("doCcMeritValid", true);
      if (this.newMerit) {
        try {
          await this.$store.dispatch("doCcMerit", this.ccMerits);
          await this.$store.dispatch("doNewccMerit", true);
        } catch (err) {
          console.log(
            "error creating Counter Merits statement " +
              JSON.stringify(this.ccMerits)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doCcMerit", this.ccMerits);
            await this.$store.dispatch("doCcMeritUpdated", true);
          }
        } catch (err) {
          console.log("error updating merit statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doCcMeritValid", false);
      if (this.ccMerits.description.trim().length > 0) {
        this.$store.dispatch("doCcMerit", this.ccMerits); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findMeritAndSetup();

    this.lbl = `required - Insert material facts and contentions with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Merits submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccMerits.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccMerits.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch(
      "doTextLength",
      this.ccMerits.description.length
    );
    if (this.$refs.ccMerits.validate()) {
      this.$store.dispatch("doCcMeritValid", true);
    } else {
      this.$store.dispatch("doCcMeritValid", false);
    }
  }
};
</script>
