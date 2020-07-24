<template>
    <div>
        <div v-for="Case in cases" :key="Case.id" >
            <v-layout row justify-center>
                <v-flex xs10 md8 lg6>
                  <v-card style="background-color:#BFEFFF;padding-bottom: 3px"
                     v-if="Case.cd">
                    <div  @click="show" style="padding-bottom: 3px">
                      <div>
                        Reference#: {{ Case.ArbitCaseId }}
                        <span>({{ Case.defendStatus }})</span>
                      </div>
                      <div>{{ Case.defendPoc }}</div>
                      <div>{{ insured }} <span class="font-italic" 
                         style="color:green">{{ Case.claimName }}</span>
                      </div>
                    </div>
                    <v-btn
                      style="font-size: 12px;color:black;"
                      small
                      @click="displayAction({'detail': Case.cd, 'insured':0})"
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
        doLoad: null,
        cases: {
          type: Array,
          value: []
        },
        items: {
          type: Array,
          value: []
        },
        insured : {
          type: String,
          value: ''
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
