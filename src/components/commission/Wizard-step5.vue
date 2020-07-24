<template>
  <div style="background-color:white">
    <Resolution :readOnly="readOnly"></Resolution>
    <FileUpload :isVisible="isVisible" @upload-file="updateFileUpload">
      <div slot="fileUpload" style="font-size:20px;font-weight:bold">
        Upload Supporting documents.
        <span style="font-size:12px">(Max file size {{ docSize }})</span>
      </div>
    </FileUpload>
  </div>
</template>
<script>
import Resolution from "@/components/Resolution.vue";
import FileUpload from "@/components/FileUpload.vue";
import userRoles from "@/status-enums/roletypes";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    FileUpload,
    Resolution
  },
  data() {
    return {
      uploadFile: [],
      delStore: [],
      delIncoming: [],
      readOnly: false,
      isVisible: true,
      docSize: process.env.VUE_APP_DOC_SIZE,
      status: 0,
      OPENED: caseStatus.RESOLVED
    };
  },
  methods: {
    async updateFileUpload(e) {
      if (e.delFile) {
        var url = `resolvefiles/${JSON.stringify(e.id)}`;
        this.$store
          .dispatch("delFile", url)
          .then(msg => {
            var fileArr = [];
            console.log("files deleted " + msg);
            this.$store.getters.getCurrentUploadedFiles.forEach(obj => {
              fileArr.push(obj);
            });

            fileArr = fileArr.filter(item => item.filename != e.file.filename);
            this.$store.dispatch("doCurrentUploadedFiles", fileArr);
          })
          .catch(err => {
            console.log("Resolution file not deleted " + err);
          });
      }
      var varResolution = {};
      varResolution.filesUploaded = [];
      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varResolution.filesUploaded.push(file);
          });
          this.delIncoming = [];
          this.delStore = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varResolution.filesUploaded,
            async (arr, filename, diskname) => {
              for (var i = 0; i < arr.length; i++) {
                if (arr[i].filename === filename) {
                  if (!arr[i].id) {
                    this.delStore.push(arr[i]);
                    console.log("no id");
                  } else {
                    var file = {
                      id: arr[i].id,
                      filename: arr[i].filename,
                      diskname: diskname,
                      createdAt: arr[i].createdAt,
                      ResolutionId: arr[i].ResolutionId
                    };
                    try {
                      this.delIncoming.push(file);
                      var fileObj = {
                        url: `resolvefiles/${file.id}`,
                        file: file
                      };
                      await this.$store.dispatch("updateFile", fileObj);
                    } catch (err) {
                      console.log("Resolution file not updated " + err);
                    }
                  }
                  break;
                }
              }
            }
          );
          this.delIncoming.forEach(file => {
            e.filesUploaded = e.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
          this.delStore.forEach(file => {
            varResolution.filesUploaded = varResolution.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        //varResolution.ResolutionId = this.$store.getters.getResolutionId;
        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varResolution.filesUploaded
        );
        var allFiles = await this.loadResolutionFiles(e.filesUploaded);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Resolution files wiz5 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadResolutionFiles(fileArr) {
      var retArr = [];
      if (this.$store.getters.getCurrentUploadedFiles != null) {
        this.$store.getters.getCurrentUploadedFiles.forEach(file => {
          retArr.push(file);
        });
      }
      fileArr.forEach(file => {
        retArr.push({
          filename: file.filename,
          diskname: file.diskname,
          ResolutionId: this.$store.getters.getResolutionId
        });
      });
      return retArr;
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doResolutionFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    var user = this.$store.getters.getArbitUser;
    var Case = this.$store.getters.getCase;
    if (!Case.StatusId) {
      //this is a hack as the case from the 3rd party exit has no statusId
      await this.$store.dispatch("findCase", Case.id).then(resp => {
        Case = resp;
      });
    }
    if (user.role.id === userRoles.ARBITOR) {
      this.isVisible = true;
      this.readOnly = false;
    } else {
      this.isVisible = false;
      this.readOnly = true;
    }
    if (caseStatus.RESOLVED === Case.StatusId) {
      this.isVisible = false;
      this.readOnly = true;
    }
    if (this.$store.getters.getResolutionFiles) {
      var files = this.$store.getters.getResolutionFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
    this.status = Case.StatusId;
  }
};
</script>
