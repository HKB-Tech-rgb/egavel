<template>
  <div style="background-color:white">
    <!--<Apportionment :readOnly="readOnly"></Apportionment>-->
    <FileUpload @upload-file="updateFileUpload" :isVisible="isVisible">
      <h3 slot="fileUpload">Upload Apportionment Documents.</h3>
    </FileUpload>
  </div>
</template>
<script>
//import Apportionment from '@/components/Apportionment.vue';
import FileUpload from "@/components/FileUpload.vue";

export default {
  components: {
    FileUpload
    //Apportionment
  },
  data() {
    return {
      uploadFile: [],
      delIncoming: [],
      delStore: [],
      readOnly: false,
      isVisible: true
    };
  },
  methods: {
    async updateFileUpload(e) {
      if (e.delFile) {
        this.$store
          .dispatch("delApportionFile", JSON.stringify(e.id))
          .then(msg => {
            var fileArr = [];
            console.log("files deleted " + msg);
            //await this.findApportionFiles();
            this.$store.getters.getCurrentUploadedFiles.forEach(obj => {
              fileArr.push(obj);
            });

            fileArr = fileArr.filter(item => item.filename != e.file.filename);
            this.$store.dispatch("doCurrentUploadedFiles", fileArr);
          })
          .catch(err => {
            console.log("Apportion file not deleted " + err);
          });
      }
      var varApportion = {};

      varApportion.filesUploaded = [];

      //console.log('filenames from upload component '+ JSON.stringify(e));

      try {
        if (
          this.$store.getters.getCurrentUploadedFiles != null &&
          this.$store.getters.getCurrentUploadedFiles.length > 0
        ) {
          this.$store.getters.getCurrentUploadedFiles.forEach(file => {
            varApportion.filesUploaded.push(file);
          });
          this.delStore = [];
          this.delIncoming = [];

          await this.mergeNewAndStore(
            e.filesUploaded,
            varApportion.filesUploaded,
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
                      ApportionmentId: arr[i].ApportionmentId
                    };
                    try {
                      this.delIncoming.push(file);
                      await this.$store.dispatch("updateFile", file);
                    } catch (err) {
                      console.log("Apportionment File not updated " + err);
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
            varApportion.filesUploaded = varApportion.filesUploaded.filter(
              item => item.filename != file.filename
            );
          });
        }
        varApportion.apportionmentId = this.$store.getters.getApportionmentId;
        //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
        await this.$store.dispatch(
          "doCurrentUploadedFiles",
          varApportion.filesUploaded
        );

        var allFiles = await this.loadApportionFiles(
          e.filesUploaded,
          varApportion
        );
        await this.$store.dispatch("doCurrentUploadedFiles", allFiles);
      } catch (err) {
        console.log("problem processing Apportion files wiz2 " + err);
      }
    },
    async mergeNewAndStore(arrNew, arrStore, callback) {
      for (var i = 0; i < arrNew.length; i++) {
        callback(arrStore, arrNew[i].filename, arrNew[i].diskname);
      }
    },
    loadApportionFiles(fileArr, varApportion) {
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
          ApportionmentId: varApportion.apportionmentId
        });
      });
      return retArr;
    },
    findApportionFiles() {
      this.$store
        .dispatch("findApportionFiles", this.getApportionmentId)
        .then(apportionFiles => {
          this.$store.dispatch("doCurrentUploadedFiles", apportionFiles);
          //console.log('Apportion files '+ JSON.stringify(apportionFiles));
        })
        .catch(err => {
          console.log("error finding apportion files " + err);
        });
    }
  },
  async beforeDestroy() {
    var currentFiles = this.$store.getters.getCurrentUploadedFiles;
    if (currentFiles) {
      await this.$store.dispatch("doApportionFiles", currentFiles);
    }
    await this.$store.dispatch("doCurrentUploadedFiles", null);
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
    }
    if (this.$store.getters.getApportionFiles) {
      var files = this.$store.getters.getApportionFiles;
      await this.$store.dispatch("doCurrentUploadedFiles", files);
    }
  }
};
</script>
