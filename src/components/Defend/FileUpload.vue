<template>
   <div>
        <div class="message">
            <h3>{{this.upload.message}}</h3>
        </div>
       
        <div v-for="(file, index) in fileList" v-bind:key="index" class="file-listing">{{ file.filename }} 
           <span class="remove-file" v-on:click="viewFile( file )">View</span>
           <span class="remove-file">|</span>
           <span class="remove-file" v-on:click="downloadFile( file )">Download</span>
        </div>
    </div>
</template>
<script>

import Api from '@/services/Api';

export default {
    data(){
        return {
            upload:{
                files: [],
                delFile: false,
                filesUploaded: [],
                message:''
            },
            caseFiles:[],
            key:''
        }
    },
    props:{ 
        fileUpload: []
    },
    methods:{
        viewFile(file){
            window.open(`http://localhost:3001/routes/uploads/${file.diskname}`);
            window.target="_blank";
        },
        downloadFile(file){
            Api({
                url: `routes/uploads/${file.diskname}`,
                method: 'GET',
                responseType: 'blob', // important
                }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${file.filename}`); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
        },
       
        removeDuplicates(originalArray, prop) {
            var newArray = [];
            var lookupObject  = {};

            for(var i in originalArray) {
                lookupObject[originalArray[i][prop]] = originalArray[i];
            }

            for(i in lookupObject) {
                newArray.push(lookupObject[i]);
            }
            return newArray;
        },
         
        fileDownload(){
            Api({
                url: '/download',
                method: 'GET',
                responseType: 'blob', // important
                }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.pdf'); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
        }
    },
    async beforeDestroy() {
        //this.$emit('upload-file', this.upload);
    },
    async created(){
        this.upload.files = [];
        /*
        if (this.fileUpload != null && this.fileUpload != 'undefined') {
            if(this.fileUpload.filesUploaded.length > 0) {
                this.fileUpload.filesUploaded.forEach(file => {
                    this.upload.filesUploaded.push(file.filename);    
                });

                this.upload.fUploaded = this.fileUpload.fUploaded
                this.upload.filesUploaded = this.fileUpload.filesUploaded
                this.upload.message = 'Files currently uploaded'; 
            }    
        }*/
    },
    computed: {
        fileList() {
            return this.$store.getters.getCurrentUploadedFiles;
        },
},
}
</script>
<style scoped>
    input[type="file"]{
        position: absolute;
        top: -500px;
    }
    .btns{
        color: blue
    }
    

     div.file-listing{
        background-color: lightcyan ;
        color: blue
    }
    span.remove-file{
        color: red;
        cursor: pointer;
        float: center;
    }
</style>


