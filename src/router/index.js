import Home from "@/components/Home.vue";
import ArbitStart from "@/components/ArbitStart.vue";
import ArbitLogin from "@/components/ArbitLogin.vue";
import Login from "@/components/Login.vue";
import ArbitSignup from "@/components/ArbitSignup.vue";
import Cases from "@/components/CasesAllDevices.vue";
import AddClaimant from "@/components/AddClaimant.vue";
import AddDefendant from "@/components/AddDefendant.vue";
import CreateArbitCase from "@/components/CreateArbitCase.vue";
import CaptureSignature from "@/components/CaptureSignature.vue";
import SearchCase from "@/components/SearchDiag.vue";

import FileUpload from "@/components/FileUpload.vue";
import Wizard from "@/components/Wizard.vue";
import DefWizard from "@/components/Defend/Wizard.vue";
import DefenseWizard from "@/components/defense/Wizard.vue";
import ViewWizard from "@/components/Defend/viewBtns/CaseViewWizard.vue";
import AllCases from "@/components/AllCases.vue";
import AdminView from "@/components/AdminView.vue";
import ComView from "@/components/ComView.vue";

import AllocateCommissioner from "@/components/AllocateCommissioner.vue";
import ResolveWizard from "@/components/commission/Wizard.vue";
import ClaimViewWizard from "@/components/commission/claim-view/Wizard.vue";
import DefViewWizard from "@/components/commission/def-view/Wizard.vue";
import ComDefWizard from "@/components/commission/def-view/def/Wizard.vue";
import CommissionerLanding from "@/components/CommissionerLanding.vue";
import ClaimDefend from "@/components/ClaimDefend.vue";
import CounterClaim from "@/components/counterClaim/Wizard.vue";
import ArbitPartsChoice from "@/components/ArbitPartsChoice.vue";
import AdminTasks from "@/components/AdminTasks.vue";
import userRoles from "@/status-enums/roletypes";
import AddRole from "@/components/AddRole";
import AddCompany from "@/components/AddCompany";
import LiabAlloc from "@/components/LiabAllocView";
import AllocUser from "@/components/AllocUser";
import MultiDefendants from "@/components/multiple/Wizard.vue";
import MultiDefs from "@/components/commission/multidefs/Wizard.vue";
import HelpMsg from "@/components/HelpFooter.vue";
import ContextMenu from "@/components/ContextMenu.vue";
import ChangePass from "@/components/ChangePass.vue";
import ApplyRoles from "@/components/TryDraggable.vue";

const { store } = require("@/store");
const jwtDecode = require("jwt-decode");

const checkAuthentication = (to, from, next) => {
  //console.log('check auth '+ JSON.stringify(to));
  if (store.state.isLoggedin) {
    next();
    return;
  }
  next("/arbitLogin");
};
function assertAlive(decoded) {
  const now = Date.now().valueOf() / 1000;
  if (typeof decoded.exp !== "undefined" && decoded.exp < now) {
    throw new Error(`token expired: ${JSON.stringify(decoded)}`);
  }
  if (typeof decoded.nbf !== "undefined" && decoded.nbf > now) {
    throw new Error(`token not yet valid: ${JSON.stringify(decoded)}`);
  }
}
const checkIfAuthenticated = (to, from, next) => {
  var user = JSON.parse(sessionStorage.getItem("user"));
  var token = sessionStorage.getItem("token");

  if (user) {
    try {
      assertAlive(jwtDecode(token));
    } catch (error) {
      next("/arbitLogin");
    }
    store
      .dispatch("initArbitUser", user)
      .then(() => {
        store
          .dispatch(
            "setUpArbitToken",
            JSON.parse(sessionStorage.getItem("token"))
          )
          .then(() => {
            var arbitToken = store.getters.getArbitToken;
            if (arbitToken) {
              switch (user.role.id) {
                case userRoles.PARTICIPANT:
                  next("/cases");
                  break;
                case userRoles.ADMIN:
                  next("/adminview");
                  break;
                case userRoles.ARBITOR:
                  next("/comview");
                  break;
                case userRoles.COYADMIN:
                  next("/liaballoc");
                  break;
              }
              return;
            }
            next("/arbitLogin");
          });
      })
      .catch(err => {
        throw err;
      });
  } else {
    if (process.env.VUE_APP_ADMIN_REQ === 1) {
      next("/arbitSignup");
    } else {
      next("/arbitLogin");
    }
  }
};

export default [
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/",
    name: "root",
    component: ArbitLogin,
    beforeEnter: checkIfAuthenticated
  },

  //{path: '/', name: 'cases', component: Cases},
  { path: "/upload", name: "upload", component: FileUpload },
  {
    path: "/arbitcases/:isNew",
    name: "arbitcases",
    component: CreateArbitCase
  },
  {
    path: "/arbitcase/:caseId/:isNew",
    name: "arbit-case",
    component: CreateArbitCase,
    beforeEnter: checkAuthentication
  },
  { path: "/home", name: "home", component: Home },
  { path: "/home/:msg", name: "home-params", component: Home },
  {
    path: "/partchoice",
    name: "arbitPartChoice",
    component: ArbitPartsChoice,
    beforeEnter: checkAuthentication
  },
  {
    path: "/start",
    name: "arbitStart",
    component: ArbitStart,
    beforeEnter: checkAuthentication
  },
  { path: "/admin", name: "adminTasks", component: AdminTasks },
  { path: "/arbitSignup", name: "arbiterSignup", component: ArbitSignup },
  { path: "/login", name: "login", component: Login },
  { path: "/arbitLogin", name: "arbitLogin", component: ArbitLogin },
  {
    path: "/arbitLogin/fromhelp",
    name: "arbitLoginHelp",
    component: ArbitLogin,
    beforeEnter: checkAuthentication
  },
  { path: "/arbitLogin/:flag", name: "arbitLoginBar", component: ArbitLogin },
  {
    path: "/claim/create",
    name: "cases-create",
    component: Wizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/claimwiz/create/:claimId/:defendId",
    name: "case-exist",
    component: Wizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/defwiz/create",
    name: "def-create",
    component: DefWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/defwiz/view",
    name: "def-view",
    component: ViewWizard,
    beforeEnter: checkAuthentication
  }, //DefenseWizard
  {
    path: "/defense/:claimId/:defendId",
    name: "defense",
    component: DefenseWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/cClaim",
    name: "cClaim",
    component: CounterClaim,
    beforeEnter: checkAuthentication
  },
  {
    path: "/cClaim/create",
    name: "counterClaim",
    component: CounterClaim,
    beforeEnter: checkAuthentication
  },
  {
    path: "/cases",
    name: "cases",
    component: Cases,
    beforeEnter: checkAuthentication
  },
  {
    path: "/cases/filed/:mailMsg",
    name: "case-filed",
    component: Cases,
    beforeEnter: checkAuthentication
  },
  {
    path: "/cases/:caseId",
    name: "cases-note",
    component: Cases,
    beforeEnter: checkAuthentication
  },
  {
    path: "/claimants/create",
    name: "claimants-create",
    component: AddClaimant,
    beforeEnter: checkAuthentication
  },
  {
    path: "/defendants/create",
    name: "defendants-create",
    component: AddDefendant,
    beforeEnter: checkAuthentication
  },
  { path: "/casesUser/:coyId", name: "cases-coy", component: Cases },
  { path: "/casesUser", name: "cases-userCoy", component: Cases },
  {
    path: "/participants/cd",
    name: "claimdefend",
    component: ClaimDefend,
    beforeEnter: checkAuthentication
  },
  {
    path: "/allocCommissioner/actions",
    name: "all-cases",
    component: AllCases,
    beforeEnter: checkAuthentication
  },
  {
    path: "/allocCommissioner",
    name: "alloc-commissioner",
    component: AllocateCommissioner,
    beforeEnter: checkAuthentication
  },
  {
    path: "/resolveWiz/create/:arbitId/:claimId/:defendId",
    name: "resolve-wiz",
    component: ResolveWizard
  },
  {
    path: "/resolveWiz/create",
    name: "resolve-claim",
    component: ResolveWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/claimWiz",
    name: "com-view-claim",
    component: ClaimViewWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/defviewWiz",
    name: "com-view-def",
    component: DefViewWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/commissioner/actions",
    name: "com-land",
    component: CommissionerLanding,
    beforeEnter: checkAuthentication
  },
  {
    path: "/comdefview",
    name: "comdefview",
    component: ComDefWizard,
    beforeEnter: checkAuthentication
  },
  {
    path: "/adminview",
    name: "adminview",
    component: AdminView,
    beforeEnter: checkAuthentication
  },
  {
    path: "/comview",
    name: "comview",
    component: ComView,
    beforeEnter: checkAuthentication
  },
  {
    path: "/comview/:mailMsg",
    name: "case-resolved",
    component: ComView,
    beforeEnter: checkAuthentication
  },
  {
    path: "/multi",
    name: "multi-defs",
    component: MultiDefendants,
    beforeEnter: checkAuthentication
  },
  {
    path: "/multidefs",
    name: "comm-multi-defs",
    component: MultiDefs,
    beforeEnter: checkAuthentication
  },
  {
    path: "/roles",
    name: "userRole",
    component: AddRole,
    beforeEnter: checkAuthentication
  },
  {
    path: "/coys",
    name: "coys",
    component: AddCompany,
    beforeEnter: checkAuthentication
  },
  {
    path: "/liaballoc",
    name: "liaballoc",
    component: LiabAlloc,
    beforeEnter: checkAuthentication
  },
  {
    path: "/liaballoc/:mailMsg",
    name: "allocted",
    component: LiabAlloc,
    beforeEnter: checkAuthentication
  },
  {
    path: "/allocuser",
    name: "allocuser",
    component: AllocUser,
    beforeEnter: checkAuthentication
  },
  { path: "/help", name: "help", component: HelpMsg },
  { path: "/cmenu", name: "cmenu", component: ContextMenu },
  { path: "/changepass", name: "changepass", component: ChangePass },
  { path: "/sign", name: "sign", component: CaptureSignature },
  { path: "/applyroles", name: "applyRoles", component: ApplyRoles },
  { path: "/search", name: "search", component: SearchCase }
];
