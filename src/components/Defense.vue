<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>
            Third Party Defense
          </h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="defense"
            filled
            :label="lbl"
            ref="defense"
            v-model="defense.description"
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
      defense: {
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
      currentDefense: {},
      arbitUser: this.$store.getters.getArbitUser,
      newDefense: false,
      formFieldsChanged: false,
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      demoUser: process.env.VUE_APP_DEMO_DEFEND,
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
    findDefenseAndSetup() {
      if (this.$store.getters.getDefense) {
        var defense = this.$store.getters.getDefense;
        this.currentDefense.description = defense.description;
        this.defense.id = defense.id;

        this.defense.description = defense.description;
        this.newDefense = false;
        this.$store.dispatch("doDefenseId", this.defense.id);

        if (
          this.$store.getters.getDefenseFiles === null ||
          this.$store.getters.getDefenseFiles.length < 1
        ) {
          if (this.defense.id > 0) {
            this.findDefenseFiles();
          }
        }
      } else {
        this.newDefense = true;
      }
    },
    findDefenseFiles() {
      var findObj = {
        url: `defensefiles/defendant/${this.defense.id}`,
        id: caseModels.DEFENSE
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(defenseFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", defenseFiles);
          //console.log('loci files kool is the rool '+ JSON.stringify(files));
        })
        .catch(err => {
          console.log("defense files not found " + err);
        });
    },
    checkForChanges() {
      if (this.currentDefense.description != this.defense.description) {
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
    if (this.$refs.defense.validate()) {
      this.$store.dispatch("doDefenseValid", true);
      if (this.newDefense) {
        try {
          await this.$store.dispatch("doDefense", this.defense);
          await this.$store.dispatch("doNewDefense", true);
        } catch (err) {
          console.log("error creating defense statement " + err);
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doDefense", this.defense);
            await this.$store.dispatch("doDefenseUpdated", true);
          }
        } catch (err) {
          console.log("error updating defense statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doDefenseValid", false);
      if (this.defense.description.trim().length > 0) {
        this.$store.dispatch("doDefense", this.defense); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findDefenseAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.defense.id < 1
    ) {
      this.defense.description = `Defense and supporting docs - ${this.$store.getters.getDefendant.fullName}`;
    }

    this.lbl = `Insert statement of defence, material facts and contentions. Add
            supporting documents *required to submit valid - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v =>
        !!v ||
        "Third Party submission or summary is required to submit defense",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.defense.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.defense.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch("doTextLength", this.defense.description.length);

    if (this.$refs.defense.validate()) {
      this.$store.dispatch("doDefenseValid", true);
    } else {
      this.$store.dispatch("doDefenseValid", false);
    }
  }
};
</script>
