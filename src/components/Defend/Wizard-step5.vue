<template>
  <div style="background-color:white">
    <Defense :readOnly="readOnly"></Defense>
    <FileUpload :isVisible="isVisible" @upload-file="updateFileUpload">
      <div
        slot="fileUpload"
        style="font-size:20px;font-weight:bold;color: black"
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
import Defense from "@/components/Defense.vue";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus.js";

export default {
  components: {
    FileUpload,
    Defense
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
          .dispatch("delDefenseFile", JSON.stringify(e.id))
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
            console.log("Defense file not deleted " + err);
          });
      }
      var varDefense = {};

      varDefense.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varDefense.filesUploaded.push(file);
          });
          this.delStore = [];
          this.delIncoming = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varDefense.filesUploaded,
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
                      DefenseId: arr[i].DefenseId
                    };
                    try {
                      this.delIncoming.push(file);
                      await this.$store.dispatch("updateFile", file);
                    } catch (err) {
                      console.log("Defense file not updated " + err);
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
            varDefense.filesUploaded = varDefense.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varDefense.defenseId = this.$store.getters.getDefenseId;
        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varDefense.filesUploaded
        );

        var allFiles = await this.loadDefenseFiles(e.filesUploaded, varDefense);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Coa files wiz4 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadDefenseFiles(fileArr, varDefense) {
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
          DefenseId: varDefense.defenseId
        });
      });
      return retArr;
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doDefenseFiles", currentFiles);
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
    if (this.$store.getters.getDefenseFiles) {
      var files = this.$store.getters.getDefenseFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
