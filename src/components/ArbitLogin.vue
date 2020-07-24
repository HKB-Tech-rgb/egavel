<template>
  <v-app id="inspire">
    <v-card width="400" class="mt-1">
      <v-card-title class="pb-0">
        <h1>User Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form class="mt-1">
          <v-text-field
            class="pt-4"
            v-model="creds.email"
            label="Username"
            prepend-icon="mdi-account-circle"
          />
          <v-text-field
            v-model="creds.pword"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
          />
        </v-form>
        <v-alert
          :value="validationerror"
          color="error"
          v-html="error"
        ></v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <router-link to="/changepass" style="color:blue; font-size: 10px"
          >forgot password?</router-link
        >
        <v-spacer />
        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>
<script>
//import ArbitAuthService from '@/services/ArbitAuthService';
import userStatus from "@/status-enums/caseStatus";
import userRoles from "@/status-enums/roletypes";
export default {
  data() {
    return {
      creds: {
        email: "",
        pword: ""
      },
      insCoy: "",
      error: null,
      validationerror: false,
      showPassword: false
    };
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("loginUser", this.creds);

        this.validationerror = false;
        var arbitUser = this.$store.getters.getArbitUser;
        await arbitUser.UserRoles.sort((a, b) => (b.id > a.id ? 1 : -1));
        var role = this.findActiveRole(arbitUser.UserRoles);

        if (role == null) {
          throw " User not Active";
        } else {
          arbitUser.role = role;
          await this.$store.dispatch("initArbitUser", arbitUser);
          await this.$store.dispatch("fixRoleId", role.id);
          await this.$store.dispatch("fixRoleDesc", role.RoleDescription);
          await this.$store.dispatch(
            "fixRoleCount",
            arbitUser.UserRoles.length
          );

          arbitUser = this.$store.getters.getArbitUser;
          sessionStorage.setItem(
            "token",
            JSON.stringify(this.$store.getters.getArbitToken)
          );
          sessionStorage.setItem(
            "user",
            JSON.stringify(this.$store.getters.getArbitUser)
          );
        }
        if (!this.$store.getters.isLoggedOn) {
          throw "Login Error";
        }
        switch (arbitUser.role.id) {
          case userRoles.PARTICIPANT:
            this.$store.dispatch("doViewStatus", 0);
            this.$router.push("/cases");
            break;
          case userRoles.ARBITOR:
            this.$router.push("/comview");
            break;
          case userRoles.ADMIN:
            this.$router.push("/adminview");
            break;
          case userRoles.COYADMIN:
            this.$router.push("/liaballoc");
            break;
          default:
            console.log(
              "A strange user Role..." + arbitUser.role.UserToUserRole.StatusId
            );
        }
      } catch (error) {
        this.error = error;
        this.validationerror = true;
      }
    },
    findActiveRole(roles) {
      var role = null;
      for (var i = 0; i < roles.length; i++) {
        if (roles[i].UserToUserRole.StatusId === userStatus.USER_ACTIVE) {
          role = roles[i];
          break;
        }
      }
      return role;
    }
  },
  async beforeDestroy() {
    if (!(await this.$store.getters.getArbitUser)) {
      await this.$store.dispatch("initArbitUser", { email: this.creds.email });
    }
    //console.log('email '+ await JSON.stringify(this.$store.getters.getArbitUser))
  },
  async created() {
    await this.$store.dispatch("initArbitUser", null);
  }
};
</script>
<style media="screen">
.v-application--wrap {
  background: url("../assets/newg.png");
  padding-top: 0.1rem;
  background-size: 1400px !important;
  background-repeat: no-repeat;
  width: 50%;
  height: 50%;
}
.loginStyler {
  padding-bottom: 0.2rem;
  font-weight: 600;
}
.theme--light.v-application {
  background: none !important;
  color: rgba(0, 0, 0, 0.87);
}

.flex > .v-card {
  opacity: 0.8;
}
.mx-auto:hover {
  background-color: white !important;
}
</style>
