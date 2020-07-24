<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Offer of settlement</h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="settle"
            filled
            :label="lbl"
            ref="settle"
            v-model="settle.description"
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
      settle: {
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
      currentSettle: {},
      arbitUser: this.$store.getters.getArbitUser,
      newSettle: false,
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
    findSettleAndSetup() {
      if (this.$store.getters.getSettle) {
        var settle = this.$store.getters.getSettle;
        this.currentSettle.description = settle.description;
        this.settle.id = settle.id;
        this.settle.description = settle.description;
        this.newSettle = false;
        this.$store.dispatch("doSettleId", this.settle.id);

        if (
          this.$store.getters.getSettleFiles === null ||
          this.$store.getters.getSettleFiles.length < 1
        ) {
          if (this.settle.id > 0) {
            this.findSettleFiles();
          }
        }
      } else {
        this.newSettle = true;
      }
    },
    findSettleFiles() {
      var findObj = {
        url: `settlefiles/defendant/${this.settle.id}`,
        id: caseModels.SETTLE
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(settleFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", settleFiles);
        })
        .catch(err => {
          console.log("error finding settle files " + err);
        });
    },
    checkForChanges() {
      if (this.currentSettle.description != this.settle.description) {
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
    if (this.$refs.settle.validate()) {
      this.$store.dispatch("doSettleValid", true);
      if (this.newSettle) {
        try {
          await this.$store.dispatch("doSettle", this.settle);
          await this.$store.dispatch("doNewSettle", true);
        } catch (err) {
          console.log("error creating settle statement " + err);
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doSettle", this.settle);
            await this.$store.dispatch("doSettleUpdated", true);
          }
        } catch (err) {
          console.log("error updating settle statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doSettleValid", false);
      if (this.settle.description.trim().length > 0) {
        this.$store.dispatch("doSettle", this.settle); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findSettleAndSetup();

    this.lbl = `Insert settlement offer. Add supporting documents *required to submit valid - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v =>
        !!v ||
        "Offer of settlement submission or summary is required to submit",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.settle.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.settle.description.length}`
    ];
  },
  async updated() {
    if (this.$refs.settle.validate()) {
      this.$store.dispatch("doSettleValid", true);
    } else {
      this.$store.dispatch("doSettleValid", false);
    }
  }
};
</script>
