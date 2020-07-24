<template>
  <div class="flexbox">
    <Board id="Board-1" boardId="board-1">
      <card id="card-1" draggable="true" value="1">
        <p>{{ roleOneDesc }}</p>
      </card>
      <card id="card-2" draggable="true" value="2">
        <p>{{ roleTwoDesc }}</p>
      </card>
      <card id="card-3" draggable="true" value="3">
        <p>{{ roleThreeDesc }}</p>
      </card>
      <card id="card-4" draggable="true" value="4">
        <p>{{ roleFourDesc }}</p>
      </card>
    </Board>
    <Board id="Board-2" boardId="board-2"> </Board>
    <div>
      <v-layout column justify-center>
        <v-btn small rounded yellow>
          create
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn small rounded yellow>
          exit
        </v-btn>
      </v-layout>
    </div>
  </div>
</template>
<script>
import Board from "@/components/Board.vue";
import Card from "@/components/Card.vue";
export default {
  components: {
    Board,
    Card
  },
  data() {
    return {
      roleOneDesc: "",
      roleTwoDesc: "",
      roleThreeDesc: "",
      roleFourDesc: ""
    };
  },
  methods: {
    loadUserRoles(roles) {
      var userRoles = [];
      roles.forEach(role => {
        switch (role.id) {
          case 1:
            this.roleOneDesc = role.RoleDescription;
            break;
          case 2:
            this.roleTwoDesc = role.RoleDescription;
            break;
          case 3:
            this.roleThreeDesc = role.RoleDescription;
            break;
          case 4:
            this.roleFourDesc = role.RoleDescription;
            break;
          default:
            console.log("Problem with role idee");
        }
        userRoles.push({ id: role.id, desc: role.RoleDescription });
      });
      return userRoles;
    }
  },
  async created() {
    var roles = await this.$store.dispatch("getAllRoles");
    var userRoles = this.loadUserRoles(roles);
    await this.$store.dispatch("fixDndRoles", userRoles);
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background-color: #f3f3f3;
}
.flexbox {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 768px;
  height: 100vh;
  overflow: hidden;

  margin: 0 auto;
  padding: 15px;
}
.flexbox .board {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
  max-width: 250;
  background-color: #313131;
  padding: 15px;
}
.flexbox .board .card {
  padding: 15px 25px;
  background-color: #f3f3f3;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
