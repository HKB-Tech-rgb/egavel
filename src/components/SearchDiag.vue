<template>
  <v-row justify="center">
    <v-form>
      <v-card width="600px" style="opacity:0.9" class="ml-2 pl-2">
        <v-card-title justify="center" v-if="optionTaken === 0"
          >Search Cases</v-card-title
        >
        <v-card-title justify="center" v-if="optionTaken === 1"
          >Search Cases by Case#</v-card-title
        >
        <v-card-title justify="center" v-if="optionTaken === 2"
          >Search Cases by Party</v-card-title
        >
        <v-card-title justify="center" v-if="optionTaken === 3"
          >Search Cases by Date</v-card-title
        >
        <v-divider></v-divider>
        <v-select
          v-if="optionTaken === 0"
          class="ml-2 pl-2"
          v-model="selected"
          :items="criteria"
          :counter="20"
          item-text="type"
          item-value="id"
          label="Search Criteria"
        >
        </v-select>
        <v-autocomplete
          class="ml-2 pl-2"
          v-if="optionTaken === 1"
          v-model="caseSelected"
          :items="cases"
          :counter="20"
          item-text="Case"
          item-value="id"
          label="Search on Case#"
        >
        </v-autocomplete>
        <v-autocomplete
          class="ml-2 pl-2"
          v-if="optionTaken === 2"
          v-model="partySelected"
          :items="parties"
          :counter="20"
          item-text="party"
          item-value="id"
          label="Search on Party Name"
        >
        </v-autocomplete>
        <v-row v-if="optionTaken === 3" ml-2 pl-2>
          <v-col cols="10">
            <v-menu
              ref="startMenu"
              v-model="startMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="start"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateFrom"
                  class="mt-3"
                  label="Start Date"
                  prepend-icon="mdi-calendar"
                  dense
                  readonly
                  outlined
                  hide-details
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="dateFrom" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="startMenu = false">
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.startMenu.save(dateFrom)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
            <v-menu
              ref="nowMenu"
              v-model="nowMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="now"
              transition="scale-transition"
              min-width="290px"
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="now"
                  class="mt-3"
                  label="Today"
                  prepend-icon="mdi-calendar"
                  dense
                  readonly
                  outlined
                  hide-details
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="now" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="nowMenu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.nowMenu.save(now)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                dark
                @click="search"
                :disabled="false"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="red">
                  mdi-magnify
                </v-icon>
              </v-btn>
            </template>
            <span>Search</span>
          </v-tooltip>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small dark @click="quit" v-bind="attrs" v-on="on">
                <v-icon color="grey">mdi-exit-to-app</v-icon>
              </v-btn>
            </template>
            <span>Go Home</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      selected: 0,
      caseSelected: 0,
      partySelected: 0,
      dateFrom: null,
      now: null,
      startMenu: false,
      start: "2019-01-12",
      criteria: [
        { id: 1, type: "By Cases" },
        { id: 2, type: "By Party" },
        { id: 3, type: "By Dates " }
      ],
      cases: [
        { id: 1, Case: "Case #1" },
        { id: 2, Case: "Case #2" },
        { id: 3, Case: "Case #4" },
        { id: 4, Case: "Case #6" },
        { id: 5, Case: "Case #8" },
        { id: 6, Case: "Case #12" },
        { id: 7, Case: "Case #13" },
        { id: 8, Case: "Case #14" }
      ],
      parties: [
        { id: 1, party: "Sill Bill Samm" },
        { id: 2, party: "John Steinbeck" },
        { id: 3, party: "John Foo" },
        { id: 4, party: "Calvin Klein" },
        { id: 5, party: "Jeremiah Johnson" },
        { id: 6, party: "Bill Mustard" },
        { id: 7, party: "Yvonne Utter" },
        { id: 8, party: "Tammy Kindle" }
      ],
      searchString: ""
    };
  },
  methods: {
    quit() {
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    search() {
      alert(`Search ${this.searchString} WIP`);
    }
  },
  computed: {
    optionTaken() {
      return this.selected;
    }
  },
  watch: {
    selected: function(val) {
      this.criteria.forEach(search => {
        if (search.id === val) {
          this.searchString = search.type;
        }
      });
    }
  }
};
</script>

<style></style>
