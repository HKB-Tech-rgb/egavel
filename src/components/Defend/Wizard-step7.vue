<template>
  <div style="background-color:white">
    <Settle :readOnly="readOnly"></Settle>
    <FileUpload :isVisible="isVisible" @upload-file="updateFileUpload">
      <div
        slot="fileUpload"
        style="font-size:20px;font-weight:bold;color:black"
      >
        Upload Supporting documents.
        <span style="font-size:12px" v-if="status === OPENED"
          >(Max file size {{ docSize }})</span
        >
      </div>
    </FileUpload>
  </div>
</template>
<script>
import Settle from "@/components/Settle.vue";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus.js";

export default {
  components: {
    FileUpload,
    Settle
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
      OPENED: caseStatus.PENDINGTHIRD
    };
  },
  methods: {
    async updateFileUpload(e) {
      if (e.delFile) {
        this.$store
          .dispatch("delSettleFile", JSON.stringify(e.id))
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
            console.log("Settle file not deleted " + err);
          });
      }
      var varSettle = {};

      varSettle.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varSettle.filesUploaded.push(file);
          });
          this.delStore = [];
          this.delIncoming = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varSettle.filesUploaded,
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
                      SettleId: arr[i].SettleId
                    };
                    try {
                      this.delIncoming.push(file);
                      await this.$store.dispatch("updateFile", file);
                    } catch (err) {
                      console.log("Settlement File not updated " + err);
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
            varSettle.filesUploaded = varSettle.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varSettle.settleId = this.$store.getters.getSettleId;
        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varSettle.filesUploaded
        );

        var allFiles = await this.loadSettleFiles(e.filesUploaded, varSettle);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Settle files wiz6 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadSettleFiles(fileArr, varSettle) {
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
          SettleId: varSettle.settleId
        });
      });
      return retArr;
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doSettleFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    var defend = this.$store.getters.getDefendant;
    var user = this.$store.getters.getArbitUser;

    if (defend && user) {
      if (defend.ArbitUserId === user.id) {
        this.readOnly = await false;
        this.isVisible = await true;
      } else {
        this.readOnly = await true;
        this.isVisible = await false;
      }
      if (defend.StatusId > caseStatus.PENDINGTHIRD) {
        this.readOnly = await true;
        this.isVisible = await false;
      }
      this.status = defend.StatusId;
    }
    if (this.$store.getters.getSettleFiles) {
      var files = this.$store.getters.getSettleFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
