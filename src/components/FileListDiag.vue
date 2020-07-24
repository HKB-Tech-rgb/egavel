<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="450">
      <v-card>
        <div
          v-for="(file, index) in fileList"
          v-bind:key="index"
          class="file-listing"
        >
          {{ file.filename }}
          <span class="remove-file" v-on:click="viewFile(file)">View</span>
          <span class="remove-file">|</span>
          <span class="remove-file" v-on:click="downloadFile(file)"
            >Download</span
          >
          <span class="remove-file" v-if="isVisible">|</span>
          <span
            class="remove-file"
            v-on:click="deleteFile(file, index)"
            v-if="isVisible"
            >Delete</span
          >
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean
    },
    heading: {
      type: String
    },
    msg: {
      type: String
    },
    btn1Txt: {
      type: String
    },
    btn2Txt: {
      type: String
    }
  },
  methods: {
    returnDecision(yesNo) {
      this.$emit("descision", yesNo);
    }
  }
};
</script>
