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
                :label="`State — ${isEditing ? 'Editable' : 'Readonly'}`"
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
      ccCoa: {
        id: 0,
        description: "No Data",
        DefendantId: this.$store.getters.getDefendant
          ? this.$store.getters.getDefendantId
          : 0,
        totalUploads: 0,
        JurisdictionId: 0
      },
      juris: 0,
      isEditing: false,
      jurisdictions: [],
      currentCoa: {},
      newCoa: false,
      cClaim: false,
      coaHead: "Third Party",
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
    async findCoaAndSetup() {
      var coa = await this.$store.getters.getCcCoa;
      if (coa) {
        this.currentCoa.description = coa.description;
        this.currentCoa.JurisdictionId = coa.JurisdictionId;

        this.ccCoa.id = coa.id;
        this.ccCoa.description = coa.description;
        this.ccCoa.JurisdictionId = coa.JurisdictionId;
        this.newCoa = false;
        this.$store.dispatch("doCcCoaId", this.ccCoa.id);

        for (var i = 0; i < this.jurisdictions.length; i++) {
          if (this.jurisdictions[i].id == this.ccCoa.JurisdictionId) {
            this.juris = this.jurisdictions[i].id;
          }
        }
        var coaFiles = this.$store.getters.getCcCoaFiles;
        if (!coaFiles || coaFiles.length < 1) {
          if (this.ccCoa.id > 0) {
            this.findCoaFiles();
          }
        }
      } else {
        this.newCoa = true;
      }
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
        url: `/coafilesCC/defend/${this.ccCoa.id}`,
        id: caseModels.COUNTERCOA
      };
      this.$store
        .dispatch("findFiles", findObj)
        .then(coaFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", coaFiles);
          //console.log('Coa files found ' + files.length);
        })
        .catch(err => {
          console.log("Problem ccCoa find files  " + err);
        });
    },
    checkForChanges() {
      if (this.currentCoa.description != this.ccCoa.description) {
        this.formFieldsChanged = true;
      }
      if (this.currentCoa.JurisdictionId != this.ccCoa.JurisdictionId) {
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
    if (this.ccCoa.JurisdictionId > 0) {
      this.$store.dispatch("doCcCoaValid", true);
      if (this.newCoa) {
        try {
          await this.$store.dispatch("doCcCoa", this.ccCoa);
          await this.$store.dispatch("doNewccCoa", true);
        } catch (err) {
          console.log(
            "error creating ccCoa statement " + JSON.stringify(this.ccCoa)
          );
        }
      } else {
        try {
          this.checkForChanges();
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doCcCoa", this.ccCoa);
            await this.$store.dispatch("doCcCoaUpdated", true);
          }
        } catch (err) {
          console.log("error updating ccCoa statement " + err);
        }
      }
    } else {
      this.$store.dispatch("doCcCoaValid", false);
      if (this.ccCoa.description.trim().length > 0) {
        this.$store.dispatch("doCcCoa", this.ccCoa); //so don't have to retype text
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
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccCoa.description.length}`,
      v =>
        (v || "").length <= this.max ||
        `Description must be between ${this.min} and ${this.max}\n Current length ${this.ccCoa.description.length}`
    ];
  },
  async updated() {
    if (this.ccCoa.JurisdictionId > 0) {
      this.$store.dispatch("doCcCoaValid", true);
    } else {
      this.$store.dispatch("doCcCoaValid", false);
    }
  },
  watch: {
    juris: function(val) {
      this.ccCoa.JurisdictionId = val;
    }
  }
};
</script>
