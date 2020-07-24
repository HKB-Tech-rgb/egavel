<template>
  <v-layout>
    <h3 class="subheading black--text" v-if="displayMsg">{{ displayMsg }}</h3>
    <v-flex xs8>
      <Panel title="Create new Case">
        <v-card-text>
          <v-form ref="form">
            <h3 v-if="caseId > 0">{{ caseId }}</h3>
            <v-select
              v-model="poc"
              :items="particulars"
              :counter="40"
              item-text="name"
              item-value="val"
              label="Select type of collision"
              required
              :rules="required"
            ></v-select>
            <v-text-field
              v-if="isUser"
              v-model="claimantCoy"
              :counter="40"
              label="Insured Party"
              required
            ></v-text-field>
            <v-select
              v-if="admin"
              item-text="name"
              item-value="val"
              v-model="selArbiter"
              :items="arbitors"
              :counter="40"
              label="Allocate Arbitrator"
              required
              :rules="required"
            ></v-select>
            <v-text-field
              v-if="admin"
              v-model="arbitAlloc.comments"
              :counter="40"
              label="Message to Arbitor"
            ></v-text-field>
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="dialog = true"
              v-if="isNew"
            >
              Create
            </v-btn>
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="viewCase()"
              v-if="arbitUser.UserRoleId === 3"
            >
              View Case
            </v-btn>

            <!--
          <v-btn
            :disabled="isNew"
            color="success"
            class="mr-4"
            @click="updateCase"
            v-if="!isNew"
          >
            Update Case
          </v-btn>-->
            <v-btn
              color="error"
              class="mr-4"
              @click="allocateArbitor"
              v-if="admin"
            >
              Allocate
            </v-btn>
            <v-btn color="error" class="mr-4" @click="reset">
              Exit
            </v-btn>
            <YesNoDiag :dialog="dialog" @descision="delegateCheck"></YesNoDiag>
            <Delegate
              :dialog="delegate"
              :heading="heading"
              :btn1Txt="btn1Txt"
              :btn2Txt="btn2Txt"
              :msg="msg"
              @descision="teesAndCees"
            ></Delegate>
          </v-form>
        </v-card-text>
      </Panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Panel from "@/components/Panel";
import userRoles from "../status-enums/roletypes";
import poc from "@/status-enums/poc";
import YesNoDiag from "@/components/TcsDiag.vue";
import Delegate from "@/components/YesNoDiag.vue";
export default {
  components: {
    Panel,
    YesNoDiag,
    Delegate
  },
  data: () => ({
    valid: true,
    required: [v => !!v || "This field is required"],
    nameRules: [
      v => !!v || "Particulars of action is required",
      v =>
        (v && v.length <= 40) ||
        "Particulars of action must be less than 40 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    selectClaimCoy: null,
    insCoys: [],
    isNew: false,
    caseId: 0,
    admin: false,
    isUser: true,
    arbitors: [],
    displayMsg: null,
    arbitCase: {
      id: 0,
      ArbitUserId: 0,
      PocId: 0,
      ClaimantId: 0,
      StatusId: 0,
      DefendantId: 0,
      createdBy: 0,
      updatedBy: 0
    },
    arbitAlloc: {
      comments: "",
      ArbitUserId: 0,
      ArbitCaseId: 0,
      StatusId: 0
    },
    adminCase: null,
    selArbiter: "",
    claimantCoy: "",
    currentCase: {},
    particulars: [],
    poc: "",
    formFieldsChanged: false,
    arbitUser: {},
    heading: "Terms and Conditions",
    dialog: false,
    delegate: false,
    msg:
      "The user hereby warrants that she/he has the necessary authority to enter into and perform the obligations under this Dispute Resolution Agreement and all activities contemplated herein, and all corporate and other actions required to authorise her/him to enter into and perform this Dispute Resolution Agreement were properly taken.",
    btn1Txt: "No",
    btn2Txt: "Yes"
  }),
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        this.snackbar = true;
      }
    },
    async createCase() {
      try {
        //console.log('creating case ' + JSON.stringify(this.arbitCase));
        await this.$store.dispatch("createCase", this.arbitCase);
      } catch (err) {
        console.log("error creating case " + err);
      }
    },
    checkForChanges() {
      if (this.currentCase.PocId != this.arbitCase.PocId) {
        this.formFieldsChanged = true;
      }
    },
    async viewCase() {
      var claimant = this.$store.getters.getClaimant;
      var Case = this.$store.getters.getCase;
      await this.$store.dispatch("findJurisdictions");

      await this.findDefendants();
      await this.$store.dispatch("initClaimObjs", {
        Case: Case,
        Claimant: claimant
      });
      var path = "resolve-claim";
      this.$router.push({
        name: `${path}`
      });
    },
    async findDefendants() {
      var url = `defendants/coy/${this.$store.getters.getCase.id}`;
      try {
        await this.$store.dispatch("findDefendants", url);
      } catch (err) {
        console.log("Problem finding defendants createArbitCase " + err);
      }
    },
    async submit(actions) {
      if (this.$refs.form.validate()) {
        await this.$store.dispatch("findJurisdictions");
        if (!this.$store.getters.getCase) {
          await this.$store.dispatch("initCase", this.arbitCase);
          await this.$store.dispatch("doNewCase", true);
          await this.initAction();
          this.$router.push("/claim/create");
        } else {
          //var url = `claimdefs/caseid/${this.arbitCase.id}`;
          await this.$store.dispatch("doParticipantAction", actions);
          await this.$store.dispatch("initCaseId", this.arbitCase.id);
          this.$router.push("/claim/create");
          /*
            this.$router.push({
              name: "claimdefend"
            });*/
        }
      }
    },
    async initAction() {
      await this.$store.dispatch("findPoc", this.arbitCase.PocId);
      await this.$store.dispatch(
        "findDefendants",
        `defendants/case/${this.arbitCase.id}`
      );
      await this.$store.dispatch("getAllCoys");

      await this.$store.dispatch("doCoDefendants", []);

      await this.$store.dispatch("doLoci", null);
      await this.$store.dispatch("doCoa", null);
      await this.$store.dispatch("doMerit", null);

      await this.$store.dispatch("doQuanta", null);
      await this.$store.dispatch("doReliefSought", null);
      await this.$store.dispatch("doProcessCounterClaim", false);
      //Files
      var emptyArr = [];
      await this.$store.dispatch("doLociFiles", emptyArr);
      await this.$store.dispatch("doMeritFiles", emptyArr);
      await this.$store.dispatch("doCoaFiles", emptyArr);
      await this.$store.dispatch("doQuantaFiles", emptyArr);
      await this.$store.dispatch("doReliefSoughtFiles", emptyArr);

      //valid flags
      await this.$store.dispatch("doLociStandiValid", false);
      await this.$store.dispatch("doMeritValid", false);
      await this.$store.dispatch("doCoaValid", false);
      await this.$store.dispatch("doQuantaValid", false);
      await this.$store.dispatch("doReliefSoughtValid", false);
      await this.$store.dispatch("doCaseValid", false);
    },
    async viewEdit() {
      var Case = await this.$store.getters.getCase;
      this.arbitCase = Case;
      this.currentCase.PocId = Case.PocId;

      this.setClaimantCoy(this.$store.getters.getArbitUser.CompanyId);

      for (var i = 0; i < this.particulars.length; i++) {
        if (this.particulars[i].val === this.arbitCase.PocId) {
          this.poc = this.particulars[i].val;
        }
      }
    },
    populateCoyDDs() {
      this.$store.getters.getInsCoys.forEach(coy => {
        this.insCoys.push({ name: coy.name, val: coy.id });
      });
    },
    async populateArbitorDDs() {
      await this.$store.getters.getUsers.forEach(arbitor => {
        var arbit = arbitor.firstname + " " + arbitor.lastname;
        this.arbitors.push({ name: arbit, val: arbitor.id });
      });
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
    setClaimantCoy(coyId) {
      for (var i = 0; i < this.insCoys.length; i++) {
        if (this.insCoys[i].val === coyId) {
          this.claimantCoy = this.insCoys[i].name;
        }
      }
    },
    reset() {
      //this.$refs.form.reset()
      if (this.isNew) {
        this.$router.push("/cases");
      } else {
        if (this.arbitUser.UserRoleId === userRoles.ADMIN) {
          this.$router.push("/adminview");
        } else {
          this.$router.push({
            name: "case-view",
            params: {
              caseId: this.caseId
            }
          });
        }
      }
    },
    async createDemoCase(CaseId) {
      var demoCase = await this.$store.dispatch(
        "findDemoCase",
        `democase/${CaseId}`
      );
      this.arbitCase.StatusId = 1;
      demoCase.Claimant.StatusId = 1;

      await this.$store.dispatch("updateCase", this.arbitCase);
      await this.$store.dispatch("updateClaimant", demoCase.Claimant);

      await this.$store.dispatch("initCase", demoCase);
      await this.$store.dispatch("doClaimant", demoCase.Claimant);
      //console.log("Case " + JSON.stringify(this.$store.getters.getCase));
      await this.findDefendants();
      var defendants = this.$store.getters.getDefendants;

      if (defendants.length > 1) {
        demoCase.PocId = 3;
        await this.$store.dispatch("initCase", demoCase);
      } else {
        await this.$store.dispatch("doDefendant", defendants[0]);
      }
      await this.$store.dispatch("initClaimObjs", {
        Case: demoCase,
        Claimant: demoCase.Claimant
      });
    },
    async allocateArbitor() {
      await this.$store.dispatch("createArbitAlloc", this.arbitAlloc);
      this.$router.push("/adminview");
    },
    resetValidation() {
      this.$refs.form.resetValidation();
    },
    async updateCase() {
      try {
        await this.$store.dispatch("updateCase", this.arbitCase);
        await this.$store.dispatch("findCaseByPk", this.arbitCase.Id);
        this.displayMsg = "Case updated successfully";
      } catch (err) {
        console.log("Case not updated " + err);
      }
    },
    delegateCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        this.delegate = true;
        this.heading = "Delegation of Authority";
      }
    },
    teesAndCees(yesNo) {
      this.delegate = false;
      if (yesNo) {
        this.submit("insured");
      }
    }
  },
  async created() {
    await this.$store.dispatch("findPocs");
    await this.populateCoyDDs();
    await this.populatePocs();

    this.arbitUser = await this.$store.getters.getArbitUser;
    this.arbitCase.ArbitUserId = this.arbitUser.id;
    this.isUser =
      this.arbitUser.role.id === userRoles.PARTICIPANT ? true : false;
    this.admin = this.arbitUser.role.id === userRoles.ADMIN ? true : false;
    if (this.admin) {
      this.arbitAlloc.ArbitCaseId = await this.$route.params.caseId;
      await this.populateArbitorDDs();
      this.adminCase = await this.$store.getters.getCase;
      this.arbitAlloc.StatusId = await this.$store.getters.getCase.StatusId;

      for (var i = 0; i < this.particulars.length; i++) {
        if (this.particulars[i].val === this.adminCase.PocId) {
          this.poc = this.particulars[i].val;
        }
      }

      //this.$store.dispatch('initCase', this.adminCase.ArbitCase);
    }

    var id = this.$route.params.caseId;
    if (id) {
      this.caseId = id;
      await this.$store.dispatch("initCaseId", id);
    }
    try {
      this.isNew = this.$route.params.isNew == 1 ? true : false;
      if (this.isNew) {
        this.admin = false;
        this.arbitCase.CompanyId = this.arbitUser.CompanyId;
        await this.setClaimantCoy(this.arbitUser.CompanyId);
      } else {
        await this.viewEdit(this.$route.params.caseId);
      }
      this.arbitCase.createdBy = this.arbitUser.id;
      this.arbitCase.updatedBy = this.arbitUser.id;
    } catch (error) {
      console.log(error);
    }
  },
  async beforeDestroy() {
    var arbitCase = this.$store.getters.getCase;

    if (!arbitCase) {
      try {
        await this.$store.dispatch("doDefendantValid", true);
        await this.$store.dispatch("doNewCase", true);
      } catch (err) {
        console.log("Error initiating arbit case " + err);
      }
    } else {
      if (arbitCase.id > 0) {
        await this.checkForChanges();
        try {
          if (this.formFieldsChanged) {
            await this.$store.dispatch("doDefendantValid", true);
            await this.$store.dispatch("doCaseUpdated", true);

            await this.$store.dispatch("initCaseId", arbitCase.id);
            await this.$store.dispatch("initCase", this.arbitCase);
          }
        } catch (err) {
          console.log("Error updating arbit case " + err);
        }
      }
    }
  },
  watch: {
    poc: function() {
      this.arbitCase.PocId = this.poc;
    },
    selArbiter: function() {
      this.arbitAlloc.ArbitUserId = this.selArbiter;
      //console.log('this.arbitCase.particularsOfClaim ' + JSON.stringify(this.arbitCase.particularsOfClaim));
    }
  }
};
</script>
