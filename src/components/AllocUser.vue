<template>
  <v-layout>
    <v-flex xs4,>
      <Panel title="Allocate Users to Liabilities    Case#: "
        >{{ caseId }}
        <v-card-text>
          <v-form v-model="valid" lazy-validation ref="form">
            <v-select
              prepend-icon="mdi-account-circle"
              item-text="name"
              item-value="val"
              v-model="selectUser"
              :items="users"
              :readonly="readOnly"
              label="Select an available user"
            ></v-select>
            <v-text-field
              prepend-icon="mdi-account-circle"
              v-model="fullname"
              label="User name"
              :rules="required"
            >
            </v-text-field>
            <v-card-actions>
              <v-btn color="indigo" dark @click="update">Update</v-btn>
              <v-btn color="indigo" dark @click="navigateTo">Exit</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </Panel>
    </v-flex>
  </v-layout>
</template>
<script>
import Panel from "@/components/Panel";
export default {
  data() {
    return {
      arbitUser: {
        id: 0,
        firstname: "",
        lastname: ""
      },
      defendant: {
        id: 0,
        ArbitUserId: 0,
        ArbitCaseId: 0
      },
      users: [],
      selectUser: "",
      caseId: 0,
      readOnly: false,
      valid: "",
      fullname: "",
      required: [v => !!v || "This field is required"],
      link: process.env.VUE_APP_URL,
      inbox: process.env.VUE_APP_INBOX
    };
  },
  components: {
    Panel
  },
  methods: {
    async sendEmail(msg) {
      await this.$store.dispatch("sendEmail", msg);
    },
    async update() {
      try {
        if (this.$refs.form.validate()) {
          try {
            this.$store.dispatch("updateDefendant", this.defendant).then(
              () => {
                const msg = {
                  to: this.arbitUser.email,
                  from: this.inbox,
                  subject: `Allocation of Defense of claim reference #${this.defendant.ArbitCaseId}`,
                  text: ` ${this.arbitUser.firstname} ${this.arbitUser.lastname} will be responsible for defending the above claim\nClick on the link: ${this.link}`
                };
                this.sendEmail(msg);

                this.$router.push({
                  name: "allocted",
                  params: {
                    mailMsg: "Allocated and mail sent"
                  }
                });
              },
              error => {
                console.log("User not Allocated " + error);
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (err) {
        console.log("Error while creating new Case " + err);
      }
    },
    navigateTo() {
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    }
  },
  watch: {
    selectUser: async function(val) {
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].val == val) {
          this.fullname = this.users[i].name;
          this.defendant.ArbitUserId = this.users[i].val;
          await this.$store.dispatch("findAllocUser", `/arbitusers/${val}`);
        }
      }
      this.arbitUser = await this.$store.getters.getAllocUser;
    }
  },
  async created() {
    var coyId = this.$store.getters.getArbitUser.CompanyId;
    var url = `arbitusers/coy/${coyId}`;

    await this.$store.dispatch("findCoyUsers", url).then(users => {
      users.forEach(user => {
        this.users.push({
          name: user.firstname + " " + user.lastname,
          val: user.id,
          rec: user
        });
      });
    });
    var Case = this.$store.getters.getCase;
    if (Case) {
      this.caseId = Case.id;
    }
    var defend = this.$store.getters.getDefendant;
    if (defend) {
      this.defendant.id = defend.id;
      this.defendant.ArbitCaseId = defend.ArbitCaseId;
    }
  }
};
</script>
<style scoped></style>
