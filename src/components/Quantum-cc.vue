<template>
  <v-form>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <h2>Quantum of damages - {{ quantaHead }}</h2>
          <br />
          <v-textarea
            :readonly="readOnly"
            :maxlength="max"
            name="quanta"
            filled
            :label="lbl"
            ref="ccQuanta"
            v-model="ccQuanta.description"
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
      ccQuanta: {
        id: 0,
        description: "",
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendantId
          : 0,
        totalUploads: 0
      },
      currentQuanta: {},
      newQuanta: false,
      cClaim: false,
      quantaHead: "Third Party Insured",
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
    async findQuantaAndSetup() {
      var quanta = await this.$store.getters.getCcQuanta;
      if (quanta) {
        this.currentQuanta.description = quanta.description;
        this.ccQuanta.id = quanta.id;
        this.ccQuanta.description = quanta.description;
        this.newQuanta = false;
        this.$store.dispatch("doCcQuantaId", this.ccQuanta.id);

        var quantaFiles = this.$store.getters.getCcQuantaFiles;
        //console.log('quantaFiles CC '+ JSON.stringify(quantaFiles))
        if (!quantaFiles || quantaFiles.length < 1) {
          if (this.ccQuanta.id > 0) {
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
        url: `/quantumfilesCC/defend/${this.ccQuanta.id}`,
        id: caseModels.COUNTERQUANTA
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(quantaFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", quantaFiles);
          //console.log('quanta files found ' + files.length);
        })
        .catch(err => {
          console.log("Problem finding ccQuanta files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentQuanta.description != this.ccQuanta.description) {
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
    if (this.$refs.ccQuanta.validate()) {
      this.$store.dispatch("doCcQuantaValid", true);
      if (this.newQuanta) {
        try {
          await this.$store.dispatch("doCcQuanta", this.ccQuanta);
          await this.$store.dispatch("doNewccQuanta", true);
        } catch (err) {
          console.log(
            "error creating Quanta statement " + JSON.stringify(this.ccQuanta)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doCcQuanta", this.ccQuanta);
            await this.$store.dispatch("doCcQuantaUpdated", true);
          }
        } catch (err) {
          console.log("error updating quanta statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doCcQuantaValid", false);
      if (this.ccQuanta.description.trim().length > 0) {
        this.$store.dispatch("doCcQuanta", this.ccQuanta); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.findQuantaAndSetup();
    this.lbl = `required - Insert Quantum of damages suffered with supporting documents - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Quantum submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccQuanta.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccQuanta.description.length}`
    ];
  },
  async updated() {
    await this.$store.dispatch(
      "doTextLength",
      this.ccQuanta.description.length
    );

    if (this.$refs.ccQuanta.validate()) {
      this.$store.dispatch("doCcQuantaValid", true);
    } else {
      this.$store.dispatch("doCcQuantaValid", false);
    }
  }
};
</script>
