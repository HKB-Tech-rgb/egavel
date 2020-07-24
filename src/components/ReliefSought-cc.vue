<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Relief Sought - {{ reliefHead }}</h2>
          <br />
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="relief-sought"
            ref="ccReliefSought"
            filled
            :label="lbl"
            v-model="ccRelief.description"
            :rules="nameRules"
            auto-grow
            value=""
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
      ccRelief: {
        id: 0,
        description: "",
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendantId
          : 0,
        totalUploads: 0
      },
      currentRelief: {},
      newRelief: false,
      cClaim: false,
      reliefHead: "Third Party Insured",
      arbitUser: this.$store.getters.getArbitUser,
      formFieldsChanged: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
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
    async findReliefAndSetup() {
      var relief = await this.$store.getters.getCcRelief;
      if (relief) {
        this.currentRelief.description = relief.description;
        this.ccRelief.id = relief.id;
        this.ccRelief.description = relief.description;
        this.newRelief = false;
        this.$store.dispatch("doCcReliefId", this.ccRelief.id);

        var reliefFiles = this.$store.getters.getCcReliefFiles;
        if (!reliefFiles || reliefFiles.length < 1) {
          if (this.ccRelief.id > 0) {
            this.findReliefFiles();
          }
        } else {
          this.$store.dispatch("doCurrentUploadedFiles", reliefFiles);
        }
      } else {
        this.newRelief = true;
      }
    },
    findReliefFiles() {
      var findObj = {
        url: `/relieffilesCC/defend/${this.ccRelief.id}`,
        id: caseModels.COUNTERRELIEF
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(reliefFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", reliefFiles);
        })
        .catch(err => {
          console.log("Problem ccRelief sought find files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentRelief.description != this.ccRelief.description) {
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
    if (this.$refs.ccReliefSought.validate()) {
      this.$store.dispatch("doCcReliefValid", true);
      if (this.newRelief) {
        try {
          //console.log('coa about to write ' + this.dCoa);
          //await this.$store.dispatch('createReliefSought', this.dRelief);
          await this.$store.dispatch("doCcRelief", this.ccRelief);
          await this.$store.dispatch("doNewccRelief", true);
        } catch (err) {
          console.log(
            "error creating Relief soughts statement " +
              JSON.stringify(this.dRelief)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            //await this.$store.dispatch('updateReliefSought', this.dRelief);
            await this.$store.dispatch("doCcRelief", this.ccRelief);
            await this.$store.dispatch("doCcReliefUpdated", true);
          }
        } catch (err) {
          console.log("error updating ccRelief statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doCcReliefValid", false);
      if (this.ccRelief.description.trim().length > 0) {
        await this.$store.dispatch("doCcRelief", this.ccRelief); //to keep text in box so no retype
      }
    }
  },
  async created() {
    await this.findReliefAndSetup();

    this.lbl = `required - Insert relief sought with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Relief Sought submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccRelief.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccRelief.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch(
      "doTextLength",
      this.ccRelief.description.length
    );
    if (this.$refs.ccReliefSought.validate()) {
      this.$store.dispatch("doCcReliefValid", true);
    } else {
      this.$store.dispatch("doCcReliefValid", false);
    }
  }
};
</script>
