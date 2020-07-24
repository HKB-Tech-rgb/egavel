<template>
  <div id="app">
    <v-app>
      <v-container :class="{ 'app-mobile': mobileView, app: !mobileView }">
        <app-header v-if="!mobileView" />
        <div><router-view></router-view></div>
        <v-card
          style="opacity:0.7"
          flat
          tile
          width="100%"
          class=" blue text-center"
          v-if="!arbitUser && !mobileView"
        >
          <v-footer fixed padless>
            <v-card flat tile width="100%" class="text-center">
              <v-row>
                <v-cols cols="12">
                  <v-card-text></v-card-text>
                </v-cols>
              </v-row>
              <v-divider></v-divider>
              <v-card-text>
                <v-layout justify-center>
                  <v-flex lg4 text-lg-left
                    >Copyright © {{ new Date().getFullYear() }} eGavel (Pty)
                    Ltd. All rights reserved.
                  </v-flex>
                  <v-flex lg3 text-lg-right
                    >Powered by HKB Technologies -
                    {{ new Date().getFullYear() }}.</v-flex
                  >
                </v-layout>
              </v-card-text>
            </v-card>
          </v-footer>
        </v-card>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
//import NavigationMobile from '@/components/Navigation-Mobile.vue'

export default {
  name: "app",
  components: {
    "app-header": Header
  },
  data: () => {
    return {
      mobileView: false,
      showNav: false
    };
  },
  methods: {
    handleView() {
      this.mobileView = window.innerWidth <= 990;
      this.$store.dispatch("doMobileDevice", this.mobileView);
    },
    async accept() {
      this.showUpgradeUI = false;
      await this.$workbox.messageSW({ type: "SKIP_WAITING" });
    }
  },
  computed: {
    arbitUser() {
      return this.$store.getters.getArbitUser;
    }
  },
  async created() {
    await this.handleView();
    window.addEventListener("resize", this.handleView);
    if (this.$workbox) {
      this.$workbox.addEventListener("waiting", () => {
        this.showUpgradeUI = true;
      });
    }
  }
};
</script>
<style>
* {
  font-size: 1rem;
  text-transform: none !important;
  font-family: TimesNewRoman, Times New Roman, Times, Baskerville, Georgia,
    serif !important;
}

.container,
.heading,
.v-application {
  color: #fff !important;
}

.v-toolbar__content {
  backdrop-filter: blur(3px) !important;
}

.v-toolbar__content > .v-toolbar__title {
  opacity: 1;
  font-weight: 700 !important;
  -webkit-backdrop-filter: blur(3px) !important;
  /* color: #d6ab29; */
  color: #000;
}
/*
.v-toolbar__content > div.v-toolbar__title:hover {
  font-weight: 500 !important;
} */

.mx-auto > .v-card__title,
.mx-auto > .v-card__text,
.mx-auto > .v-card__actions {
  background-color: transparent !important;
}

.v-application .headline {
  font-family: TimesNewRoman, Times New Roman, Times, Baskerville, Georgia,
    serif !important;
  color: black !important;
}

.spacer > .layout > .flex {
  display: inline-flex !important;
  text-align: center !important;
  border-radius: 0.3rem !important;
}

.flex {
  display: inline !important;
}

.v-card__title > h1 {
  opacity: 1;
  text-align: center !important;
}

.flex .xs12 .md9 .lg10 {
  text-align: center !important;
}

.v-card__title > h1:hover {
  -webkit-transition: opacity 2s ease-in;
  -moz-transition: opacity 2s ease-in;
  -o-transition: opacity 2s ease-in;
  -ms-transition: opacity 2s ease-in;
  transition: opacity 2s ease-in;
}

/*
.v-toolbar__content > div {
  filter: blur(8px);
  -webkit-filter: blur(8px);
}

.v-toolbar__content  {
  filter: none !important;
  -webkit-filter: none !important;
} */

.container > header {
  background-color: transparent !important;
}

div.container--fluid > div {
  border-radius: 0.3rem !important;
  /* background: rgb(255,255,255) !important;
  background: linear-gradient(144deg, rgba(255,255,255,1) 0%, rgba(130,99,76,1) 77%, rgba(130,99,76,1) 100%) !important; */
}

.file-listing {
  border-radius: 1rem !important;
  padding: 2px !important;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
  background-color: #f7edd2 !important;
  margin-left: 300px !important;
  margin-right: 300px !important;
}

div.file-listing > span.remove-file {
  padding-right: 10px !important;
  font-weight: 600 !important;
}

div.flex > h2 {
  display: block !important;
  font-weight: 600 !important;
  color: black !important;
}
.app {
  font-family: TimesNewRoman, Times New Roman, Times, Baskerville, Georgia,
    serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fff !important;
  text-align: center;
  margin-top: 60px;
}

.app-mobile {
  font-family: TimesNewRoman, Times New Roman, Times, Baskerville, Georgia,
    serif !important;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  color: #2c3e50;
  padding-top: 0;
  margin-top: 0;
}

button.v-btn {
  display: inline-block;
  padding: 0.35em 1.2em;
  margin: 0 0.3em 0.3em 0 !important;
  border-radius: 0.12em !important;
  box-sizing: border-box !important;
  text-decoration: none !important;
  font-family: "Times Roman", sans-serif !important;
  border-radius: 1.05rem !important;
  text-align: center !important;
  transition: all 0.2s !important;
  /*text-shadow: 0px 1px #2f2e2e !important;*/
  font-weight: 200 !important;
}

/* background: rgb(255,255,255);
background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(235,144,21,1) 77%, rgba(71,40,3,1) 100%); */

.back-up {
  background: white;
  transition: top ease 1.5s;
  box-shadow: 1px 1px 0.5px 0.5px #6d6969;
  padding: 10px !important;
}

button.v-btn:hover {
  color: #d6ab29 !important;
  background-color: #ffffff !important;
  text-shadow: 1px 0.8px #272727 !important;
  box-shadow: 0px 1px 0px 0px #b7b1b1 !important;
  font-weight: 600 !important;
}

div.v-toolbar__title > button.v-btn {
  background-color: transparent !important;
}

h3.heading {
  font-weight: 900 !important;
  color: #fff !important;
  text-shadow: 1px 0.8px #272727 !important;
}

div.white > header.white > div.mr-4 {
  text-align: center !important;
  color: #d6ab29 !important;
  text-shadow: 1.5px 0.5px #2d2d2d !important;
}

.v-card__title {
  text-align: center !important;
  font-weight: 500 !important;
}

.modal-body {
  text-align: left !important;
  margin: 10px;
  color: black;
}
/* .v-application--wrap {
  background: url('assets/layer-background.jpg');
  background-size: 1500px;
  background-repeat: no-repeat;
  width: 50%;
  height: 50%;
} */

#inspire > .v-application--wrap {
  background-color: transparent !important;
  background: transparent !important;
  background-size: 100% auto;
  background-repeat: no-repeat;
  opacity: 0.8 !important;
  padding-top: 1rem;
}
#nodata {
  opacity: 0.8 !important;
}
.theme--light.v-application {
  background: transparent !important;
  color: rgba(0, 0, 0, 0.87) !important;
}

/* .v-btn__content {
  border: 2px solid #949292 !important;
} */

.footer,
.footer > .theme--light.v-card,
.footer > .theme--light.v-sheet {
  background-color: transparent !important;
}

div.v-card > span {
  padding-right: 40px !important;
}

div.flx > div.v-card {
  background-color: #a54a19;
}
/*
.flex > .v-card {
  opacity: 0.98;
}*/
div.footer {
  margin-top: 20px !important;
  margin-bottom: 20px !important;
}

div.footer > div > div.justify-center > button.v-btn {
  margin-top: 10px !important;
  margin-bottom: 10px !important;
}
/*
div > button.v-btn {
  background-color: #d2984c !important;
  color: #fff !important;
}
.btnList {
  background-color: brown !important;
  color: #fff !important;
}*/
.flex {
  text-align: center !important;
}
.elecation-4 {
  border-radius: 0.3rem !important;
  background-color: rgb(155, 154, 170);
  opacity: 0.8;
}

.elecation-4:hover {
  z-index: 1.2 !important;
  transition: top ease 1.5s;
  box-shadow: 1px 1px 0.5px 0.5px #6d6969;
}

.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: dotted !important;
}

.mdi {
  color: #6eaecc !important;
}

.v-messages__message,
div > .v-counter {
  font-size: 9px !important;
}

.v-input__control {
  padding-bottom: 20px !important;
}

/*==== modal ====*/
.modal-header {
  font-size: 21px !important;
  padding: 15px !important;
}

.btn-green {
  background-color: #58c55c !important;
  color: #fff !important;
  padding: 10px !important;
  margin: 7px !important;
  border-radius: 5px !important;
}
/*=== buttons ===*/
.justify-space-around {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>
