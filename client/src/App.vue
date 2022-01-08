<template>
  <div id="app">
    <v-app
      ><v-app-bar color="primary" elevation="4" app>
        <v-toolbar-title
          >Group Calendar
          <v-icon>mdi-calendar-multiple</v-icon>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="redirectHome">Home</v-btn>
      </v-app-bar>
      <v-main><router-view /></v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    async redirectHome() {
      if (this.$route.name == "Home") {
        return;
      }
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
