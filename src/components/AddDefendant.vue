<template>
  <v-layout>
    <v-flex xs4,>
      <Panel title="Third Party Insured">
        <v-card-text>
          <v-form v-model="valid" ref="form">
            <v-select
              item-text="name"
              item-value="val"
              v-model="selectDefCoy"
              :items="insCoys"
              :readonly="readOnly"
              label="Select Third Party Insured Company"
              dense
            >
            </v-select>
            <v-text-field
              v-model="defendant.address"
              label="Third Party Insured Company Address"
              :rules="addressRules"
              :readonly="readOnly"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="defendant.contactPerson"
              label="Third Party Insured contact person"
              :rules="nameRules"
              :readonly="readOnly"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="defendant.telephone"
              label="Third Party Insured contact person number"
              :rules="required"
              :readonly="readOnly"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="defendant.email"
              label="Third Party Insured contact person email"
              :rules="emailRules"
              :readonly="readOnly"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="defendant.fullName"
              label="Third Party Insured policy holder name"
              :rules="nameRules"
              :readonly="readOnly"
              class="inputs"
              dense
            >
            </v-text-field>
            <v-text-field
              v-model="defendant.policyNumber"
              label="Third party Insured policy number"
              :rules="nameRules"
              :readonly="readOnly"
              class="inputs"
              dense
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
export default {
  data() {
    return {
      defendant: {
        id: 0,
        fullName: "",
        contactPerson: "",
        StatusId: 0,
        CompanyId: 0,
        ArbitUserId: 0,
        ArbitCaseId: 0,
        address: "",
        telephone: "",
        policyNumber: "",
        email: "",
        timeLapsed: 0
      },
      originalDefendant: {
        fullName: "",
        contactPerson: "",
        CompanyId: 0,
        address: "",
        telephone: "",
        policyNumber: "",
        email: ""
      },
      show: true,
      demoUser: process.env.VUE_APP_DEMO_USER,
      selectDefCoy: "",
      insCoys: [],
      insKays: [],
      snackbar: false,
      caseStatus: 0,
      formFieldsChanged: false,
      valid: "",
      poc: "",
      y: "top",
      x: null,
      mode: "",
      timeout: 6000,
      text: "Notice to defend - look sharp!",
      required: [v => !!v || "This field is required"],
      nameRules: [
        v => !!v || "Third party contact is required",
        v => (v && v.length <= 30) || "Contact must be less than 30 characters"
      ],
      addressRules: [
        v => !!v || "Address is required",
        v => (v && v.length <= 50) || "Address must be less than 50 characters"
      ],
      emailRules: [
        v => !!v || "third party E-mail is required",
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
    await this.populateCoyDDs();
    this.$store.dispatch("doDefendantValid", true);

    await this.getCoyAndSetup();
    var arbitCase = this.$store.getters.getCase;
    this.defendant.ArbitCaseId = this.$store.getters.getCase.id;
    if (
      this.$store.getters.getArbitUser.id == this.demoUser &&
      this.defendant.id < 1 &&
      arbitCase.PocId < 3
    ) {
      this.defendant.fullName = "Buster Keaton";
      this.defendant.contactPerson = "Billy Wilder";
      this.defendant.telephone = "0834151409";
      this.defendant.email = "lhegele@egavel.co.za";
      this.defendant.policyNumber = "Pn99991";
      this.isDemo = true;
    }
    var defendant = this.$store.getters.getDefendant;

    if (defendant) {
      //console.log('claimant in claimant create hook claimant not null ' + JSON.stringify(this.claimant));
      if (this.$store.getters.isDefendantValid) {
        this.$store.dispatch("doIsFormValid", true);
      }
    }
  },
  async beforeDestroy() {
    if (this.$refs.form.validate()) {
      await this.$store.dispatch("doDefendantValid", true);
      await this.$store.dispatch("doDefendantUpdated", false);
      var defendant = this.$store.getters.getDefendant;

      if (!defendant) {
        try {
          this.defendant.ArbitCaseId = this.$store.getters.getCase.id;
          await this.$store.dispatch("doDefendant", this.defendant);
          await this.$store.dispatch("doNewDefendant", true);
        } catch (err) {
          console.log("Error creating defendant " + err);
        }
      } else {
        if (this.defendant.id > 0) {
          this.checkForChanges();
          try {
            if (this.formFieldsChanged) {
              await this.$store.dispatch("doDefendantUpdated", true);
              await this.$store.dispatch("doDefendant", this.defendant);
            }
          } catch (err) {
            console.log("Error updating Defendant " + err);
          }
        }
      }
    } else {
      this.$store.dispatch("doDefendantValid", false);
    }
  },
  async updated() {
    if (this.$refs.form.validate()) {
      this.$store.dispatch("doIsFormValid", true);
      this.$store.dispatch("doDefendantValid", true);
    } else {
      this.$store.dispatch("doIsFormValid", false);
      this.$store.dispatch("doDefendantValid", false);
    }
  },
  methods: {
    async getCoyAndSetup() {
      try {
        var defendant = this.$store.getters.getDefendant;
        if (defendant) {
          //console.log('defendant ' + JSON.stringify(defendant));
          this.defendant = defendant;
          await this.loadDefendant(defendant);

          this.originalDefendant.fullName = this.defendant.fullName;
          this.originalDefendant.address = this.defendant.address;
          this.originalDefendant.telephone = this.defendant.telephone;
          this.originalDefendant.contactPerson = this.defendant.contactPerson;
          this.originalDefendant.email = this.defendant.email;
          this.originalDefendant.CompanyId = this.defendant.CompanyId;
          this.originalDefendant.policyNumber = this.defendant.policyNumber;

          await this.$store.dispatch("initDefendantId", this.defendant.id);

          for (var i = 0; i < this.insCoys.length; i++) {
            if (this.insCoys[i].val == this.defendant.CompanyId) {
              this.selectDefCoy = this.insCoys[i].val;
            }
          }
        }
      } catch (err) {
        console.log("error defendants on case " + err);
      }
    },
    populateCoyDDs() {
      this.$store.getters.getInsCoys.forEach(coy => {
        var addCoy = true;
        switch (coy.name) {
          case "Commissioners":
            addCoy = false;
            break;
          case "Admin":
            addCoy = false;
            break;
          case "Company Admin":
            addCoy = false;
            break;
          default:
            addCoy = true;
        }
        if (addCoy) this.insCoys.push({ name: coy.name, val: coy.id });
      });
    },
    async findCoyAddress(coyId) {
      this.$store.getters.getInsCoys.forEach(coy => {
        if (coy.id === coyId) {
          this.defendant.address = coy.address;
        }
      });
    },
    async loadDefendant(defendant) {
      this.defendant.id = defendant.id;
      this.defendant.fullName = defendant.fullName;
      this.defendant.address = defendant.address;
      this.defendant.telephone = defendant.telephone;
      this.defendant.contactPerson = defendant.contactPerson;
      this.defendant.email = defendant.email;
      this.defendant.CompanyId = defendant.CompanyId;
      this.defendant.policyNumber = defendant.policyNumber;
      this.defendant.ArbitUserId = defendant.ArbitUserId;
      this.defendant.StatusId = defendant.StatusId;
      this.defendant.ArbitCaseId = defendant.ArbitCaseId;
    },
    checkForChanges() {
      if (this.originalDefendant.fullName != this.defendant.fullName) {
        this.formFieldsChanged = true;
      }
      if (
        this.originalDefendant.contactPerson != this.defendant.contactPerson
      ) {
        this.formFieldsChanged = true;
      }
      if (this.originalDefendant.address != this.defendant.address) {
        this.formFieldsChanged = true;
      }
      if (this.originalDefendant.telephone != this.defendant.telephone) {
        this.formFieldsChanged = true;
      }
      if (this.originalDefendant.email != this.defendant.email) {
        this.formFieldsChanged = true;
      }
      if (this.originalDefendant.CompanyId != this.defendant.CompanyId) {
        this.formFieldsChanged = true;
      }
      if (this.originalDefendant.policyNumber != this.defendant.policyNumber) {
        this.formFieldsChanged = true;
      }
    }
  },
  watch: {
    selectDefCoy: function() {
      this.defendant.CompanyId = this.selectDefCoy;
      this.findCoyAddress(this.defendant.CompanyId);
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
  opacity: 0;
}

footer {
  position: absolute;
  z-index: 100;
  top: 120;
}
.inputs {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
