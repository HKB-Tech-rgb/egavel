<template>
  <div id="nodata">
    <div v-if="cases.length < 1 && doLoad">
      <v-layout row wrap>
        <v-flex xs12 md6 lg6>
          <v-card block style="height:80px" @click="show">
            <v-card-subtitle class="headline font-italic"
              >No Data Found</v-card-subtitle
            >
          </v-card>
        </v-flex>
        <v-flex xs12 md6 lg6>
          <v-card block style="height:80px" @click="show">
            <v-card-subtitle class="headline font-italic"
              >No Data Found</v-card-subtitle
            >
          </v-card>
        </v-flex>
      </v-layout>
    </div>
    <v-menu
      v-model="showMenu"
      :position-x="x"
      :position-y="y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-item-group v-model="item" color="primary">
          <v-list-item
            v-for="(item, index) in items"
            :key="index"
            @click="fetch(item)"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title
                v-text="item.title"
                name="lists"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
export default {
  props: {
    doLoad: null,
    cases: {
      type: Array,
      value: []
    },
    items: {
      type: Array,
      value: []
    }
  },
  data: () => {
    return {
      showMenu: false,
      x: 0,
      y: 0,
      item: 1
    };
  },
  methods: {
    fetch(item) {
      this.$emit("change-view", item);
    },
    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;

      this.$nextTick(() => {
        this.showMenu = true;
      });
    }
  }
};
</script>
