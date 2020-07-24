<template>
  <v-layout>
    <v-flex xs4,>
      <YesNoDiag
        :dialog="dialog"
        :msg="msg"
        @descision="deleteCheck"
      ></YesNoDiag>
      <Panel title="Maintain Companies" @del-form="delCoy">
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-select
              item-text="name"
              item-value="val"
              v-model="selectCoy"
              :items="insCoys"
              :readonly="readOnly"
              label="Select available companies"
            ></v-select>
            <v-text-field
              v-model="coy.name"
              label="company name"
              :rules="required"
            >
            </v-text-field>
            <v-text-field
              v-model="coy.city"
              label="company city"
              :rules="required"
            >
            </v-text-field>
            <v-text-field
              v-model="coy.address"
              label="company address"
              :rules="required"
            >
            </v-text-field>
            <v-card-actions>
              <v-btn color="indigo" dark @click="create">Create</v-btn>
              <v-btn color="indigo" dark @click="update">Update</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </Panel>
    </v-flex>
  </v-layout>
</template>
<script>
import Panel from "@/components/Panel";
import YesNoDiag from "@/components/YesNoDiag.vue";

export default {
  data() {
    return {
      coy: {
        id: 0,
        name: "",
        city: "",
        address: ""
      },
      insCoys: [],
      selectCoy: "",
      readOnly: false,
      valid: "",
      dialog: false,
      msg: "About to delete Are you sure? ",
      required: [v => !!v || "This field is required"]
    };
  },
  components: {
    Panel,
    YesNoDiag
  },
  methods: {
    async create() {
      try {
        if (this.$refs.form.validate()) {
          try {
            console.log("coy " + JSON.stringify(this.coy));
            this.$store.dispatch("createCoy", this.coy).then(
              () => {
                this.$router.push("/");
              },
              error => {
                console.log("Got Nowt Data " + error);
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (err) {
        console.log("Error while creating new Case " + err);
      }
    },
    async update() {
      try {
        if (this.$refs.form.validate()) {
          try {
            this.$store.dispatch("updateCoy", this.coy).then(
              () => {
                this.$router.push("/");
              },
              error => {
                console.log("Got Nowt Data " + error);
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (err) {
        console.log("Error while creating new Case " + err);
      }
    },
    async delCoy(del) {
      if (del) {
        this.dialog = true;
      }
    },
    async deleteCheck(yesNo) {
      this.dialog = false;
      if (yesNo) {
        var url = `/companies/${this.coy.id}`;
        if (this.coy.id > 0) {
          await this.$store.dispatch("delFile", url);
        }
      }
    }
  },
  watch: {
    selectCoy: function(val) {
      this.insCoys.forEach(coy => {
        if (coy.val == val) {
          this.coy.name = coy.name;
          this.coy.id = coy.val;
          this.coy.city = coy.rec.city;
          this.coy.address = coy.rec.address;
        }
      });
    }
  },
  async created() {
    await this.$store.dispatch("getAllCoys").then(coys => {
      coys.forEach(coy => {
        this.insCoys.push({ name: coy.name, val: coy.id, rec: coy });
      });
    });
  }
};
</script>
<style scoped></style>
