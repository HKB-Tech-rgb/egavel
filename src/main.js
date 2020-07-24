import Vue from "vue";
import App from "./App.vue";
import wb from "./registerServiceWorker";
import { store } from "./store/";
import Storage from "vue-web-storage";
import vuetify from "./plugins/vuetify";
import VueRouter from "vue-router";
import VueRouterBackButton from "vue-router-back-button";
import routes from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTwitter,
  faInstagram,
  faPinterest
} from "@fortawesome/free-brands-svg-icons";
import {
  faCoffee,
  faSpinner,
  faEdit,
  faCircle,
  faCheck,
  faSearch,
  faBars,
  faPlus,
  faEquals,
  faChevronRight,
  faPencilAlt,
  faComment
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faCoffee,
  faSpinner,
  faEdit,
  faCircle,
  faCheck,
  faSearch,
  faPlus,
  faEquals,
  faChevronRight,
  faPencilAlt,
  faComment,
  faBars,
  faTwitter,
  faInstagram,
  faPinterest
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
import VueSignature from "vue-signature-pad";
import "./registerServiceWorker";

Vue.use(VueSignature);
Vue.use(Storage);
Vue.use(VueRouter);
Vue.prototype.$workbox = wb;

const router = new VueRouter({
  mode: "history",
  routes: routes
});
Vue.use(VueRouterBackButton, { router });

Vue.config.productionTip = false;

new Vue({
  router: router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
