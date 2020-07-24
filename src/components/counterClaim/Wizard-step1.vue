<template>
  <div>
    <Kause :readOnly="readOnly"></Kause>
    <FileUpload :isVisible="isVisible" @upload-file="updateFileUpload">
      <div
        slot="fileUpload"
        style="font-size:20px;font-weight:bold;color: black !important"
      >
        Supporting documents..
        <span style="font-size:12px" v-if="status === OPENED"
          >(Max file size {{ docSize }})</span
        >
      </div>
    </FileUpload>
  </div>
</template>
<script>
import Kause from "@/components/Kause-cc.vue";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    FileUpload,
    Kause
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
        var url = `coafilesCC/${JSON.stringify(e.id)}`;
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
            console.log("ccCoa file not deleted " + err);
          });
      }
      var varCoa = {};

      varCoa.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varCoa.filesUploaded.push(file);
          });
          this.delStore = [];
          this.delIncoming = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varCoa.filesUploaded,
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
                      ccCoaId: arr[i].ccCoaId
                    };
                    try {
                      this.delIncoming.push(file);
                      var fileObj = {
                        url: `coafilesCC/${file.id}`,
                        file: file
                      };
                      await this.$store.dispatch("updateFile", fileObj);
                    } catch (err) {
                      console.log("Coa file not updated " + err);
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
            varCoa.filesUploaded = varCoa.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varCoa.coaId = this.$store.getters.getCcCoaId;

        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varCoa.filesUploaded
        );
        var allFiles = await this.loadCoaFiles(e.filesUploaded, varCoa);
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
    loadCoaFiles(fileArr, varCoa) {
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
          ccCoaId: varCoa.coaId
        });
      });
      return retArr;
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doCcCoaFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    var defendCoy = await this.$store.getters.getDefendant;
    var userCoy = await this.$store.getters.getArbitUser;

    if (defendCoy && userCoy) {
      if (defendCoy.CompanyId === userCoy.CompanyId) {
        this.readOnly = false;
        this.isVisible = true;
      } else {
        this.isVisible = false;
        this.readOnly = true;
      }
      this.status = defendCoy.StatusId;
      if (defendCoy.StatusId > caseStatus.PENDINGTHIRD) {
        this.isVisible = false;
        this.readOnly = true;
      }
    }
    if (this.$store.getters.getCcCoaFiles) {
      var files = this.$store.getters.getCcCoaFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
