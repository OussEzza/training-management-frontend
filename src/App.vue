<template>
  <div id="app" class="">
    <TheNav v-if="showNavbar"></TheNav>
    <router-view />
  </div>
</template>

<script>
import TheNav from "./components/MyNav.vue";

export default {
  name: "App",
  components: {
    TheNav,
  },
  data() {
    return {
      showNavbar: true,
    };
  },
  watch: {
    $route(to, from) {
      this.updateNavbarVisibility(to.path);
      console.log(from);
    },
  },
  created() {
    this.updateNavbarVisibility(this.$route.path);
  },
  methods: {
    updateNavbarVisibility(path) {
      this.showNavbar = !['/login'].includes(path);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
</style>
