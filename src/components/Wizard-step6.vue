<template>
  <div style="background-color:white">
    <Quantum :readOnly="readOnly"></Quantum>
    <FileUpload
      :isVisible="isVisible"
      @upload-file="updateFileUpload"
      @reset-files="resetQuantaFiles"
    >
      <div
        slot="fileUpload"
        style="font-size:20px;font-weight:bold ;color: black"
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
import Quantum from "@/components/Quantum";
import FileUpload from "@/components/FileUpload.vue";
import caseStatus from "@/status-enums/caseStatus";

export default {
  components: {
    FileUpload,
    Quantum
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
      OPENED: caseStatus.OPENED
    };
  },
  methods: {
    async updateFileUpload(e) {
      if (e.delFile) {
        var url = `quantafiles/${JSON.stringify(e.id)}`;
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
            console.log("Quantum file not deleted " + err);
          });
      }
      var varQuanta = {};

      varQuanta.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varQuanta.filesUploaded.push(file);
          });
          this.delIncoming = [];
          this.delStore = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varQuanta.filesUploaded,
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
                      QuantumId: arr[i].QuantumId
                    };
                    try {
                      this.delIncoming.push(file);
                      var fileObj = {
                        url: `quantumfiles/${file.id}`,
                        file: file
                      };
                      await this.$store.dispatch("updateFile", fileObj);
                    } catch (err) {
                      console.log("Quantum file not updated " + err);
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
            varQuanta.filesUploaded = varQuanta.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varQuanta.arbitCaseId = this.$store.getters.getCase.id;
        varQuanta.claimantId = this.$store.getters.getClaimantId;
        varQuanta.defendantId = this.$store.getters.getDefendantId;
        varQuanta.meritId = this.$store.getters.getQuantumId;

        //console.log('Quanta files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varQuanta.filesUploaded
        );
        var allFiles = await this.loadMeritFiles(e.filesUploaded, varQuanta);
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Quanta files wiz5 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadMeritFiles(fileArr, varQuanta) {
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
          QuantumId: varQuanta.quantaId
        });
      });
      return retArr;
    },
    async resetQuantaFiles(e) {
      await this.$store.dispatch("doQuantaFiles", []);
      var fileArr = [];
      await e.forEach(file => {
        fileArr.push(file);
      });
      await this.$store.dispatch("doQuantaFiles", fileArr);
    }
  },
  async beforeDestroy() {
    console.log("Quanta destroyed");

    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles != null && currentFiles.length > 0) {
      await this.$store.dispatch("doQuantaFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
  },
  async created() {
    var claimCase = this.$store.getters.getCase;
    var claim = this.$store.getters.getClaimant;
    var user = this.$store.getters.getArbitUser;

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
    if (this.$store.getters.getQuantaFiles) {
      var files = this.$store.getters.getQuantaFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
