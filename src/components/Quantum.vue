<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>
            Quantum of damages -
            {{ quantaHead }}
          </h2>
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="quanta"
            filled
            :label="lbl"
            ref="quanta"
            v-model="quanta.description"
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
      quanta: {
        id: 0,
        description: "",
        ClaimantId: this.$store.getters.getClaimantId
          ? this.$store.getters.getClaimantId
          : 0,
        totalUploads: 0
      },
      currentQuanta: {},
      newQuanta: false,
      cClaim: false,
      quantaHead: "Insured",
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
    async findQuantaAndSetup() {
      if (this.$store.getters.getQuanta) {
        var quanta = this.$store.getters.getQuanta;
        this.currentQuanta.description = quanta.description;
        this.quanta.id = quanta.id;
        this.quanta.description = quanta.description;
        this.quanta.ClaimantId = this.$store.getters.getClaimantId;

        this.newQuanta = false;
        this.$store.dispatch("initQuantaId", this.quanta.id);

        var quantaFiles = this.$store.getters.getQuantaFiles;
        if (!quantaFiles || quantaFiles.length < 1) {
          if (this.quanta.id > 0) {
            this.findQuantaFiles();
          }
        } else {
          this.$store.dispatch("doCurrentUploadedFiles", quantaFiles);
        }
      } else {
        this.newQuanta = true;
      }
    },
    findQuantaFiles() {
      var findObj = {
        url: `/quantumfiles/claimant/${this.quanta.id}`,
        id: caseModels.QUANTUM
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(quantaFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", quantaFiles);
          //console.log('quanta files found ' + files.length);
        })
        .catch(err => {
          //console.log('Problem finding Quanta files  ' + err);
          throw err;
        });
    },
    checkForChanges() {
      if (this.currentQuanta.description != this.quanta.description) {
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
    if (this.$refs.quanta.validate()) {
      this.$store.dispatch("doQuantaValid", true);
      if (this.newQuanta) {
        await this.$store.dispatch("doQuanta", this.quanta);
        await this.$store.dispatch("doNewQuanta", true);
      } else {
        this.checkForChanges();
        if (this.formFieldsChanged) {
          await this.$store.dispatch("doQuanta", this.quanta);
          await this.$store.dispatch("doQuantaUpdated", true);
        }
      }
    } else {
      this.$store.dispatch("doQuantaValid", false);
      if (this.quanta.description.trim().length > 0) {
        this.$store.dispatch("doQuanta", this.quanta); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findQuantaAndSetup();
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.quanta.id < 1
    ) {
      this.quanta.description = `Case Quanta - Cost on behalf of - ${this.$store.getters.getClaimant.fullName}`;
    }

    this.lbl = `required - Insert Quantum of damages suffered with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Quantum submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.quanta.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.quanta.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch("doTextLength", this.quanta.description.length);

    if (this.$refs.quanta.validate()) {
      await this.$store.dispatch("doQuantaValid", true);
    } else {
      await this.$store.dispatch("doQuantaValid", false);
    }
  }
};
</script>
