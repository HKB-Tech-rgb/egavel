<template>
  <v-row>
    <v-col cols="10">
      <v-text-field
        v-model="message"
        :append-icon="show ? 'mdi-magnify' : 'mdi-magnify'"
        dense
        outlined
        label="Search Case"
        type="text"
        @click:append="goSearch"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    password: "Password",
    show: true,
    message: "",
    marker: true
  }),
  methods: {
    goSearch() {
      alert("off to search");
      this.clearMessage();
    },
    clearMessage() {
      this.message = "";
    }
  }
};
</script>
