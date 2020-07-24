<template>
    <div id="navigation-mobile">
        <div class="search">
            <input type="text" placeholder="Search...">
            <font-awesome-icon icon="search" class="icon"/>
            
        </div>
        <ul>
            <li>Home</li>
            <li>Articles</li>
            <li>Magazines</li>
            <li>Editors</li>
            <li>Readers</li>
        </ul>
        <div class="social-media">
            <font-awesome-icon icon="twitter" class="icon"/>
            <font-awesome-icon :icon="['fab', 'twitter']" class="icon"/>
            <font-awesome-icon icon="instagram" class="icon"/>
            <font-awesome-icon :icon="['fab', 'instagram']" class="icon"/>
            <font-awesome-icon icon="pinterest" class="icon"/>
            <font-awesome-icon :icon="['fab', 'pinterest']" class="icon"/>
        </div>
        
    </div>
</template>
<script>
    export default {};
</script>
<style scoped lang="scss">
#navigation-mobile{
    padding: 20px 0 0 0;

    ul{
        list-style:none;
        width: 200px;
        padding-left: 40px;
       
        li{
            color: yellowgreen;
            font-size: 2rem;
            font-weight: bold;
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
            font-size: 1.6rem;
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
