<template>
    <div style="background-color:white">
        <LociStandi/>
        <FileUpload @upload-file="updateFileUpload"> 
            <h3 slot="fileUpload">Natis/Registration papers.</h3>
        </FileUpload>
    </div>
</template>
<script>
    import LociStandi from '@/components/LociStandi.vue';
    import FileUpload from '@/components/FileUpload.vue';
    
    export default {
        components:{
            FileUpload,
            LociStandi
        },
        data(){
            return {
                uploadFile: [],
                delIncoming:[],
                delStore:[]
            }    
        },
        methods:{
            async updateFileUpload(e){
                if (e.delFile){
                    this.$store.dispatch('delLociFile', JSON.stringify(e.id)).then((msg) => {
                        var fileArr = [];
                        console.log('files deleted ' + msg);
                        this.$store.getters.getCurrentUploadedFiles.forEach(obj => {
                            fileArr.push(obj);
                        });
                       
                        fileArr = fileArr.filter(item => item.filename != e.file.filename);
                        this.$store.dispatch('doCurrentUploadedFiles', fileArr);
                        
                    }).catch(err => {
                        console.log('loci file not deleted ' + err);
                    });
                }
                var varLoci = {};
                varLoci.upLoadMessage = e.message;
                varLoci.filesUploaded = [];
                
                //console.log('filenames from upload wiz 3 '+ JSON.stringify(e));
               
                try{
                    if (this.$store.getters.getCurrentUploadedFiles != null && 
                         this.$store.getters.getCurrentUploadedFiles.length > 0){
                       
                        this.$store.getters.getCurrentUploadedFiles.forEach(file => {
                            varLoci.filesUploaded.push(file);
                        });
                        this.delIncoming = [];
                        this.delStore = [];

                        await this.mergeNewAndStore(e.filesUploaded, 
                                varLoci.filesUploaded, async (arr, filename, diskname) => {
                                    for (var i=0;i<arr.length;i++) {
                                 
                                    if (arr[i].filename === filename){
                                        if (!arr[i].id){
                                            this.delStore.push(arr[i]);
                                            console.log('no id');
                                            
                                        }else{
                                            var file = {"id": arr[i].id,
                                                    "filename": arr[i].filename, 
                                                    "diskname": diskname, 
                                                    "createdAt": arr[i].createdAt,
                                                    "ClaimantId": arr[i].ClaimantId, 
                                                    "LocusStandiId": arr[i].LocusStandiId,
                                                    "ArbitCaseId": arr[i].ArbitCaseId}
                                            try{
                                                this.delIncoming.push(file);
                                                await this.$store.dispatch('updateLociFile', file);
                                                                                                                                                                         
                                            }catch(err){ 
                                                console.log('Loci file not updated ' + err);
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
                            varLoci.filesUploaded = varLoci.filesUploaded.filter(item => item.filename != file.filename);
                        });
 
                    }
                    varLoci.arbitCaseId = this.$store.getters.getCase.id;
                    varLoci.claimantId = this.$store.getters.getClaimantId;
                    varLoci.lociId = this.$store.getters.getLociId;

                    //console.log('loci files delete dup files '+ JSON.stringify(varLoci.filesUploaded));
                    await this.$store.dispatch('doCurrentUploadedFiles', varLoci.filesUploaded);
                    var allFiles = await this.loadLociFiles(e.filesUploaded, varLoci); 
                    await this.$store.dispatch('doCurrentUploadedFiles', allFiles);
                    
                }catch(err){
                    console.log('problem processing loci files wiz3 '+ err);
                }
               
            },
            async mergeNewAndStore(arrNew, 
                                    arrStore,
                                    callback){
                                     
                for(var i=0; i<arrNew.length;i++){
                    callback(arrStore,
                             arrNew[i].filename, 
                             arrNew[i].diskname)
               
                }
            },
            loadLociFiles(fileArr, varLoci){
                var retArr = [];
                if (this.$store.getters.getCurrentUploadedFiles!=null){
                   this.$store.getters.getCurrentUploadedFiles.forEach(file => {
                        retArr.push(file);
                   }) ;
                }
                
                fileArr.forEach( file => {
                    retArr.push({"filename":file.filename, 
                                 "diskname": file.diskname,
                                 "ClaimantId":  varLoci.claimantId,
                                 "ArbitCaseId": varLoci.arbitCaseId,
                                 "LocusStandiId": varLoci.lociId
                                });
                });
                return retArr;
            },
           
        },
        async beforeDestroy() {
           var currentFiles = this.$store.getters.getCurrentUploadedFiles; 
           if (currentFiles !=null && currentFiles.length > 0){
               await this.$store.dispatch('doLociFiles', currentFiles);
           }  
           await this.$store.dispatch('doCurrentUploadedFiles', null); 
          
        },
        async created(){
            if (this.$store.getters.getLociFiles){
                var files = this.$store.getters.getLociFiles;
                 await this.$store.dispatch('doCurrentUploadedFiles', files);
            }
          
        }    
    }
</script>
