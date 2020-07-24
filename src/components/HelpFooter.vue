<template>
  <div>
    <HelpMsg />
    <v-card style="opacity:0.8">
      <v-footer fixed class="font-weight-medium" padless>
        <v-card flat tile width="100%">
          <v-layout>
            <v-flex lg4 text-lg-left>
              <v-card-text style="display:inline">
                <strong>Email:</strong>sysadmin@egavel.co.za
              </v-card-text>
            </v-flex>
            <v-flex lg4 text-lg-center>
              <v-card-text style="display:inline"> </v-card-text>
            </v-flex>
            <v-flex lg4 text-lg-right>
              <v-card-text style="display:inline">
                <strong>Contact:</strong> 011-5685381
              </v-card-text>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-card-text>
            <v-layout justify-center="">
              <v-flex lg4 text-lg-left>{{ copyLine1 }} </v-flex>
              <v-flex lg3 text-lg-right>{{ copyLine2 }} </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-footer>
    </v-card>
  </div>
</template>
<script>
import HelpMsg from "@/components/HelpMsg";
export default {
  components: {
    HelpMsg
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
      copyLine1: "",
      copyLine2: ""
    };
  },
  created() {
    this.copyLine1 = `Copyright © ${this.currentYear} eGavel (Pty) Ltd. All rights reserved.`;
    this.copyLine2 = `Powered by HKB Technologies - ${this.currentYear}.`;
  }
};
</script>
