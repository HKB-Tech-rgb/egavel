<template>
  <div></div>
</template>
<script>
import Api from "../services/Api";
export default {
  props: {
    signData: {
      type: String,
      value: ""
    }
  },
  methods: {
    async createOnDisk() {
      console.log("creating " + this.signData.length);
      var blob = new Blob([this.signData], { type: "text/plain" });
      var file = new File([blob], "sign.png", { type: "text/plain" });
      let formData = new FormData();
      if (file.size > 10000000) {
        this.upload.message = `File size ${Math.round(
          file.size / 1000000
        )} megs - too large, only less than 10 megs allowed`;
        await this.removeProgressBar();
        return;
      }
      formData.append("upFiles", file);
      formData.append("singleFile", true);

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
          var uploadFile = {
            fileUploaded: {},
            message: ""
          };
          uploadFile.messsage = response.data.msg;
          uploadFile.fileUploaded = response.data.files[0];
          console.log(JSON.stringify(response.data.files[0]));
          this.$emit("file-obj", uploadFile.fileUploaded);
        })
        .catch(function(err) {
          throw err;
          //this.upload.message = "File upload Failure "+ err;
        });
    }
  }
};
</script>
