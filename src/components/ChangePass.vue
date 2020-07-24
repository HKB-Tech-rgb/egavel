<template>
  <v-layout>
    <v-flex xs4,>
      <Panel title="Change User Password">
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <!--
                        <v-select                           
                            v-model="selected"
                            :items="items"
                            label="Select user email address"
                            :rules="emailRules"
                            prepend-icon="mdi-account-circle"
                        ></v-select>-->
            <v-text-field
              v-model="pass"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
            />
            <v-card-actions>
              <v-btn color="indigo" dark @click="update">Update</v-btn>
              <v-btn color="indigo" dark @click="reset">Reset</v-btn>
              <v-btn color="indigo" dark @click="quit">exit</v-btn>
            </v-card-actions>
          </v-form>
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
      arbitUser: {
        id: 0,
        firstname: "",
        lastname: "",
        email: "",
        pword: "",
        CompanyId: "",
        UserRoleId: 0,
        initialLogin: 1,
        cellnumber: "",
        StatusId: 0
      },
      items: [],
      selected: "",
      pass: "",
      readOnly: false,
      valid: "",
      required: [v => !!v || "This field is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ],
      showPassword: false
    };
  },
  components: {
    Panel
  },
  methods: {
    async update() {
      if (this.$refs.form.validate()) {
        console.log("all valid! ");
        try {
          await this.$store.dispatch("updateUser", this.arbitUser);
          this.$router.push("/");
        } catch (error) {
          console.log(error);
        }
      }
    },
    setUser(user) {
      this.arbitUser.id = user.id;
      this.arbitUser.firstname = user.firstname;
      this.arbitUser.lastname = user.lastname;
      this.arbitUser.email = user.email;
      this.arbitUser.pword = user.pword;
      this.arbitUser.CompanyId = user.CompanyId;
      this.arbitUser.signFilename = user.signFilename;
      this.arbitUser.initialLogin = user.initialLogin;
      this.arbitUser.cellnumber = user.cellnumber;
      this.arbitUser.signDiskname = user.signDiskname;
    },
    quit() {
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    async loadItems() {
      if (await this.$store.getters.getArbitUser) {
        await this.items.push(this.$store.getters.getArbitUser.email);
      }
    },
    async sendEmail(msg) {
      this.$store.dispatch("sendEmail", msg).then(
        () => {
          this.$router.push({
            name: "case-filed",
            params: {
              mailMsg: "Email successfully sent to Admin"
            }
          });
        },
        () => {
          //console.log('Message not sent '+ error);
        }
      );
    }
  },
  watch: {
    pass: function(val) {
      this.arbitUser.pword = val;
    }
  },
  async mounted() {
    //this.helpMsg.dateSent = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    await this.loadItems();
    var user = {
      url: "userbyemail",
      body: this.$store.getters.getArbitUser
    };
    await this.$store
      .dispatch("findArbitUser", user)
      .then(async user => {
        await this.setUser(user);
      })
      .catch(err => {
        console.log("no such user! - create " + err);
      });
    this.selected = await this.arbitUser.email;
    //await this.loadItems();
    /*
        
        */
    //

    //await this.$store.dispatch('doHelpActive', true);
  },
  async beforeDestroy() {
    await this.$store.dispatch("doHelpActive", false);
  }
};
</script>
<style scoped></style>
