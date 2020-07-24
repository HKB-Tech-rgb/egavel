<template>
  <div style="background-color:white">
    <ReliefSought :readOnly="readOnly" />
    <FileUpload @upload-file="updateFileUpload" :isVisible="isVisible">
      <h3 slot="fileUpload">Relief Sought documents.</h3>
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
      readOnly: true,
      isVisible: false
    };
  },
  methods: {
    async updateFileUpload() {}
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
