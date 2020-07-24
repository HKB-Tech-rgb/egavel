<template>
  <div class="text-xs-center">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text style="color:black" v-on="on">
          <v-icon dark left>mdi-account-circle</v-icon>Roles</v-btn
        >
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="setRole(item)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.RoleDescription }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
import userRoles from "@/status-enums/roletypes";
export default {
  data: () => ({
    arbitUser: {}
  }),
  props: {
    participantCaseId: null
  },
  methods: {
    async setRole(role) {
      var arbitUser = await this.$store.getters.getArbitUser;
      arbitUser.role = role;
      await this.$store.dispatch("initArbitUser", arbitUser);
      await this.$store.dispatch("fixRoleId", role.id);
      await this.$store.dispatch("fixRoleDesc", role.RoleDescription);

      switch (role.id) {
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
          console.log("A strange user Role..." + role.id);
      }
    }
  },
  computed: {
    items() {
      return this.$store.getters.getArbitUser
        ? this.$store.getters.getArbitUser.UserRoles
        : null;
    }
  }
};
</script>
