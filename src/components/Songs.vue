<template>
    <v-layout column>
      <v-flex xs8>
        <panel title="search for songs">
            <v-text-field label="Song Name"></v-text-field>
        </panel>
        <panel title="Songs">
            <v-btn route to="/songs/create" slot="action" class="indigo accent-2">
                <v-icon>add</v-icon>
            </v-btn>
            <div class="song" v-for="song in songList" :key="song.id">
                <v-layout>
                    <v-flex xs6>
                        <div class="song-title">
                            {{song.title}}
                        </div>
                        <div class="song-artist">
                            {{song.artist}}
                        </div>
                        <div class="song-genre">
                            {{song.genre}}
                        </div>
                        <v-btn color="indigo" dark @click="navigateTo({
                            name: 'songs-view',
                            params:{
                                songId: song.id
                            }
                        })">View</v-btn>
                    </v-flex>
                    <v-flex xs6>
                        <img class="al-img" :src="song.albumImage"/>
                    </v-flex>
                </v-layout>
            </div>
        </panel>
      </v-flex>   
    </v-layout>
</template>

<script>
//import SongsService from '../services/SongsService'
import Panel from './Panel.vue'

export default {
    components:{
        Panel
    },
    methods:{
        navigateTo (route){
            this.$router.push(route);
        }
    },
    data() {
        return {
            songs: null
        }
    },
    computed : {
        songList(){
            return this.$store.getters.getAllSongs;
        }
    },
    async mounted() {
        try {
            //this.songs = (await SongsService.getAllSongs()).data;
            this.$store.dispatch("getAllSongs").then(response => {
                console.log('Got Data ' + response)
                
            }, error => {
                console.log('Got Nowt Data '+ error);
            });
            //this.songs = this.$store.getters.getAllSongs;
            console.log('Got Data from store ' + JSON.stringify( this.$store.getters.getAllSongs))

        } catch (error) {
            console.log(error);
        }
        
    }
       
    
}
</script>

<style scoped>
    .song{
        padding: 20px;
        height: 200px;
        overflow: hidden;
        text-align: center;
    }
    .song-title{
        font-size: 30px;
    }
    .song-artist{
        font-size: 24px;
    }
    .song-genre{
        font-size: 18px;
    }
    .al-img{
        width: 70%;
        margin: 0 auto;
    }
</style>



