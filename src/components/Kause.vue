<template>
  <v-form>
    <v-container>
      <v-layout row wrap justify-center>
        <v-flex xs12 md8 lg8>
          <v-card>
            <v-card-title
              class="headline font-weight-regular primary white--text"
              >Select Jurisdiction
            </v-card-title>
            <v-card-text>
              <v-subheader class="pa-0"
                >Where did the accident occur?</v-subheader
              >
              <v-autocomplete
                v-model="juris"
                :hint="
                  !readOnly
                    ? !isEditing
                      ? 'Click the icon to edit'
                      : 'Click the icon to save'
                    : ''
                "
                :items="jurisdictions"
                item-text="description"
                item-value="id"
                :readonly="!isEditing"
                :label="`State — ${isEditing ? 'Editable' : 'Read only'}`"
                persistent-hint
                prepend-icon="mdi-city"
              >
                <template v-slot:append-outer>
                  <v-slide-x-reverse-transition mode="out-in">
                    <v-icon
                      v-if="!readOnly"
                      :key="`icon-${isEditing}`"
                      :color="isEditing ? 'success' : 'info'"
                      @click="isEditing = !isEditing"
                      v-text="
                        isEditing
                          ? 'mdi-check-outline'
                          : 'mdi-circle-edit-outline'
                      "
                    ></v-icon>
                  </v-slide-x-reverse-transition>
                </template>
              </v-autocomplete>
            </v-card-text>
          </v-card>
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
      dCoa: {
        id: 0,
        description: "No Data",
        ClaimantId: this.$store.getters.getClaimantId
          ? this.$store.getters.getClaimantId
          : 0,
        totalUploads: 0,
        JurisdictionId: 0
      },
      juris: 0,
      isEditing: false,
      jurisdictions: [],
      name: "kool",
      currentCoa: {},
      newCoa: false,
      cClaim: false,
      coaHead: "Insured",
      formFieldsChanged: false,
      nameRules: [],
      max: process.env.VUE_APP_MAXTXT_LENGTH,
      min: process.env.VUE_APP_MINTXT_LENGTH,
      lbl: "",
      option: {}
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
    async findCoaAndSetup() {
      if (this.$store.getters.getCoa) {
        var coa = this.$store.getters.getCoa;
        this.currentCoa.description = coa.description;
        this.currentCoa.JurisdictionId = coa.JurisdictionId;

        this.dCoa.id = coa.id;
        this.dCoa.description = coa.description;
        this.dCoa.JurisdictionId = coa.JurisdictionId;

        this.dCoa.ClaimantId = this.$store.getters.getClaimantId;

        this.newCoa = false;
        this.$store.dispatch("initCoaId", this.dCoa.id);
        //console.log("j " + this.dCoa.JurisdictionId);
        for (var i = 0; i < this.jurisdictions.length; i++) {
          if (this.jurisdictions[i].id === this.dCoa.JurisdictionId) {
            this.juris = this.jurisdictions[i].id;
          }
        }
        var coaFiles = this.$store.getters.getCoaFiles;
        if (!coaFiles || coaFiles.length < 1) {
          if (this.dCoa.id > 0) {
            this.findCoaFiles();
          }
        }
      } else {
        this.newCoa = true;
      }
    },
    selected(e) {
      //console.log(JSON.stringify(e));
      this.dCoa.JurisdictionId = e.id;
    },
    async populateDDs() {
      try {
        await this.$store.getters.getJurisdictions.forEach(juris => {
          this.jurisdictions.push({
            id: juris.id,
            description:
              juris.description.indexOf("High") > 0
                ? juris.description
                : juris.description + " " + juris.court_type
          });
        });
        //this.dCoa.JurisdictionId = this.jurisdictions[0].id;
      } catch (err) {
        console.log("problem finding jurisdictions " + err);
      }
    },
    findCoaFiles() {
      var findObj = {
        url: `/coafiles/claimant/${this.dCoa.id}`,
        id: caseModels.COA
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(coaFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", coaFiles);
          //console.log('Coa files found ' + coaFiles.length);
        })
        .catch(err => {
          console.log("Problem Coa find files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentCoa.description != this.dCoa.description) {
        this.formFieldsChanged = true;
      }
      if (this.currentCoa.JurisdictionId != this.dCoa.JurisdictionId) {
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
    if (this.dCoa.JurisdictionId > 0) {
      this.$store.dispatch("doCoaValid", true);
      if (this.newCoa) {
        try {
          await this.$store.dispatch("doCoa", this.dCoa);
          await this.$store.dispatch("doNewCoa", true);
        } catch (err) {
          console.log(
            "error creating Coa statement " + JSON.stringify(this.dCoa)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doCoa", this.dCoa);
            await this.$store.dispatch("doCoaUpdated", true);
          }
        } catch (err) {
          console.log("error updating dCoa statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doCoaValid", false);
      if (this.dCoa.description.trim().length > 0) {
        this.$store.dispatch("doCoa", this.dCoa); //so don't have to retype text
      }
    }
  },
  async created() {
    await this.populateDDs();
    await this.findCoaAndSetup();

    this.lbl = `location  *required - capture between ${this.min} and ${this.max} characters`;
    this.nameRules = [
      v => !!v || "Location submission or summary is required",
      v =>
        (v || "").length >= this.min ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.dCoa.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.dCoa.description.length}`
    ];
    // console.log('coa form valid '+ this.$store.getters.getIsFormValid);
  },
  async updated() {
    if (this.juris > 0) {
      this.$store.dispatch("doCoaValid", true);
    } else {
      this.$store.dispatch("doCoaValid", false);
    }
  },
  watch: {
    juris: function(val) {
      this.dCoa.JurisdictionId = val;
    }
  }
};
</script>
