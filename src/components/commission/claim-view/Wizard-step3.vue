<template>
  <div style="background-color:white">
    <Merits :readOnly="readOnly" />
    <FileUpload @upload-file="updateFileUpload" :isVisible="isVisible">
      <h3 slot="fileUpload">Upload Merits of action Documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import Merits from "@/components/Merits";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    Merits
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
      await this.$store.dispatch("doMeritFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getMeritFiles) {
      var files = this.$store.getters.getMeritFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
