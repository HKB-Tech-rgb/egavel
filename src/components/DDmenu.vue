<template>
  <div class="text-xs-center">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text style="color:black" v-on="on">
          <v-icon left>mdi-account-circle</v-icon>
          Admin
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="navigateTo(index)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <br />
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  data: () => ({
    items: [
      { title: "Create new User" },
      { title: "Reset case status" },
      { title: "Allocate Commissioners" },
      { title: "Maintain User Roles" },
      { title: "Maintain Companies" }
    ]
  }),
  methods: {
    navigateTo(selection) {
      switch (selection) {
        case 0:
          this.$router.push("/arbitSignup");
          break;
        case 1:
          this.$router.push("/");
          break;
        case 2:
          this.$router.push("/cases");
          break;
        case 3:
          this.$router.push("/roles");
          break;
        case 4:
          this.$router.push("/coys");
          break;
        default:
          console.log("kuk has happened in DDMenu");
      }
    }
  }
};
</script>
