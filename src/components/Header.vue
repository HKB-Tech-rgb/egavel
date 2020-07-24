<template>
  <v-app-bar dense fixed>
    <v-toolbar-title
      class="mr-4"
      dark
      @click="navigateTo()"
      style="font-size: 16px"
    >
      <v-btn icon @click="navigateTo">
        <v-icon class="primary--text">mdi-home</v-icon>
      </v-btn>
    </v-toolbar-title>
    <v-toolbar-title class="mr-4" dark style="font-size: 12px">
      {{ version }}
    </v-toolbar-title>
    <v-spacer v-if="!arbiter || userRoleId < 4"></v-spacer>
    <v-toolbar-title
      class="mr-4"
      style="font-size: 12px"
      v-if="arbitUser && userRoles > 1 && userRoleId > 1"
    >
      <DDUserRoles></DDUserRoles>
    </v-toolbar-title>
    <v-toolbar-title class="mr-4" style="font-size: 12px">
      <DDMenu v-if="arbitUser && userRoleId === 4"></DDMenu>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-spacer v-if="arbitUser && UserRoleId === 1"></v-spacer>
    <v-layout row>
      <v-flex xs12 md10 lg12>
        <img src="@/assets/egavel.png" height="40px" v-if="!arbitUser" />
        <v-card style="background-color:rgb(212,210,215)" flat v-if="arbitUser">
          <span style="color:black"
            >User Name:
            <span style="color: black" class="font-italic">
              {{ arbitUser.firstname }} {{ arbitUser.lastname }}
              <span style="color:black" v-if="userRoleId < 3">
                <span class="fontStyle"
                  >Company:
                  <span style="color: black" class="font-italic">
                    {{ userCoy }}</span
                  >
                  <span
                    style="color: black"
                    class="font-italic"
                    v-if="userRoleId === 2"
                  >
                    {{ userRoleDesc }}</span
                  >
                </span>
              </span>
            </span>
          </span>
          <span style="color:black" v-if="userRoleId === 3 || userRoleId === 4">
            <span>
              Role:<span style="color:black" class="font-italic">
                {{ userRoleDesc }}</span
              >
            </span>
          </span>
          &nbsp;&nbsp;&nbsp;
          <span style="color:black" v-if="arbitCase && arbitCase.id > 0"
            >Reference#:<span style="color:black" class="font-italic">{{
              arbitCase.id
            }}</span>
          </span>
        </v-card>
      </v-flex>
    </v-layout>
    <v-spacer></v-spacer>
    <v-spacer v-if="arbitUser && UserRoleId === 1"></v-spacer>
    <v-layout row wrap justify-center>
      <v-flex lg3 md3>
        <v-tooltip right v-if="arbitUser">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" small v-on="on" @click="goSearch()">
              <v-icon color="indigo">
                mdi-magnify
              </v-icon>
            </v-btn>
          </template>
          <span>click to search</span>
        </v-tooltip>
      </v-flex>
      <v-flex lg3 md3>
        <span>
          <Notifications v-if="arbitUser" />
        </span>
      </v-flex>
      <v-flex lg3 md3>
        <v-toolbar-title
          class="mr-4"
          dark
          @click="logout"
          style="font-size: 16px"
          >{{ loginHead }}
        </v-toolbar-title>
      </v-flex>
      <v-flex lg3 md3>
        <v-toolbar-title
          class="mr-4"
          dense
          dark
          @click="help('/help')"
          style="font-size: 16px"
          v-if="!helpActive"
          >help
        </v-toolbar-title>
      </v-flex>
    </v-layout>
    <!--<DDUserMenu></DDUserMenu>-->
  </v-app-bar>
</template>
<script>
//import FooMenu from '@/components/FooMenu.vue';
import DDMenu from "@/components/DDmenu.vue";
import userRoles from "@/status-enums/roletypes";
import DDUserRoles from "@/components/DDUserRoles";
import Notifications from "@/components/Notifications";
//import SearchCase from "@/components/SearchCase";
export default {
  components: {
    DDMenu,
    DDUserRoles,
    Notifications

    //FooMenu
  },
  methods: {
    navigateTo() {
      var arbitUser = this.$store.getters.getArbitUser;
      switch (arbitUser.role.id) {
        case userRoles.PARTICIPANT:
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
          "";
      }
    },
    async logout() {
      await sessionStorage.removeItem("user");
      await this.$store.dispatch("initArbitUser", null);
      await this.$store.dispatch("initCase", null);
      this.$router.push("/");
    },
    help(route) {
      this.$router.push(route);
    },
    async goSearch() {
      this.$router.push({
        name: "search"
      });
    }
  },
  data: function() {
    return {
      config: {
        options: [
          {
            value: "option 1"
          },
          {
            value: "option 2"
          },
          {
            value: "option 3"
          }
        ],
        prefix: "Kool",
        backgroundColor: "green"
      },
      coyHead: "",
      version: `${process.env.VUE_APP_VERSION}`,
      selected: "",
      messageList: ["Ref # 1", "Ref # 2"],
      searchString: ""
    };
  },
  computed: {
    arbitUser() {
      return this.$store.getters.getArbitUser;
    },
    userRoleId() {
      return this.$store.getters.getRoleId;
    },
    userRoleDesc() {
      return this.$store.getters.getRoleDesc;
    },
    userCoy() {
      var user = this.$store.getters.getArbitUser;
      if (user && user.Company) {
        return user.Company.name;
      } else {
        return null;
      }
    },
    userRoles() {
      return this.$store.getters.getRoleCount;
    },
    arbitCase() {
      return this.$store.getters.getCase;
    },
    helpActive() {
      return this.$store.getters.isHelpActive;
    },
    loginHead() {
      if (this.$store.getters.getArbitUser) {
        return "logout";
      } else {
        return "login";
      }
    }
  },
  async created() {
    this.selected = 1;
  }
};
</script>
<style scoped>
.mr-4 {
  cursor: pointer;
}
.mr-4:hover {
  color: black;
}
.v-toolbar.v-toolbar--absolute {
  height: auto !important;
}
.fontStyle {
  font-style: normal;
}
.dropdown {
  max-width: 800px;
}
</style>
