<template>
  <div id="sign">
    <div class="container">
      <div class="row">
        <div class="col-12 mt-2">
          <VueSignaturePad
            id="signature"
            width="100%"
            height="400px"
            ref="signaturePad"
            :options="options"
          />
        </div>
        <div class="col-3 mt-2">
          <button
            class="btn btn-outline-secondary"
            style="color: blue"
            @click="undo"
          >
            Undo
          </button>
        </div>
        <div class="col-3 mt-2">
          <button
            class="btn btn-outline-primary"
            style="color: blue"
            @click="save"
          >
            Save
          </button>
        </div>
        <div class="col-3 mt-2">
          <button
            class="btn btn-outline-primary"
            style="color: blue"
            @click="exit"
          >
            Exit
          </button>
        </div>
        <div class="col-3 mt-2">
          <button class="btn btn-outline-primary" @click="resume">
            Resume
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Api from "../services/Api";
export default {
  name: "sign",
  data: () => ({
    options: {
      penColor: "#c0f"
    },
    fileObj: {}
  }),
  methods: {
    undo() {
      this.$refs.signaturePad.undoSignature();
    },
    async save() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

      //alert("Open DevTools see the save data.");
      //console.log(data);
      if (!isEmpty) await this.createOnDisk(data);
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
      //console.log(JSON.stringify(this.fileObj));
    },
    exit() {
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    resume() {
      this.options = {
        penColor: "#c0f"
      };
    },
    async createOnDisk(data) {
      var blob = new Blob([data], { type: "text/plain" });
      var file = new File([blob], "sign.png", { type: "text/plain" });
      let formData = new FormData();
      if (file.size > 10000000) {
        this.upload.message = `File size ${Math.round(
          file.size / 1000000
        )} megs - too large, only less than 10 megs allowed`;
        return;
      }
      formData.append("upFiles", file);
      formData.append("singleFile", true);

      await Api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
        .then(async response => {
          this.fileObj = await response.data.files[0];
          //console.log()
        })
        .catch(function(err) {
          throw err;
          //this.upload.message = "File upload Failure "+ err;
        });
    }
  }
};
</script>

<style>
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>
