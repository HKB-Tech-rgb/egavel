<template>
  <div class="text-xs-center">
    <v-menu open-on-hover offset-y>
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"> <v-icon dark left>person</v-icon>Users</v-btn>
      </template>

      <v-list>
        <v-list-tile
          v-for="(item, index) in items"
          :key="index"
          @click="navigateTo(index)">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
  export default {
    data: () => ({
      items: [
        { title: 'login' },
        { title: 'Register' },
        { title: 'Logoff' },
        { title: 'Create Role' }
      ]
    }),
    methods:{
      navigateTo(selection){
        
        switch (selection){
          case 0:
            this.$router.push('/arbitLogin');
            break;
          case 1:
            this.$router.push('/arbitSignup');
            break;
          case 2:
            sessionStorage.removeItem('user');
            this.$router.push('/home');
            /*
            this.$store.dispatch("setUpArbitToken", null).then(() => {
                //console.log('Got Data ' + this.$store.getters.isLoggedOn)
             }, error => {
                console.log('Got Nowt Data '+ error);
            });*/
            break;
          case 'Create Role':
             break;
          default:
            console.log('kuk has happened in DDUserMenu');   
        }
      }
    }
  }
</script>