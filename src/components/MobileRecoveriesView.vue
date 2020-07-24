<template>
    <div>
        <div v-for="Case in cases" :key="Case.id" >
            <v-layout row justify-center>
              <v-flex xs10 md8>
                <v-card
                  style="background-color:#FFF5cd; padding-bottom: 3px"
                  v-if="Case.ArbitCase">
                  <div @click="show" style="padding-bottom: 3px">
                    <div>
                        Reference#: {{ Case.id }}
                        <span>({{ Case.claimStatus }})</span>
                    </div>
                    <div>{{ Case.poc }}</div>
                    <div v-if="Case.multipleDefs>1">3rd Party Companies:
                      <span v-for="def in Case.Defendants" :key="def.id" >
                        <span class="font-italic" 
                          style="color:green">{{def.Company.name}}
                        </span>
                      </span>
                    </div>
                    <div v-else>3rd Party Company:
                      <span v-for="def in Case.Defendants" :key="def.id" >
                        <span 
                          class="font-italic"
                          style="color:green">
                            {{def.Company.name}}
                        </span>
                      </span>
                    </div>
                  </div>
                  <v-btn
                    style="font-size: 12px;color:black"
                    small
                    @click="displayAction({'detail': Case, 'insured':1})"
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
            offset-y>
        <v-list>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item
              v-for="(item, index) in items"
              :key="index"
              @click="fetch(item)">
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
        }
    },
    data: () => {
        return {
            showMenu: false,
            x: 0,
            y: 0,
            item: 1
        }
    },
    methods:{
        fetch(item){
            this.$emit('change-view', item)
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
        displayAction(Case){
          this.$emit('case-details', Case)
        }
    }
}
</script>
