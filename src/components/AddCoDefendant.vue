<template>
  <v-layout>
    <v-flex xs12>
      <YesNoDiag
        :dialog="dialog"
        :msg="msg"
        @descision="fileClaimCheck"
      ></YesNoDiag>
      <Panel
        :title="title"
        :multiProp="multiProp"
        :isVisible="isVisible"
        @del-form="delete3rdParty"
      >
        <v-card-text class="mt-4">
          <v-form v-model="valid" ref="form">
            <v-select
              item-text="name"
              item-value="val"
              v-model="selectDefCoy"
              :items="insCoys"
              :readonly="readOnly"
              label="Select Third Party Company"
              class="inputs"
            ></v-select>
            <v-text-field
              v-model="coDefendant.address"
              label="Third Party Company Address"
              :rules="addressRules"
              required:true
              :readonly="readOnly"
              class="inputs"
            >
            </v-text-field>
            <v-text-field
              v-model="coDefendant.contactPerson"
              label="Third Party contact person"
              :rules="nameRules"
              :readonly="readOnly"
              required:true
              class="inputs"
            >
            </v-text-field>
            <v-text-field
              v-model="coDefendant.telephone"
              label="Third Party contact person number"
              :rules="required"
              required:true
              :readonly="readOnly"
              class="inputs"
            >
            </v-text-field>
            <v-text-field
              v-model="coDefendant.email"
              label="Third Party contact person email"
              :rules="emailRules"
              required:true
              :readonly="readOnly"
              class="inputs"
            >
            </v-text-field>
            <v-text-field
              v-model="coDefendant.fullName"
              label="Third party policy holder name"
              :rules="policyRules"
              :readonly="readOnly"
              required:true
              class="inputs"
            >
            </v-text-field>
            <v-text-field
              v-model="coDefendant.policyNumber"
              label="Third party policy number"
              :rules="required"
              required:true
              :readonly="readOnly"
              class="inputs"
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
import YesNoDiag from "@/components/YesNoDiag.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  data() {
    return {
      coDefendant: {
        id: 0,
        fullName: "",
        contactPerson: "",
        StatusId: 0,
        CompanyId: 0,
        ArbitUserId: null,
        ArbitCaseId: 0,
        address: "",
        telephone: "",
        policyNumber: "",
        email: ""
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
      coDefendantObjs: [],
      selectDefCoy: "",
      insCoys: [],
      snackbar: false,
      coDefendantObj: null,
      formFieldsChanged: false,
      valid: "",
      title: "",
      multiProp: true,
      msg: "Are you sure you wish to delete the 3rd Party",
      dialog: false,
      idx: 0,
      y: "top",
      x: null,
      mode: "",
      isVisible: true,
      timeout: 6000,
      text: "Notice to defend - look sharp!",
      required: [v => !!v || "This field is required"],
      nameRules: [
        v => !!v || "Contact is required",
        v => (v && v.length <= 30) || "Contact must be less than 30 characters"
      ],
      policyRules: [
        v => !!v || "Policy holder is required",
        v =>
          (v && v.length <= 30) ||
          "Policy Holder must be less than 30 characters"
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
    Panel,
    YesNoDiag
  },
  async created() {
    await this.populateCoyDDs();
    await this.initCoDef();

    this.idx = await this.$store.getters.getCoDefStep;
    this.title = `Third Party-${this.idx + 1}`;
    await this.getCoyAndSetup();

    var Claim = this.$store.getters.getClaimant;
    if (Claim.StatusId > caseStatus.OPENED) {
      this.isVisible = false;
    }
    //console.log('claimant  in claimant create hook ' + JSON.stringify(this.$store.getters.getClaimants));
    if (this.coDefendantObj) {
      this.$emit("form-valid", true);
    }
  },
  async beforeDestroy() {
    if (this.$refs.form.validate()) {
      this.$emit("form-valid", true);
      if (this.coDefendant.id < 1) {
        try {
          if (!this.coDefendantObj) {
            this.coDefendant.StatusId = caseStatus.OPENED;
            this.coDefendantObjs.push({
              coDefendant: this.coDefendant,
              create: true,
              update: false
            });
          } else {
            if (this.hasChanges()) {
              var idx = this.idx;
              this.coDefendantObjs[idx] = {
                coDefendant: this.coDefendant,
                create: true,
                update: false
              };
            }
          }
          await this.$store.dispatch("doCoDefendants", this.coDefendantObjs);
        } catch (err) {
          console.log("Error creating defendant " + err);
        }
      } else {
        if (this.coDefendant.id > 0) {
          try {
            if (this.hasChanges()) {
              this.coDefendantObjs[this.idx] = {
                coDefendant: this.coDefendant,
                create: false,
                update: true
              };
            }
            await this.$store.dispatch("doCoDefendants", this.coDefendantObjs);
          } catch (err) {
            console.log("Error creating CoDefendant in store " + err);
          }
        }
      }
    } else {
      this.$emit("form-valid", null);
    }
  },
  async updated() {
    if (this.$refs.form.validate()) {
      this.$emit("form-valid", true);
    } else {
      this.$emit("form-valid", false);
    }
  },
  methods: {
    initCoDef() {
      this.coDefendant.fullName = "";
      this.coDefendant.contactPerson = "";
      this.coDefendant.address = "";
      this.coDefendant.policyNumber = "";
      this.coDefendant.email = "";

      this.coDefendants = [];
    },
    async getCoyAndSetup() {
      try {
        var idx = await this.$store.getters.getCoDefStep;
        this.coDefendantObjs = Object.assign(
          [],
          await this.$store.getters.getCoDefendants
        );
        this.coDefendantObj = this.coDefendantObjs[idx];
        if (this.coDefendantObj) {
          await this.loadForm();
        }
      } catch (err) {
        console.log("error loading coDefendants on case " + err);
      }
    },
    populateCoyDDs() {
      this.$store.getters.getInsCoys.forEach(coy => {
        this.insCoys.push({ name: coy.name, val: coy.id });
      });
    },
    async findCoyAddress(coyId) {
      this.$store.getters.getInsCoys.forEach(coy => {
        if (coy.id === coyId) {
          this.coDefendant.address = coy.address;
        }
      });
    },
    hasChanges() {
      if (this.originalDefendant.fullName != this.coDefendant.fullName) {
        return true;
      }
      if (
        this.originalDefendant.contactPerson != this.coDefendant.contactPerson
      ) {
        return true;
      }
      if (this.originalDefendant.address != this.coDefendant.address) {
        return true;
      }
      if (this.originalDefendant.telephone != this.coDefendant.telephone) {
        return true;
      }
      if (this.originalDefendant.email != this.coDefendant.email) {
        return true;
      }
      if (this.originalDefendant.CompanyId != this.coDefendant.CompanyId) {
        return true;
      }
      if (
        this.originalDefendant.policyNumber != this.coDefendant.policyNumber
      ) {
        return true;
      }
      return false;
    },
    async delete3rdParty(delForm) {
      if (delForm) {
        this.dialog = true;
      }
    },
    fileClaimCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        this.$refs.form.reset();
        if (this.coDefendantObj) {
          this.coDefendantObjs.splice(this.idx);
          this.$store.dispatch("doCoDefendants", this.coDefendantObjs);
          this.$store
            .dispatch("delFile", `defendants/${this.coDefendant.id}`)
            .then(response => {
              console.log("deleted " + response);
            });
        }
      }
    },
    loadForm() {
      this.coDefendant.id = this.coDefendantObj.coDefendant.id;
      this.coDefendant.fullName = this.coDefendantObj.coDefendant.fullName;
      this.coDefendant.address = this.coDefendantObj.coDefendant.address;
      this.coDefendant.telephone = this.coDefendantObj.coDefendant.telephone;
      this.coDefendant.contactPerson = this.coDefendantObj.coDefendant.contactPerson;
      this.coDefendant.email = this.coDefendantObj.coDefendant.email;
      this.coDefendant.CompanyId = this.coDefendantObj.coDefendant.CompanyId;
      this.coDefendant.policyNumber = this.coDefendantObj.coDefendant.policyNumber;
      this.coDefendant.ArbitUserId = this.coDefendantObj.coDefendant.ArbitUserId;
      this.coDefendant.StatusId = this.coDefendantObj.coDefendant.StatusId;
      this.coDefendant.ArbitCaseId = this.coDefendantObj.coDefendant.ArbitCaseId;

      this.originalDefendant.fullName = this.coDefendant.fullName;
      this.originalDefendant.address = this.coDefendant.address;
      this.originalDefendant.telephone = this.coDefendant.telephone;
      this.originalDefendant.contactPerson = this.coDefendant.contactPerson;
      this.originalDefendant.email = this.coDefendant.email;
      this.originalDefendant.CompanyId = this.coDefendant.CompanyId;
      this.originalDefendant.policyNumber = this.coDefendant.policyNumber;

      for (var i = 0; i < this.insCoys.length; i++) {
        if (this.insCoys[i].val == this.coDefendant.CompanyId) {
          this.selectDefCoy = this.insCoys[i].val;
        }
      }
    }
  },
  watch: {
    selectDefCoy: function(val) {
      this.coDefendant.CompanyId = val;
      this.findCoyAddress(this.coDefendant.CompanyId);
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
