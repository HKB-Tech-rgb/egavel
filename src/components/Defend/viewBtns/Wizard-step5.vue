<template>
  <div style="background-color:white">
    <ReliefSought :readOnly="readOnly"></ReliefSought>
    <FileUpload @upload-file="updateFileUpload">
      <h3 slot="fileUpload">Supporting documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import ReliefSought from "@/components/ReliefSought.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    ReliefSought
  },
  data() {
    return {
      readOnly: true
    };
  },
  methods: {
    async updateFileUpload(e) {
      console.log(e);
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doReliefSoughtFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getReliefSoughtFiles) {
      var files = this.$store.getters.getReliefSoughtFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
