<template>
  <div class="white elecation-4">
    <v-toolbar flat dense class="white" style="height: 20px">
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip left v-if="multi && isVisible">
        <template v-slot:activator="{ on }">
          <v-btn text icon @click="removeFormData" dark v-on="on">
            <v-icon class="primary--text">mdi-delete</v-icon>
          </v-btn>
        </template>
        <span>Remove/delete form data</span>
      </v-tooltip>
    </v-toolbar>
    <div class="pl-4 pr-4 pt-2 pb-2">
      <slot>
        No slot content defined
      </slot>
    </div>
  </div>
</template>
<script>
import userRole from "@/status-enums/roletypes";
export default {
  props: {
    title: {
      type: String
    },
    multiProp: {
      type: Boolean
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      multi: false
    };
  },
  methods: {
    removeFormData() {
      var deleteForm = true;
      this.$emit("del-form", deleteForm);
    }
  },
  async created() {
    var Case = await this.$store.getters.getCase;
    if (Case) {
      if (this.$store.getters.getPocs) {
        this.$store.getters.getPocs.forEach(poc => {
          if (poc.id === Case.PocId) {
            if (poc.Description == "Multiple vehicle collision") {
              this.multi = true;
            }
          }
        });
      }
      if (this.multiProp) {
        this.multi = true;
      } else {
        this.multi = false;
      }
    }
    if (this.$store.getters.getArbitUser.role.id > userRole.PARTICIPANT) {
      this.multi = false;
    }
  }
};
</script>
<style scoped></style>
