<template>
  <div>
    <v-layout row wrap justify-center>
      <div style="text-align:center;color:black">
        <h3>Assign Roles to user</h3>
      </div>
    </v-layout>
    <v-layout class="flexbox">
      <v-flex class="lg6 board">
        <draggable
          tag="ul"
          :list="roles"
          style="list-style-type:none"
          group="user-roles"
          class="draggable-list"
          ghost-class="moving-card"
          :animation="200"
          @ended="true"
        >
          <li
            class="card"
            v-for="role in roles"
            :key="role.id"
            style="color:black"
          >
            {{ role.desc }}
          </li>
        </draggable>
      </v-flex>
      <v-flex class="lg6 board">
        <draggable
          tag="ul"
          :list="userRoles"
          group="user-roles"
          class="draggable-list"
          ghost-class="moving-card"
          :animation="200"
          style="list-style-type:none"
          @ended="true"
        >
          <li
            class="card"
            v-for="role in userRoles"
            :key="role.id"
            style="color:black"
          >
            {{ role.desc }}
          </li>
        </draggable>
      </v-flex>
    </v-layout>
    <v-layout row wrap justify-center>
      <v-btn success large @click="back">Done</v-btn>
    </v-layout>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  data() {
    return {
      roles: []
    };
  },
  components: {
    draggable
  },
  computed: {
    userRoles: {
      get() {
        return this.$store.getters.getDndRoles;
      },
      set(value) {
        console.log(value);
        //this.$store.dispatch("fixDndRoles", value);
      }
    }
  },
  methods: {
    changedList1() {
      //if (e.added) console.log("added1 " + JSON.stringify(e.added));
      //if (e.removed) console.log("removed1 " + JSON.stringify(e.removed));
    },
    changedList2() {
      //if (e.added) console.log("added2 " + JSON.stringify(e.added));
      //if (e.removed) console.log("removed2 " + JSON.stringify(e.removed));
      //console.log("removed2 " + JSON.stringify(removed));
    },
    back() {
      this.$router.push({ path: this.$routerHistory.previous().path });
    }
  },
  async created() {
    var roles = await this.$store.dispatch("getAllRoles");

    await roles.forEach(role => {
      this.roles.push({ id: role.id, desc: role.RoleDescription });
    });
    //console.log(JSON.stringify(this.roles));
  }
};
</script>
<style lang="scss">
.draggable-list {
  min-height: 100 px;
}
/* Unfortunately @apply cannot be setup in codesandbox, 
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.moving-card {
  opacity: 0.5;
  background: #f7fafc;
  border: 1 px solid #4299e1;
}
.flexbox {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 768px;
  height: 70vh;
  overflow: hidden;

  margin: 0 auto;
  padding: 15px;
}
.flexbox .board {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  height: 100%;
  max-width: 350px;
  background-color: #dcdcdc;
  padding: 15px;
}
.flexbox .board .card {
  padding: 15px 25px;
  background-color: #f3f3f3;
  cursor: pointer;
  margin-bottom: 15px;
}
</style>
