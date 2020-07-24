<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Relief Sought - {{ reliefHead }}</h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="relief-sought"
            ref="reliefSought"
            filled
            :label="lbl"
            v-model="dRelief.description"
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
      dRelief: {
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
      currentRelief: {},
      newRelief: false,
      cClaim: false,
      reliefHead: "Insured",
      arbitUser: this.$store.getters.getArbitUser,
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
    async findReliefAndSetup() {
      if (this.$store.getters.getReliefSought) {
        var relief = this.$store.getters.getReliefSought;
        this.currentRelief.description = relief.description;
        this.dRelief.id = relief.id;
        this.dRelief.description = relief.description;

        this.dRelief.DefendantId = this.$store.getters.getDefendant.id;
        this.dRelief.ClaimantId = this.$store.getters.getClaimantId;

        this.newRelief = false;
        this.$store.dispatch("initReliefId", this.dRelief.id);

        var reliefFiles = this.$store.getters.getReliefFiles;
        if (!reliefFiles || reliefFiles.length < 1) {
          if (this.dRelief.id > 0) {
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
        url: `/relieffiles/claimant/${this.dRelief.id}`,
        id: caseModels.RELIEF
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(reliefFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", reliefFiles);
        })
        .catch(err => {
          throw "Problem Relief sought find files  " + err;
        });
    },
    checkForChanges() {
      if (this.currentRelief.description != this.dRelief.description) {
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
    if (this.$refs.reliefSought.validate()) {
      this.$store.dispatch("doReliefSoughtValid", true);
      if (this.newRelief) {
        try {
          await this.$store.dispatch("doReliefSought", this.dRelief);
          await this.$store.dispatch("doNewRelief", true);
        } catch (err) {
          throw "error creating Relief soughts statement " + err;
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            //await this.$store.dispatch('updateReliefSought', this.dRelief);
            await this.$store.dispatch("doReliefSought", this.dRelief);
            await this.$store.dispatch("doReliefUpdated", true);
          }
        } catch (err) {
          throw "error updating merit statement " + err;
        }
      }
    } else {
      await this.$store.dispatch("doReliefSoughtValid", false);
      if (this.dRelief.description.trim().length > 0) {
        await this.$store.dispatch("doReliefSought", this.dRelief); //to keep text in box so no retype
      }
    }
  },
  async created() {
    await this.findReliefAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.dRelief.id < 1
    ) {
      this.dRelief.description = `Relief sought on behalf of - ${this.$store.getters.getClaimant.fullName}`;
    }

    this.lbl = `required - Insert relief sought with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Relief Sought submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.dRelief.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.dRelief.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch("doTextLength", this.dRelief.description.length);

    if (this.$refs.reliefSought.validate()) {
      await this.$store.dispatch("doReliefSoughtValid", true);
    } else {
      await this.$store.dispatch("doReliefSoughtValid", false);
    }
  }
};
</script>
