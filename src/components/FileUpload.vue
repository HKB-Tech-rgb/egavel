<template>
  <div class="upload">
    <slot name="fileUpload"></slot>
    <input type="file" name="upFiles" ref="files" @change="onSelect" multiple />
    <div v-for="file in upload.files" :key="file" class="file-listing">
      {{ file.name }}
      <span class="remove-file" v-on:click="removeFile(key)">Remove</span>
    </div>
    <v-layout align-end justify-center>
      <div class="large-2 medium-2 small-12 cell brown-lighten-3">
        <v-btn depressed v-on:click="addFiles()" :disabled="!isVisible"
          >Select/Upload Files</v-btn
        >
      </div>
      <!--
      <div class="large-2 medium-2 small-12 cell brown-lighten-3">
        <v-btn depressed @click="onSubmit" :disabled="!isVisible"
          >Upload Files</v-btn
        >
      </div>-->
    </v-layout>
    <div class="message">
      <h3>{{ this.upload.message }}</h3>
    </div>

    <div
      v-for="(file, index) in fileList"
      v-bind:key="index"
      class="file-listing"
    >
      {{ file.filename }}
      <span class="remove-file" v-on:click="viewFile(file)">View</span>
      <span class="remove-file">|</span>
      <span class="remove-file" v-on:click="downloadFile(file)">Download</span>
      <span class="remove-file" v-if="isVisible">|</span>
      <span
        class="remove-file"
        v-on:click="deleteFile(file, index)"
        v-if="isVisible"
        >Delete</span
      >
    </div>
    <br />
    <div>
      <v-layout row justify-center v-show="fileUp">
        <v-flex xs12 md6 lg4>
          <v-progress-linear
            v-model="uploadPercentage"
            color="light-green darken-4"
            height="10"
            value="20"
            rounded
            striped
          >
          </v-progress-linear>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script>
import Api from "../services/Api";

export default {
  data() {
    return {
      upload: {
        files: [],
        delFile: false,
        filesUploaded: [],
        message: ""
      },
      caseFiles: [],
      key: "",
      appUrl: process.env.VUE_APP_FILE_URL,
      uploadPercentage: 0,
      fileUp: false
    };
  },
  props: {
    fileUpload: [],
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    uploadPercentage: function(val) {
      if (val === 100) {
        setTimeout(() => {
          this.uploadPercentage = 0;
          this.fileUp = false;
        }, 4000);
      }
    }
  },
  methods: {
    removeProgressBar() {
      setTimeout(() => {
        this.upload.message = "";
        this.upload.files = [];
        this.fileUp = false;
      }, 4000);
    },
    addFiles() {
      if (this.$refs.files.files == {}) return;
      this.$refs.files.click();
    },
    onSelect() {
      let uploadedFiles = this.$refs.files.files;

      for (var i = 0; i < uploadedFiles.length; i++) {
        this.upload.files.push(uploadedFiles[i]);
      }
      setTimeout(() => {
        this.upload.message = "";
        this.onSubmit();
      }, 500);
    },
    removeFile(key) {
      this.upload.files.splice(key, 1);
    },
    viewFile(file) {
      //window.open(`http://localhost:8080/routes/uploads/${file.diskname}`);
      window.open(`${this.appUrl}/routes/uploads/${file.diskname}`);
      window.target = "_blank";
    },
    downloadFile(file) {
      Api({
        url: `routes/uploads/${file.diskname}`,
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${file.filename}`); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    },
    async deleteFile(file) {
      //console.log('file in delete ' + JSON.stringify(file));

      if (file.id) {
        this.upload.delFile = true;
        this.upload.id = file.id;
        this.upload.file = file;

        this.$emit("upload-file", this.upload);
      } else {
        var fileArr = [];
        await this.$store.getters.getCurrentUploadedFiles.forEach(obj => {
          fileArr.push(obj);
        });

        fileArr = await fileArr.filter(item => item.filename != file.filename);
        await this.$store.dispatch("doCurrentUploadedFiles", fileArr);
        this.$emit(
          "reset-files",
          await this.$store.getters.getCurrentUploadedFiles
        );
      }
    },
    removeDuplicates(originalArray, prop) {
      var newArray = [];
      var lookupObject = {};

      for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
      }
      for (i in lookupObject) {
        newArray.push(lookupObject[i]);
      }
      return newArray;
    },
    async onSubmit() {
      if (this.$refs.files.files == {}) return;
      this.fileUp = true;
      let formData = new FormData();

      for (var i = 0; i < this.upload.files.length; i++) {
        let file = this.upload.files[i];

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "application/pdf",
          "video/mpeg",
          "video/mp4"
        ];
        if (!allowedTypes.includes(file.type)) {
          this.upload.message = "Only image, video-mpeg and pdf allowed";
          await this.removeProgressBar();
          return;
        }
        if (file.size > 10000000) {
          this.upload.message = `File size ${Math.round(
            file.size / 1000000
          )} megs - too large, only less than 10 megs allowed`;
          await this.removeProgressBar();
          return;
        }
        formData.append("upFiles", file);
      }
      if (this.upload.files.length == 1) {
        formData.append("singleFile", true);
      } else {
        formData.append("singleFile", false);
      }

      //formData.append('arbitCase', "998877");
      //formData.append('claimant', "11223344");
      //console.log(...formData);
      if (this.upload.files.length > 0) {
        Api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress: function(progressEvent) {
            this.uploadPercentage = parseInt(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }.bind(this)
        })
          .then(response => {
            //this.upload.message = response.data.msg;
            var uploadArr = {
              filesUploaded: [],
              message: ""
            };
            uploadArr.messsage = response.data.msg;
            //console.log('resp data'+ JSON.stringify(response.data));
            //this.upload.filesUploaded = [];//initialize only contain uploaded files
            response.data.files.forEach(fileObj => {
              //this.upload.filesUploaded.push(fileObj);
              uploadArr.filesUploaded.push(fileObj);
            });
            uploadArr.filesUploaded = this.removeDuplicates(
              uploadArr.filesUploaded,
              "filename"
            );
            //console.log('no dups ' + JSON.stringify(uploadArr.filesUploaded));
            this.upload.files.splice(0, this.upload.files.length);
            this.$emit("upload-file", uploadArr);
          })
          .catch(function(err) {
            throw err;
            //this.upload.message = "File upload Failure "+ err;
          });
      }
    },
    fileDownload() {
      Api({
        url: "/download",
        method: "GET",
        responseType: "blob" // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf"); //or any other extension
        document.body.appendChild(link);
        link.click();
      });
    }
  },
  async beforeDestroy() {
    //this.$emit('upload-file', this.upload);
  },
  async created() {
    this.upload.files = [];
    //console.log('base url ' + process.env.VUE_APP_URL);
  },
  computed: {
    fileList() {
      return this.$store.getters.getCurrentUploadedFiles;
    }
  }
};
</script>
<style scoped>
input[type="file"] {
  position: absolute;
  top: -500px;
}
.btns {
  color: #8d6e63 !important;
}

div.file-listing {
  background-color: lightcyan;
  color: blue;
}
span.remove-file {
  color: red;
  cursor: pointer;
  float: center;
}
</style>
