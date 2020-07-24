import Vue from "vue";
import Vuex from "vuex";
import Api from "@/services/Api";
import caseModels from "@/status-enums/tables.js";
//import CaseStatus from "@/status-enums/caseStatus";

Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true,
  state: {
    token: null,
    arbitToken: null,
    arbitAllocs: [],
    arbitAlloc: null,
    allocUser: null,
    insCoy: null,
    insCoys: [],
    user: null,
    users: [],
    userRoles: [],
    dndRoles: [],
    userRole: null,
    arbitUser: null,
    arbitUsers: [],
    isLoggedin: false,
    isFormValid: false,
    outWizard: true,
    cases: null,
    arbitCase: null,
    claimant: null,
    claimants: [],
    defendant: null,
    defendants: [],
    coDefendant: null,
    coDefendants: [],
    defInt: 1,
    pocs: [],
    poc: null,
    resolution: null,
    resolutions: [],
    resolutionId: 0,
    resolutionFiles: [],
    newResolution: false,
    resolutionUpdated: false,
    resolutionValid: false,
    filesUploded: false,
    step: 0,
    coa: null,
    coas: [],
    coaId: 0,
    coaFiles: null,
    reliefSought: null,
    reliefSoughtFiles: [],
    reliefSoughts: [],
    lociFiles: [],
    loci: null,
    locis: [],
    lociId: 0,
    lociFile: null,
    otherDocs: null,
    claimantValid: false,
    defendantValid: false,
    btnColorInvalid: false,
    coaValid: false,
    reliefSoughtValid: false,
    lociStandiValid: false,
    defendCase: null,
    defendCases: [],
    merits: [],
    merit: null,
    meritFiles: [],
    meritsValid: false,
    meritId: 0,
    email: "",
    emails: "",
    media: "",
    caseId: 0,
    reliefSoughtId: 0,
    claimantId: 0,
    defendantId: 0,
    claimantCaseValid: false,
    currentUploadedFiles: [],
    filesDeleted: 0,
    defense: null,
    defenses: [],
    defenseFiles: [],
    newDefense: false,
    defenseUpdated: false,
    lociStandiDef: null,
    lociStandiDefs: [],
    lociStandiDefFiles: [],
    lociStandiDefUpdated: false,
    lociStandiDefValid: false,
    newLociStandiDef: false,
    lociStandiDefId: 0,
    ccCoa: null,
    ccCoas: [],
    ccCoaFiles: [],
    ccCoaUpdated: false,
    ccCoaValid: false,
    newccCoa: false,
    ccCoaId: 0,
    ccMerit: null,
    ccMerits: [],
    ccMeritFiles: [],
    ccMeritUpdated: false,
    ccMeritValid: false,
    newccMerit: false,
    ccMeritId: 0,
    ccQuanta: null,
    ccQuantas: [],
    ccQuantaFiles: [],
    ccQuantaUpdated: false,
    ccQuantaValid: false,
    newccQuanta: false,
    ccQuantaId: 0,
    ccRelief: null,
    ccReliefs: [],
    ccReliefFiles: [],
    ccReliefUpdated: false,
    ccReliefValid: false,
    newccRelief: false,
    ccReliefId: 0,
    defenseValid: false,
    defenseId: 0,
    claimProcValid: false,
    defendProcValid: false,
    quanta: null,
    quantaFiles: [],
    quantaValid: false,
    quantaId: 0,
    quantas: [],
    newClaimant: false,
    claimantUpdated: false,
    newDefendant: false,
    defendantUpdated: false,
    claimDefends: [],
    participantAction: "",
    newCoa: false,
    coaUpdated: false,
    newLoci: false,
    lociValid: false,
    lociUpdated: false,
    newMerit: false,
    meritUpdated: false,
    newRelief: false,
    reliefUpdated: false,
    newQuanta: false,
    quantaUpdated: false,
    newCase: false,
    caseUpdated: false,
    jurisdictions: [],
    settle: null,
    settles: [],
    settleFiles: [],
    settleValid: false,
    newSettle: false,
    settleUpdated: false,
    settleId: 0,
    counterClaim: null,
    counterClaims: [],
    processCounterClaim: false,
    counterClaimId: 0,
    newCounterClaim: false,
    counterClaimUpdated: false,
    coDefStep: 0,
    coDefendant1Valid: false,
    coDefendant2Valid: false,
    coDefendant3Valid: false,
    coDefendant4Valid: false,
    coDefendant5Valid: false,
    coDefFlags: [],
    multiAccident: false,
    helpActive: false,
    resolved: false,
    viewStatus: 0,
    caseValid: false,
    textLength: 0,
    validates: [],
    dialogData: {},
    max: process.env.VUE_APP_MAXTXT_LENGTH,
    min: process.env.VUE_APP_MINTXT_LENGTH,
    txtLen: 0,
    lenErr: false,
    descClaim: [],
    inconsistencyObj: {},
    claimValues: [],
    mobileDevice: false,
    roleId: 0,
    roleDesc: "",
    roleCount: 0
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getUsers: state => {
      return state.users;
    },
    getCases: state => {
      return state.cases;
    },
    getClaimants: state => {
      return state.claimants;
    },
    getClaimant: state => {
      return state.claimant;
    },
    getDefendants: state => {
      return state.defendants;
    },
    getDefendant: state => {
      return state.defendant;
    },
    getCoDefendants: state => {
      return state.coDefendants;
    },
    getCoDefendant: state => {
      return state.coDefendant;
    },
    getCaseId: state => {
      return state.caseId;
    },
    getCase: state => {
      return state.arbitCase;
    },
    getArbitUser: state => {
      return state.arbitUser;
    },
    getArbitUsers: state => {
      return state.arbitUsers;
    },
    getArbitToken: state => {
      return state.arbitToken;
    },
    getResolution: state => {
      return state.resolution;
    },
    getResolutions: state => {
      return state.resolutions;
    },
    getResolutionId: state => {
      return state.resolutionId;
    },
    getResolutionFiles: state => {
      return state.resolutionFiles;
    },
    isResolutionValid: state => {
      return state.resolutionValid;
    },
    isResolutionUpdated: state => {
      return state.resolutionUpdated;
    },
    isNewResolution: state => {
      return state.newResolution;
    },
    getStep: state => {
      return state.step;
    },
    isLoggedOn: state => {
      return state.isLoggedin;
    },
    notInWizard: state => {
      return state.outWizard;
    },
    getIsFormValid: state => {
      return state.isFormValid;
    },
    getCoa: state => {
      return state.coa;
    },
    getCoas: state => {
      return state.coas;
    },
    getCoaId: state => {
      return state.coaId;
    },
    getCoaFiles: state => {
      return state.coaFiles;
    },
    getReliefSought: state => {
      return state.reliefSought;
    },
    getReliefSoughts: state => {
      return state.reliefSoughts;
    },
    getReliefSoughtId: state => {
      return state.reliefSoughtId;
    },
    getReliefSoughtFiles: state => {
      return state.reliefSoughtFiles;
    },
    getOtherDocs: state => {
      return state.otherDocs;
    },
    isClaimantValid: state => {
      return state.claimantValid;
    },
    isClaimantCaseValid: state => {
      return state.claimantCaseValid;
    },
    isDefendantValid: state => {
      return state.defendantValid;
    },
    isBtnColorInvalid: state => {
      return state.btnColorInvalid;
    },
    isCoaValid: state => {
      return state.coaValid;
    },
    isReliefSoughtValid: state => {
      return state.reliefSoughtValid;
    },
    isLociStandiValid: state => {
      return state.lociStandiValid;
    },
    getLoci: state => {
      return state.loci;
    },
    getLocis: state => {
      return state.locis;
    },
    getLociId: state => {
      return state.lociId;
    },
    getLociFiles: state => {
      return state.lociFiles;
    },
    getLociFile: state => {
      return state.lociFile;
    },
    isNewLoci: state => {
      return state.newLoci;
    },
    isLociUpdated: state => {
      return state.lociUpdated;
    },
    getMerits: state => {
      return state.merits;
    },
    getMerit: state => {
      return state.merit;
    },
    getMeritId: state => {
      return state.meritId;
    },
    getMeritFiles: state => {
      return state.meritFiles;
    },
    isMeritsValid: state => {
      return state.meritsValid;
    },
    getEmails: state => {
      return state.emails;
    },
    getEmail: state => {
      return state.email;
    },
    getMedia: state => {
      return state.media;
    },
    getInsCoy: state => {
      return state.insCoy;
    },
    getInsCoys: state => {
      return state.insCoys;
    },
    getClaimantId: state => {
      return state.claimantId;
    },
    getDefendantId: state => {
      return state.defendantId;
    },
    getCurrentUploadedFiles: state => {
      return state.currentUploadedFiles;
    },
    getFilesDeleted: state => {
      return state.filesDeleted;
    },
    getDefense: state => {
      return state.defense;
    },
    getDefenses: state => {
      return state.defenses;
    },
    getDefenseFiles: state => {
      return state.defenseFiles;
    },
    isNewDefense: state => {
      return state.newDefense;
    },
    isDefenseUpdated: state => {
      return state.defenseUpdated;
    },
    getLociStandiDef: state => {
      return state.lociStandiDef;
    },
    getLociStandiDefs: state => {
      return state.lociStandiDefs;
    },
    getLociStandiDefFiles: state => {
      return state.lociStandiDefFiles;
    },
    isLociStandiDefValid: state => {
      return state.lociStandiDefValid;
    },
    isNewLociStandiDef: state => {
      return state.newLociStandiDef;
    },
    isLociStandiDefUpdated: state => {
      return state.lociStandiDefUpdated;
    },
    getLociStandiDefId: state => {
      return state.lociStandiDefId;
    },
    getCcCoa: state => {
      return state.ccCoa;
    },
    getCcCoas: state => {
      return state.ccCoas;
    },
    getCcCoaFiles: state => {
      return state.ccCoaFiles;
    },
    isCcCoaValid: state => {
      return state.ccCoaValid;
    },
    isCcCoaUpdated: state => {
      return state.ccCoaUpdated;
    },
    isNewccCoa: state => {
      return state.newccCoa;
    },
    getCcCoaId: state => {
      return state.ccCoaId;
    },
    getCcMerit: state => {
      return state.ccMerit;
    },
    getCcMerits: state => {
      return state.ccMerits;
    },
    getCcMeritFiles: state => {
      return state.ccMeritFiles;
    },
    isCcMeritValid: state => {
      return state.ccMeritValid;
    },
    isCcMeritUpdated: state => {
      return state.ccMeritUpdated;
    },
    isNewccMerit: state => {
      return state.newccMerit;
    },
    getCcMeritId: state => {
      return state.ccMeritId;
    },
    getCcQuanta: state => {
      return state.ccQuanta;
    },
    getCcQuantas: state => {
      return state.ccQuantas;
    },
    getCcQuantaFiles: state => {
      return state.ccQuantaFiles;
    },
    isCcQuantaValid: state => {
      return state.ccQuantaValid;
    },
    isNewccQuanta: state => {
      return state.newccQuanta;
    },
    isCcQuantaUpdated: state => {
      return state.ccQuantaUpdated;
    },
    getCcQuantaId: state => {
      return state.ccQuantaId;
    },
    getCcRelief: state => {
      return state.ccRelief;
    },
    getCcReliefs: state => {
      return state.ccReliefs;
    },
    getCcReliefFiles: state => {
      return state.ccReliefFiles;
    },
    isCcReliefValid: state => {
      return state.ccReliefValid;
    },
    isNewccRelief: state => {
      return state.newccRelief;
    },
    isCcReliefUpdated: state => {
      return state.ccReliefUpdated;
    },
    getCcReliefId: state => {
      return state.ccReliefId;
    },
    isDefenseValid: state => {
      return state.defenseValid;
    },
    getDefenseId: state => {
      return state.defenseId;
    },
    isClaimProcValid: state => {
      return state.claimProcValid;
    },
    isDefendProcValid: state => {
      return state.defendProcValid;
    },
    getQuanta: state => {
      return state.quanta;
    },
    getQuantaFiles: state => {
      return state.quantaFiles;
    },
    getQuantas: state => {
      return state.quantas;
    },
    isQuantaValid: state => {
      return state.quantaValid;
    },
    getQuantaId: state => {
      return state.quantaId;
    },
    isNewClaimant: state => {
      return state.newClaimant;
    },
    isClaimantUpdated: state => {
      return state.claimantUpdated;
    },
    isNewDefendant: state => {
      return state.newDefendant;
    },
    isDefendantUpdated: state => {
      return state.defendantUpdated;
    },
    getClaimDefends: state => {
      return state.claimDefends;
    },
    getParticipantAction: state => {
      return state.participantAction;
    },
    isNewCoa: state => {
      return state.newCoa;
    },
    isCoaUpdated: state => {
      return state.coaUpdated;
    },
    isNewMerit: state => {
      return state.newMerit;
    },
    isMeritUpdated: state => {
      return state.meritUpdated;
    },
    isNewRelief: state => {
      return state.newRelief;
    },
    isReliefUpdated: state => {
      return state.reliefUpdated;
    },
    isNewQuanta: state => {
      return state.newQuanta;
    },
    isQuantaUpdated: state => {
      return state.quantaUpdated;
    },
    isNewCase: state => {
      return state.newCase;
    },
    isCaseUpdated: state => {
      return state.caseUpdated;
    },
    getJurisdictions: state => {
      return state.jurisdictions;
    },
    getSettle: state => {
      return state.settle;
    },
    getSettles: state => {
      return state.settles;
    },
    getSettleFiles: state => {
      return state.settleFiles;
    },
    getSettleId: state => {
      return state.settleId;
    },
    isSettleValid: state => {
      return state.settleValid;
    },
    isNewSettle: state => {
      return state.newSettle;
    },
    isSettleUpdated: state => {
      return state.settleUpdated;
    },
    getCounterClaim: state => {
      return state.counterClaim;
    },
    getCounterClaims: state => {
      return state.counterClaims;
    },
    isProcessCounterClaim: state => {
      return state.processCounterClaim;
    },
    getCounterClaimId: state => {
      return state.counterClaimId;
    },
    isNewCounterClaim: state => {
      return state.newCounterClaim;
    },
    isCounterClaimUpdated: state => {
      return state.counterClaimUpdated;
    },
    getUserRoles: state => {
      return state.userRoles;
    },
    getDndRoles: state => {
      return state.dndRoles;
    },
    getUserRole: state => {
      return state.userRole;
    },
    getArbitAllocs: state => {
      return state.arbitAllocs;
    },
    getArbitAlloc: state => {
      return state.arbitAlloc;
    },
    getAllocUser: state => {
      return state.allocUser;
    },
    getPocs: state => {
      return state.pocs;
    },
    getPoc: state => {
      return state.poc;
    },
    getDefendCase: state => {
      return state.defendCase;
    },
    getDefendCases: state => {
      return state.defendCases;
    },
    getCoDefStep: state => {
      return state.coDefStep;
    },
    isCoDefendant1Valid: state => {
      return state.coDefendant1Valid;
    },
    isCoDefendant2Valid: state => {
      return state.coDefendant2Valid;
    },
    isCoDefendant3Valid: state => {
      return state.coDefendant3Valid;
    },
    isCoDefendant4Valid: state => {
      return state.coDefendant4Valid;
    },
    isCoDefendant5Valid: state => {
      return state.coDefendant5Valid;
    },
    getCoDefFlags: state => {
      return state.coDefFlags;
    },
    isMultiAccident: state => {
      return state.multiAccident;
    },
    isHelpActive: state => {
      return state.helpActive;
    },
    getViewStatus: state => {
      return state.viewStatus;
    },
    isCaseValid: state => {
      return state.caseValid;
    },
    getTextLength: state => {
      return state.textLength;
    },
    getDialogData: state => {
      return state.dialogData;
    },
    getMax: state => {
      return state.max;
    },
    getMin: state => {
      return state.min;
    },
    getTxtLen: state => {
      return state.txtLen;
    },
    isTxtErr: state => {
      return state.txtErr;
    },
    getValidates: state => {
      return state.validates;
    },
    getClaimValues: state => {
      return state.claimValues;
    },
    isMobileDevice: state => {
      return state.mobileDevice;
    },
    getRoleId: state => {
      return state.roleId;
    },
    getRoleDesc: state => {
      return state.roleDesc;
    },
    getRoleCount: state => {
      return state.roleCount;
    }
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      state.isLoggedin = this.state.token ? true : false;
    },
    setArbitToken(state, arbitToken) {
      state.arbitToken = arbitToken;
      state.isLoggedin = this.state.arbitToken ? true : false;
    },
    setUsers(state, users) {
      state.users = users;
    },
    setUser(state, user) {
      state.user = user;
    },
    setUserRoles(state, userRoles) {
      state.userRoles = userRoles;
    },
    setDndRoles(state, dndRoles) {
      state.dndRoles = dndRoles;
    },
    setUserRole(state, userRole) {
      state.userRole = userRole;
    },
    setClaimants(state, claimants) {
      state.claimants = claimants;
    },
    setClaimant(state, claimant) {
      state.claimant = claimant;
    },
    setDefendants(state, defendants) {
      state.defendants = defendants;
    },
    setDefendant(state, defendant) {
      state.defendant = defendant;
    },
    setCoDefendants(state, coDefendants) {
      state.coDefendants = coDefendants;
    },
    setCoDefendant(state, coDefendant) {
      state.coDefendant = coDefendant;
    },
    setArbitUser(state, arbitUser) {
      state.arbitUser = arbitUser;
    },
    setArbitUsers(state, arbitUsers) {
      state.arbitUsers = arbitUsers;
    },
    setResolution(state, resolution) {
      state.resolution = resolution;
    },
    setResolutions(state, resolutions) {
      state.resolutions = resolutions;
    },
    setResolutionId(state, resolutionId) {
      state.resolutionId = resolutionId;
    },
    setResolutionFiles(state, resolutionFiles) {
      state.resolutionFiles = resolutionFiles;
    },
    setResolutionValid(state, resolutionValid) {
      state.resolutionValid = resolutionValid;
    },
    setResolutionUpdated(state, resolutionUpdated) {
      state.resolutionUpdated = resolutionUpdated;
    },
    setNewResolution(state, newResolution) {
      state.newResolution = newResolution;
    },
    setInsCoy(state, insCoy) {
      state.insCoy = insCoy;
    },
    setInsCoys(state, insCoys) {
      state.insCoys = insCoys;
    },
    setAllCases(state, cases) {
      state.cases = cases;
    },
    setCase(state, arbitCase) {
      state.arbitCase = arbitCase;
    },
    setCaseId(state, caseId) {
      state.caseId = caseId;
    },
    setStep(state, step) {
      state.step = step;
    },
    setNotInWizard(state, notInwizard) {
      state.outWizard = notInwizard;
    },
    setIsFormValid(state, isFormValid) {
      state.isFormValid = isFormValid;
    },
    setCoa(state, coa) {
      state.coa = coa;
    },
    setCoas(state, coas) {
      state.coas = coas;
    },
    setCoaId(state, coaId) {
      state.coaId = coaId;
    },
    setCoaFiles(state, coaFiles) {
      state.coaFiles = coaFiles;
    },
    setReliefSought(state, reliefSought) {
      state.reliefSought = reliefSought;
    },
    setReliefSoughtId(state, reliefSoughtId) {
      state.reliefSoughtId = reliefSoughtId;
    },
    setReliefSoughts(state, reliefSoughts) {
      state.reliefSoughts = reliefSoughts;
    },
    setReliefSoughtFiles(state, reliefSoughtFiles) {
      state.reliefSoughtFiles = reliefSoughtFiles;
    },
    setOtherDocs(state, otherDocs) {
      state.otherDocs = otherDocs;
    },
    setClaimantValid(state, claimantValid) {
      state.claimantValid = claimantValid;
    },
    setClaimantCaseValid(state, claimantCaseValid) {
      state.claimantCaseValid = claimantCaseValid;
    },
    setDefendantValid(state, defendantValid) {
      state.defendantValid = defendantValid;
    },
    setBtnColorInvalid(state, btnColorInvalid) {
      state.btnColorInvalid = btnColorInvalid;
    },
    setCoaValid(state, coaValid) {
      state.coaValid = coaValid;
    },
    setReliefSoughtValid(state, reliefSoughtValid) {
      state.reliefSoughtValid = reliefSoughtValid;
    },
    setLociStandiValid(state, lociStandiValid) {
      state.lociStandiValid = lociStandiValid;
    },
    setLoci(state, loci) {
      state.loci = loci;
    },
    setLociFiles(state, lociFiles) {
      state.lociFiles = lociFiles;
    },
    setLociFile(state, lociFile) {
      state.lociFile = lociFile;
    },
    setLocis(state, locis) {
      state.locis = locis;
    },
    setLociId(state, lociId) {
      state.lociId = lociId;
    },
    setNewLoci(state, newLoci) {
      state.newLoci = newLoci;
    },
    setLociUpdated(state, lociUpdated) {
      state.lociUpdated = lociUpdated;
    },
    setMerits(state, merits) {
      state.merits = merits;
    },
    setMerit(state, merit) {
      state.merit = merit;
    },
    setMeritId(state, meritId) {
      state.meritId = meritId;
    },
    setMeritFiles(state, meritFiles) {
      state.meritFiles = meritFiles;
    },
    setMeritsValid(state, meritsValid) {
      state.meritsValid = meritsValid;
    },
    setEmails(state, emails) {
      state.emails = emails;
    },
    setEmail(state, email) {
      state.e_mail = email;
    },
    setMedia(state, media) {
      state.media = media;
    },
    setClaimantId(state, claimantId) {
      state.claimantId = claimantId;
    },
    setDefendantId(state, defendantId) {
      state.defendantId = defendantId;
    },
    setCurrentUploadedFiles(state, currentUploadedFiles) {
      state.currentUploadedFiles = currentUploadedFiles;
    },
    setFilesDeleted(state, filesDeleted) {
      state.filesDeleted = filesDeleted;
    },
    setDefense(state, defense) {
      state.defense = defense;
    },
    setDefenses(state, defenses) {
      state.defenses = defenses;
    },
    setDefenseFiles(state, defenseFiles) {
      state.defenseFiles = defenseFiles;
    },
    setDefenseId(state, defenseId) {
      state.defenseId = defenseId;
    },
    setNewDefense(state, newDefense) {
      state.newDefense = newDefense;
    },
    setDefenseUpdated(state, defenseUpdated) {
      state.defenseUpdated = defenseUpdated;
    },
    setDefenseValid(state, defenseValid) {
      state.defenseValid = defenseValid;
    },
    setLociStandiDef(state, lociStandiDef) {
      state.lociStandiDef = lociStandiDef;
    },
    setLociStandiDefs(state, lociStandiDefs) {
      state.lociStandiDefs = lociStandiDefs;
    },
    setLociStandiDefFiles(state, lociStandiDefFiles) {
      state.lociStandiDefFiles = lociStandiDefFiles;
    },
    setNewLociStandiDef(state, newLociStandiDef) {
      state.newLociStandiDef = newLociStandiDef;
    },
    setLociStandiDefUpdated(state, lociStandiDefUpdated) {
      state.lociStandiDefUpdated = lociStandiDefUpdated;
    },
    setLociStandiDefValid(state, lociStandiDefValid) {
      state.lociStandiDefValid = lociStandiDefValid;
    },
    setLociStandiDefId(state, lociStandiDefId) {
      state.lociStandiDefId = lociStandiDefId;
    },
    setCcCoa(state, ccCoa) {
      state.ccCoa = ccCoa;
    },
    setCcCoas(state, ccCoas) {
      state.ccCoas = ccCoas;
    },
    setCcCoaFiles(state, ccCoaFiles) {
      state.ccCoaFiles = ccCoaFiles;
    },
    setNewccCoa(state, newccCoa) {
      state.newccCoa = newccCoa;
    },
    setCcCoaUpdated(state, ccCoaUpdated) {
      state.ccCoaUpdated = ccCoaUpdated;
    },
    setCcCoaValid(state, ccCoaValid) {
      state.ccCoaValid = ccCoaValid;
    },
    setCcCoaId(state, ccCoaId) {
      state.ccCoaId = ccCoaId;
    },
    setCcMerit(state, ccMerit) {
      state.ccMerit = ccMerit;
    },
    setCcMerits(state, ccMerits) {
      state.ccMerits = ccMerits;
    },
    setCcMeritFiles(state, ccMeritFiles) {
      state.ccMeritFiles = ccMeritFiles;
    },
    setNewccMerit(state, newccMerit) {
      state.newccMerit = newccMerit;
    },
    setCcMeritUpdated(state, ccMeritUpdated) {
      state.ccMeritUpdated = ccMeritUpdated;
    },
    setCcMeritValid(state, ccMeritValid) {
      state.ccMeritValid = ccMeritValid;
    },
    setCcMeritId(state, ccMeritId) {
      state.ccMeritId = ccMeritId;
    },
    setCcQuanta(state, ccQuanta) {
      state.ccQuanta = ccQuanta;
    },
    setCcQuantas(state, ccQuantas) {
      state.ccQuantas = ccQuantas;
    },
    setCcQuantaFiles(state, ccQuantaFiles) {
      state.ccQuantaFiles = ccQuantaFiles;
    },
    setNewccQuanta(state, newccQuanta) {
      state.newccQuanta = newccQuanta;
    },
    setCcQuantaUpdated(state, ccQuantaUpdated) {
      state.ccQuantaUpdated = ccQuantaUpdated;
    },
    setCcQuantaValid(state, ccQuantaValid) {
      state.ccQuantaValid = ccQuantaValid;
    },
    setCcQuantaId(state, ccQuantaId) {
      state.ccQuantaId = ccQuantaId;
    },
    setCcRelief(state, ccRelief) {
      state.ccRelief = ccRelief;
    },
    setCcReliefs(state, ccReliefs) {
      state.ccReliefs = ccReliefs;
    },
    setCcReliefFiles(state, ccReliefFiles) {
      state.ccReliefFiles = ccReliefFiles;
    },
    setNewccRelief(state, newccRelief) {
      state.newccRelief = newccRelief;
    },
    setCcReliefUpdated(state, ccReliefUpdated) {
      state.ccReliefUpdated = ccReliefUpdated;
    },
    setCcReliefValid(state, ccReliefValid) {
      state.ccReliefValid = ccReliefValid;
    },
    setCcReliefId(state, ccReliefId) {
      state.ccReliefId = ccReliefId;
    },
    setClaimProcValid(state, claimProcValid) {
      state.claimProcValid = claimProcValid;
    },
    setDefendProcValid(state, defendProcValid) {
      state.defendProcValid = defendProcValid;
    },
    setQuanta(state, quanta) {
      state.quanta = quanta;
    },
    setQuantaFiles(state, quantaFiles) {
      state.quantaFiles = quantaFiles;
    },
    setQuantas(state, quantas) {
      state.quantas = quantas;
    },
    setQuantaValid(state, quantaValid) {
      state.quantaValid = quantaValid;
    },
    setQuantaId(state, quantaId) {
      state.quantaId = quantaId;
    },
    setNewClaimant(state, newClaimant) {
      state.newClaimant = newClaimant;
    },
    setClaimantUpdated(state, claimantUpdated) {
      state.claimantUpdated = claimantUpdated;
    },
    setNewDefendant(state, newDefendant) {
      state.newDefendant = newDefendant;
    },
    setParticipantAction(state, participantAction) {
      state.participantAction = participantAction;
    },
    setDefendantUpdated(state, defendantUpdated) {
      state.defendantUpdated = defendantUpdated;
    },
    setNewCoa(state, newCoa) {
      state.newCoa = newCoa;
    },
    setCoaUpdated(state, coaUpdated) {
      state.coaUpdated = coaUpdated;
    },
    setNewMerit(state, newMerit) {
      state.newMerit = newMerit;
    },
    setMeritUpdated(state, meritUpdated) {
      state.meritUpdated = meritUpdated;
    },
    setNewQuanta(state, newQuanta) {
      state.newQuanta = newQuanta;
    },
    setQuantaUpdated(state, quantaUpdated) {
      state.quantaUpdated = quantaUpdated;
    },
    setNewRelief(state, newRelief) {
      state.newRelief = newRelief;
    },
    setReliefUpdated(state, reliefUpdated) {
      state.reliefUpdated = reliefUpdated;
    },
    setNewCase(state, newCase) {
      state.newCase = newCase;
    },
    setCaseUpdated(state, caseUpdated) {
      state.caseUpdated = caseUpdated;
    },
    setJurisdictions(state, jurisdictions) {
      state.jurisdictions = jurisdictions;
    },
    setSettle(state, settle) {
      state.settle = settle;
    },
    setSettles(state, settles) {
      state.settles = settles;
    },
    setSettleFiles(state, settleFiles) {
      state.settleFiles = settleFiles;
    },
    setSettleValid(state, settleValid) {
      state.settleValid = settleValid;
    },
    setNewSettle(state, newSettle) {
      state.newSettle = newSettle;
    },
    setSettleUpdated(state, settleUpdated) {
      state.settleUpdated = settleUpdated;
    },
    setSettleId(state, settleId) {
      state.settleId = settleId;
    },
    setCounterClaim(state, counterClaim) {
      state.counterClaim = counterClaim;
    },
    setCounterClaims(state, counterClaims) {
      state.counterClaims = counterClaims;
    },
    setProcessCounterClaim(state, processCounterClaim) {
      state.processCounterClaim = processCounterClaim;
    },
    setCounterClaimId(state, counterClaimId) {
      state.counterClaimId = counterClaimId;
    },
    setNewCounterClaim(state, newCounterClaim) {
      state.newCounterClaim = newCounterClaim;
    },
    setCounterClaimUpdated(state, counterClaimUpdated) {
      state.counterClaimUpdated = counterClaimUpdated;
    },
    setArbitAllocs(state, arbitAllocs) {
      state.arbitAllocs = arbitAllocs;
    },
    setArbitAlloc(state, arbitAlloc) {
      state.arbitAlloc = arbitAlloc;
    },
    setAllocUser(state, allocUser) {
      state.allocUser = allocUser;
    },
    setPocs(state, pocs) {
      state.pocs = pocs;
    },
    setPoc(state, poc) {
      state.poc = poc;
    },
    setDefendCase(state, defendCase) {
      state.defendCase = defendCase;
    },
    setDefendCases(state, defendCases) {
      state.defendCases = defendCases;
    },
    setCoDefStep(state, coDefStep) {
      state.coDefStep = coDefStep;
    },
    setCoDefendant1Valid(state, coDefendant1Valid) {
      state.coDefendant1Valid = coDefendant1Valid;
    },
    setCoDefendant2Valid(state, coDefendant2Valid) {
      state.coDefendant2Valid = coDefendant2Valid;
    },
    setCoDefendant3Valid(state, coDefendant3Valid) {
      state.coDefendant3Valid = coDefendant3Valid;
    },
    setCoDefendant4Valid(state, coDefendant4Valid) {
      state.coDefendant4Valid = coDefendant4Valid;
    },
    setCoDefendant5Valid(state, coDefendant5Valid) {
      state.coDefendant5Valid = coDefendant5Valid;
    },
    setCoDefFlags(state, coDefFlags) {
      state.coDefFlags = coDefFlags;
    },
    setClaimDefends(state, claimDefends) {
      state.claimDefends = claimDefends;
    },
    setMultiAccident(state, multi) {
      state.multiAccident = multi;
    },
    setHelpActive(state, helpActive) {
      state.helpActive = helpActive;
    },
    setViewStatus(state, viewStatus) {
      state.viewStatus = viewStatus;
    },
    setCaseValid(state, caseValid) {
      state.caseValid = caseValid;
    },
    setTextLength(state, textLength) {
      state.textLength = textLength;
    },
    setDialogData(state, dialogData) {
      state.dialogData = dialogData;
    },
    setTxtLen(state, txtLen) {
      state.txtLen = txtLen;
    },
    setTxtErr(state, txtErr) {
      state.txtErr = txtErr;
    },
    setValidates(state, validates) {
      state.validates = validates;
    },
    setDescClaim(state, descClaim) {
      state.descClaim = descClaim;
    },
    setInconsistencyObj(state, inCon) {
      state.inconsistencyObj = inCon;
    },
    setClaimValues(state, claimValues) {
      state.claimValues = claimValues;
    },
    setMobileDevice(state, mobileDevice) {
      state.mobileDevice = mobileDevice;
    },
    setRoleId(state, roleId) {
      state.roleId = roleId;
    },
    setRoleDesc(state, roleDesc) {
      state.roleDesc = roleDesc;
    },
    setRoleCount(state, roleCount) {
      state.roleCount = roleCount;
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit("setToken", token);
    },
    setUpArbitToken({ commit }, arbitToken) {
      commit("setArbitToken", arbitToken);
      Api.defaults.headers.common["authorization"] = this.state.arbitToken;
    },
    setUpArbitUser({ commit }, arbitUser) {
      commit("setArbitUser", arbitUser);
    },
    doSetStep({ commit }, step) {
      commit("setStep", step);
    },
    doCoDefStep({ commit }, step) {
      commit("setCoDefStep", step);
    },
    getUserCases({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            commit("setAllCases", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findArbitUser({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post(user.url, user.body).then(
          response => {
            commit("setArbitUser", response.data);
            resolve(this.state.arbitUser);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findAllocUser({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            commit("setAllocUser", response.data);
            resolve();
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findCoyUsers({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            commit("setUsers", response.data);
            resolve(this.state.users);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findAdminUser({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("admins").then(
          response => {
            commit("setUsers", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getCaseClaimant({ commit }, caseId) {
      return new Promise((resolve, reject) => {
        Api.get(`claimants/case/${caseId}`).then(
          response => {
            commit("setClaimants", response.data);
            commit("setClaimant", this.state.claimants[0]);
            resolve(this.state.claimants);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getCaseDefendant({ commit }, caseId) {
      return new Promise((resolve, reject) => {
        Api.get(`defendants/case/${caseId}`).then(
          response => {
            commit("setDefendants", response.data);
            commit("setDefendant", this.state.defendants[0]);
            resolve(this.state.defendants);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findClaimant({ commit }, claimantId) {
      return new Promise((resolve, reject) => {
        Api.get(`claimants/${claimantId}`).then(
          response => {
            commit("setClaimant", response.data);
            commit("setClaimantId", this.state.claimant.id);
            resolve(this.state.claimant);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findCase({ commit }, caseId) {
      return new Promise((resolve, reject) => {
        Api.get(`case/${caseId}`).then(
          response => {
            //console.log('findCase '+ response.data);
            commit("setCase", response.data);
            commit("setCaseId", this.state.arbitCase.id);
            resolve(this.state.arbitCase);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findDemoCase({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            //console.log('findCase '+ response.data);
            commit("setCase", response.data);
            commit("setCaseId", this.state.arbitCase.id);
            resolve(this.state.arbitCase);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findArbitAllocs({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get(`arbitallocs`).then(
          response => {
            commit("setArbitAllocs", response.data);
            resolve(this.state.arbitAllocs);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findPendArbit({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            commit("setClaimDefends", response.data);
            resolve(this.state.claimDefends);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findObj({ commit }, findObj) {
      return new Promise((resolve, reject) => {
        Api.get(findObj.url).then(
          response => {
            switch (findObj.id) {
              case caseModels.LOCI:
                commit("setLocis", response.data);
                commit("setLoci", this.state.locis[0]);
                resolve(this.state.loci);
                break;
              case caseModels.COA:
                commit("setCoas", response.data);
                commit("setCoa", this.state.coas[0]);
                resolve(this.state.coa);
                break;
              case caseModels.MERITS:
                commit("setMerits", response.data);
                commit("setMerit", this.state.merits[0]);
                resolve(this.state.merit);
                break;
              case caseModels.QUANTUM:
                commit("setQuantas", response.data);
                commit("setQuanta", this.state.quantas[0]);
                resolve(this.state.quanta);
                break;
              case caseModels.RELIEF:
                commit("setReliefSoughts", response.data);
                commit("setReliefSought", this.state.reliefSoughts[0]);
                resolve(this.state.reliefSought);
                break;
              case caseModels.DEFENSE:
                commit("setDefenses", response.data);
                commit("setDefense", this.state.defenses[0]);
                resolve(this.state.defense);
                break;
              case caseModels.SETTLE:
                commit("setSettles", response.data);
                commit("setSettle", this.state.settles[0]);
                resolve(this.state.settle);
                break;
              case caseModels.LOCIDEF:
                commit("setLociStandiDefs", response.data);
                commit("setLociStandiDef", this.state.lociStandiDefs[0]);
                resolve(this.state.lociStandiDef);
                break;
              case caseModels.COUNTERCOA:
                commit("setCcCoas", response.data);
                commit("setCcCoa", this.state.ccCoas[0]);
                resolve(this.state.ccCoa);
                break;
              case caseModels.COUNTERMERIT:
                commit("setCcMerits", response.data);
                commit("setCcMerit", this.state.ccMerits[0]);
                resolve(this.state.ccMerit);
                break;
              case caseModels.COUNTERQUANTA:
                commit("setCcQuantas", response.data);
                commit("setCcQuanta", this.state.ccQuantas[0]);
                resolve(this.state.ccQuanta);
                break;
              case caseModels.COUNTERRELIEF:
                commit("setCcReliefs", response.data);
                commit("setCcRelief", this.state.ccReliefs[0]);
                resolve(this.state.ccRelief);
                break;
              case caseModels.RESOLUTION:
                commit("setResolutions", response.data);
                commit("setResolution", this.state.resolutions[0]);
                resolve(this.state.resolution);
                break;
              default:
                throw "incorrect fetch type";
            }
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findObjByPk({ commit }, pkObj) {
      return new Promise((resolve, reject) => {
        Api.get(pkObj.url).then(
          response => {
            switch (pkObj.id) {
              case caseModels.LOCI:
                commit("setLoci", response.data);
                resolve(this.state.loci);
                break;
              case caseModels.COA:
                commit("setCoa", response.data);
                resolve(this.state.coa);
                break;
              case caseModels.MERITS:
                commit("setMerit", response.data);
                resolve(this.state.merit);
                break;
              case caseModels.QUANTUM:
                commit("setQuanta", response.data);
                resolve(this.state.quanta);
                break;
              case caseModels.RELIEF:
                commit("setReliefSought", response.data);
                resolve(this.state.reliefSought);
                break;
              case caseModels.DEFENSE:
                commit("setDefense", response.data);
                resolve(this.state.defense);
                break;
              case caseModels.SETTLE:
                commit("setSettle", response.data);
                resolve(this.state.settle);
                break;
              case caseModels.LOCIDEF:
                commit("setLociStandiDef", response.data);
                resolve(this.state.lociStandiDef);
                break;
              case caseModels.COUNTERCOA:
                commit("setCcCoa", response.data);
                resolve(this.state.ccCoa);
                break;
              case caseModels.COUNTERMERIT:
                commit("setCcMerit", response.data);
                resolve(this.state.ccMerit);
                break;
              case caseModels.COUNTERQUANTA:
                commit("setCcQuanta", response.data);
                resolve(this.state.ccQuanta);
                break;
              case caseModels.COUNTERRELIEF:
                commit("setCcRelief", response.data);
                resolve(this.state.ccRelief);
                break;
              case caseModels.RESOLUTION:
                commit("setResolution", response.data);
                resolve(this.state.resolution);
                break;
              default:
                throw "incorrect fetch type pk";
            }
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findFiles({ commit }, filesObj) {
      return new Promise((resolve, reject) => {
        Api.get(filesObj.url).then(
          response => {
            switch (filesObj.id) {
              case caseModels.LOCI:
                commit("setLociFiles", response.data);
                resolve(this.state.lociFiles);
                break;
              case caseModels.COA:
                commit("setCoaFiles", response.data);
                resolve(this.state.coaFiles);
                break;
              case caseModels.MERITS:
                commit("setMeritFiles", response.data);
                resolve(this.state.meritFiles);
                break;
              case caseModels.QUANTUM:
                commit("setQuantaFiles", response.data);
                resolve(this.state.quantaFiles);
                break;
              case caseModels.RELIEF:
                commit("setReliefSoughtFiles", response.data);
                resolve(this.state.reliefSoughtFiles);
                break;
              case caseModels.DEFENSE:
                commit("setDefenseFiles", response.data);
                resolve(this.state.defenseFiles);
                break;
              case caseModels.SETTLE:
                commit("setSettleFiles", response.data);
                resolve(this.state.settleFiles);
                break;
              case caseModels.LOCIDEF:
                commit("setLociStandiDefFiles", response.data);
                resolve(this.state.lociStandiDefFiles);
                break;
              case caseModels.COUNTERCOA:
                commit("setCcCoaFiles", response.data);
                resolve(this.state.ccCoaFiles);
                break;
              case caseModels.COUNTERMERIT:
                commit("setCcMeritFiles", response.data);
                resolve(this.state.ccMeritFiles);
                break;
              case caseModels.COUNTERQUANTA:
                commit("setCcQuantaFiles", response.data);
                resolve(this.state.ccQuantaFiles);
                break;
              case caseModels.COUNTERRELIEF:
                commit("setCcReliefFiles", response.data);
                resolve(this.state.ccReliefFiles);
                break;
              case caseModels.RESOLUTION:
                commit("setResolutionFiles", response.data);
                resolve(this.state.resolutionFiles);
                break;
              default:
                throw "incorrect fetch type files";
            }
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findDefendant({ commit }, defendantId) {
      return new Promise((resolve, reject) => {
        Api.get(`defendants/${defendantId}`).then(
          response => {
            commit("setDefendant", response.data);
            commit("setDefendantId", this.state.defendant.id);
            resolve(this.state.defendant);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findDefendants({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            commit("setDefendants", response.data);
            resolve(this.state.defendants);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findDefendCases({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.get(url).then(
          response => {
            //('claimdefs '+ JSON.stringify(response.data))
            commit("setDefendCases", response.data);
            resolve(this.state.defendCases);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getAllCoys({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("companies").then(
          response => {
            //('we in getallcoys '+ JSON.stringify(response.data))
            commit("setInsCoys", response.data);
            resolve(this.state.insCoys);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    getAllRoles({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("roles").then(
          response => {
            //('we in getAllRoles '+ JSON.stringify(response.data))
            commit("setUserRoles", response.data);
            resolve(this.state.userRoles);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findJurisdictions({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("jurisdictions/findall").then(
          response => {
            commit("setJurisdictions", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findPocs({ commit }) {
      return new Promise((resolve, reject) => {
        Api.get("pocs").then(
          response => {
            commit("setPocs", response.data);
            resolve(this.state.pocs);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    findPoc({ commit }, pocId) {
      return new Promise((resolve, reject) => {
        Api.get(`pocs/${pocId}`).then(
          response => {
            commit("setPoc", response.data);
            resolve(this.state.poc);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    registerUser({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("arbitregister", user).then(
          response => {
            commit("setUser", response.data);
            var roleMaps = [];
            this.state.dndRoles.forEach(role => {
              roleMaps.push({
                status: 7,
                ArbitUserId: this.state.user.id,
                UserRoleId: role.id,
                StatusId: 7
              });
            });
            Api.post(`userrolemap/bulk/${this.state.user.id}`, roleMaps).then(
              response => {
                resolve(response);
              }
            );
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateUser({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.put(`/arbitusers/update/${user.id}`, user).then(
          response => {
            commit("setUser", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    loginUser({ commit }, creds) {
      return new Promise((resolve, reject) => {
        Api.post("arbitusers/login", creds, {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(
          response => {
            commit("setArbitUser", response.data.arbitUser);
            commit("setArbitToken", response.data.arbitToken);
            Api.defaults.headers.common[
              "authorization"
            ] = this.state.arbitToken;

            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createRole({ commit }, userRole) {
      return new Promise((resolve, reject) => {
        Api.post("roles", userRole).then(
          response => {
            commit("setUserRole", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createCoy({ commit }, coy) {
      return new Promise((resolve, reject) => {
        Api.post("companies", coy).then(
          response => {
            commit("setInsCoy", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createCase({ commit }, Case) {
      return new Promise((resolve, reject) => {
        Api.post("cases", Case).then(
          response => {
            commit("setCase", response.data);
            commit("setCaseId", this.state.arbitCase.id);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createArbitAlloc({ commit }, arbitAlloc) {
      return new Promise((resolve, reject) => {
        Api.post("arbitallocs", arbitAlloc).then(
          response => {
            commit("setArbitAlloc", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createClaimant({ commit }, claimant) {
      return new Promise((resolve, reject) => {
        Api.post("claimants", claimant).then(
          response => {
            commit("setClaimant", response.data);
            commit("setClaimantId", this.state.claimant.id);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createDefendant({ commit }, defendant) {
      return new Promise((resolve, reject) => {
        Api.post("defendants", defendant).then(
          response => {
            commit("setDefendant", response.data);
            commit("setDefendantId", this.state.defendant.id);

            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createDefendants({ commit }, defendObj) {
      return new Promise((resolve, reject) => {
        //('createClaimdefend '+ JSON.stringify(claimDefend))
        Api.post(defendObj.url, defendObj.defends).then(
          response => {
            commit("setCoDefendants", response.data);
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createObj({ commit }, obj) {
      return new Promise((resolve, reject) => {
        Api.post(obj.url, obj.writeObj).then(
          response => {
            switch (obj.id) {
              case caseModels.LOCI:
                commit("setLoci", response.data);
                commit("setLociId", this.state.loci.id);
                break;
              case caseModels.COA:
                commit("setCoa", response.data);
                commit("setCoaId", this.state.coa.id);
                break;
              case caseModels.MERITS:
                commit("setMerit", response.data);
                commit("setMeritId", this.state.merit.id);
                break;
              case caseModels.QUANTUM:
                commit("setQuanta", response.data);
                commit("setQuantaId", this.state.quanta.id);
                break;
              case caseModels.RELIEF:
                commit("setReliefSought", response.data);
                commit("setReliefSoughtId", this.state.reliefSought.id);
                break;
              case caseModels.DEFENSE:
                commit("setDefense", response.data);
                commit("setDefenseId", this.state.defense.id);
                break;
              case caseModels.SETTLE:
                commit("setSettle", response.data);
                commit("setSettleId", this.state.settle.id);
                break;
              case caseModels.LOCIDEF:
                commit("setLociStandiDef", response.data);
                commit("setLociStandiDefId", this.state.lociStandiDef.id);
                break;
              case caseModels.COUNTERCOA:
                commit("setCcCoa", response.data);
                commit("setCcCoaId", this.state.ccCoa.id);
                break;
              case caseModels.COUNTERMERIT:
                commit("setCcMerit", response.data);
                commit("setCcMeritId", this.state.ccMerit.id);
                break;
              case caseModels.COUNTERQUANTA:
                commit("setCcQuanta", response.data);
                commit("setCcQuantaId", this.state.ccQuanta.id);
                break;
              case caseModels.COUNTERRELIEF:
                commit("setCcRelief", response.data);
                commit("setCcReliefId", this.state.ccRelief.id);
                break;
              case caseModels.RESOLUTION:
                commit("setResolution", response.data);
                commit("setResolutionId", this.state.resolution.id);
                break;
              default:
                throw "incorrect write type write obj " + obj.id;
            }
            //('createLoci ' + JSON.stringify(response.data))

            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    createFiles({ commit }, fileObj) {
      return new Promise((resolve, reject) => {
        Api.post(fileObj.url, fileObj.files).then(
          response => {
            switch (fileObj.id) {
              case 1:
                commit("setLociFiles", response.data);
                break;
              case 2:
                commit("setCoaFiles", response.data);
                break;
              case 3:
                commit("setMeritFiles", response.data);
                break;
              case 4:
                commit("setQuantaFiles", response.data);
                break;
              case 5:
                commit("setReliefSoughtFiles", response.data);
                break;
              case 6:
                commit("setDefenseFiles", response.data);
                break;
              case 7:
                commit("setSettleFiles", response.data);
                break;
              case 8:
                commit("setLociStandiDefFiles", response.data);
                break;
              case 9:
                commit("setCcCoaFiles", response.data);
                break;
              case 10:
                commit("setCcMeritFiles", response.data);
                break;
              case 11:
                commit("setCcQuantaFiles", response.data);
                break;
              case 12:
                commit("setCcReliefFiles", response.data);
                break;
              case 13:
                commit("setResolutionFiles", response.data);
                break;
              default:
                throw "incorrect fetch type write obj";
            }
            //('createLoci ' + JSON.stringify(response.data))
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    sendEmail({ commit }, msg) {
      return new Promise((resolve, reject) => {
        Api.post("sendmail", msg).then(
          response => {
            "email response " + JSON.stringify(response.data);
            commit("setEmail", response.data);
            resolve(response);
          },
          error => {
            "email response " + JSON.stringify(error);
            reject(error);
          }
        );
      });
    },
    showCase({ commit }, caseId) {
      return new Promise((resolve, reject) => {
        Api.get(`case/${caseId}`).then(
          response => {
            commit("setMedia", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateResolution({ commit }, resolution) {
      return new Promise((resolve, reject) => {
        Api.put(`resolutions/${resolution.id}`, resolution).then(
          response => {
            commit("setResolution", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateCase({ commit }, Case) {
      return new Promise((resolve, reject) => {
        Api.put(`cases/${Case.id}`, Case).then(
          response => {
            //('updateCase return ' + response.data)
            commit("setCaseId", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateRole({ commit }, userRole) {
      return new Promise((resolve, reject) => {
        Api.put(`roles/${userRole.id}`, userRole).then(
          response => {
            //('updateCase return ' + response.data)
            commit("setUserRole", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateCoy({ commit }, coy) {
      return new Promise((resolve, reject) => {
        Api.put(`companies/${coy.id}`, coy).then(
          response => {
            //('updateCase return ' + response.data)
            commit("setInsCoy", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    showClaimant({ commit }, claimantId) {
      return new Promise((resolve, reject) => {
        Api.get(`claimants/${claimantId}`).then(
          response => {
            commit("setClaimant", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateClaimant({ commit }, claimant) {
      return new Promise((resolve, reject) => {
        Api.put(`claimants/${claimant.id}`, claimant).then(
          response => {
            commit("setClaimant", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateArbitAlloc({ commit }, arbitAlloc) {
      return new Promise((resolve, reject) => {
        Api.put(`arbitAllocs/${arbitAlloc.id}`, arbitAlloc).then(
          response => {
            commit("setArbitAlloc", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateObj({ commit }, updObj) {
      return new Promise((resolve, reject) => {
        Api.put(updObj.url, updObj.obj).then(
          response => {
            commit("setOtherDocs", response.data);
            //('createLoci ' + JSON.stringify(response.data))
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    delFile({ commit }, url) {
      return new Promise((resolve, reject) => {
        Api.delete(url).then(
          response => {
            commit("setFilesDeleted", response.data);
            resolve(this.state.filesDeleted);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    delDefenseFile({ commit }, fileId) {
      return new Promise((resolve, reject) => {
        Api.delete(`defensefiles/${fileId}`).then(
          response => {
            commit("setFilesDeleted", response.data);
            resolve(this.state.filesDeleted);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    delApportionFile({ commit }, fileId) {
      return new Promise((resolve, reject) => {
        Api.delete(`apportionfiles/${fileId}`).then(
          response => {
            commit("setFilesDeleted", response.data);
            resolve(this.state.filesDeleted);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    delSettleFile({ commit }, fileId) {
      return new Promise((resolve, reject) => {
        Api.delete(`settlefiles/${fileId}`).then(
          response => {
            commit("setFilesDeleted", response.data);
            resolve(this.state.filesDeleted);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateDefendant({ commit }, defendant) {
      return new Promise((resolve, reject) => {
        Api.put(`defendants/${defendant.id}`, defendant).then(
          response => {
            commit("setDefendant", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateDefendants({ commit }, defendants) {
      return new Promise((resolve, reject) => {
        Api.put("defendants/bulk", defendants).then(
          response => {
            commit("setOtherDocs", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    updateFile({ commit }, fileObj) {
      return new Promise((resolve, reject) => {
        Api.put(fileObj.url, fileObj.file).then(
          response => {
            commit("setLociFile", response.data);
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
      });
    },
    doClaimant({ commit }, claimant) {
      commit("setClaimant", claimant);
    },
    initCase({ commit }, arbitCase) {
      commit("setCase", arbitCase);
    },
    initArbitUser({ commit }, arbitUser) {
      commit("setArbitUser", arbitUser);
    },
    initUser({ commit }, user) {
      commit("setUser", user);
    },
    initCaseId({ commit }, caseId) {
      commit("setCaseId", caseId);
    },
    initClaimantId({ commit }, claimantId) {
      commit("setClaimantId", claimantId);
    },
    initLociId({ commit }, lociId) {
      commit("setLociId", lociId);
    },
    initCoaId({ commit }, coaId) {
      commit("setCoaId", coaId);
    },
    initMeritId({ commit }, meritId) {
      commit("setMeritId", meritId);
    },
    initDefendantId({ commit }, defendantId) {
      commit("setDefendantId", defendantId);
    },
    initReliefId({ commit }, reliefId) {
      commit("setReliefSoughtId", reliefId);
    },
    initNoticeId({ commit }, noticeId) {
      commit("setNoticeId", noticeId);
    },
    initStateOfId({ commit }, stateOfId) {
      commit("setStateOfDefenseId", stateOfId);
    },
    initQuantaId({ commit }, quantaId) {
      commit("setQuantaId", quantaId);
    },
    doDefendant({ commit }, defendant) {
      commit("setDefendant", defendant);
    },
    doDefendants({ commit }, defendants) {
      commit("setDefendants", defendants);
    },
    doCoaFiles({ commit }, coaFiles) {
      commit("setCoaFiles", coaFiles);
    },
    doReliefSought({ commit }, reliefSought) {
      commit("setReliefSought", reliefSought);
    },
    doReliefSoughtFiles({ commit }, reliefFiles) {
      commit("setReliefSoughtFiles", reliefFiles);
    },
    doLociFiles({ commit }, lociFiles) {
      commit("setLociFiles", lociFiles);
    },
    doOtherDocs({ commit }, otherDocs) {
      commit("setOtherDocs", otherDocs);
    },
    doMerits({ commit }, merits) {
      commit("setMerits", merits);
    },
    doMerit({ commit }, merit) {
      commit("setMerit", merit);
    },
    doMeritFiles({ commit }, meritFiles) {
      commit("setMeritFiles", meritFiles);
    },
    doIsFormValid({ commit }, formValid) {
      commit("setIsFormValid", formValid);
    },
    doClaimantValid({ commit }, claimantValid) {
      commit("setClaimantValid", claimantValid);
    },
    doDefendantValid({ commit }, defendantValid) {
      commit("setDefendantValid", defendantValid);
    },
    doLociStandiValid({ commit }, lociValid) {
      commit("setLociStandiValid", lociValid);
    },
    doLoci({ commit }, loci) {
      commit("setLoci", loci);
    },
    doCoaValid({ commit }, coaValid) {
      commit("setCoaValid", coaValid);
    },
    doCoa({ commit }, coa) {
      commit("setCoa", coa);
    },
    doMeritValid({ commit }, meritValid) {
      commit("setMeritsValid", meritValid);
    },
    doClaimantCaseValid({ commit }, claimantCaseValid) {
      commit("setClaimantCaseValid", claimantCaseValid);
    },
    doReliefSoughtValid({ commit }, reliefValid) {
      commit("setReliefSoughtValid", reliefValid);
    },
    doCurrentUploadedFiles({ commit }, currentFiles) {
      commit("setCurrentUploadedFiles", currentFiles);
    },
    fixStep({ commit }, step) {
      commit("setStep", step);
    },
    doDefenseValid({ commit }, defenseValid) {
      commit("setDefenseValid", defenseValid);
    },
    doDefense({ commit }, defense) {
      commit("setDefense", defense);
    },
    doDefenseId({ commit }, defenseId) {
      commit("setDefenseId", defenseId);
    },
    doNewDefense({ commit }, newDefense) {
      commit("setNewDefense", newDefense);
    },
    doDefenseFiles({ commit }, defenseFiles) {
      commit("setDefenseFiles", defenseFiles);
    },
    doDefenseUpdated({ commit }, defenseUpdated) {
      commit("setDefenseUpdated", defenseUpdated);
    },
    doLociStandiDef({ commit }, lociStandiDef) {
      commit("setLociStandiDef", lociStandiDef);
    },
    doLociStandiDefs({ commit }, lociStandiDefs) {
      commit("setLociStandiDefs", lociStandiDefs);
    },
    doLociStandiDefFiles({ commit }, lociStandiDefFiles) {
      commit("setLociStandiDefFiles", lociStandiDefFiles);
    },
    doNewLociStandiDef({ commit }, newLociStandiDef) {
      commit("setNewLociStandiDef", newLociStandiDef);
    },
    doLociStandiDefUpdated({ commit }, lociStandiDefUpdated) {
      commit("setLociStandiDefUpdated", lociStandiDefUpdated);
    },
    doLociStandiDefValid({ commit }, StandiDefValid) {
      commit("setLociStandiDefValid", StandiDefValid);
    },
    doLociStandiDefId({ commit }, lociStandiDefId) {
      commit("setLociStandiDefId", lociStandiDefId);
    },
    doCcCoa({ commit }, ccCoa) {
      commit("setCcCoa", ccCoa);
    },
    doCcCoas({ commit }, ccCoas) {
      commit("setCcCoas", ccCoas);
    },
    doCcCoaFiles({ commit }, ccCoaFiles) {
      commit("setCcCoaFiles", ccCoaFiles);
    },
    doNewccCoa({ commit }, newccCoa) {
      commit("setNewccCoa", newccCoa);
    },
    doCcCoaUpdated({ commit }, ccCoaUpdated) {
      commit("setCcCoaUpdated", ccCoaUpdated);
    },
    doCcCoaValid({ commit }, ccCoaValid) {
      commit("setCcCoaValid", ccCoaValid);
    },
    doCcCoaId({ commit }, ccCoaId) {
      commit("setCcCoaId", ccCoaId);
    },
    doCcMerit({ commit }, ccMerit) {
      commit("setCcMerit", ccMerit);
    },
    doCcMerits({ commit }, ccMerits) {
      commit("setCcMerits", ccMerits);
    },
    doCcMeritFiles({ commit }, ccMeritFiles) {
      commit("setCcMeritFiles", ccMeritFiles);
    },
    doNewccMerit({ commit }, newccMerit) {
      commit("setNewccMerit", newccMerit);
    },
    doCcMeritUpdated({ commit }, ccMeritUpdated) {
      commit("setCcMeritUpdated", ccMeritUpdated);
    },
    doCcMeritValid({ commit }, ccMeritValid) {
      commit("setCcMeritValid", ccMeritValid);
    },
    doCcMeritId({ commit }, ccMeritId) {
      commit("setCcMeritId", ccMeritId);
    },
    doCcQuanta({ commit }, ccQuanta) {
      commit("setCcQuanta", ccQuanta);
    },
    doCcQuantas({ commit }, ccQuantas) {
      commit("setCcQuantas", ccQuantas);
    },
    doCcQuantaFiles({ commit }, ccQuantaFiles) {
      commit("setCcQuantaFiles", ccQuantaFiles);
    },
    doNewccQuanta({ commit }, newccQuanta) {
      commit("setNewccQuanta", newccQuanta);
    },
    doCcQuantaUpdated({ commit }, ccQuantaUpdated) {
      commit("setCcQuantaUpdated", ccQuantaUpdated);
    },
    doCcQuantaValid({ commit }, ccQuantaValid) {
      commit("setCcQuantaValid", ccQuantaValid);
    },
    doCcQuantaId({ commit }, ccQuantaId) {
      commit("setCcQuantaId", ccQuantaId);
    },
    doCcRelief({ commit }, ccRelief) {
      commit("setCcRelief", ccRelief);
    },
    doCcReliefs({ commit }, ccReliefs) {
      commit("setCcReliefs", ccReliefs);
    },
    doCcReliefFiles({ commit }, ccReliefFiles) {
      commit("setCcReliefFiles", ccReliefFiles);
    },
    doNewccRelief({ commit }, newccRelief) {
      commit("setNewccRelief", newccRelief);
    },
    doCcReliefUpdated({ commit }, ccReliefUpdated) {
      commit("setCcReliefUpdated", ccReliefUpdated);
    },
    doCcReliefValid({ commit }, ccReliefValid) {
      commit("setCcReliefValid", ccReliefValid);
    },
    doCcReliefId({ commit }, ccReliefId) {
      commit("setCcReliefId", ccReliefId);
    },
    doDefendProcValid({ commit }, defendProcValid) {
      commit("setDefendProcValid", defendProcValid);
    },
    doClaimProcValid({ commit }, claimProcValid) {
      commit("setClaimProcValid", claimProcValid);
    },
    doQuantaValid({ commit }, quantaValid) {
      commit("setQuantaValid", quantaValid);
    },
    doQuanta({ commit }, quanta) {
      commit("setQuanta", quanta);
    },
    doQuantaFiles({ commit }, quantaFiles) {
      commit("setQuantaFiles", quantaFiles);
    },
    doNewClaimant({ commit }, newClaimant) {
      commit("setNewClaimant", newClaimant);
    },
    doClaimantUpdated({ commit }, claimantUpdated) {
      commit("setClaimantUpdated", claimantUpdated);
    },
    doNewDefendant({ commit }, newDefendant) {
      commit("setNewDefendant", newDefendant);
    },
    doDefendantUpdated({ commit }, defendantUpdated) {
      commit("setDefendantUpdated", defendantUpdated);
    },
    doClaimDefend({ commit }, claimDefend) {
      commit("setClaimDefend", claimDefend);
    },
    doParticipantAction({ commit }, participantAction) {
      commit("setParticipantAction", participantAction);
    },
    doNewCoa({ commit }, newCoa) {
      commit("setNewCoa", newCoa);
    },
    doCoaUpdated({ commit }, coaUpdated) {
      commit("setCoaUpdated", coaUpdated);
    },
    doNewLoci({ commit }, newLoci) {
      commit("setNewLoci", newLoci);
    },
    doLociUpdated({ commit }, lociUpdated) {
      commit("setLociUpdated", lociUpdated);
    },
    doNewMerit({ commit }, newMerit) {
      commit("setNewMerit", newMerit);
    },
    doMeritUpdated({ commit }, meritUpdated) {
      commit("setMeritUpdated", meritUpdated);
    },
    doNewQuanta({ commit }, newQuanta) {
      commit("setNewQuanta", newQuanta);
    },
    doQuantaUpdated({ commit }, quantaUpdated) {
      commit("setQuantaUpdated", quantaUpdated);
    },
    doNewRelief({ commit }, newRelief) {
      commit("setNewRelief", newRelief);
    },
    doReliefUpdated({ commit }, reliefUpdated) {
      commit("setReliefUpdated", reliefUpdated);
    },
    doNewCase({ commit }, newCase) {
      commit("setNewCase", newCase);
    },
    doCaseUpdated({ commit }, caseUpdated) {
      commit("setCaseUpdated", caseUpdated);
    },
    doSettle({ commit }, settle) {
      commit("setSettle", settle);
    },
    doSettleFiles({ commit }, settleFiles) {
      commit("setSettleFiles", settleFiles);
    },
    doSettleValid({ commit }, settleValid) {
      commit("setSettleValid", settleValid);
    },
    doNewSettle({ commit }, newSettle) {
      commit("setNewSettle", newSettle);
    },
    doSettleUpdated({ commit }, settleUpdated) {
      commit("setSettleUpdated", settleUpdated);
    },
    doSettleId({ commit }, settleId) {
      commit("setSettleId", settleId);
    },
    doCounterClaim({ commit }, counterClaim) {
      commit("setCounterClaim", counterClaim);
    },
    doProcessCounterClaim({ commit }, processCounterClaim) {
      commit("setProcessCounterClaim", processCounterClaim);
    },
    initCounterClaimId({ commit }, counterClaimId) {
      commit("setCounterClaimId", counterClaimId);
    },
    doNewCounterClaim({ commit }, newCounterClaim) {
      commit("setNewCounterClaim", newCounterClaim);
    },
    doCounterClaimUpdated({ commit }, counterClaimUpdated) {
      commit("setCounterClaimUpdated", counterClaimUpdated);
    },
    doArbitAlloc({ commit }, arbitAlloc) {
      commit("setArbitAlloc", arbitAlloc);
    },
    doArbitAllocs({ commit }, arbitAllocs) {
      commit("setArbitAllocs", arbitAllocs);
    },
    doArbitToken({ commit }, arbitToken) {
      commit("setArbitToken", arbitToken);
    },
    doResolution({ commit }, resolution) {
      commit("setResolution", resolution);
    },
    doResolutionId({ commit }, resolutionId) {
      commit("setResolutionId", resolutionId);
    },
    doResolutionFiles({ commit }, resolutionFiles) {
      commit("setResolutionFiles", resolutionFiles);
    },
    doResolutionValid({ commit }, resolutionValid) {
      commit("setResolutionValid", resolutionValid);
    },
    doNewResolution({ commit }, newResolution) {
      commit("setNewResolution", newResolution);
    },
    doResolutionUpdated({ commit }, resolutionUpdated) {
      commit("setResolutionUpdated", resolutionUpdated);
    },
    doDefenseCases({ commit }, defenseCases) {
      commit("setDefenseCases", defenseCases);
    },
    doBtnColorInvalid({ commit }, btnColor) {
      commit("setBtnColorInvalid", btnColor);
    },
    doCoDefendant1Valid({ commit }, coDefendant1Valid) {
      commit("setCoDefendant1Valid", coDefendant1Valid);
    },
    doCoDefendant2Valid({ commit }, coDefendant2Valid) {
      commit("setCoDefendant2Valid", coDefendant2Valid);
    },
    doCoDefendant3Valid({ commit }, coDefendant3Valid) {
      commit("setCoDefendant3Valid", coDefendant3Valid);
    },
    doCoDefendant4Valid({ commit }, coDefendant4Valid) {
      commit("setCoDefendant4Valid", coDefendant4Valid);
    },
    doCoDefendant5Valid({ commit }, coDefendant5Valid) {
      commit("setCoDefendant5Valid", coDefendant5Valid);
    },
    doCoDefFlags({ commit }, coDefFlags) {
      commit("setCoDefFlags", coDefFlags);
    },
    doCoDefendants({ commit }, coDefendants) {
      commit("setCoDefendants", coDefendants);
    },
    doMultiAccident({ commit }, multi) {
      commit("setMultiAccident", multi);
    },
    doHelpActive({ commit }, helpActive) {
      commit("setHelpActive", helpActive);
    },
    doViewStatus({ commit }, viewStatus) {
      commit("setViewStatus", viewStatus);
    },
    doCaseValid({ commit }, caseValid) {
      commit("setCaseValid", caseValid);
    },
    doTextLength({ commit }, textLength) {
      commit("setTextLength", textLength);
    },
    doValidates({ commit }, validates) {
      commit("setValidates", validates);
    },
    doDescClaim({ commit }, descClaim) {
      commit("setDescClaim", descClaim);
    },
    doMobileDevice({ commit }, mobileDevice) {
      commit("setMobileDevice", mobileDevice);
    },
    fixRoleId({ commit }, roleId) {
      commit("setRoleId", roleId);
    },
    fixRoleDesc({ commit }, roleDesc) {
      commit("setRoleDesc", roleDesc);
    },
    fixRoleCount({ commit }, roleCount) {
      commit("setRoleCount", roleCount);
    },
    fixDndRoles({ commit }, dndRoles) {
      commit("setDndRoles", dndRoles);
    },
    loadDialogData({ commit }, frm) {
      return new Promise((resolve, reject) => {
        if (frm.pos < 1) {
          reject("step must be > 0");
        }
        var dialogData = {};
        dialogData.modalHeader = "Can't Do -";
        dialogData.modalBody1 = `${frm.tab} form not valid`;
        dialogData.modalBody2 = `Complete ${frm.tab} form`;
        dialogData.modalBody3 = "And, Kool is the rool";
        commit("setDialogData", dialogData);

        resolve(this.state.dialogData);
      });
    },
    loadDialogTxtLen({ commit }, frm) {
      return new Promise((resolve, reject) => {
        if (frm.pos < 1) {
          reject("step must be > 0");
        }
        var dialogData = {};
        dialogData.modalHeader = "Can't Do -";
        dialogData.modalBody1 = `${frm.tab} Current text ${this.state.txtLen} characters`;
        dialogData.modalBody2 = `Text valid between ${this.state.min} and ${this.state.max} chars`;
        dialogData.modalBody3 = "And, Kool is the rool";
        commit("setDialogData", dialogData);

        resolve(this.state.dialogData);
      });
    },
    inconsistencyDialog({ commit }, obj) {
      return new Promise((resolve, reject) => {
        var dialogData = {};
        dialogData.modalHeader = "Can't Do -";
        dialogData.modalBody1 = `${obj.inValidPos} InValid ---- ${obj.validPos} valid`;
        dialogData.modalBody2 = `Cannot have invalid TAB followed by valid TAB! - fix`;
        dialogData.modalBody3 = "And, Kool is the rool";
        commit("setDialogData", dialogData);
        resolve(dialogData);
        if (!obj) reject("no dialog invalid obj");
      });
    },
    textLenErr({ commit }) {
      return new Promise((resolve, reject) => {
        var txtLen = this.state.textLength;
        if (txtLen < 0) {
          reject(-1);
        }
        if (txtLen > 0) {
          if (txtLen < this.state.min || txtLen > this.state.max) {
            commit("setTxtLen", txtLen);
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
    },
    checkForInconsistency({ commit }, obj) {
      var inValid = 0;
      var valid = 0;
      var validates = obj.validates;
      var len = obj.arrLen;
      return new Promise((resolve, reject) => {
        for (var l = 1; l < len; l++) {
          if (!validates[l]) {
            inValid = l;
            break;
          }
        }
        for (l = inValid; l < len; l++) {
          if (validates[l]) {
            valid = l;
          }
        }
        inValid = inValid === 0 ? validates.length - 1 : inValid;
        var obj = {
          inValidPos: inValid,
          validPos: valid
        };
        commit("setInconsistencyObj", obj);
        resolve(obj);
        if (!obj) reject("inconsistencyObj not created");
      });
    },
    async initClaimObjs({ commit }, obj) {
      var claimantId = obj.Claimant.id;
      var caseId = obj.Case.Id;
      await store.dispatch("findPocs");
      await store.dispatch("doCaseValid", false);

      await store.dispatch("initCaseId", caseId);
      await store.dispatch("initClaimantId", claimantId);
      await store.dispatch("doClaimantCaseValid", true);

      var findInstance = {
        url: `/locistatements/claimant/${claimantId}`,
        id: caseModels.LOCI
      };
      var loci = await store.dispatch("findObj", findInstance);
      if (loci) {
        await store.dispatch("doLociStandiValid", true);
      }
      await store.dispatch("doLociFiles", null);

      findInstance = {
        url: `/coastatements/claimant/${claimantId}`,
        id: caseModels.COA
      };
      var coa = await store.dispatch("findObj", findInstance);
      if (coa) {
        await store.dispatch("doCoaValid", true);
      }
      await store.dispatch("doCoaFiles", null);

      findInstance = {
        url: `/meritstatements/claimant/${claimantId}`,
        id: caseModels.MERITS
      };
      var merit = await store.dispatch("findObj", findInstance);
      if (merit) {
        await store.dispatch("doMeritValid", true);
      }
      await store.dispatch("doMeritFiles", null);

      findInstance = {
        url: `/quantumstatements/claimant/${claimantId}`,
        id: caseModels.QUANTUM
      };
      var quanta = await store.dispatch("findObj", findInstance);
      if (quanta) {
        await store.dispatch("doQuantaValid", true);
      }
      await store.dispatch("doQuantaFiles", null);

      findInstance = {
        url: `/reliefstatements/claimant/${claimantId}`,
        id: caseModels.RELIEF
      };
      var relief = await store.dispatch("findObj", findInstance);
      if (relief) {
        await store.dispatch("doReliefSoughtValid", true);
      }
      await store.dispatch("doReliefSoughtFiles", null);
      /*
      Promise.all()
        .then(values => { 
        commit('setClaimValues', values)
        console.log(values);
      })
        .catch(error => { 
          commit('setClaimValues', error.message)
          console.error(error.message)
      });*/
      commit("setClaimValues", "Claimant Loaded");
    },
    async initDefendObjs({ commit }, obj) {
      var defendantId = obj.Defendant.id;
      await store.dispatch("getAllCoys");

      var findInstance = {
        url: `/defensestatements/defendant/${defendantId}`,
        id: caseModels.DEFENSE
      };
      var defense = await store.dispatch("findObj", findInstance);
      if (defense) {
        await store.dispatch("doDefenseValid", true);
      }
      await store.dispatch("doDefenseFiles", []);

      findInstance = {
        url: `/settlestatements/defend/${defendantId}`,
        id: caseModels.SETTLE
      };
      var settle = await store.dispatch("findObj", findInstance);
      if (settle) {
        await store.dispatch("doSettleValid", true);
      }
      await store.dispatch("doSettleFiles", []);

      findInstance = {
        url: `/locistatementsDef/defend/${defendantId}`,
        id: caseModels.LOCIDEF
      };
      var lociDef = await store.dispatch("findObj", findInstance);
      if (lociDef) {
        await store.dispatch("doLociStandiDefValid", true);
      }
      await store.dispatch("doLociStandiDefFiles", []);
      commit("setClaimValues", "Defend Loaded");
    }
  },
  modules: {}
});
