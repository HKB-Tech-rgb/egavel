<template>
    <div>
        <h1>E-Arbitrate - Arbitration Platform.</h1>
    </div>
</template>
<script>
export default {
    data(){
        return {
            userMsg: null
        }
    },
    methods: {
        redirectUser() { 
            this.$router.push('/');
        }
    },
    created(){
        this.userMsg = this.$route.params.msg;
    }
    
}
</script>
<style scoped>

</style>



