export default {
    methods: {
        async updFile(e, objFilesUploaded, props) {
            var delIncoming = [];
            var delStore = [];
            await this.mergeNewAndStore(e.filesUploaded,
                                        objFilesUploaded,
                                        props,
                                        async (arr, filename, diskname, props) => {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].filename === filename) {
                        if (!arr[i].id) {
                            delStore.push(arr[i]);
                        } else {
                            var file = {
                                "id": arr[i].id,
                                "filename": arr[i].filename,
                                "diskname": diskname,
                                "createdAt": arr[i].createdAt
                                }
                                file[props.name] = `${arr[i]}.${props.value}`
                                console.log('file obj '+ JSON.stringify(file))
                                try {
                                    delIncoming.push(file);
                                    var fileObj = {
                                        url: `${props.fileUrl}/${file.id}`,
                                        file: file
                                    }
                                   
                                    await this.$store.dispatch('updateFile', fileObj);
                                } catch (err) {
                                    console.log(`error : ${props.name} ${err}`);
                                }
                        }
                        break;
                    }    
                }
            });
            this.delIncoming.forEach( file => {
                e.filesUploaded = e.filesUploaded.filter(item => item.filename != file.filename);
            });
            this.delStore.forEach(file => {
                objFilesUploaded = objFilesUploaded.filter(item => item.filename != file.filename);
            });
            return {
                efilesUploaded: e.filesUploaded,
                oFilesUploaded: objFilesUploaded
            }
     
        },
        async mergeNewAndStore(arrNew, 
                               arrStore,
                               props,
                               callback){
            for(var i=0; i<arrNew.length;i++){
                callback(arrStore,
                arrNew[i].filename,
                arrNew[i].diskname,
                props)
        
            }
        }
    }
}
