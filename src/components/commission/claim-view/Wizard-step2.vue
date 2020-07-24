<template>
  <div style="background-color:white">
    <Kause :readOnly="readOnly" />
    <FileUpload @upload-file="updateFileUpload" :isVisible="isVisible">
      <h3 slot="fileUpload">Cause of Action Documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import Kause from "@/components/Kause.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    Kause
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
      await this.$store.dispatch("doCoaFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    if (this.$store.getters.getCoaFiles) {
      var files = this.$store.getters.getCoaFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
