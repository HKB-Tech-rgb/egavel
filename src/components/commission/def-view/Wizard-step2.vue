<template>
  <div style="background-color:white">
    <LociStandi :readOnly="readOnly"></LociStandi>
    <FileUpload :isVisible="isVisible" @upload-file="updateFileUpload">
      <div slot="fileUpload" style="font-size:20px;font-weight:bold">
        Upload Supporting Documents.
      </div>
    </FileUpload>
  </div>
</template>
<script>
import LociStandi from "@/components/LociStandiDef.vue";
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload,
    LociStandi
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
      await this.$store.dispatch("doLociStandiDefFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    //console.log('getLociFiles '+ JSON.stringify(this.$store.getters.getLociFiles));
    if (this.$store.getters.getLociStandiDefFiles) {
      var files = await this.$store.getters.getLociStandiDefFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
