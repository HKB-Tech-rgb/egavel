<template>
  <div style="background-color:white">
    <LociStandi :readOnly="readOnly"></LociStandi>
    <FileUpload @upload-file="updateFileUpload">
      <h3 slot="fileUpload">Supporting documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import LociStandi from "@/components/LociStandi.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    LociStandi
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
      await this.$store.dispatch("doLociFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getLociFiles) {
      var files = this.$store.getters.getLociFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
<style>
div {
  opacity: 0.98;
}
</style>
