<template>
    <div id="mobile-comm">
        <ul>
            <li>
                <v-btn text small @click="navigateTo('/help')" >
                    <v-icon dark left>mdi-help</v-icon >Help
                </v-btn>
            </li>
            <li>
                <v-btn text small @click="logout" >
                    <v-icon dark left>mdi-location-exit</v-icon >
                    Logout
                </v-btn>
            </li>
            <li>
               <Btn1 @change-form="changeForm"/>
            </li>
            <li>
                <Btn2 @change-form="changeForm"/>
            </li>
            <li>
                <Btn5 @change-form="changeForm"/>
            </li>
            <li>
                <Btnexit @change-form="changeForm"/>
            </li>
        </ul>
    </div>
</template>
<script>
import Btn1 from '@/components/commission/Btn1.vue';
import Btn2 from '@/components/commission/Btn2.vue';
import Btn5 from '@/components/commission/Btn5.vue';
import Btnexit from '@/components/commission/Btn-exit.vue';
    export default {
        data: () => {
            return {
                toggleView: false,
                viewHead: 'Liabilities'
            }
        },
        components:{
            Btn1,
            Btn2,
            Btn5,
            Btnexit 
        },
        methods: {
            changeForm(e){
                this.$emit('change-form', e);
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
#mobile-comm{
    padding: 20px 0 0 0;

    ul{
        list-style:none;
        display: block;
        width: 150px;
        border: 1px;
        padding-left: 10px;
               
        li{
            color: brown;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 5px;
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
            font-size: 1.6rem;
            color: #aaa;
            cursor: pointer
        }
    }
}
</style>

