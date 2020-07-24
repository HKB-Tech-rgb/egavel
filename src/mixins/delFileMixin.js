export default {
    methods: {
        deleteFile(url, e) {
            console.log('in delete file ' + url);
            this.$store.dispatch('delFile', url).then((msg) => {
                var fileArr = [];
                console.log('files deleted ' + msg);
                this.$store.getters.getCurrentUploadedFiles.forEach(obj => {
                    fileArr.push(obj);
                });
               
                fileArr = fileArr.filter(item => item.filename != e.file.filename);
                this.$store.dispatch('doCurrentUploadedFiles', fileArr);
                
            }).catch(err => {
                console.log('loci file not deleted ' + err);
                throw err
            });    
        }
    }
    
}
