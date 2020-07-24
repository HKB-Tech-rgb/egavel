<template>
    <div id="navigation-mobile">
        <div class="search">
            <v-text-field 
               outlined
               dense
               label="Cases Search"
               placeholder="Search..."
               append-icon="mdi-file-search"
            ></v-text-field>
        </div>
        <ul>
            <li>
                <v-btn text small @click="swapView">
                    <v-icon dark small left>mdi-view-headline</v-icon >{{viewHead}}
                </v-btn>
            </li>
            <li>
                <v-btn text small @click="navigateTo('/help')" >
                    <v-icon dark small left>mdi-help</v-icon >Help
                </v-btn>
            </li>
            <li>
                <v-btn text small @click="logout" >
                    <v-icon dark small left>mdi-location-exit</v-icon >
                    logout
                </v-btn>
            </li>
        </ul>
    </div>
</template>
<script>
    export default {
        data: () => {
            return {
                toggleView: false,
                viewHead: 'Liabilities'
            }
        },
        methods: {
            swapView(){
               this.toggleView = !this.toggleView
               this.viewHead = this.toggleView?'Recoveries':'Liabilities'

               this.$emit('change-view', this.toggleView);
            },
            NavigateTo(route){
                this.$router.push(route);
            },
            async logout(){
                await sessionStorage.removeItem('user');
                await this.$store.dispatch('initArbitUser',null);
                this.$router.push('/');
            }
        }
    }

</script>
<style scoped lang="scss">
#navigation-mobile{
    padding: 20px 0 0 0;

    ul{
        list-style:none;
        width: 120px;
        
       
        li{
            color: dark-brown;
            margin-bottom: 20px;
            cursor: pointer;
            &:hover{
                color: #111
            }
        }
    }
    .search {
        position: relative;
        width: 260px;
        margin-bottom: 20px;
        padding-left: 20px;
        input {
            border: none;
            outline: none;
            width: 180px;
            padding: 10px 50px 10px 20px;
            margin: 0;
            border-radius: 20px;
            background-color: #efefef;
            font-family: 'Segoe UI', Tahoma;
            font-size: 1rem;
        }
        .icon  {
            position: absolute;
            right: 5px;
            padding-left: 1px;
            top: 10px;
            font-size: 1.4rem;
            color: #aaa;
            cursor: pointer
        }
    }
    .social-media {
        position: absolute;
        left: 40px;
        bottom: 20px;

        .icon {
            margin: 0 20px 0 0;
            color: #fff;
            font-size: 2rem;
        }
    }
}
</style>

