<template>
  <div class="text-xs-center">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn flat color="primary" light v-on="on">
          <v-icon left>attachment</v-icon>
          <span>Case Files</span>
        </v-btn>
      </template>
      <v-list>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator>
              <v-list-tile @click="fetchFiles">View Files</v-list-tile>
          </template>
          <v-list-tile
            v-for="(item, index) in filesUploaded"
            :key="index"
            @click="viewFile(item.diskname)">
            <v-list-tile-title>{{ item.filename }}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>
        <v-list-group no-action sub-group value="true">
          <template v-slot:activator>
              <v-list-tile  @click="fetchFiles">Download</v-list-tile>
          </template>
          <v-list-tile
            v-for="(item, index) in filesUploaded"
            :key="index"
            @click="downloadFile(item)">
            <v-list-tile-title>{{ item.filename }}</v-list-tile-title>
          </v-list-tile>
        </v-list-group>    
      </v-list>
    </v-menu>
  </div>
</template>
<script>
  import Api from '../services/Api';
  export default {
    data: () => ({
      items: [
        { filename: 'File1.pdf' ,diskname:'foo.pdf'},
        { filename: 'File2.pdf' ,diskname:'5432211.pdf'},
        { filename: 'File3.pdf' ,diskname:'7776655.pdf'},
        { filename: 'File4.pdf' ,diskname:'99887766.pdf'}
      ],
      filesUploaded:[],
      viewOn:false,
      downOn:false
      
    }),
    methods:{
      fetchFiles(){
       
        var wizStep = this.$store.getters.getStep
        console.log('In fetch files '+ wizStep);
        switch(wizStep){
          case 0:
          case 1:
          case 2:
            alert('Files available in step 3 onward in arbit wizard') 
            break;

          case 3:
            if(this.$store.getters.getLociFiles!=null && this.$store.getters.getLociFiles!='undefined'){
              this.filesUploaded = this.$store.getters.getLociFiles.filesUploaded;
              if (this.filesUploaded.length < 1){
                alert('No Locus Standi Files uploaded');  
              }    
            }else{
              alert('No Locus Standi Files available presently')
            }
            break;
          case 4:
             if(this.$store.getters.getCoaFiles!=null && this.$store.getters.getCoaFiles!='undefined'){
              this.filesUploaded = this.$store.getters.getCoaFiles.filesUploaded;
              if (this.filesUploaded.length < 1){
                alert('No Cause of action files uploaded');  
              }    
            }else{
              alert('No Cause of action files available presently')
            }
            break;
          case 5:
          case 6:
            alert('Not yet implemented');
            break;
          case 7:
            alert('files Not available in this context');
            break;      
          default:
            alert('Alert administrator as this should not happen!');    
        }
      },
      viewFile(diskname){
        alert('view ' + diskname);
        this.$store.dispatch('initFile',diskname);
        this.$router.push('/a');
      },
      downloadFile(item){
        //alert('download ' + diskname);
        Api({
                url: `routes/uploads/${item.diskname}`,
                method: 'GET',
                responseType: 'blob', // important
                }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${item.filename}`); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
      }
    }
  }
</script>
