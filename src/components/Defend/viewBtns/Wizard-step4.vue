<template>
  <div style="background-color:white">
    <Quantum :readOnly="readOnly"></Quantum>
    <FileUpload @upload-file="updateFileUpload">
      <h3 slot="fileUpload">Suporting Documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import Quantum from "@/components/Quantum.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    Quantum
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
      await this.$store.dispatch("doQuantaFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getQuantaFiles) {
      var files = this.$store.getters.getQuantaFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
