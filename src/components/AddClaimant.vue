<template>
  <v-layout>
    <v-flex xs4,>
      <Panel title="The Insured">
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-text-field
              v-model="poc"
              label="Particulars of claim"
              :readonly="true"
              v-if="arbitCase.id < 1"
              class="ma-0 pa-0"
              dense
            >
            </v-text-field>
            <v-select
              v-model="pocId"
              :items="particulars"
              :counter="40"
              item-text="name"
              item-value="val"
              label="Select Description of Case"
              :readonly="readOnly"
              v-if="arbitCase.id > 0"
              dense
            >
            </v-select>
            <v-text-field
              v-model="organization"
              label="Insured company"
              :readonly="true"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.address"
              label="Insured company address"
              :rules="addressRules"
              :readonly="readOnly"
              class="ma-0 pa-0"
              dense
              height="20"
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.contactPerson"
              label="Insured contact person"
              :rules="nameRules"
              :readonly="readOnly"
              class="ma-0 pa-0"
              ref="contact"
              dense
              height="20"
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.telephone"
              label="Insured contact person number"
              :rules="required"
              :readonly="readOnly"
              class="ma-0 pa-0"
              dense
              height="20"
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.email"
              label="Insured contact person email"
              :rules="emailRules"
              :readonly="readOnly"
              class="ma-0 pa-0"
              dense
              height="20"
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.fullName"
              label="Insured policy holder name"
              :rules="nameRules"
              :readonly="readOnly"
              class="ma-0 pa-0"
              dense
              height="20"
            >
            </v-text-field>
            <v-text-field
              v-model="claimant.policyNumber"
              label="Insured policy number"
              :rules="nameRules"
              :readonly="readOnly"
              class="ma-0 pa-0"
              dense
              height="20"
            >
            </v-text-field>
          </v-form>
          <v-snackbar v-model="snackbar" :top="true">
            {{ text }}
            <v-btn dark text @click="snackbar = false">
              Close
            </v-btn>
          </v-snackbar>
        </v-card-text>
      </Panel>
    </v-flex>
  </v-layout>
</template>
<script>
import Panel from "@/components/Panel";
import poc from "@/status-enums/poc";

export default {
  data() {
    return {
      claimant: {
        id: "",
        fullName: "",
        contactPerson: "",
        StatusId: 0,
        CompanyId: 0,
        timeLapsed: 0,
        address: "",
        telephone: "",
        policyNumber: "",
        email: ""
      },
      originalClaimant: {
        fullName: "",
        contactPerson: "",
        address: "",
        telephone: "",
        email: "",
        policyNumber: ""
      },
      arbitCase: {
        id: 0
      },
      demoUser: process.env.VUE_APP_DEMO_USER,
      isDemo: false,
      show: true,
      snackbar: false,
      organization: "",
      formFieldsChanged: false,
      valid: "",
      poc: "",
      pocId: 0,
      insCoys: [],
      selClaimCoy: "",
      particulars: [],
      y: "top",
      x: null,
      mode: "",
      timeout: 6000,
      text: "look sharp!",
      required: [v => !!v || "This field is required"],
      nameRules: [
        v => !!v || "This field is required",
        v => (v && v.length <= 30) || "Contact must be less than 30 characters"
      ],
      addressRules: [
        v => !!v || "Address is required",
        v => (v && v.length <= 50) || "Address must be less than 50 characters"
      ],
      emailRules: [
        v => !!v || "Insured E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  props: {
    readOnly: {
      type: Boolean
    }
  },
  components: {
    Panel
  },
  async created() {
    this.arbitCase = await this.$store.getters.getCase;
    if (this.arbitCase.id < 1) {
      await this.$store.getters.getPocs.forEach(poc => {
        if (poc.id === this.arbitCase.PocId) {
          this.poc = poc.Description;
        }
      });
      this.organization = this.$store.getters.getArbitUser.Company.name;
      this.claimant.address = this.$store.getters.getArbitUser.Company.address;
      this.claimant.CompanyId = this.$store.getters.getArbitUser.CompanyId;
      if (
        this.$store.getters.getArbitUser.id == this.demoUser &&
        this.claimant.id < 1
      ) {
        this.claimant.fullName = "Joe Pienaar";
        this.claimant.contactPerson = "Little Ricard";
        this.claimant.telephone = "0834151408";
        this.claimant.email = "rshen@egavel.co.za";
        this.claimant.policyNumber = "TC99991";
        this.isDemo = true;
      }
    } else {
      await this.populatePocs();
    }
    await this.getCoyAndSetup();
    //console.log('claimant  in claimant create hook ' + JSON.stringify(this.$store.getters.getClaimants));
    await this.getCompany();

    if (await this.$store.getters.getClaimant) {
      //console.log('claimant in claimant create hook claimant not null ' + JSON.stringify(this.claimant));
      if (await this.$store.getters.isClaimantValid) {
        await this.$store.dispatch("doIsFormValid", true);
      }
    } else {
      await this.$store.dispatch("doClaimantValid", false);
    }
  },
  async beforeDestroy() {
    //console.log('Claimant isst' + JSON.stringify(this.claimant));
    if (this.$refs.form.validate()) {
      await this.$store.dispatch("doClaimantValid", true);
      await this.$store.dispatch("doClaimantCaseValid", false);

      var claimant = await this.$store.getters.getClaimant;
      if (!claimant) {
        try {
          await this.$store.dispatch("doClaimant", this.claimant);
          await this.$store.dispatch("doNewClaimant", true);
        } catch (err) {
          console.log("Error creating arbit case " + err);
        }
      } else {
        if (this.claimant.id > 0) {
          this.checkForChanges();
          try {
            if (this.formFieldsChanged) {
              await this.$store.dispatch("doClaimantUpdated", true);
              await this.$store.dispatch("doClaimant", this.claimant);
              if (await this.$store.getters.getDefendant) {
                this.$store.dispatch("doDefendantValid", true);
              }
            }
          } catch (err) {
            console.log("Error updating arbit case " + err);
          }
        }
      }
      if (this.arbitCase && this.arbitCase.id > 0) {
        if (
          this.originalClaimant.PocId !=
          (await this.$store.getters.getCase.PocId)
        ) {
          await this.$store.dispatch("doCaseUpdated", true);
          await this.$store.dispatch("doNewCase", false);
        }
      }
      if (this.arbitCase) {
        await this.$store.dispatch("doClaimantCaseValid", true);
      }
    } else {
      this.$store.dispatch("doClaimantValid", false);
    }

    //console.log('Is claimant valid '+this.$store.getters.isClaimantValid);
  },
  watch: {
    pocId: function(val) {
      var pocDesc = "";
      this.particulars.forEach(poc => {
        if (poc.val === val) {
          pocDesc = poc.name;
        }
      });
      this.$store.dispatch("initCase", {
        id: this.arbitCase.id,
        PocId: val,
        particularsOfClaim: pocDesc,
        updatedBy: this.$store.getters.getArbitUser.id,
        ArbitUserId: this.arbitCase.ArbitUserId
      });
    }
  },
  async updated() {
    if (this.$refs.form.validate()) {
      this.$store.dispatch("doIsFormValid", true);
      this.$store.dispatch("doClaimantValid", true);
    } else {
      this.$store.dispatch("doIsFormValid", false);
      this.$store.dispatch("doClaimantValid", false);
    }
  },
  methods: {
    getCoyAndSetup() {
      try {
        var claimant = this.$store.getters.getClaimant;
        if (claimant) {
          this.claimant = claimant;
          this.originalClaimant.fullName = this.claimant.fullName;
          this.originalClaimant.address = this.claimant.address;
          this.originalClaimant.telephone = this.claimant.telephone;
          this.originalClaimant.contactPerson = this.claimant.contactPerson;
          this.originalClaimant.email = this.claimant.email;
          this.originalClaimant.policyNumber = this.claimant.policyNumber;

          this.arbitCase.id > 0
            ? (this.originalClaimant.PocId = this.arbitCase.PocId)
            : 0;
          this.$store.dispatch("initClaimantId", this.claimant.id);

          for (var i = 0; i < this.particulars.length; i++) {
            if (this.particulars[i].val === this.arbitCase.PocId) {
              this.pocId = this.particulars[i].val;
            }
          }
        }
      } catch (err) {
        console.log("error claimant on case " + err);
      }
    },
    checkForChanges() {
      if (this.originalClaimant.fullName != this.claimant.fullName) {
        this.formFieldsChanged = true;
      }
      if (this.originalClaimant.contactPerson != this.claimant.contactPerson) {
        this.formFieldsChanged = true;
      }
      if (this.originalClaimant.address != this.claimant.address) {
        this.formFieldsChanged = true;
      }
      if (this.originalClaimant.telephone != this.claimant.telephone) {
        this.formFieldsChanged = true;
      }
      if (this.originalClaimant.email != this.claimant.email) {
        this.formFieldsChanged = true;
      }
      if (this.originalClaimant.policyNumber != this.claimant.policyNumber) {
        this.formFieldsChanged = true;
      }
    },
    async populateClaimant() {
      this.claimant.id;
    },
    async populatePocs() {
      var pocs = await this.$store.getters.getPocs.filter(part => {
        return (
          part.id === poc.TWOVEHICLE ||
          part.id === poc.MULTIPLE ||
          part.id === poc.SINGLE
        );
      });
      pocs.forEach(poc => {
        this.particulars.push({ name: poc.Description, val: poc.id });
      });
      await this.particulars.sort((a, b) => (a.val > b.val ? 1 : -1));
    },
    async getCompany() {
      await this.$store.getters.getInsCoys.forEach(coy => {
        if (this.claimant.CompanyId === coy.id) {
          this.organization = coy.name;
        }
      });
    }
  }
};
</script>
<style scoped>
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 1;
}

footer {
  position: absolute;
  z-index: 100;
  top: 100;
  height: 100px;
}
</style>
