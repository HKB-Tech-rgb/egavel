<template>
  <div style="background-color:white">
    <LociStandi :readOnly="readOnly"></LociStandi>
    <FileUpload
      :isVisible="isVisible"
      @upload-file="updateFileUpload"
      @reset-files="resetLociFiles"
    >
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
import LociStandi from "@/components/LociStandiDef.vue";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    FileUpload,
    LociStandi
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
        var url = `locifilesCC/${JSON.stringify(e.id)}`;
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
      var varLoci = {};
      varLoci.upLoadMessage = e.message;
      varLoci.filesUploaded = [];
      //console.log('filenames from upload wiz 3 '+ JSON.stringify(e));
      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varLoci.filesUploaded.push(file);
          });
          this.delIncoming = [];
          this.delStore = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varLoci.filesUploaded,
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
                      DefLocusStandiId: arr[i].DefLocusStandiId
                    };
                    try {
                      this.delIncoming.push(file);
                      var fileObj = {
                        url: `locifilesDef/${file.id}`,
                        file: file
                      };
                      await this.$store.dispatch("updateFile", fileObj);
                    } catch (err) {
                      console.log("Loci file not updated " + err);
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
            varLoci.filesUploaded = varLoci.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varLoci.lociId = this.$store.getters.getLociStandiDefId;
        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varLoci.filesUploaded
        );
        var allFiles = await this.loadLociFiles(e.filesUploaded, varLoci);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing loci files wiz3 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadLociFiles(fileArr, varLoci) {
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
          DefLocusStandiId: varLoci.lociId
        });
      });
      return retArr;
    },
    async resetLociFiles(e) {
      await this.$store.dispatch("doLociStandiDefFiles", []);
      var fileArr = [];
      await e.forEach(file => {
        fileArr.push(file);
      });
      await this.$store.dispatch("doLociStandiDefFiles", fileArr);
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doLociStandiDefFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", []);
  },
  async created() {
    var defendCoy = this.$store.getters.getDefendant;
    var userCoy = this.$store.getters.getArbitUser;
    if (defendCoy && userCoy) {
      if (defendCoy.CompanyId === userCoy.CompanyId) {
        this.readOnly = await false;
        this.isVisible = await true;
      } else {
        this.isVisible = await false;
        this.readOnly = await true;
      }
      this.status = defendCoy.StatusId;
    }
    //console.log('getLociFiles '+ JSON.stringify(this.$store.getters.getLociFiles));
    if (this.$store.getters.getLociStandiDefFiles) {
      var files = await this.$store.getters.getLociStandiDefFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
