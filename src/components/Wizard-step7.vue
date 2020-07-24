<template>
  <div style="background-color:white">
    <ReliefSought :readOnly="readOnly"></ReliefSought>
    <FileUpload
      :isVisible="isVisible"
      @upload-file="updateFileUpload"
      @reset-files="resetReliefFiles"
    >
      <div
        slot="fileUpload"
        style="font-size:20px;font-weight:bold;color: black"
      >
        Upload Supporting documents.
        <span style="font-size:12px" v-if="status <= OPENED"
          >(Max file size {{ docSize }})</span
        >
      </div>
    </FileUpload>
  </div>
</template>
<script>
import ReliefSought from "@/components/ReliefSought.vue";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus";
export default {
  components: {
    FileUpload,
    ReliefSought
  },
  data() {
    return {
      uploadFile: [],
      delIncoming: [],
      delStore: [],
      readOnly: false,
      isVisible: true,
      docSize: process.env.VUE_APP_DOC_SIZE,
      status: 0,
      OPENED: caseStatus.OPENED
    };
  },
  methods: {
    async updateFileUpload(e) {
      if (e.delFile) {
        var url = `relieffiles/${JSON.stringify(e.id)}`;
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
            console.log("loci file not deleted " + err);
          });
      }
      var varRelief = {};
      varRelief.upLoadMessage = e.message;
      varRelief.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varRelief.filesUploaded.push(file);
          });
          this.delIncoming = [];
          this.delStore = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varRelief.filesUploaded,
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
                      ReliefSoughtId: arr[i].ReliefSoughtId
                    };
                    try {
                      this.delIncoming.push(file);
                      var fileObj = {
                        url: `relieffiles/${file.id}`,
                        file: file
                      };
                      await this.$store.dispatch("updateFile", fileObj);
                    } catch (err) {
                      console.log("Relief sought file not updated " + err);
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
            varRelief.filesUploaded = varRelief.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varRelief.arbitCaseId = this.$store.getters.getCase.id;
        varRelief.claimantId = this.$store.getters.getClaimantId;
        varRelief.defendantId = this.$store.getters.getDefendantId;
        varRelief.reliefId = this.$store.getters.getReliefSoughtId;

        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varRelief.filesUploaded
        );
        var allFiles = await this.loadReliefFiles(e.filesUploaded, varRelief);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Relief sought wiz6 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadReliefFiles(fileArr, varRelief) {
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
          ReliefSoughtId: varRelief.reliefId
        });
      });
      return retArr;
    },
    async resetReliefFiles(e) {
      await this.$store.dispatch("doReliefSoughtFiles", []);
      var fileArr = [];
      await e.forEach(file => {
        fileArr.push(file);
      });
      await this.$store.dispatch("doReliefSoughtFiles", fileArr);
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doReliefSoughtFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    var claimCase = this.$store.getters.getCase;
    var claim = this.$store.getters.getClaimant;
    var user = this.$store.getters.getArbitUser;
    console.log("claimCase " + claimCase);
    console.log("user " + user);
    if (claimCase && user) {
      if (claimCase.ArbitUserId === user.id) {
        this.readOnly = await false;
        this.isVisible = await true;
      } else {
        this.readOnly = await true;
        this.isVisible = await false;
      }
      if (claim.StatusId > caseStatus.OPENED) {
        this.readOnly = await true;
        this.isVisible = await false;
      }
      this.status = claim.StatusId;
    }
    if (this.$store.getters.getReliefSoughtFiles) {
      var files = this.$store.getters.getReliefSoughtFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
