<template>
  <v-layout class="ma-0 pa-0">
    <v-flex xs4,>
      <v-card-title style="color:black"
        >Send message to administrator</v-card-title
      >
      <v-card-text class="pt-0 mt-0">
        <v-form v-model="valid" lazy-validation ref="form">
          <v-combobox
            v-model="selected"
            :items="items"
            label="Select user email address"
            :rules="emailRules"
            class="ma-0 pa-0"
          ></v-combobox>
          <v-text-field
            v-model="helpMsg.subject"
            label="Subject of Email"
            :rules="required"
            class="ma-0 pa-0"
          >
          </v-text-field>
          <v-textarea
            :readonly="readOnly"
            name="helpMsg"
            filled
            label="Message  *required"
            ref="helpMsg"
            v-model="helpMsg.message"
            auto-grow
            :rules="required"
            class="ma-0 pa-0"
          >
          </v-textarea>
          <v-card-actions class="ma-0 pa-0">
            <v-btn color="indigo" dark @click="create">Send</v-btn>
            <!--<v-btn color="indigo" dark @click="reset">Clear</v-btn>-->
            <v-btn color="indigo" dark @click="quit">exit</v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-flex>
    <!--
    <div class="footer">
      <v-card height="60px">
        <v-layout align-start justify-center>
          <span style="color:black"
            >Email: sysadmin@egavel.co.za
            <span style="color:blue">Contact:0115685381 option: 1</span></span
          >
        </v-layout>
      </v-card>
    </div>-->
  </v-layout>
</template>
<script>
//import Panel from "@/components/Panel";
//import HelpFooter from "@/components/HelpFooter";
export default {
  data() {
    return {
      helpMsg: {
        id: 0,
        msgFrom: "",
        subject: "",
        msgTo: process.env.VUE_APP_INBOX,
        message: "",
        dateSent: null
      },
      items: [],
      selected: "",
      readOnly: false,
      valid: "",
      required: [v => !!v || "This field is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  components: {},
  methods: {
    async create() {
      if (this.$refs.form.validate()) {
        try {
          await this.sendEmail(await this.createMsg(this.helpMsg));
        } catch (error) {
          //console.log(error);
        }
      }
    },
    createMsg(helpMsg) {
      const msg = {
        to: helpMsg.msgTo,
        from: helpMsg.msgFrom,
        subject: helpMsg.subject,
        text: helpMsg.message
      };
      return msg;
    },
    quit() {
      this.$router.push({
        path: this.$routerHistory.previous().path
      });
    },
    reset() {
      this.$refs.form.reset();
    },
    async loadItems() {
      if (await this.$store.getters.getArbitUser) {
        await this.items.push(this.$store.getters.getArbitUser.email);
      }
    },
    async sendEmail(msg) {
      this.$store.dispatch("sendEmail", msg).then(
        () => {
          this.$router.push({
            name: "case-filed",
            params: {
              mailMsg: "Email successfully sent to Admin"
            }
          });
        },
        () => {
          //console.log('Message not sent '+ error);
        }
      );
    }
  },
  watch: {
    selected: function(val) {
      this.helpMsg.msgFrom = val;
    }
  },
  async created() {
    this.helpMsg.dateSent = new Date()
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "/");
    await this.loadItems();
    await this.$store.dispatch("doHelpActive", true);
  },
  async beforeDestroy() {
    await this.$store.dispatch("doHelpActive", false);
  }
};
</script>
<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: red;
  color: white;
  text-align: center;
}
</style>
