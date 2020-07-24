<template>
  <div>
    <Kause :readOnly="readOnly"></Kause>
    <FileUpload @upload-file="updateFileUpload">
      <h3 slot="fileUpload">Supporting documents.</h3>
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
