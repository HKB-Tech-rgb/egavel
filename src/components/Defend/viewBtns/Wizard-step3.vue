<template>
  <div style="background-color:white">
    <Merits :readOnly="readOnly"></Merits>
    <FileUpload @upload-file="updateFileUpload">
      <h3 slot="fileUpload">Supporting documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
import Merits from "@/components/Merits.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    Merits
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
