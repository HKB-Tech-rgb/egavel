<template>
  <div style="background-color:white">
    <Settle />
    <FileUpload>
      <h3 slot="fileUpload">Upload Settlement Documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import Settle from "@/components/Settle.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    Settle
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
      await this.$store.dispatch("doSettleFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getSettleFiles) {
      var files = this.$store.getters.getSettleFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
