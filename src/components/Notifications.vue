<template>
  <v-row align="center" justify="center">
    <v-badge :content="messages" :value="messages" color="red" overlap bordered>
      <v-menu
        transition="slide-y-transition"
        offset-y
        open-on-hover
        :rounded="true"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-hover v-slot:default="{ hover }" open-delay="1400">
            <v-btn
              icon
              class="black"
              text
              small
              color="light-grey"
              v-bind="attrs"
              v-on="on"
              :elevation="hover ? 10 : 0"
            >
              <v-icon small>
                mdi-bell
              </v-icon>
            </v-btn>
          </v-hover>
        </template>
        <v-card width="300px" style="opacity: 0.9;" tile>
          <v-app-bar color="light-blue" dark>
            <v-toolbar-title style="font-size: 24px"
              >Notifications</v-toolbar-title
            >
          </v-app-bar>
          <v-list color="light-grey" :three-line="true">
            <v-list-item v-for="(item, i) in items" :key="i">
              <v-list-item-content>
                <v-list-item-title>
                  <router-link
                    :to="{ name: 'cases-note', params: { caseId: item.case } }"
                  >
                    {{ item.title }}
                  </router-link>
                </v-list-item-title>
                <v-list-item-subtitle v-html="item.from"></v-list-item-subtitle>
                <v-list-item-subtitle v-html="item.to"></v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon small v-on:click="test(item.case)" color="red">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-badge>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    items: [
      {
        case: 11,
        title: "Case# 11 - status change - 22/07",
        from: `From: pending third party response`,
        to: `To: offer to settle`
      },
      {
        case: 16,
        title: "Case# 16 - status change - 22/07",
        from: `From: pending case ruling`,
        to: `To: case resolved`
      },
      {
        case: 19,
        title: "Case# 21 - status change - 22/07",
        from: `From: pending third party response`,
        to: `To: pending case ruling`
      },
      {
        case: 24,
        title: "Case# 24 - status change - 22/07",
        from: `From: pending case ruling`,
        to: `To: case resolved`
      }
    ],
    messages: 0,
    from: "From:",
    To: "To"
  }),
  methods: {
    test(Case) {
      alert(`Delete notification on case: ${Case} WIP`);
    }
  },
  async created() {
    this.messages = this.items.length;
  }
};
</script>
