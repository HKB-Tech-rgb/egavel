<template>
  <v-app id="kool" class="mt-0 pt-0">
    <v-content>
      <v-container fluid class="inputs-container">
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar light color="wheat">
                <v-toolbar-title>User Registration Form</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    prepend-icon="mdi-account-circle"
                    v-model="arbitUser.firstname"
                    label="First Name"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-account-circle"
                    v-model="arbitUser.lastname"
                    label="LastName"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    prepend-icon="mdi-email"
                    v-model="arbitUser.email"
                    label="Email"
                    type="text"
                  ></v-text-field>
                  <v-text-field
                    v-model="arbitUser.pword"
                    prepend-icon="mdi-lock"
                    name="pword"
                    label="Password"
                    type="password"
                  ></v-text-field>
                  <v-text-field
                    v-model="arbitUser.cellnumber"
                    prepend-icon="mdi-phone"
                    name="cellnumber"
                    label="Mobile number"
                    type="text"
                  ></v-text-field>
                  <v-select
                    prepend-icon="mdi-business-center"
                    item-text="name"
                    item-value="val"
                    v-model="selectUserCoy"
                    :items="insCoys"
                    label="Select User Company"
                    required
                  ></v-select>
                </v-form>
                <v-alert
                  :value="validationerror"
                  color="error"
                  v-html="error"
                ></v-alert>
                <v-alert
                  :value="success"
                  color="success"
                  v-html="msg"
                ></v-alert>
              </v-card-text>
              <div>
                <v-card-actions>
                  <router-link
                    to="/applyroles"
                    style="color:blue; font-size: 10px"
                    >assign roles</router-link
                  >
                  <v-spacer></v-spacer>
                  <v-btn color="indigo" dark @click="register">Register</v-btn>
                </v-card-actions>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      arbitUser: {
        firstname: "",
        lastname: "",
        email: "",
        pword: "",
        CompanyId: "",
        initialLogin: 1,
        cellnumber: ""
      },
      creds: {
        email: "",
        pword: ""
      },
      error: null,
      validationerror: false,
      msg: null,
      insCoys: [],
      userRoles: [],
      selectUserCoy: "",
      selectUserRole: "",
      success: false,
      link: process.env.VUE_APP_URL
    };
  },
  methods: {
    async register() {
      try {
        if (this.arbitUser.email.trim().length < 1) {
          throw "User email required for registration!";
        }
        if (this.$store.getters.getDndRoles.length < 1) {
          throw "The User requires at least 1 role";
        }
        await this.$store.dispatch("registerUser", this.arbitUser);
        this.success = true;
        this.msg = "Registration successfull";
        this.validationerror = false;
        this.$store.dispatch("initUser", null);
        this.$store.dispatch("fixDndRoles", []);
        /*
        const msg = {
          to: this.arbitUser.email,
          from: "lynton@zarbiter.co.za",
          subject: `Welcome to our Arbitation platform ${this.arbitUser.firstname} ${this.arbitUser.lastname}`,
          text: `click on this link to login to the platform - Username: ${this.arbitUser.email}; Password: ${this.arbitUser.pword} ---${this.link}`
        };

        await this.sendEmail(msg);*/
      } catch (error) {
        this.error = error;
        this.validationerror = true;
      }
    },
    async sendEmail(msg) {
      this.$store.dispatch("sendEmail", msg).then(
        () => {
          //createPdf();
          this.$router.push({
            name: "home-params",
            params: {
              msg: "New User notified by email"
            }
          });
        },
        error => {
          console.log("Message not sent " + error);
          this.$router.push({
            name: "home-params",
            params: {
              msg: "Email not sent - Contact the administrator"
            }
          });
        }
      );
    },
    async login() {
      try {
        this.creds.email = this.arbitUser.email;
        this.creds.pword = this.arbitUser.pword;

        await this.$store.dispatch("loginUser", this.creds);

        this.validationerror = false;

        this.$router.push("/start");
      } catch (error) {
        this.error = error.response.data.error;
        this.validationerror = true;
      }
    },
    setUser(user) {
      this.arbitUser.id = user.id;
      this.arbitUser.firstname = user.firstname;
      this.arbitUser.lastname = user.lastname;
      this.arbitUser.email = user.email;
      this.arbitUser.pword = user.pword;
      this.arbitUser.CompanyId = user.CompanyId;
      this.arbitUser.initialLogin = user.initialLogin;
      this.arbitUser.cellnumber = user.cellnumber;
    },
    async populateCoyDDs() {
      this.$store.getters.getInsCoys.forEach(coy => {
        this.insCoys.push({ name: coy.name, val: coy.id });
      });
    },
    async populateRoleDDs() {
      this.$store.getters.getUserRoles.forEach(role => {
        this.userRoles.push({ name: role.RoleDescription, val: role.id });
      });
    },
    setUserCoy() {
      for (var i = 0; i < this.insCoys.length; i++) {
        if (this.insCoys[i].val == this.arbitUser.CompanyId) {
          this.selectUserCoy = this.insCoys[i].val;
        }
      }
    }
  },
  async beforeDestroy() {
    if (this.arbitUser.email.trim().length > 0) {
      console.log("user saved");
      await this.$store.dispatch("initUser", this.arbitUser);
      this.$store.dispatch("fixDndRoles", []);
    }
  },
  async created() {
    await this.$store.dispatch("getAllCoys"); // for drop downs
    await this.populateCoyDDs();
    await this.$store.dispatch("getAllRoles");
    await this.populateRoleDDs();

    var user = await this.$store.getters.getUser;
    this.setUser(user);
  },
  watch: {
    selectUserCoy: function() {
      this.arbitUser.CompanyId = this.selectUserCoy;
    },
    selectUserRole: function() {
      this.arbitUser.UserRoleId = this.selectUserRole;
    }
  }
};
</script>
<style lang="scss">
.inputs-container {
  .col-12 {
    padding-top: 0;
    padding-bottom: 0;
  }
  .theme--light.v-input {
    padding-top: 0;
  }
  .v-input__slot {
    margin-bottom: 0;
  }
}
</style>
