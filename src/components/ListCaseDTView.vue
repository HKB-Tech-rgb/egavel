<template>
  <div>
    <div v-for="Case in cases" :key="Case.id">
      <v-layout row wrap>
        <v-flex xs12 md6 lg6>
          <v-card
            style="padding-bottom: 3px"
            class="grey lighten-2"
            v-if="Case.ArbitCase"
          >
            <div @click="show" style="padding-bottom: 3px">
              <div style="color:black !important">
                Reference#: {{ Case.id }}
                <span>({{ Case.claimStatus }})</span>
              </div>
              <div style="color:black !important">{{ Case.poc }}</div>
              <div v-if="Case.multipleDefs > 1">
                3rd Party Companies:
                <span v-for="def in Case.Defendants" :key="def.id">
                  <span
                    class="font-italic"
                    style="color:black !important; font-weight:600 !important"
                    >{{ def.Company.name }}
                  </span>
                </span>
              </div>
              <div v-else>
                3rd Party Company:
                <span v-for="def in Case.Defendants" :key="def.id">
                  <span
                    class="font-italic"
                    style="color:black !important; font-weight:600 !important"
                  >
                    {{ def.Company.name }}
                  </span>
                </span>
              </div>
            </div>
            <v-btn
              class="btnList"
              style="font-size: 12px;color:black"
              small
              @click="displayAction({ detail: Case, insured: 1 })"
              >view/edit/action
            </v-btn>
          </v-card>
        </v-flex>
        <v-flex xs12 md6 lg6>
          <v-card
            style="padding-bottom: 3px"
            class="blue-grey lighten-4"
            v-if="Case.cd"
          >
            <div @click="show" style="padding-bottom: 3px">
              <div>
                Reference#: {{ Case.ArbitCaseId }}
                <span>({{ Case.defendStatus }})</span>
              </div>
              <div>{{ Case.defendPoc }}</div>
              <div>
                {{ insured }}
                <span
                  class="font-italic"
                  style="color:black !important; font-weight:600 !important"
                  >{{ Case.claimName }}</span
                >
              </div>
            </div>
            <v-btn
              class="btnList"
              style="font-size: 12px;color:black"
              small
              @click="displayAction({ detail: Case.cd, insured: 0 })"
              >view/edit/action
            </v-btn>
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
    cases: {
      type: Array,
      value: []
    },
    items: {
      type: Array,
      value: []
    },
    insured: {
      type: String,
      value: ""
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
    },
    displayAction(Case) {
      this.$emit("case-details", Case);
    }
  }
};
</script>
