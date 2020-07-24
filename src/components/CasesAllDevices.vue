<template>
  <div>
    <div v-if="isMobile">
      <CasesNavigation @change-view="changeView" />
    </div>
    <div :class="{ open: showNav, content: isMobile }">
      <div id="navigation-icon" v-if="isMobile" @click="showNav = !showNav">
        <font-awesome-icon icon="bars" class="icon" style="color:black" />
      </div>
      <CasesView :liabView="liabView" />
    </div>
  </div>
</template>
<script>
import CasesNavigation from "@/components/CasesNavigation.vue";
import CasesView from "@/components/Cases.vue";
export default {
  data: () => {
    return {
      showNav: false,
      liabView: false
    };
  },
  components: {
    CasesNavigation,
    CasesView
  },
  computed: {
    isMobile() {
      return this.$store.getters.isMobileDevice;
    }
  },
  methods: {
    changeView(e) {
      this.liabView = e;
      this.showNav = false;
    }
  }
};
</script>
<style>
body {
  width: 100%;
  height: 0;
  margin: 0;
  padding: 0;
  font-family: "Segoe UI", Tahoma;
  background-color: #fff;
}
.content {
  position: absolute;
  top: 0;
  width: calc(100% - 60px);
  height: calc(100vh - 60px);
  padding: 0;
  background-color: #fff;
  transition: 1s transform cubic-bezier(0, 0.12, 0.14, 1);
}
#navigation-icon {
  padding: 10px;
  margin-right: 10px;
  text-align: left;
  cursor: pointer;
}
.icon {
  font-size: 1.5rem;
}
.open {
  transform: translateX(300px);
}
</style>
